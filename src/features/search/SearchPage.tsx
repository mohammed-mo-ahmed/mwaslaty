'use client';

import Link from 'next/link';
import {useState, useEffect, useMemo, useRef} from 'react';
import {Clock, DollarSign, MapPin, Navigation, Search} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useAuth} from '@/shared/auth/AuthProvider';
import MapView from '@/shared/components/MapView';
import {searchRoutes, getRouteDetails} from './searchData';
import type {RouteSearchResult, RouteDetails} from './searchData';

const modeColors: Record<string, string> = {
  metro: 'bg-blue-100 text-blue-800',
  bus: 'bg-emerald-100 text-emerald-800',
  microbus: 'bg-violet-100 text-violet-800',
  multi: 'bg-orange-100 text-orange-800',
  walk: 'bg-gray-100 text-gray-800',
};

export function SearchPage() {
  const t = useTranslations();
  const locale = useLocale();
  const {isAuthenticated} = useAuth();
  const [query, setQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<RouteDetails | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchRoutes(query);
  }, [query]);

  const handleSelect = (result: RouteSearchResult) => {
    const details = getRouteDetails(result.route);
    setSelectedRoute(details);
    setQuery(result.label);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsDropdownOpen(true);
    if (selectedRoute) {
      setSelectedRoute(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mapData = useMemo(() => {
    if (!selectedRoute) return null;
    const {route, originStop, destStop, lineStops, path} = selectedRoute;

    const otherStops = lineStops
      .filter(s => s.id !== route.fromId && s.id !== route.toId)
      .map(s => ({
        id: s.id,
        name: s.name,
        nameAr: s.nameAr,
        lat: s.lat,
        lng: s.lng,
      }));

    return {
      stops: otherStops,
      origin: originStop
        ? {id: 'origin', name: originStop.name, nameAr: originStop.nameAr, lat: originStop.lat, lng: originStop.lng}
        : undefined,
      destination: destStop
        ? {id: 'destination', name: destStop.name, nameAr: destStop.nameAr, lat: destStop.lat, lng: destStop.lng}
        : undefined,
      path,
      center: originStop
        ? ([originStop.lat, originStop.lng] as [number, number])
        : ([30.0444, 31.2357] as [number, number]),
    };
  }, [selectedRoute]);

  const showDropdown = isDropdownOpen && query.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950">{t('search.title')}</h1>
        <p className="mt-2 text-gray-600">{t('search.subtitle')}</p>
      </div>

      {isAuthenticated ? (
        <>
          <div className="relative mb-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="relative">
              <span className="relative block">
                <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => query.trim() && setIsDropdownOpen(true)}
                  placeholder={t('search.placeholder')}
                  className="w-full rounded-md border border-gray-300 py-3 pe-4 ps-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </span>

              {showDropdown ? (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
                >
                  {suggestions.length > 0 ? (
                    <ul className="py-1">
                      {suggestions.map((s) => (
                        <li key={s.route.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(s)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm hover:bg-amber-50"
                          >
                            <Search className="h-4 w-4 shrink-0 text-gray-400" />
                            <span className="font-medium text-gray-900">{s.route.lineName}</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-gray-600">{s.route.fromName} → {s.route.toName}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">{t('search.noResults')}</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {selectedRoute ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-950">{selectedRoute.route.lineName}</h2>
                    <p className="mt-1 flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {selectedRoute.route.fromName}
                      <span className="text-gray-300">→</span>
                      <Navigation className="h-4 w-4" />
                      {selectedRoute.route.toName}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${modeColors[selectedRoute.route.type] || 'bg-gray-100 text-gray-800'}`}>
                    {t(`common.${selectedRoute.route.type}`)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {t('common.duration')}: {selectedRoute.route.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    {t('common.cost')}: {selectedRoute.route.cost}
                  </span>
                  {selectedRoute.route.transfers > 0 ? (
                    <span>{selectedRoute.route.transfers} {t('chatbot.transfers')}</span>
                  ) : null}
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="mb-4 text-lg font-semibold text-gray-950">{t('search.mapTitle')}</h3>
                <MapView
                  height="h-80"
                  center={mapData?.center}
                  stops={mapData?.stops}
                  origin={mapData?.origin}
                  destination={mapData?.destination}
                  route={mapData?.path}
                />
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="mb-4 text-lg font-semibold text-gray-950">{t('chatbot.steps')}</h3>
                <div className="space-y-4">
                  {selectedRoute.route.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-gray-900">{step.instruction}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${modeColors[step.type] || 'bg-gray-100 text-gray-800'}`}>
                            {t(`common.${step.type}`)}
                          </span>
                          <span className="text-sm text-gray-500">{step.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRoute.lineStops.length > 0 ? (
                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <h3 className="mb-4 text-lg font-semibold text-gray-950">{t('search.stopsOnLine')}</h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {selectedRoute.lineStops.map((stop) => (
                      <div
                        key={stop.id}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                          stop.id === selectedRoute.route.fromId || stop.id === selectedRoute.route.toId
                            ? 'bg-blue-50 font-medium text-blue-800'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <MapPin className={`h-3.5 w-3.5 shrink-0 ${
                          stop.id === selectedRoute.route.fromId || stop.id === selectedRoute.route.toId
                            ? 'text-blue-500'
                            : 'text-gray-400'
                        }`} />
                        {stop.nameAr}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
              <Search className="mx-auto mb-4 h-14 w-14 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-950">{t('search.emptyTitle')}</h3>
              <p className="mt-2 text-gray-600">{t('search.emptyText')}</p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-amber-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">{t('search.loginRequired')}</h2>
          <p className="mt-2">{t('search.loginRequiredText')}</p>
          <Link
            href={`/${locale}/signup`}
            className="mt-5 inline-flex items-center rounded-md bg-white px-5 py-3 font-semibold text-amber-700 hover:bg-gray-100"
          >
            {t('navigation.register')}
          </Link>
        </div>
      )}
    </div>
  );
}
