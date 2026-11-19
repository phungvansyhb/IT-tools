# Implementation Units (`units.md`)

- **Phase**: `INCEPTION`
- **Stage**: `Units Generation`

The implementation of **OmniDev / IT-Tools Hub** is decomposed into 4 cohesive, independently verifiable **Units (Bolts)** executed in dependency order.

---

## `UNIT-01`: Design System, Theme Engine & Layout Primitives
- **Scope**:
  - Dual-theme (`dark` / `light`) Monochrome Zinc Glass + Emerald-Mint CSS design tokens, Bento grid layout system, and frosted glass surface utilities.
  - Reusable `BentoGrid`, `BentoCard`, `CopyButton`, and `ToolIcon` primitives.
  - Persistent `AppShell` (sidebar, topbar, Favorites drawer, theme toggle) and global `Cmd+K` / `Ctrl+K` `CommandPalette`.
- **Target Files**:
  - `src/app/globals.css`, `src/styles/glass.css`, `src/styles/bento.css`, `src/app/layout.tsx`
  - `src/components/bento/BentoGrid.tsx`, `src/components/bento/BentoCard.tsx`
  - `src/components/common/CopyButton.tsx`, `src/components/common/ToolIcon.tsx`
  - `src/components/layout/AppShell.tsx`, `src/components/layout/CommandPalette.tsx`
- **Dependencies**: None (Foundation Unit).
- **Verification Criteria**: `npm run lint && npm run build` passes; Dark/Light theme toggle and `1024px`/`640px` responsive breakpoints render cleanly.

---

