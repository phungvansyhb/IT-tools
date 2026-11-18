# OmniDev / IT-Tools Hub — Construction Units Plan

## Construction Decomposition

| Unit ID | Name | Scope & Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Unit-01-DesignSystem** | Design System, Theme Engine & Layout Primitives | `src/styles/tokens.css`, `src/styles/glass.css`, `src/styles/bento.css`, `src/app/globals.css`, `ThemeProvider`, `BentoGrid`, `BentoCard`, `AppShell` (Sidebar, Topbar, `Cmd+K` Command Palette, Favorites Drawer). | Planned |
| **Unit-02-RegistryAndSEO** | Tool Registry & Programmatic SEO Engine | `src/lib/tools/registry.ts` (6 categories, 24 tools with `howItWorks`, `faqs`, `keywords`), `src/lib/seo.ts` (Metadata + JSON-LD builders), `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`. | Planned |
| **Unit-03-SupabaseSync** | Supabase Client, SQL Migration & Hybrid Store | `supabase/schema.sql` (tables + RLS + RPC increment), `src/lib/supabase/client.ts`, `src/hooks/useUserWorkspace.tsx` (instant `localStorage` + async Supabase sync). | Planned |
| **Unit-04-ToolsSuite** | 24 Browser-Native Tools & Workspace | Pure logic engines in `src/lib/tools/engines/*`, unified `ToolWorkspace.tsx`, and 6 category suites (`ImageToolsSuite`, `FileToolsSuite`, `TextToolsSuite`, `ColorToolsSuite`, `CalculatorToolsSuite`, `CheatsheetToolsSuite`), plus App Router pages (`/`, `/categories/[category]`, `/tools/[category]/[slug]`). | Planned |

---

## Interface Contracts

### Tool Registry Contract (`src/lib/tools/registry.ts`)
- `CATEGORIES`: 6 immutable category objects (`image`, `file`, `text`, `color`, `calculators`, `cheatsheets`).
- `TOOLS`: 24 unique `ToolDefinition` items, each mapping cleanly to a category slug and unique tool slug.
- Lookup helpers: `getToolBySlug(category, slug)`, `getToolsByCategory(category)`, `getCategoryBySlug(slug)`, `getRelatedTools(tool, limit)`.

### Workspace Context Contract (`src/hooks/useUserWorkspace.tsx`)
- `favorites: string[]` & `toggleFavorite(toolId: string)`
- `presets: SavedPreset[]` & `savePreset(toolId: string, name: string, payload: Record<string, unknown>)` & `deletePreset(id: string)`
- `metrics: Record<string, { views: number; uses: number }>` & `trackToolView(toolId)` & `trackToolUse(toolId)`
- `pinnedSnippets: string[]` & `togglePinnedSnippet(snippetId: string)`
- `syncMode: 'local' | 'supabase'`

---

## Verification Checklist
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` statically generates `/`, all 6 `/categories/[category]`, all 24 `/tools/[category]/[slug]`, `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest`.
- [ ] `npx tsx scripts/verify-aidlc.ts` passes all registry integrity, deterministic tool algorithm, and SEO schema assertions.
- [ ] Live verification via dev server confirms Bento Grid layout, Glassmorphism tokens, Dark/Light switching, `Cmd+K` search, tool interactivity, and Favorites/Presets persistence.
