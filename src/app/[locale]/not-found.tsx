import React from 'react';
import Link from 'next/link';
import { DEFAULT_LOCALE, localePath } from '@/i18n/config';
import { getBundle } from '@/i18n/translator';

export default function LocaleNotFound() {
  const nf = getBundle(DEFAULT_LOCALE).common.notFound;

  return (
    <div
      style={{
        minHeight: '55vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <span className="glass-pill">404</span>
      <h1 className="page-title" style={{ margin: 0 }}>
        {nf.title}
      </h1>
      <p className="muted-text" style={{ margin: 0, maxWidth: '48ch' }}>
        {nf.description}
      </p>
      <Link href={localePath(DEFAULT_LOCALE, '/')} className="glass-btn glass-btn-primary">
        {nf.backHome}
      </Link>
    </div>
  );
}
