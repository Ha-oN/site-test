'use client';

import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Collection {
  id: number;
  name: string;
  src: string;
}

export default function CollectionsCarousel() {
  const t = useTranslations('HomePage');

  const collections: Collection[] = [
    { id: 1, name: 'Été 2024', src: '/photo1.jpg' },
    { id: 2, name: 'Hiver 2023', src: '/photo2.jpg' },
    { id: 3, name: 'Accessoires', src: '/photo3.jpg' },
    { id: 4, name: 'Nouveautés', src: '/photo4.jpg' },
  ];

  return (
    <section className="w-full max-w-5xl">
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
        className="rounded-3xl shadow-2xl"
      >
        {collections.map((col) => (
          <SwiperSlide key={col.id}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl group cursor-pointer">
              <div className="absolute inset-0 bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-500">Image {col.name}</span>
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <span className="text-white text-xl font-medium text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {t('viewCollection')} {col.name}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}