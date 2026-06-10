'use client';

import {useCallback, useEffect, useState} from 'react';
import {Coins, Gift, Bot, Search, MapPin, Users, TrendingUp, AlertCircle} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {ServiceGate} from '@/shared/auth/ServiceGate';
import {useAuth} from '@/shared/auth/AuthProvider';

type Transaction = {
  id: number;
  amount: number;
  type: string;
  description: string;
  created_at: string;
};

export function CreditsPage() {
  const t = useTranslations('credits');
  const {isAuthenticated, user} = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chatCost, setChatCost] = useState(50);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');

  const fetchPoints = useCallback(() => {
    if (!isAuthenticated || !user) return;
    user.getIdToken().then(token => {
      fetch('/api/points', {headers: {Authorization: `Bearer ${token}`}})
        .then(res => res.json())
        .then(data => {
          if (data.balance !== undefined) setBalance(data.balance);
          if (data.canClaimDaily !== undefined) setCanClaimDaily(data.canClaimDaily);
          if (data.transactions) setTransactions(data.transactions);
          if (data.chatCost) setChatCost(data.chatCost);
        })
        .catch(() => {});
    });
  }, [isAuthenticated, user]);

  useEffect(() => { fetchPoints(); }, [fetchPoints]);

  const handleClaimDaily = async () => {
    if (!user || claiming) return;
    setClaiming(true);
    setClaimError('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        setCanClaimDaily(false);
        fetchPoints();
      } else {
        setClaimError(data.error || 'Failed to claim');
      }
    } catch {
      setClaimError('Connection error');
    } finally {
      setClaiming(false);
    }
  };

  const freeFeatures = [
    {icon: Search, label: t('features.search')},
    {icon: MapPin, label: t('features.stops')},
    {icon: Users, label: t('features.userRoutes')},
    {icon: MapPin, label: t('features.map')},
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ServiceGate>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-950">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Balance Card */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-start">
              <h2 className="text-lg font-semibold text-amber-50">{t('currentBalance')}</h2>
              <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <Coins className="h-8 w-8" />
                <span className="text-4xl font-bold">
                  {balance !== null ? balance.toLocaleString() : '...'}
                </span>
                <span className="text-xl">{t('points')}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClaimDaily}
              disabled={!canClaimDaily || claiming}
              className="flex items-center gap-2 rounded-md bg-white/20 px-6 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/30 disabled:opacity-40"
            >
              <Gift className="h-5 w-5" />
              {claiming ? t('claiming') : canClaimDaily ? t('claimDaily') : t('claimedToday')}
            </button>
          </div>
          {claimError ? (
            <p className="mt-2 text-center text-sm text-red-200 sm:text-start">{claimError}</p>
          ) : null}
        </div>

        {/* How it works */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-950">
              <Gift className="h-5 w-5 text-amber-600" />
              {t('earnPoints')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">1</span>
                <div>
                  <p className="font-medium text-gray-800">{t('signupBonus')}</p>
                  <p className="text-sm text-gray-500">+1,000 {t('points')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">2</span>
                <div>
                  <p className="font-medium text-gray-800">{t('dailyBonus')}</p>
                  <p className="text-sm text-gray-500">+3,000 {t('points')} / {t('day')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-950">
              <Bot className="h-5 w-5 text-blue-600" />
              {t('pointsUsage')}
            </h3>
            <div className="flex items-center justify-between rounded-md bg-blue-50 p-3">
              <span className="text-gray-800">{t('chatbotCost')}</span>
              <span className="font-semibold text-blue-700">{chatCost} {t('points')} / {t('query')}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{t('chatbotCostDesc')}</p>
          </div>
        </div>

        {/* Free features */}
        <div className="mb-6 rounded-lg bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-emerald-800">
            <AlertCircle className="h-5 w-5" />
            {t('freeFeatures')}
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {freeFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.label} className="flex items-center gap-2 rounded-md bg-white p-3 text-sm font-medium text-emerald-700 shadow-sm">
                  <Icon className="h-4 w-4" />
                  {feat.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction History */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-950">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            {t('recentActivity')}
          </h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500">{t('noActivity')}</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-gray-800">{tx.description}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`font-semibold ${
                      tx.amount > 0 ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ServiceGate>
    </div>
  );
}
