'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Play,
  RefreshCw,
  ShieldCheck,
  Square,
  Volume2,
} from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import {
  clampSafeMasterVolume,
  computeSweepFrequencyAtProgress,
} from '@/lib/tools/engines/diagnostics';
import { useI18n } from '@/i18n/client';
import type { DiagnosticsPanelProps } from '@/components/tools/suites/diagnostics/KeyboardTesterPanel';

type ChannelMode = 'left' | 'stereo' | 'right';
type SignalType = 'tone' | 'sweep' | 'noise' | 'chime';
type NoiseVariant = 'white' | 'pink';

interface OutputDeviceOption {
  deviceId: string;
  label: string;
}

const TONE_PRESETS_HZ = [100, 440, 1000, 8000] as const;
const SWEEP_DURATION_MS = 8000;
const CHIME_FREQS_HZ = [523.25, 659.25, 783.99, 1046.5] as const;
const DEFAULT_VOLUME_PERCENT = 35;

type AudioContextWithSink = AudioContext & {
  setSinkId?: (sinkId: string) => Promise<void>;
};

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext ?? win.webkitAudioContext ?? null;
}

function parseChannelMode(raw: unknown): ChannelMode {
  if (raw === 'left' || raw === 'stereo' || raw === 'right') return raw;
  return 'stereo';
}

function parseSignalType(raw: unknown): SignalType {
  if (raw === 'tone' || raw === 'sweep' || raw === 'noise' || raw === 'chime') return raw;
  return 'tone';
}

function parseNoiseVariant(raw: unknown): NoiseVariant {
  return raw === 'pink' ? 'pink' : 'white';
}

function parseToneHz(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.min(12000, Math.max(60, Math.round(raw)));
  }
  return 440;
}

function parseVolumePercent(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.min(100, Math.max(0, Math.round(raw)));
  }
  return DEFAULT_VOLUME_PERCENT;
}

function createNoiseBuffer(ctx: AudioContext, variant: NoiseVariant): AudioBuffer {
  const durationSec = 2;
  const length = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (variant === 'white') {
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }
    return buffer;
  }

  // Paul Kellet's refined pink noise filter
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
    b6 = white * 0.115926;
    data[i] = Math.max(-0.9, Math.min(0.9, pink));
  }
  return buffer;
}

