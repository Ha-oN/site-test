import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/app/globals.css'; 

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      {/* flex flex-col min-h-screen ensures the body takes full height 
        allowing the footer to be pushed to the bottom.
      */}
      <body className="antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          
          {/* flex-grow tells the main content to take up all available space */}
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}