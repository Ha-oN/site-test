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
      {/* min-h-screen ici est crucial pour que le fond ne s'arrête pas au milieu de la page */}
      <body className="bg-[#F5F2ED] text-[#4A3728] selection:bg-[#D2B48C] selection:text-white min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          
          {/* main prend tout l'espace restant */}
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}