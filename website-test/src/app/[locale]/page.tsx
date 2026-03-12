'use client';

import { useTranslations } from 'next-intl';
import CollectionsCarousel from '@/components/CollectionsCarousel';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    /* Utilisation de bg-sand et text-argile pour respecter ton thème global */
    <main className="flex flex-col items-center gap-16 p-8 bg-sand text-argile min-h-screen">
      
      {/* Introduction ou Hero Section */}
      <section className="text-center mt-10">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
      </section>

      {/* Appel du composant Carrousel */}
      <CollectionsCarousel />

      {/* Section Carte */}
      <section className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">{t('locationTitle')}</h2>
          {/* Couleur de texte adaptée à ton thème */}
          <p className="text-argile/60 mt-2">{t('address')}</p>
        </div>
        
        {/* Bordure adaptée à ton thème argile au lieu de zinc */}
        <div className="overflow-hidden rounded-2xl border border-argile/10 shadow-xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.391426057596!2d2.49532957116394!3d45.40144583097239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f82796a6929755%3A0xe76adfc6cd8566e!2sCaisse%20d'Epargne%20Bort%20les%20Orgues!5e0!3m2!1sfr!2sno!4v1773078137854!5m2!1sfr!2sno" 
            className="w-full h-[450px]" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
          ></iframe>
        </div>
      </section>
      
    </main>
  );
}