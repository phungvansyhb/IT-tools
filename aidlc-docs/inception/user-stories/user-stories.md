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
