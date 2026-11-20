import React from 'react';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/glass.css';
import { buildNotFoundMetadata } from '@/lib/seo';
import { RootNotFoundView } from '@/components/not-found/RootNotFoundView';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = buildNotFoundMetadata('en', 'general');

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <RootNotFoundView />
      </body>
    </html>
  );
}
