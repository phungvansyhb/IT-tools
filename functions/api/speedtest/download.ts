const SPEED_TEST_MIN_BYTES = 64 * 1024; // 64 KiB
const SPEED_TEST_DEFAULT_BYTES = 512 * 1024; // 512 KiB
const SPEED_TEST_MAX_BYTES = 4 * 1024 * 1024; // 4 MiB

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, no-transform',
  Pragma: 'no-cache',
  'CDN-Cache-Control': 'no-store',
} as const;

interface PagesFunctionContext {
  request: Request;
}

function clampDownloadBytes(raw: string | null): number {
  if (raw === null || raw.trim() === '') return SPEED_TEST_DEFAULT_BYTES;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return SPEED_TEST_DEFAULT_BYTES;
  return Math.max(SPEED_TEST_MIN_BYTES, Math.min(SPEED_TEST_MAX_BYTES, Math.floor(parsed)));
}

function generateIncompressibleBytes(length: number, seed: number): Uint8Array {
  const safeLen = Math.max(0, Math.min(SPEED_TEST_MAX_BYTES, Math.floor(length)));
  const out = new Uint8Array(safeLen);
  let state = (seed >>> 0) || 0x9e3779b9;
  for (let i = 0; i < safeLen; i++) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    out[i] = state & 0xff;
  }
  return out;
}

export async function onRequestGet({ request }: PagesFunctionContext): Promise<Response> {
  const url = new URL(request.url);
  const bytes = clampDownloadBytes(url.searchParams.get('bytes'));
  const payload = generateIncompressibleBytes(bytes, Date.now() & 0xffffffff);
  const body = new Uint8Array(payload).buffer;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(bytes),
      ...NO_CACHE_HEADERS,
    },
  });
}
