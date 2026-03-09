'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'fr' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-sm font-bold tracking-widest"
    >
      <span className={locale === 'fr' ? 'opacity-100' : 'opacity-30'}>FR</span>
      <div className="w-[1px] h-3 bg-zinc-300 dark:bg-zinc-700" />
      <span className={locale === 'en' ? 'opacity-100' : 'opacity-30'}>EN</span>
    </button>
  );
}