'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import NavLinks from './NavLinks';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Navbar');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D2B48C]/20 bg-[#F5F2ED]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO GAUCHE : Style Sceau d'Artisan */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center text-[#F5F2ED] font-serif italic font-bold text-xl transition-all group-hover:scale-105 shadow-sm">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-serif italic font-bold tracking-tight leading-none text-[#4A3728]">
              Mon Shop
            </span>
            <span className="text-[10px] text-[#A0522D] font-bold tracking-[0.3em] uppercase mt-1">
              Céramique
            </span>
          </div>
        </Link>

        {/* NAVIGATION DROITE */}
        <div className="flex items-center gap-8">
          {/* Les liens à l'intérieur de NavLinks devront aussi être stylisés en ocre */}
          <nav className="hidden md:block">
            <NavLinks />
          </nav>
          
          <div className="flex items-center gap-4 pl-6 border-l border-[#D2B48C]/30">
            <LanguageSwitcher />
            
            {/* Panier stylisé */}
            <button className="relative p-2 text-[#8B4513] hover:bg-[#D2B48C]/10 rounded-full transition-all">
              <span className="text-xl">🛒</span>
              {/* Optionnel : indicateur de panier */}
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#A0522D] rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}