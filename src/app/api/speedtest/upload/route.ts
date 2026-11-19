import { NextRequest, NextResponse } from 'next/server';
import {
  SPEED_TEST_MAX_UPLOAD_BYTES,
  validateSameOriginHeaders,
} from '@/lib/tools/engines/diagnostics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, no-transform',
  Pragma: 'no-cache',
  'CDN-Cache-Control': 'no-store',
} as const;

export async function POST(request: NextRequest) {
  const isSameOrigin = validateSameOriginHeaders(
    request.headers.get('origin'),
    request.headers.get('host')
  );

  if (!isSameOrigin) {
    return NextResponse.json(
      { ok: false, error: 'forbidden_origin' },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  const contentLengthHeader = request.headers.get('content-length');
  if (contentLengthHeader !== null) {
    const declaredLength = Number(contentLengthHeader);
    if (Number.isFinite(declaredLength) && declaredLength > SPEED_TEST_MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: 'payload_too_large',
          maxBytes: SPEED_TEST_MAX_UPLOAD_BYTES,
        },
        { status: 413, headers: NO_CACHE_HEADERS }
      );
    }
  }

  const startMs = Date.now();
  let receivedBytes = 0;

  if (request.body) {
    const reader = request.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          receivedBytes += value.byteLength;
          if (receivedBytes > SPEED_TEST_MAX_UPLOAD_BYTES) {
            await reader.cancel();
            return NextResponse.json(
              {
                ok: false,
                error: 'payload_too_large',
                maxBytes: SPEED_TEST_MAX_UPLOAD_BYTES,
              },
              { status: 413, headers: NO_CACHE_HEADERS }
            );
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  const serverDurationMs = Math.max(0, Date.now() - startMs);

  return NextResponse.json(
    {
      ok: true,
      receivedBytes,
      serverDurationMs,
    },
    { status: 200, headers: NO_CACHE_HEADERS }
  );
}
