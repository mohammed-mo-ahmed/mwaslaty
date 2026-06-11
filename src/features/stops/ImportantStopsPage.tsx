'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, Bus, Search, Train} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/shared/auth/AuthProvider';
import {loadCSVData} from '@/shared/utils/dataLoader';
import {stops as staticStops, Stop} from './stopsData';

export function ImportantStopsPage() {
  const locale = useLocale();
  const t = useTranslations('stops');
  const {isAuthenticated} = useAuth();
  const [stopsData, setStopsData] = useState<Stop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStops = useMemo(() => {
    if (!searchQuery.trim()) return stopsData;
    const q = searchQuery.toLowerCase();
    return stopsData.filter(
      stop =>
        stop.name.toLowerCase().includes(q) ||
        stop.nameAr.toLowerCase().includes(q) ||
        stop.description.toLowerCase().includes(q) ||
        (stop.descriptionAr && stop.descriptionAr.toLowerCase().includes(q)) ||
        stop.connections.some(c => c.toLowerCase().includes(q))
    );
  }, [stopsData, searchQuery]);

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

      {isAuthenticated ? (
        <div className="relative mb-8">
          <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-md border border-gray-300 py-3 pe-4 ps-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      ) : null}

      {filteredStops.length > 0 ? (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStops.map((stop) => (
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
      ) : (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
          <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-950">{t('noSearchResults')}</h3>
          <p className="mt-2 text-gray-600">{t('noSearchResultsText')}</p>
        </div>
      )}
    </div>
  );
}
