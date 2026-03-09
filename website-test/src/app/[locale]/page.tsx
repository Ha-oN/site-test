import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing'; // Use our special Link!

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
          {t('title')}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          {t('description')}
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/products" 
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
          >
            {t('shopNow')}
          </Link>
          <Link 
            href="/about" 
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-full font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            {t('aboutUs')}
          </Link>
        </div>
      </div>
    </main>
  );
}