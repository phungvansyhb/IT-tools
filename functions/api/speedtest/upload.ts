const SPEED_TEST_MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MiB

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, no-transform',
  Pragma: 'no-cache',
  'CDN-Cache-Control': 'no-store',
} as const;

interface PagesFunctionContext {
  request: Request;
}

function validateSameOriginHeaders(origin: string | null, host: string | null): boolean {
  if (!origin) return true;
  if (!host) return false;
  try {
    const parsed = new URL(origin);
    return parsed.host.toLowerCase() === host.trim().toLowerCase();
  } catch {
    return false;
  }
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...NO_CACHE_HEADERS,
    },
  });
}

export async function onRequestPost({ request }: PagesFunctionContext): Promise<Response> {
  const isSameOrigin = validateSameOriginHeaders(
    request.headers.get('origin'),
    request.headers.get('host')
  );

  if (!isSameOrigin) {
    return jsonResponse({ ok: false, error: 'forbidden_origin' }, 403);
  }

  const contentLengthHeader = request.headers.get('content-length');
  if (contentLengthHeader !== null) {
    const declaredLength = Number(contentLengthHeader);
    if (Number.isFinite(declaredLength) && declaredLength > SPEED_TEST_MAX_UPLOAD_BYTES) {
      return jsonResponse(
        {
          ok: false,
          error: 'payload_too_large',
          maxBytes: SPEED_TEST_MAX_UPLOAD_BYTES,
        },
        413
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
            return jsonResponse(
              {
                ok: false,
                error: 'payload_too_large',
                maxBytes: SPEED_TEST_MAX_UPLOAD_BYTES,
              },
              413
            );
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  const serverDurationMs = Math.max(0, Date.now() - startMs);

  return jsonResponse(
    {
      ok: true,
      receivedBytes,
      serverDurationMs,
    },
    200
  );
}
