'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, CheckCircle2, Upload, XCircle } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { CopyButton } from '@/components/common/CopyButton';
import {
  computeHashes,
  computeLineDiff,
  convertStructuredData,
  inspectMagicBytes,
  type DataFormat,
  type MagicSignatureResult,
} from '@/lib/tools/engines/file';
import { formatBytes } from '@/lib/tools/engines/image';
import { useI18n } from '@/i18n/client';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

const SAMPLE_JSON = `[
  { "service": "api-gateway", "port": 8080, "tls": true },
  { "service": "auth-worker", "port": 9090, "tls": true }
]`;

export function FileToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
  const { locale, t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. JSON <-> YAML <-> CSV
  const [fromFmt, setFromFmt] = useState<DataFormat>(
    (initialState?.fromFmt as DataFormat) || 'json'
  );
  const [toFmt, setToFmt] = useState<DataFormat>(
    (initialState?.toFmt as DataFormat) || 'yaml'
  );
  const [dataInput, setDataInput] = useState<string>(
    typeof initialState?.dataInput === 'string' ? initialState.dataInput : SAMPLE_JSON
  );

  // 2. Hash calculator
  const [hashText, setHashText] = useState<string>(
    typeof initialState?.hashText === 'string' ? initialState.hashText : 'omnidev-integrity-check'
  );
  const [hashFileName, setHashFileName] = useState<string>('');
  const [expectedHash, setExpectedHash] = useState<string>(
    typeof initialState?.expectedHash === 'string' ? initialState.expectedHash : ''
  );
  const [hashes, setHashes] = useState<Record<string, string>>({});

  // 3. Magic Bytes Inspector
  const [magicBytes, setMagicBytes] = useState<Uint8Array | null>(null);
  const [magicFileName, setMagicFileName] = useState<string>('');
  const [magicSampleMode, setMagicSampleMode] = useState<boolean>(false);

  // 4. Side-by-Side Diff
  const [leftText, setLeftText] = useState<string>(
    typeof initialState?.leftText === 'string'
      ? initialState.leftText
      : 'server {\n  listen 80;\n  server_name api.dev;\n}'
  );
  const [rightText, setRightText] = useState<string>(
    typeof initialState?.rightText === 'string'
      ? initialState.rightText
      : 'server {\n  listen 443 ssl;\n  server_name api.omnidev.io;\n  http2 on;\n}'
  );

  useEffect(() => {
    onStateChange?.({ fromFmt, toFmt, dataInput, hashText, expectedHash, leftText, rightText });
  }, [fromFmt, toFmt, dataInput, hashText, expectedHash, leftText, rightText, onStateChange]);

  // Auto-hash text changes
  useEffect(() => {
    if (toolId !== 'file-hash' || hashFileName) return;
    let active = true;
    void (async () => {
      const encoded = new TextEncoder().encode(hashText);
      const res = await computeHashes(encoded.buffer);
      if (active) setHashes(res);
    })();
    return () => {
      active = false;
    };
  }, [hashText, hashFileName, toolId]);

  const dataConversion = useMemo(
    () => convertStructuredData(dataInput, fromFmt, toFmt, true, locale),
    [dataInput, fromFmt, toFmt, locale]
  );

  const magicResult: MagicSignatureResult | null = useMemo(
    () => (magicBytes ? inspectMagicBytes(magicBytes, locale) : null),
    [magicBytes, locale]
  );

  const diffLines = useMemo(
    () => (toolId === 'file-diff' ? computeLineDiff(leftText, rightText) : []),
    [leftText, rightText, toolId]
  );

  const handleHashFile = async (file: File | undefined) => {
    if (!file) return;
    setHashFileName(`${file.name} (${formatBytes(file.size)})`);
    const buf = await file.arrayBuffer();
    const res = await computeHashes(buf);
    setHashes(res);
    onRun?.();
  };

  const handleMagicFile = async (file: File | undefined) => {
    if (!file) return;
    setMagicSampleMode(false);
    setMagicFileName(`${file.name} (${formatBytes(file.size)})`);
    const slice = await file.slice(0, 512).arrayBuffer();
    setMagicBytes(new Uint8Array(slice));
    onRun?.();
  };

  if (toolId === 'data-converter') {
    return (
      <BentoGrid>
        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2 className="section-title">
              {t('tools:fileSuite.inputHeading', { format: fromFmt.toUpperCase() })}
            </h2>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <select
                className="select-field"
                style={{ width: 'auto', padding: '0.35rem 0.65rem' }}
                value={fromFmt}
                onChange={(e) => setFromFmt(e.target.value as DataFormat)}
                aria-label={t('tools:fileSuite.sourceFormatAria')}
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="csv">CSV</option>
              </select>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  if (dataConversion.ok) {
                    setFromFmt(toFmt);
                    setToFmt(fromFmt);
                    setDataInput(dataConversion.output);
                    onRun?.();
                  }
                }}
                aria-label={t('tools:fileSuite.swapFormatsAria')}
              >
                <ArrowLeftRight size={14} /> {t('actions.swap')}
              </button>
              <select
                className="select-field"
                style={{ width: 'auto', padding: '0.35rem 0.65rem' }}
                value={toFmt}
                onChange={(e) => setToFmt(e.target.value as DataFormat)}
                aria-label={t('tools:fileSuite.targetFormatAria')}
              >
                <option value="yaml">YAML</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <textarea
            className="textarea-field font-mono"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            style={{ minHeight: '280px', fontSize: '0.82rem' }}
            aria-label={t('tools:fileSuite.structuredInputAria')}
          />
        </BentoCard>

        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">
              {t('tools:fileSuite.outputHeading', { format: toFmt.toUpperCase() })}
            </h2>
            <CopyButton
              value={dataConversion.ok ? dataConversion.output : ''}
              label={t('tools:fileSuite.copyFormatBtn', { format: toFmt.toUpperCase() })}
              onCopied={onRun}
            />
          </div>
          {!dataConversion.ok ? (
            <div className="glass-panel badge-danger" style={{ padding: '1rem' }}>
              <strong>{t('tools:fileSuite.parseError')}</strong> {dataConversion.error}
            </div>
          ) : (
            <textarea
              className="textarea-field font-mono"
              readOnly
              value={dataConversion.output}
              style={{ minHeight: '280px', fontSize: '0.82rem' }}
              aria-label={t('tools:fileSuite.structuredOutputAria')}
            />
          )}
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'file-hash') {
    const normalizedExpected = expectedHash.trim().toLowerCase();
    const matchedAlgo = normalizedExpected
      ? Object.entries(hashes).find(([, val]) => val.toLowerCase() === normalizedExpected)?.[0]
      : undefined;

    return (
      <BentoGrid>
        <BentoCard span="5">
          <h2 className="section-title">{t('tools:fileSuite.hashInputTitle')}</h2>
          <div
            className="dropzone"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
          >
            <Upload size={20} style={{ color: 'var(--accent)', marginBottom: '0.35rem' }} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {hashFileName || t('tools:fileSuite.dropHashTitle')}
            </div>
            <div className="subtle-text">{t('tools:fileSuite.dropHashSub')}</div>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => void handleHashFile(e.target.files?.[0])}
            />
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
            <span className="muted-text">{t('tools:fileSuite.hashTextLabel')}</span>
            <textarea
              className="textarea-field font-mono"
              value={hashText}
              onChange={(e) => {
                setHashFileName('');
                setHashText(e.target.value);
              }}
              style={{ minHeight: '95px', fontSize: '0.82rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
            <span className="muted-text">{t('tools:fileSuite.expectedHashLabel')}</span>
            <input
              type="text"
              className="input-field font-mono"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder={t('tools:fileSuite.expectedHashPlaceholder')}
            />
          </label>
          {normalizedExpected && (
            <div
              className={`glass-panel ${matchedAlgo ? 'badge-success' : 'badge-danger'}`}
              style={{ padding: '0.6rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}
            >
              {matchedAlgo ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>
                {matchedAlgo
                  ? t('tools:fileSuite.checksumMatch', { algo: matchedAlgo })
                  : t('tools:fileSuite.checksumMismatch')}
              </span>
            </div>
          )}
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">{t('tools:fileSuite.digestsTitle')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(['SHA-256', 'SHA-512', 'SHA-384', 'SHA-1'] as const).map((algo) => (
              <div key={algo} className="glass-panel" style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="glass-pill">{algo}</span>
                  <CopyButton value={hashes[algo] ?? ''} label={t('actions.copy')} onCopied={onRun} />
                </div>
                <code className="font-mono" style={{ fontSize: '0.79rem', wordBreak: 'break-all' }}>
                  {hashes[algo] || t('tools:fileSuite.computing')}
                </code>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'file-inspector') {
    const displayedName = magicSampleMode
      ? t('tools:fileSuite.samplePngName')
      : magicFileName || t('tools:fileSuite.dropMagicTitle');

    return (
      <BentoGrid>
        <BentoCard span="5">
          <h2 className="section-title">{t('tools:fileSuite.selectMagicTitle')}</h2>
          <div
            className="dropzone"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
          >
            <Upload size={22} style={{ color: 'var(--accent)', marginBottom: '0.4rem' }} />
            <div style={{ fontWeight: 600 }}>{displayedName}</div>
            <div className="subtle-text">{t('tools:fileSuite.dropMagicSub')}</div>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => void handleMagicFile(e.target.files?.[0])}
            />
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52]);
              setMagicSampleMode(true);
              setMagicFileName('');
              setMagicBytes(pngBytes);
              onRun?.();
            }}
          >
            {t('tools:fileSuite.inspectSampleBtn')}
          </button>
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">{t('tools:fileSuite.magicReportTitle')}</h2>
          {magicResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="glass-pill glass-pill-active">{magicResult.detectedMime}</span>
                <span className="glass-pill">{magicResult.formatName}</span>
                <span className="glass-pill">.{magicResult.extension}</span>
                <span className="glass-pill">
                  {magicResult.confidence === 'exact'
                    ? t('tools:fileSuite.confidenceExact')
                    : t('tools:fileSuite.confidenceHeuristic')}
                </span>
              </div>
              <div className="glass-panel" style={{ padding: '0.8rem' }}>
                <div className="subtle-text" style={{ marginBottom: '0.35rem' }}>
                  {t('tools:fileSuite.leadingHexLabel')}
                </div>
                <code className="font-mono" style={{ fontSize: '0.82rem', wordBreak: 'break-word' }}>
                  {magicResult.hexHeader}
                </code>
              </div>
              <div className="glass-panel" style={{ padding: '0.8rem' }}>
                <div className="subtle-text" style={{ marginBottom: '0.35rem' }}>
                  {t('tools:fileSuite.asciiPreviewLabel')}
                </div>
                <code className="font-mono" style={{ fontSize: '0.82rem' }}>
                  {magicResult.asciiPreview}
                </code>
              </div>
            </div>
          ) : (
            <p className="muted-text">{t('tools:fileSuite.magicEmpty')}</p>
          )}
        </BentoCard>
      </BentoGrid>
    );
  }

  // Side-by-Side Diff Checker
  const addedCount = diffLines.filter((l) => l.type === 'added').length;
  const removedCount = diffLines.filter((l) => l.type === 'removed').length;

  return (
    <BentoGrid>
      <BentoCard span="6">
        <h2 className="section-title">{t('tools:fileSuite.diffOriginalTitle')}</h2>
        <textarea
          className="textarea-field font-mono"
          value={leftText}
          onChange={(e) => setLeftText(e.target.value)}
          style={{ minHeight: '190px', fontSize: '0.82rem' }}
        />
      </BentoCard>
      <BentoCard span="6">
        <h2 className="section-title">{t('tools:fileSuite.diffModifiedTitle')}</h2>
        <textarea
          className="textarea-field font-mono"
          value={rightText}
          onChange={(e) => setRightText(e.target.value)}
          style={{ minHeight: '190px', fontSize: '0.82rem' }}
        />
      </BentoCard>
      <BentoCard span="12">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:fileSuite.diffOutputTitle')}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="glass-pill badge-success">
              {t('tools:fileSuite.diffAdded', { count: addedCount })}
            </span>
            <span className="glass-pill badge-danger">
              {t('tools:fileSuite.diffRemoved', { count: removedCount })}
            </span>
          </div>
        </div>
        <div
          className="glass-panel font-mono"
          style={{ overflowX: 'auto', fontSize: '0.81rem', maxHeight: '360px', overflowY: 'auto' }}
        >
          {diffLines.map((line, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '44px 44px 24px 1fr',
                padding: '0.2rem 0.65rem',
                background:
                  line.type === 'added'
                    ? 'var(--accent-glow)'
                    : line.type === 'removed'
                      ? 'var(--danger-bg)'
                      : 'transparent',
                color:
                  line.type === 'added'
                    ? 'var(--accent)'
                    : line.type === 'removed'
                      ? 'var(--danger)'
                      : 'var(--text-primary)',
                borderBottom: '1px solid var(--glass-border)',
              }}
            >
              <span className="subtle-text">{line.leftLine ?? ''}</span>
              <span className="subtle-text">{line.rightLine ?? ''}</span>
              <span>{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
              <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line.text || ' '}</span>
            </div>
          ))}
        </div>
      </BentoCard>
    </BentoGrid>
  );
}
