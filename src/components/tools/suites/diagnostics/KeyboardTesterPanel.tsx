'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Keyboard as KeyboardIcon,
  Lock,
  RotateCcw,
  ShieldAlert,
  Unlock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BentoGrid } from '@/components/bento/BentoGrid';
import { BentoCard } from '@/components/bento/BentoCard';
import {
  computeKeyboardStats,
  detectKeyChatter,
  getKeyboardLayout,
  shouldPreventDefaultBrowserKey,
  type KeyDefinition,
  type KeyboardLayoutId,
  type KeyboardOsMode,
} from '@/lib/tools/engines/diagnostics';
import { useI18n } from '@/i18n/client';

export interface DiagnosticsPanelProps {
  initialState?: Record<string, unknown> | null;
  onStateChange?: (state: Record<string, unknown>) => void;
  onRun?: () => void;
}

interface InspectedKeyEvent {
  id: number;
  code: string;
  key: string;
  location: number;
  keyCode: number;
  modifiers: string[];
  deltaMs: number | null;
  isChatter: boolean;
  isStuck: boolean;
  timestamp: number;
}

interface KeyAlertEntry {
  id: number;
  kind: 'stuck' | 'chatter';
  code: string;
  deltaMs?: number;
  timestamp: number;
}

const STUCK_THRESHOLD_MS = 3000;
const ESC_DOUBLE_PRESS_MS = 600;
const MAX_RECENT_EVENTS = 12;

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext ?? win.webkitAudioContext ?? null;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

function hasOpenModalDialog(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));
}

function buildModifierList(e: KeyboardEvent): string[] {
  const mods: string[] = [];
  if (e.ctrlKey) mods.push('Ctrl');
  if (e.shiftKey) mods.push('Shift');
  if (e.altKey) mods.push('Alt');
  if (e.metaKey) mods.push('Meta');
  return mods;
}

function normalizeEventKeyDisplay(key: string): string {
  if (key === ' ') return 'Space';
  if (!key) return '(empty)';
  return key;
}

function parseInitialTestedCodes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === 'string' && item.length > 0 && item.length <= 48) {
      out.push(item);
    }
  }
  return Array.from(new Set(out));
}

