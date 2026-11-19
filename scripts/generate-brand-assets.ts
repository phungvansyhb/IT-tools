import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function hexToRgba(hex: string, a = 255): Rgba {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b, a };
}

const COLOR_BG = hexToRgba('#09090b');
const COLOR_BORDER = hexToRgba('#27272a');
const COLOR_CHEVRON = hexToRgba('#f4f4f5');
const COLOR_CURSOR = hexToRgba('#10b981');

/**
 * Signed distance to a rounded rectangle centered at (cx, cy) with half-extents (hx, hy) and corner radius r.
 * Negative values are inside, positive values are outside.
 */
function sdRoundedBox(px: number, py: number, cx: number, cy: number, hx: number, hy: number, r: number): number {
  const qx = Math.abs(px - cx) - hx + r;
  const qy = Math.abs(py - cy) - hy + r;
  const outDist = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inDist = Math.min(Math.max(qx, qy), 0);
  return outDist + inDist - r;
}

/**
 * Distance from point P(px, py) to line segment AB(ax, ay -> bx, by).
 */
function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const denom = bax * bax + bay * bay;
  const h = denom === 0 ? 0 : Math.max(0, Math.min(1, (pax * bax + pay * bay) / denom));
  return Math.hypot(pax - bax * h, pay - bay * h);
}

interface SampleOptions {
  maskable: boolean;
}

/**
 * Samples the brand mark in normalized 64x64 coordinates (0..64).
 */
function sampleBrandPixel(u: number, v: number, opts: SampleOptions): Rgba {
  // For maskable icon: full-bleed #09090b background, glyph scaled into centered 80% safe-zone.
  // For standard icons: rounded squircle #09090b with specular border #27272a and transparent outer corners.
  let gx = u;
  let gy = v;

  if (opts.maskable) {
    // Map [0..64] so centered 80% maps the 64x64 glyph design cleanly into [6.4..57.6]
    const scale = 0.8;
    const offset = 32 * (1 - scale); // 6.4
    gx = (u - offset) / scale;
    gy = (v - offset) / scale;
  }

  // Background & outer squircle shape
  let bg: Rgba = { r: 0, g: 0, b: 0, a: 0 };
  if (opts.maskable) {
    bg = { ...COLOR_BG };
    // Subtle inner framed badge inside safe-zone for maskable depth
    const innerDist = sdRoundedBox(gx, gy, 32, 32, 28, 28, 12);
    if (innerDist <= 0 && innerDist >= -2.0) {
      bg = { ...COLOR_BORDER };
    }
  } else {
    const outerDist = sdRoundedBox(u, v, 32, 32, 30, 30, 14);
    if (outerDist > 0) {
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    // Specular rim border (~2px in 64x64 coordinate space)
    if (outerDist >= -2.2) {
      bg = { ...COLOR_BORDER };
    } else {
      bg = { ...COLOR_BG };
    }
  }

  // Glyph geometry in 64x64 canonical space:
  // Chevron `>`: (17, 21) -> (29, 32) -> (17, 43), stroke radius ~2.8 (strokeWidth 5.6)
  const strokeRadius = 2.85;
  const dSeg1 = distToSegment(gx, gy, 17, 21, 29, 32);
  const dSeg2 = distToSegment(gx, gy, 29, 32, 17, 43);
  if (Math.min(dSeg1, dSeg2) <= strokeRadius) {
    return { ...COLOR_CHEVRON };
  }

  // Emerald cursor `_`: rounded bar from x=33..48, y=40..45 (centered at (40.5, 42.5), half-extents (7.5, 2.5), r=2.0)
  const dCursor = sdRoundedBox(gx, gy, 40.5, 42.5, 7.5, 2.5, 2.0);
  if (dCursor <= 0) {
    return { ...COLOR_CURSOR };
  }

  return bg;
}

/**
 * Rasterizes an RGBA buffer of size x size using 4x4 MSAA supersampling.
 */
function rasterizeBrandIcon(size: number, opts: SampleOptions): Uint8Array {
  const buf = new Uint8Array(size * size * 4);
  const grid = 4; // 4x4 = 16 subpixel samples
  const invGrid = 1 / grid;
  const invSamples = 1 / (grid * grid);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sumA = 0;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;

      for (let sy = 0; sy < grid; sy++) {
        for (let sx = 0; sx < grid; sx++) {
          const px = x + (sx + 0.5) * invGrid;
          const py = y + (sy + 0.5) * invGrid;
          const u = (px / size) * 64;
          const v = (py / size) * 64;

          const c = sampleBrandPixel(u, v, opts);
          const alphaNorm = c.a / 255;
          sumA += c.a;
          sumR += c.r * alphaNorm;
          sumG += c.g * alphaNorm;
          sumB += c.b * alphaNorm;
        }
      }

      const avgA = sumA * invSamples;
      const outIdx = (y * size + x) * 4;
      if (avgA <= 0.001) {
        buf[outIdx] = 0;
        buf[outIdx + 1] = 0;
        buf[outIdx + 2] = 0;
        buf[outIdx + 3] = 0;
      } else {
        const avgAlphaNorm = avgA / 255;
        buf[outIdx] = Math.min(255, Math.round((sumR * invSamples) / avgAlphaNorm));
        buf[outIdx + 1] = Math.min(255, Math.round((sumG * invSamples) / avgAlphaNorm));
        buf[outIdx + 2] = Math.min(255, Math.round((sumB * invSamples) / avgAlphaNorm));
        buf[outIdx + 3] = Math.min(255, Math.round(avgA));
      }
    }
  }

  return buf;
}

