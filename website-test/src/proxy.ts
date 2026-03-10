// src/proxy.ts (ou middleware.ts selon votre structure)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Ajoutez l'exclusion des routes API et des fichiers statiques ici
  matcher: [
    // Ignore toutes les routes commençant par /api
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|.*\\.svg).*)',
    // Active l'internationalisation pour la racine et les locales
    '/', 
    '/(de|en|fr)/:path*'
  ]
};