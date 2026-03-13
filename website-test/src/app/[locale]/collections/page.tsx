'use client';

import { useEffect } from 'react';
import { useCollections } from '@/hooks/useCollections';
import CollectionCard from '@/components/CollectionCard';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function CollectionsPage() {
  const t = useTranslations('Collections');
  const { collections, fetchCollections, loading } = useCollections();

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#F5F2ED] px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de page */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#4A3728] uppercase tracking-tighter">
            {t('latest')}
          </h1>
          <div className="h-[1px] w-24 bg-[#D2B48C] mx-auto mt-6 opacity-50" />
        </div>

        {/* 1. État de chargement */}
        {loading && collections.length === 0 && (
          <div className="flex justify-center items-center h-64">
             <p className="text-[#8B4513] italic animate-pulse">{t('loading')}</p>
          </div>
        )}

        {/* 2. État vide */}
        {!loading && collections.length === 0 && (
          <p className="text-center text-[#4A3728]/60 italic">
            {t('noCollections')}
          </p>
        )}

        {/* 3. Grille des collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              href={`/collections/${collection.id}`}
              className="group block"
            >
              {/* Le visuel (Vertical aspect-3/4 pour coller au carousel) */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-lg mb-6">
                <CollectionCard collection={collection} />
              </div>

              {/* Les infos SOUS la carte pour un look galerie */}
              <div className="space-y-1">
                <h2 className="text-2xl font-serif italic text-[#4A3728] group-hover:text-[#8B4513] transition-colors">
                  {collection.name}
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#8B4513]/60">
                    {collection.nb_pieces} {t('pieces')}
                  </p>
                  <span className="h-[1px] flex-1 bg-[#D2B48C]/20" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}