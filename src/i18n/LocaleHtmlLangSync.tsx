'use client';

import { useEffect } from 'react';
import { LOCALE_META, type Locale } from './config';

export function LocaleHtmlLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    const htmlLang = LOCALE_META[locale].htmlLang;
    if (document.documentElement.lang !== htmlLang) {
      document.documentElement.lang = htmlLang;
    }
  }, [locale]);

  return null;
}
