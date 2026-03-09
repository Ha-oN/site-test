'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { NAV_LINKS } from '@/constants/navigation';

export default function NavLinks() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-10">
      {NAV_LINKS.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <div key={item.id} className="relative group py-2">
            {item.children ? (
              // MENU DÉROULANT
              <>
                <button className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                  {t(item.id)}
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 mt-4 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 p-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      className="block px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      {t(child.id)}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              // LIEN SIMPLE
              <Link
                href={item.href!}
                className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                  isActive ? 'text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {t(item.id)}
                {/* Petite barre d'activation */}
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-black dark:bg-white transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}