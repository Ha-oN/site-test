import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale to satisfy Next.js 16 requirements
  let locale = await requestLocale;

  // Fallback if locale is missing or invalid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Use the @/ alias to reach the messages folder clearly
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});