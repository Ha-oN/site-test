"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Produit } from '@/types/Produit';
import type { Collection } from '@/types/Collection';
import { Trash2, LayoutGrid } from 'lucide-react';

// Import des sous-composants
import SalesHeader from '@/components/admin/sales/SalesHeader';
import ProductCard from '@/components/admin/sales/ProductCard';
import CartItem from '@/components/admin/sales/CartItem';
import PaymentSection from '@/components/admin/sales/PaymentSection';

export default function SalesPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [cart, setCart] = useState<{produit: Produit, quantity: number}[]>([]);
  const [loading, setLoading] = useState(false);
  
  // États pour la recherche et le filtrage (gérés par SalesHeader)
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

  // Logique de filtrage
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

  const handleFinalizeSale = async (method: 'ESPECES' | 'CARTE') => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, item) => acc + (item.produit.prix * item.quantity), 0);
    
    if (!confirm(`Confirmer le règlement de ${total.toFixed(2)}€ (${method}) ?`)) return;

    setLoading(true);
    const { error } = await supabase.rpc('process_sale', { 
      items_list: cart.map(item => ({ id: item.produit.id, quantity: item.quantity })), 
      total_amount: total,
      p_method: method 
    });

    if (!error) {
      alert(`Transaction validée.`);
      setCart([]);
      fetchInitialData();
    } else {
      alert("Erreur: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-neutral-100 text-neutral-900 overflow-hidden font-sans antialiased">
      
      {/* SECTION CATALOGUE */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto border-r border-neutral-200">
        
        {/* UTILISATION DU COMPOSANT SALESHEADER */}
        <SalesHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          collections={collections}
        />

        {/* GRILLE DE PRODUITS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredProduits.map(p => (
            <ProductCard key={p.id} produit={p} onAdd={addToCart} />
          ))}
        </div>
        
        {filteredProduits.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-neutral-400 italic">
            Aucun produit ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* SECTION COMMANDE (PANIER) */}
      <div className="w-[320px] bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10">
        <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <h2 className="text-sm font-black text-neutral-900 tracking-widest uppercase">Panier</h2>
          <button 
            onClick={() => setCart([])} 
            className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
            title="Vider le panier"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-300 border-2 border-dashed border-neutral-50 rounded-2xl">
               <p className="italic text-xs text-center px-4">Sélectionnez des articles pour commencer la vente</p>
            </div>
          ) : (
            cart.map(item => (
              <CartItem 
                key={item.produit.id} 
                item={item} 
                onUpdateQuantity={updateQuantity} 
              />
            ))
          )}
        </div>

        {/* SECTION DE PAIEMENT */}
        <PaymentSection 
          total={cart.reduce((acc, item) => acc + (item.produit.prix * item.quantity), 0)}
          loading={loading}
          onFinalize={handleFinalizeSale}
          disabled={cart.length === 0}
        />
      </div>
    </div>
  );
}