import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'TienIchDev — IT-Tools Hub',
    short_name: 'TienIchDev',
    description:
      'Privacy-first browser developer & diagnostic tools: 28 tools across 7 categories including image processing, JSON/YAML/CSV, SHA-256, JWT, Regex, OKLCH, Chmod, Cron, DevOps cheatsheets, and hardware/network diagnostics.',
    start_url: '/',
    scope: '/',
    lang: 'en',
    categories: ['developer', 'utilities', 'productivity'],
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#10b981',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
