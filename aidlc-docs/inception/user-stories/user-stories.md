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
