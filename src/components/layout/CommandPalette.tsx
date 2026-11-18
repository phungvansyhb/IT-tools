'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Terminal, ArrowRight, X } from 'lucide-react';
import { getLocalizedCategories, getLocalizedTools } from '@/lib/tools/registry';
import { getLocalizedCheatsheetEntries } from '@/lib/tools/data/cheatsheets';
import { useI18n } from '@/i18n/client';
import { localePath } from '@/i18n/config';
import { ToolIcon } from '@/components/common/ToolIcon';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

type SearchResultItem =
  | {
      kind: 'tool';
      id: string;
      title: string;
      subtitle: string;
      badge: string;
      iconName: string;
      href: string;
    }
  | {
      kind: 'snippet';
      id: string;
      title: string;
      subtitle: string;
      command: string;
      badge: string;
      href: string;
    };

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;
  return <CommandPaletteInner onClose={onClose} />;
}

function CommandPaletteInner({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(timer);
  }, []);

  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const categories = getLocalizedCategories(locale);
    const tools = getLocalizedTools(locale);
    const entries = getLocalizedCheatsheetEntries(locale);
    const categoryMap = new Map(categories.map((c) => [c.slug, c]));

    const toolItems: SearchResultItem[] = tools
      .filter((tool) => {
        if (!q) return Boolean(tool.featured);
        const catName = categoryMap.get(tool.category)?.name.toLowerCase() ?? '';
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          catName.includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
      .map((tool) => {
        const cat = categoryMap.get(tool.category);
        return {
          kind: 'tool',
          id: `tool-${tool.id}`,
          title: tool.name,
          subtitle: tool.shortDescription,
          badge: cat?.name ?? tool.category,
          iconName: cat?.iconName ?? 'Wrench',
          href: localePath(locale, `/tools/${tool.category}/${tool.slug}`),
        };
      });

    const snippetItems: SearchResultItem[] = q
      ? entries
          .filter(
            (entry) =>
              entry.title.toLowerCase().includes(q) ||
              entry.command.toLowerCase().includes(q) ||
              entry.description.toLowerCase().includes(q) ||
              entry.tags.some((tag) => tag.toLowerCase().includes(q))
          )
          .slice(0, 5)
          .map((entry) => ({
            kind: 'snippet',
            id: `snippet-${entry.id}`,
            title: entry.title,
            subtitle: entry.command,
            command: entry.command,
            badge: entry.group,
            href: localePath(
              locale,
              `/tools/cheatsheets/${entry.sheet}?q=${encodeURIComponent(entry.title)}`
            ),
          }))
      : [];

    return [...toolItems, ...snippetItems].slice(0, 12);
  }, [query, locale]);

  const safeActiveIndex = results.length > 0 ? Math.min(activeIndex, results.length - 1) : 0;

  const navigateTo = (item: SearchResultItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === 'Enter' && results[safeActiveIndex]) {
      e.preventDefault();
      navigateTo(results[safeActiveIndex]);
    }
  };

  return (
    <div
      className="glass-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t('commandPalette.dialogAria')}
      onClick={onClose}
    >
      <div className="glass-modal" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.9rem 1.1rem',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          <Search size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('commandPalette.placeholder')}
            aria-label={t('commandPalette.searchAria')}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label={t('commandPalette.closeAria')}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.5rem' }}>
          {results.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <p className="muted-text" style={{ margin: 0, fontSize: '0.9rem' }}>
                {t('commandPalette.emptyState', { query })}
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const active = idx === safeActiveIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.85rem',
                    padding: '0.7rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: active ? 'var(--accent-border)' : 'transparent',
                    background: active ? 'var(--accent-glow)' : 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--glass-pill-bg)',
                        border: '1px solid var(--glass-border)',
                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                        flexShrink: 0,
                      }}
                    >
                      {item.kind === 'tool' ? (
                        <ToolIcon name={item.iconName} size={15} />
                      ) : (
                        <Terminal size={15} />
                      )}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.title}</div>
                      <div
                        className={item.kind === 'snippet' ? 'font-mono subtle-text' : 'subtle-text'}
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span className="glass-pill">{item.badge}</span>
                    {active && <ArrowRight size={14} style={{ color: 'var(--accent)' }} />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 1rem',
            borderTop: '1px solid var(--glass-border)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>
            <kbd className="kbd">↑↓</kbd> {t('commandPalette.navigateHint')} &nbsp;{' '}
            <kbd className="kbd">Enter</kbd> {t('commandPalette.openHint')}
          </span>
          <span>
            <kbd className="kbd">Esc</kbd> {t('commandPalette.closeHint')}
          </span>
        </div>
      </div>
    </div>
  );
}
