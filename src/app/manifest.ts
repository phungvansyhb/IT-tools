import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OmniDev IT-Tools Hub',
    short_name: 'OmniDev',
    description:
      'Privacy-first browser developer tools: image processing, JSON/YAML/CSV, SHA-256, JWT, Regex, OKLCH, Chmod, Cron, and DevOps cheatsheets.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#10b981',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
