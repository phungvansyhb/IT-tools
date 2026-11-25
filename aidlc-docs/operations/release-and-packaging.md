# Operations Phase: Release & Packaging (`release-and-packaging.md`)

- **Phase**: `OPERATIONS`
- **Target Environments / Platforms**: `Cloudflare Pages (Static Export out/ + Pages Functions), Static Web Hosts, or Node.js 20+`

---

## 1. Build & Verification Pipeline
```bash
# 1. Install dependencies (if not installed)
npm install

# 2. Lint & static TypeScript checks
npm run lint

# 3. Production Next.js static export (outputs out/ with 178 static HTML routes, 404.html, index.html, _headers, _redirects)
npm run build

# 4. Run AI-DLC registry, deterministic engine, 4-locale parity, telemetry, and exported HTML assertions
npx tsx scripts/verify-aidlc.ts
```
Outputs static production artifacts into `out/` alongside Cloudflare Pages Functions in `functions/api/speedtest/`.

---

## 2. Release & Deployment Matrix

| Target / Environment | Artifact / Config | Verification & Release Steps |
| :--- | :--- | :--- |
| **Cloudflare Pages (Recommended — 100% Free, Unlimited Static Bandwidth)** | `out/` + `functions/api/speedtest/*` + `public/{_headers,_redirects,index.html}` | 1. In **Cloudflare Dashboard → Workers & Pages → Create → Pages → Import an existing Git repository**, connect `phungvansyhb/IT-tools`.<br>2. Set **Framework preset**: `Next.js (Static HTML Export)`, **Build command**: `npm run build`, **Build output directory**: `out`.<br>3. Set `NEXT_PUBLIC_SITE_URL` (your production Pages domain) in **Settings → Environment variables**.<br>4. For Analytics & Core Web Vitals, choose **ONE** (never both to avoid double-injection):<br>   - **Option A (1-Click Automatic)**: Go to **Pages Project → Metrics → Enable Web Analytics** (leave `NEXT_PUBLIC_CF_BEACON_TOKEN` empty) and optionally add an exclude rule for `/*/admin/*`.<br>   - **Option B (Manual Token)**: Leave Automatic Setup disabled and set `NEXT_PUBLIC_CF_BEACON_TOKEN=<token>` from **Analytics & Logs → Web Analytics → Manual JS snippet** (`CloudflareAnalytics` automatically excludes `/admin` and `404.html`).<br>5. Verify `/` auto-redirects to `/en` (or preferred locale), `/{locale}`, `/api/speedtest/ping` (`ok`), `/sitemap.xml` (`164` URLs), `/robots.txt`, `/opengraph-image` (`image/png`), and unknown paths serve `404.html` (`noindex`). |
| **Zero-Config Local Preview** | `out/` | Run `npm run build && npx serve out` (or `npm run dev` for development). Favorites, presets, pinned snippets, and Local Mode feedback work immediately via `localStorage` with zero `.env` variables required. |
| **Cloud Production + Supabase Sync** | `out/` + `.env.local` + `supabase/schema.sql` | 1. Execute `supabase/schema.sql` in Supabase SQL Editor (`tool_metrics`, `user_favorites`, `saved_presets`, `tool_ratings`, `feedback_submissions`, `feedback_admins`, RLS & RPCs).<br>2. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (plus optional `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_CF_BEACON_TOKEN`).<br>3. Deploy and verify `/{locale}`, `/{locale}/categories/[category]`, `/{locale}/tools/[category]/[slug]`, `/{locale}/{about,help,privacy,terms,contact}`, `/sitemap.xml` (`164` URLs), `/robots.txt`, and `/manifest.webmanifest`. |

---

## 3. Security & Privacy Posture
- **Zero Server Payload Storage**: All 28 utilities across 7 categories execute solely inside browser memory (`Web Crypto API`, `Web Audio API`, `HTML5 Canvas`, `FileReader`, `Intl`, `RegExp`); Cloudflare Pages Functions `functions/api/speedtest/*` stream ephemeral PRNG bytes (`<= 4 MiB`) with zero payload or IP retention.
- **Cookieless Cloudflare Web Analytics (`FR-46`–`FR-50`)**: Opt-in via `NEXT_PUBLIC_CF_BEACON_TOKEN` or Cloudflare Pages 1-click Automatic Setup. Collects aggregate Pageviews & Core Web Vitals with zero cookies, zero `localStorage`, zero IP fingerprinting, query strings omitted, and `/admin` + `404.html` excluded.
- **Security Headers (`public/_headers`)**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, immutable caching for `/_next/static/*`, and `image/png` MIME headers for `/apple-icon`, `/opengraph-image`, and `/twitter-image`.
- **Static SEO & Crawler Hygiene**: `/sitemap.xml` (`164` localized URLs with `hreflang`), `/robots.txt` (disallows `/admin`, `/*/admin/*`, `/api/*`, `/cdn-cgi/*`), and `/manifest.webmanifest` are statically exported into `out/` at build time.
