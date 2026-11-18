// Pure client-side SVG optimizer and byte formatting helpers

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

export interface SvgOptimizeResult {
  optimized: string;
  originalBytes: number;
  optimizedBytes: number;
  savedPercent: number;
}

export function optimizeSvgMarkup(rawSvg: string): SvgOptimizeResult {
  const originalBytes = new TextEncoder().encode(rawSvg).length;
  let cleaned = rawSvg
    // Remove XML prolog & DOCTYPE
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    // Remove HTML/XML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove metadata, title, desc editor tags if empty or standard editor bloat
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    // Remove common editor namespace attributes (inkscape, sodipodi, sketch)
    .replace(/\s+(?:inkscape|sodipodi|sketch):[a-zA-Z0-9_-]+="[^"]*"/g, '')
    // Collapse whitespace between tags
    .replace(/>\s+</g, '><')
    // Collapse multiple spaces inside attributes/text
    .replace(/\s{2,}/g, ' ')
    // Clean space before self-closing />
    .replace(/\s+\/>/g, '/>')
    .trim();

  // Strip unused xmlns declarations
  if (!cleaned.includes('xlink:')) {
    cleaned = cleaned.replace(/\s+xmlns:xlink="[^"]*"/g, '');
  }

  const optimizedBytes = new TextEncoder().encode(cleaned).length;
  const savedPercent =
    originalBytes > 0 ? Math.max(0, Number((((originalBytes - optimizedBytes) / originalBytes) * 100).toFixed(1))) : 0;

  return {
    optimized: cleaned,
    originalBytes,
    optimizedBytes,
    savedPercent,
  };
}
