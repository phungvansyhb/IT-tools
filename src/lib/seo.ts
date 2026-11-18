import type { Metadata } from 'next';
import { CategoryDefinition, ToolDefinition } from '@/lib/tools/registry';

export const SITE_NAME = 'OmniDev IT-Tools';
export const SITE_TAGLINE = 'Privacy-First Developer & Utility Tools Hub';

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export function buildHomeMetadata(): Metadata {
  const url = getSiteUrl();
  const title = `${SITE_NAME} — 24+ Privacy-First Browser Developer Tools`;
  const description =
    'High-performance, 100% client-side developer utilities: Image converter & compressor, JSON/YAML/CSV, SHA-256, JWT decoder, Regex tester, OKLCH & WCAG contrast, Chmod, Cron, and DevOps cheatsheets.';

  return {
    title,
    description,
    keywords: [
      'developer tools',
      'it tools',
      'jwt decoder',
      'json yaml converter',
      'regex tester',
      'oklch converter',
      'wcag contrast checker',
      'chmod calculator',
      'cron parser',
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function buildCategoryMetadata(category: CategoryDefinition): Metadata {
  const url = `${getSiteUrl()}/categories/${category.slug}`;
  return {
    title: `${category.seoTitle} | ${SITE_NAME}`,
    description: category.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${category.name} — ${SITE_NAME}`,
      description: category.seoDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | ${SITE_NAME}`,
      description: category.seoDescription,
    },
  };
}

export function buildToolMetadata(tool: ToolDefinition, category: CategoryDefinition): Metadata {
  const url = `${getSiteUrl()}/tools/${tool.category}/${tool.slug}`;
  const title = `${tool.name} — Free Online ${category.name} Tool | ${SITE_NAME}`;
  return {
    title,
    description: tool.longDescription,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: tool.longDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tool.shortDescription,
    },
  };
}

export function buildWebSiteJsonLd() {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildCollectionPageJsonLd(category: CategoryDefinition, tools: ToolDefinition[]) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — ${SITE_NAME}`,
    description: category.seoDescription,
    url: `${url}/categories/${category.slug}`,
    hasPart: tools.map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      description: t.shortDescription,
      url: `${url}/tools/${t.category}/${t.slug}`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web Browser',
    })),
  };
}

export function buildToolJsonLd(tool: ToolDefinition, category: CategoryDefinition) {
  const url = getSiteUrl();
  const toolUrl = `${url}/tools/${tool.category}/${tool.slug}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.longDescription,
      url: toolUrl,
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: url },
        { '@type': 'ListItem', position: 2, name: category.name, item: `${url}/categories/${category.slug}` },
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
