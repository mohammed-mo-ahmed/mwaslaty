'use client';

import {Check, Coins, CreditCard, Gift, Star} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {ServiceGate} from '@/shared/auth/ServiceGate';

const packages = [
  {id: 'basic', name: 'Basic Pack', credits: 20, price: 10},
  {id: 'standard', name: 'Standard Pack', credits: 50, price: 20, popular: true, bonus: '+5 bonus credits'},
  {id: 'premium', name: 'Premium Pack', credits: 100, price: 35, bonus: '+15 bonus credits'}
];

export function CreditsPage() {
  const t = useTranslations('credits');
  const common = useTranslations('common');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-950">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="mb-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">{t('currentBalance')}</h2>
            <div className="mt-2 flex items-center gap-2">
              <Coins className="h-8 w-8" />
              <span className="text-3xl font-bold">5 {t('credits')}</span>
            </div>
          </div>
          <div className="rounded-md bg-white/20 p-4 text-center">
            <Gift className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">{t('trial')}</p>
            <p className="text-sm text-amber-50">{t('trialText')}</p>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-5 text-2xl font-bold text-gray-950">{t('purchaseCredits')}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 ${pkg.popular ? 'ring-2 ring-amber-500' : ''}`}>
              {pkg.popular ? (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                  <Star className="me-1 h-3 w-3" />
                  Popular
                </span>
              ) : null}
              <h3 className="text-xl font-bold text-gray-950">{pkg.name}</h3>
              <div className="mt-3 text-3xl font-bold text-amber-600">{pkg.credits}</div>
              <p className="text-gray-600">{t('credits')}</p>
              {pkg.bonus ? <p className="mx-auto mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">{pkg.bonus}</p> : null}
              <div className="my-6 text-2xl font-bold text-gray-950">{pkg.price} EGP</div>
              <ServiceGate>
                <button type="button" className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
                  <CreditCard className="me-2 h-4 w-4" />
                  {common('purchase')}
                </button>
              </ServiceGate>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 flex items-center text-xl font-bold text-gray-950"><Gift className="me-2 h-5 w-5 text-emerald-600" />{t('earnFree')}</h2>
          {['Rate a route', 'Submit an approved route', 'Share the app', 'Weekly check-in'].map((item) => (
            <div key={item} className="mb-3 flex items-center justify-between rounded-md bg-emerald-50 p-3">
              <span>{item}</span>
              <span className="flex items-center font-semibold text-emerald-700"><Check className="me-1 h-4 w-4" />1 credit</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-xl font-bold text-gray-950">{t('recentActivity')}</h2>
          {[
            ['Route Search', '-1', '2024-12-22'],
            ['Chatbot Query', '-1', '2024-12-21'],
            ['Welcome Bonus', '+5', '2024-12-20']
          ].map(([action, credits, date]) => (
            <div key={`${action}-${date}`} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
              <div>
                <p className="text-gray-800">{action}</p>
                <p className="text-sm text-gray-500">{date}</p>
              </div>
              <span className={credits.startsWith('+') ? 'font-semibold text-emerald-700' : 'font-semibold text-red-700'}>{credits}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