// Standard IEEE 802.3 CRC-32 table for PNG chunks
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width: number, height: number, rgba: Uint8Array): Buffer {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter type 0 (None)
    const srcStart = y * stride;
    Buffer.from(rgba.buffer, rgba.byteOffset + srcStart, stride).copy(raw, rowStart + 1);
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    makePngChunk('IHDR', ihdr),
    makePngChunk('IDAT', compressed),
    makePngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function encodeMultiSizeIco(entries: Array<{ size: number; png: Buffer }>): Buffer {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirSize = 16 * count;
  const dir = Buffer.alloc(dirSize);
  let offset = 6 + dirSize;

  for (let i = 0; i < count; i++) {
    const { size, png } = entries[i];
    const base = i * 16;
    dir[base] = size >= 256 ? 0 : size;
    dir[base + 1] = size >= 256 ? 0 : size;
    dir[base + 2] = 0; // palette count
    dir[base + 3] = 0; // reserved
    dir.writeUInt16LE(1, base + 4); // color planes
    dir.writeUInt16LE(32, base + 6); // bits per pixel
    dir.writeUInt32LE(png.length, base + 8);
    dir.writeUInt32LE(offset, base + 12);
    offset += png.length;
  }

  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

function main() {
  const root = process.cwd();
  const iconsDir = path.join(root, 'public', 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });

  // Multi-size favicon.ico (16x16, 32x32, 48x48 PNG-encoded entries)
  const icoSizes = [16, 32, 48] as const;
  const icoEntries = icoSizes.map((size) => ({
    size,
    png: encodePng(size, size, rasterizeBrandIcon(size, { maskable: false })),
  }));
  const icoBuffer = encodeMultiSizeIco(icoEntries);
  const faviconPath = path.join(root, 'src', 'app', 'favicon.ico');
  fs.writeFileSync(faviconPath, icoBuffer);
  console.log(`Generated ${path.relative(root, faviconPath)} (${icoBuffer.byteLength} bytes, sizes: 16/32/48)`);

  // PWA icons
  const pngTargets = [
    { file: 'icon-192.png', size: 192, maskable: false },
    { file: 'icon-512.png', size: 512, maskable: false },
    { file: 'icon-maskable-512.png', size: 512, maskable: true },
  ] as const;

  for (const target of pngTargets) {
    const pngBuffer = encodePng(
      target.size,
      target.size,
      rasterizeBrandIcon(target.size, { maskable: target.maskable })
    );
    const outPath = path.join(iconsDir, target.file);
    fs.writeFileSync(outPath, pngBuffer);
    console.log(`Generated ${path.relative(root, outPath)} (${pngBuffer.byteLength} bytes, ${target.size}x${target.size})`);
  }
}

main();
