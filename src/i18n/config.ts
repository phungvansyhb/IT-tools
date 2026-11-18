export type Locale = 'en' | 'vi' | 'ja' | 'zh';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'vi', 'ja', 'zh'] as const;

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE_NAME = 'omnidev_locale';
export const LOCALE_STORAGE_KEY = 'omnidev_locale';

export interface LocaleMeta {
  code: Locale;
  htmlLang: string;
  ogLocale: string;
  shortLabel: string;
  nativeName: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    code: 'en',
    htmlLang: 'en',
    ogLocale: 'en_US',
    shortLabel: 'EN',
    nativeName: 'English',
  },
  vi: {
    code: 'vi',
    htmlLang: 'vi',
    ogLocale: 'vi_VN',
    shortLabel: 'VI',
    nativeName: 'Tiếng Việt',
  },
  ja: {
    code: 'ja',
    htmlLang: 'ja',
    ogLocale: 'ja_JP',
    shortLabel: 'JA',
    nativeName: '日本語',
  },
  zh: {
    code: 'zh',
    htmlLang: 'zh-Hans',
    ogLocale: 'zh_CN',
    shortLabel: 'ZH',
    nativeName: '简体中文',
  },
};

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Strips a leading `/{locale}` segment (if valid) from a pathname.
 * Always returns a normalized pathname starting with `/`.
 */
export function stripLocalePrefix(pathname: string): { locale: Locale | null; pathname: string } {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const match = normalized.match(/^\/([^/]+)(\/.*)?$/);
  if (!match) {
    return { locale: null, pathname: '/' };
  }
  const [, maybeLocale, rest] = match;
  if (isValidLocale(maybeLocale)) {
    return {
      locale: maybeLocale,
      pathname: rest && rest !== '' ? rest : '/',
    };
  }
  return {
    locale: null,
    pathname: normalized,
  };
}

/**
 * Builds a canonical always-prefixed locale route, preventing double locale prefixes
 * while preserving any query string or hash suffix.
 */
export function localePath(locale: Locale, path: string = '/'): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === '/') {
    return `/${locale}`;
  }

  const queryIdx = trimmed.indexOf('?');
  const hashIdx = trimmed.indexOf('#');
  let splitIdx = -1;
  if (queryIdx !== -1 && hashIdx !== -1) {
    splitIdx = Math.min(queryIdx, hashIdx);
  } else {
    splitIdx = Math.max(queryIdx, hashIdx);
  }

  const pathPart = splitIdx === -1 ? trimmed : trimmed.slice(0, splitIdx);
  const suffix = splitIdx === -1 ? '' : trimmed.slice(splitIdx);

  const { pathname } = stripLocalePrefix(pathPart || '/');
  const base = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  return `${base}${suffix}`;
}
