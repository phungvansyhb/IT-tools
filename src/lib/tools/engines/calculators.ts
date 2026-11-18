// Pure client-side calculator engines: Chmod, Cron, Timestamp, Bytes & Number Bases
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getBundle, getFixedT } from '@/i18n/translator';

export interface ChmodState {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

export function chmodToOctal(state: ChmodState): string {
  const calc = (p: { read: boolean; write: boolean; execute: boolean }) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  return `${calc(state.owner)}${calc(state.group)}${calc(state.others)}`;
}

export function chmodToSymbolic(state: ChmodState): string {
  const fmt = (p: { read: boolean; write: boolean; execute: boolean }) =>
    `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`;
  return `${fmt(state.owner)}${fmt(state.group)}${fmt(state.others)}`;
}

export function octalToChmod(octal: string): ChmodState | null {
  const clean = octal.trim().replace(/^0(?=\d{3}$)/, '');
  if (!/^[0-7]{3}$/.test(clean)) return null;
  const parseDigit = (d: number) => ({
    read: Boolean(d & 4),
    write: Boolean(d & 2),
    execute: Boolean(d & 1),
  });
  return {
    owner: parseDigit(Number(clean[0])),
    group: parseDigit(Number(clean[1])),
    others: parseDigit(Number(clean[2])),
  };
}

export interface CronAnalysis {
  valid: boolean;
  error?: string;
  humanReadable: string;
  nextRuns: string[];
}

function parseCronField(field: string, min: number, max: number): Set<number> | null {
  const result = new Set<number>();
  const parts = field.split(',');
  for (const part of parts) {
    const [rangePart, stepStr] = part.split('/');
    const step = stepStr !== undefined ? Number(stepStr) : 1;
    if (!Number.isInteger(step) || step <= 0) return null;

    if (rangePart === '*') {
      for (let v = min; v <= max; v += step) result.add(v);
    } else if (rangePart.includes('-')) {
      const [startStr, endStr] = rangePart.split('-');
      const start = Number(startStr);
      const end = Number(endStr);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < min || end > max || start > end) {
        return null;
      }
      for (let v = start; v <= end; v += step) result.add(v);
    } else {
      const val = Number(rangePart);
      if (!Number.isInteger(val) || val < min || val > max) return null;
      if (stepStr !== undefined) {
        for (let v = val; v <= max; v += step) result.add(v);
      } else {
        result.add(val);
      }
    }
  }
  return result.size > 0 ? result : null;
}

