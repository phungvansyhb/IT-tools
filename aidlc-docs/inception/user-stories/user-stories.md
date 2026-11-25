# User Stories (`user-stories.md`)

- **Phase**: `INCEPTION`
- **Stage**: `User Stories`
- **Traceability**: Mapped to [`requirements.md`](../requirements/requirements.md)

---

## Personas

1. **Alex (Senior Full-Stack Engineer)**: Needs fast, ad-free, offline-capable utilities (JWT decoder, JSON↔YAML converter, Regex tester, Cron parser) without leaking production tokens to random websites.
2. **Maya (UI/UX & Frontend Engineer)**: Needs perceptual color converters (HEX/OKLCH), WCAG contrast checkers, tonal scale generators, and CSS glassmorphism generators.
3. **Minh (DevOps / Platform Engineer)**: Needs quick `chmod` permission calculators, file SHA-256 checksum verification, byte/bandwidth calculators, and copy-ready Docker/Linux/Git cheatsheets.

---

## `US-01`: Instant Command Palette Discovery (`FR-02`)
**As** Alex,
**I want** to press `Cmd+K` (or `Ctrl+K`) anywhere in the app to search tools and cheatsheet commands,
**So that** I can jump to the utility I need in under 2 seconds without touching my mouse.

### Acceptance Criteria
- **Given** the user is on any page in the application,
- **When** the user presses `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) or clicks the top search trigger,
- **Then** a frosted glass Command Palette modal opens with an auto-focused search input,
- **And** typing a query (e.g., `"jwt"`, `"sha256"`, `"oklch"`, `"rebase"`) filters matching tools and cheatsheet snippets in real time,
- **And** pressing `ArrowUp`/`ArrowDown` and `Enter` navigates directly to the selected tool route, while `Escape` closes the modal.

---

## `US-02`: Responsive Bento Grid Hub & Category Exploration (`FR-01`, `FR-03`)
**As** a developer landing on the homepage,
**I want** to see a clean Bento Grid highlighting pinned tools, categories, and featured utilities,
**So that** I can visually scan and launch tools immediately.

### Acceptance Criteria
- **Given** the user visits `/`,
- **When** the page loads,
- **Then** a monochrome zinc glass Bento Hero, Category Bento Matrix (6 categories), Pinned Tools row (if any), and Featured Tools grid render with zero layout shift,
- **And** clicking any category card opens `/categories/[category]` showing all tools in that category with SEO overview copy.

---

## `US-03`: Privacy-First Browser Tool Execution (`FR-04`–`FR-09`, `NFR-02`)
**As** Alex,
**I want** to decode a production JWT, hash a binary file, or compress a confidential screenshot entirely in the browser,
**So that** no sensitive payload ever leaves my device.

### Acceptance Criteria
- **Given** the user opens `/tools/text/jwt-decoder`, `/tools/file/file-hash`, or `/tools/image/image-compressor`,
- **When** the user pastes a token or drops a local file,
- **Then** all parsing, Web Crypto hashing, or Canvas compression executes in client memory,
- **And** zero network requests containing user input data are sent.

---

## `US-04`: Favorites, Presets & Shareable Tool State (`FR-10`, `FR-11`, `FR-12`, `NFR-03`)
**As** Maya,
**I want** to pin my most-used color and glassmorphism tools, save custom presets, and copy shareable state links,
**So that** I can resume my workflow across sessions.

### Acceptance Criteria
- **Given** the user is on a tool workspace `/tools/[category]/[slug]`,
- **When** the user clicks the **Pin / Favorite** toggle or **Save Preset** button,
- **Then** the favorite or preset is saved immediately to `localStorage` (and synced to Supabase if configured),
- **And** reloading the page preserves the pinned status and saved presets.

---

## `US-05`: Dark / Light Theme Switching (`NFR-04`)
**As** a developer working in varying lighting conditions,
**I want** to switch between Dark and Light monochrome zinc glass themes,
**So that** the UI remains legible and comfortable.

### Acceptance Criteria
- **Given** the user clicks the theme toggle in the top bar,
- **When** the theme toggles between `dark` and `light`,
- **Then** `data-theme` updates on `<html>` immediately, CSS design tokens adapt glass opacity/borders/text contrast,
- **And** the preference persists in `localStorage`.

---

## `US-06`: Search Engine Discoverability & Rich Snippets (`NFR-01`)
**As** a developer searching Google for `"online chmod calculator"` or `"jwt decoder"`,
**I want** dedicated, fast-loading tool pages with structured How-It-Works guides and FAQs,
**So that** I get both the interactive tool and clear reference documentation on one page.

### Acceptance Criteria
- **Given** a crawler or user requests `/tools/[category]/[slug]`,
- **When** Next.js renders the statically generated page,
- **Then** the HTML includes a single `<h1>`, descriptive `<title>` and `<meta name="description">`, canonical link,
- **And** valid `SoftwareApplication`, `BreadcrumbList`, and `FAQPage` JSON-LD scripts.

---

## `US-07`: Automatic Locale Detection & Legacy URL Redirection (`FR-14`)
**As** an international developer visiting OmniDev for the first time or opening an old bookmark (`/tools/text/jwt-decoder`),
**I want** `/` and unprefixed legacy links to redirect automatically based on my saved cookie or browser language,
**So that** I land immediately in my preferred language without broken links.

### Acceptance Criteria
- **Given** a request arrives at `/`, `/categories/[category]`, or `/tools/[category]/[slug]`,
- **When** `src/proxy.ts` evaluates `Cookie (omnidev_locale)`, then `Accept-Language`, then fallback `'en'`,
- **Then** the server returns a `307` redirect to `/{resolvedLocale}{originalPath}{queryString}`,
- **And** static/metadata endpoints (`/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/_next/*`) are never redirected.

---

## `US-08`: Topbar Language Switching & Cross-Session Persistence (`FR-13`, `FR-16`, `NFR-07`)
**As** a developer using Desktop or Mobile,
**I want** a compact Language Switcher dropdown in the Topbar next to the Theme Toggle,
**So that** I can switch between English, Tiếng Việt, 日本語, and 简体中文 at any time and keep my choice across sessions.

### Acceptance Criteria
- **Given** the user is on any localized route on Desktop or Mobile (`375px`+),
- **When** the user opens the Topbar Language Switcher and selects `vi` (`Tiếng Việt`),
- **Then** `omnidev_locale=vi` is written to both `localStorage` and Cookie, and the app navigates to `/vi/...` (preserving query parameters),
- **And** subsequent visits to `/` automatically resolve to `/vi`.

---

## `US-09`: Seamless Tool Input Preservation During Language Switch (`FR-17`)
**As** a developer mid-way through testing a Regex, editing JSON/YAML, or inspecting a JWT,
**I want** my entered tool inputs and settings to remain intact when I switch UI language,
**So that** I never lose my work when toggling locales.

### Acceptance Criteria
- **Given** the user has modified inputs inside any of the 24 tools on `/en/tools/[category]/[slug]`,
- **When** the user selects another locale from the Topbar Language Switcher,
- **Then** `ToolWorkspace` synchronously saves the active suite state to `sessionStorage` (`omnidev_locale_draft_{toolId}`) before navigation,
- **And** upon mounting `/vi/tools/[category]/[slug]`, the tool suite hydrates with the saved inputs/settings and deletes the temporary `sessionStorage` entry.

---

## `US-10`: Full 4-Tier Localized UI & Bilingual Search (`FR-15`, `NFR-06`)
**As** a Vietnamese, Japanese, or Chinese developer,
**I want** navigation, Bento cards, tool controls, validation errors, cron descriptions, and cheatsheets in my language while still being able to search technical English keywords like `"jwt"` or `"oklch"`,
**So that** the hub feels native without hiding familiar developer terminology.

### Acceptance Criteria
- **Given** the active route is `/vi`, `/ja`, or `/zh`,
- **When** the user opens `Cmd+K` Command Palette or Home Hub search and types either a localized phrase or an English keyword (`"jwt"`, `"chmod"`),
- **Then** matching tools and cheatsheet snippets appear immediately with localized titles/descriptions while preserving technical acronyms and CLI commands verbatim.

---

## `US-11`: Multi-Locale Static SEO, `hreflang`, Sitemap & JSON-LD (`NFR-05`)
**As** a search engine crawler indexing localized developer queries,
**I want** statically pre-rendered pages per locale with proper `<html lang>`, `hreflang` alternates, `inLanguage` JSON-LD, and a complete 124-URL sitemap,
**So that** every language version is accurately indexed and served to regional users.

### Acceptance Criteria
- **Given** `npm run build` completes,
- **When** inspecting `/en/...`, `/vi/...`, `/ja/...`, `/zh/...`, and `/sitemap.xml`,
- **Then** all 124 routes are statically generated with matching `<html lang>` (`en`, `vi`, `ja`, `zh-Hans`), canonical + 5 `hreflang` tags (including `x-default`), localized `BreadcrumbList`/`FAQPage`/`SoftwareApplication` JSON-LD, and 124 sitemap entries with `alternates.languages`.

---

## `US-12`: Per-Tool Star Rating & Public Aggregate Display (`FR-18`, `FR-19`)
**As** Alex,
**I want** to rate each tool from 1 to 5 stars (with an optional short comment) and see the aggregated community star rating on tool cards and workspaces,
**So that** I can signal tool quality and gauge utility reliability without reading anyone else's private comments.

### Acceptance Criteria
- **Given** the user opens `/[locale]/tools/[category]/[slug]`,
- **When** the user selects `1–5` stars in `StarRatingWidget` and submits (or updates their previous rating),
- **Then** the rating is saved locally (`omnidev_tool_ratings`) and upserted to Supabase (`upsert_tool_rating` RPC for `(client_id, tool_id)` when configured),
- **And** the updated average score and rating count appear in `ToolWorkspace` and `ToolBentoCard` while other users' comments remain invisible.

---

## `US-13`: Site-Wide & Tool-Specific Feedback / Bug Submission with Privacy Guard (`FR-20`, `FR-22`, `FR-23`)
**As** Maya,
**I want** to open a unified Feedback modal from the Sidebar Footer (or directly from a tool workspace), preview the exact anonymized technical metadata if I opt in, and submit a feedback/bug/feature report,
**So that** I can report issues effortlessly with full confidence that none of my tool inputs, JWTs, or files leave my browser.

### Acceptance Criteria
- **Given** the user clicks the Sidebar Footer feedback button in `AppShell` or the report button in `ToolWorkspace`,
- **When** the user chooses `feedback`, `bug`, or `feature`, selects a tool (or `'general'`), enters a valid message (`10–2000` chars), and optionally ticks the Debug Context opt-in checkbox,
- **Then** the modal displays the exact sanitized JSON preview (`toolId`, `locale`, stripped `pathname`, `theme`, `viewport`, `platform`, `userAgentShort`) excluding any `?state=` or tool payload,
- **And** submitting passes honeypot and `30s` cooldown checks and persists the item with initial status `'open'`.

---

## `US-14`: Tracking "My Feedback" Status & Admin Replies (`FR-21`, `NFR-08`)
**As** Minh,
**I want** to open the "My Feedback" tab inside the Feedback modal and check whether my submission is `open`, `in_progress`, `resolved`, or `closed` along with any `admin_note`,
**So that** I know the progress of my report without creating an account or exposing other users' submissions.

### Acceptance Criteria
- **Given** the browser has an `omnidev_client_id`,
- **When** the user switches to the "My Feedback" tab in `FeedbackModal`,
- **Then** only submissions belonging to that `omnidev_client_id` are loaded (via `get_my_feedback(p_client_id)` RPC or `localStorage`),
- **And** each item renders its localized status badge and `admin_note` reply if set by an admin.

---

## `US-15`: Secure Admin Feedback Moderation & Local Mode Parity (`FR-24`, `FR-25`, `NFR-10`)
**As** the OmniDev maintainer,
**I want** to visit `/[locale]/admin/feedback` directly to authenticate via Supabase Email/Password (or manage `localStorage` directly in Local Mode), filter all feedback/bugs/features/ratings, reply with `admin_note`, update status, and delete spam,
**So that** I can triage community feedback securely without exposing admin routes to search engines or affecting normal client sessions.

### Acceptance Criteria
- **Given** a search crawler or visitor inspects `/robots.txt`, `/sitemap.xml`, or `/[locale]/admin/feedback`,
- **Then** `/[locale]/admin/feedback` emits `noindex, nofollow`, `/robots.txt` disallows `/admin` and `/*/admin`, and `/sitemap.xml` retains exactly `124` public URLs;
- **When** `syncMode === 'supabase'`, an unauthenticated visitor or non-allowlisted user sees the Email/Password sign-in gate (using the isolated `persistSession: true` admin client) and cannot read or mutate rows;
- **When** an allowlisted `feedback_admins` user signs in (or when `syncMode === 'local'` displays the "Local Mode" banner), the maintainer can filter by type/status/tool/keyword, save status + `admin_note`, inspect `debug_context`, and delete spam entries.

---

## `US-16`: Discovering Device & Network Diagnostics Hub (`FR-26`)
**As** Alex,
**I want** to browse `/[locale]/categories/diagnostics` or search `"keyboard"`, `"mic"`, `"speaker"`, or `"speed test"` in `Cmd+K` Command Palette in any of the 4 supported locales,
**So that** I can launch hardware and network diagnostics immediately alongside my developer tools.

### Acceptance Criteria
- **Given** the app is rendered in `en`, `vi`, `ja`, or `zh`,
- **When** the user navigates to `/[locale]/categories/diagnostics` or searches localized/English keywords in `Cmd+K`,
- **Then** all 4 tools (`keyboard-tester`, `mic-tester`, `speaker-tester`, `speed-test`) appear with localized metadata and full ratings/feedback support.

---

## `US-17`: Visual Keyboard, NKRO & Stuck-Key Diagnostics (`FR-27`, `NFR-13`)
**As** a developer inspecting a laptop or mechanical keyboard,
**I want** an interactive Full-size 104 / TKL 80% visual keyboard with Win/Mac labels, persistent tested-key highlights, stuck-key & chatter warnings, NKRO counter, and Event Inspector,
**So that** I can verify every key without triggering browser shortcuts or getting trapped.

### Acceptance Criteria
- **Given** the user opens `/[locale]/tools/diagnostics/keyboard-tester`,
- **When** the user enables **Capture Browser Keys** and presses `Tab`, `Space`, `F1`–`F12`, or `Cmd/Ctrl+K`,
- **Then** the keys highlight and stay marked as tested, `CommandPalette` does not hijack the keypress,
- **And** pressing `Esc` twice within `600ms` (or clicking Unlock) immediately releases browser key capture, while `blur`/`visibilitychange` clears active keys.

---

## `US-18`: Microphone VU Meter, Visualizer & Record/Playback (`FR-28`, `NFR-12`, `PRE-02`)
**As** a remote engineer preparing for a call,
**I want** to choose my microphone, monitor live dBFS / Waveform / Frequency Spectrum, detect clipping/noise floor, and record a short clip to play back locally,
**So that** I can verify audio input quality with clear guidance if permissions or HTTPS are missing.

### Acceptance Criteria
- **Given** the user opens `/[locale]/tools/diagnostics/mic-tester`,
- **When** microphone access is granted in a Secure Context,
- **Then** live RMS/Peak dBFS, Canvas Waveform/Spectrum, and short `MediaRecorder` playback (`<= 15s`) work locally and release all tracks/AudioContexts on Stop or unmount;
- **And** if permissions are denied or `!window.isSecureContext`, a clear localized troubleshooting banner renders without throwing errors.

---

## `US-19`: Hearing-Safe Stereo Speaker & Headphone Tester (`FR-29`, `NFR-14`)
**As** a user verifying headphones or desktop speakers,
**I want** to test Left, Right, and Stereo channels using 440Hz Tone, 20Hz–20kHz Sweep, White/Pink Noise, or Sample Chime at a safe default volume (`35%`),
**So that** I can confirm stereo imaging and speaker clarity without risking sudden loud bursts.

### Acceptance Criteria
- **Given** the user opens `/[locale]/tools/diagnostics/speaker-tester`,
- **When** the user selects `Left`, `Stereo`, or `Right` and plays any test signal,
- **Then** Web Audio routes strictly to the chosen channel(s) via `ChannelMergerNode(2)` + `DynamicsCompressorNode` limiter starting at `35%` volume with smooth gain ramps, and supports `setSinkId` output selection when available.

---

## `US-20`: Privacy-First Self-Hosted Network Speed Test (`FR-30`, `FR-31`, `NFR-15`)
**As** a developer testing local or production connection quality,
**I want** to measure Ping RTT, Jitter, Download Mbps, and Upload Mbps against self-hosted `/api/speedtest/*` routes with a real-time SVG chart, Abort button, local history, and suitability assessment,
**So that** I can benchmark network speed and stability without sending traffic to third-party trackers.

### Acceptance Criteria
- **Given** the user opens `/[locale]/tools/diagnostics/speed-test`,
- **When** the user starts a `Quick` or `Standard` test,
- **Then** the app runs Ping/Jitter, streaming Download, and XHR Upload against `/api/speedtest/{ping,download,upload}`, plots live throughput in SVG, evaluates Video Call / 4K Streaming / Gaming / Cloud Sync suitability, and saves up to 20 runs in `localStorage`;
- **And** clicking Abort or leaving the page immediately cancels in-flight requests.

---

## `US-21`: Cohesive Brand Identity Across App Shell, Browser Tabs, PWA & Social Cards (`FR-32`, `FR-33`, `FR-34`)
**As** a developer bookmarking, installing as a PWA, or sharing an OmniDev tool link on Slack/Discord/X,
**I want** a consistent Zinc & Emerald `>_` terminal mark in the Sidebar, favicon, Apple touch icon, PWA manifest, and `1200×630` OpenGraph/Twitter social previews,
**So that** the hub looks trustworthy and polished everywhere without broken starter icons or redirected metadata assets.

### Acceptance Criteria
- **Given** a user visits any localized route or installs OmniDev as a PWA,
- **When** the browser or social crawler requests `/icon.svg`, `/favicon.ico`, `/apple-icon`, `/opengraph-image`, `/twitter-image`, `/manifest.webmanifest`, or `/icons/icon-192.png`,
- **Then** `src/proxy.ts` bypasses locale redirection and returns the asset with HTTP `200`,
- **And** `<BrandLogo />` renders the `>_` vector mark inside the `AppShell` Sidebar, while `openGraph.images` / `twitter.images` resolve cleanly against `metadataBase`.

---

## `US-22`: Discovering Help, About, Privacy, Terms & Contact via Footer, Sidebar & `Cmd+K` (`FR-36`, `FR-38`)
**As** Alex or a security-conscious enterprise reviewer,
**I want** clear links to `About`, `Help / FAQ`, `Privacy`, `Terms`, and `Contact` in the global footer, compact sidebar footer, and `Cmd+K` Command Palette,
**So that** I can inspect OmniDev's privacy guarantees, hardware permissions, and troubleshooting docs from any screen in one click or keystroke.

### Acceptance Criteria
- **Given** the user is on any localized page (Desktop or `375px` Mobile),
- **When** the user scrolls to `<SiteFooter />`, checks the Sidebar Footer compact links, or presses `Cmd/Ctrl+K` and searches `"privacy"`, `"faq"`, `"bảo mật"`, or `"contact"`,
- **Then** all 5 info routes appear and navigate cleanly inside the active locale (`/{locale}/{slug}`),
- **And** the Topbar at `375px` remains free of horizontal overflow, and `/[locale]/admin/feedback` remains hidden from public navigation.

---

## `US-23`: Truthful Privacy & Architecture Transparency with One-Click Feedback Contact (`FR-35`, `FR-37`, `NFR-21`)
**As** Maya or Minh evaluating whether JWTs, microphone audio, or speed-test payloads ever leave my browser,
**I want** accurate documentation of client-side execution, `localStorage`/`omnidev_locale` cookies, optional Supabase sync, hardware permissions, and self-hosted `/api/speedtest/*` limits alongside an immediate way to reach maintainers,
**So that** I understand exact data boundaries and can send bug reports or contact maintainers seamlessly even when no support email is configured.

### Acceptance Criteria
- **Given** the user opens `/[locale]/privacy`, `/[locale]/help`, or `/[locale]/contact`,
- **When** `NEXT_PUBLIC_SUPPORT_EMAIL` is unset,
- **Then** `/[locale]/contact` renders a primary button that opens `FeedbackModal` (plus the configured GitHub link from `src/lib/site.ts`), with zero fake `mailto:` placeholders;
- **When** `NEXT_PUBLIC_SUPPORT_EMAIL` is configured,
- **Then** `/[locale]/contact` displays the verified `mailto:` link and Copy button alongside `FeedbackModal` and GitHub links.

---

## `US-24`: Multilingual SSG Indexing & Rich JSON-LD for Backlink & Info Pages (`FR-39`, `NFR-19`)
**As** a search engine crawler indexing localized documentation and legal pages,
**I want** all 5 info pages statically generated in `en`, `vi`, `ja`, and `zh` with `hreflang` alternates, `164` sitemap URLs, internal tool/category backlinks, and Schema.org JSON-LD (`AboutPage`, `FAQPage`, `ContactPage`, `WebPage`, `BreadcrumbList`),
**So that** regional users discover authoritative documentation and internal link equity flows naturally across the hub.

### Acceptance Criteria
- **Given** `npm run build` and `sitemap()` execute,
- **When** inspecting `/sitemap.xml` and built HTML for `/{locale}/{about,help,privacy,terms,contact}`,
- **Then** `sitemap()` contains exactly `164` URLs with `en`, `vi`, `ja`, `zh-Hans`, and `x-default` alternates,
- **And** each info page renders a single `<html lang>` attribute, `canonical` + `og:image`, internal links back to tools/categories, and valid JSON-LD matching the page's Schema.org type and `inLanguage`.

---

## `US-25`: Contextual Multilingual 404 Recovery (`FR-40`, `FR-42`, `FR-43`, `FR-45`)
**As** a developer hitting a mistyped or outdated route such as `/vi/tools/text/jwt-decode`, `/ja/categories/security`, or `/en/faq`,
**I want** to see a localized 404 Bento Hub inside `AppShell` tailored to the missing context (Tool, Category, or General) with accurate "Did you mean?" fuzzy suggestions and category tools,
**So that** I reach the right utility in one click without losing my selected language or hitting a dead-end error screen.

### Acceptance Criteria
- **Given** a visitor opens `/vi/tools/text/jwt-decode` or `/vi/tools/text`,
- **Then** HTTP `404` is returned with `vi` UI inside `AppShell`, displaying the sanitized path (stripping any `?state=...`), suggesting `JWT Decoder` under "Did you mean?", and listing tools in `Xử lý Văn bản`.
- **Given** a visitor opens `/en/categories/security` or `/en/faq`,
- **Then** HTTP `404` is returned with `7` category cards (for Category 404) or closest matches like `Help & FAQ` (for General 404), never surfacing `/admin/feedback`.

---

## `US-26`: Inline Search, `⌘K` Quick Jump & Broken Link Reporting from 404 (`FR-44`, `NFR-23`)
**As** a visitor landing on a 404 page on desktop or mobile (`375px`),
**I want** to search tools inline, open the global `CommandPalette` (`⌘K`), or click "Report Broken Link" to open `FeedbackModal`,
**So that** I can recover immediately or alert maintainers safely without exposing URL query payloads.

### Acceptance Criteria
- **Given** the user is on any localized 404 page,
- **When** clicking **Command Palette** (`⌘K`), `CommandPalette` opens; when clicking **Report Broken Link**, `FeedbackModal` opens with `type="bug"`, `toolId="general"`, and sanitized `Broken link (404): <cleanPath>` title.

---

## `US-27`: Minimalist Monochrome Root 404 for Non-Locale & Extension URLs (`FR-41`, `NFR-22`, `NFR-24`)
**As** a visitor or crawler requesting a legacy `.html`/`.php` URL or invalid locale bypassed by `src/proxy.ts`,
**I want** a clean Monochrome Zinc Glass 404 page with `<BrandLogo />`, `noindex, nofollow`, and quick links to all 4 language hubs,
**So that** every broken URL looks cohesive without breaking `AppShell` or creating duplicate `<html>` tags on valid locale pages.

---

## `US-28`: Cookieless Pageviews & Core Web Vitals via Cloudflare Web Analytics (`FR-46`, `FR-47`, `NFR-27`)
**As** the OmniDev maintainer deploying to Cloudflare,
**I want** Cloudflare Web Analytics (`beacon.min.js`) to load only when a valid `NEXT_PUBLIC_CF_BEACON_TOKEN` is configured while remaining completely unmounted locally and in self-hosted setups without a token,
**So that** I can monitor aggregate traffic and Core Web Vitals (`LCP`, `INP`, `CLS`, `FCP`, `TTFB`) in production with zero npm SDK bloat and zero external requests locally.

### Acceptance Criteria
- **Given** the app is built locally or self-hosted with `NEXT_PUBLIC_CF_BEACON_TOKEN` unset or invalid,
- **When** `src/app/[locale]/layout.tsx` renders any localized page,
- **Then** `<CloudflareAnalytics />` is not mounted and zero `<script>` tags or network calls to `cloudflareinsights.com` occur.
- **Given** the app is deployed on Cloudflare with a valid `NEXT_PUBLIC_CF_BEACON_TOKEN`,
- **When** a visitor navigates across localized routes (`/{locale}/...`),
- **Then** Cloudflare Web Analytics loads via `next/script` (`afterInteractive`) with SPA support enabled and `/cdn-cgi/*` bypasses locale redirects in `src/proxy.ts`.

---

## `US-29`: Strict Token Validation & Admin Route Isolation (`FR-48`, `NFR-26`, `EX-07`)
**As** a privacy-conscious developer or maintainer moderating `/[locale]/admin/feedback`,
**I want** malformed beacon tokens rejected safely and `/admin` routes excluded from mounting the beacon script,
**So that** private moderation sessions are excluded from analytics and tool query payloads (`?state=`) remain private.

### Acceptance Criteria
- **Given** a maintainer navigates directly to `/en/admin/feedback`,
- **When** `<CloudflareAnalytics />` checks `isTelemetryExcludedPath(pathname)`,
- **Then** no Cloudflare beacon script is rendered on the admin route.
- **Given** `NEXT_PUBLIC_CF_BEACON_TOKEN` contains whitespace, quotes, or invalid characters,
- **When** `resolveCloudflareBeaconToken()` runs,
- **Then** it returns `null` and no script tag is injected.

---

## `US-30`: Transparent 4-Locale Privacy Disclosure & Minimal Root 404 (`FR-50`, `NFR-28`, `NFR-29`)
**As** a developer inspecting OmniDev's Privacy Policy or Sidebar disclosure in English, Vietnamese, Japanese, or Simplified Chinese,
**I want** clear, honest documentation explaining that tool payloads stay 100% in browser memory while optional cookieless Cloudflare Web Analytics collects aggregate pageviews and Core Web Vitals,
**So that** I can audit the exact data posture in my preferred language.

### Acceptance Criteria
- **Given** the user reads the Sidebar privacy card or opens `/{locale}/privacy` in `en`, `vi`, `ja`, or `zh`,
- **When** inspecting the disclosure text,
- **Then** all 4 locales accurately explain local payload execution, zero ad cookies, `omnidev_locale` first-party cookie usage, and optional cookieless Cloudflare Web Analytics (no cookies, no `localStorage`, query strings omitted, `/admin` excluded);
- **And** `src/app/global-not-found.tsx` continues rendering cleanly without mounting telemetry scripts.
