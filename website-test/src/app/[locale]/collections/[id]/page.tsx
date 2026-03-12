'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';
import { Produit } from '@/types/Produit';

// Import des thèmes
import DefaultTheme from '@/components/themes/DefaultTheme';
import JaponTheme from '@/components/themes/JaponTheme';

export default function CollectionDetailPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: colData } = await supabase.from('collections').select('*').eq('id', id).single();
      const { data: prodData } = await supabase.from('produits').select('*').eq('collection_id', id).order('id');

      if (colData) setCollection(colData as Collection);
      if (prodData) setProduits(prodData as Produit[]);
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white italic">CHARGEMENT...</div>;
  
  // Sécurité si la collection n'existe pas
  if (!collection) return <div className="h-screen bg-black text-white p-20">Collection introuvable.</div>;

  // Mapping des thèmes avec un index signature pour TypeScript
  const themes: Record<string, React.ComponentType<{ children: React.ReactNode, collection: Collection }>> = {
    default: DefaultTheme,
    japon: JaponTheme,
  };

  // On utilise une valeur par défaut "default" si theme_name est manquant
  const themeKey = collection.theme_name || 'default';
  const SelectedTheme = themes[themeKey] || DefaultTheme;

  return (
    <SelectedTheme collection={collection}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
        {produits.map((prod) => (
          <div key={prod.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 mb-4">
              <img 
                src={prod.image_url} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={prod.name}
              />
              {prod.sold_out && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Sold Out
                </div>
              )}
            </div>
            <h3 className="font-bold uppercase italic text-white">{prod.name}</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              {prod.type} — {prod.prix}€
            </p>
          </div>
        ))}
      </div>
      
      {produits.length === 0 && (
        <p className="text-center text-zinc-600 italic py-20 uppercase tracking-widest text-sm">
          Aucun produit dans cette collection.
        </p>
      )}
    </SelectedTheme>
  );
}