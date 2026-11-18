'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import { CopyButton } from '@/components/common/CopyButton';
import { formatBytes, optimizeSvgMarkup } from '@/lib/tools/engines/image';
import { useI18n } from '@/i18n/client';
import type { ToolSuiteProps } from '@/components/tools/suites/types';

interface LoadedImage {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
}

function readFileAsDataUrl(file: File, errMsg: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(errMsg));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string, errMsg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(errMsg));
    img.src = src;
  });
}

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Sample Bento Vector Badge -->
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
  <metadata>Created with vector editor</metadata>
  <rect x="12" y="12" width="136" height="136" rx="28" fill="#18181B" stroke="#10B981" stroke-width="4" />
  <path d="M52 82L72 102L110 60" stroke="#10B981" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const MAX_PERSISTED_DATA_URL_LEN = 1_500_000;

function getInitialLoadedImage(initialState?: Record<string, unknown> | null): LoadedImage | null {
  const raw = initialState?.sourceImg;
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<LoadedImage>;
  if (
    typeof candidate.name === 'string' &&
    typeof candidate.type === 'string' &&
    typeof candidate.size === 'number' &&
    typeof candidate.width === 'number' &&
    typeof candidate.height === 'number' &&
    typeof candidate.dataUrl === 'string' &&
    candidate.dataUrl.length <= MAX_PERSISTED_DATA_URL_LEN
  ) {
    return candidate as LoadedImage;
  }
  return null;
}

