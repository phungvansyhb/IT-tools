import type { CatalogDictionary } from '../../types';

export const enCatalog: CatalogDictionary = {
  categories: {
    image: {
      name: 'Image Handle',
      tagline: 'Canvas conversion, compression, Data URLs & SVG optimization',
      description:
        'Convert formats, compress assets, encode Base64 Data URLs, and minify SVG vectors directly inside browser memory with zero upload latency.',
      seoTitle: 'Browser-Native Image Tools — Convert, Compress, Base64 & SVG',
      seoDescription:
        'Privacy-first image converter, compressor, Base64 encoder, and SVG optimizer running 100% locally via HTML5 Canvas.',
    },
    file: {
      name: 'File Handle',
      tagline: 'JSON/YAML/CSV transforms, SHA checksums, Magic Bytes & Diff',
      description:
        'Transform structured payloads, verify SHA-1/256/384/512 checksums via Web Crypto, inspect binary magic bytes, and diff files side-by-side.',
      seoTitle: 'Developer File Tools — JSON/YAML/CSV, SHA-256, Magic Bytes & Diff',
      seoDescription:
        'Convert JSON, YAML, and CSV, calculate Web Crypto file hashes, inspect MIME magic bytes, and compare text diffs locally.',
    },
    text: {
      name: 'Text Handle',
      tagline: 'Case transforms, Regex inspector, JWT decode, IDs & encodings',
      description:
        'Convert naming conventions, debug regular expressions with capture groups, decode JWT claims, generate UUID/ULID/NanoIDs, and encode strings.',
      seoTitle: 'Developer Text Tools — Case, Regex, JWT Decoder, UUID & Base64',
      seoDescription:
        'Client-side developer text utilities: naming case converter, live regex tester, JWT payload inspector, UUID/ULID generator, and Base64/URL/HTML encoder.',
    },
    color: {
      name: 'Color Handle',
      tagline: 'HEX/RGB/HSL/OKLCH, WCAG contrast, tonal scales & CSS glass',
      description:
        'Convert perceptual color spaces including OKLCH, verify WCAG 2.1 AA/AAA contrast ratios, generate 50–950 tonal scales, and tune CSS glassmorphism.',
      seoTitle: 'UI Color & CSS Tools — OKLCH Converter, WCAG Contrast & Glassmorphism',
      seoDescription:
        'Convert HEX, RGB, HSL, and OKLCH colors, check WCAG contrast ratios, build 50-950 tonal palettes, and generate CSS glassmorphism Bento cards.',
    },
    calculators: {
      name: 'Calculators',
      tagline: 'Chmod matrix, Cron schedules, Unix epochs, bytes & bases',
      description:
        'Compute Unix chmod octal permissions, parse 5-field cron schedules, convert epoch timestamps across timezones, and calculate IEC/SI bytes and number bases.',
      seoTitle: 'Developer Calculators — Chmod, Cron Parser, Epoch & Byte Converter',
      seoDescription:
        'Interactive chmod permissions matrix, cron expression humanizer with next runs, Unix timestamp converter, and IEC/SI byte & radix calculator.',
    },
    cheatsheets: {
      name: 'Cheatsheets',
      tagline: 'Searchable Git, HTTP status codes, Regex, Linux & Docker cards',
      description:
        'Filterable, one-click copy Bento reference sheets for Git/GitHub CLI, HTTP status codes & headers, and DevOps/Docker/Regex patterns.',
      seoTitle: 'Developer Cheatsheets — Git CLI, HTTP Status Codes, Linux & Docker',
      seoDescription:
        'Instant filterable developer cheatsheets with one-click copy and snippet pinning for Git, HTTP status codes, Linux, Docker, and Regex.',
    },
  },
  tools: {
    'image-converter': {
      name: 'Image Format Converter',
      shortDescription: 'Convert PNG, JPEG, and WebP images offline via HTML5 Canvas.',
      longDescription:
        'Drop or select raster images and transcode seamlessly between PNG, JPEG, and WebP with configurable quality and instant file-size comparison.',
      keywords: ['png', 'jpg', 'jpeg', 'webp', 'convert', 'canvas', 'image format'],
      howItWorks: [
        'Reads your selected image locally via FileReader / Object URL without touching any server.',
        'Draws the decoded bitmap onto an offscreen HTML5 Canvas element at full resolution.',
        'Exports the canvas buffer in PNG, JPEG, or WebP format with selectable compression quality.',
      ],
      faqs: [
        {
          question: 'Are my images uploaded to a cloud server for conversion?',
          answer:
            'No. Decoding and encoding occur strictly inside your browser using the HTML5 Canvas API.',
        },
        {
          question: 'Which output formats support transparency?',
          answer:
            'PNG and WebP preserve alpha transparency; JPEG fills transparent pixels with a solid background.',
        },
      ],
    },
    'image-compressor': {
      name: 'Image Compressor & Resizer',
      shortDescription: 'Scale dimensions and shrink file size with live byte-delta preview.',
      longDescription:
        'Resize images with aspect-ratio lock, tune lossy compression quality, and inspect exact byte savings before downloading.',
      keywords: ['compress', 'resize', 'optimize', 'shrink', 'aspect ratio', 'webp', 'jpeg'],
      howItWorks: [
        'Parses natural pixel dimensions and computes proportional target width and height.',
        'Resamples the image smoothly using Canvas 2D high-quality interpolation.',
        'Compares original byte length against the compressed Blob to report exact percentage savings.',
      ],
      faqs: [
        {
          question: 'How does aspect-ratio locking work?',
          answer:
            'When locked, editing either width or height automatically recalculates the other dimension proportionally.',
        },
        {
          question: 'What quality setting is best for web assets?',
          answer:
            'WebP or JPEG at 0.78–0.85 quality typically achieves 60–80% size reduction with minimal visual artifacts.',
        },
      ],
    },
    'image-base64': {
      name: 'Image to Base64 / Data URL',
      shortDescription: 'Encode images into Base64 strings, CSS url(), or HTML <img> tags.',
      longDescription:
        'Convert any image file into a ready-to-paste Data URL, raw Base64 string, CSS background snippet, or inline HTML image element.',
      keywords: ['base64', 'data url', 'data uri', 'inline image', 'css url'],
      howItWorks: [
        'Reads binary image bytes via FileReader.readAsDataURL completely inside the browser.',
        'Extracts MIME type, byte size, and Base64 payload for instant copying.',
        'Generates formatted Data URL, CSS background-image, and HTML <img> snippets.',
      ],
      faqs: [
        {
          question: 'When should I inline an image as Base64?',
          answer:
            'Small icons, favicons, or email templates under ~10 KB benefit from fewer HTTP requests.',
        },
        {
          question: 'Does Base64 increase payload size?',
          answer:
            'Yes, Base64 encoding adds roughly 33% size overhead compared to raw binary files.',
        },
      ],
    },
    'svg-optimizer': {
      name: 'SVG Optimizer & Viewer',
      shortDescription: 'Minify inline SVG markup, strip metadata, and preview cleanly.',
      longDescription:
        'Paste or upload SVG files to remove XML comments, redundant whitespace, and editor metadata while inspecting the rendered vector.',
      keywords: ['svg', 'minify', 'optimizer', 'vector', 'cleanup', 'preview'],
      howItWorks: [
        'Strips XML declarations, comments, editor namespaces, and superfluous whitespace.',
        'Computes exact byte reduction between the raw and minified SVG markup.',
        'Renders a live checkerboard preview alongside copyable React/JSX or HTML markup.',
      ],
      faqs: [
        {
          question: 'Is SVG optimization lossless?',
          answer:
            'Yes, removing comments, metadata, and redundant whitespace preserves vector paths and rendering.',
        },
        {
          question: 'Can I preview SVGs with transparent backgrounds?',
          answer:
            'Yes, the preview stage displays a subtle checkerboard surface behind your vector graphic.',
        },
      ],
    },
    'data-converter': {
      name: 'JSON ↔ YAML ↔ CSV Converter',
      shortDescription: 'Bidirectional conversion and formatting across JSON, YAML, and CSV.',
      longDescription:
        'Transform configuration files and tabular datasets seamlessly between JSON, YAML, and RFC-4180 CSV with pretty-print formatting.',
      keywords: ['json', 'yaml', 'yml', 'csv', 'converter', 'formatter', 'parser'],
      howItWorks: [
        'Parses the source JSON, YAML, or CSV text into an intermediate structured JavaScript object.',
        'Validates syntax and reports precise line/token errors if malformed.',
        'Serializes the AST cleanly into the target format with customizable indentation.',
      ],
      faqs: [
        {
          question: 'How are nested objects handled when exporting to CSV?',
          answer:
            'Nested values inside array rows are safely serialized as compact JSON strings within quoted CSV cells.',
        },
        {
          question: 'Does the YAML converter support multi-line strings and booleans?',
          answer: 'Yes, it uses full YAML 1.2 compliant parsing and dumping.',
        },
      ],
    },
    'file-hash': {
      name: 'File Hash & Checksum Calculator',
      shortDescription: 'Compute SHA-1, SHA-256, SHA-384, and SHA-512 via Web Crypto.',
      longDescription:
        'Verify downloaded binaries or hash text strings locally using hardware-accelerated browser Web Crypto digest primitives and compare expected checksums.',
      keywords: ['sha256', 'sha512', 'sha1', 'checksum', 'hash', 'integrity', 'web crypto'],
      howItWorks: [
        'Reads your dropped file into an ArrayBuffer or encodes your text input as UTF-8 bytes.',
        'Invokes native `crypto.subtle.digest` across SHA-1, SHA-256, SHA-384, and SHA-512 in parallel.',
        'Compares computed hex digests against an optional expected checksum for instant match verification.',
      ],
      faqs: [
        {
          question: 'Is Web Crypto hashing fast for large files?',
          answer:
            'Yes, `crypto.subtle.digest` delegates to native C++/SIMD implementations inside your browser.',
        },
        {
          question: 'Why is SHA-256 preferred over SHA-1?',
          answer:
            'SHA-1 is vulnerable to collision attacks, whereas SHA-256 and SHA-512 remain cryptographically secure for integrity checks.',
        },
      ],
    },
    'file-inspector': {
      name: 'MIME Type & Magic Bytes Inspector',
      shortDescription: 'Identify true file formats from binary hex headers and signatures.',
      longDescription:
        'Inspect the first 32 bytes of any file in hex and ASCII to detect true MIME types regardless of misleading file extensions.',
      keywords: ['magic bytes', 'mime', 'file signature', 'hex', 'binary', 'inspector'],
      howItWorks: [
        'Reads the leading header bytes of your file using `File.slice()` and `Uint8Array`.',
        'Matches known binary signatures (PNG, JPEG, WebP, PDF, ZIP, GZIP, ELF, WASM, SQLite, MP3).',
        'Displays the formatted hexadecimal header, ASCII preview, and detected MIME type.',
      ],
      faqs: [
        {
          question: 'Why check magic bytes instead of file extensions?',
          answer:
            'File extensions can be renamed or spoofed, while magic bytes identify the actual underlying binary format.',
        },
        {
          question: 'What if a file has no binary signature?',
          answer:
            'The inspector evaluates UTF-8 printability and heuristics to identify SVG, JSON, or plain text files.',
        },
      ],
    },
    'file-diff': {
      name: 'Side-by-Side File Diff Checker',
      shortDescription: 'Compare two text blocks or files with line-by-line LCS highlighting.',
      longDescription:
        'Paste original and modified configurations, code snippets, or logs to view additions, removals, and line numbers cleanly.',
      keywords: ['diff', 'compare', 'merge', 'line diff', 'patch', 'text compare'],
      howItWorks: [
        'Splits both inputs into normalized line arrays.',
        'Computes the Longest Common Subsequence (LCS) to align unchanged context lines.',
        'Highlights removed lines in muted crimson and added lines in emerald-mint with dual line numbers.',
      ],
      faqs: [
        {
          question: 'Can I load local files directly into the diff viewer?',
          answer:
            'Yes, you can paste text or load local text files into either the Original or Modified pane.',
        },
        {
          question: 'Are whitespace differences preserved?',
          answer:
            'Yes, every character difference on a line is flagged so subtle config edits are never missed.',
        },
      ],
    },
    'case-converter': {
      name: 'Case & Naming Convention Converter',
      shortDescription: 'Convert between camelCase, snake_case, kebab-case, PascalCase & more.',
      longDescription:
        'Transform identifiers and prose across 12 developer naming conventions simultaneously while tracking live character, word, line, and UTF-8 byte counts.',
      keywords: [
        'camelcase',
        'snake_case',
        'kebab-case',
        'pascalcase',
        'constant_case',
        'case converter',
      ],
      howItWorks: [
        'Tokenizes input across camelCase boundaries, underscores, hyphens, dots, and whitespace.',
        'Reconstructs 12 standard programming and prose casing formats in real time.',
        'Calculates UTF-8 byte length alongside character, word, and line metrics.',
      ],
      faqs: [
        {
          question: 'Does it split existing camelCase or snake_case inputs cleanly?',
          answer:
            'Yes, word boundary detection handles mixed inputs like `apiResponse_v2URL` accurately.',
        },
        {
          question: 'Are UTF-8 byte counts accurate for emoji and non-ASCII text?',
          answer: 'Yes, byte length is measured using the native `TextEncoder` API.',
        },
      ],
    },
    'regex-tester': {
      name: 'Regex Tester & Match Inspector',
      shortDescription: 'Test JS regular expressions with live match highlights & capture groups.',
      longDescription:
        'Validate regular expressions against sample payloads, toggle flags (`g`, `i`, `m`, `s`, `u`), and inspect indexed capture groups.',
      keywords: ['regex', 'regexp', 'regular expression', 'capture group', 'pattern', 'match'],
      howItWorks: [
        'Compiles your pattern and flag set inside a guarded `new RegExp()` block.',
        'Iterates matches safely with zero-length match protection to prevent infinite loops.',
        'Highlights matched substrings inline and lists numbered and named capture groups in a table.',
      ],
      faqs: [
        {
          question: 'Which regex engine flavor does this tester use?',
          answer:
            'It runs directly on your browser JavaScript ECMAScript RegExp engine, supporting lookbehind and named groups.',
        },
        {
          question: 'How are empty matches handled?',
          answer:
            'Zero-width matches advance `lastIndex` safely and cap iteration to prevent browser freezes.',
        },
      ],
    },
    'jwt-decoder': {
      name: 'JWT Decoder & Header/Payload Inspector',
      shortDescription: 'Decode JSON Web Tokens locally with automatic expiry status checks.',
      longDescription:
        'Inspect JWT JOSE headers, payload claims, `iat`/`exp`/`nbf` timestamps, and signature segments without ever sending tokens over the network.',
      keywords: ['jwt', 'json web token', 'decode', 'claims', 'bearer', 'exp', 'auth'],
      howItWorks: [
        'Splits the compact JWS string into header, payload, and signature segments.',
        'Decodes Base64URL UTF-8 segments into formatted JSON trees.',
        'Evaluates `exp` and `nbf` epoch claims against your local clock to display validity badges.',
      ],
      faqs: [
        {
          question: 'Is it safe to paste production JWTs here?',
          answer:
            'Yes. Decoding happens 100% locally in memory; no token ever leaves your browser tab.',
        },
        {
          question: 'Does decoding verify the cryptographic signature?',
          answer:
            'Decoding inspects header and payload claims; signature verification requires your server secret or public JWKS key.',
        },
      ],
    },
    'id-generator': {
      name: 'UUID / ULID / NanoID & Token Generator',
      shortDescription: 'Generate cryptographically random UUID v4, ULID, NanoID, and tokens.',
      longDescription:
        'Produce single or batch collision-resistant identifiers and API secret tokens powered by `crypto.getRandomValues`.',
      keywords: ['uuid', 'ulid', 'nanoid', 'token', 'password', 'random', 'csprng'],
      howItWorks: [
        'Draws entropy from the browser CSPRNG (`crypto.randomUUID` / `crypto.getRandomValues`).',
        'Formats RFC 4122 v4 UUIDs, monotonic-timestamp Crockford Base32 ULIDs, or custom-length NanoIDs.',
        'Supports batch generation up to 50 identifiers at once with one-click copy.',
      ],
      faqs: [
        {
          question: 'What is the advantage of ULID over UUID v4?',
          answer:
            'ULIDs embed a 48-bit millisecond timestamp prefix so they sort lexicographically in database indexes.',
        },
        {
          question: 'Are generated tokens cryptographically secure?',
          answer:
            'Yes, all randomness is sourced from Web Crypto `getRandomValues`, never `Math.random()`.',
        },
      ],
    },
    'text-encoder': {
      name: 'Base64 / URL / HTML Encoder & Decoder',
      shortDescription: 'Encode and decode UTF-8 Base64, URL components, and HTML entities.',
      longDescription:
        'Bidirectionally transform strings using UTF-8-safe Base64, `encodeURIComponent`, and HTML entity escaping in one unified workspace.',
      keywords: ['base64', 'url encode', 'decode', 'html entities', 'escape', 'utf-8'],
      howItWorks: [
        'Converts Unicode strings cleanly to UTF-8 byte arrays before Base64 encoding so emojis never break `btoa()`.',
        'Applies RFC 3986 percent-encoding for query strings and URL parameters.',
        'Escapes `<`, `>`, `&`, `"`, and `\'` safely for HTML contexts.',
      ],
      faqs: [
        {
          question: 'Why does standard `btoa()` fail on Unicode text?',
          answer:
            'Native `btoa` only accepts Latin-1 bytes; this tool encodes via `TextEncoder` first to support full UTF-8.',
        },
        {
          question: 'What is the difference between `encodeURI` and `encodeURIComponent`?',
          answer:
            '`encodeURIComponent` escapes reserved delimiters like `&`, `=`, and `/`, making it ideal for query parameter values.',
        },
      ],
    },
    'color-converter': {
      name: 'HEX / RGB / HSL / OKLCH Color Converter',
      shortDescription: 'Convert colors across HEX, RGB, HSL, and perceptual OKLCH.',
      longDescription:
        'Pick or paste any color value and inspect accurate CSS representations across HEX, sRGB, HSL, and wide-gamut OKLCH color spaces.',
      keywords: ['hex', 'rgb', 'hsl', 'oklch', 'color converter', 'css color'],
      howItWorks: [
        'Parses 3-digit or 6-digit HEX strings or RGB sliders into normalized sRGB channels.',
        'Transforms sRGB to cylindrical HSL and perceptual OKLab/OKLCH coordinates.',
        'Outputs ready-to-copy CSS Level 4 declarations for modern design systems.',
      ],
      faqs: [
        {
          question: 'Why use OKLCH over HSL in modern CSS?',
          answer:
            'OKLCH is perceptually uniform, meaning colors with identical lightness appear equally bright to the human eye.',
        },
        {
          question: 'Are all modern browsers compatible with `oklch()`?',
          answer: 'Yes, Chrome, Safari, Firefox, and Edge all support CSS `oklch()` natively.',
        },
      ],
    },
    'contrast-checker': {
      name: 'WCAG Contrast Ratio Checker',
      shortDescription: 'Test foreground/background pairs against WCAG 2.1 AA and AAA standards.',
      longDescription:
        'Verify text legibility with exact relative luminance ratios, live UI card previews, and instant AA/AAA pass-fail badges.',
      keywords: ['wcag', 'contrast', 'accessibility', 'a11y', 'aa', 'aaa', 'luminance'],
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
    'palette-generator': {
      name: 'Monochrome & Tonal Palette Generator',
      shortDescription: 'Generate a balanced 50–950 tonal scale with CSS variables & JSON.',
      longDescription:
        'Enter any seed color to synthesize an 11-step design system ramp (50 through 950) with automatic foreground text contrast hints.',
      keywords: ['palette', 'tonal scale', 'design tokens', 'css variables', 'shades', '50-950'],
      howItWorks: [
        'Extracts base hue and saturation from your seed color.',
        'Interpolates 11 balanced lightness stops from 97% (50) down to 9% (950).',
        'Exports clean CSS custom properties (`--color-50`..`--color-950`) or JSON token maps.',
      ],
      faqs: [
        {
          question: 'How does the generator pick dark vs light text on each swatch?',
          answer:
            'Each stop computes its relative luminance and selects high-contrast `#09090B` or `#FAFAFA` labels automatically.',
        },
        {
          question: 'Can I paste the output directly into `globals.css`?',
          answer: 'Yes, the CSS Variables tab outputs valid `:root` declarations ready to copy.',
        },
      ],
    },
    'glass-generator': {
      name: 'CSS Glassmorphism & Bento Card Generator',
      shortDescription: 'Interactive blur, opacity, saturation & specular border CSS tuner.',
      longDescription:
        'Design frosted monochrome glass surfaces visually, preview them over dark or light canvases, and copy production-ready CSS.',
      keywords: [
        'glassmorphism',
        'backdrop-filter',
        'blur',
        'bento',
        'css generator',
        'frosted glass',
      ],
      howItWorks: [
        'Controls background alpha, `backdrop-filter` blur radius, saturation, and `1px` specular border opacity.',
        'Previews the glass card in real time over high-contrast ambient geometry.',
        'Outputs clean, vendor-prefixed CSS ready for Bento components.',
      ],
      faqs: [
        {
          question: 'Why combine `blur()` with `saturate()` in `backdrop-filter`?',
          answer:
            'Boosting saturation slightly prevents frosted surfaces from looking muddy over muted backgrounds.',
        },
        {
          question: 'Does glassmorphism work in Light Mode too?',
          answer:
            'Yes, using crisp white translucent backgrounds with subtle dark borders creates tactile depth on light canvases.',
        },
      ],
    },
    'chmod-calculator': {
      name: 'Chmod Permissions Calculator',
      shortDescription: 'Interactive Unix rwx permissions matrix for octal and symbolic modes.',
      longDescription:
        'Toggle Owner, Group, and Public read/write/execute bits or enter an octal code like `0755` to generate exact `chmod` commands.',
      keywords: ['chmod', 'unix', 'permissions', 'octal', 'rwx', 'linux', '755', '644'],
      howItWorks: [
        'Maps Read (4), Write (2), and Execute (1) flags across Owner, Group, and Others.',
        'Synchronizes checkboxes bidirectionally with 3-digit octal (`755`) and symbolic (`rwxr-xr-x`) strings.',
        'Provides quick presets for common files (`644`), executables (`755`), and private keys (`600`).',
      ],
      faqs: [
        {
          question: 'What permissions should SSH private keys use?',
          answer:
            'Private keys typically require `600` (`-rw-------`) so only the owner can read or write them.',
        },
        {
          question: 'What is the difference between `644` and `755`?',
          answer:
            '`755` grants execute (`x`) permission, which is required for scripts and directory traversal.',
        },
      ],
    },
    'cron-calculator': {
      name: 'Cron Expression Parser & Generator',
      shortDescription: 'Translate 5-field cron schedules into plain English and next 5 runs.',
      longDescription:
        'Validate standard Unix cron expressions, pick quick presets, read human-friendly descriptions, and inspect upcoming UTC execution times.',
      keywords: ['cron', 'crontab', 'schedule', 'scheduler', 'next runs', 'devops'],
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
    'timestamp-converter': {
      name: 'Unix Timestamp & ISO Date Converter',
      shortDescription: 'Convert Unix epochs (sec/ms) and ISO-8601 dates across timezones.',
      longDescription:
        'Auto-detect seconds vs milliseconds, inspect UTC, RFC-2822, relative deltas, and formatted local timezone readouts.',
      keywords: ['unix timestamp', 'epoch', 'iso 8601', 'date', 'timezone', 'utc'],
      howItWorks: [
        'Automatically distinguishes 10-digit Unix seconds from 13-digit milliseconds.',
        'Parses ISO-8601, RFC-2822, and natural date strings using browser `Date` and `Intl.DateTimeFormat`.',
        'Displays live epoch clock alongside UTC, Local, America/New_York, Europe/London, and Asia/Tokyo outputs.',
      ],
      faqs: [
        {
          question: 'How does auto-detection tell seconds apart from milliseconds?',
          answer:
            'Numeric values under `1e11` are treated as seconds; larger values are treated as milliseconds.',
        },
        {
          question: 'What is the Year 2038 problem?',
          answer:
            'Signed 32-bit Unix second integers overflow on January 19, 2038; modern 64-bit systems and JS numbers avoid this limit.',
        },
      ],
    },
    'unit-base-calculator': {
      name: 'Byte / Bandwidth / Number Base Calculator',
      shortDescription: 'Convert SI/IEC storage units and Bin/Oct/Dec/Hex integers.',
      longDescription:
        'Calculate decimal (KB/MB/GB) vs binary (KiB/MiB/GiB) byte sizes, estimate transfer times, and convert arbitrary-size integers across radices.',
      keywords: ['bytes', 'kib', 'mib', 'gib', 'binary', 'hex', 'octal', 'decimal', 'radix'],
      howItWorks: [
        'Computes both base-10 SI units (`1000^n`) and base-2 IEC units (`1024^n`) simultaneously.',
        'Uses JavaScript `BigInt` for lossless Binary, Octal, Decimal, and Hexadecimal conversions beyond 53-bit limits.',
        'Estimates network transfer duration across Mbps/Gbps link speeds.',
      ],
      faqs: [
        {
          question: 'Why does a 1 TB drive show ~931 GiB in an OS?',
          answer:
            'Storage manufacturers quote decimal Terabytes (`10^12` bytes), whereas operating systems often display binary Gibibytes (`2^30` bytes).',
        },
        {
          question: 'Does the number base converter handle 64-bit or 128-bit integers?',
          answer: 'Yes, `BigInt` supports arbitrarily large integers with zero precision loss.',
        },
      ],
    },
    'git-cheatsheet': {
      name: 'Git & GitHub CLI Cheatsheet',
      shortDescription: 'Filterable Git & `gh` commands with one-click copy and pinning.',
      longDescription:
        'Quickly locate and copy essential Git branching, interactive rebasing, reflog recovery, worktree, and GitHub CLI (`gh`) commands.',
      keywords: ['git', 'github', 'gh cli', 'rebase', 'reflog', 'stash', 'cheatsheet'],
      howItWorks: [
        'Organizes real-world Git & `gh` workflows into filterable Bento command cards.',
        'Supports instant keyword filtering across command flags and descriptions.',
        'Allows pinning frequently used commands directly into your workspace storage.',
      ],
      faqs: [
        {
          question: 'How do I undo a bad `git reset --hard`?',
          answer:
            'Run `git reflog` to find the previous commit SHA and restore it with `git checkout -b recovery <sha>`.',
        },
        {
          question: 'Can I pin my most-used commands?',
          answer:
            'Yes, click the pin icon on any command card to keep it highlighted across sessions.',
        },
      ],
    },
    'http-cheatsheet': {
      name: 'HTTP Status Codes & Headers Reference',
      shortDescription: 'Searchable 1xx–5xx status codes, caching, CORS, and security headers.',
      longDescription:
        'Look up HTTP response codes, RFC semantics, Cache-Control directives, CORS preflight headers, and modern security headers.',
      keywords: [
        'http',
        'status codes',
        '404',
        '429',
        '502',
        'cors',
        'cache-control',
        'headers',
      ],
      howItWorks: [
        'Categorizes HTTP status codes across 1xx Informational, 2xx Success, 3xx Redirect, 4xx Client Error, and 5xx Server Error.',
        'Includes copy-ready header snippets for CORS, CSP, HSTS, and Cache-Control.',
        'Filters instantly by numeric status code, header name, or use-case.',
      ],
      faqs: [
        {
          question: 'When should an API return 401 vs 403?',
          answer:
            '401 Unauthorized means authentication is missing or invalid; 403 Forbidden means the authenticated caller lacks permission.',
        },
        {
          question: 'What is the difference between 301 and 308 redirects?',
          answer:
            'Both are permanent redirects, but 308 guarantees the HTTP method (such as POST) is preserved.',
        },
      ],
    },
    'devops-cheatsheet': {
      name: 'Regex, Linux CLI & Docker Reference',
      shortDescription: 'Essential Regex tokens, Linux diagnostics, and Docker CLI commands.',
      longDescription:
        'One-click copy cheatsheet covering common Regex anchors/lookarounds, `ss`/`lsof`/`journalctl` Linux diagnostics, and Docker/Compose operations.',
      keywords: ['docker', 'linux', 'bash', 'regex', 'lsof', 'systemd', 'devops', 'cheatsheet'],
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
          answer:
            'Run `docker image prune` to clean untagged layers without touching active containers.',
        },
      ],
    },
  },
};
