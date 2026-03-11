'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Collection {
  id: number;
  name: string;
  presentation_pic: string; // Utilisation du champ correct
  mots_clefs: string;
}

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
      // Sélection de toutes les colonnes incluant presentation_pic
      const { data, error } = await supabase
        .from('collections')
        .select('*');

      if (error) throw error;

      if (data) {
        const collectionsWithUrls = data.map((col) => {
          // Vérification du champ presentation_pic
          if (col.presentation_pic && !col.presentation_pic.startsWith('http')) {
            // Assurez-vous que 'collections' est bien le nom de votre bucket de stockage
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
    setCurrentIndex((prevIndex) => 
      prevIndex === collections.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? collections.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <div className="h-96 flex items-center justify-center">Chargement...</div>;
  if (collections.length === 0) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{t('title')}</h2>
      
      <div className="relative h-[500px] overflow-hidden rounded-2xl group">
        <div className="relative w-full h-full">
          {/* Utilisation de presentation_pic pour la source de l'image */}
          <Image
            src={collections[currentIndex].presentation_pic}
            alt={collections[currentIndex].name}
            fill
            className="object-cover transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">{collections[currentIndex].name}</h3>
            <p className="text-sm opacity-90">{collections[currentIndex].mots_clefs}</p>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {collections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}