'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Gauge,
  Play,
  ShieldCheck,
  Square,
  Trash2,
} from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import {
  assessNetworkSuitability,
  computeBandwidthMbps,
  computePingStats,
  generateIncompressibleBytes,
  type NetworkGrade,
  type NetworkUseCaseId,
} from '@/lib/tools/engines/diagnostics';
import { useI18n } from '@/i18n/client';
import type { DiagnosticsPanelProps } from '@/components/tools/suites/diagnostics/KeyboardTesterPanel';

type SpeedTestMode = 'quick' | 'standard';
type SpeedTestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'complete' | 'aborted' | 'error';

interface SpeedTracePoint {
  step: number;
  mbps: number;
}

interface SpeedHistoryEntry {
  id: string;
  timestamp: string;
  mode: SpeedTestMode;
  pingAvgMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  overallGrade: NetworkGrade;
}

const SPEED_HISTORY_STORAGE_KEY = 'omnidev_speedtest_history';
const MAX_HISTORY_ITEMS = 20;
const MIB = 1_048_576;

const TEST_PROFILES: Record<
  SpeedTestMode,
  { pingCount: number; downloadChunks: number[]; uploadChunks: number[] }
> = {
  quick: {
    pingCount: 6,
    downloadChunks: [1 * MIB, 2 * MIB],
    uploadChunks: [1 * MIB],
  },
  standard: {
    pingCount: 10,
    downloadChunks: [1 * MIB, 2 * MIB, 3 * MIB, 4 * MIB],
    uploadChunks: [1 * MIB, 2 * MIB, 3 * MIB],
  },
};

function parseSpeedMode(raw: unknown): SpeedTestMode {
  return raw === 'standard' ? 'standard' : 'quick';
}

function loadHistoryFromStorage(): SpeedHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SPEED_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is SpeedHistoryEntry => {
        if (!item || typeof item !== 'object') return false;
        const rec = item as Record<string, unknown>;
        return (
          typeof rec.id === 'string' &&
          typeof rec.timestamp === 'string' &&
          (rec.mode === 'quick' || rec.mode === 'standard') &&
          typeof rec.pingAvgMs === 'number' &&
          typeof rec.jitterMs === 'number' &&
          typeof rec.downloadMbps === 'number' &&
          typeof rec.uploadMbps === 'number' &&
          typeof rec.overallGrade === 'string'
        );
      })
      .slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

function saveHistoryToStorage(entries: SpeedHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      SPEED_HISTORY_STORAGE_KEY,
      JSON.stringify(entries.slice(0, MAX_HISTORY_ITEMS))
    );
  } catch {
    // Ignore storage quota errors
  }
}