export function SpeakerTesterPanel({
  initialState,
  onStateChange,
  onRun,
}: DiagnosticsPanelProps) {
  const { t } = useI18n();

  const [channel, setChannel] = useState<ChannelMode>(() =>
    parseChannelMode(initialState?.channel)
  );
  const [signalType, setSignalType] = useState<SignalType>(() =>
    parseSignalType(initialState?.signalType)
  );
  const [volumePercent, setVolumePercent] = useState<number>(() =>
    parseVolumePercent(initialState?.volumePercent)
  );
  const [toneHz, setToneHz] = useState<number>(() => parseToneHz(initialState?.toneHz));
  const [noiseVariant, setNoiseVariant] = useState<NoiseVariant>(() =>
    parseNoiseVariant(initialState?.noiseVariant)
  );

  const [outputDevices, setOutputDevices] = useState<OutputDeviceOption[]>([]);
  const [selectedSinkId, setSelectedSinkId] = useState<string>('');
  const [sinkSupported, setSinkSupported] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [liveFreqHz, setLiveFreqHz] = useState<number>(toneHz);

  // Audio Graph Refs
  const audioCtxRef = useRef<AudioContextWithSink | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const leftGainRef = useRef<GainNode | null>(null);
  const rightGainRef = useRef<GainNode | null>(null);
  const signalBusRef = useRef<GainNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);

  const activeOscRef = useRef<OscillatorNode | null>(null);
  const activeNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const activeChimeNodesRef = useRef<Set<OscillatorNode>>(new Set());
  const sweepRafRef = useRef<number | null>(null);
  const sweepTimerRef = useRef<number | null>(null);
  const chimeTimerRef = useRef<number | null>(null);
  const sweepStartMsRef = useRef<number>(0);

  const isPlayingRef = useRef<boolean>(false);
  const runTriggeredRef = useRef<boolean>(false);

  const channelRef = useRef<ChannelMode>(channel);
  const signalTypeRef = useRef<SignalType>(signalType);
  const volumePercentRef = useRef<number>(volumePercent);
  const toneHzRef = useRef<number>(toneHz);
  const noiseVariantRef = useRef<NoiseVariant>(noiseVariant);
  const selectedSinkIdRef = useRef<string>(selectedSinkId);

  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  useEffect(() => {
    signalTypeRef.current = signalType;
  }, [signalType]);

  useEffect(() => {
    volumePercentRef.current = volumePercent;
  }, [volumePercent]);

  useEffect(() => {
    toneHzRef.current = toneHz;
  }, [toneHz]);

  useEffect(() => {
    noiseVariantRef.current = noiseVariant;
  }, [noiseVariant]);

  useEffect(() => {
    selectedSinkIdRef.current = selectedSinkId;
  }, [selectedSinkId]);

  useEffect(() => {
    onStateChange?.({
      channel,
      signalType,
      volumePercent,
      toneHz,
      noiseVariant,
    });
  }, [channel, signalType, volumePercent, toneHz, noiseVariant, onStateChange]);

  const refreshOutputDevices = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.enumerateDevices !== 'function'
    ) {
      return;
    }
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const outputs: OutputDeviceOption[] = all
        .filter((d) => d.kind === 'audiooutput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Audio Output ${index + 1}`,
        }));
      setOutputDevices(outputs);
      setSelectedSinkId((prev) => {
        if (prev && outputs.some((d) => d.deviceId === prev)) return prev;
        return '';
      });
    } catch {
      // Ignore enumeration errors
    }
  }, []);

  const clearSourceGenerators = useCallback(() => {
    if (sweepRafRef.current !== null) {
      cancelAnimationFrame(sweepRafRef.current);
      sweepRafRef.current = null;
    }
    if (sweepTimerRef.current !== null) {
      window.clearInterval(sweepTimerRef.current);
      sweepTimerRef.current = null;
    }
    if (chimeTimerRef.current !== null) {
      window.clearInterval(chimeTimerRef.current);
      chimeTimerRef.current = null;
    }

    if (activeOscRef.current) {
      try {
        activeOscRef.current.stop();
      } catch {
        // Ignore already stopped
      }
      try {
        activeOscRef.current.disconnect();
      } catch {
        // Ignore disconnect error
      }
      activeOscRef.current = null;
    }

    if (activeNoiseRef.current) {
      try {
        activeNoiseRef.current.stop();
      } catch {
        // Ignore already stopped
      }
      try {
        activeNoiseRef.current.disconnect();
      } catch {
        // Ignore disconnect error
      }
      activeNoiseRef.current = null;
    }

    for (const osc of activeChimeNodesRef.current) {
      try {
        osc.stop();
      } catch {
        // Ignore already stopped
      }
      try {
        osc.disconnect();
      } catch {
        // Ignore disconnect error
      }
    }
    activeChimeNodesRef.current.clear();
  }, []);

  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (ctx && masterGain && ctx.state !== 'closed') {
      try {
        masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.015);
      } catch {
        // Ignore target update error
      }
    }

    clearSourceGenerators();

    if (audioCtxRef.current) {
      const closingCtx = audioCtxRef.current;
      audioCtxRef.current = null;
      masterGainRef.current = null;
      leftGainRef.current = null;
      rightGainRef.current = null;
      signalBusRef.current = null;
      compressorRef.current = null;

      window.setTimeout(() => {
        void closingCtx.close().catch(() => {});
      }, 45);
    }
  }, [clearSourceGenerators]);

  // Check setSinkId capability, enumerate output devices, and enforce unmount teardown
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let active = true;

    const AudioCtx = getAudioContextConstructor();
    const audioCtxSupportsSink =
      !!AudioCtx && 'setSinkId' in AudioCtx.prototype;
    const htmlAudioSupportsSink =
      typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype;

    queueMicrotask(() => {
      if (!active) return;
      setSinkSupported(audioCtxSupportsSink || htmlAudioSupportsSink);
      void refreshOutputDevices();
    });

    const handleDeviceChange = () => {
      void refreshOutputDevices();
    };
    navigator.mediaDevices?.addEventListener?.('devicechange', handleDeviceChange);

    return () => {
      active = false;
      navigator.mediaDevices?.removeEventListener?.('devicechange', handleDeviceChange);
      isPlayingRef.current = false;
      clearSourceGenerators();
      if (audioCtxRef.current) {
        void audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [clearSourceGenerators, refreshOutputDevices]);

  const applyChannelGains = useCallback((mode: ChannelMode) => {
    const ctx = audioCtxRef.current;
    const leftGain = leftGainRef.current;
    const rightGain = rightGainRef.current;
    if (!ctx || !leftGain || !rightGain || ctx.state === 'closed') return;

    const now = ctx.currentTime;
    const leftTarget = mode === 'left' || mode === 'stereo' ? 1 : 0;
    const rightTarget = mode === 'right' || mode === 'stereo' ? 1 : 0;
    leftGain.gain.setTargetAtTime(leftTarget, now, 0.015);
    rightGain.gain.setTargetAtTime(rightTarget, now, 0.015);
  }, []);

  const applyMasterVolume = useCallback((percent: number) => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain || ctx.state === 'closed') return;

    const safeLevel = clampSafeMasterVolume(percent);
    masterGain.gain.setTargetAtTime(safeLevel, ctx.currentTime, 0.015);
  }, []);

  const applySinkSelection = useCallback(async (sinkId: string) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'closed' || typeof ctx.setSinkId !== 'function') return;
    try {
      await ctx.setSinkId(sinkId);
    } catch {
      // Ignore setSinkId rejection on unsupported/virtual sinks
    }
  }, []);

  const startSignalGenerator = useCallback(
    (ctx: AudioContext, bus: GainNode, type: SignalType) => {
      clearSourceGenerators();

      if (type === 'tone') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(toneHzRef.current, ctx.currentTime);
        osc.connect(bus);
        osc.start();
        activeOscRef.current = osc;
        setLiveFreqHz(toneHzRef.current);
        return;
      }

      if (type === 'sweep') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.connect(bus);

        const scheduleSweepCycle = () => {
          if (!isPlayingRef.current || ctx.state === 'closed') return;
          const now = ctx.currentTime;
          const durationSec = SWEEP_DURATION_MS / 1000;
          osc.frequency.cancelScheduledValues(now);
          osc.frequency.setValueAtTime(20, now);
          osc.frequency.exponentialRampToValueAtTime(20_000, now + durationSec);
          sweepStartMsRef.current = performance.now();
        };

        osc.start();
        activeOscRef.current = osc;
        scheduleSweepCycle();

        sweepTimerRef.current = window.setInterval(scheduleSweepCycle, SWEEP_DURATION_MS);

        const updateSweepReadout = () => {
          if (!isPlayingRef.current) return;
          const elapsed = (performance.now() - sweepStartMsRef.current) % SWEEP_DURATION_MS;
          const progress = elapsed / SWEEP_DURATION_MS;
          const hz = computeSweepFrequencyAtProgress(progress, 20, 20_000);
          setLiveFreqHz(Math.round(hz));
          sweepRafRef.current = requestAnimationFrame(updateSweepReadout);
        };
        sweepRafRef.current = requestAnimationFrame(updateSweepReadout);
        return;
      }

      if (type === 'noise') {
        const buffer = createNoiseBuffer(ctx, noiseVariantRef.current);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(bus);
        source.start();
        activeNoiseRef.current = source;
        return;
      }

      // 'chime': Gentle C5-E5-G5-C6 arpeggio
      const playChimeCycle = () => {
        if (!isPlayingRef.current || ctx.state === 'closed') return;
        const baseTime = ctx.currentTime + 0.02;

        CHIME_FREQS_HZ.forEach((freq, idx) => {
          const noteStart = baseTime + idx * 0.24;
          const noteEnd = noteStart + 0.72;
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteStart);

          noteGain.gain.setValueAtTime(0.0001, noteStart);
          noteGain.gain.linearRampToValueAtTime(0.32, noteStart + 0.03);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

          osc.connect(noteGain);
          noteGain.connect(bus);

          activeChimeNodesRef.current.add(osc);
          osc.onended = () => {
            activeChimeNodesRef.current.delete(osc);
            try {
              osc.disconnect();
              noteGain.disconnect();
            } catch {
              // Ignore disconnect errors
            }
          };

          osc.start(noteStart);
          osc.stop(noteEnd + 0.02);
        });
      };

      playChimeCycle();
      chimeTimerRef.current = window.setInterval(playChimeCycle, 2200);
    },
    [clearSourceGenerators]
  );

  const startPlayback = useCallback(async () => {
    const AudioCtx = getAudioContextConstructor();
    if (!AudioCtx) return;

    stopPlayback();

    try {
      const ctx = new AudioCtx() as AudioContextWithSink;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (selectedSinkIdRef.current && typeof ctx.setSinkId === 'function') {
        await ctx.setSinkId(selectedSinkIdRef.current).catch(() => {});
      }

      // Build safe stereo audio graph:
      // signalBus -> leftGain / rightGain -> ChannelMergerNode(2) -> masterGain -> DynamicsCompressorNode -> destination
      const signalBus = ctx.createGain();
      signalBus.gain.setValueAtTime(1, ctx.currentTime);

      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();
      const merger = ctx.createChannelMerger(2);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-3, ctx.currentTime);
      compressor.knee.setValueAtTime(6, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.1, ctx.currentTime);

      signalBus.connect(leftGain);
      signalBus.connect(rightGain);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(masterGain);
      masterGain.connect(compressor);
      compressor.connect(ctx.destination);

      audioCtxRef.current = ctx;
      signalBusRef.current = signalBus;
      leftGainRef.current = leftGain;
      rightGainRef.current = rightGain;
      masterGainRef.current = masterGain;
      compressorRef.current = compressor;

      isPlayingRef.current = true;
      setIsPlaying(true);

      applyChannelGains(channelRef.current);
      applyMasterVolume(volumePercentRef.current);
      startSignalGenerator(ctx, signalBus, signalTypeRef.current);

      if (!runTriggeredRef.current) {
        runTriggeredRef.current = true;
        onRun?.();
      }
    } catch {
      stopPlayback();
    }
  }, [
    applyChannelGains,
    applyMasterVolume,
    onRun,
    startSignalGenerator,
    stopPlayback,
  ]);

  // Live updates while playing (zero pop/click via setTargetAtTime)
  const handleChannelChange = useCallback(
    (nextChannel: ChannelMode) => {
      setChannel(nextChannel);
      applyChannelGains(nextChannel);
    },
    [applyChannelGains]
  );

  const handleVolumeChange = useCallback(
    (nextPercent: number) => {
      const clamped = Math.min(100, Math.max(0, Math.round(nextPercent)));
      setVolumePercent(clamped);
      applyMasterVolume(clamped);
    },
    [applyMasterVolume]
  );

  const handleToneHzChange = useCallback((nextHz: number) => {
    const clamped = Math.min(12000, Math.max(60, Math.round(nextHz)));
    setToneHz(clamped);
    setLiveFreqHz(clamped);
    const ctx = audioCtxRef.current;
    const osc = activeOscRef.current;
    if (ctx && osc && ctx.state !== 'closed' && signalTypeRef.current === 'tone') {
      osc.frequency.setTargetAtTime(clamped, ctx.currentTime, 0.015);
    }
  }, []);

  const handleSignalTypeChange = useCallback(
    (nextType: SignalType) => {
      setSignalType(nextType);
      if (isPlayingRef.current && audioCtxRef.current && signalBusRef.current) {
        startSignalGenerator(audioCtxRef.current, signalBusRef.current, nextType);
      }
    },
    [startSignalGenerator]
  );

  const handleNoiseVariantChange = useCallback(
    (nextVariant: NoiseVariant) => {
      setNoiseVariant(nextVariant);
      noiseVariantRef.current = nextVariant;
      if (
        isPlayingRef.current &&
        signalTypeRef.current === 'noise' &&
        audioCtxRef.current &&
        signalBusRef.current
      ) {
        startSignalGenerator(audioCtxRef.current, signalBusRef.current, 'noise');
      }
    },
    [startSignalGenerator]
  );

  const handleSinkChange = useCallback(
    (nextSinkId: string) => {
      setSelectedSinkId(nextSinkId);
      void applySinkSelection(nextSinkId);
    },
    [applySinkSelection]
  );

  const activeSignalLabel = useMemo(() => {
    switch (signalType) {
      case 'tone':
        return `${t('tools:diagnosticsSuite.speaker.signalTone')} (${toneHz} Hz)`;
      case 'sweep':
        return t('tools:diagnosticsSuite.speaker.signalSweep');
      case 'noise':
        return noiseVariant === 'pink'
          ? t('tools:diagnosticsSuite.speaker.noisePink')
          : t('tools:diagnosticsSuite.speaker.noiseWhite');
      case 'chime':
        return t('tools:diagnosticsSuite.speaker.signalChime');
    }
  }, [noiseVariant, signalType, t, toneHz]);

  const leftActive = channel === 'left' || channel === 'stereo';
  const rightActive = channel === 'right' || channel === 'stereo';

  return (
    <BentoGrid>
      {/* Top Bar: Output Device + Play / Stop + Status */}
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
          <div style={{ flex: '1 1 280px', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="speaker-sink-select" className="subtle-text">
              {t('tools:diagnosticsSuite.speaker.outputDeviceLabel')}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                id="speaker-sink-select"
                className="select-field"
                value={selectedSinkId}
                onChange={(e) => handleSinkChange(e.target.value)}
                disabled={!sinkSupported && outputDevices.length === 0}
              >
                <option value="">{t('tools:diagnosticsSuite.speaker.defaultOutputDevice')}</option>
                {outputDevices.map((dev) => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => void refreshOutputDevices()}
                title={t('tools:diagnosticsSuite.mic.refreshDevices')}
                aria-label={t('tools:diagnosticsSuite.mic.refreshDevices')}
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <span className={`glass-pill ${isPlaying ? 'glass-pill-active' : ''}`}>
              <Volume2 size={13} />
              <span>
                {isPlaying
                  ? t('tools:diagnosticsSuite.speaker.playingStatus', { signal: activeSignalLabel })
                  : t('tools:diagnosticsSuite.speaker.idleStatus')}
              </span>
            </span>

            {!isPlaying ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void startPlayback()}
              >
                <Play size={16} />
                <span>{t('tools:diagnosticsSuite.speaker.playButton')}</span>
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={stopPlayback}>
                <Square size={15} fill="currentColor" />
                <span>{t('tools:diagnosticsSuite.speaker.stopButton')}</span>
              </button>
            )}
          </div>
        </div>

        {!sinkSupported && (
          <div
            className="glass-pill badge-warning"
            style={{
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 0.85rem',
              justifyContent: 'flex-start',
              fontSize: '0.82rem',
            }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>{t('tools:diagnosticsSuite.speaker.outputUnsupportedHint')}</span>
          </div>
        )}
      </BentoCard>

      {/* Left Bento Card: Channel Routing (L / Stereo / R) + Master Safe Volume */}
      <BentoCard span="6">
        <h2 className="section-title">{t('tools:diagnosticsSuite.speaker.channelLabel')}</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(['left', 'stereo', 'right'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`btn btn-sm ${channel === mode ? 'glass-pill-active' : ''}`}
              onClick={() => handleChannelChange(mode)}
              aria-pressed={channel === mode}
            >
              {mode === 'left'
                ? t('tools:diagnosticsSuite.speaker.channelLeft')
                : mode === 'stereo'
                  ? t('tools:diagnosticsSuite.speaker.channelStereo')
                  : t('tools:diagnosticsSuite.speaker.channelRight')}
            </button>
          ))}
        </div>

        {/* Visual Left / Right Channel Indicators */}
        <div className="diag-speaker-channels">
          <div
            className={`diag-speaker-channel-box ${
              leftActive ? (isPlaying ? 'active playing' : 'active') : ''
            }`.trim()}
          >
            <span className="diag-speaker-badge font-mono">L</span>
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              {t('tools:diagnosticsSuite.speaker.channelLeft')}
            </span>
          </div>

          <div
            className={`diag-speaker-channel-box ${
              rightActive ? (isPlaying ? 'active playing' : 'active') : ''
            }`.trim()}
          >
            <span className="diag-speaker-badge font-mono">R</span>
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              {t('tools:diagnosticsSuite.speaker.channelRight')}
            </span>
          </div>
        </div>

        {/* Hearing-Safe Master Volume (NFR-14) */}
        <div
          className="glass-panel"
          style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <label htmlFor="speaker-volume-slider" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              {t('tools:diagnosticsSuite.speaker.masterVolumeLabel', { percent: volumePercent })}
            </label>
            <span className="glass-pill" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={12} style={{ color: 'var(--accent)' }} />
              <span>DynamicsLimiter</span>
            </span>
          </div>

          <input
            id="speaker-volume-slider"
            type="range"
            min={0}
            max={100}
            step={1}
            value={volumePercent}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />

          <div
            className={`subtle-text ${volumePercent > 75 ? 'badge-warning' : ''}`.trim()}
            style={
              volumePercent > 75
                ? {
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }
                : { fontSize: '0.78rem' }
            }
          >
            {volumePercent > 75 && <AlertTriangle size={13} style={{ flexShrink: 0 }} />}
            <span>
              {volumePercent > 75
                ? t('tools:diagnosticsSuite.speaker.highVolumeWarning', { percent: 75 })
                : t('tools:diagnosticsSuite.speaker.safeVolumeHint')}
            </span>
          </div>
        </div>
      </BentoCard>

      {/* Right Bento Card: Signal Generator Mode & Parameters */}
      <BentoCard span="6">
        <h2 className="section-title">{t('tools:diagnosticsSuite.speaker.signalTypeLabel')}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
          {(['tone', 'sweep', 'noise', 'chime'] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`btn ${signalType === type ? 'glass-pill-active' : ''}`}
              onClick={() => handleSignalTypeChange(type)}
              aria-pressed={signalType === type}
            >
              {type === 'tone'
                ? t('tools:diagnosticsSuite.speaker.signalTone')
                : type === 'sweep'
                  ? t('tools:diagnosticsSuite.speaker.signalSweep')
                  : type === 'noise'
                    ? t('tools:diagnosticsSuite.speaker.signalNoise')
                    : t('tools:diagnosticsSuite.speaker.signalChime')}
            </button>
          ))}
        </div>

        {/* Tone Controls */}
        {signalType === 'tone' && (
          <div
            className="glass-panel"
            style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label htmlFor="speaker-tone-slider" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                {t('tools:diagnosticsSuite.speaker.frequencyLabel', { hz: toneHz })}
              </label>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {TONE_PRESETS_HZ.map((hz) => (
                  <button
                    key={hz}
                    type="button"
                    className={`btn btn-sm font-mono ${toneHz === hz ? 'glass-pill-active' : ''}`}
                    onClick={() => handleToneHzChange(hz)}
                  >
                    {hz}Hz
                  </button>
                ))}
              </div>
            </div>

            <input
              id="speaker-tone-slider"
              type="range"
              min={60}
              max={12000}
              step={10}
              value={toneHz}
              onChange={(e) => handleToneHzChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
        )}

        {/* Sweep Readout */}
        {signalType === 'sweep' && (
          <div
            className="glass-panel"
            style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <span className="subtle-text">{t('tools:diagnosticsSuite.speaker.signalSweep')}</span>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent)' }}>
              {t('tools:diagnosticsSuite.speaker.currentFreqLabel', {
                hz: isPlaying ? liveFreqHz : 20,
              })}
            </div>
          </div>
        )}

        {/* Noise Variant */}
        {signalType === 'noise' && (
          <div
            className="glass-panel"
            style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
          >
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              {t('tools:diagnosticsSuite.speaker.noiseVariantLabel')}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['white', 'pink'] as const).map((variant) => (
                <button
                  key={variant}
                  type="button"
                  className={`btn btn-sm ${noiseVariant === variant ? 'glass-pill-active' : ''}`}
                  onClick={() => handleNoiseVariantChange(variant)}
                  aria-pressed={noiseVariant === variant}
                >
                  {variant === 'white'
                    ? t('tools:diagnosticsSuite.speaker.noiseWhite')
                    : t('tools:diagnosticsSuite.speaker.noisePink')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chime Info */}
        {signalType === 'chime' && (
          <div
            className="glass-panel"
            style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
          >
            <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              {t('tools:diagnosticsSuite.speaker.signalChime')}
            </span>
            <span className="subtle-text font-mono">
              C5 (523.25 Hz) → E5 (659.25 Hz) → G5 (783.99 Hz) → C6 (1046.50 Hz)
            </span>
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  );
}
