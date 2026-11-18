import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SUPPORTED_LOCALES, isValidLocale } from '@/i18n/config';
import { getBundle } from '@/i18n/translator';
import { AdminFeedbackClient } from '@/components/admin/AdminFeedbackClient';

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
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    };
  }

  const { adminFeedback } = getBundle(locale).common;

  return {
    title: adminFeedback.pageTitle,
    description: adminFeedback.pageDescription,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function AdminFeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  return <AdminFeedbackClient />;
}
