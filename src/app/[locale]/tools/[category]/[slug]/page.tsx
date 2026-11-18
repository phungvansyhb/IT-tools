import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SUPPORTED_LOCALES, isValidLocale } from '@/i18n/config';
import {
  TOOLS,
  getLocalizedCategoryBySlug,
  getLocalizedRelatedTools,
  getLocalizedToolBySlug,
} from '@/lib/tools/registry';
import { buildToolJsonLd, buildToolMetadata } from '@/lib/seo';
import { ToolWorkspace } from '@/components/tools/ToolWorkspace';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    TOOLS.map((tool) => ({
      locale,
      category: tool.category,
      slug: tool.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category: catSlug, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const tool = getLocalizedToolBySlug(catSlug, slug, locale);
  const category = getLocalizedCategoryBySlug(catSlug, locale);
  if (!tool || !category) return {};
  return buildToolMetadata(tool, category, locale);
}

export default async function LocalizedToolDetailPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category: catSlug, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const tool = getLocalizedToolBySlug(catSlug, slug, locale);
  const category = getLocalizedCategoryBySlug(catSlug, locale);
  if (!tool || !category) notFound();

  const related = getLocalizedRelatedTools(tool, locale, 3);
  const jsonLd = buildToolJsonLd(tool, category, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolWorkspace tool={tool} category={category} relatedTools={related} />
    </>
  );
}
