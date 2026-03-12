'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, LogOut, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Collection } from '@/types/Collection';

// Importation de tes nouveaux composants
import LoginForm from '@/components/admin/LoginForm';
import AdminCollectionCard from '@/components/admin/AdminCollectionCard';
import CollectionModal from '@/components/admin/CollectionModal';

export default function AdminPage() {
  const router = useRouter();
  
  // États de base
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  
  // États pour la Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

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
    const { data } = await supabase.from('collections')
      .select('*')
      .order('id', { ascending: false });
    if (data) setCollections(data as Collection[]);
  };

  const handleDelete = async (id: number) => {
    await supabase.from('collections').delete().eq('id', id);
    fetchCollections();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center text-white font-black italic">
      CHARGEMENT...
    </div>
  );

  // 1. Affichage du formulaire de connexion si pas admin
  if (!session || !isAdmin) {
    return <LoginForm onSuccess={(session) => { setSession(session); setIsAdmin(true); fetchCollections(); }} />;
  }

  // 2. Affichage du Dashboard Admin
  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-8 gap-4">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">COLLECTIONS MGR</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">{session.user.email} (ADMIN)</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/')} className="px-5 py-3 rounded-full border border-zinc-800 bg-zinc-900 flex items-center gap-2 font-bold hover:bg-zinc-800 transition-colors">
            <Home size={18}/> SITE
          </button>
          <button 
            onClick={() => { setSelectedCollection(null); setIsModalOpen(true); }} 
            className="px-5 py-3 rounded-full bg-white text-black flex items-center gap-2 font-bold transition-transform hover:scale-105"
          >
            <Plus size={18}/> NOUVELLE
          </button>
          <button onClick={handleLogout} className="px-5 py-3 rounded-full border border-red-900/30 text-red-500 bg-red-950/20 font-bold hover:bg-red-950/40 transition-colors">
            <LogOut size={18}/>
          </button>
        </div>
      </div>

      {/* Liste des Collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((col) => (
          <AdminCollectionCard 
            key={col.id} 
            collection={col} 
            onEdit={(c) => { setSelectedCollection(c); setIsModalOpen(true); }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal unique pour Création et Édition */}
      {isModalOpen && (
        <CollectionModal 
          collection={selectedCollection} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={fetchCollections} 
        />
      )}
    </div>
  );
}