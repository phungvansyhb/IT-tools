const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, no-transform',
  Pragma: 'no-cache',
  'CDN-Cache-Control': 'no-store',
} as const;

export async function onRequestGet(): Promise<Response> {
  return new Response('ok', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...NO_CACHE_HEADERS,
    },
  });
}
