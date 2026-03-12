'use client';

import { useTranslations } from 'next-intl';
import { NAV_LINKS } from '@/constants/navigation';
import { SHOP_DATA } from '@/constants/shop';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Footer');
  const navT = useTranslations('Navbar');

  return (
    <footer className="bg-[#E5E1DA] border-t border-[#D2B48C]/30 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* 1. Réseaux Sociaux : Style minimaliste */}
          <div>
            <h3 className="font-serif italic text-xl text-[#8B4513] mb-6">
              {t('followUs')}
            </h3>
            <div className="flex flex-col space-y-3">
              <a 
                href={SHOP_DATA.socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#4A3728]/70 hover:text-[#8B4513] text-sm uppercase tracking-widest transition-colors"
              >
                Instagram
              </a>
              <a 
                href={SHOP_DATA.socials.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#4A3728]/70 hover:text-[#8B4513] text-sm uppercase tracking-widest transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* 2. Navigation : Liens épurés */}
          <div>
            <h3 className="font-serif italic text-xl text-[#8B4513] mb-6">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.id}>
                  <Link 
                    href={item.href || '/'} 
                    className="text-[#4A3728]/70 hover:text-[#8B4513] text-sm transition-colors"
                  >
                    {navT(item.id)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact : Focus sur la lisibilité */}
          <div>
            <h3 className="font-serif italic text-xl text-[#8B4513] mb-6">
              {t('contact')}
            </h3>
            <div className="space-y-4 text-sm text-[#4A3728]/70">
              <p>
                <span className="block font-bold text-[#4A3728] uppercase text-[10px] tracking-widest mb-1">
                  {t('phone')}
                </span>
                <a href={`tel:${SHOP_DATA.contact.phoneFull}`} className="hover:text-[#8B4513] transition-colors">
                  {SHOP_DATA.contact.phone}
                </a>
              </p>
              <p>
                <span className="block font-bold text-[#4A3728] uppercase text-[10px] tracking-widest mb-1">
                  {t('email')}
                </span>
                <a href={`mailto:${SHOP_DATA.contact.email}`} className="hover:text-[#8B4513] transition-colors">
                  {SHOP_DATA.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* 4. Horaires : Présentation type studio */}
          <div>
            <h3 className="font-serif italic text-xl text-[#8B4513] mb-6">
              {t('hours')}
            </h3>
            <ul className="text-sm text-[#4A3728]/70 space-y-2">
              <li className="flex justify-between border-b border-[#D2B48C]/20 pb-1">
                <span>{t('monFri')}</span>
                <span className="font-medium">{SHOP_DATA.hours.monFri}</span>
              </li>
              <li className="flex justify-between border-b border-[#D2B48C]/20 pb-1">
                <span>{t('sat')}</span>
                <span className="font-medium">{SHOP_DATA.hours.sat}</span>
              </li>
              <li className="flex justify-between">
                <span>{t('sun')}</span>
                <span className="font-medium italic">{t('closed')}</span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* 5. Bas de page : Copyright discret */}
        <div className="mt-20 pt-8 border-t border-[#D2B48C]/20 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#4A3728]/40">
            © {new Date().getFullYear()} {SHOP_DATA.name} 
          </p>
        </div>
      </div>
    </footer>
  );
}