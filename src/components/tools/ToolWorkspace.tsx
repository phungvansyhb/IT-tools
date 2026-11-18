'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BookmarkPlus, Check, ChevronRight, Share2, Star, Trash2 } from 'lucide-react';
import { CategoryDefinition, ToolDefinition } from '@/lib/tools/registry';
import { useUserWorkspace } from '@/hooks/useUserWorkspace';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard, ToolBentoCard } from '@/components/bento/BentoCard';
import { ImageToolsSuite } from '@/components/tools/suites/ImageToolsSuite';
import { FileToolsSuite } from '@/components/tools/suites/FileToolsSuite';
import { TextToolsSuite } from '@/components/tools/suites/TextToolsSuite';
import { ColorToolsSuite } from '@/components/tools/suites/ColorToolsSuite';
import { CalculatorToolsSuite } from '@/components/tools/suites/CalculatorToolsSuite';
import { CheatsheetToolsSuite } from '@/components/tools/suites/CheatsheetToolsSuite';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  category: CategoryDefinition;
  relatedTools: ToolDefinition[];
}

export function ToolWorkspace({ tool, category, relatedTools }: ToolWorkspaceProps) {
  const {
    isFavorite,
    toggleFavorite,
    presets,
    savePreset,
    deletePreset,
    trackToolView,
    trackToolUse,
    metrics,
  } = useUserWorkspace();

  const [currentState, setCurrentState] = useState<Record<string, unknown>>({});
  const [loadedState, setLoadedState] = useState<Record<string, unknown> | null>(null);
  const [suiteNonce, setSuiteNonce] = useState(0);
  const [presetName, setPresetName] = useState('');
  const [showPresetForm, setShowPresetForm] = useState(false);
  const [sharedCopied, setSharedCopied] = useState(false);

  const pinned = isFavorite(tool.id);
  const toolPresets = presets.filter((p) => p.toolId === tool.id);
  const toolMetric = metrics[tool.id];

  useEffect(() => {
    trackToolView(tool.id);
    // Hydrate shareable URL state if present (?state=base64json)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('state');
      if (encoded) {
        queueMicrotask(() => {
          try {
            const parsed = JSON.parse(decodeURIComponent(atob(encoded))) as Record<string, unknown>;
            setLoadedState(parsed);
            setSuiteNonce((n) => n + 1);
          } catch {
            // Ignore malformed shareable state
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.id]);

  const handleStateChange = useCallback((state: Record<string, unknown>) => {
    setCurrentState(state);
  }, []);

  const handleRun = useCallback(() => {
    trackToolUse(tool.id);
  }, [tool.id, trackToolUse]);

  const handleCopyShareUrl = async () => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(currentState)));
      const url = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
      await navigator.clipboard.writeText(url);
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    savePreset(tool.id, presetName || `${tool.name} Preset`, currentState);
    setPresetName('');
    setShowPresetForm(false);
  };

  const renderSuite = () => {
    const props = {
      toolId: tool.id,
      initialState: loadedState,
      onStateChange: handleStateChange,
      onRun: handleRun,
    };

    switch (tool.category) {
      case 'image':
        return <ImageToolsSuite key={suiteNonce} {...props} />;
      case 'file':
        return <FileToolsSuite key={suiteNonce} {...props} />;
      case 'text':
        return <TextToolsSuite key={suiteNonce} {...props} />;
      case 'color':
        return <ColorToolsSuite key={suiteNonce} {...props} />;
      case 'calculators':
        return <CalculatorToolsSuite key={suiteNonce} {...props} />;
      case 'cheatsheets':
        return <CheatsheetToolsSuite key={suiteNonce} {...props} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem' }}>
        <Link href="/" className="muted-text">
          Home
        </Link>
        <ChevronRight size={14} className="subtle-text" />
        <Link href={`/categories/${category.slug}`} className="muted-text">
          {category.name}
        </Link>
        <ChevronRight size={14} className="subtle-text" />
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tool.name}</span>
      </nav>

      {/* Header + Actions Bento Card */}
      <BentoGrid>
        <BentoCard span="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ maxWidth: '72ch' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className="glass-pill glass-pill-active">{category.name}</span>
                {toolMetric && toolMetric.uses > 0 && (
                  <span className="glass-pill">{toolMetric.uses} local runs</span>
                )}
              </div>
              <h1 className="page-title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                {tool.name}
              </h1>
              <p className="muted-text" style={{ margin: '0.5rem 0 0', fontSize: '0.94rem' }}>
                {tool.longDescription}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${pinned ? 'glass-pill-active' : ''}`}
                onClick={() => toggleFavorite(tool.id)}
              >
                <Star size={15} fill={pinned ? 'currentColor' : 'none'} />
                <span>{pinned ? 'Pinned' : 'Pin Tool'}</span>
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setShowPresetForm((v) => !v)}
              >
                <BookmarkPlus size={15} />
                <span>Save Preset</span>
              </button>
              <button type="button" className="btn" onClick={handleCopyShareUrl}>
                {sharedCopied ? <Check size={15} /> : <Share2 size={15} />}
                <span>{sharedCopied ? 'Link Copied' : 'Share State'}</span>
              </button>
            </div>
          </div>

          {showPresetForm && (
            <form
              onSubmit={handleSavePreset}
              style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--glass-border)' }}
            >
              <input
                type="text"
                className="input-field"
                style={{ flex: '1 1 220px' }}
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset label (e.g. Prod API JWT, Dark Glass)..."
              />
              <button type="submit" className="btn btn-primary">
                Save to Workspace
              </button>
            </form>
          )}

          {toolPresets.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center', paddingTop: '0.35rem' }}>
              <span className="subtle-text">Saved Presets:</span>
              {toolPresets.map((p) => (
                <div
                  key={p.id}
                  className="glass-pill"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLoadedState(p.payload);
                      setSuiteNonce((n) => n + 1);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      padding: 0,
                    }}
                  >
                    {p.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePreset(p.id)}
                    aria-label={`Delete preset ${p.name}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      padding: 0,
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </BentoGrid>

      {/* Active Interactive Tool Suite */}
      <section aria-label={`${tool.name} Workspace`}>{renderSuite()}</section>

      {/* Semantic SEO Footer Bento Cards: How It Works, Technical Reference, FAQ Accordion */}
      <BentoGrid>
        <BentoCard span="6">
          <h2 className="section-title">How It Works</h2>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tool.howItWorks.map((step, i) => (
              <li key={i} className="muted-text" style={{ fontSize: '0.88rem' }}>
                {step}
              </li>
            ))}
          </ol>
        </BentoCard>

        <BentoCard span="6">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {tool.faqs.map((faq, i) => (
              <details
                key={i}
                className="glass-panel"
                style={{ padding: '0.7rem 0.85rem' }}
                open={i === 0}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>
                  {faq.question}
                </summary>
                <p className="muted-text" style={{ margin: '0.45rem 0 0', fontSize: '0.84rem' }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-heading" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h2 id="related-heading" className="section-title">
            Related Developer Tools
          </h2>
          <BentoGrid>
            {relatedTools.map((rel) => (
              <ToolBentoCard key={rel.id} tool={rel} spanOverride="4" />
            ))}
          </BentoGrid>
        </section>
      )}
    </div>
  );
}
