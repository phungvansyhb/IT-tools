'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Home } from 'lucide-react';
import { LOCALE_META, SUPPORTED_LOCALES, localePath } from '@/i18n/config';
import { sanitizePathname } from '@/lib/feedback/debug-context';
import { BrandLogo } from '@/components/common/BrandLogo';

const THEME_STORAGE_KEY = 'omnidev_theme';

export function RootNotFoundView() {
  const [hydrated, setHydrated] = useState(false);
  const [cleanPath, setCleanPath] = useState('/');

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      let resolved: 'dark' | 'light' = 'dark';
      if (savedTheme === 'light' || savedTheme === 'dark') {
        resolved = savedTheme;
      } else if (
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: light)').matches
      ) {
        resolved = 'light';
      }
      document.documentElement.setAttribute('data-theme', resolved);
    } catch {
      // Ignore storage access errors
    }

    const sanitized = sanitizePathname(window.location.pathname || '/');
    const id = window.requestAnimationFrame(() => {
      setCleanPath(sanitized);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <main className="root-notfound-viewport">
      <div className="glass-surface root-notfound-card">
        <div className="root-notfound-brand">
          <BrandLogo size={36} />
          <div className="root-notfound-brand-text">
            <span className="root-notfound-brand-name">OmniDev</span>
            <span className="subtle-text root-notfound-brand-sub">IT-Tools Hub</span>
          </div>
          <span className="glass-pill glass-pill-active font-mono" style={{ marginLeft: 'auto' }}>
            &gt;_ 404
          </span>
        </div>

        <div className="root-notfound-body">
          <h1 className="page-title" style={{ fontSize: 'clamp(1.45rem, 3vw, 2rem)' }}>
            Page not found
          </h1>
          <p className="muted-text" style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.6 }}>
            The URL you requested does not match an active route on OmniDev IT-Tools. Choose your
            preferred language hub or return to the main workspace.
          </p>

          {hydrated && (
            <div className="notfound-path-row">
              <span className="subtle-text notfound-path-label">Requested path:</span>
              <code className="notfound-path-pill font-mono">{cleanPath}</code>
            </div>
          )}
        </div>

        <div className="root-notfound-actions">
          <Link href={localePath('en', '/')} className="btn btn-primary">
            <Home size={15} />
            <span>Back to OmniDev Hub</span>
          </Link>
          <Link href={localePath('en', '/help')} className="btn">
            <HelpCircle size={15} />
            <span>Help &amp; FAQ</span>
          </Link>
        </div>

        <div className="root-notfound-locales">
          <span className="subtle-text" style={{ fontSize: '0.78rem' }}>
            Languages:
          </span>
          <div className="root-notfound-locale-list">
            {SUPPORTED_LOCALES.map((loc) => (
              <Link key={loc} href={localePath(loc, '/')} className="glass-pill">
                <span className="font-mono" style={{ fontWeight: 600 }}>
                  {LOCALE_META[loc].shortLabel}
                </span>
                <span>{LOCALE_META[loc].nativeName}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
