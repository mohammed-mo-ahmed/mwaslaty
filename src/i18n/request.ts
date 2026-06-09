import {getRequestConfig} from 'next-intl/server';
import {routing, type Locale} from './routing';
import en from '../messages/en.json';
import ar from '../messages/ar.json';

function isLocale(locale: string | undefined): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

const allMessages = {en, ar} as const;

export default getRequestConfig(async ({requestLocale}) => {
  const requestedLocale = await requestLocale;
  const locale = isLocale(requestedLocale) ? requestedLocale : routing.defaultLocale;

  return {
    locale,
    messages: allMessages[locale]
  };
});
