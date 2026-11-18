# Requirements Analysis (`requirements.md`)

- **Phase**: `INCEPTION`
- **Stage**: `Requirements Analysis`
- **Analysis Depth**: `Comprehensive`
- **Status**: `Baseline v0.1.0 + i18n Expansion (Inception Ready for Gate 1)`

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
| **`FR-13`** | **4-Locale Language Support & Fallback** | Support 4 locales: `en` (default/fallback), `vi` (Tiếng Việt), `ja` (日本語), and `zh` (Simplified Chinese `zh-Hans` / `zh-CN`) powered by lightweight `i18next` with modular typed dictionaries under `src/i18n/locales/{en,vi,ja,zh}/`. | Must Have |
| **`FR-14`** | **Always-Prefix Locale Routing & Legacy Redirects** | Serve all pages strictly under `/{locale}/...` (`en`, `vi`, `ja`, `zh`). Requests to `/` and legacy unprefixed paths (`/categories/[category]`, `/tools/[category]/[slug]`) redirect (`307`) via `Cookie (omnidev_locale) → Accept-Language → Default (en)`. | Must Have |
| **`FR-15`** | **Full 4-Tier Localization & Bilingual Search** | Localize all 4 tiers: (1) App Shell, Nav, Home Hub, Command Palette (`Cmd+K`), Common UI; (2) 6 Categories + 24 Tools SEO/UI metadata (`name`, `shortDescription`, `longDescription`, `keywords`, `howItWorks`, `faqs`); (3) 6 Tool Suites UI + pure engine messages (`cronAnalysis.humanReadable`, `timestamp.relative`, `magicResult.formatName`, errors); (4) `cheatsheets.ts` (`group`, `title`, `description`, `tags`). Preserve standard technical terms (`JWT`, `OKLCH`, `SHA-256`, `camelCase`, CLI commands, code snippets). Search in Home Hub & Command Palette matches both active locale text and canonical English keywords. | Must Have |
| **`FR-16`** | **Topbar Language Switcher & Client Persistence** | Render a compact Monochrome Zinc Glass dropdown next to the Theme Toggle in `AppShell` Topbar (visible on both Desktop and Mobile). Switching locale persists `omnidev_locale` to both `localStorage` and HTTP Cookie (`path=/; max-age=31536000; SameSite=Lax`) and preserves query strings (`?q=`, `?state=`). Client also uses `navigator.language` as detection fallback when no preference is stored. | Must Have |
| **`FR-17`** | **Temporary `sessionStorage` Input Preservation on Locale Switch** | When switching language inside an active tool workspace, synchronously snapshot current tool inputs to `sessionStorage` (`omnidev_locale_draft_{toolId}`), navigate to the target locale route, restore inputs cleanly on mount (unless URL `?state=` overrides), and immediately clear the temporary draft key. | Must Have |

---

## 3. Non-Functional Requirements (`NFR-*`)

