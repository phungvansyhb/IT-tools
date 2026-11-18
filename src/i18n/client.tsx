'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  isValidLocale,
  localePath,
  stripLocalePrefix,
  type Locale,
} from './config';
import { getBundle, getFixedT, type FixedT } from './translator';
import type { LocaleBundle } from './types';

export const BEFORE_LOCALE_SWITCH_EVENT = 'omnidev:before-locale-switch';

interface I18nContextValue {
  locale: Locale;
  t: FixedT;
  bundle: LocaleBundle;
  switchLocale: (nextLocale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function persistLocalePreference(locale: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage quota errors
  }
  try {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignore cookie write errors
  }
}

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  useEffect(() => {
    persistLocalePreference(activeLocale);
  }, [activeLocale]);

  const t = useMemo(() => getFixedT(activeLocale), [activeLocale]);
  const bundle = useMemo(() => getBundle(activeLocale), [activeLocale]);

  const switchLocale = useCallback(
    (nextLocale: Locale) => {
      const targetLocale = isValidLocale(nextLocale) ? nextLocale : DEFAULT_LOCALE;
      persistLocalePreference(targetLocale);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent(BEFORE_LOCALE_SWITCH_EVENT, { detail: { nextLocale: targetLocale } })
        );
      }

      if (targetLocale === activeLocale) return;

      const { pathname: strippedPathname } = stripLocalePrefix(pathname || '/');
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const targetUrl = `${localePath(targetLocale, strippedPathname)}${search}`;
      router.push(targetUrl);
    },
    [activeLocale, pathname, router]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: activeLocale,
      t,
      bundle,
      switchLocale,
    }),
    [activeLocale, t, bundle, switchLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return ctx;
}
