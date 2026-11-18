import React from 'react';
import { HomeHubClient } from '@/components/home/HomeHubClient';
import { buildWebSiteJsonLd } from '@/lib/seo';

export default function HomePage() {
  const jsonLd = buildWebSiteJsonLd();

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
