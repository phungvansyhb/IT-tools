// Pure Node/tsx-executable diagnostics engines for Keyboard, Mic, Speaker & Speed Test
// Zero DOM / window / WebAudio globals.

export type KeyboardLayoutId = 'full-104' | 'tkl-80';
export type KeyboardOsMode = 'win' | 'mac';

export interface KeyDefinition {
  code: string;
  winLabel: string;
  macLabel: string;
  secondaryLabel?: string;
  widthU: number;
  section: 'main' | 'nav' | 'numpad';
  row: number;
  location?: number;
}

const ANSI_MAIN_ROWS: KeyDefinition[][] = [
  // Row 0: Function row (13 keys)
  [
    { code: 'Escape', winLabel: 'Esc', macLabel: 'Esc', widthU: 1, section: 'main', row: 0 },
    { code: 'F1', winLabel: 'F1', macLabel: 'F1', widthU: 1, section: 'main', row: 0 },
    { code: 'F2', winLabel: 'F2', macLabel: 'F2', widthU: 1, section: 'main', row: 0 },
    { code: 'F3', winLabel: 'F3', macLabel: 'F3', widthU: 1, section: 'main', row: 0 },
    { code: 'F4', winLabel: 'F4', macLabel: 'F4', widthU: 1, section: 'main', row: 0 },
    { code: 'F5', winLabel: 'F5', macLabel: 'F5', widthU: 1, section: 'main', row: 0 },
    { code: 'F6', winLabel: 'F6', macLabel: 'F6', widthU: 1, section: 'main', row: 0 },
    { code: 'F7', winLabel: 'F7', macLabel: 'F7', widthU: 1, section: 'main', row: 0 },
    { code: 'F8', winLabel: 'F8', macLabel: 'F8', widthU: 1, section: 'main', row: 0 },
    { code: 'F9', winLabel: 'F9', macLabel: 'F9', widthU: 1, section: 'main', row: 0 },
    { code: 'F10', winLabel: 'F10', macLabel: 'F10', widthU: 1, section: 'main', row: 0 },
    { code: 'F11', winLabel: 'F11', macLabel: 'F11', widthU: 1, section: 'main', row: 0 },
    { code: 'F12', winLabel: 'F12', macLabel: 'F12', widthU: 1, section: 'main', row: 0 },
  ],
  // Row 1: Number row (14 keys)
  [
    { code: 'Backquote', winLabel: '`', macLabel: '`', secondaryLabel: '~', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit1', winLabel: '1', macLabel: '1', secondaryLabel: '!', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit2', winLabel: '2', macLabel: '2', secondaryLabel: '@', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit3', winLabel: '3', macLabel: '3', secondaryLabel: '#', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit4', winLabel: '4', macLabel: '4', secondaryLabel: '$', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit5', winLabel: '5', macLabel: '5', secondaryLabel: '%', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit6', winLabel: '6', macLabel: '6', secondaryLabel: '^', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit7', winLabel: '7', macLabel: '7', secondaryLabel: '&', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit8', winLabel: '8', macLabel: '8', secondaryLabel: '*', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit9', winLabel: '9', macLabel: '9', secondaryLabel: '(', widthU: 1, section: 'main', row: 1 },
    { code: 'Digit0', winLabel: '0', macLabel: '0', secondaryLabel: ')', widthU: 1, section: 'main', row: 1 },
    { code: 'Minus', winLabel: '-', macLabel: '-', secondaryLabel: '_', widthU: 1, section: 'main', row: 1 },
    { code: 'Equal', winLabel: '=', macLabel: '=', secondaryLabel: '+', widthU: 1, section: 'main', row: 1 },
    { code: 'Backspace', winLabel: 'Backspace', macLabel: 'Delete', widthU: 2, section: 'main', row: 1 },
  ],
  // Row 2: Top alpha row (14 keys)
  [
    { code: 'Tab', winLabel: 'Tab', macLabel: 'Tab', widthU: 1.5, section: 'main', row: 2 },
    { code: 'KeyQ', winLabel: 'Q', macLabel: 'Q', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyW', winLabel: 'W', macLabel: 'W', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyE', winLabel: 'E', macLabel: 'E', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyR', winLabel: 'R', macLabel: 'R', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyT', winLabel: 'T', macLabel: 'T', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyY', winLabel: 'Y', macLabel: 'Y', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyU', winLabel: 'U', macLabel: 'U', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyI', winLabel: 'I', macLabel: 'I', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyO', winLabel: 'O', macLabel: 'O', widthU: 1, section: 'main', row: 2 },
    { code: 'KeyP', winLabel: 'P', macLabel: 'P', widthU: 1, section: 'main', row: 2 },
    { code: 'BracketLeft', winLabel: '[', macLabel: '[', secondaryLabel: '{', widthU: 1, section: 'main', row: 2 },
    { code: 'BracketRight', winLabel: ']', macLabel: ']', secondaryLabel: '}', widthU: 1, section: 'main', row: 2 },
    { code: 'Backslash', winLabel: '\\', macLabel: '\\', secondaryLabel: '|', widthU: 1.5, section: 'main', row: 2 },
  ],
  // Row 3: Home row (13 keys)
  [
    { code: 'CapsLock', winLabel: 'Caps', macLabel: 'Caps', widthU: 1.75, section: 'main', row: 3 },
    { code: 'KeyA', winLabel: 'A', macLabel: 'A', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyS', winLabel: 'S', macLabel: 'S', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyD', winLabel: 'D', macLabel: 'D', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyF', winLabel: 'F', macLabel: 'F', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyG', winLabel: 'G', macLabel: 'G', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyH', winLabel: 'H', macLabel: 'H', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyJ', winLabel: 'J', macLabel: 'J', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyK', winLabel: 'K', macLabel: 'K', widthU: 1, section: 'main', row: 3 },
    { code: 'KeyL', winLabel: 'L', macLabel: 'L', widthU: 1, section: 'main', row: 3 },
    { code: 'Semicolon', winLabel: ';', macLabel: ';', secondaryLabel: ':', widthU: 1, section: 'main', row: 3 },
    { code: 'Quote', winLabel: "'", macLabel: "'", secondaryLabel: '"', widthU: 1, section: 'main', row: 3 },
    { code: 'Enter', winLabel: 'Enter', macLabel: 'Return', widthU: 2.25, section: 'main', row: 3 },
  ],
  // Row 4: Bottom alpha row (12 keys)
  [
    { code: 'ShiftLeft', winLabel: 'Shift', macLabel: 'Shift', widthU: 2.25, section: 'main', row: 4, location: 1 },
    { code: 'KeyZ', winLabel: 'Z', macLabel: 'Z', widthU: 1, section: 'main', row: 4 },
    { code: 'KeyX', winLabel: 'X', macLabel: 'X', widthU: 1, section: 'main', row: 4 },
    { code: 'KeyC', winLabel: 'C', macLabel: 'C', widthU: 1, section: 'main', row: 4 },
    { code: 'KeyV', winLabel: 'V', macLabel: 'V', widthU: 1, section: 'main', row: 4 },
    { code: 'KeyB', winLabel: 'B', macLabel: 'B', widthU: 1, section: 'main', row: 4 },
    { code: 'KeyN', winLabel: 'N', macLabel: 'N', widthU: 1, section: 'main', row: 4 },
    { code: 'KeyM', winLabel: 'M', macLabel: 'M', widthU: 1, section: 'main', row: 4 },
    { code: 'Comma', winLabel: ',', macLabel: ',', secondaryLabel: '<', widthU: 1, section: 'main', row: 4 },
    { code: 'Period', winLabel: '.', macLabel: '.', secondaryLabel: '>', widthU: 1, section: 'main', row: 4 },
    { code: 'Slash', winLabel: '/', macLabel: '/', secondaryLabel: '?', widthU: 1, section: 'main', row: 4 },
    { code: 'ShiftRight', winLabel: 'Shift', macLabel: 'Shift', widthU: 2.75, section: 'main', row: 4, location: 2 },
  ],
  // Row 5: Modifier / space row (8 keys)
  [
    { code: 'ControlLeft', winLabel: 'Ctrl', macLabel: '⌃ Ctrl', widthU: 1.25, section: 'main', row: 5, location: 1 },
    { code: 'MetaLeft', winLabel: 'Win', macLabel: '⌘ Cmd', widthU: 1.25, section: 'main', row: 5, location: 1 },
    { code: 'AltLeft', winLabel: 'Alt', macLabel: '⌥ Opt', widthU: 1.25, section: 'main', row: 5, location: 1 },
    { code: 'Space', winLabel: 'Space', macLabel: 'Space', widthU: 6.25, section: 'main', row: 5 },
    { code: 'AltRight', winLabel: 'Alt', macLabel: '⌥ Opt', widthU: 1.25, section: 'main', row: 5, location: 2 },
    { code: 'MetaRight', winLabel: 'Win', macLabel: '⌘ Cmd', widthU: 1.25, section: 'main', row: 5, location: 2 },
    { code: 'ContextMenu', winLabel: 'Menu', macLabel: 'Menu', widthU: 1.25, section: 'main', row: 5 },
    { code: 'ControlRight', winLabel: 'Ctrl', macLabel: '⌃ Ctrl', widthU: 1.25, section: 'main', row: 5, location: 2 },
  ],
];

const ANSI_NAV_ROWS: KeyDefinition[][] = [
  // Row 0: System keys (3 keys)
  [
    { code: 'PrintScreen', winLabel: 'PrtSc', macLabel: 'F13', widthU: 1, section: 'nav', row: 0 },
    { code: 'ScrollLock', winLabel: 'ScrLk', macLabel: 'F14', widthU: 1, section: 'nav', row: 0 },
    { code: 'Pause', winLabel: 'Pause', macLabel: 'F15', widthU: 1, section: 'nav', row: 0 },
  ],
  // Row 1: Nav top (3 keys)
  [
    { code: 'Insert', winLabel: 'Ins', macLabel: 'Help', widthU: 1, section: 'nav', row: 1 },
    { code: 'Home', winLabel: 'Home', macLabel: 'Home', widthU: 1, section: 'nav', row: 1 },
    { code: 'PageUp', winLabel: 'PgUp', macLabel: 'PgUp', widthU: 1, section: 'nav', row: 1 },
  ],
  // Row 2: Nav bottom (3 keys)
  [
    { code: 'Delete', winLabel: 'Del', macLabel: 'Fwd Del', widthU: 1, section: 'nav', row: 2 },
    { code: 'End', winLabel: 'End', macLabel: 'End', widthU: 1, section: 'nav', row: 2 },
    { code: 'PageDown', winLabel: 'PgDn', macLabel: 'PgDn', widthU: 1, section: 'nav', row: 2 },
  ],
  // Row 3: Empty in nav cluster
  [],
  // Row 4: ArrowUp (1 key)
  [
    { code: 'ArrowUp', winLabel: '↑', macLabel: '↑', widthU: 1, section: 'nav', row: 4 },
  ],
  // Row 5: Arrow Left/Down/Right (3 keys)
  [
    { code: 'ArrowLeft', winLabel: '←', macLabel: '←', widthU: 1, section: 'nav', row: 5 },
    { code: 'ArrowDown', winLabel: '↓', macLabel: '↓', widthU: 1, section: 'nav', row: 5 },
    { code: 'ArrowRight', winLabel: '→', macLabel: '→', widthU: 1, section: 'nav', row: 5 },
  ],
];

const ANSI_NUMPAD_ROWS: KeyDefinition[][] = [
  // Row 0: Empty above numpad
  [],
  // Row 1: NumLock, /, *, - (4 keys)
  [
    { code: 'NumLock', winLabel: 'Num', macLabel: 'Clear', widthU: 1, section: 'numpad', row: 1, location: 3 },
    { code: 'NumpadDivide', winLabel: '/', macLabel: '/', widthU: 1, section: 'numpad', row: 1, location: 3 },
    { code: 'NumpadMultiply', winLabel: '*', macLabel: '*', widthU: 1, section: 'numpad', row: 1, location: 3 },
    { code: 'NumpadSubtract', winLabel: '-', macLabel: '-', widthU: 1, section: 'numpad', row: 1, location: 3 },
  ],
  // Row 2: 7, 8, 9, + (4 keys)
  [
    { code: 'Numpad7', winLabel: '7', macLabel: '7', secondaryLabel: 'Home', widthU: 1, section: 'numpad', row: 2, location: 3 },
    { code: 'Numpad8', winLabel: '8', macLabel: '8', secondaryLabel: '↑', widthU: 1, section: 'numpad', row: 2, location: 3 },
    { code: 'Numpad9', winLabel: '9', macLabel: '9', secondaryLabel: 'PgUp', widthU: 1, section: 'numpad', row: 2, location: 3 },
    { code: 'NumpadAdd', winLabel: '+', macLabel: '+', widthU: 1, section: 'numpad', row: 2, location: 3 },
  ],
  // Row 3: 4, 5, 6 (3 keys)
  [
    { code: 'Numpad4', winLabel: '4', macLabel: '4', secondaryLabel: '←', widthU: 1, section: 'numpad', row: 3, location: 3 },
    { code: 'Numpad5', winLabel: '5', macLabel: '5', widthU: 1, section: 'numpad', row: 3, location: 3 },
    { code: 'Numpad6', winLabel: '6', macLabel: '6', secondaryLabel: '→', widthU: 1, section: 'numpad', row: 3, location: 3 },
  ],
  // Row 4: 1, 2, 3, Enter (4 keys)
  [
    { code: 'Numpad1', winLabel: '1', macLabel: '1', secondaryLabel: 'End', widthU: 1, section: 'numpad', row: 4, location: 3 },
    { code: 'Numpad2', winLabel: '2', macLabel: '2', secondaryLabel: '↓', widthU: 1, section: 'numpad', row: 4, location: 3 },
    { code: 'Numpad3', winLabel: '3', macLabel: '3', secondaryLabel: 'PgDn', widthU: 1, section: 'numpad', row: 4, location: 3 },
    { code: 'NumpadEnter', winLabel: 'Enter', macLabel: 'Return', widthU: 1, section: 'numpad', row: 4, location: 3 },
  ],
  // Row 5: 0, . (2 keys)
  [
    { code: 'Numpad0', winLabel: '0', macLabel: '0', secondaryLabel: 'Ins', widthU: 2, section: 'numpad', row: 5, location: 3 },
    { code: 'NumpadDecimal', winLabel: '.', macLabel: '.', secondaryLabel: 'Del', widthU: 1, section: 'numpad', row: 5, location: 3 },
  ],
];

export function getKeyboardLayout(layout: KeyboardLayoutId): KeyDefinition[][] {
  const rows: KeyDefinition[][] = [];
  for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
    const rowKeys: KeyDefinition[] = [
      ...ANSI_MAIN_ROWS[rowIdx].map((k) => ({ ...k })),
      ...ANSI_NAV_ROWS[rowIdx].map((k) => ({ ...k })),
    ];
    if (layout === 'full-104') {
      rowKeys.push(...ANSI_NUMPAD_ROWS[rowIdx].map((k) => ({ ...k })));
    }
    rows.push(rowKeys);
  }
  return rows;
}

export function getKeyboardLayoutKeyCodes(layout: KeyboardLayoutId): string[] {
  return getKeyboardLayout(layout).flatMap((row) => row.map((key) => key.code));
}

export function computeKeyboardStats(params: {
  layout: KeyboardLayoutId;
  testedCodes: Iterable<string>;
  activeCodes: Iterable<string>;
  stuckCodes: Iterable<string>;
  maxSimultaneous: number;
  totalPresses: number;
}): {
  totalLayoutKeys: number;
  testedCount: number;
  coveragePercent: number;
  activeCount: number;
  stuckCount: number;
  maxSimultaneous: number;
  totalPresses: number;
} {
  const layoutCodes = new Set(getKeyboardLayoutKeyCodes(params.layout));
  const totalLayoutKeys = layoutCodes.size;

  const testedInLayout = new Set<string>();
  for (const code of params.testedCodes) {
    if (layoutCodes.has(code)) {
      testedInLayout.add(code);
    }
  }
  const testedCount = testedInLayout.size;
  const coveragePercent =
    totalLayoutKeys > 0 ? Math.round((testedCount / totalLayoutKeys) * 1000) / 10 : 0;

  const activeSet = new Set(params.activeCodes);
  const stuckSet = new Set(params.stuckCodes);

  return {
    totalLayoutKeys,
    testedCount,
    coveragePercent,
    activeCount: activeSet.size,
    stuckCount: stuckSet.size,
    maxSimultaneous: Number.isFinite(params.maxSimultaneous)
      ? Math.max(0, Math.floor(params.maxSimultaneous))
      : 0,
    totalPresses: Number.isFinite(params.totalPresses)
      ? Math.max(0, Math.floor(params.totalPresses))
      : 0,
  };
}

export function detectKeyChatter(
  lastPressMs: number | null | undefined,
  currentPressMs: number,
  thresholdMs = 40
): boolean {
  if (lastPressMs == null || !Number.isFinite(lastPressMs) || !Number.isFinite(currentPressMs)) {
    return false;
  }
  const delta = currentPressMs - lastPressMs;
  return delta >= 0 && delta < thresholdMs;
}

const ALWAYS_PREVENT_DEFAULT_KEY_CODES = new Set<string>([
  // Page / container scrolling keys
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  // Focus / navigation / activation / menu keys
  'Tab',
  'Enter',
  'NumpadEnter',
  'Backspace',
  'ContextMenu',
  'AltLeft',
  'AltRight',
  // Browser help, find, address bar, caret browsing, and menu bar keys
  'F1',
  'F3',
  'F6',
  'F7',
  'F10',
]);

const QUICK_FIND_KEY_CODES = new Set<string>(['Slash', 'Quote']);

export function shouldPreventDefaultBrowserKey(params: {
  code: string;
  key?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  captureMode: boolean;
}): boolean {
  if (params.captureMode) {
    return true;
  }

  if (params.key === ' ' || ALWAYS_PREVENT_DEFAULT_KEY_CODES.has(params.code)) {
    return true;
  }

  // Prevent Firefox Quick Find ('/' and "'") when pressed without OS/Ctrl modifiers
  if (
    !params.ctrlKey &&
    !params.metaKey &&
    !params.altKey &&
    (QUICK_FIND_KEY_CODES.has(params.code) || params.key === '/' || params.key === "'")
  ) {
    return true;
  }

  return false;
}

export interface AudioLevelMetrics {
  rms: number;
  peak: number;
  dbfs: number;
  peakDbfs: number;
  isClipping: boolean;
}

export function calculateAudioLevels(samples: Float32Array): AudioLevelMetrics {
  if (!samples || samples.length === 0) {
    return {
      rms: 0,
      peak: 0,
      dbfs: -100,
      peakDbfs: -100,
      isClipping: false,
    };
  }

  let sumSquares = 0;
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const raw = samples[i];
    const sample = Number.isFinite(raw) ? raw : 0;
    const abs = Math.abs(sample);
    sumSquares += sample * sample;
    if (abs > peak) {
      peak = abs;
    }
  }

  const rms = Math.sqrt(sumSquares / samples.length);
  const dbfs = rms > 0 ? Math.max(-100, 20 * Math.log10(rms)) : -100;
  const peakDbfs = peak > 0 ? Math.max(-100, 20 * Math.log10(peak)) : -100;
  const isClipping = peak >= 0.98 || peakDbfs >= -0.2;

  return {
    rms,
    peak,
    dbfs,
    peakDbfs,
    isClipping,
  };
}

