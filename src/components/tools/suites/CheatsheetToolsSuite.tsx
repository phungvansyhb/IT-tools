'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Pin, Search } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { CopyButton } from '@/components/common/CopyButton';
import { getLocalizedCheatsheetEntries, type CheatsheetEntry } from '@/lib/tools/data/cheatsheets';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import { useI18n } from '@/i18n/client';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

export function CheatsheetToolsSuite({
  toolId,
  initialState,
  onStateChange,
  onRun,
}: ToolSuiteProps) {
  const { locale, t } = useI18n();
  const { pinnedSnippets, togglePinnedSnippet } = useUserWorkspace();
  const [filterText, setFilterText] = useState<string>(() => {
    if (typeof initialState?.filterText === 'string') {
      return initialState.filterText;
    }
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) return q;
    }
    return '';
  });
  const [activeGroup, setActiveGroup] = useState<string>(
    typeof initialState?.activeGroup === 'string' ? initialState.activeGroup : 'all'
  );

  const sheetEntries = useMemo(
    () => getLocalizedCheatsheetEntries(locale, toolId as CheatsheetEntry['sheet']),
    [locale, toolId]
  );

  const groups = useMemo(
    () => Array.from(new Set(sheetEntries.map((e) => e.group))),
    [sheetEntries]
  );

  const currentActiveGroup =
    activeGroup !== 'all' && !groups.includes(activeGroup) ? 'all' : activeGroup;

  useEffect(() => {
    onStateChange?.({ filterText, activeGroup: currentActiveGroup });
  }, [filterText, currentActiveGroup, onStateChange]);

  const filtered = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    const list = sheetEntries.filter((e) => {
      if (currentActiveGroup !== 'all' && e.group !== currentActiveGroup) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.command.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
    // Sort pinned snippets to top
    return [...list].sort((a, b) => {
      const aPin = pinnedSnippets.includes(a.id) ? 1 : 0;
      const bPin = pinnedSnippets.includes(b.id) ? 1 : 0;
      return bPin - aPin;
    });
  }, [sheetEntries, currentActiveGroup, filterText, pinnedSnippets]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <BentoGrid>
        <BentoCard span="12">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="search"
                className="input-field"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder={t('tools:cheatsheetSuite.filterPlaceholder')}
                style={{ paddingLeft: '2.3rem' }}
                aria-label={t('tools:cheatsheetSuite.filterAria')}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <button
                type="button"
                className={`glass-pill ${currentActiveGroup === 'all' ? 'glass-pill-active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveGroup('all')}
              >
                {t('tools:cheatsheetSuite.allFilterPill', { count: sheetEntries.length })}
              </button>
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`glass-pill ${currentActiveGroup === g ? 'glass-pill-active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveGroup(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      <BentoGrid>
        {filtered.map((entry) => {
          const isPinned = pinnedSnippets.includes(entry.id);
          return (
            <BentoCard key={entry.id} span="6">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`glass-pill ${isPinned ? 'glass-pill-active' : ''}`}>{entry.group}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => togglePinnedSnippet(entry.id)}
                    aria-label={
                      isPinned
                        ? t('tools:cheatsheetSuite.unpinSnippetAria')
                        : t('tools:cheatsheetSuite.pinSnippetAria')
                    }
                    style={{ color: isPinned ? 'var(--accent)' : 'var(--text-muted)' }}
                  >
                    <Pin size={15} />
                  </button>
                  <CopyButton value={entry.command} label={t('actions.copy')} onCopied={onRun} />
                </div>
              </div>

              <h3 style={{ margin: '0.1rem 0 0', fontSize: '0.98rem', fontWeight: 600 }}>{entry.title}</h3>
              <pre
                className="glass-panel font-mono"
                style={{
                  margin: 0,
                  padding: '0.65rem 0.75rem',
                  fontSize: '0.82rem',
                  overflowX: 'auto',
                  color: 'var(--accent)',
                }}
              >
                {entry.command}
              </pre>
              <p className="muted-text" style={{ margin: 0, fontSize: '0.84rem' }}>
                {entry.description}
              </p>
            </BentoCard>
          );
        })}
      </BentoGrid>
    </div>
  );
}
