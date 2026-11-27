import type { Metadata } from 'next';
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  SUPPORTED_LOCALES,
  localePath,
  type Locale,
} from '@/i18n/config';
import { getBundle, getFixedT } from '@/i18n/translator';
import { getSiteConfig } from '@/lib/site';
import { CategoryDefinition, ToolDefinition } from '@/lib/tools/registry';
import { getInfoPageBySlug, getLocalizedInfoPage, type InfoPageSlug } from '@/lib/info/pages';
import type { NotFoundContext } from '@/lib/not-found/suggestions';

export const SITE_NAME = 'TienIchDev';
export const SITE_TAGLINE = 'Privacy-First Developer & Utility Tools Hub';
const SOCIAL_IMAGE_ALT = 'TienIchDev — Privacy-First Developer & Diagnostic Tools';

export function getSiteUrl(): string {
  return getSiteConfig().siteUrl;
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

function buildLanguageAlternates(path: string = '/'): Record<string, string> {
  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[LOCALE_META[locale].htmlLang] = `${base}${localePath(locale, path)}`;
  }
  languages['x-default'] = `${base}${localePath(DEFAULT_LOCALE, path)}`;
  return languages;
}

export function buildHomeMetadata(locale: Locale = DEFAULT_LOCALE): Metadata {
  const base = getSiteUrl();
  const url = `${base}${localePath(locale, '/')}`;
  const seo = getBundle(locale).common.seo;
  const brand = getBundle(locale).common.brand;

  return {
    metadataBase: getMetadataBase(),
    applicationName: brand.siteName,
    title: seo.homeTitle,
    description: seo.homeDescription,
    keywords: seo.homeKeywords,
    authors: [{ name: brand.siteName, url: base }],
    creator: brand.siteName,
    publisher: brand.siteName,
    category: 'technology',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates('/'),
    },
    openGraph: {
      title: seo.homeTitle,
      description: seo.homeDescription,
      url,
      siteName: brand.siteName,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_META[l].ogLocale
      ),
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.homeTitle,
      description: seo.homeDescription,
      images: ['/twitter-image'],
    },
  };
}

export function buildCategoryMetadata(
  category: CategoryDefinition,
  locale: Locale = DEFAULT_LOCALE
): Metadata {
  const base = getSiteUrl();
  const path = `/categories/${category.slug}`;
  const url = `${base}${localePath(locale, path)}`;
  const t = getFixedT(locale);
  const brand = getBundle(locale).common.brand;

  return {
    metadataBase: getMetadataBase(),
    title: t('seo.categoryTitleTemplate', {
      seoTitle: category.seoTitle,
      siteName: brand.siteName,
    }),
    description: category.seoDescription,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title: t('seo.categoryOgTitleTemplate', {
        name: category.name,
        siteName: brand.siteName,
      }),
      description: category.seoDescription,
      url,
      siteName: brand.siteName,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_META[l].ogLocale
      ),
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seo.categoryTwitterTitleTemplate', {
        name: category.name,
        siteName: brand.siteName,
      }),
      description: category.seoDescription,
      images: ['/twitter-image'],
    },
  };
}

export function buildToolMetadata(
  tool: ToolDefinition,
  category: CategoryDefinition,
  locale: Locale = DEFAULT_LOCALE
): Metadata {
  const base = getSiteUrl();
  const path = `/tools/${tool.category}/${tool.slug}`;
  const url = `${base}${localePath(locale, path)}`;
  const t = getFixedT(locale);
  const brand = getBundle(locale).common.brand;
  const title = t('seo.toolTitleTemplate', {
    toolName: tool.name,
    categoryName: category.name,
    siteName: brand.siteName,
  });

  return {
    metadataBase: getMetadataBase(),
    title,
    description: tool.longDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title,
      description: tool.longDescription,
      url,
      siteName: brand.siteName,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_META[l].ogLocale
      ),
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tool.shortDescription,
      images: ['/twitter-image'],
    },
  };
}

