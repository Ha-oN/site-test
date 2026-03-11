'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Collection } from '@/types/Collection';
import { CollectionCard } from './CollectionCard';
import { CarouselControls } from './CarouselControls';

export default function CollectionsCarousel() {
  const t = useTranslations('collections');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('collections').select('*');
      if (error) throw error;

      if (data) {
        const collectionsWithUrls = data.map((col) => {
          if (col.presentation_pic && !col.presentation_pic.startsWith('http')) {
            const { data: publicUrlData } = supabase.storage
              .from('collections')
              .getPublicUrl(col.presentation_pic);
            return { ...col, presentation_pic: publicUrlData.publicUrl };
          }
          return col;
        });
        setCollections(collectionsWithUrls);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === collections.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? collections.length - 1 : prev - 1));
  };

  if (loading) return <div className="h-96 flex items-center justify-center">Chargement...</div>;
  if (collections.length === 0) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{t('title')}</h2>
      
      <div className="relative h-[500px] overflow-hidden rounded-2xl group">
        <CollectionCard collection={collections[currentIndex]} />
        
        <CarouselControls 
          onPrev={prevSlide} 
          onNext={nextSlide} 
          currentIndex={currentIndex} 
          total={collections.length}
          onGoTo={(index) => setCurrentIndex(index)}
        />
      </div>
    </div>
  );
}