export function analyzeCronExpression(
  expr: string,
  count: number = 5,
  baseDate: Date = new Date(),
  locale: Locale = DEFAULT_LOCALE
): CronAnalysis {
  const t = getFixedT(locale);
  const calcStrings = getBundle(locale).tools.engines.calculators;
  const monthNames = ['', ...calcStrings.months];
  const dowNames = calcStrings.dows;

  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      error: t('tools:engines.calculators.cronFieldsError', { count: parts.length }),
      humanReadable: '',
      nextRuns: [],
    };
  }

  const [minF, hourF, domF, monF, dowF] = parts;
  const mins = parseCronField(minF, 0, 59);
  const hours = parseCronField(hourF, 0, 23);
  const doms = parseCronField(domF, 1, 31);
  const months = parseCronField(monF, 1, 12);
  const dows = parseCronField(dowF, 0, 6);

  if (!mins || !hours || !doms || !months || !dows) {
    return {
      valid: false,
      error: calcStrings.cronSyntaxError,
      humanReadable: '',
      nextRuns: [],
    };
  }

  // Human readable summary
  const minDesc =
    minF === '*'
      ? calcStrings.cronEveryMinute
      : minF.startsWith('*/')
        ? t('tools:engines.calculators.cronEveryNMinutes', { step: minF.slice(2) })
        : t('tools:engines.calculators.cronAtMinute', { minute: minF });
  const hourDesc =
    hourF === '*'
      ? calcStrings.cronOfEveryHour
      : hourF.startsWith('*/')
        ? t('tools:engines.calculators.cronEveryNHours', { step: hourF.slice(2) })
        : t('tools:engines.calculators.cronPastHour', { hour: hourF });
  const domDesc =
    domF === '*' ? '' : t('tools:engines.calculators.cronOnDom', { dom: domF });
  const monDesc =
    monF === '*'
      ? ''
      : t('tools:engines.calculators.cronInMonths', {
          months: monF
            .split(',')
            .map((m) => monthNames[Number(m)] || m)
            .join(', '),
        });
  const dowDesc =
    dowF === '*'
      ? ''
      : t('tools:engines.calculators.cronOnlyOnDows', {
          dows: dowF
            .split(',')
            .map((d) => dowNames[Number(d)] || d)
            .join(', '),
        });

  const period = locale === 'ja' || locale === 'zh' ? '。' : '.';
  const joiner = locale === 'ja' || locale === 'zh' ? '' : ' ';
  const humanReadable = `${minDesc}${joiner}${hourDesc}${domDesc}${monDesc}${dowDesc}${period}`
    .replace(/\s+/g, ' ')
    .trim();

  // Compute next runs (minute scan capped at 1 year / 525,600 minutes)
  const nextRuns: string[] = [];
  const cursor = new Date(baseDate.getTime());
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const domWildcard = domF === '*';
  const dowWildcard = dowF === '*';

  for (let i = 0; i < 525600 && nextRuns.length < count; i++) {
    const m = cursor.getMinutes();
    const h = cursor.getHours();
    const dom = cursor.getDate();
    const mon = cursor.getMonth() + 1;
    const dow = cursor.getDay();

    const dayMatches =
      domWildcard && dowWildcard
        ? true
        : domWildcard
          ? dows.has(dow)
          : dowWildcard
            ? doms.has(dom)
            : doms.has(dom) || dows.has(dow);

    if (mins.has(m) && hours.has(h) && months.has(mon) && dayMatches) {
      nextRuns.push(cursor.toISOString());
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return { valid: true, humanReadable, nextRuns };
}

export interface TimestampAnalysis {
  valid: boolean;
  error?: string;
  epochSeconds?: number;
  epochMs?: number;
  isoUtc?: string;
  rfc2822?: string;
  relative?: string;
}

export function analyzeTimestamp(
  input: string,
  nowMs: number = Date.now(),
  locale: Locale = DEFAULT_LOCALE
): TimestampAnalysis {
  const t = getFixedT(locale);
  const calcStrings = getBundle(locale).tools.engines.calculators;
  const trimmed = input.trim();
  if (!trimmed) return { valid: false, error: calcStrings.timestampEmpty };

  let date: Date;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    const ms = Math.abs(num) < 1e11 ? num * 1000 : num;
    date = new Date(ms);
  } else {
    date = new Date(trimmed);
  }

  if (Number.isNaN(date.getTime())) {
    return { valid: false, error: calcStrings.timestampInvalid };
  }

  const diffSec = Math.round((date.getTime() - nowMs) / 1000);
  const abs = Math.abs(diffSec);
  const unit =
    abs < 60
      ? `${abs}${calcStrings.unitSec}`
      : abs < 3600
        ? `${Math.floor(abs / 60)}${calcStrings.unitMin}`
        : abs < 86400
          ? `${Math.floor(abs / 3600)}${calcStrings.unitHour}`
          : `${Math.floor(abs / 86400)}${calcStrings.unitDay}`;
  const relative =
    diffSec === 0
      ? calcStrings.justNow
      : diffSec > 0
        ? t('tools:engines.calculators.inFuture', { delta: unit })
        : t('tools:engines.calculators.pastAgo', { delta: unit });

  return {
    valid: true,
    epochSeconds: Math.floor(date.getTime() / 1000),
    epochMs: date.getTime(),
    isoUtc: date.toISOString(),
    rfc2822: date.toUTCString(),
    relative,
  };
}

export type ByteUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'KiB' | 'MiB' | 'GiB' | 'TiB';

const BYTE_MULTIPLIERS: Record<ByteUnit, number> = {
  B: 1,
  KB: 1e3,
  MB: 1e6,
  GB: 1e9,
  TB: 1e12,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
};

export function convertBytes(value: number, unit: ByteUnit): Record<ByteUnit, string> {
  const bytes = Math.max(0, value) * BYTE_MULTIPLIERS[unit];
  const entries = (Object.keys(BYTE_MULTIPLIERS) as ByteUnit[]).map((u) => {
    const val = bytes / BYTE_MULTIPLIERS[u];
    const formatted = val >= 1000 || Number.isInteger(val) ? val.toLocaleString('en-US', { maximumFractionDigits: 4 }) : val.toPrecision(5);
    return [u, formatted];
  });
  return Object.fromEntries(entries) as Record<ByteUnit, string>;
}

export interface NumberBaseResult {
  valid: boolean;
  error?: string;
  bin?: string;
  oct?: string;
  dec?: string;
  hex?: string;
}

export function convertNumberBase(
  raw: string,
  base: 2 | 8 | 10 | 16,
  locale: Locale = DEFAULT_LOCALE
): NumberBaseResult {
  const t = getFixedT(locale);
  const clean = raw.trim().replace(/^0[bBoOxX]/, '').replace(/[\s_]/g, '');
  if (!clean) return { valid: false, error: t('tools:engines.calculators.baseEmpty') };

  const validators: Record<2 | 8 | 10 | 16, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  };

  if (!validators[base].test(clean)) {
    return { valid: false, error: t('tools:engines.calculators.baseInvalid', { base }) };
  }

  const prefix = base === 2 ? '0b' : base === 8 ? '0o' : base === 16 ? '0x' : '';
  const big = BigInt(prefix + clean);

  return {
    valid: true,
    bin: big.toString(2),
    oct: big.toString(8),
    dec: big.toString(10),
    hex: big.toString(16).toUpperCase(),
  };
}
