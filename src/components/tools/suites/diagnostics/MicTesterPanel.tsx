'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Download,
  Headphones,
  Mic,
  MicOff,
  RefreshCw,
  RotateCcw,
  Square,
  Trash2,
} from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import {
  calculateAudioLevels,
  classifyMicNoiseFloor,
  type MicNoiseState,
} from '@/lib/tools/engines/diagnostics';
import { useI18n } from '@/i18n/client';
import type { DiagnosticsPanelProps } from '@/components/tools/suites/diagnostics/KeyboardTesterPanel';

type VisualizerMode = 'waveform' | 'spectrum' | 'both';
type EnvSupportStatus = 'ok' | 'insecure' | 'unsupported';
type MicErrorKind = 'insecureContext' | 'unsupported' | 'permissionDenied' | 'noDevice' | 'genericError';

interface MicDeviceOption {
  deviceId: string;
  label: string;
}

interface MicErrorState {
  kind: MicErrorKind;
  message?: string;
}

const MAX_RECORDING_SECONDS = 15;
const UI_METRICS_INTERVAL_MS = 60;

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext ?? win.webkitAudioContext ?? null;
}

function parseInitialVisualizerMode(raw: unknown): VisualizerMode {
  if (raw === 'waveform' || raw === 'spectrum' || raw === 'both') {
    return raw;
  }
  return 'both';
}

function dbfsToMeterPercent(dbfs: number): number {
  if (!Number.isFinite(dbfs) || dbfs <= -60) return 0;
  if (dbfs >= 0) return 100;
  return Math.round(((dbfs + 60) / 60) * 100);
}

function formatDbfs(value: number): string {
  if (!Number.isFinite(value) || value <= -99.5) return '-∞ dBFS';
  return `${value.toFixed(1)} dBFS`;
}

function pickSupportedRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  return candidates.find((mime) => MediaRecorder.isTypeSupported(mime));
}

