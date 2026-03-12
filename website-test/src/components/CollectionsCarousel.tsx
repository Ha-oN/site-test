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

  const nextSlide = () => setCurrentIndex((prev) => (prev === collections.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? collections.length - 1 : prev - 1));

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center text-[#8B4513] italic font-serif text-xl bg-[#F5F2ED]">
      {t('loading')}
    </div>
  );
  
  if (collections.length === 0) return null;

  const currentCollection = collections[currentIndex];

  return (
    <section className="relative min-h-[90vh] w-full flex flex-col items-center justify-center py-16 bg-[#F5F2ED] overflow-hidden">
      
      {/* 1. HEADER : STYLE ÉDITORIAL CÉRAMIQUE */}
      <div className="text-center mb-12 z-20 px-4">
        <p className="text-[#A0522D] font-big uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 opacity-70">
          {t('latest')}
        </p>
        
        <h2 
          key={`title-${currentCollection.id}`}
          className="text-5xl md:text-8xl font-serif italic tracking-tight text-[#4A3728] uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000"
        >
          {currentCollection.name}
        </h2>
      </div>

      {/* 2. CENTRE : CAROUSEL */}
      <div className="relative w-full max-w-6xl flex items-center justify-center px-6 md:px-20">
        
        <CarouselControls onPrev={prevSlide} onNext={nextSlide} />

        <div className="relative w-full aspect-video md:aspect-[21/9] shadow-[0_20px_50px_rgba(139,69,19,0.15)] rounded-[2rem] overflow-hidden">
          {collections.map((collection, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={collection.id}
                className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  isActive 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
              >
                <Link href={`/collections/${collection.id}`} className="block w-full h-full group">
                  <CollectionCard collection={collection} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INFOS : MATIÈRES ET DÉTAILS */}
      <div 
        key={`info-${currentCollection.id}`}
        className="mt-12 text-center z-20 px-4 animate-in fade-in slide-in-from-top-6 duration-1000"
      >
        <div className="flex items-center justify-center gap-8">
          <span className="h-[1px] w-12 bg-[#D2B48C]/50" />
          <p className="text-[#8B4513] font-medium tracking-[0.2em] uppercase text-[10px] md:text-xs italic">
            {currentCollection.nb_pieces} {t('pieces')} — {currentCollection.mots_clefs}
          </p>
          <span className="h-[1px] w-12 bg-[#D2B48C]/50" />
        </div>
      </div>

    </section>
  );
}