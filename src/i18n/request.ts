import {getRequestConfig} from 'next-intl/server';
import {routing, type Locale} from './routing';

function isLocale(locale: string | undefined): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

export default getRequestConfig(async ({requestLocale}) => {
  const requestedLocale = await requestLocale;
  const locale = isLocale(requestedLocale) ? requestedLocale : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
