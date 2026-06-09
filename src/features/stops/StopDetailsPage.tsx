'use client';

import Image from 'next/image';
import Link from 'next/link';
import {AlarmClock, ArrowLeft, ArrowRight, Bus, Clock, DollarSign, MapPin, Star, Train} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {stops} from './stopsData';

const routes = [
  {
    id: '1',
    name: 'Metro Line 2',
    type: 'Metro',
    destination: 'El-Monib',
    fare: '6 EGP',
    frequency: '5-8 min',
    rating: 4.2,
    operatingHours: '5:30 AM - 12:00 AM'
  },
  {
    id: '2',
    name: 'Bus #74',
    type: 'Bus',
    destination: 'Heliopolis',
    fare: '3 EGP',
    frequency: '10-15 min',
    rating: 3.8,
    operatingHours: '6:00 AM - 11:00 PM'
  },
  {
    id: '3',
    name: 'Microbus #127',
    type: 'Microbus',
    destination: 'Nasr City',
    fare: '5 EGP',
    frequency: '5-10 min',
    rating: 4.0,
    operatingHours: '5:00 AM - 1:00 AM'
  }
];

export function StopDetailsPage({stopId}: {stopId: string}) {
  const locale = useLocale();
  const t = useTranslations('stops');
  const common = useTranslations('common');
  const stop = stops.find((item) => item.id === stopId) ?? stops[0];
  const stopName = locale === 'ar' ? stop.nameAr : stop.name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/stops`}
        className="mb-6 inline-flex items-center text-blue-700 hover:text-blue-900"
      >
        {locale === 'ar' ? (
          <ArrowRight className="me-2 h-4 w-4" />
        ) : (
          <ArrowLeft className="me-2 h-4 w-4" />
        )}
        {t('backToStops')}
      </Link>

      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-100">
        <div className="relative h-64">
          <Image
            src={stop.imageUrl}
            alt={stopName}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl font-bold">{stopName}</h1>
            <p className="mt-2 max-w-2xl text-white/90">
              {locale === 'ar'
                ? (stop.descriptionAr ?? stop.description)
                : stop.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-5 text-xl font-bold text-gray-950">{t('routesSchedules')}</h2>
          <div className="space-y-4">
            {routes.map((route) => {
              const Icon = route.type === 'Metro' ? Train : Bus;
              return (
                <div key={route.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-blue-600 p-2 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-950">{route.name}</h3>
                        <p className="text-sm text-gray-600">
                          {common('to')} {route.destination}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center text-amber-600">
                      <Star className="me-1 h-4 w-4 fill-current" />
                      {route.rating}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-3">
                    <span className="flex items-center">
                      <DollarSign className="me-1 h-4 w-4" />
                      {route.fare}
                    </span>
                    <span className="flex items-center">
                      <Clock className="me-1 h-4 w-4" />
                      {route.frequency}
                    </span>
                    <span className="flex items-center">
                      <AlarmClock className="me-1 h-4 w-4" />
                      {route.operatingHours}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-950">{t('stationInfo')}</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {locale === 'ar'
              ? (stop.descriptionAr ?? stop.description)
              : stop.description}
          </p>
          <h3 className="mt-6 font-semibold text-gray-950">{t('facilities')}</h3>
          <div className="mt-3 space-y-2">
            {stop.facilities.map((facility) => (
              <div
                key={facility}
                className="flex items-center rounded-md bg-amber-50 p-3 text-sm text-gray-700"
              >
                <MapPin className="me-2 h-4 w-4 text-amber-700" />
                {facility}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
