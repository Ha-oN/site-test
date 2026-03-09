import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import NavLinks from './NavLinks';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Navbar');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO GAUCHE */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black font-black text-xl transition-transform group-hover:rotate-6">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tighter leading-none uppercase">
              Mon Shop
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-[0.2em] uppercase">
              Atelier
            </span>
          </div>
        </Link>

        {/* NAVIGATION DROITE */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:block">
            <NavLinks />
          </nav>
          
          <div className="flex items-center gap-4 pl-6 border-l border-zinc-200 dark:border-zinc-800">
            <LanguageSwitcher />
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all text-xl">
              🛒
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}