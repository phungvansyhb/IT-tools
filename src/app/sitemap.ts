import type { MetadataRoute } from 'next';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { getSiteUrl } from '@/lib/seo';
import { DEFAULT_LOCALE, LOCALE_META, SUPPORTED_LOCALES, localePath } from '@/i18n/config';

function buildAlternates(path: string) {
  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[LOCALE_META[locale].htmlLang] = `${base}${localePath(locale, path)}`;
  }
  languages['x-default'] = `${base}${localePath(DEFAULT_LOCALE, path)}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    entries.push({
      url: `${base}${localePath(locale, '/')}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: locale === DEFAULT_LOCALE ? 1 : 0.95,
      alternates: buildAlternates('/'),
    });

    for (const cat of CATEGORIES) {
      const catPath = `/categories/${cat.slug}`;
      entries.push({
        url: `${base}${localePath(locale, catPath)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: buildAlternates(catPath),
      });
    }

    for (const tool of TOOLS) {
      const toolPath = `/tools/${tool.category}/${tool.slug}`;
      entries.push({
        url: `${base}${localePath(locale, toolPath)}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: tool.featured ? 0.9 : 0.8,
        alternates: buildAlternates(toolPath),
      });
    }
  }

  return entries;
}
