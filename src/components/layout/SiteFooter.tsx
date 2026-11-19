'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink, MessageSquarePlus } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { localePath } from '@/i18n/config';
import { getLocalizedInfoPages } from '@/lib/info/pages';
import { getSiteConfig } from '@/lib/site';
import { useFeedback } from '@/hooks/useFeedback';
import { BrandLogo } from '@/components/common/BrandLogo';

export function SiteFooter() {
  const { locale, t } = useI18n();
  const { openFeedbackModal } = useFeedback();

  const siteConfig = useMemo(() => getSiteConfig(), []);
  const infoPages = useMemo(() => getLocalizedInfoPages(locale), [locale]);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          {/* Zone 1: Brand + Privacy tagline */}
          <div className="site-footer-brand-col">
            <Link href={localePath(locale, '/')} className="site-footer-brand">
              <BrandLogo size={24} />
              <span>{t('brand.name')}</span>
            </Link>
            <p className="site-footer-tagline">{t('footer.tagline')}</p>
          </div>

          {/* Zone 2: Internal Backlinks (<nav>) */}
          <nav className="site-footer-nav" aria-label={t('footer.navAria')}>
            <span className="site-footer-heading">{t('footer.linksHeading')}</span>
            <ul className="site-footer-links">
              {infoPages.map((page) => (
                <li key={page.slug}>
                  <Link href={localePath(locale, `/${page.slug}`)} className="site-footer-link">
                    {page.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Zone 3: External GitHub + Feedback Trigger + Copyright */}
          <div className="site-footer-actions-col">
            <div className="site-footer-actions">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.openSourceLabel')}
                className="btn btn-sm"
              >
                <span>{t('footer.githubLabel')}</span>
                <ExternalLink size={13} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() =>
                  openFeedbackModal({
                    defaultToolId: 'general',
                    defaultTab: 'submit',
                    defaultType: 'feedback',
                  })
                }
              >
                <MessageSquarePlus size={13} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <span>{t('footer.feedbackBtn')}</span>
              </button>
            </div>
            <p className="site-footer-copyright">
              {t('footer.copyrightLine', { year: currentYear })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
