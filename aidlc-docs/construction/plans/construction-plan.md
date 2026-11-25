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

### [x] `UNIT-10`: Database Schema, RLS/RPC Security & Pure Feedback Core
- **Files**: `supabase/schema.sql`, `src/lib/supabase/client.ts`, `src/lib/feedback/{types.ts,validation.ts,debug-context.ts,aggregation.ts,local-store.ts,index.ts}`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `tool_ratings`, `feedback_submissions`, `feedback_admins`, `is_feedback_admin()`, `check_is_feedback_admin()`, `get_tool_rating_summaries()`, `upsert_tool_rating()`, `get_my_tool_ratings()`, `get_my_feedback()`
  - `getSupabaseAdminClient()` (`persistSession: true`, `storageKey: 'omnidev_admin_supabase_auth'`) alongside unchanged `getSupabaseClient()` (`persistSession: false`)
  - `validateFeedbackSubmission()`, `validateRatingInput()`, `validateAdminUpdate()`, `buildSafeDebugContext()`, `aggregateToolRatings()`, `filterAdminRecords()`
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-11`: 4-Locale Feedback & Admin Dictionaries (`en`, `vi`, `ja`, `zh`) & SEO Robots Guard
- **Files**: `src/i18n/types.ts`, `src/i18n/locales/{en,vi,ja,zh}/common.ts`, `src/app/robots.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `CommonDictionary['feedback']` & `CommonDictionary['adminFeedback']` with 100% recursive leaf-key & placeholder parity across `en`, `vi`, `ja`, `zh`
  - `robots()` disallowing `/*/admin`, `/*/admin/*`, `/admin`, `/admin/*` while `sitemap()` retains 124 URLs
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-12`: Feedback Provider, Unified Modal, Per-Tool Rating Widget & Shell Integration
- **Files**: `src/hooks/useUserWorkspace.tsx`, `src/hooks/useFeedback.tsx`, `src/components/feedback/{StarRatingWidget.tsx,FeedbackModal.tsx}`, `src/components/layout/AppShell.tsx`, `src/components/tools/ToolWorkspace.tsx`, `src/components/bento/BentoCard.tsx`, `src/app/[locale]/layout.tsx`, `src/app/globals.css`
- **Key Interfaces / Contracts**:
  - `useFeedback()` exposing `ratingSummaries`, `myRatings`, `myFeedback`, `cooldownRemainingSec`, `submitRating()`, `submitFeedback()`, `openFeedbackModal()`, `closeFeedbackModal()`, `refreshFeedbackData()`
  - Sidebar Footer trigger + `<FeedbackModal />` mounted once in `AppShell.tsx` (Topbar untouched for `375px` parity); `StarRatingWidget` card placed below tool suite in `ToolWorkspace.tsx`
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-13`: Admin Moderation Console (`/[locale]/admin/feedback`) & Final Verification
- **Files**: `src/app/[locale]/admin/feedback/page.tsx`, `src/components/admin/AdminFeedbackClient.tsx`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `generateStaticParams()` across 4 locales + `generateMetadata()` with `robots: { index: false, follow: false, nocache: true }`
  - `AdminFeedbackClient` handling Supabase Email/Password sign-in (`check_is_feedback_admin()`) and Local Mode `localStorage` management, KPI row, multi-filters, `status`/`admin_note` updates, `debug_context` viewer, and 2-step confirmed `DELETE`
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-14`: Pure Diagnostics Engine & Self-Hosted Speed Test API Route Handlers
- **Files**: `src/lib/tools/engines/diagnostics.ts`, `src/app/api/speedtest/ping/route.ts`, `src/app/api/speedtest/download/route.ts`, `src/app/api/speedtest/upload/route.ts`, `src/app/robots.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - Pure engine exports: `getKeyboardLayout`, `getKeyboardLayoutKeyCodes`, `computeKeyboardStats`, `detectKeyChatter`, `calculateAudioLevels`, `classifyMicNoiseFloor`, `computeSweepFrequencyAtProgress`, `clampSafeMasterVolume`, `clampDownloadBytes`, `computePingStats`, `computeBandwidthMbps`, `assessNetworkSuitability`, `validateSameOriginHeaders`, and `SPEED_TEST_*_BYTES` constants (`64 KiB .. 4 MiB`)
  - API routes (`dynamic = 'force-dynamic'`, `runtime = 'nodejs'`, `no-store`/`no-transform`): `GET /api/speedtest/ping`, `GET /api/speedtest/download?bytes=...`, `POST /api/speedtest/upload` (same-origin check + `413` streaming cap at `4 MiB`)
  - `robots()` adds `'/api/*'` disallow alongside `/admin`
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-15`: Diagnostics Registry, 4-Locale Dictionaries (`en`, `vi`, `ja`, `zh`) & SEO Integration
- **Files**: `src/i18n/types.ts`, `src/i18n/locales/{en,vi,ja,zh}/{common,catalog,tools}.ts`, `src/lib/tools/registry.ts`, `src/components/common/ToolIcon.tsx`, `src/components/tools/ToolWorkspace.tsx`, `src/components/tools/suites/DiagnosticsToolsSuite.tsx`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `CategoryId` includes `'diagnostics'`; `ToolId` includes `'keyboard-tester' | 'mic-tester' | 'speaker-tester' | 'speed-test'`; `CATEGORIES` = 7, `TOOLS` = 28, `sitemap()` = 144 URLs
  - `ToolsDictionary['diagnosticsSuite']` with 100% recursive key/placeholder parity across `en`, `vi`, `ja`, `zh`
  - `ToolIcon` supports `'Activity'`; `ToolWorkspace` routes `case 'diagnostics':` to `DiagnosticsToolsSuite`
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-16`: Keyboard Tester (`keyboard-tester`) & AppShell Shortcut Guard
- **Files**: `src/components/layout/AppShell.tsx`, `src/components/tools/suites/diagnostics/KeyboardTesterPanel.tsx`, `src/components/tools/suites/DiagnosticsToolsSuite.tsx`, `src/app/globals.css`
- **Key Interfaces / Contracts**:
  - `AppShell` global `Cmd/Ctrl+K` listener checks `if (e.defaultPrevented) return;`
  - `DiagnosticsPanelProps`: `{ initialState?: Record<string, unknown> | null; onStateChange?: (state: Record<string, unknown>) => void; onRun?: () => void }`
  - `KeyboardTesterPanel`: ANSI Full-size 104 / TKL 80, Win/Mac labels, active/tested/stuck/chatter states, Capture Mode (`Esc × 2` unlock), NKRO & total presses, Event Inspector, optional Web Audio click (muted default)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-17`: Mic Tester (`mic-tester`), Speaker Tester (`speaker-tester`), Speed Test (`speed-test`) & Final Verification
- **Files**: `src/components/tools/suites/diagnostics/MicTesterPanel.tsx`, `src/components/tools/suites/diagnostics/SpeakerTesterPanel.tsx`, `src/components/tools/suites/diagnostics/SpeedTestPanel.tsx`, `src/components/tools/suites/DiagnosticsToolsSuite.tsx`, `src/app/globals.css`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `MicTesterPanel`: Secure Context / permission diagnostics, input device selector, VU/dBFS + Canvas Waveform/Spectrum, noise/clipping status, `<= 15s` Record/Playback/Download, full teardown
  - `SpeakerTesterPanel`: output device selector (`setSinkId` + fallback), `ChannelMergerNode(2)` Left/Stereo/Right, 440Hz Tone / 20Hz–20kHz Sweep / White-Pink Noise / Sample Chime, hearing-safe `35%` default volume + `DynamicsCompressorNode`
  - `SpeedTestPanel`: `Quick`/`Standard`, Start/Abort, Ping/Jitter + streaming Download + XHR Upload, real-time SVG chart, suitability assessment, `localStorage` history (`omnidev_speedtest_history`, max 20)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

---

## Pending / Active Verification Checklist (Diagnostics Cycle)
- [x] `npm run lint` passes with 0 errors
- [x] `npx tsx scripts/verify-aidlc.ts` passes all baseline, i18n 4-locale parity, Feedback, `7` categories, `28` tools, `144` sitemap URLs, `robots.ts` `/admin` + `/api/*` disallow, and pure `engines/diagnostics.ts` assertions
- [x] `npm run build` statically generates all routes cleanly alongside dynamic `/api/speedtest/*` Route Handlers

---

### [x] `UNIT-18`: Brand Logo, Deterministic Asset Generator, Metadata Routes, Site Config & Proxy/SEO Pipeline
- **Files**: `scripts/generate-brand-assets.ts`, `src/lib/site.ts`, `.env.example`, `src/lib/brand/og-template.tsx`, `src/components/common/BrandLogo.tsx`, `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/{apple-icon,opengraph-image,twitter-image}.tsx`, `public/icons/{icon-192.png,icon-512.png,icon-maskable-512.png}`, `src/app/manifest.ts`, `src/i18n/detect.ts`, `src/proxy.ts`, `src/lib/seo.ts`, `scripts/verify-aidlc.ts` (delete `public/{next,vercel,globe,file,window}.svg`)
- **Key Interfaces / Contracts**:
  - `SiteConfig`: `{ siteUrl: string; githubUrl: string; supportEmail: string | null }` via `resolveSiteConfig(env)` and `getSiteConfig()`
  - `shouldBypassLocaleProxy(pathname: string): boolean` wired in `src/proxy.ts`
  - `BrandLogo({ size?: number; className?: string })` matching Zinc `#09090b` + Emerald `#10b981` `>_` mark
  - `getMetadataBase(): URL` + `openGraph.images` / `twitter.images` across `src/lib/seo.ts`
- **Verification Gate**: `npx tsx scripts/generate-brand-assets.ts && npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-19`: Info Pages Registry, 4-Locale Dictionaries (`pages.ts` + `footer`), Sitemap (`164` URLs) & Info SEO Builders
- **Files**: `src/lib/info/pages.ts`, `src/i18n/types.ts`, `src/i18n/translator.ts`, `src/i18n/locales/{en,vi,ja,zh}/{common.ts,pages.ts,index.ts}`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `InfoPageSlug = 'about' | 'help' | 'privacy' | 'terms' | 'contact'` + `INFO_PAGES`, `getLocalizedInfoPages(locale)`, `getLocalizedInfoPage(slug, locale)`
  - `PagesDictionary` registered as `'pages'` namespace + `CommonDictionary['footer']` + `CommonDictionary['commandPalette']['pageBadge']` with 100% 4-locale parity
  - `buildInfoPageMetadata(slug, locale)` & `buildInfoPageJsonLd(slug, locale)` (`BreadcrumbList` + `AboutPage` / `FAQPage` / `ContactPage` / `WebPage`)
  - `sitemap()` length === `164` (`4 × (1 + 7 + 28 + 5)`)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-20`: Global `<SiteFooter />`, `<BrandLogo />` Shell Integration, Sidebar Links & `CommandPalette` Quick-Jump
- **Files**: `src/components/layout/SiteFooter.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/CommandPalette.tsx`, `src/components/common/ToolIcon.tsx`, `src/app/globals.css`
- **Key Interfaces / Contracts**:
  - `<SiteFooter />` mounted inside `.app-main-wrap` below `<main className="app-content">` (`flex: 1`)
  - `<BrandLogo size={32} />` in `AppShell.tsx` Sidebar header + `.sidebar-legal-links` in Sidebar Footer (Topbar untouched for `375px` parity)
  - `CommandPalette` `SearchResultItem` extended with `kind: 'page'` matching localized & canonical English keywords
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-21`: 5 Static Localized Info Pages (`about`, `help`, `privacy`, `terms`, `contact`) & Full Verification Suite
- **Files**: `src/components/info/InfoPageLayout.tsx`, `src/components/info/InfoFeedbackActions.tsx`, `src/app/[locale]/{about,help,privacy,terms,contact}/page.tsx`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `generateStaticParams()` × 4 locales across all 5 info routes (`20` new static routes)
  - `InfoFeedbackActions` (`variant: 'help' | 'contact'`, `supportEmail`, `githubUrl`) integrating `FeedbackModal` and conditional `mailto:` + Copy
  - `scripts/verify-aidlc.ts` verifying `<html lang>`, canonical URL, and `og:image` in built HTML across all 5 info routes × 4 locales
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

---

## Pending / Active Verification Checklist (Brand Assets & Backlink Pages Cycle)
- [x] `npx tsx scripts/generate-brand-assets.ts` generates deterministic `favicon.ico` and `public/icons/*.png`
- [x] `npm run lint` passes with 0 errors
- [x] `npx tsx scripts/verify-aidlc.ts` passes all baseline, i18n, Feedback, Diagnostics, Brand Asset, `resolveSiteConfig()`, `shouldBypassLocaleProxy()`, `164`-URL sitemap, `pages` 4-locale parity, and Info Page HTML/JSON-LD assertions
- [x] `npm run build` statically generates all routes cleanly (`178` static routes + 3 dynamic speedtest routes)

---

### [x] `UNIT-22`: Next.js 16 Docs Verification, Pure 404 Suggestion Engine, 4-Locale `notFound` Dictionaries & SEO Metadata
- **Files**: `src/lib/not-found/{suggestions.ts,index.ts}`, `src/i18n/types.ts`, `src/i18n/locales/{en,vi,ja,zh}/common.ts`, `src/lib/seo.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `analyzeNotFoundPath(rawPath: string): AnalyzedNotFoundPath` (strips `?query`/`#hash`, classifies `tool` | `category` | `general`, extracts tokens & valid `categorySlugCandidate`)
  - `findNotFoundSuggestions(rawPath: string, locale: Locale, limit?: number): NotFoundSuggestion[]` (fuzzy Levenshtein + token/prefix/category boost + aliases across 28 tools, 7 categories, 5 info pages; strictly excludes `/admin` and `/api`)
  - `getNotFoundFallbackData(locale: Locale, analyzed: AnalyzedNotFoundPath)`
  - `buildNotFoundMetadata(locale: Locale, context?: NotFoundContext): Metadata` (`robots: { index: false, follow: false, nocache: true }`, `metadataBase`)
  - Expanded `CommonDictionary['notFound']` with 100% 4-locale parity
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-23`: `NotFoundHub` & `RootNotFoundView` UI, Shell/Feedback Integration & Monochrome CSS
- **Files**: `src/components/layout/{AppShell.tsx,CommandPalette.tsx}`, `src/hooks/useFeedback.tsx`, `src/components/feedback/FeedbackModal.tsx`, `src/components/not-found/{NotFoundHub.tsx,RootNotFoundView.tsx}`, `src/app/globals.css`
- **Key Interfaces / Contracts**:
  - `OPEN_COMMAND_PALETTE_EVENT = 'omnidev:open-command-palette'` (`CustomEvent<{ query?: string }>`) handled in `AppShell.tsx` & forwarded to `CommandPalette.tsx`
  - `OpenFeedbackModalOptions.defaultTitle?: string` sanitized via `sanitizePathname()` and capped at `TITLE_MAX` (`140`)
  - `NotFoundHub({ contextOverride?: NotFoundContext })` (hydration-safe `usePathname()`, inline search, "Did you mean?", contextual Tool/Category/General recovery grids, `⌘K`, Broken Link Report)
  - `RootNotFoundView` (`<BrandLogo />`, client Dark/Light `localStorage` theme sync, sanitized path, 4-locale links, Back to Hub)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-24`: App Router 404 Routes (`global-not-found`, `[...rest]`, Segment Boundaries), Metadata `noindex` Guards & Full Verification
- **Files**: `next.config.ts` *(if required)*, `src/app/global-not-found.tsx`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/[...rest]/page.tsx`, `src/app/[locale]/categories/[category]/{not-found.tsx,page.tsx}`, `src/app/[locale]/tools/[category]/[slug]/{not-found.tsx,page.tsx}`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `src/app/global-not-found.tsx` owning standalone `<html><body>` for bypassed extension/non-locale 404s without duplicating `<html>` on `[locale]` routes
  - Segment-level `not-found.tsx` boundaries (`[locale]`, `categories/[category]`, `tools/[category]/[slug]`) + `[locale]/[...rest]/page.tsx` calling `notFound()`
  - Missing-resource `generateMetadata()` returning `buildNotFoundMetadata()` (`noindex, nofollow`)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` + HTTP `404` smoke checks

---

## Pending / Active Verification Checklist (Contextual 404 Cycle)
- [x] `npm run lint` passes with 0 errors
- [x] `npx tsx scripts/verify-aidlc.ts` passes all baseline + 404 pure engine (`analyzeNotFoundPath`, `findNotFoundSuggestions`, `/admin` exclusion, `?state=` stripping), `buildNotFoundMetadata()`, 4-locale `notFound` parity, `164`-URL sitemap, and single-`<html>` assertions
- [x] `npm run build` succeeds cleanly with zero nested `<html>` tags
- [x] HTTP `404` + `noindex` smoke checks pass for localized catch-all (`/[locale]/missing`), contextual tool/category 404, and extension fallback (`/old-page.html`)

---

### [x] `UNIT-25`: Dependency Cleanup, Pure Cloudflare Telemetry Core (`cloudflare.ts`) & `/cdn-cgi/*` Proxy / Robots Bypass
- **Files**: `package.json`, `package-lock.json`, `.env.example`, `src/lib/telemetry/{cloudflare.ts,index.ts}`, `src/i18n/detect.ts`, `src/proxy.ts`, `src/app/robots.ts`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `CLOUDFLARE_BEACON_SCRIPT_URL = 'https://static.cloudflareinsights.com/beacon.min.js'`
  - `resolveCloudflareBeaconToken(rawToken?: string | null): string | null`
  - `buildCloudflareBeaconConfig(token: string, options?: { spa?: boolean }): string | null`
  - `extractTelemetryPathname(rawUrlOrPath: string): string`
  - `isTelemetryExcludedPath(rawUrlOrPath: string, routeTemplate?: string | null): boolean`
  - `sanitizeTelemetryUrl(rawUrl: string): string`
  - `shouldBypassLocaleProxy('/cdn-cgi/rum') === true` & `src/proxy.ts` matcher excludes `cdn-cgi`
  - `robots()` includes `'/cdn-cgi/*'` in `disallow`
  - Zero `@vercel/analytics` or `@vercel/speed-insights` dependencies in `package.json`
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

### [x] `UNIT-26`: `CloudflareAnalytics.tsx` Client Component & Token-Gated Layout Integration
- **Files**: `src/components/telemetry/CloudflareAnalytics.tsx`, `src/app/[locale]/layout.tsx`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - `CloudflareAnalytics({ token }: { token: string }): React.JSX.Element | null` (`'use client'`, uses `next/script` `strategy="afterInteractive"` inside `<Suspense fallback={null}>`, skips rendering when `isTelemetryExcludedPath(pathname)` is true)
  - Token-gated render in `LocaleRootLayout` via `resolveCloudflareBeaconToken(process.env.NEXT_PUBLIC_CF_BEACON_TOKEN)`
  - `src/app/global-not-found.tsx` remains untouched (zero telemetry)
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` (plus SSG sanity build check with `NEXT_PUBLIC_CF_BEACON_TOKEN=0123456789abcdef0123456789abcdef`)

### [x] `UNIT-27`: 4-Locale Privacy & Sidebar Copy (`en`/`vi`/`ja`/`zh`), Operations Docs & Final Verification
- **Files**: `src/i18n/locales/{en,vi,ja,zh}/common.ts`, `src/i18n/locales/{en,vi,ja,zh}/pages.ts`, `aidlc-docs/operations/release-and-packaging.md`, `scripts/verify-aidlc.ts`
- **Key Interfaces / Contracts**:
  - Updated `CommonDictionary['nav']['privacyDesc']` and `PagesDictionary['privacy']` + `shared.lastUpdatedDate` with 100% recursive leaf-key, section-count, bullet-count, and `{{placeholder}}` parity across `en`, `vi`, `ja`, and `zh`
  - Updated `aidlc-docs/operations/release-and-packaging.md` with Cloudflare Web Analytics setup (`PRE-03`: Manual `NEXT_PUBLIC_CF_BEACON_TOKEN` vs Automatic Setup) & updated route/tool posture
- **Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`

---

## Pending / Active Verification Checklist (Cloudflare Web Analytics Cycle)
- [x] `npm run lint` passes with 0 errors
- [x] `npx tsx scripts/verify-aidlc.ts` passes all baseline + Cloudflare telemetry core (`resolveCloudflareBeaconToken`, `buildCloudflareBeaconConfig`, `isTelemetryExcludedPath`, `sanitizeTelemetryUrl`), `/cdn-cgi/*` proxy bypass, `robots()` `'/cdn-cgi/*'`, `global-not-found.tsx` exclusion, local built HTML zero-`cloudflareinsights.com` check, and 100% 4-locale `privacy` / `privacyDesc` parity assertions
- [x] `npm run build` succeeds cleanly (both default local mode and `NEXT_PUBLIC_CF_BEACON_TOKEN=...` SSG sanity check)