## `UNIT-02`: Tool Registry & Programmatic SEO Engine
- **Scope**:
  - Typed single-source-of-truth registry (`CATEGORIES`: 6 categories, `TOOLS`: 24 tools with `keywords`, `howItWorks`, `faqs`).
  - Metadata and Schema.org JSON-LD builders (`WebSite`, `CollectionPage`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`).
  - Automated crawler endpoints (`/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`).
- **Target Files**:
  - `src/lib/tools/registry.ts`
  - `src/lib/seo.ts`
  - `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`
- **Dependencies**: None (can run in parallel with `UNIT-01`).
- **Verification Criteria**: `npx tsx scripts/verify-aidlc.ts` confirms 6 categories, 24 unique tools, 31 sitemap URLs, and valid JSON-LD schemas.

---

## `UNIT-03`: Supabase Client, SQL Schema & Hybrid LocalStorage Store
- **Scope**:
  - Supabase Postgres migration (`tool_metrics`, `user_favorites`, `saved_presets`, RLS policies, and `increment_tool_metric` RPC).
  - Safe environment-aware Supabase client (`isSupabaseConfigured()`).
  - `UserWorkspaceProvider` / `useUserWorkspace()` hook with instant `localStorage` read/write and optional async Supabase sync.
- **Target Files**:
  - `supabase/schema.sql`, `.env.example`
  - `src/lib/supabase/client.ts`
  - `src/hooks/useUserWorkspace.tsx`
- **Dependencies**: `UNIT-02` (tool IDs from registry).
- **Verification Criteria**: App operates with zero runtime errors when `.env.local` is absent (`syncMode === 'local'`).

---

## `UNIT-04`: 24 Browser-Native Tools, Engines & App Router Pages
- **Scope**:
  - Pure deterministic TypeScript engines (`image.ts`, `file.ts`, `text.ts`, `color.ts`, `calculators.ts`) and cheatsheet datasets (`data/cheatsheets.ts`).
  - Unified `ToolWorkspace.tsx` and 6 interactive category tool suites (`ImageToolsSuite`, `FileToolsSuite`, `TextToolsSuite`, `ColorToolsSuite`, `CalculatorToolsSuite`, `CheatsheetToolsSuite`).
  - Statically generated App Router pages (`/`, `/categories/[category]`, `/tools/[category]/[slug]`) and automated verification script (`scripts/verify-aidlc.ts`).
- **Target Files**:
  - `src/lib/tools/engines/*`, `src/lib/tools/data/cheatsheets.ts`
  - `src/components/tools/ToolWorkspace.tsx`, `src/components/tools/suites/*`
  - `src/components/home/HomeHubClient.tsx`
  - `src/app/page.tsx`, `src/app/categories/[category]/page.tsx`, `src/app/tools/[category]/[slug]/page.tsx`
  - `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-01`, `UNIT-02`, `UNIT-03`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes with all 31+ routes statically generated.

---

## Multilingual (`i18n`) Expansion Units (`UNIT-05` – `UNIT-09`)

## `UNIT-05`: i18n Core Runtime, Locale Detection & Package Setup
- **Scope**:
  - Run `npm install && npm install i18next` and inspect `node_modules/next/dist/docs/` for Next.js `16.4.6` App Router rules (`proxy.ts`, `layout.tsx`, `not-found.tsx`, async `params`).
  - Implement React-independent `i18next` runtime (`config.ts`, `detect.ts`, `types.ts`, `translator.ts`), canonical English dictionaries (`locales/en/*`), and Client `I18nProvider` + `useI18n()`.
- **Target Files**:
  - `package.json`, `package-lock.json`
  - `src/i18n/config.ts`, `src/i18n/detect.ts`, `src/i18n/types.ts`, `src/i18n/translator.ts`, `src/i18n/client.tsx`
  - `src/i18n/locales/en/{common.ts,catalog.ts,tools.ts,cheatsheets.ts,index.ts}`
  - `scripts/verify-aidlc.ts`
- **Dependencies**: Baseline `UNIT-01`–`UNIT-04`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes; `detectBestLocale()` and `en` dictionary structure verified.

---

## `UNIT-06`: Full 4-Language Dictionaries (`vi`, `ja`, `zh`) & Registry / Engine / Cheatsheet Localization
- **Scope**:
  - Author complete typed dictionaries for `vi`, `ja`, and `zh` (Simplified Chinese `zh-Hans`) across all 4 tiers matching `LocaleBundle`.
  - Add localized getters in `registry.ts` (6 categories + 24 tools) and `cheatsheets.ts` (20 entries with stable `groupKey`).
  - Extend pure engines (`file.ts`, `text.ts`, `calculators.ts`) with optional `locale: Locale = 'en'` for localized outputs/errors while keeping `convertBytes()` `'en-US'` formatted.
- **Target Files**:
  - `src/i18n/locales/{vi,ja,zh}/{common.ts,catalog.ts,tools.ts,cheatsheets.ts,index.ts}`
  - `src/i18n/translator.ts`
  - `src/lib/tools/registry.ts`, `src/lib/tools/data/cheatsheets.ts`
  - `src/lib/tools/engines/{file.ts,text.ts,calculators.ts}`
  - `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-05`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes; `verify-aidlc.ts` verifies 100% key parity across all 4 locales and multilingual engine outputs.

---

## `UNIT-07`: App Router `[locale]` Routing, Proxy Redirect, SSG & Multi-Language SEO
- **Scope**:
  - Add `src/proxy.ts` (`307` redirect for `/` and legacy `/categories/...`, `/tools/...` via `Cookie → Accept-Language → en`).
  - Migrate App Router pages to `src/app/[locale]/...` with `generateStaticParams()`, SSR `<html lang={htmlLang}>`, `Inter`/`JetBrains_Mono` `vietnamese` subset, and CJK CSS font fallbacks.
  - Update `src/lib/seo.ts` (`hreflang`, `x-default`, `inLanguage` JSON-LD) and `src/app/sitemap.ts` (`124` entries with `alternates.languages`), removing legacy unprefixed page files.
- **Target Files**:
  - `src/proxy.ts`, `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/globals.css`
  - `src/app/[locale]/{layout.tsx,page.tsx,not-found.tsx,categories/[category]/page.tsx,tools/[category]/[slug]/page.tsx}`
  - `src/lib/seo.ts`, `src/app/sitemap.ts`, `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-05`, `UNIT-06`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes with 124 statically generated routes and 124 sitemap URLs.

---

## `UNIT-08`: Topbar Language Switcher, App Shell, Command Palette & Common UI Localization
- **Scope**:
  - Build `LanguageSwitcher.tsx` (Monochrome Zinc Glass dropdown with keyboard/ARIA support) in `AppShell` Topbar next to Theme Toggle, ensuring clean mobile fit at `375px`.
  - Localize `AppShell.tsx`, `CommandPalette.tsx`, `HomeHubClient.tsx`, `BentoCard.tsx`, and `CopyButton.tsx`, including bilingual search matching localized strings and English keywords.
- **Target Files**:
  - `src/components/layout/{LanguageSwitcher.tsx,AppShell.tsx,CommandPalette.tsx}`
  - `src/components/home/HomeHubClient.tsx`, `src/components/bento/BentoCard.tsx`, `src/components/common/CopyButton.tsx`, `src/app/globals.css`
- **Dependencies**: `UNIT-06`, `UNIT-07`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly.

---

## `UNIT-09`: Tool Workspace, All 6 Tool Suites Localization & `sessionStorage` State Preservation
- **Scope**:
  - Localize `ToolWorkspace.tsx` and implement synchronous `sessionStorage` draft snapshot/restore (`omnidev_locale_draft_${tool.id}`) on `'omnidev:before-locale-switch'`.
  - Localize all UI strings across all 6 Tool Suites (Tiers 3 & 4), pass `locale` into engines and `Intl.DateTimeFormat`, and complete missing `initialState` / `onStateChange` fields across all 24 tools.
- **Target Files**:
  - `src/components/tools/ToolWorkspace.tsx`, `src/components/tools/suites/types.ts`
  - `src/components/tools/suites/{ImageToolsSuite,FileToolsSuite,TextToolsSuite,ColorToolsSuite,CalculatorToolsSuite,CheatsheetToolsSuite}.tsx`
- **Dependencies**: `UNIT-06`, `UNIT-07`, `UNIT-08`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes with 0 errors.

---

## Feedback, Ratings & Admin Moderation Units (`UNIT-10` – `UNIT-13`)

## `UNIT-10`: Database Schema, RLS/RPC Security & Pure Feedback Core
- **Scope**:
  - Extend `supabase/schema.sql` with `tool_ratings`, `feedback_submissions`, `feedback_admins`, `is_feedback_admin()`, `check_is_feedback_admin()`, strict RLS policies, and `SECURITY DEFINER` RPCs (`get_tool_rating_summaries`, `upsert_tool_rating`, `get_my_tool_ratings`, `get_my_feedback`).
  - Add `getSupabaseAdminClient()` (`persistSession: true`, `storageKey: 'omnidev_admin_supabase_auth'`) and typed Feedback/Rating/Admin Supabase helpers to `src/lib/supabase/client.ts` while preserving `getSupabaseClient()` (`persistSession: false`).
  - Build pure Node-executable domain logic under `src/lib/feedback/` (`types.ts`, `validation.ts`, `debug-context.ts`, `aggregation.ts`, `local-store.ts`, `index.ts`).
  - Extend `scripts/verify-aidlc.ts` to assert validation (honeypot, `30s` cooldown, length/email), rating aggregation, admin filtering, and `?state=` stripping in `buildSafeDebugContext()`.
- **Target Files**:
  - `supabase/schema.sql`, `src/lib/supabase/client.ts`
  - `src/lib/feedback/{types.ts,validation.ts,debug-context.ts,aggregation.ts,local-store.ts,index.ts}`
  - `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-02`, `UNIT-03`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly.

---

## `UNIT-11`: 4-Locale Feedback & Admin Dictionaries (`en`, `vi`, `ja`, `zh`) & SEO Robots Guard
- **Scope**:
  - Extend `CommonDictionary` (`src/i18n/types.ts`) with `feedback` and `adminFeedback` namespaces.
  - Translate all leaf keys and placeholders with 100% parity across `src/i18n/locales/{en,vi,ja,zh}/common.ts`.
  - Update `src/app/robots.ts` to disallow `/*/admin`, `/*/admin/*`, `/admin`, `/admin/*` while keeping `src/app/sitemap.ts` strictly at `124` URLs.
  - Add `robots()` assertions in `scripts/verify-aidlc.ts`.
- **Target Files**:
  - `src/i18n/types.ts`, `src/i18n/locales/{en,vi,ja,zh}/common.ts`
  - `src/app/robots.ts`, `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-05`, `UNIT-06`, `UNIT-10`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes with 100% 4-locale parity.

---

## `UNIT-12`: Feedback Provider, Unified Modal, Per-Tool Rating Widget & Shell Integration
- **Scope**:
  - Export `getOrCreateClientId` / `clientId` from `src/hooks/useUserWorkspace.tsx` and build `FeedbackProvider` / `useFeedback()` (`src/hooks/useFeedback.tsx`), mounted inside `src/app/[locale]/layout.tsx`.
  - Build `StarRatingWidget.tsx` and `FeedbackModal.tsx` (Submit + My Feedback tabs, hidden Honeypot, `30s` cooldown, Opt-in Debug Context + live JSON preview).
  - Integrate Sidebar Footer trigger + `<FeedbackModal />` in `AppShell.tsx` (preserving `375px` Topbar), aggregate star badge on `ToolBentoCard.tsx`, and header rating badge + quick Bug Report button + bottom-of-workspace `StarRatingWidget` card in `ToolWorkspace.tsx`.
  - Add Monochrome Zinc Glass feedback/rating/honeypot CSS helpers to `src/app/globals.css`.
- **Target Files**:
  - `src/hooks/useUserWorkspace.tsx`, `src/hooks/useFeedback.tsx`
  - `src/components/feedback/{StarRatingWidget.tsx,FeedbackModal.tsx}`
  - `src/components/layout/AppShell.tsx`, `src/components/tools/ToolWorkspace.tsx`, `src/components/bento/BentoCard.tsx`
  - `src/app/[locale]/layout.tsx`, `src/app/globals.css`
- **Dependencies**: `UNIT-08`, `UNIT-09`, `UNIT-10`, `UNIT-11`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes with 0 errors and zero hydration mismatches.

---

## `UNIT-13`: Admin Moderation Console (`/[locale]/admin/feedback`) & Final Verification
- **Scope**:
  - Create `src/app/[locale]/admin/feedback/page.tsx` with `generateStaticParams()` (4 locales) and `generateMetadata()` (`robots: { index: false, follow: false, nocache: true }`).
  - Build `src/components/admin/AdminFeedbackClient.tsx` supporting Supabase Email/Password sign-in (`check_is_feedback_admin()` allowlist), Local Mode banner managing `localStorage` directly when `.env.local` is absent, KPI Bento row, multi-filter bar, status + `admin_note` update, `debug_context` inspection, and 2-step confirmed spam deletion (`DELETE`).
  - Run full verification and confirm `124` sitemap URLs, `robots.ts` disallow rules, and clean static build.
- **Target Files**:
  - `src/app/[locale]/admin/feedback/page.tsx`
  - `src/components/admin/AdminFeedbackClient.tsx`
  - `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-10`, `UNIT-11`, `UNIT-12`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly across all routes.

---

## Device & Network Diagnostics Units (`UNIT-14` – `UNIT-17`)

## `UNIT-14`: Pure Diagnostics Engine & Self-Hosted Speed Test API Route Handlers
- **Scope**:
  - Build pure Node-executable engine `src/lib/tools/engines/diagnostics.ts` (ANSI 104/TKL 80 keyboard layouts, coverage/chatter math, audio RMS/dBFS/clipping/log-sweep/safe-volume, download byte clamping, ping/jitter/Mbps, task suitability, same-origin header validation).
  - Create 3 self-hosted Next.js Route Handlers (`/api/speedtest/ping`, `/api/speedtest/download`, `/api/speedtest/upload`) with `force-dynamic`, `runtime = 'nodejs'`, `no-store`/`no-transform`, incompressible xorshift32 payloads, same-origin validation, and `<= 4 MiB` streaming upload cap (`413`).
  - Update `src/app/robots.ts` to disallow `'/api/*'` alongside `/admin`, and extend `scripts/verify-aidlc.ts` with Section 8 Diagnostics Engine assertions.
- **Target Files**:
  - `src/lib/tools/engines/diagnostics.ts` *(new)*
  - `src/app/api/speedtest/{ping,download,upload}/route.ts` *(new)*
  - `src/app/robots.ts`, `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-02`, `UNIT-11`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly.

---

## `UNIT-15`: Diagnostics Registry, 4-Locale Dictionaries (`en`, `vi`, `ja`, `zh`) & SEO Integration
- **Scope**:
  - Expand `CategoryId` (`+diagnostics`), `ToolId` (`+keyboard-tester`, `+mic-tester`, `+speaker-tester`, `+speed-test`), `ToolsDictionary` (`+diagnosticsSuite`), `CATEGORIES` (7), `TOOLS` (28), and `ToolIcon.tsx` (`+Activity`).
  - Update 4-locale `common.ts` (`24→28`, `6→7`), `catalog.ts`, and `tools.ts` with 100% recursive key/placeholder parity across `en`, `vi`, `ja`, `zh`.
  - Create initial `src/components/tools/suites/DiagnosticsToolsSuite.tsx`, wire `case 'diagnostics':` in `ToolWorkspace.tsx`, and update `scripts/verify-aidlc.ts` (`7` categories, `28` tools, `144` sitemap URLs).
- **Target Files**:
  - `src/i18n/types.ts`, `src/i18n/locales/{en,vi,ja,zh}/{common,catalog,tools}.ts`
  - `src/lib/tools/registry.ts`, `src/components/common/ToolIcon.tsx`, `src/components/tools/ToolWorkspace.tsx`
  - `src/components/tools/suites/DiagnosticsToolsSuite.tsx` *(new)*, `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-14`, `UNIT-06`, `UNIT-09`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes with 144 sitemap URLs and 100% 4-locale parity.

---

## `UNIT-16`: Keyboard Tester (`keyboard-tester`) & AppShell Shortcut Guard
- **Scope**:
  - Add `if (e.defaultPrevented) return;` guard to global `Cmd/Ctrl+K` handler in `src/components/layout/AppShell.tsx`.
  - Implement `src/components/tools/suites/diagnostics/KeyboardTesterPanel.tsx` (Full 104 / TKL 80 ANSI visual keyboard, Win/Mac labels, active/tested/stuck/chatter states, Capture Mode with `Esc × 2` unlock, NKRO & press counters, Event Inspector, optional muted-default Web Audio click) and Monochrome Zinc Glass keyboard CSS in `src/app/globals.css`.
- **Target Files**:
  - `src/components/layout/AppShell.tsx`, `src/components/tools/suites/diagnostics/KeyboardTesterPanel.tsx` *(new)*
  - `src/components/tools/suites/DiagnosticsToolsSuite.tsx`, `src/app/globals.css`
- **Dependencies**: `UNIT-14`, `UNIT-15`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly.

---

## `UNIT-17`: Mic Tester, Speaker Tester, Speed Test & Final Verification
- **Scope**:
  - Implement `MicTesterPanel.tsx` (Secure Context & permission diagnostics, input selector, VU/dBFS + Canvas Waveform/Spectrum, noise/clipping, `<= 15s` Record/Playback/Download, full teardown).
  - Implement `SpeakerTesterPanel.tsx` (output selector via `setSinkId` with fallback, Left/Stereo/Right via `ChannelMergerNode(2)`, 440Hz Tone / 20Hz–20kHz Sweep / White-Pink Noise / Sample Chime, hearing-safe `35%` default volume + `DynamicsCompressorNode`).
  - Implement `SpeedTestPanel.tsx` (`Quick`/`Standard`, Start/Abort, Ping/Jitter + streaming Download + XHR Upload, live SVG chart, suitability ratings, `localStorage` history up to 20 runs) and wire all 3 panels in `DiagnosticsToolsSuite.tsx` + CSS in `src/app/globals.css`.
- **Target Files**:
  - `src/components/tools/suites/diagnostics/{MicTesterPanel,SpeakerTesterPanel,SpeedTestPanel}.tsx` *(new)*
  - `src/components/tools/suites/DiagnosticsToolsSuite.tsx`, `src/app/globals.css`, `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-14`, `UNIT-15`, `UNIT-16`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly across all routes.

---

## Brand Assets & Backlink Pages Units (`UNIT-18` – `UNIT-21`)

## `UNIT-18`: Brand Logo, Deterministic Asset Generator, Metadata Routes, Site Config & Proxy/SEO Pipeline
- **Scope**:
  - Implement pure Node deterministic asset generator `scripts/generate-brand-assets.ts` (`node:zlib`) producing `src/app/favicon.ico` (`16/32/48`) and `public/icons/{icon-192.png, icon-512.png, icon-maskable-512.png}` matching the Zinc `#09090b` + Emerald `#10b981` `>_` mark.
  - Remove the 5 Next.js starter SVGs (`public/{next,vercel,globe,file,window}.svg`).
  - Create `src/app/icon.svg`, `src/lib/brand/og-template.tsx`, `src/app/apple-icon.tsx` (`180×180`), `src/app/opengraph-image.tsx` (`1200×630`), `src/app/twitter-image.tsx` (`1200×630`), and `src/components/common/BrandLogo.tsx`.
  - Create `src/lib/site.ts` (`resolveSiteConfig`, `getSiteConfig`), update `.env.example`, update `src/app/manifest.ts`, add pure `shouldBypassLocaleProxy()` in `src/i18n/detect.ts` + wire into `src/proxy.ts`, and update `src/lib/seo.ts` (`getMetadataBase()`, `metadataBase`, `openGraph.images`, `twitter.images`).
  - Extend `scripts/verify-aidlc.ts` with Brand Asset, `resolveSiteConfig()`, `shouldBypassLocaleProxy()`, `manifest()`, and `metadataBase`/social image assertions.
- **Target Files**:
  - `scripts/generate-brand-assets.ts` *(new)*, `src/lib/site.ts` *(new)*, `.env.example`
  - `src/lib/brand/og-template.tsx` *(new)*, `src/components/common/BrandLogo.tsx` *(new)*
  - `src/app/icon.svg` *(new)*, `src/app/favicon.ico` *(replaced)*, `src/app/{apple-icon,opengraph-image,twitter-image}.tsx` *(new)*
  - `public/icons/{icon-192.png,icon-512.png,icon-maskable-512.png}` *(new)*, `public/{next,vercel,globe,file,window}.svg` *(deleted)*
  - `src/app/manifest.ts`, `src/i18n/detect.ts`, `src/proxy.ts`, `src/lib/seo.ts`, `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-02`, `UNIT-07`.
- **Verification Criteria**: `npx tsx scripts/generate-brand-assets.ts && npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly.

---

## `UNIT-19`: Info Pages Registry, 4-Locale Dictionaries (`pages.ts` + `footer`), Sitemap (`164` URLs) & Info SEO Builders
- **Scope**:
  - Create `src/lib/info/pages.ts` defining `InfoPageSlug = 'about' | 'help' | 'privacy' | 'terms' | 'contact'`, `INFO_PAGES`, `getInfoPageBySlug()`, `getLocalizedInfoPages()`, and `getLocalizedInfoPage()`.
  - Extend `src/i18n/types.ts` (`CommonDictionary['footer']`, `CommonDictionary['commandPalette']['pageBadge']`, `PagesDictionary`) and register `'pages'` namespace in `src/i18n/translator.ts`.
  - Author complete, truthful 4-locale dictionaries across `src/i18n/locales/{en,vi,ja,zh}/{common.ts,pages.ts,index.ts}` with 100% recursive key and `{{placeholder}}` parity.
  - Extend `src/lib/seo.ts` with `buildInfoPageMetadata(slug, locale)` and `buildInfoPageJsonLd(slug, locale)` (`BreadcrumbList` + `AboutPage` / `FAQPage` / `ContactPage` / `WebPage`).
  - Expand `src/app/sitemap.ts` to `164` URLs (`4 × (1 + 7 + 28 + 5)`) with `hreflang` alternates and extend `scripts/verify-aidlc.ts`.
- **Target Files**:
  - `src/lib/info/pages.ts` *(new)*
  - `src/i18n/types.ts`, `src/i18n/translator.ts`, `src/i18n/locales/{en,vi,ja,zh}/{common.ts,pages.ts,index.ts}`
  - `src/lib/seo.ts`, `src/app/sitemap.ts`, `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-18`, `UNIT-05`, `UNIT-06`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes with 164 sitemap URLs and 100% 4-locale parity.

---

## `UNIT-20`: Global `<SiteFooter />`, `<BrandLogo />` Shell Integration, Sidebar Links & `CommandPalette` Quick-Jump
- **Scope**:
  - Build `src/components/layout/SiteFooter.tsx` (`'use client'`) with `<BrandLogo size={24} />`, localized internal links to all 5 info pages, GitHub external link (`rel="noopener noreferrer"`), and Feedback trigger.
  - Update `src/components/layout/AppShell.tsx`: replace `<Command />` with `<BrandLogo size={32} />`, add compact `.sidebar-legal-links` in Sidebar Footer, and mount `<SiteFooter />` below `<main className="app-content">` inside `.app-main-wrap`.
  - Update `src/components/common/ToolIcon.tsx` and `src/components/layout/CommandPalette.tsx` (`kind: 'page'`) to search and jump to all 5 localized info pages, and add footer/info styles to `src/app/globals.css`.
- **Target Files**:
  - `src/components/layout/SiteFooter.tsx` *(new)*
  - `src/components/layout/AppShell.tsx`, `src/components/layout/CommandPalette.tsx`, `src/components/common/ToolIcon.tsx`, `src/app/globals.css`
- **Dependencies**: `UNIT-18`, `UNIT-19`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly.

---

## `UNIT-21`: 5 Static Localized Info Pages (`about`, `help`, `privacy`, `terms`, `contact`) & Full Verification Suite
- **Scope**:
  - Build `src/components/info/InfoPageLayout.tsx` and `src/components/info/InfoFeedbackActions.tsx` (`'use client'` island for `FeedbackModal` & optional `supportEmail` `mailto:` + Copy).
  - Create all 5 localized App Router SSG routes (`src/app/[locale]/{about,help,privacy,terms,contact}/page.tsx`) with `generateStaticParams()`, `generateMetadata()`, and JSON-LD.
  - Extend Section 6 of `scripts/verify-aidlc.ts` to verify single `<html lang>`, canonical URL, and `og:image` in built HTML across all 5 info routes × 4 locales.
- **Target Files**:
  - `src/components/info/{InfoPageLayout.tsx,InfoFeedbackActions.tsx}` *(new)*
  - `src/app/[locale]/{about,help,privacy,terms,contact}/page.tsx` *(new)*
  - `scripts/verify-aidlc.ts`
- **Dependencies**: `UNIT-18`, `UNIT-19`, `UNIT-20`.
- **Verification Criteria**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` passes cleanly across all 174+ static routes.

