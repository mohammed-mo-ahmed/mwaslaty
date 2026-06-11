'use client';

import {useCallback} from 'react';
import {usePathname} from 'next/navigation';
import {useLocale} from 'next-intl';
import {useAuth} from './AuthProvider';

export function useRequireAuth() {
  const {isAuthenticated} = useAuth();
  const locale = useLocale();
  const pathname = usePathname();

  const requireAuth = useCallback(
    (callback: () => void) => {
      if (isAuthenticated) {
        callback();
      } else {
        const returnUrl = encodeURIComponent(pathname ?? '');
        window.location.href = `/${locale}/login?returnUrl=${returnUrl}`;
      }
    },
    [isAuthenticated, locale, pathname]
  );

  return {requireAuth, isAuthenticated};
}
