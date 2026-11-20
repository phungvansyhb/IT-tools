import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, isValidLocale } from '@/i18n/config';
import { analyzeNotFoundPath } from '@/lib/not-found';
import { buildNotFoundMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}): Promise<Metadata> {
  const { locale, rest } = await params;
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const rawPath = `/${[validLocale, ...(Array.isArray(rest) ? rest : [])].join('/')}`;
  const analyzed = analyzeNotFoundPath(rawPath);
  return buildNotFoundMetadata(validLocale, analyzed.context);
}

export default function LocalizedCatchAllNotFoundPage() {
  notFound();
}