- **`NFR-01` (SEO & Core Web Vitals)**: All 6 category pages and 24 tool pages must be statically generated (`generateStaticParams`) with unique `<title>`, `<meta name="description">`, canonical URLs, OpenGraph/Twitter tags, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and Schema.org JSON-LD (`WebSite`, `CollectionPage`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`).
- **`NFR-02` (100% Client-Side Privacy)**: Zero server-side transmission of user inputs, uploaded files, JWTs, or images. All processing runs inside browser memory (`src/lib/tools/` and `src/components/tools/suites/`).
- **`NFR-03` (Zero-Config Resilience)**: The application must build, run, and persist user favorites/presets offline or without Supabase credentials configured, without throwing runtime errors or hydration mismatches (`localStorage` fallback).
- **`NFR-04` (Accessibility & Theme Parity)**: Full keyboard navigation (`Cmd/Ctrl+K`, `Escape`, arrow navigation in Command Palette, focus rings), WCAG AA contrast in both Dark and Light monochrome zinc glass themes, semantic HTML (`<main>`, `<nav>`, `<aside>`, single `<h1>` per route), and responsive collapse at `1024px` and `640px`.
- **`NFR-05` (Multi-Locale SEO & Static Parity)**: Statically generate all `124` canonical URLs (`4` Home + `24` Category + `96` Tool pages) via `generateStaticParams()`. Emit accurate SSR `<html lang>` (`en`, `vi`, `ja`, `zh-Hans`), canonical links, bidirectional `hreflang` alternates (`en`, `vi`, `ja`, `zh-Hans`, `x-default`), OpenGraph `locale` + `alternateLocale`, localized Schema.org JSON-LD with `inLanguage`, and 124 URL entries with `alternates.languages` in `sitemap.xml`.
- **`NFR-06` (Stateless Server i18n & Hydration Parity)**: Server Components resolve translations via stateless `i18next.getFixedT(locale)` without mutating shared global singleton state during concurrent SSG builds; Client `I18nProvider` initializes synchronously from the route `locale` prop to prevent React hydration mismatches.
- **`NFR-07` (Vietnamese/CJK Typography & Mobile Topbar Fit)**: Load `Inter` and `JetBrains_Mono` with `subsets: ['latin', 'vietnamese']`, configure high-DPI system CJK font stacks via `:lang(ja)` and `:lang(zh-Hans)` without multi-megabyte CJK webfont downloads, and ensure the Topbar Language Switcher + controls fit cleanly at `375px` viewport width with zero horizontal overflow.

---

## 4. Technical Constraints (`CON-*`) & Prerequisites (`PRE-*`)

- **`CON-01`**: Built with Next.js `16.4.6` App Router, React `19.3.0`, TypeScript `5`, and Vanilla CSS (no Tailwind dependency). Must preserve the Next.js agent rules block in `AGENTS.md`.
- **`CON-02`**: Pure deterministic TypeScript engines under `src/lib/tools/engines/*` must remain Node-executable (via `tsx`) so `scripts/verify-aidlc.ts` can verify logic without a browser.
- **`CON-03`**: Use `i18next` directly (no heavy framework wrapper dependencies and no external translation SaaS). Enforce compile-time dictionary key parity against `en` TypeScript interfaces.
- **`CON-04`**: Adhere strictly to Next.js `16.4.6` App Router rules documented in `node_modules/next/dist/docs/` (verified after `npm install`, including `src/proxy.ts` vs `middleware.ts`, async `params` promises, and single-`<html>` root layout ownership).
- **`CON-05`**: **Do NOT modify `supabase/schema.sql`**. Locale state remains strictly browser/HTTP-scoped (`Cookie` + `localStorage`).
- **`CON-06`**: Pure engines under `src/lib/tools/engines/*` remain pure Node/tsx-executable functions with optional trailing `locale: Locale = 'en'` parameters; `convertBytes()` numeric output remains `'en-US'` formatted for deterministic verification and bandwidth math compatibility.
- **`PRE-01`**: Node.js 20+ and npm required for build/lint/verification. Optional Supabase project (`supabase/schema.sql`) required only when cloud sync is enabled.

---

## 5. Exclusions (`EX-*`) & Success Criteria (`SC-*`)

- **`EX-01`**: Server-side file upload/processing APIs, heavy third-party UI component libraries, and mandatory user authentication walls are explicitly out of scope for v0.1.0.
- **`EX-02`**: Cloud-persisted language profiles in Supabase, RTL layout mirroring, runtime external translation APIs, and translation of technical identifiers/acronyms/CLI commands (`JWT`, `OKLCH`, `SHA-256`, `camelCase`, `git ...`, `docker ...`) are excluded from the i18n feature scope.
- **`SC-01`**: `npm run lint`, `npx tsx scripts/verify-aidlc.ts`, and `npm run build` pass cleanly, statically generating all 31+ routes (`/` + 6 categories + 24 tools + crawler endpoints) with valid Schema.org JSON-LD and deterministic engine assertions.
- **`SC-02`**: `npm run lint`, `npx tsx scripts/verify-aidlc.ts`, and `npm run build` pass with 0 errors across all 4 locales; `verify-aidlc.ts` confirms 100% key parity across `en`/`vi`/`ja`/`zh`, localized metadata/engines, `124` sitemap URLs with `hreflang` alternates, and `accept-language` resolution; switching languages mid-tool preserves user inputs via `sessionStorage`.

---

## 6. Clarified Decisions Log

| Question / Topic | Selected Option | Impacted Requirements |
| :--- | :--- | :--- |
| **Persistence Strategy** | `localStorage`-first with optional asynchronous Supabase mirroring | `FR-10`, `FR-11`, `FR-12`, `NFR-03` |
| **Styling Architecture** | Custom Vanilla CSS Monochrome Zinc Glass + Emerald-Mint Accent + 12-col Bento Grid | `FR-03`, `NFR-04`, `CON-01` |
| **AI-DLC Governance Structure** | Standardized `AGENTS.md`, `instructions/`, and `aidlc-docs/` hierarchy | All Phases |
| **Supported Locales & Chinese Variant** | 4 locales: `en`, `vi`, `ja`, `zh` (`zh` = Simplified Chinese `zh-Hans` / `zh-CN`) | `FR-13`, `NFR-05`, `NFR-07` |
| **Fallback Locale** | English (`en`) | `FR-13`, `FR-14` |
| **Routing & SEO Strategy** | Always-Prefix (`/en/...`, `/vi/...`, `/ja/...`, `/zh/...`), SSG `generateStaticParams`, 124 sitemap URLs, `hreflang`, SSR `<html lang>`; `/` & legacy paths redirect `Cookie → Accept-Language → en` | `FR-14`, `NFR-05` |
| **4-Tier Translation Scope** | Full 4 tiers (Shell/UI, 6 Categories + 24 Tools SEO/search metadata, 6 Tool Suites + pure engine messages, Cheatsheets); keep technical terms/CLI/code untouched | `FR-15`, `CON-06`, `EX-02` |
| **Locale Persistence & Auto-Detection** | `localStorage` (`omnidev_locale`) + Cookie (`omnidev_locale`) + `Accept-Language` / `navigator.language`; no `supabase/schema.sql` edits | `FR-14`, `FR-16`, `CON-05` |
| **i18n Library** | Lightweight `i18next` with modular TS dictionaries compatible with Next.js 16 SSG, Client Components & `tsx` | `FR-13`, `NFR-06`, `CON-03` |
| **Language Switcher Placement** | Compact Topbar dropdown next to Theme Toggle in `AppShell`, visible on Desktop & Mobile | `FR-16`, `NFR-07` |
| **Tool Input Preservation** | Temporary `sessionStorage` snapshot before locale navigation, restored on mount in target locale | `FR-17` |
