'use client';

import { useEffect } from 'react';
import { useCollections } from '@/hooks/useCollections';
import CollectionCard from '@/components/CollectionCard';

export default function CollectionsPage() {
  // On récupère les fonctions et l'état de votre hook
  const { collections, fetchCollections, loading } = useCollections();

  // IMPORTANT : On force l'appel à la base de données quand la page s'affiche
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-center uppercase tracking-widest">
          Nos Collections
        </h1>

        {/* 1. Si c'est en train de charger */}
        {loading && collections.length === 0 && (
          <p className="text-center">Chargement des galeries...</p>
        )}

        {/* 2. Si le chargement est fini mais c'est vide */}
        {!loading && collections.length === 0 && (
          <p className="text-center text-gray-500">
            Aucune collection n'a été trouvée dans la base de données.
          </p>
        )}

        {/* 3. L'affichage des cases cliquables */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </main>
  );
}