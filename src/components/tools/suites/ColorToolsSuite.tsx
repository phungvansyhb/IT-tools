'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, CheckCircle2, XCircle } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { CopyButton } from '@/components/common/CopyButton';
import {
  generateTonalScale,
  getColorSpaces,
  getContrastRatio,
  normalizeHex,
} from '@/lib/tools/engines/color';
import { useI18n } from '@/i18n/client';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

export function ColorToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
  const { t } = useI18n();

  // 1 & 3. Color Converter & Palette Generator
  const [hexInput, setHexInput] = useState<string>(
    typeof initialState?.hexInput === 'string' ? initialState.hexInput : '#10B981'
  );

  // 2. Contrast Checker
  const [fgColor, setFgColor] = useState<string>(
    typeof initialState?.fgColor === 'string' ? initialState.fgColor : '#F4F4F6'
  );
  const [bgColor, setBgColor] = useState<string>(
    typeof initialState?.bgColor === 'string' ? initialState.bgColor : '#111114'
  );

  // 4. Glassmorphism Generator
  const [glassBgAlpha, setGlassBgAlpha] = useState<number>(
    typeof initialState?.glassBgAlpha === 'number' ? initialState.glassBgAlpha : 0.68
  );
  const [glassBlur, setGlassBlur] = useState<number>(
    typeof initialState?.glassBlur === 'number' ? initialState.glassBlur : 16
  );
  const [glassSaturation, setGlassSaturation] = useState<number>(
    typeof initialState?.glassSaturation === 'number' ? initialState.glassSaturation : 140
  );
  const [glassBorderAlpha, setGlassBorderAlpha] = useState<number>(
    typeof initialState?.glassBorderAlpha === 'number' ? initialState.glassBorderAlpha : 0.12
  );
  const [glassRadius, setGlassRadius] = useState<number>(
    typeof initialState?.glassRadius === 'number' ? initialState.glassRadius : 16
  );

  useEffect(() => {
    onStateChange?.({
      hexInput,
      fgColor,
      bgColor,
      glassBgAlpha,
      glassBlur,
      glassSaturation,
      glassBorderAlpha,
      glassRadius,
    });
  }, [
    hexInput,
    fgColor,
    bgColor,
    glassBgAlpha,
    glassBlur,
    glassSaturation,
    glassBorderAlpha,
    glassRadius,
    onStateChange,
  ]);

  const validHex = useMemo(() => normalizeHex(hexInput) ?? '#10B981', [hexInput]);
  const spaces = useMemo(() => getColorSpaces(validHex), [validHex]);
  const contrast = useMemo(() => getContrastRatio(fgColor, bgColor), [fgColor, bgColor]);
  const scale = useMemo(() => generateTonalScale(validHex), [validHex]);

  if (toolId === 'color-converter' && spaces) {
    const entries = [
      { label: 'HEX', value: spaces.hex },
      { label: 'RGB', value: spaces.cssRgb },
      { label: 'HSL', value: spaces.cssHsl },
      { label: 'OKLCH', value: spaces.cssOklch },
    ];

    return (
      <BentoGrid>
        <BentoCard span="5">
          <h2 className="section-title">{t('tools:colorSuite.pickerTitle')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="color"
              value={validHex}
              onChange={(e) => setHexInput(e.target.value.toUpperCase())}
              aria-label={t('tools:colorSuite.pickerAria')}
              style={{
                width: '56px',
                height: '46px',
                padding: '2px',
                borderRadius: '10px',
                border: '1px solid var(--glass-border-highlight)',
                background: 'var(--bg-input)',
                cursor: 'pointer',
              }}
            />
            <input
              type="text"
              className="input-field font-mono"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#10B981"
              aria-label={t('tools:colorSuite.hexInputAria')}
            />
          </div>
          <div
            className="glass-panel"
            style={{
              height: '130px',
              backgroundColor: spaces.hex,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0.75rem',
            }}
          >
            <span
              className="glass-pill font-mono"
              style={{ background: 'rgba(9, 9, 11, 0.72)', color: '#fff' }}
            >
              {spaces.hex}
            </span>
          </div>
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">{t('tools:colorSuite.spacesTitle')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {entries.map((item) => (
              <div
                key={item.label}
                className="glass-panel"
                style={{
                  padding: '0.75rem 0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <div className="subtle-text">{item.label}</div>
                  <code className="font-mono" style={{ fontSize: '0.92rem' }}>
                    {item.value}
                  </code>
                </div>
                <CopyButton value={item.value} label={t('actions.copy')} onCopied={onRun} />
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'contrast-checker') {
    const fgNorm = normalizeHex(fgColor) ?? '#F4F4F6';
    const bgNorm = normalizeHex(bgColor) ?? '#111114';

    const badges = contrast
      ? [
          { label: t('tools:colorSuite.aaNormal'), pass: contrast.aaNormal },
          { label: t('tools:colorSuite.aaLarge'), pass: contrast.aaLarge },
          { label: t('tools:colorSuite.aaaNormal'), pass: contrast.aaaNormal },
          { label: t('tools:colorSuite.aaaLarge'), pass: contrast.aaaLarge },
        ]
      : [];

    return (
      <BentoGrid>
        <BentoCard span="5">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">{t('tools:colorSuite.colorPairTitle')}</h2>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setFgColor(bgNorm);
                setBgColor(fgNorm);
                onRun?.();
              }}
            >
              <ArrowLeftRight size={14} /> {t('actions.swap')}
            </button>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">{t('tools:colorSuite.foregroundLabel')}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="color"
                value={fgNorm}
                onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                style={{ width: '48px', height: '40px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
              />
              <input
                type="text"
                className="input-field font-mono"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
            <span className="muted-text">{t('tools:colorSuite.backgroundLabel')}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="color"
                value={bgNorm}
                onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                style={{ width: '48px', height: '40px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
              />
              <input
                type="text"
                className="input-field font-mono"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
          </label>
        </BentoCard>

        <BentoCard span="7">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">{t('tools:colorSuite.wcagTitle')}</h2>
            <span className="glass-pill glass-pill-active" style={{ fontSize: '0.92rem', fontWeight: 700 }}>
              {contrast ? `${contrast.ratio}:1` : t('tools:colorSuite.invalidColor')}
            </span>
          </div>

          <div
            style={{
              backgroundColor: bgNorm,
              color: fgNorm,
              border: '1px solid var(--glass-border-highlight)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {t('tools:colorSuite.specimenHeading')}
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.55 }}>
              {t('tools:colorSuite.specimenBody')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.55rem' }}>
            {badges.map((b) => (
              <div
                key={b.label}
                className={`glass-panel ${b.pass ? 'badge-success' : 'badge-danger'}`}
                style={{ padding: '0.55rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
              >
                {b.pass ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'palette-generator') {
    const cssExport = `:root {\n${scale.map((s) => `  --color-${s.stop}: ${s.hex};`).join('\n')}\n}`;
    const jsonExport = JSON.stringify(
      Object.fromEntries(scale.map((s) => [String(s.stop), s.hex])),
      null,
      2
    );

    return (
      <BentoGrid>
        <BentoCard span="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input
                type="color"
                value={validHex}
                onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                style={{ width: '44px', height: '40px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
              />
              <input
                type="text"
                className="input-field font-mono"
                style={{ width: '140px' }}
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <CopyButton value={cssExport} label={t('tools:colorSuite.copyCssVarsBtn')} onCopied={onRun} />
              <CopyButton value={jsonExport} label={t('tools:colorSuite.copyJsonBtn')} onCopied={onRun} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: '0.5rem' }}>
            {scale.map((stop) => (
              <div
                key={stop.stop}
                style={{
                  backgroundColor: stop.hex,
                  color: stop.textOnStop,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 0.65rem',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{stop.stop}</span>
                <span className="font-mono" style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  {stop.hex}
                </span>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  // CSS Glassmorphism & Bento Card Generator
  const cssCode = `.bento-glass-card {\n  background: rgba(24, 24, 28, ${glassBgAlpha});\n  backdrop-filter: blur(${glassBlur}px) saturate(${glassSaturation}%);\n  -webkit-backdrop-filter: blur(${glassBlur}px) saturate(${glassSaturation}%);\n  border: 1px solid rgba(255, 255, 255, ${glassBorderAlpha});\n  border-radius: ${glassRadius}px;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.45);\n}`;

  return (
    <BentoGrid>
      <BentoCard span="5">
        <h2 className="section-title">{t('tools:colorSuite.glassControlsTitle')}</h2>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.83rem' }}>
          <span className="muted-text">
            {t('tools:colorSuite.bgOpacityLabel', { value: glassBgAlpha })}
          </span>
          <input
            type="range"
            min={0.1}
            max={0.95}
            step={0.02}
            value={glassBgAlpha}
            onChange={(e) => setGlassBgAlpha(Number(e.target.value))}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.83rem' }}>
          <span className="muted-text">
            {t('tools:colorSuite.backdropBlurLabel', { value: glassBlur })}
          </span>
          <input
            type="range"
            min={0}
            max={40}
            value={glassBlur}
            onChange={(e) => setGlassBlur(Number(e.target.value))}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.83rem' }}>
          <span className="muted-text">
            {t('tools:colorSuite.saturationLabel', { value: glassSaturation })}
          </span>
          <input
            type="range"
            min={100}
            max={220}
            step={5}
            value={glassSaturation}
            onChange={(e) => setGlassSaturation(Number(e.target.value))}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.83rem' }}>
          <span className="muted-text">
            {t('tools:colorSuite.borderAlphaLabel', { value: glassBorderAlpha })}
          </span>
          <input
            type="range"
            min={0.02}
            max={0.4}
            step={0.02}
            value={glassBorderAlpha}
            onChange={(e) => setGlassBorderAlpha(Number(e.target.value))}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.83rem' }}>
          <span className="muted-text">
            {t('tools:colorSuite.borderRadiusLabel', { value: glassRadius })}
          </span>
          <input
            type="range"
            min={0}
            max={32}
            value={glassRadius}
            onChange={(e) => setGlassRadius(Number(e.target.value))}
          />
        </label>
      </BentoCard>

      <BentoCard span="7">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">{t('tools:colorSuite.liveStageTitle')}</h2>
          <CopyButton value={cssCode} label={t('tools:colorSuite.copyCssBtn')} onCopied={onRun} />
        </div>
        <div
          style={{
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            background:
              'radial-gradient(circle at 20% 25%, rgba(16, 185, 129, 0.35), transparent 55%), radial-gradient(circle at 80% 75%, rgba(161, 161, 170, 0.25), transparent 55%), #09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '1.25rem',
              color: '#f4f4f6',
              background: `rgba(24, 24, 28, ${glassBgAlpha})`,
              backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation}%)`,
              WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation}%)`,
              border: `1px solid rgba(255, 255, 255, ${glassBorderAlpha})`,
              borderRadius: `${glassRadius}px`,
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.45)',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
              {t('tools:colorSuite.previewCardTitle')}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#a1a1aa' }}>
              {t('tools:colorSuite.previewCardSubtitle')}
            </div>
          </div>
        </div>
        <pre className="glass-panel font-mono" style={{ margin: 0, padding: '0.85rem', fontSize: '0.79rem', overflowX: 'auto' }}>
          {cssCode}
        </pre>
      </BentoCard>
    </BentoGrid>
  );
}
