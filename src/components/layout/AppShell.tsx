'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { getLocalizedCategories, getLocalizedTools } from '@/lib/tools/registry';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import { useI18n } from '@/i18n/client';
import { localePath, stripLocalePrefix } from '@/i18n/config';
import { ToolIcon } from '@/components/common/ToolIcon';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const { theme, toggleTheme, favorites, toggleFavorite, syncMode, hydrated } = useUserWorkspace();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const { pathname: normalizedPathname } = stripLocalePrefix(pathname || '/');
  const categories = useMemo(() => getLocalizedCategories(locale), [locale]);
  const tools = useMemo(() => getLocalizedTools(locale), [locale]);

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

  const favoriteTools = useMemo(
    () => tools.filter((tool) => favorites.includes(tool.id)),
    [tools, favorites]
  );

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label={t('nav.primaryAria')}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.25rem 0.25rem 0.5rem',
          }}
        >
          <Link
            href={localePath(locale, '/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
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
              <div style={{ fontSize: '0.96rem', lineHeight: 1.1 }}>{t('brand.name')}</div>
              <div className="subtle-text" style={{ fontSize: '0.7rem' }}>
                {t('brand.subtitle')}
              </div>
            </div>
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-icon mobile-menu-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label={t('nav.closeSidebar')}
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
            <span>{t('nav.searchTools')}</span>
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
            {t('nav.categoriesHeading', { count: categories.length })}
          </div>
          {categories.map((cat) => {
            const active =
              normalizedPathname === `/categories/${cat.slug}` ||
              normalizedPathname.startsWith(`/tools/${cat.slug}/`);
            const count = tools.filter((tool) => tool.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={localePath(locale, `/categories/${cat.slug}`)}
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
            <span>{t('nav.pinnedTools')}</span>
            <span>{hydrated ? favoriteTools.length : 0}</span>
          </div>
          {hydrated && favoriteTools.length === 0 && (
            <div className="subtle-text" style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem' }}>
              {t('nav.pinnedEmptyHint')}
            </div>
          )}
          {hydrated &&
            favoriteTools.slice(0, 6).map((tool) => {
              const active = normalizedPathname === `/tools/${tool.category}/${tool.slug}`;
              return (
                <Link
                  key={tool.id}
                  href={localePath(locale, `/tools/${tool.category}/${tool.slug}`)}
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
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.name}</span>
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
            <span>{t('nav.privacyTitle')}</span>
          </div>
          <p className="subtle-text" style={{ margin: 0, fontSize: '0.73rem', lineHeight: 1.4 }}>
            {t('nav.privacyDesc')}
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
            <span>{syncMode === 'supabase' ? t('nav.syncSupabase') : t('nav.syncLocal')}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrap">
        <header className="app-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto', minWidth: 0 }}>
            <button
              type="button"
              className="btn btn-icon mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label={t('nav.openMenu')}
              style={{ flexShrink: 0 }}
            >
              <Menu size={18} />
            </button>
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="btn topbar-search-btn"
              aria-label={t('nav.openPaletteAria')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                <Search size={15} style={{ flexShrink: 0 }} />
                <span className="topbar-search-text">{t('nav.jumpToCommand')}</span>
              </span>
              <kbd className="kbd">Ctrl K</kbd>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            <LanguageSwitcher />

            <button
              type="button"
              className="btn"
              onClick={() => setFavoritesOpen((v) => !v)}
              aria-label={t('nav.toggleFavoritesAria')}
            >
              <Star
                size={15}
                style={{ color: favorites.length > 0 ? 'var(--accent)' : 'var(--text-secondary)' }}
                fill={favorites.length > 0 ? 'currentColor' : 'none'}
              />
              <span className="topbar-fav-label">{t('nav.favorites')}</span>
              <span className="glass-pill" style={{ padding: '0.05rem 0.45rem' }}>
                {hydrated ? favoriteTools.length : 0}
              </span>
            </button>

            <button
              type="button"
              className="btn btn-icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('nav.switchToLightAria') : t('nav.switchToDarkAria')}
              title={theme === 'dark' ? t('nav.switchToLightTitle') : t('nav.switchToDarkTitle')}
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
                  {t('nav.pinnedToolsCount', { count: favoriteTools.length })}
                </h2>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => setFavoritesOpen(false)}
                  aria-label={t('nav.closeFavoritesAria')}
                >
                  <X size={17} />
                </button>
              </div>
              {favoriteTools.length === 0 ? (
                <p className="muted-text" style={{ fontSize: '0.88rem' }}>
                  {t('nav.noPinnedTools')}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {favoriteTools.map((tool) => (
                    <div
                      key={tool.id}
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
                        href={localePath(locale, `/tools/${tool.category}/${tool.slug}`)}
                        onClick={() => setFavoritesOpen(false)}
                        style={{ minWidth: 0, flex: 1 }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tool.name}</div>
                        <div className="subtle-text" style={{ fontSize: '0.76rem' }}>
                          {tool.shortDescription}
                        </div>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => toggleFavorite(tool.id)}
                        aria-label={t('nav.unpinToolAria', { name: tool.name })}
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
