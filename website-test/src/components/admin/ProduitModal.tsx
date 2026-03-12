'use client';
import { useState, useEffect } from 'react';
import { X, Upload, Edit3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';
import { Produit } from '@/types/Produit';

interface ProduitModalProps {
  produit?: Produit | null;
  onClose: () => void;
  onRefresh: () => void;
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] text-zinc-500 mb-1 ml-2 font-bold uppercase tracking-widest block">
    {children}
  </label>
);

export default function ProduitModal({ produit, onClose, onRefresh }: ProduitModalProps) {
  const [uploading, setUploading] = useState(false);
  const [collections, setCollections] = useState<Pick<Collection, 'id' | 'name'>[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(produit?.image_url || null);

  const [formData, setFormData] = useState({
    name: produit?.name || '',
    type: produit?.type || '',
    mots_clefs: produit?.mots_clefs || '',
    prix: produit?.prix || 0,
    exemplaires: produit?.exemplaires || 1,
    sold_out: produit?.sold_out || false,
    collection_id: produit?.collection_id || ''
  });

  useEffect(() => {
    const fetchCollections = async () => {
      const { data } = await supabase.from('collections').select('id, name').order('name');
      if (data) {
        setCollections(data);
        if (!produit && data.length > 0 && !formData.collection_id) {
          setFormData(prev => ({ ...prev, collection_id: data[0].id.toString() }));
        }
      }
    };
    fetchCollections();
  }, [produit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = previewUrl;
      if (imageFile) {
        const fileName = `${Date.now()}-prod.${imageFile.name.split('.').pop()}`;
        const { error: upErr } = await supabase.storage.from('collections-pics').upload(fileName, imageFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('collections-pics').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const payload = { ...formData, image_url: finalImageUrl };
      const { error } = produit?.id 
        ? await supabase.from('produits').update(payload).eq('id', produit.id)
        : await supabase.from('produits').insert([payload]);

      if (error) throw error;
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter">
            {produit ? 'MODIFIER PRODUIT' : 'NOUVEAU PRODUIT'}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={28} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <FieldLabel>Image du produit</FieldLabel>
            <div className="relative border-2 border-dashed border-zinc-700 rounded-2xl h-40 flex items-center justify-center cursor-pointer overflow-hidden group">
              {previewUrl ? (
                <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
              ) : (
                <Upload className="text-zinc-500" />
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                if(e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </div>
          </div>

          <div>
            <FieldLabel>Nom du produit</FieldLabel>
            <input placeholder="NOM DU PRODUIT" value={formData.name} required className="w-full bg-black border border-zinc-800 p-4 rounded-xl font-bold uppercase focus:border-white transition-colors" 
              onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Collection parente</FieldLabel>
              <select value={formData.collection_id} required className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm focus:border-white transition-colors"
                onChange={e => setFormData({...formData, collection_id: e.target.value})}>
                <option value="">CHOISIR...</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Type de pièce</FieldLabel>
              <input placeholder="EX: T-SHIRT, POSTER" value={formData.type} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm focus:border-white"
                onChange={e => setFormData({...formData, type: e.target.value.toUpperCase()})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Prix (€)</FieldLabel>
              <input type="number" value={formData.prix} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm focus:border-white"
                onChange={e => setFormData({...formData, prix: parseFloat(e.target.value)})} />
            </div>
            <div>
              <FieldLabel>Stock (Exemplaires)</FieldLabel>
              <input type="number" value={formData.exemplaires} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm focus:border-white"
                onChange={e => setFormData({...formData, exemplaires: parseInt(e.target.value)})} />
            </div>
          </div>

          <label className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-zinc-800 cursor-pointer hover:bg-black/60 transition-colors">
            <input type="checkbox" checked={formData.sold_out} onChange={e => setFormData({...formData, sold_out: e.target.checked})} className="w-5 h-5 accent-white" />
            <span className="text-sm font-bold uppercase text-red-500">Marquer comme SOLD OUT</span>
          </label>

          <button disabled={uploading} type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black hover:bg-zinc-200 transition-all">
            {uploading ? "CHARGEMENT..." : "ENREGISTRER"}
          </button>
        </form>
      </div>
    </div>
  );
}