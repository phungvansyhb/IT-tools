'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Terminal, ArrowRight, X } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { CHEATSHEET_ENTRIES } from '@/lib/tools/data/cheatsheets';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(timer);
  }, []);

  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const categoryMap = new Map(CATEGORIES.map((c) => [c.slug, c]));

    const toolItems: SearchResultItem[] = TOOLS.filter((t) => {
      if (!q) return Boolean(t.featured);
      const catName = categoryMap.get(t.category)?.name.toLowerCase() ?? '';
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        catName.includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }).map((t) => {
      const cat = categoryMap.get(t.category);
      return {
        kind: 'tool',
        id: `tool-${t.id}`,
        title: t.name,
        subtitle: t.shortDescription,
        badge: cat?.name ?? t.category,
        iconName: cat?.iconName ?? 'Wrench',
        href: `/tools/${t.category}/${t.slug}`,
      };
    });

    const snippetItems: SearchResultItem[] = q
      ? CHEATSHEET_ENTRIES.filter(
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
            href: `/tools/cheatsheets/${entry.sheet}?q=${encodeURIComponent(entry.title)}`,
          }))
      : [];

    return [...toolItems, ...snippetItems].slice(0, 12);
  }, [query]);

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
      aria-label="Global Tool Command Palette"
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
            placeholder="Search 24 tools, keywords, or Git/HTTP/Docker commands..."
            aria-label="Search tools and commands"
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
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.5rem' }}>
          {results.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <p className="muted-text" style={{ margin: 0, fontSize: '0.9rem' }}>
                No matching tools or cheatsheet commands for &ldquo;{query}&rdquo;.
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
            <kbd className="kbd">↑↓</kbd> Navigate &nbsp; <kbd className="kbd">Enter</kbd> Open
          </span>
          <span>
            <kbd className="kbd">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
