'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {FormEvent, useState} from 'react';
import {useAuth} from '@/shared/auth/AuthProvider';

export function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(email, password);
    router.push(`/${locale}`);
  };

  return (
    <div className="mx-auto flex max-w-md items-center px-4 py-12">
      <div className="w-full rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-950">{t('loginTitle')}</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {t('email')}
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            {t('password')}
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </label>
          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">{t('submitLogin')}</button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/signup`} className="font-semibold text-blue-700 hover:text-blue-900">{t('submitSignup')}</Link>
        </p>
      </div>
    </div>
  );
}