export function MicTesterPanel({
  initialState,
  onStateChange,
  onRun,
}: DiagnosticsPanelProps) {
  const { t } = useI18n();

  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(() =>
    parseInitialVisualizerMode(initialState?.visualizerMode)
  );
  const [envStatus, setEnvStatus] = useState<EnvSupportStatus>('ok');
  const [devices, setDevices] = useState<MicDeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<MicErrorState | null>(null);

  const [currentDbfs, setCurrentDbfs] = useState<number>(-100);
  const [peakDbfs, setPeakDbfs] = useState<number>(-100);
  const [noiseState, setNoiseState] = useState<MicNoiseState>('silent');
  const [meterPercent, setMeterPercent] = useState<number>(0);
  const [isClipping, setIsClipping] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingExt, setRecordingExt] = useState<string>('webm');
  const [canRecord, setCanRecord] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeDataRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingStartMsRef = useRef<number>(0);
  const recordingUrlRef = useRef<string | null>(null);

  const peakDbfsRef = useRef<number>(-100);
  const lastUiSyncRef = useRef<number>(0);
  const visualizerModeRef = useRef<VisualizerMode>(visualizerMode);
  const runTriggeredRef = useRef<boolean>(false);
  const drawFrameRef = useRef<() => void>(() => {});

  useEffect(() => {
    visualizerModeRef.current = visualizerMode;
  }, [visualizerMode]);

  useEffect(() => {
    onStateChange?.({ visualizerMode });
  }, [visualizerMode, onStateChange]);

  const refreshDevices = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.enumerateDevices !== 'function'
    ) {
      return;
    }
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const inputs: MicDeviceOption[] = all
        .filter((d) => d.kind === 'audioinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${index + 1}`,
        }));
      setDevices(inputs);
      setSelectedDeviceId((prev) => {
        if (prev && inputs.some((d) => d.deviceId === prev)) {
          return prev;
        }
        return '';
      });
    } catch {
      // Ignore enumeration errors prior to permission grant
    }
  }, []);

  const drawIdleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = Math.max(240, canvas.clientWidth || 640);
    const height = Math.max(180, canvas.clientHeight || 240);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(161, 161, 170, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }, []);

  const clearRecordingTimer = useCallback(() => {
    if (recordingTimerRef.current !== null) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const revokeCurrentRecordingUrl = useCallback(() => {
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current);
      recordingUrlRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    clearRecordingTimer();
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        // Ignore if already stopped
      }
    }
    setIsRecording(false);
  }, [clearRecordingTimer]);

  const stopMic = useCallback(() => {
    stopRecording();

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      analyserRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        try {
          track.stop();
        } catch {
          // Ignore track stop errors
        }
      }
      streamRef.current = null;
    }

    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    timeDataRef.current = null;
    freqDataRef.current = null;

    setIsMicActive(false);
    setCurrentDbfs(-100);
    setMeterPercent(0);
    setNoiseState('silent');
    setIsClipping(false);
    drawIdleCanvas();
  }, [drawIdleCanvas, stopRecording]);

  // Environment check, initial device enumeration, devicechange subscription, and unmount cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let active = true;

    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';

    if (!window.isSecureContext) {
      queueMicrotask(() => {
        if (!active) return;
        setCanRecord(hasMediaRecorder);
        setEnvStatus('insecure');
        setErrorState({ kind: 'insecureContext' });
      });
      drawIdleCanvas();
      return () => {
        active = false;
      };
    }

    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      queueMicrotask(() => {
        if (!active) return;
        setCanRecord(hasMediaRecorder);
        setEnvStatus('unsupported');
        setErrorState({ kind: 'unsupported' });
      });
      drawIdleCanvas();
      return () => {
        active = false;
      };
    }

    queueMicrotask(() => {
      if (!active) return;
      setCanRecord(hasMediaRecorder);
      setEnvStatus('ok');
      void refreshDevices();
    });
    drawIdleCanvas();

    const handleDeviceChange = () => {
      void refreshDevices();
    };

    navigator.mediaDevices.addEventListener?.('devicechange', handleDeviceChange);

    return () => {
      active = false;
      navigator.mediaDevices.removeEventListener?.('devicechange', handleDeviceChange);
      stopMic();
      revokeCurrentRecordingUrl();
    };
  }, [drawIdleCanvas, refreshDevices, revokeCurrentRecordingUrl, stopMic]);

  const drawFrame = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const timeData = timeDataRef.current;
    const freqData = freqDataRef.current;

    if (!analyser || !timeData || !freqData) return;

    analyser.getFloatTimeDomainData(timeData);
    const metrics = calculateAudioLevels(timeData);
    const nextNoiseState = classifyMicNoiseFloor(metrics.dbfs, metrics.isClipping);

    if (metrics.peakDbfs > peakDbfsRef.current) {
      peakDbfsRef.current = metrics.peakDbfs;
    }

    const now = performance.now();
    if (now - lastUiSyncRef.current >= UI_METRICS_INTERVAL_MS) {
      lastUiSyncRef.current = now;
      setCurrentDbfs(metrics.dbfs);
      setPeakDbfs(peakDbfsRef.current);
      setNoiseState(nextNoiseState);
      setMeterPercent(dbfsToMeterPercent(metrics.dbfs));
      setIsClipping(metrics.isClipping);
    }

    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(240, canvas.clientWidth || 640);
      const height = Math.max(180, canvas.clientHeight || 240);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const mode = visualizerModeRef.current;

        // Subtle reference grid lines
        ctx.strokeStyle = 'rgba(161, 161, 170, 0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.25);
        ctx.lineTo(width, height * 0.25);
        ctx.moveTo(0, height * 0.5);
        ctx.lineTo(width, height * 0.5);
        ctx.moveTo(0, height * 0.75);
        ctx.lineTo(width, height * 0.75);
        ctx.stroke();

        // Draw Spectrum
        if (mode === 'spectrum' || mode === 'both') {
          analyser.getByteFrequencyData(freqData);
          const barCount = 64;
          const usableBins = Math.floor(freqData.length * 0.65);
          const step = Math.max(1, Math.floor(usableBins / barCount));
          const gap = 2;
          const barWidth = Math.max(2, (width - gap * (barCount - 1)) / barCount);
          const spectrumAlpha = mode === 'both' ? 0.34 : 0.85;

          for (let i = 0; i < barCount; i++) {
            let sum = 0;
            const startBin = i * step;
            for (let j = 0; j < step && startBin + j < freqData.length; j++) {
              sum += freqData[startBin + j];
            }
            const avg = sum / step / 255;
            const barH = Math.max(2, avg * (height - 14));
            const x = i * (barWidth + gap);
            const y = height - barH;

            ctx.fillStyle = `rgba(16, 185, 129, ${spectrumAlpha})`;
            ctx.fillRect(x, y, barWidth, barH);

            if (avg > 0.78) {
              ctx.fillStyle = '#f87171';
              ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2);
            }
          }
        }

        // Draw Waveform + Peak Danger Line
        if (mode === 'waveform' || mode === 'both') {
          const midY = height / 2;
          const ampScale = height * 0.44;

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const sliceWidth = width / timeData.length;
          for (let i = 0; i < timeData.length; i++) {
            const sample = Number.isFinite(timeData[i]) ? timeData[i] : 0;
            const x = i * sliceWidth;
            const y = midY - sample * ampScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Peak threshold / live peak indicator line in danger color (#f87171)
          const peakOffset = Math.min(1, metrics.peak) * ampScale;
          ctx.save();
          ctx.strokeStyle = metrics.isClipping ? '#f87171' : 'rgba(248, 113, 113, 0.42)';
          ctx.lineWidth = metrics.isClipping ? 1.75 : 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, midY - peakOffset);
          ctx.lineTo(width, midY - peakOffset);
          ctx.moveTo(0, midY + peakOffset);
          ctx.lineTo(width, midY + peakOffset);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    rafRef.current = requestAnimationFrame(() => drawFrameRef.current());
  }, []);

  useEffect(() => {
    drawFrameRef.current = drawFrame;
  }, [drawFrame]);

  const startMic = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!window.isSecureContext) {
      setEnvStatus('insecure');
      setErrorState({ kind: 'insecureContext' });
      return;
    }
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setEnvStatus('unsupported');
      setErrorState({ kind: 'unsupported' });
      return;
    }

    const AudioCtx = getAudioContextConstructor();
    if (!AudioCtx) {
      setEnvStatus('unsupported');
      setErrorState({ kind: 'unsupported' });
      return;
    }

    stopMic();
    setErrorState(null);
    setIsStarting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      });

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(analyser);

      streamRef.current = stream;
      audioCtxRef.current = ctx;
      sourceRef.current = source;
      analyserRef.current = analyser;
      timeDataRef.current = new Float32Array(new ArrayBuffer(analyser.fftSize * 4));
      freqDataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      peakDbfsRef.current = -100;
      setPeakDbfs(-100);
      setIsMicActive(true);

      if (!runTriggeredRef.current) {
        runTriggeredRef.current = true;
        onRun?.();
      }

      void refreshDevices();
      rafRef.current = requestAnimationFrame(drawFrame);
    } catch (err) {
      stopMic();
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
        setErrorState({ kind: 'permissionDenied' });
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'OverconstrainedError') {
        setErrorState({ kind: 'noDevice' });
      } else if (name === 'NotSupportedError') {
        setErrorState({ kind: 'unsupported' });
      } else {
        setErrorState({
          kind: 'genericError',
          message: err instanceof Error ? err.message : String(err),
        });
      }
    } finally {
      setIsStarting(false);
    }
  }, [drawFrame, onRun, refreshDevices, selectedDeviceId, stopMic]);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream || !isMicActive || typeof MediaRecorder === 'undefined') return;

    revokeCurrentRecordingUrl();
    setRecordingUrl(null);
    recordedChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const mimeType = pickSupportedRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const effectiveMime = recorder.mimeType || mimeType || 'audio/webm';
      setRecordingExt(effectiveMime.includes('mp4') ? 'm4a' : effectiveMime.includes('ogg') ? 'ogg' : 'webm');

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearRecordingTimer();
        setIsRecording(false);
        const chunks = recordedChunksRef.current;
        recordedChunksRef.current = [];
        if (chunks.length === 0) return;

        const blob = new Blob(chunks, { type: effectiveMime });
        const url = URL.createObjectURL(blob);
        recordingUrlRef.current = url;
        setRecordingUrl(url);
      };

      mediaRecorderRef.current = recorder;
      recordingStartMsRef.current = Date.now();
      recorder.start(250);
      setIsRecording(true);

      recordingTimerRef.current = window.setInterval(() => {
        const elapsedSec = Math.min(
          MAX_RECORDING_SECONDS,
          Math.floor((Date.now() - recordingStartMsRef.current) / 1000)
        );
        setRecordingSeconds(elapsedSec);
        if (elapsedSec >= MAX_RECORDING_SECONDS) {
          stopRecording();
        }
      }, 250);
    } catch (err) {
      setIsRecording(false);
      setErrorState({
        kind: 'genericError',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }, [clearRecordingTimer, isMicActive, revokeCurrentRecordingUrl, stopRecording]);

  const handleClearRecording = useCallback(() => {
    revokeCurrentRecordingUrl();
    setRecordingUrl(null);
    setRecordingSeconds(0);
  }, [revokeCurrentRecordingUrl]);

  const handleResetPeak = useCallback(() => {
    peakDbfsRef.current = -100;
    setPeakDbfs(-100);
  }, []);

  const errorBannerText = useMemo(() => {
    if (!errorState) return null;
    switch (errorState.kind) {
      case 'insecureContext':
        return t('tools:diagnosticsSuite.mic.errorInsecureContext');
      case 'unsupported':
        return t('tools:diagnosticsSuite.mic.errorUnsupported');
      case 'permissionDenied':
        return t('tools:diagnosticsSuite.mic.errorPermissionDenied');
      case 'noDevice':
        return t('tools:diagnosticsSuite.mic.errorNoDevice');
      case 'genericError':
        return t('tools:diagnosticsSuite.mic.errorGeneric', {
          message: errorState.message || 'Unknown error',
        });
    }
  }, [errorState, t]);

  const noiseLabel = useMemo(() => {
    switch (noiseState) {
      case 'clipping':
        return t('tools:diagnosticsSuite.mic.noiseClipping');
      case 'loud':
        return t('tools:diagnosticsSuite.mic.noiseLoud');
      case 'normal':
        return t('tools:diagnosticsSuite.mic.noiseNormal');
      case 'quiet':
        return t('tools:diagnosticsSuite.mic.noiseQuiet');
      case 'silent':
      default:
        return t('tools:diagnosticsSuite.mic.noiseSilent');
    }
  }, [noiseState, t]);

  const noiseBadgeClass =
    noiseState === 'clipping'
      ? 'badge-danger'
      : noiseState === 'loud'
        ? 'badge-warning'
        : noiseState === 'normal'
          ? 'badge-success'
          : '';

  return (
    <BentoGrid>
      {/* Top Controls & Error Banner */}
      <BentoCard span="12">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
          }}
        >
          <div style={{ flex: '1 1 260px', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="mic-device-select" className="subtle-text">
              {t('tools:diagnosticsSuite.mic.deviceLabel')}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                id="mic-device-select"
                className="select-field"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                disabled={isMicActive || envStatus !== 'ok'}
              >
                <option value="">{t('tools:diagnosticsSuite.mic.defaultDevice')}</option>
                {devices.map((dev) => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => void refreshDevices()}
                title={t('tools:diagnosticsSuite.mic.refreshDevices')}
                aria-label={t('tools:diagnosticsSuite.mic.refreshDevices')}
                disabled={envStatus !== 'ok'}
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Visualizer Mode Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span className="subtle-text">{t('tools:diagnosticsSuite.mic.visualizerModeLabel')}</span>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(['waveform', 'spectrum', 'both'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`btn btn-sm ${visualizerMode === mode ? 'glass-pill-active' : ''}`}
                  onClick={() => setVisualizerMode(mode)}
                  aria-pressed={visualizerMode === mode}
                >
                  {mode === 'waveform'
                    ? t('tools:diagnosticsSuite.mic.modeWaveform')
                    : mode === 'spectrum'
                      ? t('tools:diagnosticsSuite.mic.modeSpectrum')
                      : t('tools:diagnosticsSuite.mic.modeBoth')}
                </button>
              ))}
            </div>
          </div>

          {/* Start / Stop + Record */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            {!isMicActive ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void startMic()}
                disabled={isStarting || envStatus !== 'ok'}
              >
                <Mic size={16} />
                <span>{t('tools:diagnosticsSuite.mic.startMic')}</span>
              </button>
            ) : (
              <button type="button" className="btn" onClick={stopMic}>
                <MicOff size={16} />
                <span>{t('tools:diagnosticsSuite.mic.stopMic')}</span>
              </button>
            )}

            {canRecord && (
              !isRecording ? (
                <button
                  type="button"
                  className="btn"
                  onClick={startRecording}
                  disabled={!isMicActive}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      background: isMicActive ? 'var(--danger)' : 'var(--text-muted)',
                    }}
                  />
                  <span>{t('tools:diagnosticsSuite.mic.startRecord')}</span>
                </button>
              ) : (
                <button type="button" className="btn badge-danger" onClick={stopRecording}>
                  <Square size={14} fill="currentColor" />
                  <span>{t('tools:diagnosticsSuite.mic.stopRecord')}</span>
                  <span className="font-mono" style={{ marginLeft: '0.2rem' }}>
                    {t('tools:diagnosticsSuite.mic.recordingTimer', { seconds: recordingSeconds })}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Secure Context / Permission Error Banner */}
        {errorBannerText && (
          <div
            role="alert"
            className={`glass-pill ${
              errorState?.kind === 'insecureContext' || errorState?.kind === 'unsupported'
                ? 'badge-warning'
                : 'badge-danger'
            }`}
            style={{
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.9rem',
              justifyContent: 'flex-start',
              fontSize: '0.84rem',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{errorBannerText}</span>
          </div>
        )}

        {/* Acoustic Feedback Tip */}
        <div
          className="glass-panel"
          style={{
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
          }}
        >
          <Headphones size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span>{t('tools:diagnosticsSuite.mic.headphoneTip')}</span>
        </div>
      </BentoCard>

      {/* Main Live Canvas + VU Meter */}
      <BentoCard span="8">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <h2 className="section-title">{t('catalog:tools.mic-tester.name')}</h2>
          <span className={`glass-pill ${noiseBadgeClass}`}>
            {t('tools:diagnosticsSuite.mic.noiseStateLabel')}: {noiseLabel}
          </span>
        </div>

        <div className="diag-canvas-frame">
          <canvas ref={canvasRef} className="diag-canvas" />
        </div>

        {/* Horizontal VU Meter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="subtle-text font-mono">-60 dBFS</span>
            <span className="subtle-text font-mono">-24 dBFS</span>
            <span className="subtle-text font-mono">0 dBFS</span>
          </div>
          <div className="diag-vu-track" role="meter" aria-valuenow={meterPercent} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`diag-vu-fill ${isClipping ? 'diag-vu-clipping' : ''}`.trim()}
              style={{ width: `${meterPercent}%` }}
            />
          </div>
        </div>
      </BentoCard>

      {/* Right Column: Live Telemetry & Local Recording Playback */}
      <BentoCard span="4">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:diagnosticsSuite.mic.noiseStateLabel')}</h2>
          <button type="button" className="btn btn-sm" onClick={handleResetPeak}>
            <RotateCcw size={13} />
            <span>{t('common:actions.clear')}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.6rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 0.85rem' }}>
            <div className="subtle-text">{t('tools:diagnosticsSuite.mic.currentDbfs')}</div>
            <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem' }}>
              {formatDbfs(currentDbfs)}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0.75rem 0.85rem' }}>
            <div className="subtle-text">{t('tools:diagnosticsSuite.mic.peakDbfs')}</div>
            <div
              className="font-mono"
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                marginTop: '0.2rem',
                color: peakDbfs >= -0.2 ? 'var(--danger)' : 'var(--accent)',
              }}
            >
              {formatDbfs(peakDbfs)}
            </div>
          </div>
        </div>

        {/* Recording Playback Card */}
        <div
          className="glass-panel"
          style={{
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            marginTop: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              {t('tools:diagnosticsSuite.mic.playbackTitle')}
            </span>
            {isRecording && (
              <span className="glass-pill badge-danger font-mono">
                {t('tools:diagnosticsSuite.mic.recordingTimer', { seconds: recordingSeconds })}
              </span>
            )}
          </div>

          {recordingUrl ? (
            <>
              <audio controls src={recordingUrl} style={{ width: '100%', height: '38px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a
                  href={recordingUrl}
                  download={`omnidev-mic-test.${recordingExt}`}
                  className="btn btn-sm btn-primary"
                >
                  <Download size={14} />
                  <span>{t('tools:diagnosticsSuite.mic.downloadRecording')}</span>
                </a>
                <button type="button" className="btn btn-sm" onClick={handleClearRecording}>
                  <Trash2 size={14} />
                  <span>{t('tools:diagnosticsSuite.mic.clearRecording')}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="subtle-text" style={{ fontSize: '0.8rem' }}>
              {t('tools:diagnosticsSuite.mic.startRecord')}
            </div>
          )}
        </div>
      </BentoCard>
    </BentoGrid>
  );
}
