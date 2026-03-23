"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Produit } from '@/types/Produit';
import type { Collection } from '@/types/Collection';
import { Banknote, CreditCard, Search, Trash2, Plus, Minus, LayoutGrid } from 'lucide-react';

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
    if (prodRes.data) setProduits(prodRes.data as Produit[]);
    if (collRes.data) setCollections(collRes.data as Collection[]);
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
    
    const total = calculateTotal().toFixed(2);
    const confirmMsg = method === 'ESPECES' 
      ? `Confirmer le règlement de ${total}€ en ESPÈCES ?`
      : `Confirmer le règlement de ${total}€ par CARTE ?`;

    if (!confirm(confirmMsg)) return;

    setLoading(true);
    const { error } = await supabase.rpc('process_sale', { 
      items_list: cart.map(item => ({ id: item.produit.id, quantity: item.quantity })), 
      total_amount: calculateTotal(),
      p_method: method 
    });

    if (!error) {
      alert(`Transaction validée (${method}).`);
      setCart([]);
      fetchInitialData();
    } else {
      alert("Erreur transactionnelle: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-neutral-100 text-neutral-900 overflow-hidden font-sans antialiased">
      
      {/* SECTION CATALOGUE (OCCUPE L'ESPACE RESTANT) */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto border-r border-neutral-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-neutral-400" size={28} />
            <h1 className="text-3xl font-extrabold tracking-tighter text-neutral-950 uppercase">Point de Vente</h1>
          </div>
          
          <div className="flex gap-2 w-full md:w-2/3 shadow-sm rounded-xl overflow-hidden border border-neutral-200 bg-white p-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="text"
                placeholder="Rechercher désignation ou référence..."
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-neutral-50 outline-none focus:ring-1 focus:ring-neutral-400 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-3 py-2.5 rounded-lg bg-white outline-none text-sm font-medium text-neutral-700 border border-neutral-100"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <option value="all">Toutes Catégories</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredProduits.map(p => (
            <button 
              key={p.id} 
              onClick={() => addToCart(p)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col border border-neutral-200 hover:border-neutral-900"
            >
              <div className="h-36 w-full bg-neutral-50 overflow-hidden border-b border-neutral-100">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs italic bg-neutral-100">Aucun visuel</div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="font-semibold text-sm text-neutral-900 line-clamp-2 leading-tight min-h-[32px]">{p.name}</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">{p.type}</div>
                </div>
                <div className="flex justify-between items-end mt-3 pt-2 border-t border-neutral-100">
                  <span className="text-lg font-bold text-neutral-950">{p.prix.toFixed(2)}€</span>
                  <span className="text-[9px] font-mono font-medium bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded uppercase">Stock: {p.exemplaires}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION COMMANDE (PLUS ÉTROITE : 320px) */}
      <div className="w-[320px] bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10">
        <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <h2 className="text-sm font-black text-neutral-900 tracking-widest uppercase">Panier</h2>
          <button onClick={() => setCart([])} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-300 border-2 border-dashed border-neutral-50 rounded-2xl">
               <p className="italic text-xs">Aucun article</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.produit.id} className="flex justify-between items-center py-2 border-b border-neutral-50 last:border-0 group">
                <div className="flex-1 pr-2">
                  <div className="font-bold text-[11px] text-neutral-800 leading-tight uppercase truncate">{item.produit.name}</div>
                  <div className="text-[10px] font-bold text-neutral-400">{(item.produit.prix * item.quantity).toFixed(2)}€</div>
                </div>
                
                <div className="flex items-center gap-2 bg-neutral-50 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.produit.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-neutral-400 hover:text-black">
                    <Minus size={12}/>
                  </button>
                  <span className="text-xs font-black min-w-[14px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.produit.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-neutral-400 hover:text-black">
                    <Plus size={12}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SECTION PAIEMENT */}
        <div className="p-5 bg-white border-t-2 border-neutral-100 space-y-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Net à payer</span>
            <span className="text-3xl font-black text-neutral-950">
              {calculateTotal().toFixed(2)}€
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {/* BOUTON ESPECES */}
            <button 
              onClick={() => handleFinalizeSale('ESPECES')}
              disabled={loading || cart.length === 0}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-emerald-600 text-emerald-600 font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20"
            >
              <span>Règlement Espèces</span>
              <Banknote size={18} strokeWidth={2.5} />
            </button>

            {/* BOUTON CARTE */}
            <button 
              onClick={() => handleFinalizeSale('CARTE')}
              disabled={loading || cart.length === 0}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-sky-600 text-sky-600 font-black text-[11px] uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20"
            >
              <span>Paiement Carte</span>
              <CreditCard size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}