function buildPolylinePoints(
  points: SpeedTracePoint[],
  width: number,
  height: number,
  maxMbps: number,
  totalSteps: number
): string {
  if (points.length === 0) return '';
  const safeMax = Math.max(10, maxMbps);
  const denomSteps = Math.max(1, totalSteps);
  const padX = 12;
  const padY = 14;
  const usableW = Math.max(1, width - padX * 2);
  const usableH = Math.max(1, height - padY * 2);

  return points
    .map((pt) => {
      const x = padX + (Math.min(denomSteps, Math.max(0, pt.step)) / denomSteps) * usableW;
      const clampedVal = Math.min(safeMax, Math.max(0, pt.mbps));
      const y = padY + usableH - (clampedVal / safeMax) * usableH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function SpeedTestPanel({
  initialState,
  onStateChange,
  onRun,
}: DiagnosticsPanelProps) {
  const { t } = useI18n();

  const [mode, setMode] = useState<SpeedTestMode>(() => parseSpeedMode(initialState?.mode));
  const [phase, setPhase] = useState<SpeedTestPhase>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [pingStats, setPingStats] = useState({ minMs: 0, avgMs: 0, maxMs: 0, jitterMs: 0 });
  const [downloadMbps, setDownloadMbps] = useState<number>(0);
  const [uploadMbps, setUploadMbps] = useState<number>(0);
  const [downloadTrace, setDownloadTrace] = useState<SpeedTracePoint[]>([]);
  const [uploadTrace, setUploadTrace] = useState<SpeedTracePoint[]>([]);
  const [hasCompletedOnce, setHasCompletedOnce] = useState<boolean>(false);

  const [history, setHistory] = useState<SpeedHistoryEntry[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const activeXhrRef = useRef<XMLHttpRequest | null>(null);
  const runTriggeredRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    onStateChange?.({ mode });
  }, [mode, onStateChange]);

  // Load history strictly after mount to avoid hydration mismatch
  useEffect(() => {
    isMountedRef.current = true;
    queueMicrotask(() => {
      if (isMountedRef.current) {
        setHistory(loadHistoryFromStorage());
      }
    });

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (activeXhrRef.current) {
        activeXhrRef.current.abort();
        activeXhrRef.current = null;
      }
    };
  }, []);

  const abortActiveTest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (activeXhrRef.current) {
      activeXhrRef.current.abort();
      activeXhrRef.current = null;
    }
    if (isMountedRef.current) {
      setPhase('aborted');
    }
  }, []);

  const uploadSingleChunk = useCallback(
    (payloadBytes: number, signal: AbortSignal, onProgressSample: (mbps: number) => void) =>
      new Promise<{ bytes: number; durationMs: number }>((resolve, reject) => {
        if (signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }

        const payload = generateIncompressibleBytes(
          payloadBytes,
          (Date.now() ^ payloadBytes) >>> 0
        );
        const blob = new Blob([payload.buffer as ArrayBuffer], {
          type: 'application/octet-stream',
        });

        const xhr = new XMLHttpRequest();
        activeXhrRef.current = xhr;

        const startTime = performance.now();
        let lastTraceAt = startTime;

        const handleAbort = () => {
          xhr.abort();
        };
        signal.addEventListener('abort', handleAbort, { once: true });

        xhr.upload.onprogress = (event) => {
          const now = performance.now();
          if (now - lastTraceAt < 100) return;
          lastTraceAt = now;
          const loaded = event.lengthComputable ? event.loaded : payloadBytes;
          const mbps = computeBandwidthMbps(loaded, Math.max(1, now - startTime));
          onProgressSample(mbps);
        };

        xhr.onload = () => {
          signal.removeEventListener('abort', handleAbort);
          if (activeXhrRef.current === xhr) activeXhrRef.current = null;

          if (xhr.status >= 200 && xhr.status < 300) {
            const elapsed = Math.max(1, performance.now() - startTime);
            resolve({ bytes: payloadBytes, durationMs: elapsed });
          } else {
            reject(new Error(`Upload HTTP ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          signal.removeEventListener('abort', handleAbort);
          if (activeXhrRef.current === xhr) activeXhrRef.current = null;
          reject(new Error('Upload network error'));
        };

        xhr.onabort = () => {
          signal.removeEventListener('abort', handleAbort);
          if (activeXhrRef.current === xhr) activeXhrRef.current = null;
          reject(new DOMException('Aborted', 'AbortError'));
        };

        xhr.open('POST', `/api/speedtest/upload?t=${Date.now()}`, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.send(blob);
      }),
    []
  );

  const startTest = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (activeXhrRef.current) {
      activeXhrRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const { signal } = controller;

    const profile = TEST_PROFILES[mode];

    setErrorMsg(null);
    setHasCompletedOnce(false);
    setPingStats({ minMs: 0, avgMs: 0, maxMs: 0, jitterMs: 0 });
    setDownloadMbps(0);
    setUploadMbps(0);
    setDownloadTrace([]);
    setUploadTrace([]);
    setProgressPercent(2);
    setPhase('ping');

    if (!runTriggeredRef.current) {
      runTriggeredRef.current = true;
      onRun?.();
    }

    try {
      // Phase 1: Ping & Jitter
      const pingSamples: number[] = [];
      for (let i = 0; i < profile.pingCount; i++) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        const t0 = performance.now();
        const res = await fetch(`/api/speedtest/ping?t=${Date.now()}-${i}`, {
          method: 'GET',
          cache: 'no-store',
          signal,
        });
        if (!res.ok) throw new Error(`Ping HTTP ${res.status}`);
        await res.text();
        const rtt = Math.max(0.1, performance.now() - t0);
        pingSamples.push(rtt);

        if (!isMountedRef.current) return;
        const stats = computePingStats(pingSamples);
        setPingStats(stats);
        setProgressPercent(Math.round(((i + 1) / profile.pingCount) * 25));
      }

      const finalPingStats = computePingStats(pingSamples);

      // Phase 2: Download Throughput
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      setPhase('download');

      let totalDlBytes = 0;
      let totalDlDurationMs = 0;
      let dlStepCounter = 0;
      let latestDlMbps = 0;

      for (let c = 0; c < profile.downloadChunks.length; c++) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        const chunkSize = profile.downloadChunks[c];
        const chunkStart = performance.now();
        const res = await fetch(`/api/speedtest/download?bytes=${chunkSize}&t=${Date.now()}-${c}`, {
          method: 'GET',
          cache: 'no-store',
          signal,
        });
        if (!res.ok) throw new Error(`Download HTTP ${res.status}`);

        let chunkReceived = 0;
        let lastUiSample = chunkStart;

        if (res.body) {
          const reader = res.body.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                chunkReceived += value.byteLength;
                const now = performance.now();
                if (now - lastUiSample >= 100) {
                  lastUiSample = now;
                  const cumBytes = totalDlBytes + chunkReceived;
                  const cumDuration = totalDlDurationMs + (now - chunkStart);
                  const liveMbps = computeBandwidthMbps(cumBytes, Math.max(1, cumDuration));
                  latestDlMbps = liveMbps;
                  dlStepCounter += 1;
                  if (!isMountedRef.current) return;
                  setDownloadMbps(liveMbps);
                  setDownloadTrace((prev) => [...prev, { step: dlStepCounter, mbps: liveMbps }]);
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        } else {
          const buf = await res.arrayBuffer();
          chunkReceived = buf.byteLength;
        }

        const chunkElapsed = Math.max(1, performance.now() - chunkStart);
        totalDlBytes += chunkReceived;
        totalDlDurationMs += chunkElapsed;

        latestDlMbps = computeBandwidthMbps(totalDlBytes, totalDlDurationMs);
        dlStepCounter += 1;
        if (!isMountedRef.current) return;
        setDownloadMbps(latestDlMbps);
        setDownloadTrace((prev) => [...prev, { step: dlStepCounter, mbps: latestDlMbps }]);
        setProgressPercent(25 + Math.round(((c + 1) / profile.downloadChunks.length) * 40));
      }

      // Phase 3: Upload Throughput (XHR with upload.onprogress)
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      setPhase('upload');

      let totalUlBytes = 0;
      let totalUlDurationMs = 0;
      let ulStepCounter = 0;
      let latestUlMbps = 0;

      for (let c = 0; c < profile.uploadChunks.length; c++) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        const chunkSize = profile.uploadChunks[c];
        const result = await uploadSingleChunk(chunkSize, signal, (sampleMbps) => {
          if (!isMountedRef.current) return;
          ulStepCounter += 1;
          latestUlMbps = sampleMbps;
          setUploadMbps(sampleMbps);
          setUploadTrace((prev) => [...prev, { step: ulStepCounter, mbps: sampleMbps }]);
        });

        totalUlBytes += result.bytes;
        totalUlDurationMs += result.durationMs;
        latestUlMbps = computeBandwidthMbps(totalUlBytes, totalUlDurationMs);
        ulStepCounter += 1;

        if (!isMountedRef.current) return;
        setUploadMbps(latestUlMbps);
        setUploadTrace((prev) => [...prev, { step: ulStepCounter, mbps: latestUlMbps }]);
        setProgressPercent(65 + Math.round(((c + 1) / profile.uploadChunks.length) * 35));
      }

      if (!isMountedRef.current) return;
      setPhase('complete');
      setProgressPercent(100);
      setHasCompletedOnce(true);

      const finalSuitability = assessNetworkSuitability({
        pingMs: finalPingStats.avgMs,
        jitterMs: finalPingStats.jitterMs,
        downloadMbps: latestDlMbps,
        uploadMbps: latestUlMbps,
      });

      const entry: SpeedHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        mode,
        pingAvgMs: finalPingStats.avgMs,
        jitterMs: finalPingStats.jitterMs,
        downloadMbps: latestDlMbps,
        uploadMbps: latestUlMbps,
        overallGrade: finalSuitability.overallGrade,
      };

      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, MAX_HISTORY_ITEMS);
        saveHistoryToStorage(next);
        return next;
      });
    } catch (err) {
      if (!isMountedRef.current) return;
      if (err instanceof DOMException && err.name === 'AbortError') {
        setPhase('aborted');
      } else {
        setPhase('error');
        setErrorMsg(err instanceof Error ? err.message : String(err));
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [mode, onRun, uploadSingleChunk]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(SPEED_HISTORY_STORAGE_KEY);
      } catch {
        // Ignore storage error
      }
    }
  }, []);

  const isRunning = phase === 'ping' || phase === 'download' || phase === 'upload';

  const suitability = useMemo(
    () =>
      assessNetworkSuitability({
        pingMs: pingStats.avgMs,
        jitterMs: pingStats.jitterMs,
        downloadMbps,
        uploadMbps,
      }),
    [pingStats.avgMs, pingStats.jitterMs, downloadMbps, uploadMbps]
  );

  const phaseLabel = useMemo(() => {
    switch (phase) {
      case 'ping':
        return t('tools:diagnosticsSuite.speed.phasePing');
      case 'download':
        return t('tools:diagnosticsSuite.speed.phaseDownload');
      case 'upload':
        return t('tools:diagnosticsSuite.speed.phaseUpload');
      case 'complete':
        return t('tools:diagnosticsSuite.speed.phaseComplete');
      case 'aborted':
        return t('tools:diagnosticsSuite.speed.phaseAborted');
      case 'error':
        return t('tools:diagnosticsSuite.speed.phaseError');
      case 'idle':
      default:
        return t('tools:diagnosticsSuite.speed.phaseIdle');
    }
  }, [phase, t]);

  const gradeLabel = useCallback(
    (grade: NetworkGrade) => {
      switch (grade) {
        case 'excellent':
          return t('tools:diagnosticsSuite.speed.gradeExcellent');
        case 'good':
          return t('tools:diagnosticsSuite.speed.gradeGood');
        case 'fair':
          return t('tools:diagnosticsSuite.speed.gradeFair');
        case 'poor':
          return t('tools:diagnosticsSuite.speed.gradePoor');
      }
    },
    [t]
  );

  const gradeBadgeClass = (grade: NetworkGrade) => {
    switch (grade) {
      case 'excellent':
      case 'good':
        return 'badge-success';
      case 'fair':
        return 'badge-warning';
      case 'poor':
        return 'badge-danger';
    }
  };

  const getUseCaseLabel = useCallback(
    (id: NetworkUseCaseId) => {
      switch (id) {
        case 'video_call':
          return t('tools:diagnosticsSuite.speed.useCaseVideoCall');
        case 'streaming_4k':
          return t('tools:diagnosticsSuite.speed.useCaseStreaming4k');
        case 'gaming':
          return t('tools:diagnosticsSuite.speed.useCaseGaming');
        case 'cloud_sync':
          return t('tools:diagnosticsSuite.speed.useCaseCloudSync');
      }
    },
    [t]
  );

  // SVG Real-Time Chart geometry
  const svgW = 560;
  const svgH = 190;
  const maxTraceMbps = useMemo(() => {
    const peaks = [
      ...downloadTrace.map((p) => p.mbps),
      ...uploadTrace.map((p) => p.mbps),
      downloadMbps,
      uploadMbps,
    ];
    const highest = peaks.length > 0 ? Math.max(...peaks) : 50;
    return Math.max(20, Math.ceil(highest / 10) * 10);
  }, [downloadMbps, downloadTrace, uploadMbps, uploadTrace]);

  const dlMaxSteps = Math.max(8, downloadTrace.length);
  const ulMaxSteps = Math.max(8, uploadTrace.length);

  const dlPolyline = useMemo(
    () => buildPolylinePoints(downloadTrace, svgW, svgH, maxTraceMbps, dlMaxSteps),
    [dlMaxSteps, downloadTrace, maxTraceMbps]
  );
  const ulPolyline = useMemo(
    () => buildPolylinePoints(uploadTrace, svgW, svgH, maxTraceMbps, ulMaxSteps),
    [maxTraceMbps, ulMaxSteps, uploadTrace]
  );

  return (
    <BentoGrid>
      {/* Top Control & Progress Card */}
      <BentoCard span="12">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <span className="subtle-text">{t('tools:diagnosticsSuite.speed.modeLabel')}:</span>
            <button
              type="button"
              className={`btn btn-sm ${mode === 'quick' ? 'glass-pill-active' : ''}`}
              onClick={() => setMode('quick')}
              disabled={isRunning}
              aria-pressed={mode === 'quick'}
            >
              {t('tools:diagnosticsSuite.speed.modeQuick')}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mode === 'standard' ? 'glass-pill-active' : ''}`}
              onClick={() => setMode('standard')}
              disabled={isRunning}
              aria-pressed={mode === 'standard'}
            >
              {t('tools:diagnosticsSuite.speed.modeStandard')}
            </button>

            <span className="glass-pill glass-pill-active">
              <ShieldCheck size={13} />
              <span>{t('tools:diagnosticsSuite.speed.selfHostedBadge')}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isRunning ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void startTest()}
              >
                <Play size={16} />
                <span>{t('tools:diagnosticsSuite.speed.startTest')}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn badge-danger"
                onClick={abortActiveTest}
              >
                <Square size={15} fill="currentColor" />
                <span>{t('tools:diagnosticsSuite.speed.abortTest')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Phase & Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={14} style={{ color: isRunning ? 'var(--accent)' : 'var(--text-muted)' }} />
              <span>{phaseLabel}</span>
            </span>
            <span className="subtle-text font-mono">{progressPercent}%</span>
          </div>
          <div className="diag-progress-track">
            <div className="diag-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {phase === 'error' && errorMsg && (
          <div
            role="alert"
            className="glass-pill badge-danger"
            style={{
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 0.85rem',
              justifyContent: 'flex-start',
              fontSize: '0.84rem',
            }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>{t('tools:diagnosticsSuite.speed.errorMessage', { message: errorMsg })}</span>
          </div>
        )}
      </BentoCard>

      {/* 4 KPI Bento Cards (span="3") */}
      <BentoCard span="3" className="bento-card-compact">
        <span className="subtle-text">{t('tools:diagnosticsSuite.speed.kpiPing')}</span>
        <div className="font-mono" style={{ fontSize: '1.55rem', fontWeight: 700 }}>
          {pingStats.avgMs > 0 ? pingStats.avgMs.toFixed(1) : '—'}
        </div>
        <div className="subtle-text font-mono" style={{ fontSize: '0.74rem' }}>
          {t('tools:diagnosticsSuite.speed.statMin', {
            value: pingStats.minMs > 0 ? pingStats.minMs.toFixed(1) : '—',
          })}{' '}
          ·{' '}
          {t('tools:diagnosticsSuite.speed.statMax', {
            value: pingStats.maxMs > 0 ? pingStats.maxMs.toFixed(1) : '—',
          })}
        </div>
      </BentoCard>

      <BentoCard span="3" className="bento-card-compact">
        <span className="subtle-text">{t('tools:diagnosticsSuite.speed.kpiJitter')}</span>
        <div className="font-mono" style={{ fontSize: '1.55rem', fontWeight: 700 }}>
          {pingStats.avgMs > 0 ? pingStats.jitterMs.toFixed(1) : '—'}
        </div>
        <div className="subtle-text font-mono" style={{ fontSize: '0.74rem' }}>
          {t('tools:diagnosticsSuite.speed.statAvg', {
            value: pingStats.avgMs > 0 ? pingStats.avgMs.toFixed(1) : '—',
          })}
        </div>
      </BentoCard>

      <BentoCard span="3" className="bento-card-compact">
        <span className="subtle-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <ArrowDown size={13} style={{ color: 'var(--accent)' }} />
          <span>{t('tools:diagnosticsSuite.speed.kpiDownload')}</span>
        </span>
        <div className="font-mono" style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--accent)' }}>
          {downloadMbps > 0 ? downloadMbps.toFixed(2) : '—'}
        </div>
        <div className="subtle-text font-mono" style={{ fontSize: '0.74rem' }}>
          Mbps
        </div>
      </BentoCard>

      <BentoCard span="3" className="bento-card-compact">
        <span className="subtle-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <ArrowUp size={13} style={{ color: 'var(--text-secondary)' }} />
          <span>{t('tools:diagnosticsSuite.speed.kpiUpload')}</span>
        </span>
        <div className="font-mono" style={{ fontSize: '1.55rem', fontWeight: 700 }}>
          {uploadMbps > 0 ? uploadMbps.toFixed(2) : '—'}
        </div>
        <div className="subtle-text font-mono" style={{ fontSize: '0.74rem' }}>
          Mbps
        </div>
      </BentoCard>

      {/* Real-Time SVG Line Chart */}
      <BentoCard span="7">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:diagnosticsSuite.speed.chartTitle')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.76rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="diag-legend-line diag-legend-download" />
              <span>{t('tools:diagnosticsSuite.speed.kpiDownload')}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
              <span className="diag-legend-line diag-legend-upload" />
              <span>{t('tools:diagnosticsSuite.speed.kpiUpload')}</span>
            </span>
          </div>
        </div>

        <div className="diag-speed-chart-box">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="diag-speed-svg"
            role="img"
            aria-label={t('tools:diagnosticsSuite.speed.chartTitle')}
          >
            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 14 + (svgH - 28) * (1 - ratio);
              return (
                <g key={ratio}>
                  <line
                    x1={12}
                    y1={y}
                    x2={svgW - 12}
                    y2={y}
                    stroke="rgba(161, 161, 170, 0.18)"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={14}
                    y={y - 3}
                    fill="currentColor"
                    opacity={0.5}
                    fontSize={10}
                    fontFamily="monospace"
                  >
                    {Math.round(maxTraceMbps * ratio)}
                  </text>
                </g>
              );
            })}

            {/* Download solid emerald trace */}
            {dlPolyline && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={dlPolyline}
              />
            )}

            {/* Upload dashed zinc trace */}
            {ulPolyline && (
              <polyline
                fill="none"
                stroke="#a1a1aa"
                strokeWidth="2.25"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={ulPolyline}
              />
            )}
          </svg>
        </div>
      </BentoCard>

      {/* Suitability Matrix */}
      <BentoCard span="5">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:diagnosticsSuite.speed.suitabilityTitle')}</h2>
          {(hasCompletedOnce || downloadMbps > 0 || uploadMbps > 0) && (
            <span className={`glass-pill ${gradeBadgeClass(suitability.overallGrade)}`}>
              <Gauge size={12} />
              <span>{gradeLabel(suitability.overallGrade)}</span>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {suitability.useCases.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>
                {getUseCaseLabel(item.id)}
              </span>
              <span className={`glass-pill ${gradeBadgeClass(item.status)}`}>
                {gradeLabel(item.status)}
              </span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Local Session History */}
      <BentoCard span="12">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:diagnosticsSuite.speed.historyTitle')}</h2>
          {history.length > 0 && (
            <button type="button" className="btn btn-sm" onClick={handleClearHistory}>
              <Trash2 size={13} />
              <span>{t('tools:diagnosticsSuite.speed.clearHistory')}</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="subtle-text" style={{ fontSize: '0.86rem' }}>
            {t('tools:diagnosticsSuite.speed.emptyHistory')}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('tools:diagnosticsSuite.speed.modeLabel')}</th>
                  <th>{t('tools:diagnosticsSuite.speed.kpiPing')}</th>
                  <th>{t('tools:diagnosticsSuite.speed.kpiJitter')}</th>
                  <th>{t('tools:diagnosticsSuite.speed.kpiDownload')}</th>
                  <th>{t('tools:diagnosticsSuite.speed.kpiUpload')}</th>
                  <th>{t('tools:diagnosticsSuite.speed.suitabilityTitle')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id}>
                    <td className="font-mono">
                      {row.mode === 'standard'
                        ? t('tools:diagnosticsSuite.speed.modeStandard')
                        : t('tools:diagnosticsSuite.speed.modeQuick')}
                    </td>
                    <td className="font-mono">{row.pingAvgMs.toFixed(1)} ms</td>
                    <td className="font-mono">{row.jitterMs.toFixed(1)} ms</td>
                    <td className="font-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      {row.downloadMbps.toFixed(2)} Mbps
                    </td>
                    <td className="font-mono">{row.uploadMbps.toFixed(2)} Mbps</td>
                    <td>
                      <span className={`glass-pill ${gradeBadgeClass(row.overallGrade)}`}>
                        {gradeLabel(row.overallGrade)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  );
}
