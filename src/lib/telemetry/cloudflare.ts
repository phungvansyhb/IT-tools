import { stripLocalePrefix } from '@/i18n/config';

export const CLOUDFLARE_BEACON_SCRIPT_URL = 'https://static.cloudflareinsights.com/beacon.min.js';

export interface CloudflareBeaconOptions {
  spa?: boolean;
}

const CLOUDFLARE_TOKEN_REGEX = /^[a-zA-Z0-9_-]{8,128}$/;

/**
 * Validates and trims an optional Cloudflare Web Analytics beacon token.
 * Pure helper: callers pass an explicit value rather than reading `process.env` here.
 */
export function resolveCloudflareBeaconToken(rawToken?: string | null): string | null {
  if (typeof rawToken !== 'string') {
    return null;
  }

  const trimmed = rawToken.trim();
  if (!trimmed || !CLOUDFLARE_TOKEN_REGEX.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Builds the serialized JSON string for Cloudflare's `data-cf-beacon` script attribute.
 * Returns `null` if the provided token is missing or invalid.
 */
export function buildCloudflareBeaconConfig(
  rawToken?: string | null,
  options?: CloudflareBeaconOptions
): string | null {
  const token = resolveCloudflareBeaconToken(rawToken);
  if (!token) {
    return null;
  }

  return JSON.stringify({
    token,
    spa: options?.spa ?? true,
  });
}

function normalizePathname(rawPathname: string): string {
  const collapsed = rawPathname.replace(/\/{2,}/g, '/');
  if (!collapsed || collapsed === '/') {
    return '/';
  }
  return collapsed.startsWith('/') ? collapsed : `/${collapsed}`;
}

function stripQueryAndHash(rawPath: string): string {
  const queryIdx = rawPath.indexOf('?');
  const hashIdx = rawPath.indexOf('#');
  let splitIdx = -1;
  if (queryIdx !== -1 && hashIdx !== -1) {
    splitIdx = Math.min(queryIdx, hashIdx);
  } else {
    splitIdx = Math.max(queryIdx, hashIdx);
  }
  return splitIdx === -1 ? rawPath : rawPath.slice(0, splitIdx);
}

/**
 * Safely extracts a normalized pathname from either an absolute HTTP(S) URL
 * or a relative path, removing query parameters and hash fragments.
 */
export function extractTelemetryPathname(rawUrlOrPath: string): string {
  if (typeof rawUrlOrPath !== 'string') {
    return '/';
  }

  const trimmed = rawUrlOrPath.trim();
  if (!trimmed) {
    return '/';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return normalizePathname(parsed.pathname);
      }
    } catch {
      // Fall back to relative path stripping if URL parsing fails.
    }
  }

  const pathOnly = stripQueryAndHash(trimmed);
  return normalizePathname(pathOnly);
}

function isAdminSegmentPath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return lower === '/admin' || lower.startsWith('/admin/');
}

function isAdminRouteTemplate(routeTemplate: string): boolean {
  const normalizedRoute = extractTelemetryPathname(routeTemplate).toLowerCase();
  if (isAdminSegmentPath(normalizedRoute)) {
    return true;
  }
  if (normalizedRoute === '/[locale]/admin' || normalizedRoute.startsWith('/[locale]/admin/')) {
    return true;
  }
  const strippedRoute = stripLocalePrefix(normalizedRoute);
  return isAdminSegmentPath(strippedRoute.pathname);
}

/**
 * Returns true if the URL/path or dynamic route template points to an excluded
 * admin route (e.g., `/admin`, `/en/admin/feedback`, `/[locale]/admin/feedback`).
 * Does NOT exclude unrelated paths such as `/en/administrator` or `/tools/text/admin-notes`.
 */
export function isTelemetryExcludedPath(
  rawUrlOrPath: string,
  routeTemplate?: string | null
): boolean {
  const rawPathname = extractTelemetryPathname(rawUrlOrPath).toLowerCase();
  if (isAdminSegmentPath(rawPathname)) {
    return true;
  }

  const stripped = stripLocalePrefix(rawPathname);
  if (isAdminSegmentPath(stripped.pathname)) {
    return true;
  }

  if (routeTemplate && typeof routeTemplate === 'string' && routeTemplate.trim()) {
    if (isAdminRouteTemplate(routeTemplate)) {
      return true;
    }
  }

  return false;
}

/**
 * Strips query parameters and hash fragments from a telemetry URL so client-side
 * tool inputs (`?state=...`, `#...`) are never retained.
 */
export function sanitizeTelemetryUrl(rawUrl: string): string {
  if (typeof rawUrl !== 'string') {
    return '/';
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return '/';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        const normalizedPath = normalizePathname(parsed.pathname);
        return `${parsed.origin}${normalizedPath}`;
      }
    } catch {
      // Fall back to relative pathname extraction.
    }
  }

  return extractTelemetryPathname(trimmed);
}
