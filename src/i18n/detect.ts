import { DEFAULT_LOCALE, isValidLocale, type Locale } from './config';

function mapLanguageTagToLocale(tag: string): Locale | null {
  const normalized = tag.trim().toLowerCase().replace(/_/g, '-');
  if (!normalized || normalized === '*') return null;

  if (normalized === 'en' || normalized.startsWith('en-')) {
    return 'en';
  }
  if (normalized === 'vi' || normalized.startsWith('vi-')) {
    return 'vi';
  }
  if (normalized === 'ja' || normalized.startsWith('ja-')) {
    return 'ja';
  }
  if (
    normalized === 'zh' ||
    normalized.startsWith('zh-cn') ||
    normalized.startsWith('zh-sg') ||
    normalized.startsWith('zh-hans') ||
    normalized.startsWith('zh-')
  ) {
    return 'zh';
  }
  return null;
}

/**
 * Parses an HTTP Accept-Language header (supporting q-weights) and returns the
 * highest-priority supported Locale, or null if no supported locale matches.
 */
export function parseAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header || typeof header !== 'string') return null;

  const candidates = header
    .split(',')
    .map((part, index) => {
      const [rawTag, ...params] = part.trim().split(';');
      let q = 1;
      for (const param of params) {
        const [k, v] = param.trim().split('=');
        if (k?.toLowerCase() === 'q' && v !== undefined) {
          const parsed = Number(v);
          q = Number.isFinite(parsed) ? parsed : 0;
        }
      }
      return { tag: rawTag ?? '', q, index };
    })
    .filter((item) => item.tag !== '' && item.q > 0)
    .sort((a, b) => (b.q !== a.q ? b.q - a.q : a.index - b.index));

  for (const candidate of candidates) {
    const matched = mapLanguageTagToLocale(candidate.tag);
    if (matched) return matched;
  }

  return null;
}

/**
 * Resolves the best locale using priority: Cookie -> Accept-Language -> DEFAULT_LOCALE.
 */
export function detectBestLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  const fromHeader = parseAcceptLanguage(acceptLanguage);
  if (fromHeader) {
    return fromHeader;
  }

  return DEFAULT_LOCALE;
}

const PUBLIC_FILE_REGEX = /\.[a-zA-Z0-9]+$/;

const BYPASS_EXACT_PATHS = new Set([
  '/favicon.ico',
  '/icon.svg',
  '/icon',
  '/apple-icon',
  '/opengraph-image',
  '/twitter-image',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
]);

/**
 * Returns true when a request pathname corresponds to Next.js internals, API routes,
 * metadata/icon endpoints, or static public files that must not receive a locale 307 redirect.
 */
export function shouldBypassLocaleProxy(pathname: string): boolean {
  if (
    pathname.startsWith('/_next') ||
    pathname === '/cdn-cgi' ||
    pathname.startsWith('/cdn-cgi/') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons/')
  ) {
    return true;
  }

  if (BYPASS_EXACT_PATHS.has(pathname)) {
    return true;
  }

  return PUBLIC_FILE_REGEX.test(pathname);
}
