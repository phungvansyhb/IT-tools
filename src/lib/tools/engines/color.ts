// Pure client-side color space conversion, WCAG 2.1 contrast, and tonal palette engines

export interface RgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface OklchColor {
  l: number; // 0-1
  c: number; // 0-~0.4
  h: number; // 0-360
}

export interface ColorSpaces {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  oklch: OklchColor;
  cssRgb: string;
  cssHsl: string;
  cssOklch: string;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function normalizeHex(input: string): string | null {
  const clean = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return (
      '#' +
      clean
        .split('')
        .map((c) => c + c)
        .join('')
        .toUpperCase()
    );
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return '#' + clean.toUpperCase();
  }
  return null;
}

export function hexToRgb(hex: string): RgbColor | null {
  const norm = normalizeHex(hex);
  if (!norm) return null;
  return {
    r: parseInt(norm.slice(1, 3), 16),
    g: parseInt(norm.slice(3, 5), 16),
    b: parseInt(norm.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;
  let r1 = 0,
    g1 = 0,
    b1 = 0;

  if (hn < 60) [r1, g1, b1] = [c, x, 0];
  else if (hn < 120) [r1, g1, b1] = [x, c, 0];
  else if (hn < 180) [r1, g1, b1] = [0, c, x];
  else if (hn < 240) [r1, g1, b1] = [0, x, c];
  else if (hn < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function rgbToOklch({ r, g, b }: RgbColor): OklchColor {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bOk = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const C = Math.sqrt(a * a + bOk * bOk);
  let H = (Math.atan2(bOk, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return {
    l: Number(L.toFixed(3)),
    c: Number(C.toFixed(3)),
    h: C < 0.0001 ? 0 : Number(H.toFixed(1)),
  };
}

export function getColorSpaces(hex: string): ColorSpaces | null {
  const norm = normalizeHex(hex);
  if (!norm) return null;
  const rgb = hexToRgb(norm)!;
  const hsl = rgbToHsl(rgb);
  const oklch = rgbToOklch(rgb);

  return {
    hex: norm,
    rgb,
    hsl,
    oklch,
    cssRgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    cssHsl: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
    cssOklch: `oklch(${(oklch.l * 100).toFixed(1)}% ${oklch.c} ${oklch.h})`,
  };
}

export function getRelativeLuminance(rgb: RgbColor): number {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export interface ContrastResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export function getContrastRatio(fgHex: string, bgHex: string): ContrastResult | null {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  if (!fg || !bg) return null;

  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));

  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

export interface PaletteStop {
  stop: number;
  hex: string;
  hsl: HslColor;
  textOnStop: '#09090B' | '#FAFAFA';
}

const STOP_LIGHTNESS: Record<number, number> = {
  50: 97,
  100: 93,
  200: 85,
  300: 74,
  400: 61,
  500: 48,
  600: 39,
  700: 31,
  800: 23,
  900: 15,
  950: 9,
};

export function generateTonalScale(baseHex: string): PaletteStop[] {
  const rgb = hexToRgb(baseHex) ?? { r: 16, g: 185, b: 129 };
  const baseHsl = rgbToHsl(rgb);

  return Object.entries(STOP_LIGHTNESS).map(([stopStr, targetL]) => {
    const stop = Number(stopStr);
    const satAdjust = stop <= 100 || stop >= 900 ? Math.max(0, baseHsl.s * 0.72) : baseHsl.s;
    const stopHsl: HslColor = { h: baseHsl.h, s: Math.round(satAdjust), l: targetL };
    const stopRgb = hslToRgb(stopHsl);
    const hex = rgbToHex(stopRgb);
    const lum = getRelativeLuminance(stopRgb);
    return {
      stop,
      hex,
      hsl: stopHsl,
      textOnStop: lum > 0.34 ? '#09090B' : '#FAFAFA',
    };
  });
}