export type MicNoiseState = 'silent' | 'quiet' | 'normal' | 'loud' | 'clipping';

export function classifyMicNoiseFloor(dbfs: number, isClipping: boolean): MicNoiseState {
  if (isClipping) return 'clipping';
  if (!Number.isFinite(dbfs) || dbfs < -60) return 'silent';
  if (dbfs < -40) return 'quiet';
  if (dbfs < -12) return 'normal';
  return 'loud';
}

export function computeSweepFrequencyAtProgress(
  progress01: number,
  minHz = 20,
  maxHz = 20_000
): number {
  const safeMin = Number.isFinite(minHz) && minHz > 0 ? minHz : 20;
  const safeMax = Number.isFinite(maxHz) && maxHz >= safeMin ? maxHz : 20_000;
  const p = Number.isFinite(progress01) ? Math.min(1, Math.max(0, progress01)) : 0;
  return safeMin * Math.pow(safeMax / safeMin, p);
}

export function clampSafeMasterVolume(percent: number): number {
  const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 35;
  return safePercent / 100;
}

export const SPEED_TEST_MIN_DOWNLOAD_BYTES = 65_536; // 64 KiB
export const SPEED_TEST_DEFAULT_DOWNLOAD_BYTES = 1_048_576; // 1 MiB
export const SPEED_TEST_MAX_DOWNLOAD_BYTES = 4_194_304; // 4 MiB
export const SPEED_TEST_MAX_UPLOAD_BYTES = 4_194_304; // 4 MiB

