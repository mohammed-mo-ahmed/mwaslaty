'use client';

import {useState} from 'react';
import {Clock, DollarSign, MapPin, Navigation, Search} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {ServiceGate} from '@/shared/auth/ServiceGate';
import {useAuth} from '@/shared/auth/AuthProvider';
import MapView from '@/shared/components/MapView';

type RouteResult = {
  id: string;
  duration: string;
  cost: string;
  distance: string;
  steps: Array<{instruction: string; mode: string; duration: string}>;
};

const mockResults: RouteResult[] = [
  {
    id: '1',
    duration: '1h 30m',
    cost: '18 EGP',
    distance: '45 km',
    steps: [
      {instruction: 'search.steps.walkToMetro', mode: 'Walk', duration: '5 min'},
      {instruction: 'search.steps.metroLine1', mode: 'Metro', duration: '25 min'},
      {instruction: 'search.steps.transferL2', mode: 'Metro', duration: '5 min'},
      {instruction: 'search.steps.metroLine2', mode: 'Metro', duration: '20 min'},
      {instruction: 'search.steps.bus381', mode: 'Bus', duration: '35 min'}
    ]
  },
  {
    id: '2',
    duration: '2h 15m',
    cost: '14 EGP',
    distance: '52 km',
    steps: [
      {instruction: 'search.steps.walkToBus', mode: 'Walk', duration: '8 min'},
      {instruction: 'search.steps.bus174', mode: 'Bus', duration: '40 min'},
      {instruction: 'search.steps.microbus927', mode: 'Microbus', duration: '1h 15m'},
      {instruction: 'search.steps.walkToDest', mode: 'Walk', duration: '12 min'}
    ]
  }
];

function modeColor(mode: string) {
  switch (mode.toLowerCase()) {
    case 'metro':
      return 'bg-blue-100 text-blue-800';
    case 'bus':
      return 'bg-emerald-100 text-emerald-800';
    case 'microbus':
      return 'bg-violet-100 text-violet-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function SearchPage() {
  const t = useTranslations();
  const {isAuthenticated} = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<RouteResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!isAuthenticated || !origin.trim() || !destination.trim()) return;
    setIsSearching(true);
    window.setTimeout(() => {
      setResults(mockResults);
      setIsSearching(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950">{t('search.title')}</h1>
        <p className="mt-2 text-gray-600">{t('search.subtitle')}</p>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <ServiceGate>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('common.from')}
              <span className="relative mt-2 block">
                <MapPin className="absolute start-3 top-3 h-5 w-5 text-gray-400" />
                <input value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder={t('search.originPlaceholder')} className="w-full rounded-md border border-gray-300 py-3 pe-4 ps-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </span>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              {t('common.to')}
              <span className="relative mt-2 block">
                <Navigation className="absolute start-3 top-3 h-5 w-5 text-gray-400" />
                <input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder={t('search.destinationPlaceholder')} className="w-full rounded-md border border-gray-300 py-3 pe-4 ps-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </span>
            </label>
          </div>
          <button type="button" onClick={handleSearch} disabled={isSearching || !origin.trim() || !destination.trim()} className="mt-5 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Search className="me-2 h-5 w-5" />
            {isSearching ? t('common.searching') : t('common.findRoutes')}
          </button>
        </ServiceGate>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-4 text-xl font-semibold text-gray-950">{t('search.mapTitle')}</h2>
        <MapView
          height="h-64"
          origin={origin ? {id: 'origin', name: origin, nameAr: origin, lat: 30.0444, lng: 31.2357} : undefined}
          destination={destination ? {id: 'destination', name: destination, nameAr: destination, lat: 30.0483, lng: 31.3656} : undefined}
        />
      </div>

      {results.length > 0 ? (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-950">{t('search.routeOptions')}</h2>
          {results.map((route) => (
            <div key={route.id} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-950">{t('common.route')} {route.id}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center"><Clock className="me-1 h-4 w-4" />{route.duration}</span>
                  <span className="flex items-center"><DollarSign className="me-1 h-4 w-4" />{route.cost}</span>
                  <span>{route.distance}</span>
                </div>
              </div>
              <div className="space-y-3">
                {route.steps.map((step, index) => (
                  <div key={`${route.id}-${step.instruction}`} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm text-white">{index + 1}</span>
                    <div>
                      <p className="text-gray-900">{t(step.instruction)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs ${modeColor(step.mode)}`}>{t(`common.${step.mode.toLowerCase()}`)}</span>
                        <span className="text-sm text-gray-500">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <Search className="mx-auto mb-4 h-14 w-14 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-950">{t('search.emptyTitle')}</h3>
          <p className="mt-2 text-gray-600">{t('search.emptyText')}</p>
        </div>
      )}
    </div>
  );
}
