import type { MetadataRoute } from 'next';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { getSiteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const homeEntry: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${base}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${base}/tools/${tool.category}/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: tool.featured ? 0.9 : 0.8,
  }));

  return [...homeEntry, ...categoryEntries, ...toolEntries];
}
