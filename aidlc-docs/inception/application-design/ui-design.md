# UI/UX Design Specification (`ui-design.md`)

- **Phase**: `INCEPTION`
- **Stage**: `Stage 1.4 — Application & UI Design`
- **Design System**: `Monochrome Zinc Glass + Single Emerald-Mint Accent + 12-Column Bento Grid`
- **Status**: `Validated Baseline (v0.1.0) + i18n UI Delta + Feedback & Admin UI Delta`

---

## 1. Clarified UI Design Decisions

| Dimension | Selection | Specification Summary |
| :--- | :--- | :--- |
| **Target UI Surfaces** | Home Hub (`/`), Category Hubs (`/categories/[category]`), Tool Workspaces (`/tools/[category]/[slug]`), `Cmd+K` Modal | Persistent `AppShell` (268px fixed sidebar + 64px sticky topbar) wrapping a max-width `1320px` Bento canvas. |
| **Visual Aesthetic** | Dark-first Monochrome Zinc Glass + Light Parity (`data-theme="dark"` / `"light"`) | Translucent glass surfaces (`backdrop-filter: blur(16px) saturate(140%)`), `1px` specular inner edge highlights, subtle radial emerald ambient glow, and single `#10B981` / `#059669` accent. |
| **Typography & Motion** | `Inter` (`--font-sans`) + `JetBrains Mono` (`--font-mono`) | Tight display tracking (`-0.03em`), tabular monospace outputs, and smooth `150ms–180ms` hover lift (`translateY(-1px)`). |
| **Responsive Grid** | 12-column Bento Grid (`src/styles/bento.css`) | Collapses cleanly at `1024px` (8-col / 4-col spans) and `640px` (1-col stack + slide-out mobile sidebar drawer). |

---

## 2. Design Tokens (`src/app/globals.css`)

```css
:root,
[data-theme='dark'] {
  --bg-canvas: #09090b;
  --bg-elevated: #111114;
  --bg-modal: rgba(17, 17, 21, 0.88);
  --bg-input: rgba(15, 15, 19, 0.85);
  --glass-surface: rgba(24, 24, 28, 0.68);
  --glass-surface-hover: rgba(34, 34, 40, 0.78);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-highlight: rgba(255, 255, 255, 0.16);
  --glass-specular: rgba(255, 255, 255, 0.06);
  --text-primary: #f4f4f6;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent: #10b981;
  --accent-glow: rgba(16, 185, 129, 0.14);
  --glass-blur: blur(16px) saturate(140%);
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}

[data-theme='light'] {
  --bg-canvas: #f4f4f6;
  --bg-elevated: #ffffff;
  --glass-surface: rgba(255, 255, 255, 0.72);
  --text-primary: #09090b;
  --text-secondary: #52525b;
  --accent: #059669;
  --accent-glow: rgba(5, 150, 105, 0.1);
}
```

---

## 3. Surface-by-Surface Component Specs
1. **App Shell & Command Palette (`AppShell.tsx`, `CommandPalette.tsx`)**:
   - Fixed left navigation rail (`--sidebar-width: 268px`) with category links, pinned tools drawer, and sync mode pill (`Local` vs. `Cloud`).
   - Topbar (`--topbar-height: 64px`) with mobile drawer button, global search trigger (`Cmd+K` / `Ctrl+K`), compact Language Switcher dropdown, and Dark/Light theme switcher.
2. **Bento Grid & Cards (`BentoGrid.tsx`, `BentoCard.tsx`, `src/styles/glass.css`)**:
   - Reusable `.bento-grid` with `.bento-span-12`, `.bento-span-8`, `.bento-span-7`, `.bento-span-6`, `.bento-span-5`, `.bento-span-4`, `.bento-span-3`, and `.bento-row-2` modifiers.
   - `.glass-surface` + `.glass-interactive` cards with specular top highlights and focus-visible outlines.
3. **Tool Workspace (`ToolWorkspace.tsx`)**:
   - Header bar with breadcrumb, single `<h1>`, Pin toggle, Preset manager, and Shareable URL button.
   - Interactive suite area + dropzones/checkerboard previews + How-It-Works card + FAQ accordion + Related Tools Bento row.

---

## 4. Multilingual UI & Typography Specs (i18n Delta)

1. **Topbar Language Switcher (`src/components/layout/LanguageSwitcher.tsx`)**:
   - Positioned in `AppShell` Topbar immediately beside the Theme Toggle so it stays accessible on both Desktop and Mobile (`375px`+).
   - Trigger uses `.btn` Monochrome Zinc Glass styling with `<Globe size={15} />`, uppercase locale code (`EN` / `VI` / `JA` / `ZH`), and `<ChevronDown size={13} />`.
   - Popover menu uses `background: var(--bg-modal)`, `backdrop-filter: var(--glass-blur)`, `1px solid var(--glass-border-highlight)`, `border-radius: var(--radius-md)`, listing `English (EN)`, `Tiếng Việt (VI)`, `日本語 (JA)`, `简体中文 (ZH)` with emerald `<Check size={14} />` on the active option.
   - Full ARIA & keyboard accessibility: `aria-haspopup="listbox"`, `aria-expanded`, `role="listbox"`/`role="option"`, `aria-selected`, `Escape` / outside-click close, `ArrowUp`/`ArrowDown` navigation.
