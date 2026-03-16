"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import  Produit  from '@/types/Produit';

export default function SalesPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [cart, setCart] = useState<{produit: Produit, quantity: number}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduits();

    // Ecoute en temps réel des changements de stock (exemplaires)
    const channel = supabase
      .channel('stock-alerts')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'produits' }, 
      (payload) => {
        const p = payload.new as Produit;
        if (p.exemplaires === 0 && !p.sold_out) {
          const confirmSoldOut = confirm(`Attention : "${p.name}" n'a plus d'exemplaires. Voulez-vous le marquer comme "SOLD OUT" ?`);
          if (confirmSoldOut) {
            markAsSoldOut(p.id);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchProduits() {
    const { data } = await supabase
      .from('produits')
      .select('*')
      .gt('exemplaires', 0)
      .eq('sold_out', false)
      .order('name');
    if (data) setProduits(data);
  }

  async function markAsSoldOut(id: number) {
    await supabase.from('produits').update({ sold_out: true }).eq('id', id);
    fetchProduits();
  }

  const addToCart = (p: Produit) => {
    setCart(prev => {
      const existing = prev.find(item => item.produit.id === p.id);
      if (existing) {
        if (existing.quantity >= p.exemplaires) {
          alert("Limite de stock atteinte !");
          return prev;
        }
        return prev.map(item => item.produit.id === p.id ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, { produit: p, quantity: 1 }];
    });
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + (item.produit.prix * item.quantity), 0);

  const handleSimulatePayment = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const itemsJson = cart.map(item => ({ id: item.produit.id, quantity: item.quantity }));
    
    const { error } = await supabase.rpc('process_sale', { 
      items_list: itemsJson, 
      total_amount: calculateTotal() 
    });

    if (error) {
      alert("Erreur: " + error.message);
    } else {
      alert("Vente enregistrée avec succès !");
      setCart([]);
      fetchProduits();
    }
    setLoading(false);
  };

  return (
    <div className="flex p-6 gap-6 min-h-screen bg-gray-100 text-black">
      {/* CATALOGUE */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Nouvelle Vente</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {produits.map(p => (
            <button 
              key={p.id} 
              onClick={() => addToCart(p)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition text-left"
            >
              <div className="font-bold">{p.name}</div>
              <div className="text-blue-600">{p.prix} €</div>
              <div className="text-xs text-gray-400 mt-1">Stock: {p.exemplaires}</div>
            </button>
          ))}
        </div>
      </div>

      {/* PANIER */}
      <div className="w-80 bg-white p-6 rounded-lg shadow-xl h-fit">
        <h2 className="font-bold border-b mb-4 pb-2 uppercase tracking-wider">Panier</h2>
        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={item.produit.id} className="flex justify-between text-sm">
              <span>{item.produit.name} (x{item.quantity})</span>
              <span>{item.produit.prix * item.quantity}€</span>
            </div>
          ))}
        </div>
        <div className="text-xl font-bold border-t pt-4 flex justify-between">
          <span>Total</span>
          <span>{calculateTotal()} €</span>
        </div>
        <button 
          onClick={handleSimulatePayment}
          disabled={loading || cart.length === 0}
          className="w-full mt-6 bg-black text-white py-3 rounded font-bold hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Validation..." : "CONFIRMER LA VENTE"}
        </button>
      </div>
    </div>
  );
}