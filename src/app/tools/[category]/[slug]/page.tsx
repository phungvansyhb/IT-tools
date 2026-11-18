import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  TOOLS,
  getCategoryBySlug,
  getRelatedTools,
  getToolBySlug,
} from '@/lib/tools/registry';
import { buildToolJsonLd, buildToolMetadata } from '@/lib/seo';
import { ToolWorkspace } from '@/components/tools/ToolWorkspace';

export function generateStaticParams() {
  return TOOLS.map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category: catSlug, slug } = await params;
  const tool = getToolBySlug(catSlug, slug);
  const category = getCategoryBySlug(catSlug);
  if (!tool || !category) return {};
  return buildToolMetadata(tool, category);
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: catSlug, slug } = await params;
  const tool = getToolBySlug(catSlug, slug);
  const category = getCategoryBySlug(catSlug);
  if (!tool || !category) notFound();

  const related = getRelatedTools(tool, 3);
  const jsonLd = buildToolJsonLd(tool, category);

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
