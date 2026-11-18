# Requirements Analysis (`requirements.md`)

- **Phase**: `INCEPTION`
- **Stage**: `Requirements Analysis`
- **Analysis Depth**: `Comprehensive`
- **Status**: `Validated Baseline (v0.1.0)`

---

## 1. Product Vision & Scope

OmniDev / IT-Tools Hub is a privacy-first, high-performance, SEO-optimized developer and utility tools web application built with **Next.js (App Router + TypeScript)**, a custom **Vanilla CSS Monochrome Zinc Glass + Bento Grid** design system, and an optional **Supabase** cloud sync layer with 100% client-side `localStorage` fallback.

All 24 tools across 6 categories execute **100% locally in the browser** using Web APIs (`Web Crypto API`, `HTML5 Canvas`, `FileReader`, `Intl`, `URL`, `RegExp`, and pure deterministic TypeScript engines). Sensitive developer payloads—JWTs, private images, checksum files, JSON/YAML configs—never leave the user's device.

---

## 2. Functional Requirements (`FR-*`)

| ID | Title | Description | Priority |
| :--- | :--- | :--- | :--- |
| **`FR-01`** | **Tool Registry & Categorization** | Maintain a typed single-source-of-truth registry (`src/lib/tools/registry.ts`) of 24 tools grouped into 6 categories: `image`, `file`, `text`, `color`, `calculators`, and `cheatsheets`. | Must Have |
| **`FR-02`** | **Global Command Palette (`Cmd+K` / `Ctrl+K`)** | Provide an instant keyboard-accessible command palette searching across tool names, descriptions, keywords, categories, and cheatsheet commands. | Must Have |
| **`FR-03`** | **Bento Grid Navigation & Filtering** | Render asymmetric 12-column responsive Bento grids on the home hub and category pages, with category filter pills and featured tool highlights. | Must Have |
| **`FR-04`** | **Image Handle Suite (4 Tools)** | Support client-side Image Format Converter (`PNG`/`JPEG`/`WebP`), Image Compressor & Resizer with byte-delta metrics, Image to Base64/Data URL Studio, and SVG Optimizer & Live Viewer. | Must Have |
| **`FR-05`** | **File Handle Suite (4 Tools)** | Support bidirectional JSON ↔ YAML ↔ CSV conversion, Web Crypto File & Text Hasher (`SHA-1`/`SHA-256`/`SHA-384`/`SHA-512`), Magic Bytes & MIME Type Inspector, and Side-by-Side Line Diff Checker. | Must Have |
| **`FR-06`** | **Text Handle Suite (5 Tools)** | Support 12-way Case & Naming Convention Converter, Live Regex Tester with match/capture-group table, JWT Decoder with header/payload/expiry check, UUID/ULID/NanoID/Token Generator, and Base64/URL/HTML Encoder & Decoder. | Must Have |
| **`FR-07`** | **Color Handle Suite (4 Tools)** | Support HEX/RGB/HSL/OKLCH Converter, WCAG 2.1 AA/AAA Contrast Ratio Checker, Monochrome & Tonal Palette Generator (50–950) with CSS/JSON export, and interactive CSS Glassmorphism & Bento Card Generator. | Must Have |
| **`FR-08`** | **Calculators Suite (4 Tools)** | Support interactive Chmod Octal/Symbolic Matrix, Cron Expression Parser & Next-5-Runs Estimator, Unix Timestamp & Timezone Matrix Converter, and IEC/SI Byte & Number Base (`Bin`/`Oct`/`Dec`/`Hex`) Calculator. | Must Have |
| **`FR-09`** | **Cheatsheets Suite (3 Tools)** | Provide filterable, one-click copy Bento cards for Git & GitHub CLI, HTTP Status Codes & Headers, and Regex/Linux CLI/Docker references with snippet pinning. | Must Have |
| **`FR-10`** | **Favorites & Pinned Tools** | Allow users to pin/unpin favorite tools and access them from the Home Bento Hub and Favorites sidebar drawer. | Must Have |
| **`FR-11`** | **Saved Tool Presets & Shareable State** | Allow users to save named presets for tools and copy shareable URL state (`?state=...`) where applicable. | Should Have |
| **`FR-12`** | **Optional Supabase Sync + Usage Telemetry** | Support optional cloud sync for `user_favorites`, `saved_presets`, and `tool_metrics` when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured, seamlessly falling back to `localStorage`. | Should Have |

---

## 3. Non-Functional Requirements (`NFR-*`)

- **`NFR-01` (SEO & Core Web Vitals)**: All 6 category pages and 24 tool pages must be statically generated (`generateStaticParams`) with unique `<title>`, `<meta name="description">`, canonical URLs, OpenGraph/Twitter tags, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and Schema.org JSON-LD (`WebSite`, `CollectionPage`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`).
- **`NFR-02` (100% Client-Side Privacy)**: Zero server-side transmission of user inputs, uploaded files, JWTs, or images. All processing runs inside browser memory (`src/lib/tools/` and `src/components/tools/suites/`).
- **`NFR-03` (Zero-Config Resilience)**: The application must build, run, and persist user favorites/presets offline or without Supabase credentials configured, without throwing runtime errors or hydration mismatches (`localStorage` fallback).
- **`NFR-04` (Accessibility & Theme Parity)**: Full keyboard navigation (`Cmd/Ctrl+K`, `Escape`, arrow navigation in Command Palette, focus rings), WCAG AA contrast in both Dark and Light monochrome zinc glass themes, semantic HTML (`<main>`, `<nav>`, `<aside>`, single `<h1>` per route), and responsive collapse at `1024px` and `640px`.

---

## 4. Technical Constraints (`CON-*`) & Prerequisites (`PRE-*`)

- **`CON-01`**: Built with Next.js `16.4.6` App Router, React `19.3.0`, TypeScript `5`, and Vanilla CSS (no Tailwind dependency). Must preserve the Next.js agent rules block in `AGENTS.md`.
- **`CON-02`**: Pure deterministic TypeScript engines under `src/lib/tools/engines/*` must remain Node-executable (via `tsx`) so `scripts/verify-aidlc.ts` can verify logic without a browser.
- **`PRE-01`**: Node.js 20+ and npm required for build/lint/verification. Optional Supabase project (`supabase/schema.sql`) required only when cloud sync is enabled.

---

## 5. Exclusions (`EX-*`) & Success Criteria (`SC-*`)

- **`EX-01`**: Server-side file upload/processing APIs, heavy third-party UI component libraries, and mandatory user authentication walls are explicitly out of scope for v0.1.0.
- **`SC-01`**: `npm run lint`, `npx tsx scripts/verify-aidlc.ts`, and `npm run build` pass cleanly, statically generating all 31+ routes (`/` + 6 categories + 24 tools + crawler endpoints) with valid Schema.org JSON-LD and deterministic engine assertions.

---

## 6. Clarified Decisions Log

| Question / Topic | Selected Option | Impacted Requirements |
| :--- | :--- | :--- |
| **Persistence Strategy** | `localStorage`-first with optional asynchronous Supabase mirroring | `FR-10`, `FR-11`, `FR-12`, `NFR-03` |
| **Styling Architecture** | Custom Vanilla CSS Monochrome Zinc Glass + Emerald-Mint Accent + 12-col Bento Grid | `FR-03`, `NFR-04`, `CON-01` |
| **AI-DLC Governance Structure** | Standardized `AGENTS.md`, `instructions/`, and `aidlc-docs/` hierarchy | All Phases |
