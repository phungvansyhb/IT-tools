import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isValidLocale, localePath } from '@/i18n/config';
import { getBundle, getFixedT } from '@/i18n/translator';
import {
  CATEGORIES,
  getLocalizedCategoryBySlug,
  getLocalizedToolsByCategory,
} from '@/lib/tools/registry';
import { buildCategoryMetadata, buildCollectionPageJsonLd, buildNotFoundMetadata } from '@/lib/seo';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard, ToolBentoCard } from '@/components/bento/BentoCard';
import { ToolIcon } from '@/components/common/ToolIcon';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    CATEGORIES.map((cat) => ({ locale, category: cat.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const safeLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  if (!isValidLocale(locale)) return buildNotFoundMetadata(safeLocale, 'category');
  const cat = getLocalizedCategoryBySlug(slug, locale);
  if (!cat) return buildNotFoundMetadata(safeLocale, 'category');
  return buildCategoryMetadata(cat, locale);
}

export default async function LocalizedCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const category = getLocalizedCategoryBySlug(slug, locale);
  if (!category) notFound();

  const tools = getLocalizedToolsByCategory(category.slug, locale);
  const jsonLd = buildCollectionPageJsonLd(category, tools, locale);
  const t = getFixedT(locale);
  const common = getBundle(locale).common;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem' }}
      >
        <Link href={localePath(locale, '/')} className="muted-text">
          {common.actions.home}
        </Link>
        <ChevronRight size={14} className="subtle-text" />
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{category.name}</span>
      </nav>

      <BentoGrid>
        <BentoCard span="12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
              }}
            >
              <ToolIcon name={category.iconName} size={20} />
            </span>
            <div>
              <span className="glass-pill">
                {t('categoryPage.toolsPill', { count: tools.length })}
              </span>
            </div>
          </div>
          <h1 className="page-title" style={{ marginTop: '0.25rem' }}>
            {category.name}
          </h1>
          <p className="muted-text" style={{ margin: 0, maxWidth: '70ch', fontSize: '0.96rem' }}>
            {category.description}
          </p>
        </BentoCard>
      </BentoGrid>

      <BentoGrid>
        {tools.map((tool) => (
          <ToolBentoCard key={tool.id} tool={tool} category={category} />
        ))}
      </BentoGrid>
    </div>
  );
}
