# AI-DLC Append-Only Audit Log (`audit.md`)

> **Rule**: This is an append-only audit trail. Every user input, clarification, approval, and AI action must be logged here with an ISO 8601 timestamp at the end of every prompt. Never overwrite or summarize away historical entries.

---

## [2026-11-18T09:15:00Z] — Prompt 1: Initialize Standard AI-DLC Construction & Governance Structure
- **Phase / Stage**: `INCEPTION / Stage 1.1: Workspace Detection & AI-DLC Governance Standardization`
- **User Input**: `"/init_AIDLC_contructions khởi tạo lại contructions chuẩn cho project, có thể xóa các constuctions hiện tái nếu cần. sau khi làm xong thì commit và push lên git"`
- **Clarifications / Decisions**:
  - **Workspace Classification**: `Brownfield` (`OmniDev / IT-Tools Hub` — Next.js 16.4.6 App Router, TypeScript 5, React 19.3, Vanilla CSS Glassmorphism + Bento Grid, optional Supabase sync).
  - **UI & Packaging Scope**: Web Application with rich UI (`ui-design.md` included; `store-listing.md` omitted as non-store web app).
  - **Legacy Artifact Migration**: Replaced non-standard `aidlc-docs/` files (`inception/requirements.md`, `inception/user-stories.md`, `inception/architecture.md`, `construction/units-plan.md`, `operations/runbook.md`) and migrated all specifications into the standard AI-DLC directory hierarchy (`AGENTS.md`, `instructions/`, `aidlc-docs/`), preserving the Next.js agent rules block in `AGENTS.md`.
- **Artifacts & Files Updated**:
  - Updated [`AGENTS.md`](../AGENTS.md) with standard AI-DLC steering rules while preserving `<!-- BEGIN:nextjs-agent-rules -->` block.
  - Created steering rules under `instructions/`:
    - [`instructions/core-workflow.md`](../instructions/core-workflow.md)
    - [`instructions/common/session-and-audit.md`](../instructions/common/session-and-audit.md)
    - [`instructions/inception/inception-rules.md`](../instructions/inception/inception-rules.md)
    - [`instructions/construction/construction-rules.md`](../instructions/construction/construction-rules.md)
    - [`instructions/operations/operations-rules.md`](../instructions/operations/operations-rules.md)
  - Created standardized AI-DLC living artifacts under `aidlc-docs/`:
    - [`aidlc-docs/aidlc-state.md`](aidlc-state.md)
    - [`aidlc-docs/audit.md`](audit.md)
    - [`aidlc-docs/inception/requirements/requirements.md`](inception/requirements/requirements.md)
    - [`aidlc-docs/inception/user-stories/user-stories.md`](inception/user-stories/user-stories.md)
    - [`aidlc-docs/inception/application-design/architecture.md`](inception/application-design/architecture.md)
    - [`aidlc-docs/inception/application-design/ui-design.md`](inception/application-design/ui-design.md)
    - [`aidlc-docs/inception/units/units.md`](inception/units/units.md)
    - [`aidlc-docs/inception/plans/execution-plan.md`](inception/plans/execution-plan.md)
    - [`aidlc-docs/construction/plans/construction-plan.md`](construction/plans/construction-plan.md)
    - [`aidlc-docs/operations/release-and-packaging.md`](operations/release-and-packaging.md)
  - Removed legacy non-standard files (`aidlc-docs/inception/requirements.md`, `aidlc-docs/inception/user-stories.md`, `aidlc-docs/inception/architecture.md`, `aidlc-docs/construction/units-plan.md`, `aidlc-docs/operations/runbook.md`).
- **Verification & Gate Status**: AI-DLC structure standardized and migrated cleanly; baseline v0.1.0 construction recorded (`UNIT-01`..`UNIT-04`); ready for environment build verification (`Stage 3.1`) or new feature Inception (`Stage 1.2`).

