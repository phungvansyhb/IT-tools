import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getBundle } from '@/i18n/translator';
import type { ToolId } from '@/i18n/types';

export type ToolCategorySlug =
  | 'image'
  | 'file'
  | 'text'
  | 'color'
  | 'calculators'
  | 'cheatsheets'
  | 'diagnostics';

export interface CategoryDefinition {
  slug: ToolCategorySlug;
  name: string;
  shortName?: string;
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  iconName: string;
  accentLabel?: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategorySlug;
  keywords: string[];
  bentoSpan: '4' | '6' | '8';
  featured?: boolean;
  badge?: string;
  howItWorks: string[];
  faqs: ToolFaq[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'image',
    name: 'Image Handle',
    tagline: 'Canvas conversion, compression, Data URLs & SVG optimization',
    description:
      'Convert formats, compress assets, encode Base64 Data URLs, and minify SVG vectors directly inside browser memory with zero upload latency.',
    seoTitle: 'Browser-Native Image Tools — Convert, Compress, Base64 & SVG',
    seoDescription:
      'Privacy-first image converter, compressor, Base64 encoder, and SVG optimizer running 100% locally via HTML5 Canvas.',
    iconName: 'Image',
  },
  {
    slug: 'file',
    name: 'File Handle',
    tagline: 'JSON/YAML/CSV transforms, SHA checksums, Magic Bytes & Diff',
    description:
      'Transform structured payloads, verify SHA-1/256/384/512 checksums via Web Crypto, inspect binary magic bytes, and diff files side-by-side.',
    seoTitle: 'Developer File Tools — JSON/YAML/CSV, SHA-256, Magic Bytes & Diff',
    seoDescription:
      'Convert JSON, YAML, and CSV, calculate Web Crypto file hashes, inspect MIME magic bytes, and compare text diffs locally.',
    iconName: 'FileCode2',
  },
  {
    slug: 'text',
    name: 'Text Handle',
    tagline: 'Case transforms, Regex inspector, JWT decode, IDs & encodings',
    description:
      'Convert naming conventions, debug regular expressions with capture groups, decode JWT claims, generate UUID/ULID/NanoIDs, and encode strings.',
    seoTitle: 'Developer Text Tools — Case, Regex, JWT Decoder, UUID & Base64',
    seoDescription:
      'Client-side developer text utilities: naming case converter, live regex tester, JWT payload inspector, UUID/ULID generator, and Base64/URL/HTML encoder.',
    iconName: 'Type',
  },
  {
    slug: 'color',
    name: 'Color Handle',
    tagline: 'HEX/RGB/HSL/OKLCH, WCAG contrast, tonal scales & CSS glass',
    description:
      'Convert perceptual color spaces including OKLCH, verify WCAG 2.1 AA/AAA contrast ratios, generate 50–950 tonal scales, and tune CSS glassmorphism.',
    seoTitle: 'UI Color & CSS Tools — OKLCH Converter, WCAG Contrast & Glassmorphism',
    seoDescription:
      'Convert HEX, RGB, HSL, and OKLCH colors, check WCAG contrast ratios, build 50-950 tonal palettes, and generate CSS glassmorphism Bento cards.',
    iconName: 'Palette',
  },
  {
    slug: 'calculators',
    name: 'Calculators',
    tagline: 'Chmod matrix, Cron schedules, Unix epochs, bytes & bases',
    description:
      'Compute Unix chmod octal permissions, parse 5-field cron schedules, convert epoch timestamps across timezones, and calculate IEC/SI bytes and number bases.',
    seoTitle: 'Developer Calculators — Chmod, Cron Parser, Epoch & Byte Converter',
    seoDescription:
      'Interactive chmod permissions matrix, cron expression humanizer with next runs, Unix timestamp converter, and IEC/SI byte & radix calculator.',
    iconName: 'Calculator',
  },
  {
    slug: 'cheatsheets',
    name: 'Cheatsheets',
    tagline: 'Searchable Git, HTTP status codes, Regex, Linux & Docker cards',
    description:
      'Filterable, one-click copy Bento reference sheets for Git/GitHub CLI, HTTP status codes & headers, and DevOps/Docker/Regex patterns.',
    seoTitle: 'Developer Cheatsheets — Git CLI, HTTP Status Codes, Linux & Docker',
    seoDescription:
      'Instant filterable developer cheatsheets with one-click copy and snippet pinning for Git, HTTP status codes, Linux, Docker, and Regex.',
    iconName: 'BookOpen',
  },
  {
    slug: 'diagnostics',
    name: 'Device & Network',
    shortName: 'Diagnostics',
    tagline: 'Keyboard NKRO, Microphone VU/FFT, Stereo Speaker & Speed Test',
    description:
      'Test mechanical keyboard rollover and key chatter, inspect microphone input levels locally, verify stereo speaker channels, and measure ping, jitter, download, and upload speeds.',
    seoTitle: 'Device & Network Diagnostics — Keyboard, Mic, Speaker & Speed Test',
    seoDescription:
      'Browser-native hardware diagnostics and self-hosted speed test: ANSI keyboard NKRO tester, microphone waveform/dBFS analyzer, left/right speaker tester, and ping/jitter/bandwidth monitor.',
    iconName: 'Activity',
    accentLabel: 'Hardware & Speed',
  },
];

