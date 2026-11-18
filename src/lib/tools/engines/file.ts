// Pure client-side file & structured-data engines: JSON/YAML/CSV, Magic Bytes, Line Diff, Web Crypto Hash
import { dump as dumpYaml, load as loadYaml } from 'js-yaml';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getBundle } from '@/i18n/translator';
import type { ToolsDictionary } from '@/i18n/types';

export type DataFormat = 'json' | 'yaml' | 'csv';

export function parseCsv(csvText: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    if (row.some((c) => c !== '')) rows.push(row);
  }

  if (rows.length === 0) return [];
  const headers = rows[0].map((h, idx) => h.trim() || `col_${idx + 1}`);
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] ?? '';
    });
    return obj;
  });
}

export function toCsv(data: unknown): string {
  const arr = Array.isArray(data) ? data : data && typeof data === 'object' ? [data] : [];
  if (arr.length === 0) return '';

  const keySet = new Set<string>();
  for (const item of arr) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      Object.keys(item as Record<string, unknown>).forEach((k) => keySet.add(k));
    }
  }
  const headers = Array.from(keySet);
  if (headers.length === 0) {
    return arr.map((v) => escapeCsvCell(String(v ?? ''))).join('\n');
  }

  const lines = [headers.map(escapeCsvCell).join(',')];
  for (const item of arr) {
    const rec = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    lines.push(
      headers
        .map((h) => {
          const val = rec[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return escapeCsvCell(JSON.stringify(val));
          return escapeCsvCell(String(val));
        })
        .join(',')
    );
  }
  return lines.join('\n');
}

function escapeCsvCell(val: string): string {
  if (/[",\n\r]/.test(val)) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function convertStructuredData(
  input: string,
  from: DataFormat,
  to: DataFormat,
  pretty: boolean = true,
  locale: Locale = DEFAULT_LOCALE
): { ok: true; output: string } | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { ok: true, output: '' };

  try {
    let parsed: unknown;
    if (from === 'json') {
      parsed = JSON.parse(trimmed);
    } else if (from === 'yaml') {
      parsed = loadYaml(trimmed);
    } else {
      parsed = parseCsv(trimmed);
    }

    if (to === 'json') {
      return { ok: true, output: JSON.stringify(parsed, null, pretty ? 2 : 0) };
    }
    if (to === 'yaml') {
      return {
        ok: true,
        output: dumpYaml(parsed, { indent: 2, lineWidth: 100, noRefs: true }),
      };
    }
    return { ok: true, output: toCsv(parsed) };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : getBundle(locale).tools.engines.file.conversionFailed,
    };
  }
}

export interface MagicSignatureResult {
  detectedMime: string;
  formatName: string;
  extension: string;
  confidence: 'exact' | 'heuristic';
  hexHeader: string;
  asciiPreview: string;
  byteLength: number;
}

type FileFormatKey = keyof ToolsDictionary['engines']['file']['formats'];

interface SignatureRule {
  offset?: number;
  bytes: number[];
  mime: string;
  formatKey: FileFormatKey;
  ext: string;
}

const SIGNATURES: SignatureRule[] = [
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], mime: 'image/png', formatKey: 'png', ext: 'png' },
  { bytes: [0xff, 0xd8, 0xff], mime: 'image/jpeg', formatKey: 'jpeg', ext: 'jpg' },
  { bytes: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif', formatKey: 'gif', ext: 'gif' },
  { bytes: [0x25, 0x50, 0x44, 0x46, 0x2d], mime: 'application/pdf', formatKey: 'pdf', ext: 'pdf' },
  { bytes: [0x50, 0x4b, 0x03, 0x04], mime: 'application/zip', formatKey: 'zip', ext: 'zip' },
  { bytes: [0x1f, 0x8b, 0x08], mime: 'application/gzip', formatKey: 'gzip', ext: 'gz' },
  { bytes: [0x00, 0x61, 0x73, 0x6d], mime: 'application/wasm', formatKey: 'wasm', ext: 'wasm' },
  { bytes: [0x7f, 0x45, 0x4c, 0x46], mime: 'application/x-elf', formatKey: 'elf', ext: 'elf' },
  { bytes: [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65], mime: 'application/vnd.sqlite3', formatKey: 'sqlite', ext: 'sqlite' },
  { bytes: [0x49, 0x44, 0x33], mime: 'audio/mpeg', formatKey: 'mp3', ext: 'mp3' },
  { bytes: [0x4f, 0x67, 0x67, 0x53], mime: 'audio/ogg', formatKey: 'ogg', ext: 'ogg' },
  { bytes: [0x66, 0x4c, 0x61, 0x43], mime: 'audio/flac', formatKey: 'flac', ext: 'flac' },
];

