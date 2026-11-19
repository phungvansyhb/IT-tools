import { NextRequest, NextResponse } from 'next/server';
import {
  clampDownloadBytes,
  generateIncompressibleBytes,
} from '@/lib/tools/engines/diagnostics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, no-transform',
  Pragma: 'no-cache',
  'CDN-Cache-Control': 'no-store',
} as const;

export async function GET(request: NextRequest) {
  const bytes = clampDownloadBytes(request.nextUrl.searchParams.get('bytes'));
  const buf = generateIncompressibleBytes(bytes, Date.now() & 0xffffffff);

  return new NextResponse(Buffer.from(buf), {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(bytes),
      ...NO_CACHE_HEADERS,
    },
  });
}