export function KeyboardTesterPanel({
  initialState,
  onStateChange,
  onRun,
}: DiagnosticsPanelProps) {
  const { t } = useI18n();

  const [layout, setLayout] = useState<KeyboardLayoutId>(() =>
    initialState?.layout === 'tkl-80' ? 'tkl-80' : 'full-104'
  );
  const [osMode, setOsMode] = useState<KeyboardOsMode>(() =>
    initialState?.osMode === 'mac' ? 'mac' : 'win'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    initialState?.soundEnabled === true
  );
  const [captureMode, setCaptureMode] = useState<boolean>(false);

  const [activeCodes, setActiveCodes] = useState<string[]>([]);
  const [testedCodes, setTestedCodes] = useState<string[]>(() =>
    parseInitialTestedCodes(initialState?.testedCodes)
  );
  const [stuckCodes, setStuckCodes] = useState<string[]>([]);
  const [chatterCodes, setChatterCodes] = useState<string[]>([]);
  const [totalPresses, setTotalPresses] = useState<number>(0);
  const [maxSimultaneous, setMaxSimultaneous] = useState<number>(0);
  const [lastEvent, setLastEvent] = useState<InspectedKeyEvent | null>(null);
  const [recentEvents, setRecentEvents] = useState<InspectedKeyEvent[]>([]);
  const [alerts, setAlerts] = useState<KeyAlertEntry[]>([]);

  // Refs for low-latency event handling and teardown safety
  const activePressTimesRef = useRef<Map<string, number>>(new Map());
  const lastKeyDownTimesRef = useRef<Map<string, number>>(new Map());
  const lastEventTimeRef = useRef<number | null>(null);
  const lastEscPressRef = useRef<number | null>(null);
  const lastContextMenuKeyAtRef = useRef<number>(0);
  const eventSeqRef = useRef<number>(0);
  const alertSeqRef = useRef<number>(0);
  const runTriggeredRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    onStateChange?.({
      layout,
      osMode,
      soundEnabled,
      testedCodes,
    });
  }, [layout, osMode, soundEnabled, testedCodes, onStateChange]);

  // Dispose Web Audio context cleanly on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        void audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  const playClickSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    const AudioCtx = getAudioContextConstructor();
    if (!AudioCtx) return;

    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.024);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.028);
    } catch {
      // Ignore Web Audio failures when blocked by autoplay policy
    }
  }, []);

  const clearActivePresses = useCallback(() => {
    activePressTimesRef.current.clear();
    setActiveCodes([]);
  }, []);

  // Stuck key watchdog: only runs while at least one key is held down
  useEffect(() => {
    if (activeCodes.length === 0) return;

    const timer = window.setInterval(() => {
      const now = performance.now();
      const newlyStuck: string[] = [];
      for (const [code, pressedAt] of activePressTimesRef.current.entries()) {
        if (now - pressedAt > STUCK_THRESHOLD_MS) {
          newlyStuck.push(code);
        }
      }
      if (newlyStuck.length === 0) return;

      setStuckCodes((prev) => {
        const nextSet = new Set(prev);
        let addedAny = false;
        const addedAlerts: KeyAlertEntry[] = [];
        for (const code of newlyStuck) {
          if (!nextSet.has(code)) {
            nextSet.add(code);
            addedAny = true;
            alertSeqRef.current += 1;
            addedAlerts.push({
              id: alertSeqRef.current,
              kind: 'stuck',
              code,
              timestamp: Date.now(),
            });
          }
        }
        if (addedAlerts.length > 0) {
          setAlerts((prevAlerts) => [...addedAlerts, ...prevAlerts].slice(0, MAX_RECENT_EVENTS));
          setRecentEvents((prevEvents) =>
            prevEvents.map((ev) =>
              newlyStuck.includes(ev.code) ? { ...ev, isStuck: true } : ev
            )
          );
        }
        return addedAny ? Array.from(nextSet) : prev;
      });
    }, 350);

    return () => window.clearInterval(timer);
  }, [activeCodes.length]);

  const toggleCaptureMode = useCallback((nextValue: boolean) => {
    if (nextValue && typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    lastEscPressRef.current = null;
    setCaptureMode(nextValue);
  }, []);

  // Global keyboard listeners + blur/visibilitychange teardown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Never hijack input while CommandPalette / FeedbackModal is open
      if (hasOpenModalDialog()) {
        return;
      }

      if (!captureMode && isEditableElement(e.target)) {
        return;
      }

      const shouldPrevent = shouldPreventDefaultBrowserKey({
        code: e.code,
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        captureMode,
      });

      if (shouldPrevent) {
        e.preventDefault();
      }

      if (e.code === 'ContextMenu' || (e.code === 'F10' && e.shiftKey)) {
        lastContextMenuKeyAtRef.current = performance.now();
      }

      if (captureMode) {
        e.stopPropagation();

        // NFR-13 safe escape hatch: Esc twice within 600ms unlocks capture mode
        if (e.code === 'Escape' && !e.repeat) {
          const nowPerf = performance.now();
          if (
            lastEscPressRef.current !== null &&
            nowPerf - lastEscPressRef.current <= ESC_DOUBLE_PRESS_MS
          ) {
            lastEscPressRef.current = null;
            setCaptureMode(false);
          } else {
            lastEscPressRef.current = nowPerf;
          }
        } else if (!e.repeat) {
          lastEscPressRef.current = null;
        }
      }

      const code = e.code || normalizeEventKeyDisplay(e.key);
      const nowPerf = performance.now();

      // Always keep active map synchronized even on OS key repeat
      if (!activePressTimesRef.current.has(code)) {
        activePressTimesRef.current.set(code, nowPerf);
      }
      const nextActive = Array.from(activePressTimesRef.current.keys());
      setActiveCodes(nextActive);
      setMaxSimultaneous((prev) => (nextActive.length > prev ? nextActive.length : prev));

      if (e.repeat) {
        return;
      }

      if (!runTriggeredRef.current) {
        runTriggeredRef.current = true;
        onRun?.();
      }

      playClickSound();

      // Chatter detection compares current press against previous press of the same key code
      const previousSameKeyPress = lastKeyDownTimesRef.current.get(code) ?? null;
      const isChatter = detectKeyChatter(previousSameKeyPress, nowPerf);
      lastKeyDownTimesRef.current.set(code, nowPerf);

      const deltaMs =
        lastEventTimeRef.current !== null
          ? Math.max(0, Math.round((nowPerf - lastEventTimeRef.current) * 10) / 10)
          : null;
      lastEventTimeRef.current = nowPerf;

      setTotalPresses((prev) => prev + 1);
      setTestedCodes((prev) => (prev.includes(code) ? prev : [...prev, code]));

      if (isChatter) {
        setChatterCodes((prev) => (prev.includes(code) ? prev : [...prev, code]));
        alertSeqRef.current += 1;
        const deltaRounded =
          previousSameKeyPress !== null ? Math.round(nowPerf - previousSameKeyPress) : 0;
        const chatterAlert: KeyAlertEntry = {
          id: alertSeqRef.current,
          kind: 'chatter',
          code,
          deltaMs: deltaRounded,
          timestamp: Date.now(),
        };
        setAlerts((prev) => [chatterAlert, ...prev].slice(0, MAX_RECENT_EVENTS));
      }

      eventSeqRef.current += 1;
      const entry: InspectedKeyEvent = {
        id: eventSeqRef.current,
        code,
        key: normalizeEventKeyDisplay(e.key),
        location: e.location,
        keyCode: e.keyCode || e.which || 0,
        modifiers: buildModifierList(e),
        deltaMs,
        isChatter,
        isStuck: false,
        timestamp: Date.now(),
      };

      setLastEvent(entry);
      setRecentEvents((prev) => [entry, ...prev].slice(0, MAX_RECENT_EVENTS));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (hasOpenModalDialog()) {
        return;
      }

      if (!captureMode && isEditableElement(e.target)) {
        return;
      }

      const shouldPrevent = shouldPreventDefaultBrowserKey({
        code: e.code,
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        captureMode,
      });

      if (shouldPrevent) {
        e.preventDefault();
      }

      if (captureMode) {
        e.stopPropagation();
      }

      const code = e.code || normalizeEventKeyDisplay(e.key);
      if (activePressTimesRef.current.has(code)) {
        activePressTimesRef.current.delete(code);
        setActiveCodes(Array.from(activePressTimesRef.current.keys()));
      }

      // macOS swallows keyup events for other keys while Meta (Cmd) is held;
      // releasing Meta clears all remaining held non-modifier keys cleanly.
      if (code === 'MetaLeft' || code === 'MetaRight') {
        clearActivePresses();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (hasOpenModalDialog()) return;
      const isKeyboardContextMenu = performance.now() - lastContextMenuKeyAtRef.current < 350;
      if (captureMode || isKeyboardContextMenu) {
        e.preventDefault();
      }
    };

    const handleWindowBlur = () => {
      clearActivePresses();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        clearActivePresses();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [captureMode, clearActivePresses, onRun, playClickSound]);

  const handleReset = useCallback(() => {
    clearActivePresses();
    lastKeyDownTimesRef.current.clear();
    lastEventTimeRef.current = null;
    lastEscPressRef.current = null;
    setTestedCodes([]);
    setStuckCodes([]);
    setChatterCodes([]);
    setTotalPresses(0);
    setMaxSimultaneous(0);
    setLastEvent(null);
    setRecentEvents([]);
    setAlerts([]);
  }, [clearActivePresses]);

  const handleInspectKeycap = useCallback(
    (keyDef: KeyDefinition) => {
      eventSeqRef.current += 1;
      const synthetic: InspectedKeyEvent = {
        id: eventSeqRef.current,
        code: keyDef.code,
        key: osMode === 'mac' ? keyDef.macLabel : keyDef.winLabel,
        location: keyDef.location ?? 0,
        keyCode: 0,
        modifiers: [],
        deltaMs: null,
        isChatter: chatterCodes.includes(keyDef.code),
        isStuck: stuckCodes.includes(keyDef.code),
        timestamp: Date.now(),
      };
      setLastEvent(synthetic);
    },
    [chatterCodes, osMode, stuckCodes]
  );

  const layoutRows = useMemo(() => getKeyboardLayout(layout), [layout]);

  const sectionRows = useMemo(() => {
    const main: KeyDefinition[][] = [];
    const nav: KeyDefinition[][] = [];
    const numpad: KeyDefinition[][] = [];

    for (const row of layoutRows) {
      main.push(row.filter((k) => k.section === 'main'));
      nav.push(row.filter((k) => k.section === 'nav'));
      numpad.push(row.filter((k) => k.section === 'numpad'));
    }

    return { main, nav, numpad };
  }, [layoutRows]);

  const stats = useMemo(
    () =>
      computeKeyboardStats({
        layout,
        testedCodes,
        activeCodes,
        stuckCodes,
        maxSimultaneous,
        totalPresses,
      }),
    [layout, testedCodes, activeCodes, stuckCodes, maxSimultaneous, totalPresses]
  );

  const activeSet = useMemo(() => new Set(activeCodes), [activeCodes]);
  const testedSet = useMemo(() => new Set(testedCodes), [testedCodes]);
  const stuckSet = useMemo(() => new Set(stuckCodes), [stuckCodes]);
  const chatterSet = useMemo(() => new Set(chatterCodes), [chatterCodes]);

  const totalAlertsCount = useMemo(
    () => new Set([...stuckCodes, ...chatterCodes]).size,
    [stuckCodes, chatterCodes]
  );

  const renderKeycap = (keyDef: KeyDefinition) => {
    const isActive = activeSet.has(keyDef.code);
    const isStuck = stuckSet.has(keyDef.code);
    const isChatter = chatterSet.has(keyDef.code);
    const isTested = testedSet.has(keyDef.code);
    const isSelected = lastEvent?.code === keyDef.code;

    const primaryLabel = osMode === 'mac' ? keyDef.macLabel : keyDef.winLabel;
    const classes = ['keycap'];
    if (isActive) classes.push('keycap-active');
    else if (isChatter) classes.push('keycap-chatter');
    else if (isStuck) classes.push('keycap-stuck');
    else if (isTested) classes.push('keycap-tested');
    if (isSelected) classes.push('keycap-selected');

    return (
      <button
        key={keyDef.code}
        type="button"
        tabIndex={-1}
        className={classes.join(' ')}
        style={{
          width: `calc(var(--key-unit) * ${keyDef.widthU} + var(--key-gap) * ${Math.max(0, keyDef.widthU - 1)})`,
        }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleInspectKeycap(keyDef)}
        title={`${primaryLabel} (${keyDef.code})`}
        aria-label={`${primaryLabel} (${keyDef.code})`}
        aria-pressed={isActive}
      >
        {keyDef.secondaryLabel ? (
          <span className="keycap-secondary">{keyDef.secondaryLabel}</span>
        ) : (
          <span className="keycap-secondary" aria-hidden="true" />
        )}
        <span className="keycap-primary">{primaryLabel}</span>
      </button>
    );
  };

  return (
    <BentoGrid>
      {/* Top Control Bar + KPI Pills + Visual Keyboard Chassis */}
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
          {/* Left: Layout & OS toggles */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="subtle-text">{t('tools:diagnosticsSuite.keyboard.layoutLabel')}:</span>
              <button
                type="button"
                className={`btn btn-sm ${layout === 'full-104' ? 'glass-pill-active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLayout('full-104')}
                aria-pressed={layout === 'full-104'}
              >
                {t('tools:diagnosticsSuite.keyboard.layoutFull104')}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${layout === 'tkl-80' ? 'glass-pill-active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLayout('tkl-80')}
                aria-pressed={layout === 'tkl-80'}
              >
                {t('tools:diagnosticsSuite.keyboard.layoutTkl80')}
              </button>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="subtle-text">{t('tools:diagnosticsSuite.keyboard.osLabel')}:</span>
              <button
                type="button"
                className={`btn btn-sm ${osMode === 'win' ? 'glass-pill-active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setOsMode('win')}
                aria-pressed={osMode === 'win'}
              >
                {t('tools:diagnosticsSuite.keyboard.osWin')}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${osMode === 'mac' ? 'glass-pill-active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setOsMode('mac')}
                aria-pressed={osMode === 'mac'}
              >
                {t('tools:diagnosticsSuite.keyboard.osMac')}
              </button>
            </div>
          </div>

          {/* Right: Capture Mode, Sound, Reset */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${captureMode ? 'btn-primary' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleCaptureMode(!captureMode)}
              aria-pressed={captureMode}
            >
              {captureMode ? <Lock size={14} /> : <Unlock size={14} />}
              <span>{t('tools:diagnosticsSuite.keyboard.captureMode')}</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${soundEnabled ? 'glass-pill-active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setSoundEnabled((v) => !v)}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{t('tools:diagnosticsSuite.keyboard.clickSound')}</span>
            </button>

            <button
              type="button"
              className="btn btn-sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              <span>{t('tools:diagnosticsSuite.keyboard.resetButton')}</span>
            </button>
          </div>
        </div>

        {/* Capture Active Safe-Exit Banner (NFR-13) */}
        {captureMode && (
          <div
            className="glass-panel"
            style={{
              padding: '0.6rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.6rem',
              borderColor: 'var(--accent-border)',
              background: 'var(--accent-glow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="glass-pill glass-pill-active">
                <Lock size={12} />
                <span>{t('tools:diagnosticsSuite.keyboard.captureActiveBadge')}</span>
              </span>
              <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>
                {t('tools:diagnosticsSuite.keyboard.unlockHint')}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleCaptureMode(false)}
            >
              <Unlock size={13} />
              <span>{t('tools:diagnosticsSuite.keyboard.unlockButton')}</span>
            </button>
          </div>
        )}

        {/* 4 KPI Pills + Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="glass-pill glass-pill-active font-mono">
              {t('tools:diagnosticsSuite.keyboard.kpiTested', {
                tested: stats.testedCount,
                total: stats.totalLayoutKeys,
                percent: stats.coveragePercent,
              })}
            </span>
            <span className="glass-pill font-mono">
              {t('tools:diagnosticsSuite.keyboard.kpiTotalPresses', {
                count: stats.totalPresses,
              })}
            </span>
            <span className="glass-pill font-mono">
              {t('tools:diagnosticsSuite.keyboard.kpiMaxNkro', {
                count: stats.maxSimultaneous,
              })}
            </span>
            <span
              className={`glass-pill font-mono ${
                totalAlertsCount > 0 ? 'badge-warning' : ''
              }`}
            >
              {t('tools:diagnosticsSuite.keyboard.kpiAlerts', {
                count: totalAlertsCount,
              })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span className="glass-pill" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)', borderColor: 'var(--accent)' }}>
              {t('tools:diagnosticsSuite.keyboard.statusActive')}
            </span>
            <span className="glass-pill glass-pill-active">
              {t('tools:diagnosticsSuite.keyboard.statusTested')}
            </span>
            <span className="glass-pill badge-warning">
              {t('tools:diagnosticsSuite.keyboard.statusStuck')}
            </span>
            <span className="glass-pill badge-danger">
              {t('tools:diagnosticsSuite.keyboard.statusChatter')}
            </span>
          </div>
        </div>

        {/* Visual ANSI Keyboard Chassis */}
        <div
          className="keyboard-chassis"
          role="region"
          aria-label={t('catalog:tools.keyboard-tester.name')}
        >
          <div className="keyboard-blocks">
            {/* Main ANSI Block */}
            <div className="keyboard-section">
              {sectionRows.main.map((rowKeys, rowIdx) => (
                <div key={`main-${rowIdx}`} className="keyboard-row">
                  {rowKeys.map((keyDef) => renderKeycap(keyDef))}
                </div>
              ))}
            </div>

            {/* Navigation & Arrow Cluster */}
            <div className="keyboard-section">
              {sectionRows.nav.map((rowKeys, rowIdx) =>
                rowKeys.length === 0 ? (
                  <div key={`nav-empty-${rowIdx}`} className="keyboard-row-empty" aria-hidden="true" />
                ) : (
                  <div
                    key={`nav-${rowIdx}`}
                    className={`keyboard-row ${
                      rowIdx === 4 ? 'keyboard-row-nav-arrows-top' : ''
                    }`.trim()}
                  >
                    {rowKeys.map((keyDef) => renderKeycap(keyDef))}
                  </div>
                )
              )}
            </div>

            {/* Numpad Cluster (Full-104 only) */}
            {layout === 'full-104' && (
              <div className="keyboard-section">
                {sectionRows.numpad.map((rowKeys, rowIdx) =>
                  rowKeys.length === 0 ? (
                    <div
                      key={`num-empty-${rowIdx}`}
                      className="keyboard-row-empty"
                      aria-hidden="true"
                    />
                  ) : (
                    <div key={`num-${rowIdx}`} className="keyboard-row">
                      {rowKeys.map((keyDef) => renderKeycap(keyDef))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </BentoCard>

      {/* Bottom Left: Live KeyboardEvent Inspector */}
      <BentoCard span="6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyboardIcon size={17} style={{ color: 'var(--accent)' }} />
            <h2 className="section-title">{t('tools:diagnosticsSuite.keyboard.inspectorTitle')}</h2>
          </div>
          {activeCodes.length > 0 && (
            <span className="glass-pill glass-pill-active font-mono">
              {activeCodes.join(' + ')}
            </span>
          )}
        </div>

        {!lastEvent ? (
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
            }}
          >
            {t('tools:diagnosticsSuite.keyboard.emptyInspector')}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.65rem',
            }}
          >
            <div className="glass-panel" style={{ padding: '0.65rem 0.8rem' }}>
              <div className="subtle-text">{t('tools:diagnosticsSuite.keyboard.fieldCode')}</div>
              <div className="font-mono" style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {lastEvent.code}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '0.65rem 0.8rem' }}>
              <div className="subtle-text">{t('tools:diagnosticsSuite.keyboard.fieldKey')}</div>
              <div className="font-mono" style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {lastEvent.key}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '0.65rem 0.8rem' }}>
              <div className="subtle-text">{t('tools:diagnosticsSuite.keyboard.fieldLocation')}</div>
              <div className="font-mono" style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {lastEvent.location}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '0.65rem 0.8rem' }}>
              <div className="subtle-text">{t('tools:diagnosticsSuite.keyboard.fieldKeyCode')}</div>
              <div className="font-mono" style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {lastEvent.keyCode}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '0.65rem 0.8rem' }}>
              <div className="subtle-text">{t('tools:diagnosticsSuite.keyboard.fieldModifiers')}</div>
              <div className="font-mono" style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: '0.2rem' }}>
                {lastEvent.modifiers.length > 0
                  ? lastEvent.modifiers.join(' + ')
                  : t('tools:diagnosticsSuite.keyboard.noneLabel')}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '0.65rem 0.8rem' }}>
              <div className="subtle-text">{t('tools:diagnosticsSuite.keyboard.fieldDeltaMs')}</div>
              <div className="font-mono" style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {lastEvent.deltaMs !== null ? `${lastEvent.deltaMs} ms` : '—'}
              </div>
            </div>
          </div>
        )}
      </BentoCard>

      {/* Bottom Right: Recent Key Events & Stuck/Chatter Alerts Log */}
      <BentoCard span="6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">{t('tools:diagnosticsSuite.keyboard.recentEventsTitle')}</h2>
          <span className="glass-pill font-mono">{recentEvents.length} / {MAX_RECENT_EVENTS}</span>
        </div>

        {/* Alerts Section */}
        <div className="glass-panel" style={{ padding: '0.65rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <ShieldAlert size={14} style={{ color: totalAlertsCount > 0 ? 'var(--warning)' : 'var(--accent)' }} />
            <span>{t('tools:diagnosticsSuite.keyboard.alertsTitle')}</span>
          </div>

          {alerts.length === 0 ? (
            <div className="subtle-text" style={{ fontSize: '0.78rem' }}>
              {t('tools:diagnosticsSuite.keyboard.noAlertsMessage')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '110px', overflowY: 'auto' }}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`glass-pill ${alert.kind === 'chatter' ? 'badge-danger' : 'badge-warning'}`}
                  style={{ borderRadius: 'var(--radius-sm)', justifyContent: 'flex-start', padding: '0.35rem 0.55rem' }}
                >
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span>
                    {alert.kind === 'stuck'
                      ? t('tools:diagnosticsSuite.keyboard.stuckAlertMessage', { code: alert.code })
                      : t('tools:diagnosticsSuite.keyboard.chatterAlertMessage', {
                          code: alert.code,
                          deltaMs: alert.deltaMs ?? 0,
                        })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent 12 Key Events */}
        {recentEvents.length === 0 ? (
          <div className="subtle-text" style={{ fontSize: '0.84rem' }}>
            {t('tools:diagnosticsSuite.keyboard.emptyRecentEvents')}
          </div>
        ) : (
          <div className="keyboard-events-list">
            {recentEvents.map((ev) => (
              <div key={ev.id} className="keyboard-event-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <span className="font-mono" style={{ fontWeight: 600 }}>
                    {ev.code}
                  </span>
                  <span className="subtle-text font-mono">({ev.key})</span>
                  {ev.modifiers.length > 0 && (
                    <span className="glass-pill" style={{ padding: '0.1rem 0.45rem', fontSize: '0.7rem' }}>
                      {ev.modifiers.join('+')}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  {ev.isChatter && (
                    <span className="glass-pill badge-danger" style={{ padding: '0.1rem 0.45rem', fontSize: '0.7rem' }}>
                      {t('tools:diagnosticsSuite.keyboard.statusChatter')}
                    </span>
                  )}
                  {(ev.isStuck || stuckSet.has(ev.code)) && (
                    <span className="glass-pill badge-warning" style={{ padding: '0.1rem 0.45rem', fontSize: '0.7rem' }}>
                      {t('tools:diagnosticsSuite.keyboard.statusStuck')}
                    </span>
                  )}
                  <span className="subtle-text font-mono" style={{ fontSize: '0.74rem' }}>
                    {ev.deltaMs !== null ? `${ev.deltaMs} ms` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  );
}