## [2026-11-18T10:20:00Z] — Prompt 2: Multi-Language i18n Expansion (`en`, `vi`, `ja`, `zh`) Implementation
- **Phase / Stage**: `CONSTRUCTION / UNIT-05..UNIT-09 Complete`
- **User Input**: Implemented full 4-language (`en`, `vi`, `ja`, `zh`) internationalization across all 24 tools, 6 categories, cheatsheets, pure deterministic engines, App Router `[locale]` SSG routes, `src/proxy.ts`, multi-language SEO (`hreflang`, `og:locale`, 124-route sitemap), Topbar `LanguageSwitcher`, and `sessionStorage` draft preservation.
- **Artifacts & Code Updated**:
  - `src/i18n/*` (`config.ts`, `types.ts`, `detect.ts`, `translator.ts`, `client.tsx`, `LocaleHtmlLangSync.tsx`)
  - `src/i18n/locales/{en,vi,ja,zh}/*` (`common.ts`, `catalog.ts`, `tools.ts`, `cheatsheets.ts`, `index.ts` — 950 leaf keys × 4 locales)
  - `src/lib/tools/registry.ts`, `src/lib/tools/data/cheatsheets.ts`, `src/lib/tools/engines/{file,text,calculators}.ts`
  - `src/proxy.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx`, `src/app/globals.css`, `src/app/[locale]/*`
  - `src/components/layout/{LanguageSwitcher,AppShell,CommandPalette}.tsx`, `src/components/home/HomeHubClient.tsx`, `src/components/bento/BentoCard.tsx`, `src/components/common/CopyButton.tsx`, `src/components/tools/ToolWorkspace.tsx`, and all 6 suites in `src/components/tools/suites/*`
  - `scripts/verify-aidlc.ts` (4-locale parity, 124-route sitemap, localized engines/registry/cheatsheets checks)
- **Verification & Gate Status**: `npm run lint`, `npx tsx scripts/verify-aidlc.ts`, and `npm run build` (131 static routes generated) passed with exit code 0.

## [2026-11-18T10:30:00Z] — Prompt 3: i18n Polish & Verification Fixes (`NFR-05`, `NFR-07`, `FR-17`, `ui-design.md`, `construction-plan.md`)
- **Phase / Stage**: `CONSTRUCTION / UNIT-05..UNIT-09 Polish & Verification Gate`
- **User Input**: Applied final compliance polish for SSR `<html lang>` per locale (`NFR-05`), `375px` mobile topbar responsiveness (`NFR-07`), `LanguageSwitcher` keyboard accessibility (`ui-design.md`), 100% state preservation across all 6 suites (`FR-17`), and `construction-plan.md` checklist sign-off.
- **Artifacts & Code Updated**:
  - Migrated Root Layout ownership to `src/app/[locale]/layout.tsx` (`<html lang={LOCALE_META[locale].htmlLang}>` + fonts + global CSS) and removed `src/app/{layout,page,not-found}.tsx`.
  - Updated `src/components/layout/AppShell.tsx` and `src/app/globals.css` with `.topbar-search-btn`, `.topbar-search-text`, `.topbar-fav-label`, and `@media (max-width: 640px)` rules for zero horizontal overflow at `375px`.
  - Added full `ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter`, `Space`, and `Escape` focus management to `src/components/layout/LanguageSwitcher.tsx`.
  - Refactored `src/components/tools/ToolWorkspace.tsx` (`currentStateRef` + `1_500_000`-char `sourceImg.dataUrl` cap) and completed `initialState`/`onStateChange` fields in `ImageToolsSuite.tsx`, `FileToolsSuite.tsx`, `TextToolsSuite.tsx`, `CalculatorToolsSuite.tsx`, and `CheatsheetToolsSuite.tsx`.
  - Updated `aidlc-docs/construction/plans/construction-plan.md` (`[x]` for `UNIT-05`..`UNIT-09` and verification items) and added built HTML `<html lang="...">` checks in `scripts/verify-aidlc.ts`.
- **Verification & Gate Status**: `npm run lint`, `npx tsx scripts/verify-aidlc.ts`, and `npm run build` verified cleanly with SSR `<html lang="en|vi|ja|zh-Hans">` across static HTML outputs.

