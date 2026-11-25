'use client';

import React, { Suspense } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import {
  CLOUDFLARE_BEACON_SCRIPT_URL,
  buildCloudflareBeaconConfig,
  isTelemetryExcludedPath,
} from '@/lib/telemetry';

function CloudflareAnalyticsInner({ token }: { token: string }) {
  const pathname = usePathname();

  if (pathname && isTelemetryExcludedPath(pathname)) {
    return null;
  }

  const beaconConfig = buildCloudflareBeaconConfig(token, { spa: true });
  if (!beaconConfig) {
    return null;
  }

  return (
    <Script
      id="cloudflare-web-analytics"
      src={CLOUDFLARE_BEACON_SCRIPT_URL}
      strategy="afterInteractive"
      defer
      data-cf-beacon={beaconConfig}
    />
  );
}

export function CloudflareAnalytics({ token }: { token: string }): React.JSX.Element | null {
  if (!buildCloudflareBeaconConfig(token)) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <CloudflareAnalyticsInner token={token} />
    </Suspense>
  );
}
