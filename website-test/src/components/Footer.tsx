import { useTranslations } from 'next-intl';
import { NAV_LINKS } from '@/constants/navigation';
import { SHOP_DATA } from '@/constants/shop'; // Importation des constantes
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Footer');
  const navT = useTranslations('Navbar');

  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Réseaux Sociaux */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('followUs')}</h3>
            <div className="flex flex-col space-y-3">
              <a href={SHOP_DATA.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                Instagram
              </a>
              <a href={SHOP_DATA.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                Facebook
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((item) => (
                <li key={item.id}>
                  <Link href={item.href || '/'} className="text-gray-600 hover:text-black">
                    {navT(item.id)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Utilise SHOP_DATA */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('contact')}</h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="block font-medium text-gray-800">{t('phone')}:</span>
                <a href={`tel:${SHOP_DATA.contact.phoneFull}`} className="hover:underline">
                  {SHOP_DATA.contact.phone}
                </a>
              </p>
              <p>
                <span className="block font-medium text-gray-800">{t('email')}:</span>
                <a href={`mailto:${SHOP_DATA.contact.email}`} className="hover:underline">
                  {SHOP_DATA.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('hours')}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t('monFri')}: {SHOP_DATA.hours.monFri}</li>
              <li>{t('sat')}: {SHOP_DATA.hours.sat}</li>
              <li>{t('sun')}: {t('closed')}</li>
            </ul>
          </div>
          
        </div>
      </div>
    </footer>
  );
}