## [2026-11-18T11:30:00Z] — Prompt 4: Feedback, Tool Ratings, Bug Reporting & Admin Moderation Console (`UNIT-10`–`UNIT-13`)
- **Phase / Stage**: `CONSTRUCTION / UNIT-10..UNIT-13 Complete (Gate 1 Approved → Full Verification Passed)`
- **User Input**: `"dùng /do_task làm tính góp ý, đánh giá, báo lỗi"`
- **Clarifications / Decisions**:
  - **Storage & Sync**: Hybrid `localStorage` + Supabase client SDK (`@supabase/supabase-js`) with zero server secrets and full `local` mode fallback (`FR-18`, `FR-25`, `CON-07`, `CON-09`).
  - **UI Scope & Placement**: Two-level UX — per-tool `1–5★` rating & quick bug report inside `ToolWorkspace.tsx`, plus site-wide trigger in `AppShell.tsx` Sidebar Footer opening unified `FeedbackModal` (preserving `375px` mobile Topbar fit).
  - **Visibility & Privacy (`NFR-08`, `NFR-09`)**: Public average star rating & count only; client-scoped "My Feedback" via `omnidev_client_id`; strict RLS blocking direct `anon SELECT/UPDATE/DELETE` with `SECURITY DEFINER` RPCs; opt-in debug context with live JSON preview stripping `?query`/`#hash` (zero tool input/state capture).
  - **Anti-Spam**: `1` rating per `(client_id, tool_id)` upsert, hidden Honeypot field, `30s` cooldown, and length/email validation.
  - **Admin Console (`/[locale]/admin/feedback`)**: Supabase Email/Password Auth + `feedback_admins` allowlist RLS + isolated `persistSession: true` client (plus Local Mode managing `localStorage`), 4 statuses (`open`, `in_progress`, `resolved`, `closed`), multi-filter bar, `admin_note` replies, 2-step spam `DELETE`, `noindex/nofollow`, `robots.ts` disallow, and excluded from `sitemap.ts` (`124` public URLs).
  - **Gate 1 Sign-Off**: Approved by user prior to `UNIT-10`–`UNIT-13` implementation.
- **Artifacts & Code Updated**:
  - `aidlc-docs/` (`requirements.md`, `user-stories.md`, `architecture.md`, `ui-design.md`, `units.md`, `execution-plan.md`, `construction-plan.md`, `aidlc-state.md`, `audit.md`).
  - `supabase/schema.sql`, `src/lib/supabase/client.ts`.
  - `src/lib/feedback/{types,validation,debug-context,aggregation,local-store,index}.ts`.
  - `src/i18n/types.ts`, `src/i18n/locales/{en,vi,ja,zh}/common.ts`, `src/app/robots.ts`.
  - `src/hooks/{useUserWorkspace,useFeedback}.tsx`, `src/components/feedback/{StarRatingWidget,FeedbackModal}.tsx`, `src/components/layout/AppShell.tsx`, `src/components/tools/ToolWorkspace.tsx`, `src/components/bento/BentoCard.tsx`, `src/app/[locale]/layout.tsx`, `src/app/globals.css`.
  - `src/app/[locale]/admin/feedback/page.tsx`, `src/components/admin/AdminFeedbackClient.tsx`, `scripts/verify-aidlc.ts`.
- **Verification & Gate Status**: `npm run lint`, `npx tsx scripts/verify-aidlc.ts`, and `npm run build` (134 static routes including 4 `noindex` admin pages; 1067 keys × 4 locales; 124 sitemap URLs; `robots.ts` admin disallow; pure feedback & debug-context assertions) passed with exit code 0.

## [2026-11-19T02:36:00Z] — Prompt 5: Device & Network Diagnostics Category & 4 Tools (`UNIT-14`–`UNIT-17`)
- **Phase / Stage**: `CONSTRUCTION / UNIT-14..UNIT-17 Complete (Gate 1 Approved → Full Verification Passed)`
- **User Input**: `"/do_task thêm tính năng test bàn phím , test mic, test loa , đo tốc độ mạng và gom chúng vào 1 category mới"`
- **Clarifications / Decisions**:
  - **Category & Tool Naming (`A1`)**: New category `diagnostics` (*"Device & Network"* / *"Thiết bị & Mạng"*, icon `Activity`), expanding the hub to `7` categories / `28` tools / `144` sitemap URLs across `en`, `vi`, `ja`, `zh`, with 4 tools: `keyboard-tester`, `mic-tester`, `speaker-tester`, `speed-test`.
  - **Speed Test Backend (`A2`)**: Self-hosted Next.js Route Handlers (`/api/speedtest/{ping,download,upload}`) with `force-dynamic`, `runtime = 'nodejs'`, `no-store`/`no-transform` anti-cache/compression headers, incompressible xorshift32 payloads, same-origin validation, and `<= 4 MiB` streaming upload cap (`413`).
  - **Speed Test UX (`A3`)**: Full 4 metrics (Ping RTT, Jitter, Download Mbps, Upload Mbps), `Quick`/`Standard` presets, Start/Abort, real-time SVG chart, task suitability ratings (Video Call, 4K Streaming, Gaming, Cloud Sync), and local history (`omnidev_speedtest_history`, max 20).
  - **Keyboard Tester (`A4`)**: Visual ANSI Full-size 104 / TKL 80%, Win/Mac labels, persistent tested-key highlights, stuck-key & chatter detection, NKRO & total presses, Event Inspector, Capture Browser Keys mode (`Esc × 2` unlock + `AppShell` `defaultPrevented` guard), and muted-default Web Audio click.
  - **Mic & Speaker Diagnostics (`A5`)**: Mic input selector, VU/dBFS + Canvas Waveform/Spectrum, noise/clipping status, `<= 15s` Record/Playback/Download, Secure Context/permission guidance; Speaker output selector (`setSinkId` + fallback), `ChannelMergerNode(2)` Left/Stereo/Right, Tone/Sweep/Noise/Chime, hearing-safe `35%` default volume + `DynamicsCompressorNode` limiter.
  - **Gate 1 Sign-Off**: Approved by user prior to `UNIT-14`–`UNIT-17` implementation.
