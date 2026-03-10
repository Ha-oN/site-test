'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, LayoutDashboard, X, Loader2, Upload, Calendar, Hash, Tag } from 'lucide-react';

interface Collection {
  id?: number;
  name: string;
  mots_clefs: string;
  date_debut: string;
  date_fin: string;
  nb_pieces: number;
  active: boolean;
  presentation_pic: string;
}

export default function AdminPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initialForm = {
    name: '',
    mots_clefs: '',
    date_debut: '',
    date_fin: '',
    nb_pieces: 0,
    active: true,
    presentation_pic: ''
  };

  const [formData, setFormData] = useState<Collection>(initialForm);

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Erreur fetch:", error.message);
    if (data) setCollections(data);
    setLoading(false);
  };

  useEffect(() => { 
    fetchCollections(); 
  }, []);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // --- LOGIQUE D'UPLOAD CORRIGÉE (MAJUSCULES) ---
  const uploadToStorage = async (fileToUpload: File) => {
    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // On utilise collections-pics partout pour éviter les erreurs de bucket
    const { error: uploadError } = await supabase.storage
      .from('collections-pics')
      .upload(fileName, fileToUpload);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('collections-pics')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = formData.presentation_pic;
      
      if (file) {
        finalImageUrl = await uploadToStorage(file);
      } else if (!finalImageUrl) {
        throw new Error("Veuillez sélectionner une image.");
      }

      const { error } = await supabase
        .from('collections')
        .insert([{ ...formData, presentation_pic: finalImageUrl }]);

      if (error) throw error;

      setIsModalOpen(false);
      setFile(null);
      setPreviewUrl(null);
      setFormData(initialForm);
      fetchCollections();
      alert("Collection créée avec succès !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteCollection = async (id: number, imageUrl: string) => {
    if (confirm("Supprimer cette collection définitivement ?")) {
      try {
        // Optionnel : Supprimer l'image du storage aussi
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('collections-pics').remove([fileName]);
        }

        const { error } = await supabase.from('collections').delete().eq('id', id);
        if (error) throw error;
        
        fetchCollections();
      } catch (err: any) {
        alert("Erreur suppression: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3 italic tracking-tighter uppercase">
              <LayoutDashboard className="text-blue-600" size={36} /> Dashboard
            </h1>
            <p className="text-zinc-500 font-medium ml-1">Gestion de votre boutique</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:scale-105 transition-all active:scale-95 shadow-xl"
          >
            <Plus size={20} /> Nouvelle Collection
          </button>
        </div>

        {/* LISTE DES COLLECTIONS */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col) => (
              <div key={col.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-300">
                <div className="h-56 relative overflow-hidden">
                  <img src={col.presentation_pic} alt={col.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur dark:bg-zinc-800/90 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                    {col.nb_pieces} pièces
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold tracking-tight">{col.name}</h3>
                    <button 
                      onClick={() => col.id && deleteCollection(col.id, col.presentation_pic)} 
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-4">
                    {col.mots_clefs.split(',').map((tag, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-widest font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-400">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODALE FORMULAIRE */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Nouvelle Collection</h2>
                <button onClick={() => setIsModalOpen(false)} className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* ZONE D'UPLOAD */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]); }}
                  className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer
                    ${previewUrl ? 'border-blue-500 bg-blue-50/30' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} />
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-48 object-cover rounded-2xl shadow-lg" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 text-blue-600" size={40} />
                      <p className="font-bold">Image de couverture</p>
                      <p className="text-xs text-zinc-500 font-medium italic">Glissez-déposez ici</p>
                    </div>
                  )}
                </div>

                {/* INFOS GÉNÉRALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase ml-2 text-zinc-400 flex items-center gap-2 tracking-widest"><Tag size={12}/> Nom</label>
                    <input required type="text" placeholder="ÉTÉ 2024" className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 font-bold outline-none focus:ring-2 ring-blue-500 transition-all"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase ml-2 text-zinc-400 flex items-center gap-2 tracking-widest"><Hash size={12}/> Tags</label>
                    <input type="text" placeholder="soie, luxe, robe" className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 ring-blue-500 transition-all"
                      value={formData.mots_clefs} onChange={e => setFormData({...formData, mots_clefs: e.target.value})} />
                  </div>
                </div>

                {/* DATES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase ml-2 text-zinc-400 flex items-center gap-2 tracking-widest"><Calendar size={12}/> Début</label>
                    <input type="date" className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none"
                      onChange={e => setFormData({...formData, date_debut: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase ml-2 text-zinc-400 flex items-center gap-2 tracking-widest"><Calendar size={12}/> Fin</label>
                    <input type="date" className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none"
                      onChange={e => setFormData({...formData, date_fin: e.target.value})} />
                  </div>
                </div>

                {/* STATISTIQUES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase ml-2 text-zinc-400 tracking-widest">Nb de pièces</label>
                    <input type="number" placeholder="0" className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none"
                      onChange={e => setFormData({...formData, nb_pieces: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <input type="checkbox" id="active" checked={formData.active} className="w-6 h-6 rounded-lg text-blue-600 focus:ring-0"
                      onChange={e => setFormData({...formData, active: e.target.checked})} />
                    <label htmlFor="active" className="font-bold cursor-pointer select-none">Mise en ligne</label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading} 
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-500 text-white rounded-[1.5rem] font-black text-xl tracking-tighter uppercase transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  {uploading ? <Loader2 className="animate-spin mx-auto" size={28} /> : "Enregistrer la collection"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}