export const TOOLS: ToolDefinition[] = [
  // 1. IMAGE HANDLE (4 tools)
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Format Converter',
    shortDescription: 'Convert PNG, JPEG, and WebP images offline via HTML5 Canvas.',
    longDescription:
      'Drop or select raster images and transcode seamlessly between PNG, JPEG, and WebP with configurable quality and instant file-size comparison.',
    category: 'image',
    keywords: ['png', 'jpg', 'jpeg', 'webp', 'convert', 'canvas', 'image format'],
    bentoSpan: '6',
    featured: true,
    howItWorks: [
      'Reads your selected image locally via FileReader / Object URL without touching any server.',
      'Draws the decoded bitmap onto an offscreen HTML5 Canvas element at full resolution.',
      'Exports the canvas buffer in PNG, JPEG, or WebP format with selectable compression quality.',
    ],
    faqs: [
      {
        question: 'Are my images uploaded to a cloud server for conversion?',
        answer: 'No. Decoding and encoding occur strictly inside your browser using the HTML5 Canvas API.',
      },
      {
        question: 'Which output formats support transparency?',
        answer: 'PNG and WebP preserve alpha transparency; JPEG fills transparent pixels with a solid background.',
      },
    ],
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor & Resizer',
    shortDescription: 'Scale dimensions and shrink file size with live byte-delta preview.',
    longDescription:
      'Resize images with aspect-ratio lock, tune lossy compression quality, and inspect exact byte savings before downloading.',
    category: 'image',
    keywords: ['compress', 'resize', 'optimize', 'shrink', 'aspect ratio', 'webp', 'jpeg'],
    bentoSpan: '6',
    featured: true,
    howItWorks: [
      'Parses natural pixel dimensions and computes proportional target width and height.',
      'Resamples the image smoothly using Canvas 2D high-quality interpolation.',
      'Compares original byte length against the compressed Blob to report exact percentage savings.',
    ],
    faqs: [
      {
        question: 'How does aspect-ratio locking work?',
        answer: 'When locked, editing either width or height automatically recalculates the other dimension proportionally.',
      },
      {
        question: 'What quality setting is best for web assets?',
        answer: 'WebP or JPEG at 0.78–0.85 quality typically achieves 60–80% size reduction with minimal visual artifacts.',
      },
    ],
  },
  {
    id: 'image-base64',
    slug: 'image-base64',
    name: 'Image to Base64 / Data URL',
    shortDescription: 'Encode images into Base64 strings, CSS url(), or HTML <img> tags.',
    longDescription:
      'Convert any image file into a ready-to-paste Data URL, raw Base64 string, CSS background snippet, or inline HTML image element.',
    category: 'image',
    keywords: ['base64', 'data url', 'data uri', 'inline image', 'css url'],
    bentoSpan: '4',
    howItWorks: [
      'Reads binary image bytes via FileReader.readAsDataURL completely inside the browser.',
      'Extracts MIME type, byte size, and Base64 payload for instant copying.',
      'Generates formatted Data URL, CSS background-image, and HTML <img> snippets.',
    ],
    faqs: [
      {
        question: 'When should I inline an image as Base64?',
        answer: 'Small icons, favicons, or email templates under ~10 KB benefit from fewer HTTP requests.',
      },
      {
        question: 'Does Base64 increase payload size?',
        answer: 'Yes, Base64 encoding adds roughly 33% size overhead compared to raw binary files.',
      },
    ],
  },
  {
    id: 'svg-optimizer',
    slug: 'svg-optimizer',
    name: 'SVG Optimizer & Viewer',
    shortDescription: 'Minify inline SVG markup, strip metadata, and preview cleanly.',
    longDescription:
      'Paste or upload SVG files to remove XML comments, redundant whitespace, and editor metadata while inspecting the rendered vector.',
    category: 'image',
    keywords: ['svg', 'minify', 'optimizer', 'vector', 'cleanup', 'preview'],
    bentoSpan: '8',
    howItWorks: [
      'Strips XML declarations, comments, editor namespaces, and superfluous whitespace.',
      'Computes exact byte reduction between the raw and minified SVG markup.',
      'Renders a live checkerboard preview alongside copyable React/JSX or HTML markup.',
    ],
    faqs: [
      {
        question: 'Is SVG optimization lossless?',
        answer: 'Yes, removing comments, metadata, and redundant whitespace preserves vector paths and rendering.',
      },
      {
        question: 'Can I preview SVGs with transparent backgrounds?',
        answer: 'Yes, the preview stage displays a subtle checkerboard surface behind your vector graphic.',
      },
    ],
  },

  // 2. FILE HANDLE (4 tools)
  {
    id: 'data-converter',
    slug: 'data-converter',
    name: 'JSON ↔ YAML ↔ CSV Converter',
    shortDescription: 'Bidirectional conversion and formatting across JSON, YAML, and CSV.',
    longDescription:
      'Transform configuration files and tabular datasets seamlessly between JSON, YAML, and RFC-4180 CSV with pretty-print formatting.',
    category: 'file',
    keywords: ['json', 'yaml', 'yml', 'csv', 'converter', 'formatter', 'parser'],
    bentoSpan: '8',
    featured: true,
    howItWorks: [
      'Parses the source JSON, YAML, or CSV text into an intermediate structured JavaScript object.',
      'Validates syntax and reports precise line/token errors if malformed.',
      'Serializes the AST cleanly into the target format with customizable indentation.',
    ],
    faqs: [
      {
        question: 'How are nested objects handled when exporting to CSV?',
        answer: 'Nested values inside array rows are safely serialized as compact JSON strings within quoted CSV cells.',
      },
      {
        question: 'Does the YAML converter support multi-line strings and booleans?',
        answer: 'Yes, it uses full YAML 1.2 compliant parsing and dumping.',
      },
    ],
  },
  {
    id: 'file-hash',
    slug: 'file-hash',
    name: 'File Hash & Checksum Calculator',
    shortDescription: 'Compute SHA-1, SHA-256, SHA-384, and SHA-512 via Web Crypto.',
    longDescription:
      'Verify downloaded binaries or hash text strings locally using hardware-accelerated browser Web Crypto digest primitives and compare expected checksums.',
    category: 'file',
    keywords: ['sha256', 'sha512', 'sha1', 'checksum', 'hash', 'integrity', 'web crypto'],
    bentoSpan: '4',
    featured: true,
    howItWorks: [
      'Reads your dropped file into an ArrayBuffer or encodes your text input as UTF-8 bytes.',
      'Invokes native `crypto.subtle.digest` across SHA-1, SHA-256, SHA-384, and SHA-512 in parallel.',
      'Compares computed hex digests against an optional expected checksum for instant match verification.',
    ],
    faqs: [
      {
        question: 'Is Web Crypto hashing fast for large files?',
        answer: 'Yes, `crypto.subtle.digest` delegates to native C++/SIMD implementations inside your browser.',
      },
      {
        question: 'Why is SHA-256 preferred over SHA-1?',
        answer: 'SHA-1 is vulnerable to collision attacks, whereas SHA-256 and SHA-512 remain cryptographically secure for integrity checks.',
      },
    ],
  },
  {
    id: 'file-inspector',
    slug: 'file-inspector',
    name: 'MIME Type & Magic Bytes Inspector',
    shortDescription: 'Identify true file formats from binary hex headers and signatures.',
    longDescription:
      'Inspect the first 32 bytes of any file in hex and ASCII to detect true MIME types regardless of misleading file extensions.',
    category: 'file',
    keywords: ['magic bytes', 'mime', 'file signature', 'hex', 'binary', 'inspector'],
    bentoSpan: '4',
    howItWorks: [
      'Reads the leading header bytes of your file using `File.slice()` and `Uint8Array`.',
      'Matches known binary signatures (PNG, JPEG, WebP, PDF, ZIP, GZIP, ELF, WASM, SQLite, MP3).',
      'Displays the formatted hexadecimal header, ASCII preview, and detected MIME type.',
    ],
    faqs: [
      {
        question: 'Why check magic bytes instead of file extensions?',
        answer: 'File extensions can be renamed or spoofed, while magic bytes identify the actual underlying binary format.',
      },
      {
        question: 'What if a file has no binary signature?',
        answer: 'The inspector evaluates UTF-8 printability and heuristics to identify SVG, JSON, or plain text files.',
      },
    ],
  },
  {
    id: 'file-diff',
    slug: 'file-diff',
    name: 'Side-by-Side File Diff Checker',
    shortDescription: 'Compare two text blocks or files with line-by-line LCS highlighting.',
    longDescription:
      'Paste original and modified configurations, code snippets, or logs to view additions, removals, and line numbers cleanly.',
    category: 'file',
    keywords: ['diff', 'compare', 'merge', 'line diff', 'patch', 'text compare'],
    bentoSpan: '8',
    howItWorks: [
      'Splits both inputs into normalized line arrays.',
      'Computes the Longest Common Subsequence (LCS) to align unchanged context lines.',
      'Highlights removed lines in muted crimson and added lines in emerald-mint with dual line numbers.',
    ],
    faqs: [
      {
        question: 'Can I load local files directly into the diff viewer?',
        answer: 'Yes, you can paste text or load local text files into either the Original or Modified pane.',
      },
      {
        question: 'Are whitespace differences preserved?',
        answer: 'Yes, every character difference on a line is flagged so subtle config edits are never missed.',
      },
    ],
  },

  // 3. TEXT HANDLE (5 tools)
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Case & Naming Convention Converter',
    shortDescription: 'Convert between camelCase, snake_case, kebab-case, PascalCase & more.',
    longDescription:
      'Transform identifiers and prose across 12 developer naming conventions simultaneously while tracking live character, word, line, and UTF-8 byte counts.',
    category: 'text',
    keywords: ['camelcase', 'snake_case', 'kebab-case', 'pascalcase', 'constant_case', 'case converter'],
    bentoSpan: '6',
    howItWorks: [
      'Tokenizes input across camelCase boundaries, underscores, hyphens, dots, and whitespace.',
      'Reconstructs 12 standard programming and prose casing formats in real time.',
      'Calculates UTF-8 byte length alongside character, word, and line metrics.',
    ],
    faqs: [
      {
        question: 'Does it split existing camelCase or snake_case inputs cleanly?',
        answer: 'Yes, word boundary detection handles mixed inputs like `apiResponse_v2URL` accurately.',
      },
      {
        question: 'Are UTF-8 byte counts accurate for emoji and non-ASCII text?',
        answer: 'Yes, byte length is measured using the native `TextEncoder` API.',
      },
    ],
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester & Match Inspector',
    shortDescription: 'Test JS regular expressions with live match highlights & capture groups.',
    longDescription:
      'Validate regular expressions against sample payloads, toggle flags (`g`, `i`, `m`, `s`, `u`), and inspect indexed capture groups.',
    category: 'text',
    keywords: ['regex', 'regexp', 'regular expression', 'capture group', 'pattern', 'match'],
    bentoSpan: '6',
    featured: true,
    howItWorks: [
      'Compiles your pattern and flag set inside a guarded `new RegExp()` block.',
      'Iterates matches safely with zero-length match protection to prevent infinite loops.',
      'Highlights matched substrings inline and lists numbered and named capture groups in a table.',
    ],
    faqs: [
      {
        question: 'Which regex engine flavor does this tester use?',
        answer: 'It runs directly on your browser JavaScript ECMAScript RegExp engine, supporting lookbehind and named groups.',
      },
      {
        question: 'How are empty matches handled?',
        answer: 'Zero-width matches advance `lastIndex` safely and cap iteration to prevent browser freezes.',
      },
    ],
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder & Header/Payload Inspector',
    shortDescription: 'Decode JSON Web Tokens locally with automatic expiry status checks.',
    longDescription:
      'Inspect JWT JOSE headers, payload claims, `iat`/`exp`/`nbf` timestamps, and signature segments without ever sending tokens over the network.',
    category: 'text',
    keywords: ['jwt', 'json web token', 'decode', 'claims', 'bearer', 'exp', 'auth'],
    bentoSpan: '6',
    featured: true,
    howItWorks: [
      'Splits the compact JWS string into header, payload, and signature segments.',
      'Decodes Base64URL UTF-8 segments into formatted JSON trees.',
      'Evaluates `exp` and `nbf` epoch claims against your local clock to display validity badges.',
    ],
    faqs: [
      {
        question: 'Is it safe to paste production JWTs here?',
        answer: 'Yes. Decoding happens 100% locally in memory; no token ever leaves your browser tab.',
      },
      {
        question: 'Does decoding verify the cryptographic signature?',
        answer: 'Decoding inspects header and payload claims; signature verification requires your server secret or public JWKS key.',
      },
    ],
  },
  {
    id: 'id-generator',
    slug: 'id-generator',
    name: 'UUID / ULID / NanoID & Token Generator',
    shortDescription: 'Generate cryptographically random UUID v4, ULID, NanoID, and tokens.',
    longDescription:
      'Produce single or batch collision-resistant identifiers and API secret tokens powered by `crypto.getRandomValues`.',
    category: 'text',
    keywords: ['uuid', 'ulid', 'nanoid', 'token', 'password', 'random', 'csprng'],
    bentoSpan: '6',
    howItWorks: [
      'Draws entropy from the browser CSPRNG (`crypto.randomUUID` / `crypto.getRandomValues`).',
      'Formats RFC 4122 v4 UUIDs, monotonic-timestamp Crockford Base32 ULIDs, or custom-length NanoIDs.',
      'Supports batch generation up to 50 identifiers at once with one-click copy.',
    ],
    faqs: [
      {
        question: 'What is the advantage of ULID over UUID v4?',
        answer: 'ULIDs embed a 48-bit millisecond timestamp prefix so they sort lexicographically in database indexes.',
      },
      {
        question: 'Are generated tokens cryptographically secure?',
        answer: 'Yes, all randomness is sourced from Web Crypto `getRandomValues`, never `Math.random()`.',
      },
    ],
  },
  {
    id: 'text-encoder',
    slug: 'text-encoder',
    name: 'Base64 / URL / HTML Encoder & Decoder',
    shortDescription: 'Encode and decode UTF-8 Base64, URL components, and HTML entities.',
    longDescription:
      'Bidirectionally transform strings using UTF-8-safe Base64, `encodeURIComponent`, and HTML entity escaping in one unified workspace.',
    category: 'text',
    keywords: ['base64', 'url encode', 'decode', 'html entities', 'escape', 'utf-8'],
    bentoSpan: '12' as unknown as '8',
    howItWorks: [
      'Converts Unicode strings cleanly to UTF-8 byte arrays before Base64 encoding so emojis never break `btoa()`.',
      'Applies RFC 3986 percent-encoding for query strings and URL parameters.',
      'Escapes `<`, `>`, `&`, `"`, and `\'` safely for HTML contexts.',
    ],
    faqs: [
      {
        question: 'Why does standard `btoa()` fail on Unicode text?',
        answer: 'Native `btoa` only accepts Latin-1 bytes; this tool encodes via `TextEncoder` first to support full UTF-8.',
      },
      {
        question: 'What is the difference between `encodeURI` and `encodeURIComponent`?',
        answer: '`encodeURIComponent` escapes reserved delimiters like `&`, `=`, and `/`, making it ideal for query parameter values.',
      },
    ],
  },

  // 4. COLOR HANDLE (4 tools)
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'HEX / RGB / HSL / OKLCH Color Converter',
    shortDescription: 'Convert colors across HEX, RGB, HSL, and perceptual OKLCH.',
    longDescription:
      'Pick or paste any color value and inspect accurate CSS representations across HEX, sRGB, HSL, and wide-gamut OKLCH color spaces.',
    category: 'color',
    keywords: ['hex', 'rgb', 'hsl', 'oklch', 'color converter', 'css color'],
    bentoSpan: '6',
    featured: true,
    howItWorks: [
      'Parses 3-digit or 6-digit HEX strings or RGB sliders into normalized sRGB channels.',
      'Transforms sRGB to cylindrical HSL and perceptual OKLab/OKLCH coordinates.',
      'Outputs ready-to-copy CSS Level 4 declarations for modern design systems.',
    ],
    faqs: [
      {
        question: 'Why use OKLCH over HSL in modern CSS?',
        answer: 'OKLCH is perceptually uniform, meaning colors with identical lightness appear equally bright to the human eye.',
      },
      {
        question: 'Are all modern browsers compatible with `oklch()`?',
        answer: 'Yes, Chrome, Safari, Firefox, and Edge all support CSS `oklch()` natively.',
      },
    ],
  },
  {
    id: 'contrast-checker',
    slug: 'contrast-checker',
    name: 'WCAG Contrast Ratio Checker',
    shortDescription: 'Test foreground/background pairs against WCAG 2.1 AA and AAA standards.',
    longDescription:
      'Verify text legibility with exact relative luminance ratios, live UI card previews, and instant AA/AAA pass-fail badges.',
    category: 'color',
    keywords: ['wcag', 'contrast', 'accessibility', 'a11y', 'aa', 'aaa', 'luminance'],
    bentoSpan: '6',
    featured: true,
    howItWorks: [
      'Linearizes sRGB channels and computes WCAG 2.1 relative luminance for both colors.',
      'Calculates the exact `(L1 + 0.05) / (L2 + 0.05)` contrast ratio.',
      'Evaluates thresholds for Normal Text (4.5:1 AA / 7:1 AAA) and Large Text (3:1 AA / 4.5:1 AAA).',
    ],
    faqs: [
      {
        question: 'What qualifies as Large Text in WCAG 2.1?',
        answer: 'Text that is at least 18pt (24px) regular or 14pt (18.67px) bold.',
      },
      {
        question: 'What is the minimum contrast ratio for body copy?',
        answer: 'WCAG AA requires at least 4.5:1 for normal body text.',
      },
    ],
  },
  {
    id: 'palette-generator',
    slug: 'palette-generator',
    name: 'Monochrome & Tonal Palette Generator',
    shortDescription: 'Generate a balanced 50–950 tonal scale with CSS variables & JSON.',
    longDescription:
      'Enter any seed color to synthesize an 11-step design system ramp (50 through 950) with automatic foreground text contrast hints.',
    category: 'color',
    keywords: ['palette', 'tonal scale', 'design tokens', 'css variables', 'shades', '50-950'],
    bentoSpan: '6',
    howItWorks: [
      'Extracts base hue and saturation from your seed color.',
      'Interpolates 11 balanced lightness stops from 97% (50) down to 9% (950).',
      'Exports clean CSS custom properties (`--color-50`..`--color-950`) or JSON token maps.',
    ],
    faqs: [
      {
        question: 'How does the generator pick dark vs light text on each swatch?',
        answer: 'Each stop computes its relative luminance and selects high-contrast `#09090B` or `#FAFAFA` labels automatically.',
      },
      {
        question: 'Can I paste the output directly into `globals.css`?',
        answer: 'Yes, the CSS Variables tab outputs valid `:root` declarations ready to copy.',
      },
    ],
  },
  {
    id: 'glass-generator',
    slug: 'glass-generator',
    name: 'CSS Glassmorphism & Bento Card Generator',
    shortDescription: 'Interactive blur, opacity, saturation & specular border CSS tuner.',
    longDescription:
      'Design frosted monochrome glass surfaces visually, preview them over dark or light canvases, and copy production-ready CSS.',
    category: 'color',
    keywords: ['glassmorphism', 'backdrop-filter', 'blur', 'bento', 'css generator', 'frosted glass'],
    bentoSpan: '6',
    howItWorks: [
      'Controls background alpha, `backdrop-filter` blur radius, saturation, and `1px` specular border opacity.',
      'Previews the glass card in real time over high-contrast ambient geometry.',
      'Outputs clean, vendor-prefixed CSS ready for Bento components.',
    ],
    faqs: [
      {
        question: 'Why combine `blur()` with `saturate()` in `backdrop-filter`?',
        answer: 'Boosting saturation slightly prevents frosted surfaces from looking muddy over muted backgrounds.',
      },
      {
        question: 'Does glassmorphism work in Light Mode too?',
        answer: 'Yes, using crisp white translucent backgrounds with subtle dark borders creates tactile depth on light canvases.',
      },
    ],
  },

  // 5. CALCULATORS (4 tools)
  {
    id: 'chmod-calculator',
    slug: 'chmod-calculator',
    name: 'Chmod Permissions Calculator',
    shortDescription: 'Interactive Unix rwx permissions matrix for octal and symbolic modes.',
    longDescription:
      'Toggle Owner, Group, and Public read/write/execute bits or enter an octal code like `0755` to generate exact `chmod` commands.',
    category: 'calculators',
    keywords: ['chmod', 'unix', 'permissions', 'octal', 'rwx', 'linux', '755', '644'],
    bentoSpan: '6',
    howItWorks: [
      'Maps Read (4), Write (2), and Execute (1) flags across Owner, Group, and Others.',
      'Synchronizes checkboxes bidirectionally with 3-digit octal (`755`) and symbolic (`rwxr-xr-x`) strings.',
      'Provides quick presets for common files (`644`), executables (`755`), and private keys (`600`).',
    ],
    faqs: [
      {
        question: 'What permissions should SSH private keys use?',
        answer: 'Private keys typically require `600` (`-rw-------`) so only the owner can read or write them.',
      },
      {
        question: 'What is the difference between `644` and `755`?',
        answer: '`755` grants execute (`x`) permission, which is required for scripts and directory traversal.',
      },
    ],
  },
  {
    id: 'cron-calculator',
    slug: 'cron-calculator',
    name: 'Cron Expression Parser & Generator',
    shortDescription: 'Translate 5-field cron schedules into plain English and next 5 runs.',
    longDescription:
      'Validate standard Unix cron expressions, pick quick presets, read human-friendly descriptions, and inspect upcoming UTC execution times.',
    category: 'calculators',
    keywords: ['cron', 'crontab', 'schedule', 'scheduler', 'next runs', 'devops'],
    bentoSpan: '6',
    featured: true,
    howItWorks: [
      'Parses 5 space-separated fields (`minute hour day-of-month month day-of-week`) including steps (`*/5`), ranges (`1-5`), and lists.',
      'Generates a clear plain-English summary of the schedule cadence.',
      'Simulates upcoming minute ticks to list the next 5 exact ISO-8601 execution timestamps.',
    ],
    faqs: [
      {
        question: 'What does `*/15 * * * *` mean?',
        answer: 'It triggers every 15 minutes (at :00, :15, :30, and :45 past every hour).',
      },
      {
        question: 'Are day-of-week values 0-indexed?',
        answer: 'Yes, `0` represents Sunday through `6` for Saturday.',
      },
    ],
  },
  {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    name: 'Unix Timestamp & ISO Date Converter',
    shortDescription: 'Convert Unix epochs (sec/ms) and ISO-8601 dates across timezones.',
    longDescription:
      'Auto-detect seconds vs milliseconds, inspect UTC, RFC-2822, relative deltas, and formatted local timezone readouts.',
    category: 'calculators',
    keywords: ['unix timestamp', 'epoch', 'iso 8601', 'date', 'timezone', 'utc'],
    bentoSpan: '6',
    howItWorks: [
      'Automatically distinguishes 10-digit Unix seconds from 13-digit milliseconds.',
      'Parses ISO-8601, RFC-2822, and natural date strings using browser `Date` and `Intl.DateTimeFormat`.',
      'Displays live epoch clock alongside UTC, Local, America/New_York, Europe/London, and Asia/Tokyo outputs.',
    ],
    faqs: [
      {
        question: 'How does auto-detection tell seconds apart from milliseconds?',
        answer: 'Numeric values under `1e11` are treated as seconds; larger values are treated as milliseconds.',
      },
      {
        question: 'What is the Year 2038 problem?',
        answer: 'Signed 32-bit Unix second integers overflow on January 19, 2038; modern 64-bit systems and JS numbers avoid this limit.',
      },
    ],
  },
  {
    id: 'unit-base-calculator',
    slug: 'unit-base-calculator',
    name: 'Byte / Bandwidth / Number Base Calculator',
    shortDescription: 'Convert SI/IEC storage units and Bin/Oct/Dec/Hex integers.',
    longDescription:
      'Calculate decimal (KB/MB/GB) vs binary (KiB/MiB/GiB) byte sizes, estimate transfer times, and convert arbitrary-size integers across radices.',
    category: 'calculators',
    keywords: ['bytes', 'kib', 'mib', 'gib', 'binary', 'hex', 'octal', 'decimal', 'radix'],
    bentoSpan: '6',
    howItWorks: [
      'Computes both base-10 SI units (`1000^n`) and base-2 IEC units (`1024^n`) simultaneously.',
      'Uses JavaScript `BigInt` for lossless Binary, Octal, Decimal, and Hexadecimal conversions beyond 53-bit limits.',
      'Estimates network transfer duration across Mbps/Gbps link speeds.',
    ],
    faqs: [
      {
        question: 'Why does a 1 TB drive show ~931 GiB in an OS?',
        answer: 'Storage manufacturers quote decimal Terabytes (`10^12` bytes), whereas operating systems often display binary Gibibytes (`2^30` bytes).',
      },
      {
        question: 'Does the number base converter handle 64-bit or 128-bit integers?',
        answer: 'Yes, `BigInt` supports arbitrarily large integers with zero precision loss.',
      },
    ],
  },

  // 6. CHEATSHEETS (3 tools)
  {
    id: 'git-cheatsheet',
    slug: 'git-cheatsheet',
    name: 'Git & GitHub CLI Cheatsheet',
    shortDescription: 'Filterable Git & `gh` commands with one-click copy and pinning.',
    longDescription:
      'Quickly locate and copy essential Git branching, interactive rebasing, reflog recovery, worktree, and GitHub CLI (`gh`) commands.',
    category: 'cheatsheets',
    keywords: ['git', 'github', 'gh cli', 'rebase', 'reflog', 'stash', 'cheatsheet'],
    bentoSpan: '4',
    featured: true,
    howItWorks: [
      'Organizes real-world Git & `gh` workflows into filterable Bento command cards.',
      'Supports instant keyword filtering across command flags and descriptions.',
      'Allows pinning frequently used commands directly into your workspace storage.',
    ],
    faqs: [
      {
        question: 'How do I undo a bad `git reset --hard`?',
        answer: 'Run `git reflog` to find the previous commit SHA and restore it with `git checkout -b recovery <sha>`.',
      },
      {
        question: 'Can I pin my most-used commands?',
        answer: 'Yes, click the pin icon on any command card to keep it highlighted across sessions.',
      },
    ],
  },
  {
    id: 'http-cheatsheet',
    slug: 'http-cheatsheet',
    name: 'HTTP Status Codes & Headers Reference',
    shortDescription: 'Searchable 1xx–5xx status codes, caching, CORS, and security headers.',
    longDescription:
      'Look up HTTP response codes, RFC semantics, Cache-Control directives, CORS preflight headers, and modern security headers.',
    category: 'cheatsheets',
    keywords: ['http', 'status codes', '404', '429', '502', 'cors', 'cache-control', 'headers'],
    bentoSpan: '4',
    howItWorks: [
      'Categorizes HTTP status codes across 1xx Informational, 2xx Success, 3xx Redirect, 4xx Client Error, and 5xx Server Error.',
      'Includes copy-ready header snippets for CORS, CSP, HSTS, and Cache-Control.',
      'Filters instantly by numeric status code, header name, or use-case.',
    ],
    faqs: [
      {
        question: 'When should an API return 401 vs 403?',
        answer: '401 Unauthorized means authentication is missing or invalid; 403 Forbidden means the authenticated caller lacks permission.',
      },
      {
        question: 'What is the difference between 301 and 308 redirects?',
        answer: 'Both are permanent redirects, but 308 guarantees the HTTP method (such as POST) is preserved.',
      },
    ],
  },
  {
    id: 'devops-cheatsheet',
    slug: 'devops-cheatsheet',
    name: 'Regex, Linux CLI & Docker Reference',
    shortDescription: 'Essential Regex tokens, Linux diagnostics, and Docker CLI commands.',
    longDescription:
      'One-click copy cheatsheet covering common Regex anchors/lookarounds, `ss`/`lsof`/`journalctl` Linux diagnostics, and Docker/Compose operations.',
    category: 'cheatsheets',
    keywords: ['docker', 'linux', 'bash', 'regex', 'lsof', 'systemd', 'devops', 'cheatsheet'],
    bentoSpan: '4',
    howItWorks: [
      'Groups practical commands into Regex Patterns, Linux Networking & Processes, and Docker/Containers.',
      'Provides single-click clipboard copy with visual confirmation.',
      'Persists pinned snippets locally or in Supabase when configured.',
    ],
    faqs: [
      {
        question: 'How do I check which process is listening on a port in Linux?',
        answer: 'Use `ss -tulpn | grep :3000` or `lsof -i :3000`.',
      },
      {
        question: 'How do I remove dangling Docker images safely?',
        answer: 'Run `docker image prune` to clean untagged layers without touching active containers.',
      },
    ],
  },

  // 7. DEVICE & NETWORK DIAGNOSTICS (4 tools)
  {
    id: 'keyboard-tester',
    slug: 'keyboard-tester',
    name: 'Keyboard Tester & NKRO Checker',
    shortDescription: 'Inspect key presses, NKRO rollover, chatter alerts & event codes.',
    longDescription:
      'Test ANSI Full-Size 104 and TKL 80 keyboards with Windows/Mac labels, simultaneous NKRO tracking, chatter/stuck-key detection, optional Capture Mode, and live KeyboardEvent inspection.',
    category: 'diagnostics',
    keywords: ['keyboard', 'keyboard tester', 'nkro', 'rollover', 'chatter', 'key test', 'ansi'],
    bentoSpan: '6',
    featured: true,
    badge: 'NKRO',
    howItWorks: [
      'Listens to hardware `keydown` and `keyup` events locally with optional Capture Mode (`Esc × 2` to unlock) to intercept browser shortcuts.',
      'Tracks active keys, tested layout coverage, maximum simultaneous NKRO presses, and sub-40ms key chatter.',
      'Displays real-time `code`, `key`, `location`, `keyCode`, modifier states, and inter-press delta timing.',
    ],
    faqs: [
      {
        question: 'How do I exit Capture Mode safely?',
        answer:
          'Press the Escape key twice rapidly (`Esc × 2`) or click the Unlock button in the toolbar to restore normal browser shortcuts.',
      },
      {
        question: 'What is key chatter and how is it detected?',
        answer:
          'Key chatter occurs when a worn mechanical switch registers unintended double presses within ~40 milliseconds of a prior keydown.',
      },
    ],
  },
  {
    id: 'mic-tester',
    slug: 'mic-tester',
    name: 'Microphone Tester & Audio Visualizer',
    shortDescription: 'Monitor live dBFS levels, waveform/FFT spectrum & local playback.',
    longDescription:
      'Verify microphone clarity locally via Web Audio API with device selection, real-time waveform and FFT spectrum plots, clipping/noise floor alerts, and up to 15-second local recording playback.',
    category: 'diagnostics',
    keywords: ['mic', 'microphone', 'audio', 'dbfs', 'waveform', 'spectrum', 'recording'],
    bentoSpan: '6',
    featured: false,
    badge: 'Web Audio',
    howItWorks: [
      'Requests local microphone access via `navigator.mediaDevices.getUserMedia` strictly inside your browser tab.',
      'Analyzes time-domain and frequency-domain frames with `AnalyserNode` to calculate RMS/Peak dBFS and classify noise floor or clipping.',
      'Supports optional `MediaRecorder` clips capped at 15 seconds for instant local playback and download without uploading audio.',
    ],
    faqs: [
      {
        question: 'Is my microphone audio ever uploaded or recorded remotely?',
        answer:
          'No. All audio streams, visualizations, and optional 15-second test recordings remain strictly in browser memory.',
      },
      {
        question: 'Why does microphone testing require HTTPS or localhost?',
        answer:
          'Browsers restrict `navigator.mediaDevices` to Secure Contexts (`https://` or `localhost`) to protect user privacy.',
      },
    ],
  },
  {
    id: 'speaker-tester',
    slug: 'speaker-tester',
    name: 'Speaker & Headphone Stereo Tester',
    shortDescription: 'Test Left/Right stereo channels, 20Hz–20kHz sweeps & safe tones.',
    longDescription:
      'Verify left/right channel wiring and speaker response using Web Audio synthesis (440Hz/1kHz tones, logarithmic 20Hz–20kHz sweep, white/pink noise, and sample chime) behind a hearing-safe limiter.',
    category: 'diagnostics',
    keywords: ['speaker', 'headphone', 'stereo', 'left right', 'frequency sweep', 'pink noise', 'audio'],
    bentoSpan: '6',
    featured: false,
    badge: 'Stereo',
    howItWorks: [
      'Routes synthesized test signals through a `ChannelMergerNode(2)` so Left, Stereo, and Right channels can be isolated cleanly.',
      'Applies a `DynamicsCompressorNode` safety limiter and starts at 35% master volume to protect hearing.',
      'Allows switching output devices on browsers supporting `AudioContext.setSinkId()`.',
    ],
    faqs: [
      {
        question: 'Why is the default master volume set to 35%?',
        answer:
          'Starting at 35% behind a built-in dynamics limiter prevents sudden loud test tones from hurting your ears or headphones.',
      },
      {
        question: 'What if output device selection is unavailable in my browser?',
        answer:
          'Some browsers (such as Safari or Firefox) do not expose `setSinkId`; playback will automatically use your system default audio output.',
      },
    ],
  },
  {
    id: 'speed-test',
    slug: 'speed-test',
    name: 'Network Speed & Latency Test',
    shortDescription: 'Measure self-hosted Ping, Jitter, Download & Upload bandwidth.',
    longDescription:
      'Benchmark connection responsiveness and throughput against same-origin endpoints using Quick or Standard profiles with live SVG throughput charts, suitability grading, and local run history.',
    category: 'diagnostics',
    keywords: ['speed test', 'ping', 'jitter', 'download', 'upload', 'bandwidth', 'latency'],
    bentoSpan: '6',
    featured: true,
    badge: 'Self-Hosted',
    howItWorks: [
      'Measures round-trip latency and jitter across sequential same-origin ping probes.',
      'Streams incompressible pseudo-random bytes via `ReadableStream` for download throughput and tracks `XMLHttpRequest.upload.onprogress` for upload speed.',
      'Grades connection readiness for Video Calls, 4K Streaming, Gaming, and Cloud Sync, saving up to 20 runs in localStorage.',
    ],
    faqs: [
      {
        question: 'Does this speed test contact third-party speed test servers?',
        answer:
          'No. All probes run strictly against same-origin `/api/speedtest/*` endpoints with zero payload retention.',
      },
      {
        question: 'What is the difference between Quick and Standard modes?',
        answer:
          'Quick mode uses lighter payloads for fast sanity checks, while Standard mode runs multi-megabyte transfers for steadier throughput averaging.',
      },
    ],
  },
];