2. **Responsive Mobile Topbar (`<= 640px`)**:
   - Replace fixed `minWidth: 'min(360px, 52vw)'` on the search trigger with responsive `.topbar-search-btn` (`flex: 1; max-width: 360px; min-width: 0`) and hide `<kbd>` shortcut hints and the `"Favorites"` text label below `520px`, keeping `<Star />` + count badge + Language Switcher + Theme Toggle cleanly aligned with zero horizontal overflow at `375px`.
3. **Vietnamese & CJK Typography Stack**:
   - `Inter` and `JetBrains_Mono` loaded with `subsets: ['latin', 'vietnamese']`.
   - `:lang(ja)` appends `'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans JP', sans-serif` after `--font-sans`.
   - `:lang(zh-Hans)` appends `'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif` after `--font-sans` (preserving `Inter` / `JetBrains Mono` for Latin/numeric characters).

---

## 5. Feedback, Ratings & Admin Console UI Specs (`UNIT-12`–`UNIT-13`)

1. **Sidebar Footer Feedback Trigger (`AppShell.tsx`)**:
   - Full-width `.btn` placed in the Sidebar Footer (above the Privacy & Sync panel) with `<MessageSquarePlus size={15} />`, localized label, and subtle count pill when the user has submitted items.
   - Topbar remains untouched so `375px` mobile layout stays overflow-free. No public link to `/admin/feedback`.
2. **Bento Card & Workspace Rating Pill (`BentoCard.tsx`, `ToolWorkspace.tsx`)**:
   - Render `★ 4.8 (12)` using `var(--warning)` (`#fbbf24`) only when `hydrated && ratingCount > 0`.
   - `ToolWorkspace.tsx` adds a compact Bug Report action button (`Bug` icon) in the header actions bar and a `BentoCard span="12"` **below** the interactive tool suite (before How-It-Works/FAQ) hosting `StarRatingWidget` (left) + quick Feedback/Bug CTAs (right).
3. **StarRatingWidget (`src/components/feedback/StarRatingWidget.tsx`)**:
   - Accessible `role="radiogroup"` with 5 star buttons (`ArrowLeft`/`ArrowRight` keyboard support), hover/selected highlight in `var(--warning)`, optional single-line comment (`<= 500` chars), and `.btn-primary` save/update button.
4. **Unified FeedbackModal (`src/components/feedback/FeedbackModal.tsx`)**:
   - Monochrome `.glass-modal-backdrop` + `.glass-modal` (`max-height: 90vh; overflow-y: auto`), `Escape` to close, two tabs: **Submit** and **My Feedback (N)**.
   - Submit tab: type pills (`feedback`, `bug`, `feature`), tool selector (`general` + 24 localized tools), optional title, required message (`10..2000` with live counter), optional email, **Opt-in Debug Context** checkbox + live sanitized JSON `<pre>` preview, hidden `.sr-only-honeypot` field, and `30s` cooldown button countdown.
   - My Feedback tab: status badges (`open`, `in_progress`, `resolved` via `.badge-success`, `closed`) and highlighted `admin_note` reply box when present.
5. **Admin Moderation Console (`/[locale]/admin/feedback` — `AdminFeedbackClient.tsx`)**:
   - `syncMode === 'local'`: `.badge-warning` **Local Mode** banner managing `localStorage` data directly.
   - `syncMode === 'supabase'`: Email/Password sign-in card (zero sign-up UI) when unauthenticated or non-allowlisted; full moderation view once verified via `check_is_feedback_admin()`.
   - 4 Bento KPI cards (`span="3"`), multi-filter bar (type including `rating`, status, tool, keyword), expandable `debug_context` JSON drawer, status selector + `admin_note` editor + Save, and 2-step confirmed Delete action.

---

## 6. Device & Network Diagnostics UI Specs (`UNIT-16`–`UNIT-17`)

All 4 panels strictly reuse Monochrome Zinc Glass tokens (`#09090B`, `#10B981` / `#059669`, `--warning`, `--danger`, `.bento-grid`, `.glass-surface`, `.glass-panel`, `.glass-pill`, `.btn`, `.btn-primary`):

