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
