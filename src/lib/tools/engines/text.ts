// Pure client-side text transformation, inspection, encoding, and ID generation engines
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getFixedT } from '@/i18n/translator';

export interface CaseConversions {
  camelCase: string;
  PascalCase: string;
  snake_case: string;
  CONSTANT_CASE: string;
  'kebab-case': string;
  'Train-Case': string;
  'dot.case': string;
  'path/case': string;
  'Title Case': string;
  'Sentence case': string;
  'lower case': string;
  'UPPER CASE': string;
}

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  bytes: number;
}

export function splitIntoWords(input: string): string[] {
  if (!input.trim()) return [];
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_\-./\\]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function convertCases(input: string): CaseConversions {
  const words = splitIntoWords(input);
  const lowerWords = words.map((w) => w.toLowerCase());
  const cap = (w: string) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '');

  const joinedSpace = lowerWords.join(' ');
  return {
    camelCase: lowerWords.map((w, i) => (i === 0 ? w : cap(w))).join(''),
    PascalCase: lowerWords.map(cap).join(''),
    snake_case: lowerWords.join('_'),
    CONSTANT_CASE: lowerWords.map((w) => w.toUpperCase()).join('_'),
    'kebab-case': lowerWords.join('-'),
    'Train-Case': lowerWords.map(cap).join('-'),
    'dot.case': lowerWords.join('.'),
    'path/case': lowerWords.join('/'),
    'Title Case': lowerWords.map(cap).join(' '),
    'Sentence case': joinedSpace ? joinedSpace.charAt(0).toUpperCase() + joinedSpace.slice(1) : '',
    'lower case': input.toLowerCase(),
    'UPPER CASE': input.toUpperCase(),
  };
}

export function getTextStats(input: string): TextStats {
  const bytes = new TextEncoder().encode(input).length;
  const trimmed = input.trim();
  return {
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, '').length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: input === '' ? 0 : input.split(/\r\n|\r|\n/).length,
    bytes,
  };
}

export interface RegexMatchDetail {
  index: number;
  end: number;
  match: string;
  groups: string[];
  namedGroups: Record<string, string>;
}

export interface RegexTestResult {
  valid: boolean;
  error?: string;
  matches: RegexMatchDetail[];
}

export function runRegexTest(
  pattern: string,
  flags: string,
  text: string,
  locale: Locale = DEFAULT_LOCALE
): RegexTestResult {
  if (!pattern) {
    return { valid: true, matches: [] };
  }
  try {
    const safeFlags = Array.from(new Set(flags.split('').filter((f) => 'gimsuyd'.includes(f)))).join('');
    const regex = new RegExp(pattern, safeFlags);
    const matches: RegexMatchDetail[] = [];

    if (safeFlags.includes('g')) {
      let m: RegExpExecArray | null;
      let guard = 0;
      while ((m = regex.exec(text)) !== null && guard < 1000) {
        guard++;
        matches.push({
          index: m.index,
          end: m.index + m[0].length,
          match: m[0],
          groups: m.slice(1).map((g) => g ?? ''),
          namedGroups: m.groups ? { ...m.groups } : {},
        });
        if (m[0].length === 0) {
          regex.lastIndex += 1;
        }
      }
    } else {
      const m = regex.exec(text);
      if (m) {
        matches.push({
          index: m.index,
          end: m.index + m[0].length,
          match: m[0],
          groups: m.slice(1).map((g) => g ?? ''),
          namedGroups: m.groups ? { ...m.groups } : {},
        });
      }
    }
    return { valid: true, matches };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : getFixedT(locale)('tools:engines.text.invalidRegex'),
      matches: [],
    };
  }
}

export interface DecodedJwt {
  valid: boolean;
  error?: string;
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signature?: string;
  status?: 'valid' | 'expired' | 'not-yet-valid' | 'no-expiry';
  expiresAt?: string;
  issuedAt?: string;
}

function base64UrlToUtf8(b64url: string): string {
  const padded = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwt(
  token: string,
  nowMs: number = Date.now(),
  locale: Locale = DEFAULT_LOCALE
): DecodedJwt {
  const t = getFixedT(locale);
  const trimmed = token.trim();
  if (!trimmed) return { valid: false, error: t('tools:engines.text.pasteJwt') };
  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return {
      valid: false,
      error: t('tools:engines.text.jwtSegmentsError', { count: parts.length }),
    };
  }

  try {
    const header = JSON.parse(base64UrlToUtf8(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(base64UrlToUtf8(parts[1])) as Record<string, unknown>;
    const signature = parts[2];

    const nowSec = Math.floor(nowMs / 1000);
    let status: DecodedJwt['status'] = 'no-expiry';
    if (typeof payload.nbf === 'number' && nowSec < payload.nbf) {
      status = 'not-yet-valid';
    } else if (typeof payload.exp === 'number') {
      status = nowSec >= payload.exp ? 'expired' : 'valid';
    }

    return {
      valid: true,
      header,
      payload,
      signature,
      status,
      expiresAt: typeof payload.exp === 'number' ? new Date(payload.exp * 1000).toISOString() : undefined,
      issuedAt: typeof payload.iat === 'number' ? new Date(payload.iat * 1000).toISOString() : undefined,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : t('tools:engines.text.jwtParseError'),
    };
  }
}

function randomBytes(length: number): Uint8Array {
  const arr = new Uint8Array(length);
  globalThis.crypto.getRandomValues(arr);
  return arr;
}

export function generateUuidV4(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function generateUlid(timeMs: number = Date.now()): string {
  let time = timeMs;
  let timeChars = '';
  for (let i = 0; i < 10; i++) {
    timeChars = CROCKFORD[time % 32] + timeChars;
    time = Math.floor(time / 32);
  }
  const rand = randomBytes(16);
  let randChars = '';
  for (let i = 0; i < 16; i++) {
    randChars += CROCKFORD[rand[i] % 32];
  }
  return timeChars + randChars;
}

const NANOID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';

export function generateNanoId(size: number = 21, alphabet: string = NANOID_ALPHABET): string {
  const len = Math.max(4, Math.min(128, size));
  const bytes = randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

export function generateSecureToken(length: number = 32, charset: 'alphanumeric' | 'hex' | 'base64url' | 'symbols' = 'alphanumeric'): string {
  const charsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    hex: '0123456789abcdef',
    base64url: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}',
  };
  return generateNanoId(length, charsets[charset]);
}

export function encodeBase64Utf8(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function decodeBase64Utf8(input: string): string {
  const clean = input.trim().replace(/-/g, '+').replace(/_/g, '/');
  const padded = clean.padEnd(Math.ceil(clean.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeHtmlEntities(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#039;/g, "'")
    .replace(/&amp;/g, '&');
}
