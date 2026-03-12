'use client';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';

interface CollectionModalProps {
  collection?: Collection | null;
  onClose: () => void;
  onRefresh: () => void;
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] text-zinc-500 mb-1 ml-2 font-bold uppercase tracking-widest block">
    {children}
  </label>
);

export default function CollectionModal({ collection, onClose, onRefresh }: CollectionModalProps) {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(collection?.presentation_pic || null);

  const [formData, setFormData] = useState({
    name: collection?.name || '',
    mots_clefs: collection?.mots_clefs || '',
    date_debut: collection?.date_debut || new Date().toISOString().split('T')[0],
    nb_pieces: collection?.nb_pieces || 0,
    active: collection?.active || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalPicUrl = previewUrl;
      if (imageFile) {
        const fileName = `${Date.now()}-col.${imageFile.name.split('.').pop()}`;
        await supabase.storage.from('collections-pics').upload(fileName, imageFile);
        const { data } = supabase.storage.from('collections-pics').getPublicUrl(fileName);
        finalPicUrl = data.publicUrl;
      }

      const payload = { ...formData, presentation_pic: finalPicUrl };
      const { error } = collection?.id 
        ? await supabase.from('collections').update(payload).eq('id', collection.id)
        : await supabase.from('collections').insert([payload]);

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
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">{collection ? 'Modifier' : 'Nouvelle'}</h2>
          <button onClick={onClose}><X size={28} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <FieldLabel>Image de présentation</FieldLabel>
            <div className="relative border-2 border-dashed border-zinc-700 rounded-2xl h-44 flex items-center justify-center cursor-pointer overflow-hidden group">
              {previewUrl ? <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <Upload className="text-zinc-500" />}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                if(e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </div>
          </div>

          <div>
            <FieldLabel>Nom de la collection</FieldLabel>
            <input placeholder="NOM" value={formData.name} required className="w-full bg-black border border-zinc-800 p-4 rounded-xl font-bold uppercase focus:border-white" 
              onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} />
          </div>

          <div>
            <FieldLabel>Mots clés / Description</FieldLabel>
            <input placeholder="EX: VINTAGE, STREETWEAR" value={formData.mots_clefs} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm" 
              onChange={e => setFormData({...formData, mots_clefs: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Date de début</FieldLabel>
              <input type="date" value={formData.date_debut} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm" 
                onChange={e => setFormData({...formData, date_debut: e.target.value})} />
            </div>
            <div>
              <FieldLabel>Nombre de pièces</FieldLabel>
              <input type="number" value={formData.nb_pieces} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm" 
                onChange={e => setFormData({...formData, nb_pieces: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <label className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-zinc-800 cursor-pointer">
            <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 accent-white" />
            <span className="text-sm font-bold uppercase">Collection Active (Carousel)</span>
          </label>

          <button disabled={uploading} type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black">
            {uploading ? "CHARGEMENT..." : "ENREGISTRER"}
          </button>
        </form>
      </div>
    </div>
  );
}