import { ImageResponse } from 'next/og';
import { BrandOgTemplate } from '@/lib/brand/og-template';

export const alt = 'OmniDev / IT-Tools Hub — Privacy-First Developer & Diagnostic Tools';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(<BrandOgTemplate />, {
    ...size,
  });
}
