'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';
import { Produit } from '@/types/Produit';

// Import des thèmes
import DefaultTheme from '@/components/themes/DefaultTheme';
import JaponTheme from '@/components/themes/JaponTheme';

// Import de ton nouveau composant harmonisé
import ProduitCard from '@/components/ProduitCard';

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

  // 1. Loader harmonisé (Fini le noir !)
  if (loading) return (
    <div className="h-screen bg-sand flex items-center justify-center text-argile italic font-black">
      CHARGEMENT...
    </div>
  );
  
  // 2. Sécurité harmonisée
  if (!collection) return (
    <div className="h-screen bg-sand text-argile p-20 font-black italic">
      COLLECTION INTROUVABLE.
    </div>
  );

  const themes: Record<string, React.ComponentType<{ children: React.ReactNode, collection: Collection }>> = {
    default: DefaultTheme,
    japon: JaponTheme,
  };

  const themeKey = collection.theme_name || 'default';
  const SelectedTheme = themes[themeKey] || DefaultTheme;

  return (
    <SelectedTheme collection={collection}>
      {/* Grille de produits : On a retiré tout le code HTML complexe ici 
          pour appeler simplement <ProduitCard /> 
      */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pb-20 px-8">
        {produits.map((prod) => (
          <ProduitCard key={prod.id} produit={prod} />
        ))}
      </div>
      
      {/* Message vide harmonisé */}
      {produits.length === 0 && (
        <p className="text-center text-argile/40 italic py-20 uppercase tracking-widest text-sm font-bold">
          Aucun produit dans cette collection.
        </p>
      )}
    </SelectedTheme>
  );
}