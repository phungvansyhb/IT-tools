import { DEFAULT_LOCALE, isValidLocale, type Locale } from '@/i18n/config';
import type { DebugContextPayload } from './types';
import { isValidToolId } from './validation';

const PATHNAME_MAX = 160;
const USER_AGENT_MAX = 120;
const VIEWPORT_MAX = 32;
const PLATFORM_MAX = 48;

/**
 * Strips any `?query` (including `?state=...`) and `#hash` from a path or URL,
 * preserving only a normalized pathname capped at 160 characters.
 */
export function sanitizePathname(rawPath: string): string {
  const trimmed = typeof rawPath === 'string' ? rawPath.trim() : '';
  if (!trimmed) return '/';

  let pathOnly = trimmed;

  // Handle full URLs safely if passed
  if (/^https?:\/\//i.test(pathOnly)) {
    try {
      const parsed = new URL(pathOnly);
      pathOnly = parsed.pathname || '/';
    } catch {
      const schemeIdx = pathOnly.indexOf('://');
      const slashIdx = pathOnly.indexOf('/', schemeIdx + 3);
      pathOnly = slashIdx === -1 ? '/' : pathOnly.slice(slashIdx);
    }
  }

  const queryIdx = pathOnly.indexOf('?');
  const hashIdx = pathOnly.indexOf('#');
  let cutIdx = -1;
  if (queryIdx !== -1 && hashIdx !== -1) {
    cutIdx = Math.min(queryIdx, hashIdx);
  } else {
    cutIdx = Math.max(queryIdx, hashIdx);
  }

  if (cutIdx !== -1) {
    pathOnly = pathOnly.slice(0, cutIdx);
  }

  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  return (normalized || '/').slice(0, PATHNAME_MAX);
}

/**
 * Truncates and normalizes User-Agent strings safely to <= 120 characters.
 */
export function summarizeUserAgent(ua: string): string {
  if (typeof ua !== 'string') return 'unknown';
  const compact = ua.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!compact) return 'unknown';
  return compact.slice(0, USER_AGENT_MAX);
}

export interface BuildSafeDebugContextInput {
  toolId?: string;
  locale?: Locale | string;
  pathname?: string;
  theme?: 'dark' | 'light' | string;
  viewport?: string;
  platform?: string;
  userAgent?: string;
}

/**
 * Constructs a strictly bounded, privacy-safe technical metadata payload.
 * Never accepts or accesses tool input values, files, JWTs, or URL query/hash params.
 */
export function buildSafeDebugContext(
  input: BuildSafeDebugContextInput = {}
): DebugContextPayload {
  const toolId = isValidToolId(input.toolId, true) ? input.toolId.trim() : 'general';
  const locale: Locale = isValidLocale(input.locale) ? input.locale : DEFAULT_LOCALE;
  const pathname = sanitizePathname(input.pathname ?? '/');
  const theme: 'dark' | 'light' = input.theme === 'light' ? 'light' : 'dark';

  const rawViewport = typeof input.viewport === 'string' ? input.viewport.trim() : '';
  const viewportMatch = rawViewport.match(/^(\d{2,5})\s*[x×]\s*(\d{2,5})$/i);
  const viewport = viewportMatch
    ? `${viewportMatch[1]}x${viewportMatch[2]}`.slice(0, VIEWPORT_MAX)
    : (rawViewport.replace(/[^\dx×]/gi, '').slice(0, VIEWPORT_MAX) || 'unknown');

  const rawPlatform = typeof input.platform === 'string' ? input.platform.trim() : '';
  const platform =
    rawPlatform.replace(/[\r\n\t]+/g, ' ').slice(0, PLATFORM_MAX) || 'unknown';

  const userAgentShort = summarizeUserAgent(input.userAgent ?? '');

  return {
    toolId,
    locale,
    pathname,
    theme,
    viewport,
    platform,
    userAgentShort,
  };
}
