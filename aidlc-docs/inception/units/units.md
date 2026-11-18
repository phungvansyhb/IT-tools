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
