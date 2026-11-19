import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getBundle } from '@/i18n/translator';

export const INFO_PAGE_SLUGS = ['about', 'help', 'privacy', 'terms', 'contact'] as const;

export type InfoPageSlug = (typeof INFO_PAGE_SLUGS)[number];

export type InfoPageSchemaType = 'AboutPage' | 'FAQPage' | 'WebPage' | 'ContactPage';

export interface InfoPageDefinition {
  slug: InfoPageSlug;
  iconName: 'Info' | 'HelpCircle' | 'Shield' | 'FileText' | 'Mail';
  sitemapPriority: number;
  schemaType: InfoPageSchemaType;
}

export const INFO_PAGES: readonly InfoPageDefinition[] = [
  {
    slug: 'about',
    iconName: 'Info',
    sitemapPriority: 0.75,
    schemaType: 'AboutPage',
  },
  {
    slug: 'help',
    iconName: 'HelpCircle',
    sitemapPriority: 0.75,
    schemaType: 'FAQPage',
  },
  {
    slug: 'privacy',
    iconName: 'Shield',
    sitemapPriority: 0.65,
    schemaType: 'WebPage',
  },
  {
    slug: 'terms',
    iconName: 'FileText',
    sitemapPriority: 0.65,
    schemaType: 'WebPage',
  },
  {
    slug: 'contact',
    iconName: 'Mail',
    sitemapPriority: 0.7,
    schemaType: 'ContactPage',
  },
] as const;

export function isInfoPageSlug(value: string): value is InfoPageSlug {
  return (INFO_PAGE_SLUGS as readonly string[]).includes(value);
}

export function getInfoPageBySlug(slug: string): InfoPageDefinition | undefined {
  return INFO_PAGES.find((page) => page.slug === slug);
}

export interface LocalizedInfoPage extends InfoPageDefinition {
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  keywords: string[];
}

export function getLocalizedInfoPage(
  slug: InfoPageSlug,
  locale: Locale = DEFAULT_LOCALE
): LocalizedInfoPage {
  const def = getInfoPageBySlug(slug) ?? INFO_PAGES[0];
  const content = getBundle(locale).pages[def.slug];
  return {
    ...def,
    navLabel: content.navLabel,
    title: content.title,
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    subtitle: content.subtitle,
    keywords: content.keywords,
  };
}

export function getLocalizedInfoPages(locale: Locale = DEFAULT_LOCALE): LocalizedInfoPage[] {
  return INFO_PAGES.map((page) => getLocalizedInfoPage(page.slug, locale));
}
