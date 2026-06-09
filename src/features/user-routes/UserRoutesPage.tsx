'use client';

import {useState} from 'react';
import {Clock, DollarSign, Plus, ThumbsDown, ThumbsUp, User, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {ServiceGate} from '@/shared/auth/ServiceGate';
import {useAuth} from '@/shared/auth/AuthProvider';

type RouteType = 'Metro' | 'Bus' | 'Microbus';

type UserRoute = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  fare: string;
  duration: string;
  type: RouteType;
  submittedBy: string;
  votes: {up: number; down: number};
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
};

const userRoutes: UserRoute[] = [
  {
    id: '1',
    name: 'Express Microbus - New Cairo to Downtown',
    origin: 'New Cairo',
    destination: 'Downtown Cairo',
    fare: '12 EGP',
    duration: '45 min',
    type: 'Microbus',
    submittedBy: 'Ahmed M.',
    votes: {up: 24, down: 3},
    status: 'approved',
    submittedAt: new Date('2024-12-15')
  },
  {
    id: '2',
    name: 'Night Bus - Maadi to Airport',
    origin: 'Maadi',
    destination: 'Cairo Airport',
    fare: '25 EGP',
    duration: '1h 15m',
    type: 'Bus',
    submittedBy: 'Sara K.',
    votes: {up: 18, down: 2},
    status: 'pending',
    submittedAt: new Date('2024-12-20')
  },
  {
    id: '3',
    name: 'Alternative Route - Zamalek via Qasr El-Nil',
    origin: 'Zamalek',
    destination: 'Tahrir Square',
    fare: '4 EGP',
    duration: '20 min',
    type: 'Microbus',
    submittedBy: 'Mohamed A.',
    votes: {up: 8, down: 12},
    status: 'rejected',
    submittedAt: new Date('2024-12-18')
  }
];

function statusColor(status: UserRoute['status']) {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
  }
}

function typeColor(type: RouteType) {
  switch (type) {
    case 'Metro':
      return 'bg-blue-600';
    case 'Bus':
      return 'bg-emerald-600';
    case 'Microbus':
      return 'bg-violet-600';
  }
}

export function UserRoutesPage() {
  const t = useTranslations('userRoutes');
  const common = useTranslations('common');
  const {isAuthenticated} = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    origin: '',
    destination: '',
    fare: '',
    duration: '',
    type: 'Bus' as RouteType
  });

  const handleSubmitRoute = () => {
    if (!isAuthenticated) return;
    setNewRoute({name: '', origin: '', destination: '', fare: '', duration: '', type: 'Bus'});
    setShowAddForm(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"
        >
          <Plus className="me-2 h-5 w-5" />
          {t('addRoute')}
        </button>
      </div>

      {showAddForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-950">{t('addNewRoute')}</h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ServiceGate>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {t('routeName')}
                  <input
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {common('from')}
                    <input
                      value={newRoute.origin}
                      onChange={(e) => setNewRoute({...newRoute, origin: e.target.value})}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    {common('to')}
                    <input
                      value={newRoute.destination}
                      onChange={(e) => setNewRoute({...newRoute, destination: e.target.value})}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('type')}
                    <select
                      value={newRoute.type}
                      onChange={(e) =>
                        setNewRoute({...newRoute, type: e.target.value as RouteType})
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="Bus">{common('bus')}</option>
                      <option value="Microbus">{common('microbus')}</option>
                      <option value="Metro">{common('metro')}</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('fare')}
                    <input
                      value={newRoute.fare}
                      onChange={(e) => setNewRoute({...newRoute, fare: e.target.value})}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    {common('duration')}
                    <input
                      value={newRoute.duration}
                      onChange={(e) => setNewRoute({...newRoute, duration: e.target.value})}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    {common('cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitRoute}
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    {common('submit')}
                  </button>
                </div>
              </div>
            </ServiceGate>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {userRoutes.map((route) => (
          <div key={route.id} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs text-white ${typeColor(route.type)}`}
                  >
                    {common(route.type.toLowerCase())}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${statusColor(route.status)}`}
                  >
                    {t(`status.${route.status}`)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-950">{route.name}</h3>
                <p className="text-sm text-gray-600">
                  {route.origin} → {route.destination}
                </p>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4">
              <span className="flex items-center">
                <DollarSign className="me-1 h-4 w-4" />
                {route.fare}
              </span>
              <span className="flex items-center">
                <Clock className="me-1 h-4 w-4" />
                {route.duration}
              </span>
              <span className="flex items-center">
                <User className="me-1 h-4 w-4" />
                {route.submittedBy}
              </span>
              <span>{route.submittedAt.toLocaleDateString()}</span>
            </div>
            <ServiceGate>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-emerald-700 hover:bg-emerald-50"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {route.votes.up}
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-red-700 hover:bg-red-50"
                >
                  <ThumbsDown className="h-4 w-4" />
                  {route.votes.down}
                </button>
              </div>
            </ServiceGate>
          </div>
        ))}
      </div>
    </div>
  );
}
