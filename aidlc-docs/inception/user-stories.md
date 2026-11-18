# OmniDev / IT-Tools Hub — User Stories & Acceptance Criteria

## Personas

1. **Alex (Senior Full-Stack Engineer)**: Needs fast, ad-free, offline-capable utilities (JWT decoder, JSON↔YAML converter, Regex tester, Cron parser) without leaking production tokens to random websites.
2. **Maya (UI/UX & Frontend Engineer)**: Needs perceptual color converters (HEX/OKLCH), WCAG contrast checkers, tonal scale generators, and CSS glassmorphism generators.
3. **Minh (DevOps / Platform Engineer)**: Needs quick `chmod` permission calculators, file SHA-256 checksum verification, byte/bandwidth calculators, and copy-ready Docker/Linux/Git cheatsheets.

---

## User Stories

### US-01: Instant Command Palette Discovery (`Cmd+K`)
**As** Alex, **I want** to press `Cmd+K` (or `Ctrl+K`) anywhere in the app to search tools and cheatsheet commands, **so that** I can jump to the utility I need in under 2 seconds without touching my mouse.

- **Given** the user is on any page in the application
- **When** the user presses `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) or clicks the top search trigger
- **Then** a frosted glass Command Palette modal opens with auto-focused search input
- **And** typing a query (e.g., `"jwt"`, `"sha256"`, `"oklch"`, `"rebase"`) filters matching tools and cheatsheet snippets in real time
- **And** pressing `ArrowUp`/`ArrowDown` and `Enter` navigates directly to the selected tool route, while `Escape` closes the modal.

### US-02: Responsive Bento Grid Hub & Category Exploration
**As** a developer landing on the homepage, **I want** to see a clean Bento Grid highlighting pinned tools, categories, and featured utilities, **so that** I can visually scan and launch tools immediately.

- **Given** the user visits `/`
- **When** the page loads
- **Then** a monochrome zinc glass Bento Hero, Category Bento Matrix (6 categories), Pinned Tools row (if any), and Featured Tools grid render with zero layout shift
- **And** clicking any category card opens `/categories/[category]` showing all tools in that category with SEO overview copy.

### US-03: Privacy-First Browser Tool Execution
**As** Alex, **I want** to decode a production JWT, hash a binary file, or compress a confidential screenshot entirely in the browser, **so that** no sensitive payload ever leaves my device.

- **Given** the user opens `/tools/text/jwt-decoder` or `/tools/file/file-hash` or `/tools/image/image-compressor`
- **When** the user pastes a token or drops a local file
- **Then** all parsing, Web Crypto hashing, or Canvas compression executes synchronously/asynchronously in client memory
- **And** zero network requests containing user input data are sent.

### US-04: Favorites, Presets & Shareable Tool State
**As** Maya, **I want** to pin my most-used color and glassmorphism tools, save custom presets, and copy shareable state links, **so that** I can resume my workflow across sessions.

- **Given** the user is on a tool workspace `/tools/[category]/[slug]`
- **When** the user clicks the **Pin / Favorite** toggle or **Save Preset** button
- **Then** the favorite or preset is saved immediately to `localStorage` (and synced to Supabase if configured)
- **And** reloading the page preserves the pinned status and saved presets.

### US-05: Dark / Light Theme Switching
**As** a developer working in varying lighting conditions, **I want** to switch between Dark and Light monochrome zinc glass themes, **so that** the UI remains legible and comfortable.

- **Given** the user clicks the theme toggle in the top bar
- **When** the theme toggles between `dark` and `light`
- **Then** `data-theme` updates on `<html>` immediately, CSS design tokens adapt glass opacity/borders/text contrast, and the preference persists in `localStorage`.

### US-06: Search Engine Discoverability & Rich Snippets
**As** a developer searching Google for `"online chmod calculator"` or `"jwt decoder"`, **I want** dedicated, fast-loading tool pages with structured How-It-Works guides and FAQs, **so that** I get both the interactive tool and clear reference documentation on one page.

- **Given** a crawler or user requests `/tools/[category]/[slug]`
- **When** Next.js renders the statically generated page
- **Then** the HTML includes a single `<h1>`, descriptive `<title>` and `<meta name="description">`, canonical link, and valid `SoftwareApplication`, `BreadcrumbList`, and `FAQPage` JSON-LD scripts.
