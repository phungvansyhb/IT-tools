import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight, Home, ShieldCheck } from 'lucide-react';
import { localePath, type Locale } from '@/i18n/config';
import { getBundle } from '@/i18n/translator';
import {
  getLocalizedInfoPage,
  getLocalizedInfoPages,
  type InfoPageSlug,
} from '@/lib/info/pages';
import { getLocalizedCategories, getLocalizedTools } from '@/lib/tools/registry';
import { getSiteConfig } from '@/lib/site';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ToolIcon } from '@/components/common/ToolIcon';
import { InfoFeedbackActions } from '@/components/info/InfoFeedbackActions';

export interface InfoPageLayoutProps {
  slug: InfoPageSlug;
  locale: Locale;
}

export function InfoPageLayout({ slug, locale }: InfoPageLayoutProps) {
  const bundle = getBundle(locale);
  const pages = bundle.pages;
  const shared = pages.shared;
  const common = bundle.common;
  const pageMeta = getLocalizedInfoPage(slug, locale);
  const pageData = pages[slug];
  const allInfoPages = getLocalizedInfoPages(locale);
  const relatedInfoPages = allInfoPages.filter((p) => p.slug !== slug);
  const categories = getLocalizedCategories(locale);
  const featuredTools = getLocalizedTools(locale)
    .filter((tool) => tool.featured)
    .slice(0, 6);
  const siteConfig = getSiteConfig();

  const sections = pageData.sections;
  const isOddSectionCount = sections.length % 2 === 1;

  return (
    <div className="info-page-stack">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="info-page-breadcrumb">
        <Link href={localePath(locale, '/')}>{shared.breadcrumbHome}</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{pageMeta.navLabel}</span>
      </nav>

      {/* Hero Bento Header */}
      <header className="bento-card glass-surface info-page-header">
        <div className="info-page-meta-row">
          {slug === 'about' ? (
            <BrandLogo size={36} />
          ) : (
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
                flexShrink: 0,
              }}
            >
              <ToolIcon name={pageMeta.iconName} size={22} />
            </span>
          )}

          <span className="glass-pill badge-success">
            <ShieldCheck size={13} aria-hidden="true" />
            <span>{shared.privacyFirstBadge}</span>
          </span>

          <span className="glass-pill">
            <span>
              {shared.lastUpdatedLabel}: {shared.lastUpdatedDate}
            </span>
          </span>
        </div>

        <h1 className="page-title">{pageData.title}</h1>
        <p className="info-page-subtitle">{pageData.subtitle}</p>
      </header>

      {/* Content Sections Grid */}
      <section className="info-page-sections-grid" aria-label={pageData.title}>
        {sections.map((section, idx) => {
          const isSingleFull = sections.length === 1 || (isOddSectionCount && idx === sections.length - 1);
          const spanClass = isSingleFull ? 'bento-span-12' : 'bento-span-6';
          return (
            <article key={section.heading} className={`bento-card glass-surface info-page-card ${spanClass}`}>
              <h2 className="section-title">{section.heading}</h2>
              <p className="info-page-body">{section.body}</p>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="info-page-bullets">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </section>

      {/* Help FAQ Accordion (pure semantic <details>/<summary>, zero client JS) */}
      {slug === 'help' && (
        <section className="bento-card glass-surface info-page-card" aria-labelledby="help-faq-heading">
          <h2 id="help-faq-heading" className="section-title">
            {common.toolWorkspace.faqTitle}
          </h2>
          <div className="info-page-faq-list">
            {pages.help.faqs.map((faq, idx) => (
              <details key={idx} className="info-page-faq-item">
                <summary className="info-page-faq-summary">
                  <span>{faq.question}</span>
                  <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
                </summary>
                <div className="info-page-faq-answer">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Feedback / Contact Actions */}
      {(slug === 'help' || slug === 'contact') && (
        <InfoFeedbackActions
          variant={slug}
          supportEmail={siteConfig.supportEmail}
          githubUrl={siteConfig.githubUrl}
        />
      )}

      {/* Internal Backlinks Strip: Explore Tool Suites & Featured Tools + Related Pages */}
      <section className="info-page-sections-grid" aria-label={shared.exploreToolsHeading}>
        <div className="bento-card glass-surface info-page-card bento-span-7">
          <h2 className="section-title">{shared.exploreToolsHeading}</h2>
          <div className="info-page-backlinks">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={localePath(locale, `/categories/${cat.slug}`)}
                className="glass-pill"
              >
                <ToolIcon name={cat.iconName} size={13} />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
          <div className="info-page-backlinks">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={localePath(locale, `/tools/${tool.category}/${tool.slug}`)}
                className="btn btn-sm"
              >
                <span>{tool.name}</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <nav
          className="bento-card glass-surface info-page-card bento-span-5"
          aria-label={shared.relatedPagesHeading}
        >
          <h2 className="section-title">{shared.relatedPagesHeading}</h2>
          <div className="info-page-backlinks">
            {relatedInfoPages.map((other) => (
              <Link
                key={other.slug}
                href={localePath(locale, `/${other.slug}`)}
                className="btn btn-sm"
              >
                <ToolIcon name={other.iconName} size={13} />
                <span>{other.navLabel}</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.35rem' }}>
            <Link href={localePath(locale, '/')} className="btn btn-sm">
              <Home size={14} aria-hidden="true" />
              <span>{common.footer.backToHome}</span>
            </Link>
          </div>
        </nav>
      </section>
    </div>
  );
}
