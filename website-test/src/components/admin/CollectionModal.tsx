'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';

interface CollectionModalProps {
  collection: Collection | null;
  onClose: () => void;
  onRefresh: () => void;
}

export default function CollectionModal({ collection, onClose, onRefresh }: CollectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mots_clefs: '',
    image_url: '',
    theme: 'default'
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        mots_clefs: collection.mots_clefs || '',
        image_url: collection.presentation_pic,
        theme: collection.theme_name || 'default'
      });
    }
  }, [collection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: formData.name,
      mots_clefs: formData.mots_clefs,
      image_url: formData.image_url,
      theme: formData.theme
    };

    if (collection) {
      await supabase.from('collections').update(data).eq('id', collection.id);
    } else {
      await supabase.from('collections').insert([data]);
    }

    setLoading(false);
    onRefresh();
    onClose();
  };

  return (
    // Overlay avec flou et couleur Argile transparente
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-argile/40 backdrop-blur-sm">
      
      {/* Container Modal : Fond Sand */}
      <div className="bg-sand w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-argile/10 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-argile/10 flex justify-between items-center bg-white/50">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-argile">
            {collection ? 'Modifier Collection' : 'Nouvelle Collection'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-argile/10 rounded-full transition-colors text-argile/50 hover:text-argile"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Nom */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-argile/50 ml-1">Nom du projet</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-argile/20 rounded-2xl px-5 py-4 text-argile placeholder:text-argile/30 focus:outline-none focus:border-ocre/50 transition-colors shadow-sm"
              placeholder="Ex: JAPON 2024"
            />
          </div>

          {/* Mots Clefs */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-argile/50 ml-1">Mots clefs / Description</label>
            <input
              type="text"
              value={formData.mots_clefs}
              onChange={(e) => setFormData({ ...formData, mots_clefs: e.target.value })}
              className="w-full bg-white border border-argile/20 rounded-2xl px-5 py-4 text-argile placeholder:text-argile/30 focus:outline-none focus:border-ocre/50 transition-colors shadow-sm"
              placeholder="Ex: Minimalisme, Sérénité, Tradition"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-argile/50 ml-1">URL de la couverture</label>
            <div className="relative">
              <input
                required
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-white border border-argile/20 rounded-2xl px-5 py-4 text-argile placeholder:text-argile/30 focus:outline-none focus:border-ocre/50 transition-colors shadow-sm"
                placeholder="https://..."
              />
              <Upload className="absolute right-5 top-1/2 -translate-y-1/2 text-argile/20" size={18} />
            </div>
          </div>

          {/* Choix du Thème */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-argile/50 ml-1">Thème visuel</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full bg-white border border-argile/20 rounded-2xl px-5 py-4 text-argile focus:outline-none focus:border-ocre/50 transition-colors shadow-sm appearance-none"
            >
              <option value="default">Défaut (Sable)</option>
              <option value="japon">Japon (Matcha & Sakura)</option>
              <option value="dark">Dark Edition</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-argile/20 font-bold text-argile hover:bg-white transition-colors"
            >
              ANNULER
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-[2] bg-ocre text-sand rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (collection ? 'METTRE À JOUR' : 'CRÉER LA COLLECTION')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}