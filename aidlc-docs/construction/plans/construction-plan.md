# Construction Phase Plan (`construction-plan.md`)

- **Phase**: `CONSTRUCTION`
- **Cadence**: `Per-Unit (Bolt) Execution`

---

## Unit Checklist & Functional Specifications

### [x] `UNIT-01`: Design System, Theme Engine & Layout Primitives
- **Files**: `src/app/globals.css`, `src/styles/glass.css`, `src/styles/bento.css`, `src/app/layout.tsx`, `src/components/bento/BentoGrid.tsx`, `src/components/bento/BentoCard.tsx`, `src/components/common/CopyButton.tsx`, `src/components/common/ToolIcon.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/CommandPalette.tsx`
- **Key Interfaces / Contracts**:
  - `data-theme="dark" | "light"` root attribute synced to `localStorage`
  - `.bento-grid` 12-column responsive layout collapsing at `1024px` and `640px`
  - `CommandPalette`: `Cmd+K` / `Ctrl+K` keyboard shortcut, `ArrowUp`/`ArrowDown`/`Enter`/`Escape`
- **Verification Gate**: `npm run lint && npm run build`

### [x] `UNIT-02`: Tool Registry & Programmatic SEO Engine
- **Files**: `src/lib/tools/registry.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`
- **Key Interfaces / Contracts**:
  - `CATEGORIES`: 6 immutable category descriptors (`image`, `file`, `text`, `color`, `calculators`, `cheatsheets`)
  - `TOOLS`: 24 `ToolDefinition` entries with `keywords`, `howItWorks`, `faqs`
  - `getToolBySlug(category, slug)`, `getToolsByCategory(category)`, `getCategoryBySlug(slug)`, `getRelatedTools(tool, limit)`
  - `buildWebSiteJsonLd()`, `buildCollectionPageJsonLd()`, `buildToolJsonLd()`
- **Verification Gate**: `npx tsx scripts/verify-aidlc.ts`

### [x] `UNIT-03`: Supabase Client, SQL Schema & Hybrid LocalStorage Store
- **Files**: `supabase/schema.sql`, `.env.example`, `src/lib/supabase/client.ts`, `src/hooks/useUserWorkspace.tsx`
- **Key Interfaces / Contracts**:
  - `isSupabaseConfigured(): boolean`
  - `useUserWorkspace()` exposing `favorites`, `toggleFavorite(toolId)`, `presets`, `savePreset(toolId, name, payload)`, `deletePreset(id)`, `metrics`, `trackToolView(toolId)`, `trackToolUse(toolId)`, `pinnedSnippets`, `togglePinnedSnippet(snippetId)`, `syncMode: 'local' | 'supabase'`
- **Verification Gate**: `npm run lint && npm run build` (clean execution without `.env.local`)

### [x] `UNIT-04`: 24 Browser-Native Tools, Engines & App Router Pages
- **Files**: `src/lib/tools/engines/*`, `src/lib/tools/data/cheatsheets.ts`, `src/components/tools/ToolWorkspace.tsx`, `src/components/tools/suites/*`, `src/components/home/HomeHubClient.tsx`, `src/app/page.tsx`, `src/app/categories/[category]/page.tsx`, `src/app/tools/[category]/[slug]/page.tsx`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - Pure deterministic engines in `src/lib/tools/engines/{image,file,text,color,calculators}.ts`
  - `generateStaticParams()` across all 6 categories and 24 tool pages
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

---

## Pending / Active Verification Checklist
- [ ] `npm install` in target environment
- [ ] `npm run lint` passes with 0 errors
- [ ] `npx tsx scripts/verify-aidlc.ts` passes all registry, engine, and SEO schema assertions
- [ ] `npm run build` statically generates all 31+ routes into `.next/`
