'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { supabase } from '@/lib/supabase';
import 'swiper/css';
import 'swiper/css/pagination';

interface Collection {
  id: number;
  name: string;
  presentation_pic: string;
}

export default function CollectionsCarousel() {
  const t = useTranslations('HomePage');
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      // 1. On appelle la table 'collections'
      const { data, error } = await supabase
        .from('collections')
        .select('id, name, presentation_pic')
        .eq('active', true);
      
      if (error) {
        console.error("Erreur base de données:", error);
        return;
      }

      if (data) {
        const collectionsWithUrls = data.map((col) => {
          // 2. On récupère l'URL depuis le bucket 'collections-pics'
          const { data: publicUrlData } = supabase.storage
            .from('collections-pics') 
            .getPublicUrl(col.presentation_pic);

          // Log de debug pour vérifier l'URL dans la console du navigateur (F12)
          console.log(`URL générée pour ${col.name}:`, publicUrlData.publicUrl);

          return {
            ...col,
            presentation_pic: publicUrlData.publicUrl
          };
        });

        setCollections(collectionsWithUrls);
      }
    };

    fetchCollections();
  }, []);

  if (collections.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">{t('latestCollections')}</h2>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {collections.map((col) => (
          <SwiperSlide key={col.id}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl group cursor-pointer shadow-lg bg-gray-200">
              <img 
                src={col.presentation_pic} 
                alt={col.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  // Si l'image est introuvable, on affiche un placeholder
                  e.currentTarget.src = "https://via.placeholder.com/400x600?text=Image+Introuvable";
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="text-white text-xl font-bold drop-shadow-lg">
                  {col.name}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}