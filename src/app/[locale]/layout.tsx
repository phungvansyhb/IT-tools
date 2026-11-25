import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_JP, Noto_Sans_SC } from 'next/font/google';
import '../globals.css';
import '@/styles/glass.css';
import '@/styles/bento.css';
import { LOCALE_META, SUPPORTED_LOCALES, isValidLocale } from '@/i18n/config';
import { I18nProvider } from '@/i18n/client';
import { LocaleHtmlLangSync } from '@/i18n/LocaleHtmlLangSync';
import { UserWorkspaceProvider } from '@/hooks/useUserWorkspace';
import { FeedbackProvider } from '@/hooks/useFeedback';
import { AppShell } from '@/components/layout/AppShell';
import { CloudflareAnalytics } from '@/components/telemetry/CloudflareAnalytics';
import { buildHomeMetadata, getMetadataBase } from '@/lib/seo';
import { resolveCloudflareBeaconToken } from '@/lib/telemetry';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
});

const notoSansJp = Noto_Sans_JP({
  variable: '--font-jp',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const notoSansSc = Noto_Sans_SC({
  variable: '--font-sc',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin', 'vietnamese'],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {
      metadataBase: getMetadataBase(),
    };
  }
  return buildHomeMetadata(locale);
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const cfBeaconToken = resolveCloudflareBeaconToken(
    process.env.NEXT_PUBLIC_CF_BEACON_TOKEN
  );

  return (
    <html
      lang={LOCALE_META[locale].htmlLang}
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansJp.variable} ${notoSansSc.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <I18nProvider locale={locale}>
          <LocaleHtmlLangSync locale={locale} />
          <UserWorkspaceProvider>
            <FeedbackProvider>
              <AppShell>{children}</AppShell>
            </FeedbackProvider>
          </UserWorkspaceProvider>
        </I18nProvider>
        {cfBeaconToken && <CloudflareAnalytics token={cfBeaconToken} />}
      </body>
    </html>
  );
}
