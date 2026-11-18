'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { CATEGORIES, TOOLS, type ToolCategorySlug } from '@/lib/tools/registry';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard, ToolBentoCard } from '@/components/bento/BentoCard';
import { ToolIcon } from '@/components/common/ToolIcon';

export function HomeHubClient() {
  const { favorites, hydrated } = useUserWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategorySlug | 'all'>('all');

  const categoryMap = useMemo(() => new Map(CATEGORIES.map((c) => [c.slug, c])), []);

  const pinnedTools = useMemo(
    () => TOOLS.filter((t) => favorites.includes(t.id)),
    [favorites]
  );

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Bento Hero Row */}
      <BentoGrid>
        <BentoCard span="8">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'space-between', height: '100%' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span className="glass-pill glass-pill-active">
                  <ShieldCheck size={13} />
                  <span>100% Browser-Native</span>
                </span>
                <span className="glass-pill">24 Utilities · 6 Categories</span>
              </div>
              <h1 className="page-title">
                Developer tools engineered for speed &amp; absolute local privacy.
              </h1>
              <p className="muted-text" style={{ margin: '0.75rem 0 0', fontSize: '0.98rem', maxWidth: '62ch' }}>
                Transform images, payloads, JWTs, OKLCH colors, chmod matrices, and DevOps cheatsheets inside a monochrome Bento workspace. Zero server uploads.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.5rem' }}>
              <div style={{ position: 'relative', flex: '1 1 260px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="search"
                  className="input-field"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter tools by name or keyword (e.g. jwt, oklch, sha256, cron)..."
                  aria-label="Filter tools on home hub"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
              <Link href="/tools/text/jwt-decoder" className="btn btn-primary">
                <span>Open JWT Decoder</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </BentoCard>

        <BentoCard span="4">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                Workspace Telemetry
              </span>
              <kbd className="kbd">Cmd + K</kbd>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              <div className="glass-panel" style={{ padding: '0.75rem' }}>
                <div className="subtle-text">Browser Tools</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {TOOLS.length}
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '0.75rem' }}>
                <div className="subtle-text">Pinned</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accent)' }}>
                  {hydrated ? pinnedTools.length : 0}
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '0.75rem' }}>
                <div className="subtle-text">Network Uploads</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>0 Bytes</div>
              </div>
              <div className="glass-panel" style={{ padding: '0.75rem' }}>
                <div className="subtle-text">Categories</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{CATEGORIES.length} Suites</div>
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Pinned Tools Row */}
      {hydrated && pinnedTools.length > 0 && !searchQuery && activeCategory === 'all' && (
        <section aria-labelledby="pinned-heading" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 id="pinned-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={16} style={{ color: 'var(--accent)' }} fill="currentColor" />
              Pinned Tools
            </h2>
            <span className="subtle-text">Saved to your workspace</span>
          </div>
          <BentoGrid>
            {pinnedTools.map((tool) => (
              <ToolBentoCard
                key={tool.id}
                tool={tool}
                category={categoryMap.get(tool.category)}
                spanOverride="4"
              />
            ))}
          </BentoGrid>
        </section>
      )}

      {/* Category Bento Matrix */}
      <section aria-labelledby="categories-heading" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 id="categories-heading" className="section-title">
            Category Suites
          </h2>
          <span className="subtle-text">Explore dedicated SEO category hubs</span>
        </div>
        <BentoGrid>
          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.slug).length;
            return (
              <BentoCard key={cat.slug} span="4" interactive>
                <Link
                  href={`/categories/${cat.slug}`}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', height: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--accent-glow)',
                        border: '1px solid var(--accent-border)',
                        color: 'var(--accent)',
                      }}
                    >
                      <ToolIcon name={cat.iconName} size={18} />
                    </span>
                    <span className="glass-pill">{count} tools</span>
                  </div>
                  <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.02rem', fontWeight: 600 }}>
                    {cat.name}
                  </h3>
                  <p className="muted-text" style={{ margin: 0, fontSize: '0.84rem' }}>
                    {cat.tagline}
                  </p>
                </Link>
              </BentoCard>
            );
          })}
        </BentoGrid>
      </section>

      {/* All Tools Filterable Bento Grid */}
      <section aria-labelledby="all-tools-heading" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 id="all-tools-heading" className="section-title">
            All Developer Tools ({filteredTools.length})
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`glass-pill ${activeCategory === 'all' ? 'glass-pill-active' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`glass-pill ${activeCategory === cat.slug ? 'glass-pill-active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <BentoCard span="12">
            <p className="muted-text" style={{ margin: 0, textAlign: 'center', padding: '1.5rem 0' }}>
              No tools match &ldquo;{searchQuery}&rdquo;. Try clearing the search filter.
            </p>
          </BentoCard>
        ) : (
          <BentoGrid>
            {filteredTools.map((tool) => (
              <ToolBentoCard
                key={tool.id}
                tool={tool}
                category={categoryMap.get(tool.category)}
              />
            ))}
          </BentoGrid>
        )}
      </section>
    </div>
  );
}