export function clampDownloadBytes(raw: string | number | null | undefined): number {
  if (raw === null || raw === undefined) {
    return SPEED_TEST_DEFAULT_DOWNLOAD_BYTES;
  }
  let numeric: number;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return SPEED_TEST_DEFAULT_DOWNLOAD_BYTES;
    numeric = Number(trimmed);
  } else {
    numeric = raw;
  }

  if (!Number.isFinite(numeric)) {
    return SPEED_TEST_DEFAULT_DOWNLOAD_BYTES;
  }

  const intVal = Math.trunc(numeric);
  return Math.min(SPEED_TEST_MAX_DOWNLOAD_BYTES, Math.max(SPEED_TEST_MIN_DOWNLOAD_BYTES, intVal));
}

export function computePingStats(samplesMs: number[]): {
  minMs: number;
  avgMs: number;
  maxMs: number;
  jitterMs: number;
} {
  const valid = samplesMs.filter(
    (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0
  );
  if (valid.length === 0) {
    return { minMs: 0, avgMs: 0, maxMs: 0, jitterMs: 0 };
  }

  let min = valid[0];
  let max = valid[0];
  let sum = 0;
  for (const v of valid) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }

  let jitter = 0;
  if (valid.length >= 2) {
    let diffSum = 0;
    for (let i = 1; i < valid.length; i++) {
      diffSum += Math.abs(valid[i] - valid[i - 1]);
    }
    jitter = diffSum / (valid.length - 1);
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    minMs: round2(min),
    avgMs: round2(sum / valid.length),
    maxMs: round2(max),
    jitterMs: round2(jitter),
  };
}

