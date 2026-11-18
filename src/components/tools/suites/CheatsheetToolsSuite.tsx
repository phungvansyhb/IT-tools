'use client';

import React, { useMemo, useState } from 'react';
import { Pin, Search } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { CopyButton } from '@/components/common/CopyButton';
import { CHEATSHEET_ENTRIES } from '@/lib/tools/data/cheatsheets';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

export function CheatsheetToolsSuite({ toolId, onRun }: ToolSuiteProps) {
  const { pinnedSnippets, togglePinnedSnippet } = useUserWorkspace();
  const [filterText, setFilterText] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');

  const sheetEntries = useMemo(
    () => CHEATSHEET_ENTRIES.filter((entry) => entry.sheet === toolId),
    [toolId]
  );

  const groups = useMemo(
    () => Array.from(new Set(sheetEntries.map((e) => e.group))),
    [sheetEntries]
  );

  const filtered = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    const list = sheetEntries.filter((e) => {
      if (activeGroup !== 'all' && e.group !== activeGroup) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.command.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    // Sort pinned snippets to top
    return [...list].sort((a, b) => {
      const aPin = pinnedSnippets.includes(a.id) ? 1 : 0;
      const bPin = pinnedSnippets.includes(b.id) ? 1 : 0;
      return bPin - aPin;
    });
  }, [sheetEntries, activeGroup, filterText, pinnedSnippets]);

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
                placeholder="Filter commands, flags, status codes..."
                style={{ paddingLeft: '2.3rem' }}
                aria-label="Filter cheatsheet entries"
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <button
                type="button"
                className={`glass-pill ${activeGroup === 'all' ? 'glass-pill-active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveGroup('all')}
              >
                All ({sheetEntries.length})
              </button>
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`glass-pill ${activeGroup === g ? 'glass-pill-active' : ''}`}
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
                    aria-label={isPinned ? 'Unpin snippet' : 'Pin snippet'}
                    style={{ color: isPinned ? 'var(--accent)' : 'var(--text-muted)' }}
                  >
                    <Pin size={15} />
                  </button>
                  <CopyButton value={entry.command} label="Copy" onCopied={onRun} />
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
