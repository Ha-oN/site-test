"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Produit } from '@/types/Produit';
import type { Collection } from '@/types/Collection';

export default function SalesPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [cart, setCart] = useState<{produit: Produit, quantity: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    const [prodRes, collRes] = await Promise.all([
      supabase.from('produits').select('*').gt('exemplaires', 0).eq('sold_out', false).order('name'),
      supabase.from('collections').select('*').order('name')
    ]);
    if (prodRes.data) setProduits(prodRes.data);
    if (collRes.data) setCollections(collRes.data);
  }

  const filteredProduits = produits.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === "all" || p.collection_id?.toString() === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  const addToCart = (p: Produit) => {
    setCart(prev => {
      const existing = prev.find(item => item.produit.id === p.id);
      if (existing) {
        if (existing.quantity >= p.exemplaires) return prev;
        return prev.map(item => item.produit.id === p.id ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, { produit: p, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.produit.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(0, Math.min(newQty, item.produit.exemplaires)) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + (item.produit.prix * item.quantity), 0);

  const handleFinalizeSale = async (method: 'ESPECES' | 'CARTE') => {
    if (cart.length === 0) return;
    
    const confirmMsg = method === 'ESPECES' 
      ? `Confirmer l'encaissement de ${calculateTotal().toFixed(2)}€ en espèces ?`
      : `Confirmer le paiement par carte de ${calculateTotal().toFixed(2)}€ ?`;

    if (!confirm(confirmMsg)) return;

    setLoading(true);
    const { error } = await supabase.rpc('process_sale', { 
      items_list: cart.map(item => ({ id: item.produit.id, quantity: item.quantity })), 
      total_amount: calculateTotal(),
      p_method: method 
    });

    if (!error) {
      alert(`Vente enregistrée (${method}) !`);
      setCart([]);
      fetchInitialData();
    } else {
      alert("Erreur: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-black overflow-hidden font-sans">
      
      {/* SECTION CATALOGUE (MAJEURE PARTIE) */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Caisse</h1>
          <div className="flex gap-2 w-full md:w-2/3">
            <input 
              type="text"
              placeholder="🔍 Nom du produit..."
              className="flex-1 p-3 rounded-xl shadow-inner bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="p-3 rounded-xl bg-white shadow-sm outline-none"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <option value="all">Toutes Collections</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* GRILLE PRODUITS AVEC IMAGES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProduits.map(p => (
            <button 
              key={p.id} 
              onClick={() => addToCart(p)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col border border-transparent hover:border-blue-500"
            >
              <div className="h-32 w-full bg-gray-200 overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">Pas d'image</div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="font-bold text-sm line-clamp-2">{p.name}</div>
                  <div className="text-[10px] text-gray-400 uppercase">{p.type}</div>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-lg font-black text-blue-600">{p.prix}€</span>
                  <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">STOCK: {p.exemplaires}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION PANIER FIXE */}
      <div className="w-[400px] bg-white border-l flex flex-col shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Détails Vente</h2>
          <button onClick={() => setCart([])} className="text-xs text-red-500 hover:underline">Vider</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-sm">
              Panier vide
            </div>
          ) : (
            cart.map(item => (
              <div key={item.produit.id} className="flex gap-3 items-center bg-gray-50 p-2 rounded-xl">
                <img src={item.produit.image_url} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div className="flex-1">
                  <div className="font-bold text-xs truncate w-32">{item.produit.name}</div>
                  <div className="text-blue-600 font-bold text-sm">{(item.produit.prix * item.quantity).toFixed(2)}€</div>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg border px-2 py-1">
                  <button onClick={() => updateQuantity(item.produit.id, -1)} className="font-bold">-</button>
                  <span className="text-sm font-bold min-w-[15px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.produit.id, 1)} className="font-bold">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SECTION PAIEMENT AMÉLIORÉE */}
        <div className="p-6 bg-white border-t-4 border-gray-100 space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total à régler</span>
            <span className="text-4xl font-black text-black">
              {calculateTotal().toFixed(2)} <span className="text-xl">€</span>
            </span>
          </div>
          
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Sélectionner le mode de règlement :</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* BOUTON ESPECES */}
              <button 
                onClick={() => handleFinalizeSale('ESPECES')}
                disabled={loading || cart.length === 0}
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-green-600 bg-white hover:bg-green-600 transition-all active:scale-95 disabled:opacity-30 disabled:border-gray-200"
              >
                <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">💵</span>
                <span className="text-[11px] font-black uppercase text-green-600 group-hover:text-white transition-colors">Règlement</span>
                <span className="text-sm font-black uppercase text-green-700 group-hover:text-white transition-colors">Espèces</span>
              </button>

              {/* BOUTON CARTE */}
              <button 
                onClick={() => handleFinalizeSale('CARTE')}
                disabled={loading || cart.length === 0}
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-blue-600 bg-white hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-30 disabled:border-gray-200"
              >
                <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">💳</span>
                <span className="text-[11px] font-black uppercase text-blue-600 group-hover:text-white transition-colors">Paiement</span>
                <span className="text-sm font-black uppercase text-blue-700 group-hover:text-white transition-colors">Carte Bancaire</span>
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-2 border border-dashed border-gray-200">
             <p className="text-[10px] text-center text-gray-400 leading-tight italic">
               L'inventaire sera automatiquement déduit après confirmation du paiement.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}