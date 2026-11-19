import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SUPPORTED_LOCALES, isValidLocale } from '@/i18n/config';
import { buildInfoPageJsonLd, buildInfoPageMetadata } from '@/lib/seo';
import { InfoPageLayout } from '@/components/info/InfoPageLayout';

const PAGE_SLUG = 'contact' as const;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildInfoPageMetadata(PAGE_SLUG, locale);
}

export default async function LocalizedContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const jsonLd = buildInfoPageJsonLd(PAGE_SLUG, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InfoPageLayout slug={PAGE_SLUG} locale={locale} />
    </>
  );
}
