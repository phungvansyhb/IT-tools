'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Command,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Star,
  Sun,
  X,
  Cloud,
  HardDrive,
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import { ToolIcon } from '@/components/common/ToolIcon';
import { CommandPalette } from '@/components/layout/CommandPalette';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme, favorites, toggleFavorite, syncMode, hydrated } = useUserWorkspace();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.id));

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Primary Navigation">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.25rem 0.5rem' }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
              }}
            >
              <Command size={17} />
            </span>
            <div>
              <div style={{ fontSize: '0.96rem', lineHeight: 1.1 }}>OmniDev</div>
              <div className="subtle-text" style={{ fontSize: '0.7rem' }}>
                IT-Tools Hub
              </div>
            </div>
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-icon mobile-menu-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Search Trigger inside Sidebar */}
        <button
          type="button"
          onClick={() => setCmdOpen(true)}
          className="btn"
          style={{
            justifyContent: 'space-between',
            width: '100%',
            padding: '0.55rem 0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <Search size={14} />
            <span>Search tools...</span>
          </span>
          <kbd className="kbd">⌘K</kbd>
        </button>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div
            className="subtle-text"
            style={{
              padding: '0.35rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            Categories (6)
          </div>
          {CATEGORIES.map((cat) => {
            const active =
              pathname === `/categories/${cat.slug}` ||
              pathname.startsWith(`/tools/${cat.slug}/`);
            const count = TOOLS.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  fontWeight: active ? 600 : 500,
                  background: active ? 'var(--accent-glow)' : 'transparent',
                  border: '1px solid',
                  borderColor: active ? 'var(--accent-border)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 140ms ease',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                  <ToolIcon name={cat.iconName} size={15} />
                  <span>{cat.name}</span>
                </span>
                <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>{count}</span>
              </Link>
            );
          })}
        </div>

        {/* Pinned Tools Quick List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.25rem' }}>
          <div
            className="subtle-text"
            style={{
              padding: '0.35rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Pinned Tools</span>
            <span>{hydrated ? favoriteTools.length : 0}</span>
          </div>
          {hydrated && favoriteTools.length === 0 && (
            <div className="subtle-text" style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem' }}>
              Star any tool to pin it here.
            </div>
          )}
          {hydrated &&
            favoriteTools.slice(0, 6).map((t) => {
              const active = pathname === `/tools/${t.category}/${t.slug}`;
              return (
                <Link
                  key={t.id}
                  href={`/tools/${t.category}/${t.slug}`}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.42rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    background: active ? 'var(--accent-glow)' : 'transparent',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Star size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} fill="currentColor" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                </Link>
              );
            })}
        </div>

        {/* Privacy & Sync Footer */}
        <div
          className="glass-panel"
          style={{
            marginTop: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 600 }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
            <span>100% Client-Side Privacy</span>
          </div>
          <p className="subtle-text" style={{ margin: 0, fontSize: '0.73rem', lineHeight: 1.4 }}>
            All payloads stay inside your browser memory. Zero tracking or server uploads.
          </p>
          <div
            className="subtle-text"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              paddingTop: '0.25rem',
              borderTop: '1px solid var(--glass-border)',
            }}
          >
            {syncMode === 'supabase' ? <Cloud size={12} style={{ color: 'var(--accent)' }} /> : <HardDrive size={12} />}
            <span>{syncMode === 'supabase' ? 'Supabase Cloud Sync' : 'Local Storage Mode'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrap">
        <header className="app-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-icon mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="btn"
              style={{
                minWidth: 'min(360px, 52vw)',
                justifyContent: 'space-between',
                color: 'var(--text-secondary)',
              }}
              aria-label="Open global command palette"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={15} />
                <span>Jump to any tool or command...</span>
              </span>
              <kbd className="kbd">Ctrl K</kbd>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn"
              onClick={() => setFavoritesOpen((v) => !v)}
              aria-label="Toggle Favorites Drawer"
            >
              <Star
                size={15}
                style={{ color: favorites.length > 0 ? 'var(--accent)' : 'var(--text-secondary)' }}
                fill={favorites.length > 0 ? 'currentColor' : 'none'}
              />
              <span>Favorites</span>
              <span className="glass-pill" style={{ padding: '0.05rem 0.45rem' }}>
                {hydrated ? favoriteTools.length : 0}
              </span>
            </button>

            <button
              type="button"
              className="btn btn-icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Favorites Slide-over Drawer */}
        {favoritesOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 70,
              background: 'rgba(9, 9, 11, 0.48)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
            onClick={() => setFavoritesOpen(false)}
          >
            <div
              className="glass-surface"
              style={{
                width: 'min(380px, 92vw)',
                height: '100%',
                background: 'var(--bg-modal)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                overflowY: 'auto',
                borderRadius: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={17} style={{ color: 'var(--accent)' }} fill="currentColor" />
                  Pinned Tools ({favoriteTools.length})
                </h2>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => setFavoritesOpen(false)}
                  aria-label="Close favorites drawer"
                >
                  <X size={17} />
                </button>
              </div>
              {favoriteTools.length === 0 ? (
                <p className="muted-text" style={{ fontSize: '0.88rem' }}>
                  You have no pinned tools yet. Click the star icon on any Bento card or tool page to pin it.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {favoriteTools.map((t) => (
                    <div
                      key={t.id}
                      className="glass-panel"
                      style={{
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.65rem',
                      }}
                    >
                      <Link
                        href={`/tools/${t.category}/${t.slug}`}
                        onClick={() => setFavoritesOpen(false)}
                        style={{ minWidth: 0, flex: 1 }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                        <div className="subtle-text" style={{ fontSize: '0.76rem' }}>
                          {t.shortDescription}
                        </div>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => toggleFavorite(t.id)}
                        aria-label={`Unpin ${t.name}`}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <main className="app-content">{children}</main>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
