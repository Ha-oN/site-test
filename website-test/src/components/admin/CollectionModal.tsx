'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Calendar, Hash } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';

interface CollectionModalProps {
  collection: Collection | null;
  onClose: () => void;
  onRefresh: () => void;
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] text-argile/50 mb-1 ml-2 font-black uppercase tracking-widest block">
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
    theme_name: collection?.theme_name || 'default',
    nb_pieces: collection?.nb_pieces || 0, // Nouveau champ
    date_debut: collection?.date_debut || '',    // Nouveau champ
    date_fin: collection?.date_fin || ''         // Nouveau champ
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = previewUrl;

      if (imageFile) {
        const fileName = `${Date.now()}-coll.${imageFile.name.split('.').pop()}`;
        const { error: upErr } = await supabase.storage
          .from('collections-pics')
          .upload(fileName, imageFile);

        if (upErr) throw upErr;

        const { data } = supabase.storage.from('collections-pics').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const payload = { 
        name: formData.name,
        mots_clefs: formData.mots_clefs,
        theme_name: formData.theme_name,
        presentation_pic: finalImageUrl,
        nb_pieces: formData.nb_pieces, // Envoi à Supabase
        date_debut: formData.date_debut || null,
        date_fin: formData.date_fin || null
      };

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
    <div className="fixed inset-0 bg-argile/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-sand border border-argile/10 p-8 rounded-3xl w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black italic tracking-tighter text-argile uppercase">
            {collection ? 'Modifier Collection' : 'Nouvelle Collection'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-argile/10 rounded-full text-argile/50 hover:text-argile">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zone Upload Image */}
          <div>
            <FieldLabel>Photo d'exposition</FieldLabel>
            <div className="relative border-2 border-dashed border-argile/20 bg-white/50 rounded-2xl h-48 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-ocre/50 transition-colors">
              {previewUrl ? (
                <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-argile/30">
                  <Upload size={32} />
                  <span className="text-[10px] font-black uppercase">Cliquer pour parcourir</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={e => {
                  if(e.target.files?.[0]) {
                    setImageFile(e.target.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }} 
              />
            </div>
          </div>

          {/* Nom & Nombre de pièces */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FieldLabel>Nom du projet</FieldLabel>
              <input 
                required
                value={formData.name} 
                placeholder="EX: TOKYO NIGHTS"
                className="w-full bg-white border border-argile/20 p-4 rounded-xl font-bold uppercase text-argile focus:border-ocre/50 outline-none shadow-sm"
                onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} 
              />
            </div>
            <div>
              <FieldLabel>Nb Pièces</FieldLabel>
              <input 
                type="number"
                value={formData.nb_pieces} 
                className="w-full bg-white border border-argile/20 p-4 rounded-xl font-bold text-argile focus:border-ocre/50 outline-none shadow-sm"
                onChange={e => setFormData({...formData, nb_pieces: parseInt(e.target.value)})} 
              />
            </div>
          </div>

          {/* Dates de début et fin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Date de début</FieldLabel>
              <input 
                type="date"
                value={formData.date_debut} 
                className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 outline-none shadow-sm"
                onChange={e => setFormData({...formData, date_debut: e.target.value})} 
              />
            </div>
            <div>
              <FieldLabel>Date de fin</FieldLabel>
              <input 
                type="date"
                value={formData.date_fin} 
                className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 outline-none shadow-sm"
                onChange={e => setFormData({...formData, date_fin: e.target.value})} 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <FieldLabel>Description / Mots clefs</FieldLabel>
            <input 
              value={formData.mots_clefs} 
              placeholder="Minimalisme, Urbain, Noir & Blanc"
              className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 outline-none shadow-sm"
              onChange={e => setFormData({...formData, mots_clefs: e.target.value})} 
            />
          </div>

          {/* Thème */}
          <div>
            <FieldLabel>Thème visuel</FieldLabel>
            <select 
              value={formData.theme_name}
              className="w-full bg-white border border-argile/20 p-4 rounded-xl text-sm text-argile focus:border-ocre/50 outline-none shadow-sm appearance-none"
              onChange={e => setFormData({...formData, theme_name: e.target.value})}
            >
              <option value="default">DÉFAUT (SABLE)</option>
              <option value="japon">JAPON (MATCHA)</option>
              <option value="dark">DARK EDITION</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl border border-argile/20 font-bold text-argile hover:bg-white transition-colors">
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