// Normalize text-encoder bentoSpan cleanly to type '4' | '6' | '8'
TOOLS.forEach((t) => {
  if ((t.bentoSpan as string) === '12') {
    t.bentoSpan = '8';
  }
});

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getToolsByCategory(category: ToolCategorySlug): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getToolBySlug(category: string, slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.category === category && t.slug === slug);
}

export function getRelatedTools(tool: ToolDefinition, limit: number = 3): ToolDefinition[] {
  const sameCategory = TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id);
  const others = TOOLS.filter((t) => t.category !== tool.category && t.featured);
  return [...sameCategory, ...others].slice(0, limit);
}

export function localizeCategory(
  category: CategoryDefinition,
  locale: Locale = DEFAULT_LOCALE
): CategoryDefinition {
  const localized = getBundle(locale).catalog.categories[category.slug];
  if (!localized) return category;
  return {
    ...category,
    name: localized.name,
    tagline: localized.tagline,
    description: localized.description,
    seoTitle: localized.seoTitle,
    seoDescription: localized.seoDescription,
  };
}

export function localizeTool(
  tool: ToolDefinition,
  locale: Locale = DEFAULT_LOCALE
): ToolDefinition {
  const localized = getBundle(locale).catalog.tools[tool.id as ToolId];
  if (!localized) return tool;
  return {
    ...tool,
    name: localized.name,
    shortDescription: localized.shortDescription,
    longDescription: localized.longDescription,
    keywords: localized.keywords,
    howItWorks: localized.howItWorks,
    faqs: localized.faqs,
  };
}

export function getLocalizedCategories(locale: Locale = DEFAULT_LOCALE): CategoryDefinition[] {
  return CATEGORIES.map((cat) => localizeCategory(cat, locale));
}

export function getLocalizedTools(locale: Locale = DEFAULT_LOCALE): ToolDefinition[] {
  return TOOLS.map((tool) => localizeTool(tool, locale));
}

export function getLocalizedCategoryBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): CategoryDefinition | undefined {
  const cat = getCategoryBySlug(slug);
  return cat ? localizeCategory(cat, locale) : undefined;
}

export function getLocalizedToolsByCategory(
  category: ToolCategorySlug,
  locale: Locale = DEFAULT_LOCALE
): ToolDefinition[] {
  return getToolsByCategory(category).map((tool) => localizeTool(tool, locale));
}

export function getLocalizedToolBySlug(
  category: string,
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): ToolDefinition | undefined {
  const tool = getToolBySlug(category, slug);
  return tool ? localizeTool(tool, locale) : undefined;
}

export function getLocalizedRelatedTools(
  tool: ToolDefinition,
  locale: Locale = DEFAULT_LOCALE,
  limit: number = 3
): ToolDefinition[] {
  return getRelatedTools(tool, limit).map((t) => localizeTool(t, locale));
}
