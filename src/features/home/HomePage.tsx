'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {ArrowRight, MapPin, MessageCircle, Search, Users} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useAuth} from '@/shared/auth/AuthProvider';

const ARABIC_FONTS = [
  '"Traditional Arabic", serif',
  '"Sakkal Majalla", serif',
  '"Arabic Typesetting", serif',
];

const LATIN_FONTS = [
  'Georgia, "Times New Roman", serif',
  '"Courier New", Consolas, monospace',
  '"Segoe Script", "Bradley Hand", cursive',
];

function AnimatedWord({children}: {children: string}) {
  const isArabic = /[\u0600-\u06FF]/.test(children);
  const fonts = isArabic ? ARABIC_FONTS : LATIN_FONTS;
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % fonts.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [fonts.length]);

  return (
    <span
      className={`inline-block text-amber-600 animate-font-glow ${isArabic ? 'text-5xl sm:text-6xl lg:text-8xl' : ''}`}
      style={{fontFamily: fonts[fontIndex]}}
    >
      {children}
    </span>
  );
}

function highlightText(text: string) {
  const parts = text.split(/(Egypt|مصر)/);
  return parts.map((part, i) => {
    if (part === 'Egypt' || part === 'مصر') {
      return <AnimatedWord key={i}>{part}</AnimatedWord>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function HomePage() {
  const locale = useLocale();
  const t = useTranslations('home');
  const {isAuthenticated} = useAuth();

  const features = [
    {
      name: t('aiChatBot'),
      description: t('aiChatBotDesc'),
      icon: MessageCircle,
      href: `/${locale}/chatbot`,
      color: 'bg-blue-600'
    },
    {
      name: t('manualSearch'),
      description: t('manualSearchDesc'),
      icon: Search,
      href: `/${locale}/search`,
      color: 'bg-emerald-600'
    },
    {
      name: t('exploreStops'),
      description: t('importantStopsDesc'),
      icon: MapPin,
      href: `/${locale}/stops`,
      color: 'bg-amber-600'
    },
    {
      name: t('communityRoutes'),
      description: t('communityRoutesDesc'),
      icon: Users,
      href: `/${locale}/user-routes`,
      color: 'bg-violet-600'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-950 md:text-6xl break-words">
            {highlightText(t('headline'))}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">{t('description')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!isAuthenticated ? (
              <Link
                href={`/${locale}/signup`}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {t('registerNow')}
                <ArrowRight className="ms-2 h-5 w-5" />
              </Link>
            ) : null}
            <Link
              href={`/${locale}/chatbot`}
              className="inline-flex items-center justify-center rounded-md border border-amber-600 px-6 py-3 font-semibold text-amber-700 hover:bg-amber-50"
            >
              <MessageCircle className="me-2 h-5 w-5" />
              {t('chatWithAI')}
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-950">{t('transportationNetwork')}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              ['3', t('metroLines'), 'text-blue-600'],
              ['500+', t('busRoutes'), 'text-emerald-600'],
              ['1000+', t('microbusLines'), 'text-amber-600'],
              ['50+', t('majorStops'), 'text-violet-600']
            ].map(([value, label, color]) => (
              <div key={label} className="rounded-md bg-gray-50 p-4 text-center">
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
                <div className="mt-1 text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.name} href={feature.href} className="group rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-md ${feature.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-950">{feature.name}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
