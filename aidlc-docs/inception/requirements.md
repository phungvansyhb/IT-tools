# OmniDev / IT-Tools Hub — Requirements Specification

## 1. Product Vision & Scope

OmniDev / IT-Tools Hub is a privacy-first, high-performance, SEO-optimized developer and utility tools web application built with **Next.js (App Router + TypeScript)**, a custom **Vanilla CSS Monochrome Glassmorphism + Bento Grid** design system, and an optional **Supabase** cloud sync layer with 100% client-side `localStorage` fallback.

All 24 tools across 6 categories execute **100% locally in the browser** using Web APIs (`Web Crypto API`, `HTML5 Canvas`, `FileReader`, `Intl`, `URL`, `RegExp`, and pure deterministic TypeScript engines). Sensitive developer payloads—JWTs, private images, checksum files, JSON/YAML configs—never leave the user's device.

---

## 2. Functional Requirements (FR-01 to FR-12)

| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Tool Registry & Categorization** | Maintain a typed single-source-of-truth registry of 24 tools grouped into 6 categories: `image`, `file`, `text`, `color`, `calculators`, and `cheatsheets`. | Must Have |
| **FR-02** | **Global Command Palette (`Cmd+K` / `Ctrl+K`)** | Provide an instant keyboard-accessible command palette searching across tool names, descriptions, keywords, categories, and cheatsheet commands. | Must Have |
| **FR-03** | **Bento Grid Navigation & Filtering** | Render asymmetric 12-column responsive Bento grids on the home hub and category pages, with category filter pills and featured tool highlights. | Must Have |
| **FR-04** | **Image Handle Suite (4 Tools)** | Support client-side Image Format Converter (`PNG`/`JPEG`/`WebP`), Image Compressor & Resizer with byte-delta metrics, Image to Base64/Data URL Studio, and SVG Optimizer & Live Viewer. | Must Have |
| **FR-05** | **File Handle Suite (4 Tools)** | Support bidirectional JSON ↔ YAML ↔ CSV conversion, Web Crypto File & Text Hasher (`SHA-1`/`SHA-256`/`SHA-384`/`SHA-512`), Magic Bytes & MIME Type Inspector, and Side-by-Side Line Diff Checker. | Must Have |
| **FR-06** | **Text Handle Suite (5 Tools)** | Support 10-way Case & Naming Convention Converter, Live Regex Tester with match/capture-group table, JWT Decoder with header/payload/expiry check, UUID/ULID/NanoID/Token Generator, and Base64/URL/HTML Encoder & Decoder. | Must Have |
| **FR-07** | **Color Handle Suite (4 Tools)** | Support HEX/RGB/HSL/OKLCH Converter, WCAG 2.1 AA/AAA Contrast Ratio Checker, Monochrome & Tonal Palette Generator (50–950) with CSS/JSON export, and interactive CSS Glassmorphism & Bento Card Generator. | Must Have |
| **FR-08** | **Calculators Suite (4 Tools)** | Support interactive Chmod Octal/Symbolic Matrix, Cron Expression Parser & Next-5-Runs Estimator, Unix Timestamp & Timezone Matrix Converter, and IEC/SI Byte & Number Base (`Bin`/`Oct`/`Dec`/`Hex`) Calculator. | Must Have |
| **FR-09** | **Cheatsheets Suite (3 Tools)** | Provide filterable, one-click copy Bento cards for Git & GitHub CLI, HTTP Status Codes & Headers, and Regex/Linux CLI/Docker references with snippet pinning. | Must Have |
| **FR-10** | **Favorites & Pinned Tools** | Allow users to pin/unpin favorite tools and access them from the Home Bento Hub and Favorites sidebar drawer. | Must Have |
| **FR-11** | **Saved Tool Presets & Shareable State** | Allow users to save named presets for tools and copy shareable URL state (`?state=...`) where applicable. | Should Have |
| **FR-12** | **Optional Supabase Sync + Usage Telemetry** | Support optional cloud sync for `user_favorites`, `saved_presets`, and `tool_metrics` when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured, seamlessly falling back to `localStorage`. | Should Have |

---

## 3. Non-Functional Requirements (NFR-01 to NFR-04)

| ID | Category | Requirement | Target / Verification |
| :--- | :--- | :--- | :--- |
| **NFR-01** | **SEO & Core Web Vitals** | All 6 category pages and 24 tool pages must be statically generated (`generateStaticParams`) with unique `<title>`, `<meta name="description">`, canonical URLs, OpenGraph/Twitter tags, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and Schema.org JSON-LD (`WebSite`, `CollectionPage`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`). | `npm run build` compiles all 31+ routes statically; `verify-aidlc.ts` validates schema outputs. |
| **NFR-02** | **100% Client-Side Privacy** | Zero server-side transmission of user inputs, uploaded files, JWTs, or images. All processing runs inside browser memory. | Code audit of `src/lib/tools/` and `src/components/tools/suites/` confirms zero external API calls for tool execution. |
| **NFR-03** | **Zero-Config Resilience** | The application must build, run, and persist user favorites/presets offline or without Supabase credentials configured, without throwing runtime errors or hydration mismatches. | App operates cleanly with empty `.env` using `localStorage` fallback. |
| **NFR-04** | **Accessibility & Theme Parity** | Full keyboard navigation (`Cmd/Ctrl+K`, Escape, arrow navigation in Command Palette, focus rings), WCAG AA contrast in both Dark and Light monochrome zinc glass themes, and responsive collapse at `1024px` and `640px`. | Semantic HTML (`<main>`, `<nav>`, `<aside>`, single `<h1>` per route), ARIA labels, and dual-theme CSS tokens. |