export function inspectMagicBytes(
  bytes: Uint8Array,
  locale: Locale = DEFAULT_LOCALE
): MagicSignatureResult {
  const formats = getBundle(locale).tools.engines.file.formats;
  const previewSlice = bytes.slice(0, 32);
  const hexHeader = Array.from(previewSlice, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  const asciiPreview = Array.from(previewSlice, (b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');

  // RIFF / WEBP / WAV check
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  ) {
    const tag = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (tag === 'WEBP') {
      return {
        detectedMime: 'image/webp',
        formatName: formats.webp,
        extension: 'webp',
        confidence: 'exact',
        hexHeader,
        asciiPreview,
        byteLength: bytes.length,
      };
    }
    if (tag === 'WAVE') {
      return {
        detectedMime: 'audio/wav',
        formatName: formats.wav,
        extension: 'wav',
        confidence: 'exact',
        hexHeader,
        asciiPreview,
        byteLength: bytes.length,
      };
    }
  }

  for (const sig of SIGNATURES) {
    const offset = sig.offset ?? 0;
    if (bytes.length >= offset + sig.bytes.length) {
      const matched = sig.bytes.every((val, idx) => bytes[offset + idx] === val);
      if (matched) {
        return {
          detectedMime: sig.mime,
          formatName: formats[sig.formatKey],
          extension: sig.ext,
          confidence: 'exact',
          hexHeader,
          asciiPreview,
          byteLength: bytes.length,
        };
      }
    }
  }

  // Heuristic UTF-8 / SVG / JSON check
  const sampleText = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 512)).trimStart();
  if (sampleText.startsWith('<svg') || (sampleText.startsWith('<?xml') && sampleText.includes('<svg'))) {
    return {
      detectedMime: 'image/svg+xml',
      formatName: formats.svg,
      extension: 'svg',
      confidence: 'heuristic',
      hexHeader,
      asciiPreview,
      byteLength: bytes.length,
    };
  }
  if (sampleText.startsWith('{') || sampleText.startsWith('[')) {
    return {
      detectedMime: 'application/json',
      formatName: formats.json,
      extension: 'json',
      confidence: 'heuristic',
      hexHeader,
      asciiPreview,
      byteLength: bytes.length,
    };
  }

  const printableRatio =
    previewSlice.length === 0
      ? 1
      : previewSlice.filter((b) => (b >= 32 && b <= 126) || b === 9 || b === 10 || b === 13).length / previewSlice.length;

  return {
    detectedMime: printableRatio > 0.85 ? 'text/plain' : 'application/octet-stream',
    formatName: printableRatio > 0.85 ? formats.plainText : formats.octetStream,
    extension: printableRatio > 0.85 ? 'txt' : 'bin',
    confidence: 'heuristic',
    hexHeader,
    asciiPreview,
    byteLength: bytes.length,
  };
}

export interface DiffLine {
  type: 'equal' | 'added' | 'removed';
  leftLine: number | null;
  rightLine: number | null;
  text: string;
}

export function computeLineDiff(leftText: string, rightText: string): DiffLine[] {
  const a = leftText === '' ? [] : leftText.split(/\r\n|\r|\n/);
  const b = rightText === '' ? [] : rightText.split(/\r\n|\r|\n/);
  const n = a.length;
  const m = b.length;

  // LCS dynamic programming table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ type: 'equal', leftLine: i + 1, rightLine: j + 1, text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'removed', leftLine: i + 1, rightLine: null, text: a[i] });
      i++;
    } else {
      result.push({ type: 'added', leftLine: null, rightLine: j + 1, text: b[j] });
      j++;
    }
  }
  while (i < n) {
    result.push({ type: 'removed', leftLine: i + 1, rightLine: null, text: a[i] });
    i++;
  }
  while (j < m) {
    result.push({ type: 'added', leftLine: null, rightLine: j + 1, text: b[j] });
    j++;
  }
  return result;
}

export async function computeHashes(buffer: ArrayBuffer): Promise<Record<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', string>> {
  const algos: ('SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512')[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
  const entries = await Promise.all(
    algos.map(async (algo) => {
      const digest = await globalThis.crypto.subtle.digest(algo, buffer);
      const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
      return [algo, hex] as const;
    })
  );
  return Object.fromEntries(entries) as Record<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', string>;
}
