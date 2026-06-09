'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, Bus, MapPin, Train} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {loadCSVData} from '@/shared/utils/dataLoader';
import {stops as staticStops, Stop} from './stopsData';

export function ImportantStopsPage() {
  const locale = useLocale();
  const t = useTranslations('stops');
  const [stopsData, setStopsData] = useState<Stop[]>([]);

  useEffect(() => {
    loadCSVData<Stop>('/data/stops.csv')
      .then((data) => {
        const formattedData = data.map((item: any) => ({
          ...item,
          connections:
            typeof item.connections === 'string'
              ? item.connections.split(';')
              : item.connections,
          facilities:
            typeof item.facilities === 'string'
              ? item.facilities.split(';')
              : item.facilities,
          descriptionAr: item.descriptionAr || item.description
        }));
        if (formattedData.length > 0) {
          setStopsData(formattedData);
        } else {
          setStopsData(staticStops);
        }
      })
      .catch(() => {
        setStopsData(staticStops);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stopsData.map((stop) => (
          <Link
            key={stop.id}
            href={`/${locale}/stops/${stop.id}`}
            className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative h-48">
              <Image
                src={stop.imageUrl}
                alt={locale === 'ar' ? stop.nameAr : stop.name}
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">
                  {locale === 'ar' ? stop.nameAr : stop.name}
                </h3>
              </div>
              {stop.isMetroStation ? (
                <Train className="absolute right-4 top-4 h-7 w-7 rounded bg-blue-600 p-1 text-white" />
              ) : null}
            </div>
            <div className="p-5">
              <p className="text-sm leading-6 text-gray-600">
                {locale === 'ar'
                  ? (stop.descriptionAr ?? stop.description)
                  : stop.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center text-sm font-medium text-amber-700">
                  <Bus className="me-1 h-4 w-4" />
                  {stop.routes} {t('routes')}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-amber-700" />
              </div>
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">{t('types')}</h4>
                <div className="flex flex-wrap gap-1">
                  {stop.connections.map((connection) => (
                    <span
                      key={connection}
                      className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-900"
                    >
                      {connection}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-gradient-to-r from-blue-600 to-amber-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">{t('notFoundTitle')}</h2>
        <p className="mt-2">{t('notFoundText')}</p>
        <Link
          href={`/${locale}/user-routes`}
          className="mt-5 inline-flex items-center rounded-md bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-gray-100"
        >
          <MapPin className="me-2 h-5 w-5" />
          {t('addRoute')}
        </Link>
      </div>
    </div>
  );
}
