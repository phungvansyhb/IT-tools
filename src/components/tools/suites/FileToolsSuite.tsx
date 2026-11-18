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
import type { ToolSuiteProps } from '@/components/tools/suites/types';

const SAMPLE_JSON = `[
  { "service": "api-gateway", "port": 8080, "tls": true },
  { "service": "auth-worker", "port": 9090, "tls": true }
]`;

export function FileToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
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
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  // 3. Magic Bytes Inspector
  const [magicResult, setMagicResult] = useState<MagicSignatureResult | null>(null);
  const [magicFileName, setMagicFileName] = useState<string>('');

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
    onStateChange?.({ fromFmt, toFmt, dataInput, hashText, leftText, rightText });
  }, [fromFmt, toFmt, dataInput, hashText, leftText, rightText, onStateChange]);

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
    () => convertStructuredData(dataInput, fromFmt, toFmt, true),
    [dataInput, fromFmt, toFmt]
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
    setMagicFileName(`${file.name} (${formatBytes(file.size)})`);
    const slice = await file.slice(0, 512).arrayBuffer();
    setMagicResult(inspectMagicBytes(new Uint8Array(slice)));
    onRun?.();
  };

  if (toolId === 'data-converter') {
    return (
      <BentoGrid>
        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2 className="section-title">Input ({fromFmt.toUpperCase()})</h2>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <select
                className="select-field"
                style={{ width: 'auto', padding: '0.35rem 0.65rem' }}
                value={fromFmt}
                onChange={(e) => setFromFmt(e.target.value as DataFormat)}
                aria-label="Source format"
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
                aria-label="Swap formats"
              >
                <ArrowLeftRight size={14} /> Swap
              </button>
              <select
                className="select-field"
                style={{ width: 'auto', padding: '0.35rem 0.65rem' }}
                value={toFmt}
                onChange={(e) => setToFmt(e.target.value as DataFormat)}
                aria-label="Target format"
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
            aria-label="Structured data input"
          />
        </BentoCard>

        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Output ({toFmt.toUpperCase()})</h2>
            <CopyButton
              value={dataConversion.ok ? dataConversion.output : ''}
              label={`Copy ${toFmt.toUpperCase()}`}
              onCopied={onRun}
            />
          </div>
          {!dataConversion.ok ? (
            <div className="glass-panel badge-danger" style={{ padding: '1rem' }}>
              <strong>Parse Error:</strong> {dataConversion.error}
            </div>
          ) : (
            <textarea
              className="textarea-field font-mono"
              readOnly
              value={dataConversion.output}
              style={{ minHeight: '280px', fontSize: '0.82rem' }}
              aria-label="Structured data output"
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
          <h2 className="section-title">File or Text Input</h2>
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
              {hashFileName || 'Drop or select any file to hash'}
            </div>
            <div className="subtle-text">Computed locally with Web Crypto API</div>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => void handleHashFile(e.target.files?.[0])}
            />
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
            <span className="muted-text">Or hash UTF-8 text string</span>
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
            <span className="muted-text">Compare Expected Checksum (Optional)</span>
            <input
              type="text"
              className="input-field font-mono"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste expected SHA-256 / SHA-512 hex..."
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
                  ? `Checksum verified — matches ${matchedAlgo}`
                  : 'Checksum mismatch across SHA-1/256/384/512'}
              </span>
            </div>
          )}
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">Cryptographic Digests</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(['SHA-256', 'SHA-512', 'SHA-384', 'SHA-1'] as const).map((algo) => (
              <div key={algo} className="glass-panel" style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="glass-pill">{algo}</span>
                  <CopyButton value={hashes[algo] ?? ''} label="Copy" onCopied={onRun} />
                </div>
                <code className="font-mono" style={{ fontSize: '0.79rem', wordBreak: 'break-all' }}>
                  {hashes[algo] || 'Computing...'}
                </code>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  if (toolId === 'file-inspector') {
    return (
      <BentoGrid>
        <BentoCard span="5">
          <h2 className="section-title">Select Binary or Text File</h2>
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
            <div style={{ fontWeight: 600 }}>{magicFileName || 'Drop any file to inspect header bytes'}</div>
            <div className="subtle-text">Reads only the leading 512 bytes locally</div>
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
              setMagicFileName('sample-header.png (synthetic 16 B)');
              setMagicResult(inspectMagicBytes(pngBytes));
              onRun?.();
            }}
          >
            Inspect Sample PNG Signature
          </button>
        </BentoCard>

        <BentoCard span="7">
          <h2 className="section-title">Magic Bytes &amp; MIME Report</h2>
          {magicResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="glass-pill glass-pill-active">{magicResult.detectedMime}</span>
                <span className="glass-pill">{magicResult.formatName}</span>
                <span className="glass-pill">.{magicResult.extension}</span>
                <span className="glass-pill">{magicResult.confidence} match</span>
              </div>
              <div className="glass-panel" style={{ padding: '0.8rem' }}>
                <div className="subtle-text" style={{ marginBottom: '0.35rem' }}>Leading Hex Header (first 32 bytes)</div>
                <code className="font-mono" style={{ fontSize: '0.82rem', wordBreak: 'break-word' }}>
                  {magicResult.hexHeader}
                </code>
              </div>
              <div className="glass-panel" style={{ padding: '0.8rem' }}>
                <div className="subtle-text" style={{ marginBottom: '0.35rem' }}>ASCII Representation</div>
                <code className="font-mono" style={{ fontSize: '0.82rem' }}>
                  {magicResult.asciiPreview}
                </code>
              </div>
            </div>
          ) : (
            <p className="muted-text">Select a file or test the sample PNG signature to view hex headers.</p>
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
        <h2 className="section-title">Original (Left)</h2>
        <textarea
          className="textarea-field font-mono"
          value={leftText}
          onChange={(e) => setLeftText(e.target.value)}
          style={{ minHeight: '190px', fontSize: '0.82rem' }}
        />
      </BentoCard>
      <BentoCard span="6">
        <h2 className="section-title">Modified (Right)</h2>
        <textarea
          className="textarea-field font-mono"
          value={rightText}
          onChange={(e) => setRightText(e.target.value)}
          style={{ minHeight: '190px', fontSize: '0.82rem' }}
        />
      </BentoCard>
      <BentoCard span="12">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title">Line-by-Line Diff</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="glass-pill badge-success">+{addedCount} added</span>
            <span className="glass-pill badge-danger">-{removedCount} removed</span>
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
