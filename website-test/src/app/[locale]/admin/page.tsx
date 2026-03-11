'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit3, X, Upload, Plus, LogOut, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const BUCKET_NAME = 'collections-pics';

  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form States alignés sur votre SQL
  const [formData, setFormData] = useState({
    name: '',
    mots_clefs: '',
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: '',
    nb_pieces: 0,
    active: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      mots_clefs: '',
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: '',
      nb_pieces: 0,
      active: false
    });
    setImageFile(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user.app_metadata?.role === 'admin') {
      setSession(session);
      setIsAdmin(true);
      fetchCollections();
    }
    setLoading(false);
  }

  const fetchCollections = async () => {
    const { data, error } = await supabase.from('collections').select('*').order('id', { ascending: false });
    if (data) setCollections(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError("Erreur : " + error.message);
    } else if (data.user?.app_metadata?.role === 'admin') {
      setSession(data.session);
      setIsAdmin(true);
      fetchCollections();
    } else {
      setAuthError("Accès refusé : Admin uniquement.");
      await supabase.auth.signOut();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId && !imageFile) {
      alert("Veuillez ajouter une image de présentation.");
      return;
    }

    setUploading(true);
    try {
      let finalPicUrl = previewUrl;
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from(BUCKET_NAME).upload(fileName, imageFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        finalPicUrl = urlData.publicUrl;
      }

      // PAYLOAD CALIBRÉ SUR VOTRE SCHÉMA SQL
      const payload = {
        name: formData.name,
        mots_clefs: formData.mots_clefs,
        presentation_pic: finalPicUrl,
        date_debut: formData.date_debut || null,
        date_fin: formData.date_fin || null,
        nb_pieces: formData.nb_pieces,
        active: formData.active
      };

      let result;
      if (editingId) {
        result = await supabase.from('collections').update(payload).eq('id', editingId);
      } else {
        result = await supabase.from('collections').insert([payload]);
      }

      if (result.error) throw result.error;

      alert("Collection enregistrée !");
      setIsModalOpen(false);
      resetForm();
      fetchCollections();
    } catch (error: any) {
      console.error("Erreur:", error);
      alert("Erreur base de données : " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">Chargement...</div>;

  if (!session || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <form onSubmit={handleLogin} className="p-8 border border-zinc-800 rounded-3xl w-full max-w-md bg-zinc-900/50">
          <h1 className="text-3xl font-black italic mb-6 text-center">ADMIN ACCESS</h1>
          {authError && <p className="text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-sm mb-4 text-center">{authError}</p>}
          <input type="email" placeholder="EMAIL" className="w-full p-4 mb-3 bg-black border border-zinc-800 rounded-xl" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="PASSWORD" className="w-full p-4 mb-6 bg-black border border-zinc-800 rounded-xl" onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-white text-black py-4 rounded-xl font-black">CONNEXION</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-8 gap-4">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">COLLECTIONS MGR</h1>
          <p className="text-zinc-500 text-sm mt-2">{session.user.email}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/')} className="px-5 py-3 rounded-full border border-zinc-800 bg-zinc-900 flex items-center gap-2 font-bold"><Home size={18}/> SITE</button>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-5 py-3 rounded-full bg-white text-black flex items-center gap-2 font-bold transition-transform hover:scale-105"><Plus size={18}/> NOUVELLE</button>
          <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="px-5 py-3 rounded-full border border-red-900/30 text-red-500 bg-red-950/20 font-bold"><LogOut size={18}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((col) => (
          <div key={col.id} className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800">
            <img src={col.presentation_pic} className="w-full h-52 object-cover opacity-70 group-hover:opacity-100" alt="" />
            <div className="p-5">
              <h3 className="font-black uppercase truncate">{col.name}</h3>
              <div className="flex justify-between mt-4">
                <span className="text-xs text-zinc-500 font-bold">{col.nb_pieces} PIÈCES</span>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingId(col.id);
                    setFormData({
                      name: col.name || '',
                      mots_clefs: col.mots_clefs || '',
                      date_debut: col.date_debut || '',
                      date_fin: col.date_fin || '',
                      nb_pieces: col.nb_pieces || 0,
                      active: col.active || false
                    });
                    setPreviewUrl(col.presentation_pic);
                    setIsModalOpen(true);
                  }} className="p-2 bg-zinc-800 rounded-lg hover:bg-white hover:text-black transition-colors"><Edit3 size={16}/></button>
                  <button onClick={async () => {
                    if(confirm("Supprimer ?")) {
                       await supabase.from('collections').delete().eq('id', col.id);
                       fetchCollections();
                    }
                  }} className="p-2 bg-zinc-800 rounded-lg hover:bg-red-600 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic">{editingId ? 'MODIFIER' : 'CRÉER'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={28} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative border-2 border-dashed border-zinc-700 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                {previewUrl ? <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-zinc-500" /><p className="text-xs text-zinc-500">Image</p></div>}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImageFile(e.target.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }} />
              </div>

              <div className="space-y-4">
                <input placeholder="NOM" value={formData.name} required className="w-full bg-black border border-zinc-800 p-4 rounded-xl font-bold uppercase" onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} />
                <input placeholder="MOTS CLÉS" value={formData.mots_clefs} className="w-full bg-black border border-zinc-800 p-4 rounded-xl" onChange={e => setFormData({...formData, mots_clefs: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 mb-1 ml-2">DATE DÉBUT</label>
                    <input type="date" value={formData.date_debut} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm" onChange={e => setFormData({...formData, date_debut: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 mb-1 ml-2">NB PIÈCES</label>
                    <input type="number" value={formData.nb_pieces} className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm" onChange={e => setFormData({...formData, nb_pieces: parseInt(e.target.value) || 0})} />
                  </div>
                </div>

                <label className="flex items-center gap-3 bg-black/40 p-4 rounded-xl border border-zinc-800 cursor-pointer">
                  <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 accent-white" />
                  <span className="text-sm font-bold uppercase">Collection Active (Carousel)</span>
                </label>
              </div>

              <button disabled={uploading} type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black">
                {uploading ? "CHARGEMENT..." : "ENREGISTRER"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}