- **Artifacts & Code Updated**:
  - `aidlc-docs/` (`requirements.md`, `user-stories.md`, `architecture.md`, `ui-design.md`, `units.md`, `execution-plan.md`, `construction-plan.md`, `aidlc-state.md`, `audit.md`).
  - `src/lib/tools/engines/diagnostics.ts`, `src/app/api/speedtest/{ping,download,upload}/route.ts`, `src/app/robots.ts`.
  - `src/i18n/types.ts`, `src/i18n/locales/{en,vi,ja,zh}/{common,catalog,tools}.ts`, `src/lib/tools/registry.ts`, `src/components/common/ToolIcon.tsx`, `src/components/tools/ToolWorkspace.tsx`.
  - `src/components/layout/AppShell.tsx`, `src/components/tools/suites/DiagnosticsToolsSuite.tsx`, `src/components/tools/suites/diagnostics/{KeyboardTesterPanel,MicTesterPanel,SpeakerTesterPanel,SpeedTestPanel}.tsx`, `src/app/globals.css`, `scripts/verify-aidlc.ts`.
- **Verification & Gate Status**: `npm run lint`, `npm run build` (154 static pages + 3 dynamic `/api/speedtest/*` routes), and `npx tsx scripts/verify-aidlc.ts` (all 8 suites: 7 categories, 28 tools, 144 sitemap URLs, 1,262 keys × 4 locales parity, `robots.ts` `/admin` + `/api/*` disallow, pure diagnostics engine assertions) passed with exit code 0.

## [2026-11-19T03:22:00Z] — Prompt 6: Keyboard Tester Default Browser Action Prevention & Focus Audit
- **Phase / Stage**: `CONSTRUCTION / Hotfix & Hardening (Keyboard Tester)`
- **User Input**: `"khi test phím space thì màn hình bị cuộn theo mặc định, cần để ý nhưng case kích hoạt hành động mặc định của trình duyệt, hãy fix lỗi và rà soát"`
- **Clarifications / Decisions**:
  - Added pure `shouldPreventDefaultBrowserKey()` in `src/lib/tools/engines/diagnostics.ts` to prevent default browser actions outside editable inputs and modal dialogs (`[role="dialog"][aria-modal="true"]`) even when Capture Mode is off:
    - Scrolling keys (`Space`, `ArrowUp`/`Down`/`Left`/`Right`, `PageUp`/`PageDown`, `Home`, `End`)
    - Focus / navigation / activation / menu keys (`Tab`, `Enter`, `NumpadEnter`, `Backspace`, `ContextMenu`, `AltLeft`/`AltRight`)
    - Browser help/find/address-bar/caret/menu function keys (`F1`, `F3`, `F6`, `F7`, `F10`) and Firefox Quick Find (`Slash`, `Quote` without modifiers)
    - Kept `Cmd/Ctrl+K` (CommandPalette) and `F5` working outside Capture Mode, and prevented all keys when `captureMode === true` (with `Esc × 2` safe unlock).
  - Attached `keydown`/`keyup` on `{ capture: true }` and suppressed keyboard-triggered `contextmenu` events (`ContextMenu` key / `Shift+F10` or Capture Mode).
  - Added `tabIndex={-1}` on keycaps and `onMouseDown={(e) => e.preventDefault()}` on keycap & toolbar buttons so mouse clicks never trap focus on buttons.
- **Artifacts & Code Updated**:
  - `src/lib/tools/engines/diagnostics.ts`, `src/components/tools/suites/diagnostics/KeyboardTesterPanel.tsx`, `scripts/verify-aidlc.ts`, `aidlc-docs/audit.md`.
- **Verification & Gate Status**: `npm run lint`, `npm run build` (154 static pages + 3 dynamic `/api/speedtest/*` routes), and `npx tsx scripts/verify-aidlc.ts` (all 8 suites including `shouldPreventDefaultBrowserKey()` assertions) passed with exit code 0.
