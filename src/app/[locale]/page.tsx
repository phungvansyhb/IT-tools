import React from 'react';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import { HomeHubClient } from '@/components/home/HomeHubClient';
import { buildWebSiteJsonLd } from '@/lib/seo';

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const jsonLd = buildWebSiteJsonLd(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHubClient />
    </>
  );
}
