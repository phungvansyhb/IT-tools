'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Bug, Command, Home, Search } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { localePath } from '@/i18n/config';
import { useFeedback } from '@/hooks/useFeedback';
import { OPEN_COMMAND_PALETTE_EVENT } from '@/components/layout/AppShell';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard, ToolBentoCard } from '@/components/bento/BentoCard';
import { ToolIcon } from '@/components/common/ToolIcon';
import { getLocalizedCategories, getLocalizedTools } from '@/lib/tools/registry';
import { getLocalizedInfoPages } from '@/lib/info/pages';
import {
  analyzeNotFoundPath,
  findNotFoundSuggestions,
  getNotFoundFallbackData,
  type NotFoundContext,
  type NotFoundSuggestion,
} from '@/lib/not-found';

interface NotFoundHubProps {
  contextOverride?: NotFoundContext;
}

export function NotFoundHub({ contextOverride }: NotFoundHubProps) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const { openFeedbackModal } = useFeedback();
  const [hydrated, setHydrated] = useState(false);
  const [inlineQuery, setInlineQuery] = useState('');

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const analyzed = useMemo(() => {
    const raw = hydrated && pathname ? pathname : localePath(locale, '/');
    const parsed = analyzeNotFoundPath(raw);
    if (!contextOverride) return parsed;
    return {
      ...parsed,
      context: contextOverride,
    };
  }, [hydrated, pathname, locale, contextOverride]);

  const effectiveContext: NotFoundContext = contextOverride ?? analyzed.context;

  const fallback = useMemo(
    () => getNotFoundFallbackData(locale, analyzed),
    [locale, analyzed]
  );

  const suggestions = useMemo(() => {
    if (!hydrated || !pathname) return [];
    return findNotFoundSuggestions(pathname, locale, 4);
  }, [hydrated, pathname, locale]);

  const categoryMap = useMemo(
    () => new Map(fallback.categories.map((cat) => [cat.slug, cat])),
    [fallback.categories]
  );

  const enCategories = useMemo(
    () => (locale === 'en' ? fallback.categories : getLocalizedCategories('en')),
    [locale, fallback.categories]
  );
  const enTools = useMemo(() => getLocalizedTools('en'), []);
  const enPages = useMemo(
    () => (locale === 'en' ? fallback.infoPages : getLocalizedInfoPages('en')),
    [locale, fallback.infoPages]
  );
  const enCatMap = useMemo(() => new Map(enCategories.map((c) => [c.slug, c])), [enCategories]);
  const enToolMap = useMemo(() => new Map(enTools.map((tool) => [tool.id, tool])), [enTools]);
  const enPageMap = useMemo(() => new Map(enPages.map((p) => [p.slug, p])), [enPages]);

  const trimmedQuery = inlineQuery.trim();
  const inlineResults = useMemo<NotFoundSuggestion[]>(() => {
    if (!trimmedQuery) return [];
    const q = trimmedQuery.toLowerCase();
    const allTools = getLocalizedTools(locale);
    const items: NotFoundSuggestion[] = [];

    for (const tool of allTools) {
      const cat = categoryMap.get(tool.category);
      const enTool = enToolMap.get(tool.id);
      const enCat = enCatMap.get(tool.category);
      const haystack = [
        tool.id,
        tool.slug,
        tool.name,
        tool.shortDescription,
        cat?.name ?? '',
        ...tool.keywords,
        enTool?.name ?? '',
        enTool?.shortDescription ?? '',
        enCat?.name ?? '',
        ...(enTool?.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();

      if (haystack.includes(q)) {
        const score =
          tool.slug.toLowerCase() === q || tool.name.toLowerCase().startsWith(q) ? 1 : 0.7;
        items.push({
          kind: 'tool',
          id: tool.id,
          title: tool.name,
          subtitle: tool.shortDescription,
          href: localePath(locale, `/tools/${tool.category}/${tool.slug}`),
          icon: cat?.iconName ?? 'Wrench',
          score,
          categoryId: tool.category,
        });
      }
    }

    for (const cat of fallback.categories) {
      const enCat = enCatMap.get(cat.slug);
      const haystack = [
        cat.slug,
        cat.name,
        cat.shortName ?? '',
        cat.tagline,
        enCat?.name ?? '',
        enCat?.tagline ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (haystack.includes(q)) {
        items.push({
          kind: 'category',
          id: cat.slug,
          title: cat.name,
          subtitle: cat.tagline,
          href: localePath(locale, `/categories/${cat.slug}`),
          icon: cat.iconName,
          score: cat.slug.toLowerCase() === q ? 0.95 : 0.65,
          categoryId: cat.slug,
        });
      }
    }

    for (const page of fallback.infoPages) {
      const enPage = enPageMap.get(page.slug);
      const haystack = [
        page.slug,
        page.navLabel,
        page.title,
        page.subtitle,
        ...page.keywords,
        enPage?.navLabel ?? '',
        enPage?.title ?? '',
        ...(enPage?.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();
      if (haystack.includes(q)) {
        items.push({
          kind: 'page',
          id: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          href: localePath(locale, `/${page.slug}`),
          icon: page.iconName,
          score: page.slug.toLowerCase() === q ? 0.9 : 0.6,
        });
      }
    }

    if (items.length > 0) {
      return items
        .filter((item) => !item.href.includes('/admin') && !item.href.includes('/api'))
        .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
        .slice(0, 8);
    }

    // Fallback to fuzzy path engine for typo queries like "jwt-decode" or "faq"
    return findNotFoundSuggestions(localePath(locale, `/${trimmedQuery}`), locale, 6);
  }, [trimmedQuery, locale, categoryMap, enToolMap, enCatMap, enPageMap, fallback.categories, fallback.infoPages]);

  const handleOpenCommandPalette = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent(OPEN_COMMAND_PALETTE_EVENT, {
        detail: trimmedQuery ? { query: trimmedQuery } : undefined,
      })
    );
  };

  const handleReportBrokenLink = () => {
    const clean = hydrated ? analyzed.cleanPath : localePath(locale, '/404');
    openFeedbackModal({
      defaultTab: 'submit',
      defaultType: 'bug',
      defaultToolId: 'general',
      defaultTitle: t('notFound.brokenLinkTitlePrefix', { path: clean }),
    });
  };

  const kindLabel = (kind: NotFoundSuggestion['kind']) => {
    switch (kind) {
      case 'tool':
        return t('notFound.kindLabels.tool');
      case 'category':
        return t('notFound.kindLabels.category');
      case 'page':
        return t('notFound.kindLabels.page');
    }
  };

  return (
    <div className="notfound-stack">
      {/* Hero Terminal Bento Card */}
      <BentoGrid>
        <BentoCard span="12" className="notfound-hero-card">
          <div className="notfound-badge-row">
            <span className="glass-pill glass-pill-active font-mono">{t('notFound.badgeCode')}</span>
            <span className="glass-pill">{t(`notFound.contextBadges.${effectiveContext}`)}</span>
          </div>

          <h1 className="page-title">{t(`notFound.titles.${effectiveContext}`)}</h1>
          <p className="muted-text notfound-description">
            {t(`notFound.descriptions.${effectiveContext}`)}
          </p>

          {hydrated && (
            <div className="notfound-path-row">
              <span className="subtle-text notfound-path-label">
                {t('notFound.requestedPathLabel')}:
              </span>
              <code className="notfound-path-pill font-mono">{analyzed.cleanPath}</code>
            </div>
          )}

          {/* Action Row */}
          <div className="notfound-actions-row">
            <Link href={localePath(locale, '/')} className="btn btn-primary">
              <Home size={15} />
              <span>{t('notFound.backHome')}</span>
            </Link>

            {fallback.matchedCategory && (
              <Link
                href={localePath(locale, `/categories/${fallback.matchedCategory.slug}`)}
                className="btn"
              >
                <ToolIcon name={fallback.matchedCategory.iconName} size={15} />
                <span>
                  {t('notFound.openCategory', { category: fallback.matchedCategory.name })}
                </span>
              </Link>
            )}

            <button type="button" className="btn" onClick={handleOpenCommandPalette}>
              <Command size={15} />
              <span>{t('notFound.openCommandPalette')}</span>
            </button>

            <button type="button" className="btn" onClick={handleReportBrokenLink}>
              <Bug size={15} />
              <span>{t('notFound.reportBrokenLink')}</span>
            </button>
          </div>

          {/* Inline Quick Search */}
          <div className="notfound-search-wrap">
            <Search size={16} className="notfound-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="input-field notfound-search-input"
              value={inlineQuery}
              onChange={(e) => setInlineQuery(e.target.value)}
              placeholder={t('notFound.searchPlaceholder')}
              aria-label={t('notFound.searchAria')}
            />
          </div>

          {trimmedQuery.length > 0 && (
            <div className="notfound-inline-results">
              {inlineResults.length === 0 ? (
                <div className="glass-panel notfound-empty-search">
                  <p className="muted-text" style={{ margin: 0, fontSize: '0.88rem' }}>
                    {t('notFound.searchEmpty', { query: trimmedQuery })}
                  </p>
                </div>
              ) : (
                <BentoGrid>
                  {inlineResults.map((item) => (
                    <BentoCard key={`${item.kind}-${item.id}`} span="6" interactive>
                      <Link href={item.href} className="notfound-suggestion-link">
                        <div className="notfound-suggestion-head">
                          <span className="glass-pill">
                            <ToolIcon name={item.icon} size={13} />
                            <span>{kindLabel(item.kind)}</span>
                          </span>
                          <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="notfound-suggestion-title">{item.title}</div>
                        <p className="muted-text notfound-suggestion-sub">{item.subtitle}</p>
                      </Link>
                    </BentoCard>
                  ))}
                </BentoGrid>
              )}
            </div>
          )}
        </BentoCard>
      </BentoGrid>

      {/* Did You Mean? Fuzzy Suggestions */}
      {trimmedQuery.length === 0 && suggestions.length > 0 && (
        <section className="notfound-section">
          <div className="notfound-section-header">
            <h2 className="section-title">{t('notFound.didYouMeanTitle')}</h2>
            <span className="subtle-text">{t('notFound.didYouMeanSubtitle')}</span>
          </div>
          <BentoGrid>
            {suggestions.map((item) => (
              <BentoCard key={`${item.kind}-${item.id}`} span="6" interactive>
                <Link href={item.href} className="notfound-suggestion-link">
                  <div className="notfound-suggestion-head">
                    <span className="glass-pill glass-pill-active">
                      <ToolIcon name={item.icon} size={13} />
                      <span>{kindLabel(item.kind)}</span>
                    </span>
                    <ArrowUpRight size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="notfound-suggestion-title">{item.title}</div>
                  <p className="muted-text notfound-suggestion-sub">{item.subtitle}</p>
                </Link>
              </BentoCard>
            ))}
          </BentoGrid>
        </section>
      )}

      {/* Contextual Recovery Grid */}
      {effectiveContext === 'tool' && fallback.matchedCategory && fallback.categoryTools.length > 0 ? (
        <section className="notfound-section">
          <div className="notfound-section-header">
            <h2 className="section-title">
              {t('notFound.categoryToolsTitle', { category: fallback.matchedCategory.name })}
            </h2>
            <Link
              href={localePath(locale, `/categories/${fallback.matchedCategory.slug}`)}
              className="btn btn-sm"
            >
              <span>
                {t('notFound.openCategory', { category: fallback.matchedCategory.name })}
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <BentoGrid>
            {fallback.categoryTools.map((tool) => (
              <ToolBentoCard
                key={tool.id}
                tool={tool}
                category={fallback.matchedCategory ?? undefined}
                spanOverride="6"
              />
            ))}
          </BentoGrid>
        </section>
      ) : effectiveContext === 'category' ? (
        <section className="notfound-section">
          <div className="notfound-section-header">
            <h2 className="section-title">{t('notFound.browseCategoriesTitle')}</h2>
          </div>
          <BentoGrid>
            {fallback.categories.map((cat) => (
              <BentoCard key={cat.slug} span="4" interactive>
                <Link
                  href={localePath(locale, `/categories/${cat.slug}`)}
                  className="notfound-suggestion-link"
                >
                  <div className="notfound-suggestion-head">
                    <span className="glass-pill">
                      <ToolIcon name={cat.iconName} size={14} />
                      <span>{cat.name}</span>
                    </span>
                    <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="muted-text notfound-suggestion-sub">{cat.tagline}</p>
                </Link>
              </BentoCard>
            ))}
          </BentoGrid>
        </section>
      ) : (
        <section className="notfound-section">
          <div className="notfound-section-header">
            <h2 className="section-title">{t('notFound.featuredToolsTitle')}</h2>
          </div>
          <BentoGrid>
            {fallback.featuredTools.map((tool) => (
              <ToolBentoCard
                key={tool.id}
                tool={tool}
                category={categoryMap.get(tool.category)}
                spanOverride="6"
              />
            ))}
          </BentoGrid>

          <div className="notfound-quick-pages">
            <span className="subtle-text notfound-quick-pages-label">
              {t('notFound.quickPagesTitle')}:
            </span>
            <div className="notfound-quick-pages-list">
              {fallback.infoPages.map((page) => (
                <Link
                  key={page.slug}
                  href={localePath(locale, `/${page.slug}`)}
                  className="glass-pill"
                >
                  <ToolIcon name={page.iconName} size={13} />
                  <span>{page.navLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
