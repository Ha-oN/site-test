'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';
import CollectionCard from './CollectionCard';
import CarouselControls from './CarouselControls';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function CollectionsCarousel() {
  const t = useTranslations('Collections');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('active', true)
        .order('id', { ascending: false });

      if (data) setCollections(data as Collection[]);
      setLoading(false);
    }
    fetchCollections();
  }, []);

  // On ajuste la navigation pour ne pas dépasser (vu qu'on en affiche 2)
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= collections.length - 2 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? collections.length - 2 : prev - 1));
  };

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center text-[#8B4513] italic font-serif text-xl bg-[#F5F2ED]">
      {t('loading')}
    </div>
  );
  
  if (collections.length === 0) return null;

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 bg-[#F5F2ED] overflow-hidden">
      
      {/* 1. HEADER : STATIQUE */}
      <div className="text-center mb-16 z-20 px-4">
        <p className="text-[#A0522D] font-bold uppercase tracking-[0.4em] text-[10px] md:text-3xl font-serif mb-10 opacity-70">
          {t('latest')}
        </p>

      </div>

      {/* 2. CENTRE : CAROUSEL DOUBLE VERTICAL */}
      <div className="relative w-full max-w-5xl px-12 md:px-4">
        
        <CarouselControls onPrev={prevSlide} onNext={nextSlide} />

        {/* Fenêtre de visualisation */}
        <div className="overflow-hidden rounded-[2.5rem]">
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ transform: `translateX(-${currentIndex * 50}%)` }}
          >
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="min-w-[50%] px-2 md:px-4 transition-all duration-500"
              >
                <Link href={`/collections/${collection.id}`} className="block group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-xl bg-[#E5E1DA]">
                    {/* On s'assure que CollectionCard ne contient plus de titre interne */}
                    <CollectionCard collection={collection} />
                    
                    {/* Overlay discret au survol */}
                    <div className="absolute inset-0 bg-[#4A3728]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Titre et infos SOUS l'image (plus sur l'image) */}
                  <div className="mt-6 text-center group-hover:translate-y-[-5px] transition-transform duration-500">
                    <h3 className="text-xl md:text-2xl font-serif italic text-[#4A3728] uppercase mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-[10px] tracking-[0.2em] text-[#8B4513] uppercase opacity-60">
                      {collection.nb_pieces} {t('pieces')}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CTA : VOIR TOUT */}
      <div className="mt-16">
        <Link 
          href="/collections"
          className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B4513] border-b border-[#8B4513]/20 pb-2 hover:text-[#A0522D] transition-all"
        >
          {t('viewCollections')}
        </Link>
      </div>

    </section>
  );
}