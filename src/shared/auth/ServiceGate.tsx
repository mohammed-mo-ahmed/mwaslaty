'use client';

import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';
import {useLocale} from 'next-intl';
import {useAuth} from './AuthProvider';

type Props = {
  children: React.ReactNode;
};

export function ServiceGate({children}: Props) {
  const {isAuthenticated, loading} = useAuth();
  const locale = useLocale();
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || isAuthenticated || redirected.current) return;
    redirected.current = true;
    const returnUrl = encodeURIComponent(pathname ?? '');
    window.location.href = `/${locale}/login?returnUrl=${returnUrl}`;
  }, [loading, isAuthenticated, locale, pathname]);

  if (loading || !isAuthenticated) return null;
  return <>{children}</>;
}
