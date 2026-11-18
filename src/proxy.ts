import { NextRequest, NextResponse } from 'next/server';
import {
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
  isValidLocale,
  localePath,
  type Locale,
} from '@/i18n/config';
import { detectBestLocale } from '@/i18n/detect';

const PUBLIC_FILE_REGEX = /\.[a-zA-Z0-9]+$/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip Next.js internals, API routes, metadata endpoints, and static public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split('/')[1];

  if (isValidLocale(firstSegment)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE_NAME)?.value !== firstSegment) {
      response.cookies.set(LOCALE_COOKIE_NAME, firstSegment, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
    }
    return response;
  }

  // Unprefixed route -> detect locale via Cookie -> Accept-Language -> DEFAULT_LOCALE ('en')
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const acceptLanguage = request.headers.get('accept-language');
  const resolvedLocale: Locale = detectBestLocale({
    cookieLocale,
    acceptLanguage,
  });

  const targetPathname = localePath(resolvedLocale, pathname);
  const redirectUrl = new URL(`${targetPathname}${search}`, request.url);
  const response = NextResponse.redirect(redirectUrl, 307);
  response.cookies.set(LOCALE_COOKIE_NAME, resolvedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\..*).*)',
  ],
};

// Keep SUPPORTED_LOCALES referenced for static clarity
export { SUPPORTED_LOCALES };
