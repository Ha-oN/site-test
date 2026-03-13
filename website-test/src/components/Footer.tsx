'use client';

import { useTranslations } from 'next-intl';
import { NAV_LINKS } from '@/constants/navigation';
import { SHOP_DATA } from '@/constants/shop';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Footer');
  const navT = useTranslations('Navbar');

  return (
    <footer className="bg-sand border-t border-argile/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* 1. Branding */}
          <div className="md:col-span-4 space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter text-argile uppercase">
              {SHOP_DATA.name}
            </h2>
            <p className="text-sm text-argile/60 leading-relaxed max-w-xs">
              {t('description')}
            </p>
          </div>

          {/* 2. Navigation - LOGIQUE CORRIGÉE */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-argile/40 mb-6">
              {t('navigationTitle')}
            </h3>
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((item) => {
                // Déterminer le lien : soit item.href, soit le premier enfant, soit /collections par défaut
                const targetHref = item.href || (item.id === 'collections' ? '/collections' : item.children?.[0]?.href || '/');

                return (
                  <li key={item.id}>
                    <Link 
                      href={targetHref} 
                      className="text-sm font-bold text-argile hover:text-ocre transition-colors uppercase tracking-tighter"
                    >
                      {navT(item.id)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. Contact */}
          <div className="md:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-argile/40 mb-6">
              {t('contactTitle')}
            </h3>
            <div className="flex flex-col gap-6">
              <div>
                <span className="block text-[10px] font-bold text-argile/30 uppercase mb-1">{t('emailLabel')}</span>
                <a href={`mailto:${SHOP_DATA.contact.email}`} className="text-sm font-bold text-argile hover:text-ocre transition-colors">
                  {SHOP_DATA.contact.email}
                </a>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-argile/30 uppercase mb-1">{t('phoneLabel')}</span>
                <a href={`tel:${SHOP_DATA.contact.phoneFull}`} className="text-sm font-bold text-argile hover:text-ocre transition-colors">
                  {SHOP_DATA.contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* 4. Horaires */}
          <div className="md:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-argile/40 mb-6">
              {t('hoursTitle')}
            </h3>
            <ul className="space-y-3 text-sm font-medium text-argile/70">
              <li className="flex justify-between items-end border-b border-argile/5 pb-1">
                <span className="text-[10px] uppercase font-bold text-argile/40">{t('monFri')}</span>
                <span>{SHOP_DATA.hours.monFri}</span>
              </li>
              <li className="flex justify-between items-end border-b border-argile/5 pb-1">
                <span className="text-[10px] uppercase font-bold text-argile/40">{t('sat')}</span>
                <span>{SHOP_DATA.hours.sat}</span>
              </li>
              <li className="flex justify-between items-end">
                <span className="text-[10px] uppercase font-bold text-argile/40">{t('sun')}</span>
                <span className="italic text-ocre">{t('closed')}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bas de page */}
        <div className="pt-8 border-t border-argile/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-widest text-argile/30">
          <p>© {new Date().getFullYear()} {SHOP_DATA.name} — {t('allRightsReserved')}</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-ocre transition-colors">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-ocre transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}