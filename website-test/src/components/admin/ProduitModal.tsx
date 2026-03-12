'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';
import { Produit } from '@/types/Produit';

interface ProduitModalProps {
  produit?: Produit | null;
  onClose: () => void;
  onRefresh: () => void;
}

// Label harmonisé avec le thème
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] text-argile/50 mb-1 ml-2 font-black uppercase tracking-widest block">
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
    // Overlay Argile avec flou
    <div className="fixed inset-0 bg-argile/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      
      {/* Container Modal : Fond Sand */}
      <div className="bg-sand border border-argile/10 p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter text-argile uppercase">
            {produit ? 'Modifier Produit' : 'Nouveau Produit'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-argile/10 rounded-full transition-all text-argile/50 hover:text-argile"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Zone Upload Image */}
          <div>
            <FieldLabel>Image du produit</FieldLabel>
            <div className="relative border-2 border-dashed border-argile/20 bg-white/50 rounded-2xl h-48 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-ocre/50 transition-colors">
              {previewUrl ? (
                <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-argile/30">
                  <Upload size={32} />
                  <span className="text-[10px] font-black uppercase">Cliquer pour uploader</span>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                if(e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </div>
          </div>

          {/* Nom du produit */}
          <div>
            <FieldLabel>Nom du produit</FieldLabel>
            <input 
              placeholder="EX: T-SHIRT OVERSIZE" 
              value={formData.name} 
              required 
              className="w-full bg-white border border-argile/20 p-4 rounded-xl font-bold uppercase text-argile focus:border-ocre/50 transition-colors shadow-sm outline-none" 
              onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Collection */}
            <div>
              <FieldLabel>Collection parente</FieldLabel>
              <select 
                value={formData.collection_id} 
                required 
                className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 transition-colors shadow-sm outline-none appearance-none"
                onChange={e => setFormData({...formData, collection_id: e.target.value})}
              >
                <option value="">CHOISIR...</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {/* Type */}
            <div>
              <FieldLabel>Type de pièce</FieldLabel>
              <input 
                placeholder="EX: T-SHIRT, POSTER" 
                value={formData.type} 
                className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 outline-none shadow-sm"
                onChange={e => setFormData({...formData, type: e.target.value.toUpperCase()})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prix */}
            <div>
              <FieldLabel>Prix (€)</FieldLabel>
              <input 
                type="number" 
                value={formData.prix} 
                className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 outline-none shadow-sm"
                onChange={e => setFormData({...formData, prix: parseFloat(e.target.value)})} 
              />
            </div>
            {/* Stock */}
            <div>
              <FieldLabel>Stock (Exemplaires)</FieldLabel>
              <input 
                type="number" 
                value={formData.exemplaires} 
                className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 outline-none shadow-sm"
                onChange={e => setFormData({...formData, exemplaires: parseInt(e.target.value)})} 
              />
            </div>
          </div>

          {/* Checkbox Sold Out */}
          <label className="flex items-center gap-3 bg-white/50 p-4 rounded-xl border border-argile/10 cursor-pointer hover:bg-white transition-colors">
            <input 
              type="checkbox" 
              checked={formData.sold_out} 
              onChange={e => setFormData({...formData, sold_out: e.target.checked})} 
              className="w-5 h-5 accent-ocre" 
            />
            <span className="text-xs font-black uppercase text-red-600">Marquer comme SOLD OUT</span>
          </label>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-argile/20 font-bold text-argile hover:bg-white transition-colors"
            >
              ANNULER
            </button>
            <button 
              disabled={uploading} 
              type="submit" 
              className="flex-[2] bg-ocre text-sand py-4 rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={20} /> : "ENREGISTRER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}