1. **Keyboard Tester (`KeyboardTesterPanel.tsx`)**:
   - Top control bar: Layout toggle (`Full 104` / `TKL 80`), OS Label toggle (`Win` / `Mac`), Capture Browser Keys toggle (with `Esc × 2 to unlock` pill), Click Sound toggle (muted default), Reset button, and 4 KPI pills (`Tested X/Y`, `Total Presses`, `Max NKRO`, `Alerts`).
   - Visual Keyboard Chassis (`.keyboard-chassis`): Horizontally scrollable (`overflow-x: auto`) on narrow viewports so `1u..6.25u` ANSI keycap proportions never break at `375px`. States: default (`--bg-input`), active (`--accent` + glow), tested (`--accent-glow` + `--accent-border`), stuck/chatter (`--warning-bg` / `--danger-bg`).
   - Bottom Bento Split (`span="6"` + `span="6"`): Live Event Inspector (`code`, `key`, `location`, `keyCode`, modifiers, delta ms) and Recent History + Stuck/Chatter Log.
2. **Microphone Tester (`MicTesterPanel.tsx`)**:
   - Control bar: Input `<select>`, Start/Stop Mic `.btn-primary`, Record (`<= 15s`) button, and Permission/HTTPS diagnostic banner (`.badge-warning` / `.badge-danger`) when blocked or insecure.
   - Visualizer Bento Card: `Waveform` / `Spectrum` / `Both` toggle on monochrome HTML5 `<canvas>` (`--accent` trace + `--danger` peak line), horizontal dBFS VU meter, and 3 metric readouts (`Current dBFS`, `Peak dBFS`, `Noise / Clip Status`).
   - Playback Card: `<audio controls>`, Download recording button, and headphone feedback tip.
3. **Speaker & Headphone Tester (`SpeakerTesterPanel.tsx`)**:
   - Control Bento (`span="6"`): Output `<select>` (`setSinkId` with unsupported-browser status pill), **Left / Stereo / Right** selector with live L/R indicators, and **Master Volume** slider (`35%` default, soft warning above `75%`).
   - Signal Generator Bento (`span="6"`): 4 signal cards (**440Hz Tone** + `100Hz`/`440Hz`/`1kHz`/`8kHz` chips, **20Hz–20kHz Sweep** with live Hz readout, **White / Pink Noise**, **Sample Chime**), Play/Stop `.btn-primary`, and active signal indicator.
4. **Network Speed Test (`SpeedTestPanel.tsx`)**:
   - Top Action Bento (`span="12"`): `Quick` / `Standard` preset toggle, `Start Speed Test` / `Abort Test` button, phase progress bar (`Idle → Ping → Download → Upload → Complete`), and `Self-Hosted Same-Origin` badge.
   - 4 KPI Bento Cards (`span="3"`): **Ping (ms)**, **Jitter (ms)**, **Download (Mbps)**, **Upload (Mbps)** in tabular monospace.
   - Bottom Bento Split (`span="7"` + `span="5"`): Real-time SVG throughput chart (`Download` `--accent`, `Upload` secondary dashed) and Suitability Matrix (Video Call, 4K Streaming, Gaming, Cloud Sync) + Local History list (max 20 runs + Clear).

---

## 7. Brand Identity, Global Footer & Info Pages UI Specs (`UNIT-18`–`UNIT-21`)

1. **Terminal Brand Mark (`<BrandLogo />`)**:
   - Rounded squircle canvas (`#09090b`), subtle specular glass rim (`#27272a`), monochrome terminal chevron `>` (`#f4f4f5`) and emerald prompt cursor `_` (`#10b981`) with crisp stroke geometry scaling cleanly from `16px` favicon to `512px` PWA / `1200×630` OG card.
   - Replaces `<Command />` in `AppShell.tsx` Sidebar header (`size={32}`) and anchors `<SiteFooter />` (`size={24}`).
2. **Global `<SiteFooter />` & Sidebar Compact Links**:
   - Mounted inside `.app-main-wrap` below `<main className="app-content">` (`flex: 1`) with Monochrome Zinc Glass border-top, 3 responsive zones: Brand + Privacy tagline, localized `<nav>` for `About`, `Help`, `Privacy`, `Terms`, `Contact`, and GitHub (`rel="noopener noreferrer"`) + Feedback actions.
   - Sidebar Footer adds compact `.sidebar-legal-links` below the Privacy & Sync badge; Topbar remains untouched for `375px` mobile zero-overflow parity.
3. **5 Static Localized Info Pages (`InfoPageLayout.tsx` + `InfoFeedbackActions.tsx`)**:
   - Bento header with breadcrumb, single `<h1>`, subtitle, and last-updated badge.
   - Structured glass cards reflecting truthful architecture (28 tools / 7 categories, local-first storage, `omnidev_locale` cookie, optional Supabase, Mic/Speaker/Speedtest API).
   - `Help / FAQ`: interactive `<details>` FAQ accordion + troubleshooting cards + `FeedbackModal` CTAs.
   - `Contact`: conditional `supportEmail` card (`mailto:` + Copy button) when configured, or direct `FeedbackModal` primary CTA when unset, alongside configured GitHub link.
   - Internal backlink strip linking back to Home Hub, featured categories/tools, and sibling info pages.

