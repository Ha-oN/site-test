'use client';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';

interface CollectionModalProps {
  collection?: Collection | null; // Si présent = mode édition
  onClose: () => void;
  onRefresh: () => void;
}

export default function CollectionModal({ collection, onClose, onRefresh }: CollectionModalProps) {
  const BUCKET_NAME = 'collections-pics';
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(collection?.presentation_pic || null);

  const [formData, setFormData] = useState({
    name: collection?.name || '',
    mots_clefs: collection?.mots_clefs || '',
    date_debut: collection?.date_debut || new Date().toISOString().split('T')[0],
    date_fin: collection?.date_fin || '',
    nb_pieces: collection?.nb_pieces || 0,
    active: collection?.active || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalPicUrl = previewUrl;
      
      // 1. Upload image si nouvelle
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from(BUCKET_NAME).upload(fileName, imageFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        finalPicUrl = urlData.publicUrl;
      }

      const payload = { ...formData, presentation_pic: finalPicUrl };

      // 2. Insert ou Update
      const { error } = collection?.id 
        ? await supabase.from('collections').update(payload).eq('id', collection.id)
        : await supabase.from('collections').insert([payload]);

      if (error) throw error;

      onRefresh();
      onClose();
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter">
            {collection ? 'MODIFIER' : 'CRÉER'}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropzone Image */}
          <div className="relative border-2 border-dashed border-zinc-700 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
            {previewUrl ? (
              <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30" />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto mb-2 text-zinc-500" />
                <p className="text-xs text-zinc-500 uppercase font-bold">Image de couverture</p>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }} 
            />
          </div>

          <div className="space-y-4">
            <input 
              placeholder="NOM DE LA COLLECTION" 
              value={formData.name} 
              required 
              className="w-full bg-black border border-zinc-800 p-4 rounded-xl font-bold uppercase focus:border-white transition-colors" 
              onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} 
            />
            
            <input 
              placeholder="MOTS CLÉS (SÉPARÉS PAR DES VIRGULES)" 
              value={formData.mots_clefs} 
              className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm focus:border-white transition-colors" 
              onChange={e => setFormData({...formData, mots_clefs: e.target.value})} 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 ml-2 font-bold uppercase tracking-widest">Date Début</label>
                <input 
                  type="date" 
                  value={formData.date_debut} 
                  className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm" 
                  onChange={e => setFormData({...formData, date_debut: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 ml-2 font-bold uppercase tracking-widest">Nb Pièces</label>
                <input 
                  type="number" 
                  value={formData.nb_pieces} 
                  className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm" 
                  onChange={e => setFormData({...formData, nb_pieces: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>

            <label className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-zinc-800 cursor-pointer hover:bg-black/60 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.active} 
                onChange={e => setFormData({...formData, active: e.target.checked})} 
                className="w-5 h-5 accent-white" 
              />
              <span className="text-sm font-bold uppercase">Visible sur le carrousel</span>
            </label>
          </div>

          <button 
            disabled={uploading} 
            type="submit" 
            className="w-full bg-white text-black py-5 rounded-2xl font-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {uploading ? "CHARGEMENT..." : "ENREGISTRER"}
          </button>
        </form>
      </div>
    </div>
  );
}