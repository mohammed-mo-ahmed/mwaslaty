'use client';

import Link from 'next/link';
import {Lock} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useAuth} from './AuthProvider';

type Props = {
  children: React.ReactNode;
};

export function ServiceGate({children}: Props) {
  const {isAuthenticated} = useAuth();
  const locale = useLocale();
  const t = useTranslations('auth');

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-amber-600 p-2 text-white">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t('serviceRequiredTitle')}</h3>
          <p className="mt-1 text-sm text-gray-600">{t('serviceRequiredText')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/${locale}/login`} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              {t('loginToContinue')}
            </Link>
            <Link href={`/${locale}/signup`} className="rounded-md border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100">
              {t('submitSignup')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