export function ImageToolsSuite({ toolId, initialState, onStateChange, onRun }: ToolSuiteProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [sourceImg, setSourceImg] = useState<LoadedImage | null>(() =>
    getInitialLoadedImage(initialState)
  );
  const [error, setError] = useState('');

  // Converter & Compressor controls
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>(
    (initialState?.targetFormat as 'image/png' | 'image/jpeg' | 'image/webp') || 'image/webp'
  );
  const [quality, setQuality] = useState<number>(
    typeof initialState?.quality === 'number' ? initialState.quality : 0.82
  );
  const [targetWidth, setTargetWidth] = useState<number>(
    typeof initialState?.targetWidth === 'number' ? initialState.targetWidth : 0
  );
  const [targetHeight, setTargetHeight] = useState<number>(
    typeof initialState?.targetHeight === 'number' ? initialState.targetHeight : 0
  );
  const [lockAspect, setLockAspect] = useState<boolean>(
    typeof initialState?.lockAspect === 'boolean' ? initialState.lockAspect : true
  );
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [outputBytes, setOutputBytes] = useState<number>(0);

  // SVG Optimizer state
  const [svgInput, setSvgInput] = useState<string>(
    typeof initialState?.svgInput === 'string' ? initialState.svgInput : SAMPLE_SVG
  );

  useEffect(() => {
    const persistedSourceImg =
      sourceImg && sourceImg.dataUrl.length <= MAX_PERSISTED_DATA_URL_LEN ? sourceImg : null;
    onStateChange?.({
      targetFormat,
      quality,
      targetWidth,
      targetHeight,
      lockAspect,
      svgInput,
      ...(persistedSourceImg ? { sourceImg: persistedSourceImg } : {}),
    });
  }, [targetFormat, quality, targetWidth, targetHeight, lockAspect, svgInput, sourceImg, onStateChange]);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError('');
    try {
      if (toolId === 'svg-optimizer') {
        const txt = await file.text();
        setSvgInput(txt);
        onRun?.();
        return;
      }
      const dataUrl = await readFileAsDataUrl(file, t('tools:imageSuite.readFileError'));
      const el = await loadImageElement(dataUrl, t('tools:imageSuite.invalidImageError'));
      setSourceImg({
        name: file.name,
        type: file.type || 'image/png',
        size: file.size,
        width: el.naturalWidth,
        height: el.naturalHeight,
        dataUrl,
      });
      setTargetWidth(el.naturalWidth);
      setTargetHeight(el.naturalHeight);
      onRun?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools:imageSuite.unableToLoadError'));
    }
  };

  // Render converted / compressed image via Canvas
  useEffect(() => {
    if (!sourceImg || (toolId !== 'image-converter' && toolId !== 'image-compressor')) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const el = await loadImageElement(sourceImg.dataUrl, 'Invalid image format');
        const w = toolId === 'image-compressor' && targetWidth > 0 ? targetWidth : el.naturalWidth;
        const h = toolId === 'image-compressor' && targetHeight > 0 ? targetHeight : el.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(el, 0, 0, w, h);
        canvas.toBlob(
          (blob) => {
            if (cancelled || !blob) return;
            const url = URL.createObjectURL(blob);
            setOutputUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
            setOutputBytes(blob.size);
          },
          targetFormat,
          targetFormat === 'image/png' ? undefined : quality
        );
      } catch {
        // Ignore transient canvas failures
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sourceImg, targetFormat, quality, targetWidth, targetHeight, toolId]);

  const svgResult = useMemo(() => optimizeSvgMarkup(svgInput), [svgInput]);

  if (toolId === 'svg-optimizer') {
    const safeSvgPreview =
      svgResult.optimized.includes('<svg') && !svgResult.optimized.toLowerCase().includes('<script')
        ? svgResult.optimized
        : '';

    return (
      <BentoGrid>
        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">{t('tools:imageSuite.rawSvgTitle')}</h2>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} /> {t('tools:imageSuite.loadSvgBtn')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          <textarea
            className="textarea-field font-mono"
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            aria-label={t('tools:imageSuite.rawSvgAria')}
            style={{ minHeight: '260px', fontSize: '0.8rem' }}
          />
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span className="glass-pill">
              {t('tools:imageSuite.originalPill', { size: formatBytes(svgResult.originalBytes) })}
            </span>
            <span className="glass-pill">
              {t('tools:imageSuite.minifiedPill', { size: formatBytes(svgResult.optimizedBytes) })}
            </span>
            <span className="glass-pill glass-pill-active">
              {t('tools:imageSuite.savedPill', { percent: svgResult.savedPercent })}
            </span>
          </div>
        </BentoCard>

        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">{t('tools:imageSuite.previewOutputTitle')}</h2>
            <CopyButton
              value={svgResult.optimized}
              label={t('tools:imageSuite.copySvgBtn')}
              onCopied={onRun}
            />
          </div>
          <div
            className="checkerboard glass-panel"
            style={{
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '0.75rem',
            }}
          >
            {safeSvgPreview ? (
              <div
                style={{ maxWidth: '100%', maxHeight: '100%', display: 'flex' }}
                dangerouslySetInnerHTML={{ __html: safeSvgPreview }}
              />
            ) : (
              <span className="subtle-text">{t('tools:imageSuite.pasteValidSvg')}</span>
            )}
          </div>
          <textarea
            className="textarea-field font-mono"
            readOnly
            value={svgResult.optimized}
            aria-label={t('tools:imageSuite.optimizedSvgAria')}
            style={{ minHeight: '110px', fontSize: '0.78rem' }}
          />
        </BentoCard>
      </BentoGrid>
    );
  }

  const dropzone = (
    <div
      className={`dropzone ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
      }}
    >
      <Upload size={22} style={{ color: 'var(--accent)', marginBottom: '0.45rem' }} />
      <div style={{ fontWeight: 600, fontSize: '0.94rem' }}>
        {t('tools:imageSuite.dropTitle')}
      </div>
      <div className="subtle-text">{t('tools:imageSuite.dropSubtitle')}</div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );

  if (toolId === 'image-base64') {
    const rawBase64 = sourceImg ? sourceImg.dataUrl.split(',')[1] ?? '' : '';
    const cssSnippet = sourceImg ? `background-image: url("${sourceImg.dataUrl}");` : '';
    const htmlSnippet = sourceImg ? `<img src="${sourceImg.dataUrl}" alt="${sourceImg.name}" />` : '';

    return (
      <BentoGrid>
        <BentoCard span="6">
          <h2 className="section-title">{t('tools:imageSuite.selectImageTitle')}</h2>
          {dropzone}
          {error && <p style={{ color: 'var(--danger)', margin: 0 }}>{error}</p>}
          {sourceImg && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="glass-pill">{sourceImg.name}</span>
                <span className="glass-pill">{sourceImg.width}×{sourceImg.height}</span>
                <span className="glass-pill">{formatBytes(sourceImg.size)}</span>
              </div>
              <div className="checkerboard glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourceImg.dataUrl}
                  alt={sourceImg.name}
                  style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </BentoCard>

        <BentoCard span="6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">{t('tools:imageSuite.dataUrlTitle')}</h2>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <CopyButton value={sourceImg?.dataUrl ?? ''} label={t('tools:imageSuite.copyDataUrl')} />
              <CopyButton value={rawBase64} label={t('tools:imageSuite.copyRawBase64')} />
            </div>
          </div>
          <textarea
            className="textarea-field font-mono"
            readOnly
            value={sourceImg?.dataUrl ?? ''}
            placeholder={t('tools:imageSuite.dataUrlPlaceholder')}
            style={{ minHeight: '140px', fontSize: '0.76rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <CopyButton value={cssSnippet} label={t('tools:imageSuite.copyCssUrl')} />
            <CopyButton value={htmlSnippet} label={t('tools:imageSuite.copyHtmlImg')} />
          </div>
        </BentoCard>
      </BentoGrid>
    );
  }

  // Image Converter & Image Compressor
  const savings =
    sourceImg && outputBytes > 0
      ? Number((((sourceImg.size - outputBytes) / sourceImg.size) * 100).toFixed(1))
      : 0;
  const ext = targetFormat.split('/')[1] === 'jpeg' ? 'jpg' : targetFormat.split('/')[1];

  return (
    <BentoGrid>
      <BentoCard span="6">
        <h2 className="section-title">{t('tools:imageSuite.sourceSettingsTitle')}</h2>
        {dropzone}
        {error && <p style={{ color: 'var(--danger)', margin: 0 }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
            <span className="muted-text">{t('tools:imageSuite.targetFormatLabel')}</span>
            <select
              className="select-field"
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as 'image/png' | 'image/jpeg' | 'image/webp')}
            >
              <option value="image/webp">{t('tools:imageSuite.formatWebp')}</option>
              <option value="image/jpeg">{t('tools:imageSuite.formatJpeg')}</option>
              <option value="image/png">{t('tools:imageSuite.formatPng')}</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
            <span className="muted-text">
              {t('tools:imageSuite.qualityLabel', { percent: Math.round(quality * 100) })}
            </span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.02}
              value={quality}
              disabled={targetFormat === 'image/png'}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </label>
        </div>

        {toolId === 'image-compressor' && sourceImg && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="muted-text" style={{ fontSize: '0.82rem' }}>
                {t('tools:imageSuite.resizeDimensionsLabel')}
              </span>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                />
                {t('tools:imageSuite.lockAspectLabel')}
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <input
                type="number"
                className="input-field"
                min={16}
                max={8000}
                value={targetWidth}
                onChange={(e) => {
                  const w = Math.max(1, Number(e.target.value));
                  setTargetWidth(w);
                  if (lockAspect && sourceImg.width > 0) {
                    setTargetHeight(Math.round((w / sourceImg.width) * sourceImg.height));
                  }
                }}
                aria-label={t('tools:imageSuite.targetWidthAria')}
              />
              <input
                type="number"
                className="input-field"
                min={16}
                max={8000}
                value={targetHeight}
                onChange={(e) => {
                  const h = Math.max(1, Number(e.target.value));
                  setTargetHeight(h);
                  if (lockAspect && sourceImg.height > 0) {
                    setTargetWidth(Math.round((h / sourceImg.height) * sourceImg.width));
                  }
                }}
                aria-label={t('tools:imageSuite.targetHeightAria')}
              />
            </div>
          </div>
        )}
      </BentoCard>

      <BentoCard span="6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:imageSuite.convertedPreviewTitle')}</h2>
          {outputUrl && sourceImg && (
            <a
              href={outputUrl}
              download={`${sourceImg.name.replace(/\.[^.]+$/, '')}.${ext}`}
              className="btn btn-primary btn-sm"
              onClick={() => onRun?.()}
            >
              <Download size={14} /> {t('tools:imageSuite.downloadBtn', { ext })}
            </a>
          )}
        </div>

        {sourceImg && outputUrl ? (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="glass-pill">
                {t('tools:imageSuite.beforePill', { size: formatBytes(sourceImg.size) })}
              </span>
              <span className="glass-pill">
                {t('tools:imageSuite.afterPill', { size: formatBytes(outputBytes) })}
              </span>
              <span className={`glass-pill ${savings >= 0 ? 'glass-pill-active' : ''}`}>
                {savings >= 0
                  ? t('tools:imageSuite.smallerPill', { percent: savings })
                  : t('tools:imageSuite.largerPill', { percent: Math.abs(savings) })}
              </span>
            </div>
            <div className="checkerboard glass-panel" style={{ padding: '0.85rem', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={outputUrl}
                alt={t('tools:imageSuite.convertedAlt')}
                style={{ maxHeight: '240px', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </>
        ) : (
          <div className="glass-panel" style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
            <p className="muted-text" style={{ margin: 0 }}>
              {t('tools:imageSuite.emptyHint')}
            </p>
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  );
}
