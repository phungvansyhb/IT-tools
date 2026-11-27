# TienIchDev (Tiện Ích Dev) — IT-Tools Hub

Live deployment: **[https://tien-ich-dev.pages.dev](https://tien-ich-dev.pages.dev)**

Privacy-first, SEO-optimized developer & diagnostic tools hub built with **Next.js (App Router Static Export + TypeScript)**, a custom **Vanilla CSS Monochrome Zinc Glass + Bento Grid** design system, **Cloudflare Pages Functions** for same-origin speed testing, and optional **Supabase** cloud sync with automatic `localStorage` fallback.

## Features

- **28 Browser-Native Tools across 7 Categories**:
  - **Image Handle**: Image Format Converter (`PNG`/`JPEG`/`WebP`), Image Compressor & Resizer, Image to Base64 / Data URL, SVG Optimizer & Viewer
  - **File Handle**: JSON ↔ YAML ↔ CSV Converter, Web Crypto File Hash & Checksum (`SHA-1`/`256`/`384`/`512`), MIME Type & Magic Bytes Inspector, Side-by-Side Line Diff Checker
  - **Text Handle**: 12-way Case & Naming Convention Converter, Regex Tester & Match Inspector, JWT Decoder & Claims Inspector, UUID/ULID/NanoID/Token Generator, Base64/URL/HTML Encoder & Decoder
  - **Color Handle**: HEX/RGB/HSL/OKLCH Converter, WCAG 2.1 AA/AAA Contrast Ratio Checker, 50–950 Tonal Palette Generator, CSS Glassmorphism & Bento Card Generator
  - **Calculators**: Chmod Permissions Matrix, Cron Expression Parser & Next-5-Runs Estimator, Unix Timestamp & Timezone Matrix, Byte/Bandwidth & BigInt Number Base Calculator
  - **Cheatsheets**: Git & GitHub CLI, HTTP Status Codes & Headers, Regex/Linux CLI/Docker Reference
  - **Device & Network Diagnostics**: Keyboard Tester, Microphone Tester, Speaker & Stereo Tester (35% safe gain ceiling), Self-Hosted Network Speed Test
- **4 Locales (`en`, `vi`, `ja`, `zh`)**: Full multi-language static routes with `hreflang` alternates and `sessionStorage` draft preservation across locale switches.
- **Global Command Palette (`Cmd+K` / `Ctrl+K`)**: Instant keyboard search across tools, keywords, info pages, and cheatsheet commands.
- **Zero-Config Persistence**: Pinned tools, pinned snippets, saved presets, ratings, feedback, and shareable `?state=` URLs work out of the box via `localStorage` and optionally sync with Supabase (`supabase/schema.sql`).
- **Programmatic SEO**: Static generation (`generateStaticParams`) for 164 localized routes across 4 languages, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, OpenGraph/Twitter social cards, and Schema.org JSON-LD (`WebSite`, `CollectionPage`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`).

## Getting Started

```bash
npm install
npm run dev
```

## Verification

```bash
npx tsx scripts/verify-aidlc.ts
npm run lint
npm run build
```

See `aidlc-docs/` for full AIDLC Inception, Construction, and Operations documentation.
