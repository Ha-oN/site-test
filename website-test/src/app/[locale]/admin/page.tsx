'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, LogOut, Home, Package, FolderOpen, Edit3, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Collection } from '@/types/Collection';
import { Produit } from '@/types/Produit';

import LoginForm from '@/components/admin/LoginForm';
import AdminCollectionCard from '@/components/admin/AdminCollectionCard';
import CollectionModal from '@/components/admin/CollectionModal';
import ProduitModal from '@/components/admin/ProduitModal';

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'collections' | 'produits'>('collections');

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const [produits, setProduits] = useState<Produit[]>([]);
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user.app_metadata?.role === 'admin') {
      setSession(session);
      setIsAdmin(true);
      fetchCollections();
      fetchProduits();
    }
    setLoading(false);
  }

  const fetchCollections = async () => {
    const { data } = await supabase.from('collections').select('*').order('id', { ascending: false });
    if (data) setCollections(data as Collection[]);
  };

  const fetchProduits = async () => {
    const { data } = await supabase.from('produits').select('*').order('id', { ascending: false });
    if (data) setProduits(data as Produit[]);
  };

  const handleDeleteCollection = async (id: number) => {
    if(confirm("Supprimer cette collection ?")) {
        await supabase.from('collections').delete().eq('id', id);
        fetchCollections();
    }
  };

  const handleDeleteProduit = async (id: number) => {
    if(confirm("Supprimer ce produit ?")) {
        await supabase.from('produits').delete().eq('id', id);
        fetchProduits();
    }
  };

  // 1. Loader harmonisé (Fond Sand au lieu de Noir)
  if (loading) return <div className="h-screen bg-sand flex items-center justify-center text-argile italic font-black">CHARGEMENT...</div>;

  if (!session || !isAdmin) return <LoginForm onSuccess={() => checkUser()} />;

  return (
    <div className="min-h-screen bg-sand text-argile p-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-argile/20 pb-8 gap-4">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-argile">Dashboard</h1>
          <p className="text-argile/60 text-xs mt-2 font-bold tracking-widest">{session.user.email}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/')} className="px-5 py-3 rounded-full border border-argile/20 bg-white/50 flex items-center gap-2 font-bold hover:bg-white transition-colors text-sm text-argile">
            <Home size={16}/> SITE
          </button>
          <button 
            onClick={() => {
              if (activeTab === 'collections') { setSelectedCollection(null); setIsColModalOpen(true); }
              else { setSelectedProduit(null); setIsProdModalOpen(true); }
            }} 
            className="px-6 py-3 rounded-full bg-ocre text-sand flex items-center gap-2 font-black transition-transform hover:scale-105 text-sm"
          >
            <Plus size={18}/> {activeTab === 'collections' ? 'COLLECTION' : 'PRODUIT'}
          </button>
          <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="px-5 py-3 rounded-full border border-red-200 text-red-600 bg-red-50 font-bold hover:bg-red-100 transition-colors">
            <LogOut size={16}/>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex gap-10 mb-10 border-b border-argile/10">
        <button 
          onClick={() => setActiveTab('collections')}
          className={`pb-4 flex items-center gap-2 font-black italic tracking-tighter transition-all ${activeTab === 'collections' ? 'text-ocre border-b-2 border-ocre scale-105' : 'text-argile/40 hover:text-argile'}`}
        >
          <FolderOpen size={18} /> COLLECTIONS
        </button>
        <button 
          onClick={() => setActiveTab('produits')}
          className={`pb-4 flex items-center gap-2 font-black italic tracking-tighter transition-all ${activeTab === 'produits' ? 'text-ocre border-b-2 border-ocre scale-105' : 'text-argile/40 hover:text-argile'}`}
        >
          <Package size={18} /> PRODUITS
        </button>
      </div>

      {/* GRID CONTENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeTab === 'collections' ? (
          collections.map((col) => (
            <AdminCollectionCard 
              key={col.id} 
              collection={col} 
              onEdit={(c) => { setSelectedCollection(c); setIsColModalOpen(true); }}
              onDelete={handleDeleteCollection}
            />
          ))
        ) : (
          produits.map((prod) => (
            /* Card Produit harmonisée : bg-white avec bordures argile */
            <div key={prod.id} className="group bg-white rounded-2xl overflow-hidden border border-argile/10 hover:border-ocre/30 transition-all shadow-sm">
              <div className="relative h-48 overflow-hidden bg-sand">
                <img src={prod.image_url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={prod.name} />
                {prod.sold_out && (
                  <div className="absolute inset-0 bg-ocre/20 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-ocre text-sand text-[10px] font-black px-3 py-1 rounded-full uppercase">Sold Out</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-black uppercase truncate text-sm text-argile">{prod.name}</h3>
                <p className="text-[10px] text-argile/50 font-bold mt-1 uppercase tracking-widest">{prod.type} — {prod.prix}€</p>
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-argile/10">
                   <span className="text-[9px] text-argile/50 font-bold italic uppercase">{prod.exemplaires} EN STOCK</span>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => { setSelectedProduit(prod); setIsProdModalOpen(true); }} 
                       className="p-2 bg-sand text-argile/60 rounded-lg hover:bg-ocre hover:text-sand transition-colors"
                     >
                       <Edit3 size={14}/>
                     </button>
                     <button 
                       onClick={() => handleDeleteProduit(prod.id)} 
                       className="p-2 bg-sand text-argile/60 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                     >
                       <Trash2 size={14}/>
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODALS */}
      {isColModalOpen && <CollectionModal collection={selectedCollection} onClose={() => setIsColModalOpen(false)} onRefresh={fetchCollections} />}
      {isProdModalOpen && <ProduitModal produit={selectedProduit} onClose={() => setIsProdModalOpen(false)} onRefresh={fetchProduits} />}
    </div>
  );
}