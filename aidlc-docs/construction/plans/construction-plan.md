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

### [x] `UNIT-05`: i18n Core Runtime, Locale Detection & Package Setup
- **Files**: `package.json`, `package-lock.json`, `src/i18n/config.ts`, `src/i18n/detect.ts`, `src/i18n/types.ts`, `src/i18n/translator.ts`, `src/i18n/client.tsx`, `src/i18n/locales/en/{common,catalog,tools,cheatsheets,index}.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `export type Locale = 'en' | 'vi' | 'ja' | 'zh'` (`zh` → `htmlLang: 'zh-Hans'`)
  - `SUPPORTED_LOCALES`, `DEFAULT_LOCALE = 'en'`, `LOCALE_META`, `LOCALE_COOKIE_NAME = 'omnidev_locale'`, `LOCALE_STORAGE_KEY = 'omnidev_locale'`
  - `localePath(locale: Locale, path: string): string`, `stripLocalePrefix(pathname: string)`
  - `detectBestLocale({ cookieLocale, acceptLanguage }): Locale`
  - Stateless `getFixedT(locale: Locale)` (`initImmediate: false`) and Client `useI18n()` (`locale`, `t`, `switchLocale(nextLocale)`)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-06`: Full 4-Language Dictionaries (`vi`, `ja`, `zh`) & Registry / Engine / Cheatsheet Localization
- **Files**: `src/i18n/locales/{vi,ja,zh}/{common,catalog,tools,cheatsheets,index}.ts`, `src/i18n/translator.ts`, `src/lib/tools/registry.ts`, `src/lib/tools/data/cheatsheets.ts`, `src/lib/tools/engines/{file,text,calculators}.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `getLocalizedCategories(locale)`, `getLocalizedCategory(slug, locale)`, `getLocalizedTools(locale)`, `getLocalizedTool(slugOrId, category, locale)`, `getLocalizedCheatsheetEntries(locale)`
  - Backward-compatible optional trailing `locale: Locale = 'en'` on `decodeJwt`, `analyzeCronExpression`, `analyzeTimestamp`, `inspectMagicBytes`, `convertStructuredData`, `convertNumberBase`, `runRegexTest`
  - `convertBytes()` retains `'en-US'` numeric formatting for deterministic math & verification
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-07`: App Router `[locale]` Routing, Proxy Redirect, SSG & Multi-Language SEO
- **Files**: `src/proxy.ts`, `src/app/globals.css`, `src/app/[locale]/{layout,page,not-found}.tsx`, `src/app/[locale]/categories/[category]/page.tsx`, `src/app/[locale]/tools/[category]/[slug]/page.tsx`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `src/proxy.ts` `307` redirect on `/` and unprefixed legacy routes via `Cookie → Accept-Language → en`
  - `generateStaticParams()` across `[locale]`, `[locale]/categories/[category]`, `[locale]/tools/[category]/[slug]` (124 routes total)
  - `buildHomeMetadata(locale)`, `buildCategoryMetadata(cat, locale)`, `buildToolMetadata(tool, cat, locale)`, `buildWebSiteJsonLd(locale)`, `buildCollectionPageJsonLd(cat, tools, locale)`, `buildToolJsonLd(tool, cat, locale)`
  - `sitemap()` returns 124 entries with `alternates.languages` (`en`, `vi`, `ja`, `zh-Hans`, `x-default`)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-08`: Topbar Language Switcher, App Shell, Command Palette & Common UI Localization
- **Files**: `src/components/layout/{LanguageSwitcher,AppShell,CommandPalette}.tsx`, `src/components/home/HomeHubClient.tsx`, `src/components/bento/BentoCard.tsx`, `src/components/common/CopyButton.tsx`, `src/app/globals.css`
- **Key Interfaces / Contracts**:
  - Synchronous `window.dispatchEvent(new CustomEvent('omnidev:before-locale-switch'))` before `router.push()` in `switchLocale()`
  - `LanguageSwitcher`: `aria-haspopup="listbox"`, `aria-expanded`, `Escape` / Arrow key navigation, responsive Topbar fit at `375px`
  - Bilingual search matching localized text + canonical English keywords
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-09`: Tool Workspace, All 6 Tool Suites Localization & `sessionStorage` State Preservation
- **Files**: `src/components/tools/ToolWorkspace.tsx`, `src/components/tools/suites/types.ts`, `src/components/tools/suites/{ImageToolsSuite,FileToolsSuite,TextToolsSuite,ColorToolsSuite,CalculatorToolsSuite,CheatsheetToolsSuite}.tsx`
- **Key Interfaces / Contracts**:
  - `DRAFT_STORAGE_PREFIX = 'omnidev:draft:'`
  - `'omnidev:before-locale-switch'` listener saves `currentStateRef.current` synchronously (with `sourceImg` `dataUrl` capped at `1_500_000` chars); target mount restores (`?state=` → `sessionStorage` → defaults) and immediately deletes draft key
  - Complete `initialState` / `onStateChange` coverage across all 24 tools
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

---

## Pending / Active Verification Checklist
- [x] `npm install && npm install i18next` in target environment (`UNIT-05`)
- [x] `npm run lint` passes with 0 errors
- [x] `npx tsx scripts/verify-aidlc.ts` passes all registry, i18n parity, engine, and 124-URL SEO schema assertions
- [x] `npm run build` statically generates all 124 localized routes into `.next/` with SSR `<html lang="...">` per locale