export function computeBandwidthMbps(bytesTransferred: number, durationMs: number): number {
  if (
    !Number.isFinite(bytesTransferred) ||
    !Number.isFinite(durationMs) ||
    bytesTransferred <= 0 ||
    durationMs <= 0
  ) {
    return 0;
  }
  const mbps = (bytesTransferred * 8) / (durationMs * 1000);
  return Math.round(mbps * 100) / 100;
}

export type NetworkGrade = 'excellent' | 'good' | 'fair' | 'poor';
export type NetworkUseCaseId = 'video_call' | 'streaming_4k' | 'gaming' | 'cloud_sync';

const GRADE_SCORE: Record<NetworkGrade, number> = {
  poor: 0,
  fair: 1,
  good: 2,
  excellent: 3,
};

export function assessNetworkSuitability(metrics: {
  pingMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
}): {
  overallGrade: NetworkGrade;
  useCases: Array<{ id: NetworkUseCaseId; status: NetworkGrade }>;
} {
  const ping = Number.isFinite(metrics.pingMs) && metrics.pingMs >= 0 ? metrics.pingMs : 9999;
  const jitter = Number.isFinite(metrics.jitterMs) && metrics.jitterMs >= 0 ? metrics.jitterMs : 9999;
  const dl = Number.isFinite(metrics.downloadMbps) && metrics.downloadMbps >= 0 ? metrics.downloadMbps : 0;
  const ul = Number.isFinite(metrics.uploadMbps) && metrics.uploadMbps >= 0 ? metrics.uploadMbps : 0;

  const videoCall: NetworkGrade =
    dl >= 15 && ul >= 10 && ping <= 40 && jitter <= 15
      ? 'excellent'
      : dl >= 5 && ul >= 3 && ping <= 100 && jitter <= 30
        ? 'good'
        : dl >= 2 && ul >= 1 && ping <= 180 && jitter <= 60
          ? 'fair'
          : 'poor';

  const streaming4k: NetworkGrade =
    dl >= 50 ? 'excellent' : dl >= 25 ? 'good' : dl >= 15 ? 'fair' : 'poor';

  const gaming: NetworkGrade =
    ping <= 25 && jitter <= 10 && dl >= 10 && ul >= 3
      ? 'excellent'
      : ping <= 60 && jitter <= 25 && dl >= 5 && ul >= 1
        ? 'good'
        : ping <= 120 && jitter <= 50 && dl >= 3
          ? 'fair'
          : 'poor';

  const cloudSync: NetworkGrade =
    ul >= 50 && dl >= 50
      ? 'excellent'
      : ul >= 15 && dl >= 20
        ? 'good'
        : ul >= 5 && dl >= 5
          ? 'fair'
          : 'poor';

  const useCases: Array<{ id: NetworkUseCaseId; status: NetworkGrade }> = [
    { id: 'video_call', status: videoCall },
    { id: 'streaming_4k', status: streaming4k },
    { id: 'gaming', status: gaming },
    { id: 'cloud_sync', status: cloudSync },
  ];

  const avgScore =
    useCases.reduce((acc, item) => acc + GRADE_SCORE[item.status], 0) / useCases.length;

  let overallGrade: NetworkGrade;
  if (dl <= 0 && ul <= 0) {
    overallGrade = 'poor';
  } else if (avgScore >= 2.5) {
    overallGrade = 'excellent';
  } else if (avgScore >= 1.75) {
    overallGrade = 'good';
  } else if (avgScore >= 0.75) {
    overallGrade = 'fair';
  } else {
    overallGrade = 'poor';
  }

  return { overallGrade, useCases };
}

