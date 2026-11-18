'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LOCALE_META, SUPPORTED_LOCALES, type Locale } from '@/i18n/config';
import { useI18n } from '@/i18n/client';

export function LanguageSwitcher() {
  const { locale, t, switchLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(() =>
    Math.max(0, SUPPORTED_LOCALES.indexOf(locale))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      queueMicrotask(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[focusedIndex]?.focus();
  }, [open, focusedIndex]);

  const handleSelect = (next: Locale) => {
    setOpen(false);
    switchLocale(next);
  };

  const openWithIndex = (index: number) => {
    const safeIdx = ((index % SUPPORTED_LOCALES.length) + SUPPORTED_LOCALES.length) % SUPPORTED_LOCALES.length;
    setFocusedIndex(safeIdx);
    setOpen(true);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIdx = Math.max(0, SUPPORTED_LOCALES.indexOf(locale));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        openWithIndex(currentIdx);
      } else {
        setFocusedIndex((prev) => (prev + 1) % SUPPORTED_LOCALES.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        openWithIndex(currentIdx);
      } else {
        setFocusedIndex((prev) => (prev - 1 + SUPPORTED_LOCALES.length) % SUPPORTED_LOCALES.length);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      openWithIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      openWithIndex(SUPPORTED_LOCALES.length - 1);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % SUPPORTED_LOCALES.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + SUPPORTED_LOCALES.length) % SUPPORTED_LOCALES.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(SUPPORTED_LOCALES.length - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(true);
    } else if (e.key === 'Tab') {
      closeMenu(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const targetLocale = SUPPORTED_LOCALES[focusedIndex];
      if (targetLocale) handleSelect(targetLocale);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        className="btn"
        onClick={() => {
          if (open) {
            closeMenu(false);
          } else {
            openWithIndex(Math.max(0, SUPPORTED_LOCALES.indexOf(locale)));
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('nav.languageSwitcherAria')}
        title={t('nav.languageLabel')}
        style={{ gap: '0.4rem' }}
      >
        <Globe size={15} style={{ color: 'var(--accent)' }} />
        <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
          {LOCALE_META[locale].shortLabel}
        </span>
        <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('nav.languageSwitcherAria')}
          aria-activedescendant={`lang-option-${SUPPORTED_LOCALES[focusedIndex]}`}
          onKeyDown={handleListKeyDown}
          className="glass-surface"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 0.45rem)',
            minWidth: '188px',
            background: 'var(--bg-modal)',
            border: '1px solid var(--glass-border-highlight)',
            borderRadius: 'var(--radius-md)',
            padding: '0.35rem',
            zIndex: 80,
            boxShadow: '0 14px 34px var(--glass-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          {SUPPORTED_LOCALES.map((loc, idx) => {
            const meta = LOCALE_META[loc];
            const active = loc === locale;
            const focused = idx === focusedIndex;
            return (
              <button
                key={loc}
                id={`lang-option-${loc}`}
                ref={(el) => {
                  optionRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={active}
                tabIndex={focused ? 0 : -1}
                onMouseEnter={() => setFocusedIndex(idx)}
                onClick={() => handleSelect(loc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                  width: '100%',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: active
                    ? 'var(--accent-border)'
                    : focused
                      ? 'var(--glass-border-highlight)'
                      : 'transparent',
                  background: active
                    ? 'var(--accent-glow)'
                    : focused
                      ? 'var(--glass-surface-hover)'
                      : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: active ? 600 : 500,
                  textAlign: 'left',
                  outline: 'none',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      opacity: 0.8,
                      minWidth: '1.6rem',
                    }}
                  >
                    {meta.shortLabel}
                  </span>
                  <span>{meta.nativeName}</span>
                </span>
                {active && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