export function buildWebSiteJsonLd(locale: Locale = DEFAULT_LOCALE) {
  const base = getSiteUrl();
  const url = `${base}${localePath(locale, '/')}`;
  const brand = getBundle(locale).common.brand;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.siteName,
    description: brand.siteTagline,
    inLanguage: LOCALE_META[locale].htmlLang,
    url,
    publisher: {
      '@type': 'Organization',
      name: brand.siteName,
      url: base,
      logo: {
        '@type': 'ImageObject',
        url: `${base}/icons/icon-512.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildCollectionPageJsonLd(
  category: CategoryDefinition,
  tools: ToolDefinition[],
  locale: Locale = DEFAULT_LOCALE
) {
  const base = getSiteUrl();
  const brand = getBundle(locale).common.brand;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — ${brand.siteName}`,
    description: category.seoDescription,
    inLanguage: LOCALE_META[locale].htmlLang,
    url: `${base}${localePath(locale, `/categories/${category.slug}`)}`,
    hasPart: tools.map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      description: t.shortDescription,
      url: `${base}${localePath(locale, `/tools/${t.category}/${t.slug}`)}`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web Browser',
    })),
  };
}

export function buildToolJsonLd(
  tool: ToolDefinition,
  category: CategoryDefinition,
  locale: Locale = DEFAULT_LOCALE
) {
  const base = getSiteUrl();
  const homeUrl = `${base}${localePath(locale, '/')}`;
  const catUrl = `${base}${localePath(locale, `/categories/${category.slug}`)}`;
  const toolUrl = `${base}${localePath(locale, `/tools/${tool.category}/${tool.slug}`)}`;
  const homeLabel = getBundle(locale).common.actions.home;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.longDescription,
      inLanguage: LOCALE_META[locale].htmlLang,
      url: toolUrl,
      image: `${base}/opengraph-image`,
      isAccessibleForFree: true,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (Web Browser)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: tool.howItWorks,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeLabel, item: homeUrl },
        { '@type': 'ListItem', position: 2, name: category.name, item: catUrl },
        { '@type': 'ListItem', position: 3, name: tool.name, item: toolUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    },
  ];
}

export function buildInfoPageMetadata(
  slug: InfoPageSlug,
  locale: Locale = DEFAULT_LOCALE
): Metadata {
  const base = getSiteUrl();
  const path = `/${slug}`;
  const url = `${base}${localePath(locale, path)}`;
  const info = getLocalizedInfoPage(slug, locale);
  const brand = getBundle(locale).common.brand;

  return {
    metadataBase: getMetadataBase(),
    title: info.metaTitle,
    description: info.metaDescription,
    keywords: info.keywords,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title: info.metaTitle,
      description: info.metaDescription,
      url,
      siteName: brand.siteName,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_META[l].ogLocale
      ),
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: info.metaTitle,
      description: info.metaDescription,
      images: ['/twitter-image'],
    },
  };
}

export function buildInfoPageJsonLd(slug: InfoPageSlug, locale: Locale = DEFAULT_LOCALE) {
  const base = getSiteUrl();
  const homeUrl = `${base}${localePath(locale, '/')}`;
  const pageUrl = `${base}${localePath(locale, `/${slug}`)}`;
  const bundle = getBundle(locale);
  const homeLabel = bundle.common.actions.home;
  const infoDef = getInfoPageBySlug(slug);
  const info = getLocalizedInfoPage(slug, locale);
  const schemaType = infoDef?.schemaType ?? info.schemaType;
  const inLanguage = LOCALE_META[locale].htmlLang;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabel, item: homeUrl },
      { '@type': 'ListItem', position: 2, name: info.navLabel, item: pageUrl },
    ],
  };

  if (schemaType === 'FAQPage') {
    const faqs = bundle.pages.help.faqs;
    return [
      breadcrumbSchema,
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: info.title,
        description: info.metaDescription,
        inLanguage,
        url: pageUrl,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ];
  }

  return [
    breadcrumbSchema,
    {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: info.title,
      description: info.metaDescription,
      inLanguage,
      url: pageUrl,
    },
  ];
}

export function buildNotFoundMetadata(
  locale: Locale = DEFAULT_LOCALE,
  context: NotFoundContext = 'general'
): Metadata {
  const nf = getBundle(locale).common.notFound;
  const title = nf.seoTitle[context] ?? nf.seoTitle.general;
  const description = nf.seoDescription[context] ?? nf.seoDescription.general;

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