export function validateSameOriginHeaders(
  originHeader: string | null,
  hostHeader: string | null
): boolean {
  if (!originHeader) {
    return true;
  }
  const normalizedHost = (hostHeader || '').trim().toLowerCase();
  if (!normalizedHost) {
    return false;
  }
  try {
    const parsedOrigin = new URL(originHeader);
    return parsedOrigin.host.toLowerCase() === normalizedHost;
  } catch {
    return false;
  }
}

export function generateIncompressibleBytes(
  byteLength: number,
  seed = 0x9e3779b9
): Uint8Array {
  const len = Number.isFinite(byteLength) ? Math.max(0, Math.floor(byteLength)) : 0;
  const out = new Uint8Array(len);
  let x = (seed >>> 0) || 0x9e3779b9;

  let i = 0;
  const limit4 = len - 3;
  while (i < limit4) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    if (x === 0) x = 0x9e3779b9;
    out[i] = x & 0xff;
    out[i + 1] = (x >>> 8) & 0xff;
    out[i + 2] = (x >>> 16) & 0xff;
    out[i + 3] = (x >>> 24) & 0xff;
    i += 4;
  }

  if (i < len) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    let rem = x >>> 0;
    while (i < len) {
      out[i] = rem & 0xff;
      rem >>>= 8;
      i++;
    }
  }

  return out;
}
