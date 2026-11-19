import i18next, { type TFunction } from 'i18next';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isValidLocale, type Locale } from './config';
import type { LocaleBundle } from './types';
import { enBundle } from './locales/en';
import { viBundle } from './locales/vi';
import { jaBundle } from './locales/ja';
import { zhBundle } from './locales/zh';

export const BUNDLES: Record<Locale, LocaleBundle> = {
  en: enBundle,
  vi: viBundle,
  ja: jaBundle,
  zh: zhBundle,
};

function buildI18nextResources() {
  const resources: Record<
    string,
    {
      common: LocaleBundle['common'];
      catalog: LocaleBundle['catalog'];
      tools: LocaleBundle['tools'];
      cheatsheets: LocaleBundle['cheatsheets'];
      pages: LocaleBundle['pages'];
    }
  > = {};

  for (const locale of SUPPORTED_LOCALES) {
    const bundle = BUNDLES[locale];
    if (bundle) {
      resources[locale] = {
        common: bundle.common,
        catalog: bundle.catalog,
        tools: bundle.tools,
        cheatsheets: bundle.cheatsheets,
        pages: bundle.pages,
      };
    }
  }

  return resources;
}

const i18nInstance = i18next.createInstance();

void i18nInstance.init({
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: [...SUPPORTED_LOCALES],
  ns: ['common', 'catalog', 'tools', 'cheatsheets', 'pages'],
  defaultNS: 'common',
  fallbackNS: 'common',
  resources: buildI18nextResources(),
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export type FixedT = TFunction<['common', 'catalog', 'tools', 'cheatsheets', 'pages']>;

/**
 * Returns a stateless, race-free i18next translation function bound to `locale`.
 * Never mutates the shared i18n instance language.
 */
export function getFixedT(locale: Locale = DEFAULT_LOCALE): FixedT {
  const safeLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  return i18nInstance.getFixedT(safeLocale, ['common', 'catalog', 'tools', 'cheatsheets', 'pages']);
}

/**
 * Returns the strongly typed LocaleBundle for the requested locale,
 * falling back cleanly to `enBundle` when a locale dictionary is not yet registered.
 */
export function getBundle(locale: Locale = DEFAULT_LOCALE): LocaleBundle {
  const safeLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  return BUNDLES[safeLocale] ?? enBundle;
}
