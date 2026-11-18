'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowUpRight } from 'lucide-react';
import { CategoryDefinition, ToolDefinition } from '@/lib/tools/registry';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import { useFeedback } from '@/hooks/useFeedback';
import { useI18n } from '@/i18n/client';
import { localePath } from '@/i18n/config';
import { ToolIcon } from '@/components/common/ToolIcon';

interface BentoCardProps {
  children?: React.ReactNode;
  span?: '3' | '4' | '5' | '6' | '7' | '8' | '12';
  rowSpan2?: boolean;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BentoCard({
  children,
  span = '6',
  rowSpan2 = false,
  interactive = false,
  className = '',
  style,
}: BentoCardProps) {
  const spanClass = `bento-span-${span}`;
  const rowClass = rowSpan2 ? 'bento-row-2' : '';
  const hoverClass = interactive ? 'glass-interactive' : '';

  return (
    <div
      className={`bento-card glass-surface ${spanClass} ${rowClass} ${hoverClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

interface ToolBentoCardProps {
  tool: ToolDefinition;
  category?: CategoryDefinition;
  spanOverride?: '4' | '6' | '8';
}

export function ToolBentoCard({ tool, category, spanOverride }: ToolBentoCardProps) {
  const { locale, t } = useI18n();
  const { isFavorite, toggleFavorite, metrics, hydrated: workspaceHydrated } = useUserWorkspace();
  const { ratingSummaries, hydrated: feedbackHydrated } = useFeedback();
  const pinned = isFavorite(tool.id);
  const uses = metrics[tool.id]?.uses ?? 0;
  const summary = ratingSummaries[tool.id];
  const hydrated = workspaceHydrated && feedbackHydrated;
  const span = spanOverride ?? tool.bentoSpan;

  return (
    <BentoCard span={span} interactive>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="glass-pill">
            <ToolIcon name={category?.iconName ?? 'Wrench'} size={13} />
            <span>{category?.name ?? tool.category}</span>
          </span>
          {uses > 0 && (
            <span className="subtle-text" style={{ fontSize: '0.72rem' }}>
              {uses} {uses === 1 ? t('bentoCard.runSingular') : t('bentoCard.runPlural')}
            </span>
          )}
          {hydrated && summary && summary.ratingCount > 0 && (
            <span className="glass-pill" style={{ padding: '0.18rem 0.5rem', fontSize: '0.72rem' }}>
              <Star size={12} fill="currentColor" style={{ color: 'var(--warning)' }} />
              <span>
                {t('feedback.ratingCountPill', {
                  avg: summary.avgRating.toFixed(1),
                  count: summary.ratingCount,
                })}
              </span>
            </span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          aria-label={
            pinned
              ? t('nav.unpinToolAria', { name: tool.name })
              : t('nav.pinToolAria', { name: tool.name })
          }
          title={pinned ? t('nav.removeFromFavorites') : t('nav.pinToFavorites')}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(tool.id);
          }}
          style={{
            color: pinned ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          <Star size={16} fill={pinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <Link
        href={localePath(locale, `/tools/${tool.category}/${tool.slug}`)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              margin: '0.15rem 0 0.35rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <span>{tool.name}</span>
            <ArrowUpRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </h3>
          <p className="muted-text" style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5 }}>
            {tool.shortDescription}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
          {tool.keywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              style={{
                fontSize: '0.72rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                background: 'var(--bg-input)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)',
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </Link>
    </BentoCard>
  );
}
