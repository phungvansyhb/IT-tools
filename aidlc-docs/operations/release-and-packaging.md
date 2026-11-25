# Operations Phase: Release & Packaging (`release-and-packaging.md`)

- **Phase**: `OPERATIONS`
- **Target Environments / Platforms**: `Node.js 20+ SSR / Static Web Deployment (Cloudflare Workers via OpenNext, Cloudflare Pages, Docker, or Node Server)`

---

## 1. Build & Verification Pipeline
```bash
# 1. Install dependencies (if not installed)
npm install

# 2. Lint & static TypeScript checks
npm run lint

# 3. Production Next.js build (178 static routes + dynamic speedtest API routes + headers)
npm run build

# 4. Run AI-DLC registry, deterministic engine, 4-locale parity, telemetry, and built HTML assertions
npx tsx scripts/verify-aidlc.ts
```
Outputs production artifacts into `.next/`.

---

## 2. Release & Deployment Matrix

| Target / Environment | Artifact / Config | Verification & Release Steps |
| :--- | :--- | :--- |
| **Zero-Config Local / Self-Hosted** | `.next/` + `npm run start` | Run `npm run build && npm run start`. Favorites, presets, pinned snippets, and Local Mode feedback work immediately via `localStorage` with zero `.env` variables required. Leave `NEXT_PUBLIC_CF_BEACON_TOKEN` empty so zero external `cloudflareinsights.com` requests occur. |
| **Cloudflare Production (Manual Beacon — Recommended)** | `.next/` + `NEXT_PUBLIC_CF_BEACON_TOKEN` | 1. In **Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site**, select **Manual JS snippet** and copy the site `token`.<br>2. Set `NEXT_PUBLIC_CF_BEACON_TOKEN=<your_token>` in your Cloudflare Workers / Pages environment variables.<br>3. *(Important)* Keep **Automatic Setup** disabled for the same hostname in Cloudflare Dashboard to avoid double-injecting `beacon.min.js`.<br>4. *(Optional Defense-in-Depth)* Under **Web Analytics → Manage site → Rules**, add an exclude rule for `/*/admin/*`.<br>5. Deploy and verify `beacon.min.js` loads on `/{locale}`, does NOT load on `/{locale}/admin/feedback` or `/old-page.html` (`global-not-found`), and Pageviews + Core Web Vitals (`LCP`, `INP`, `CLS`, `FCP`, `TTFB`) appear in Cloudflare Dashboard. |
| **Cloudflare Production (Automatic Setup — 0-Env)** | `.next/` + Cloudflare Proxy / Pages toggle | Leave `NEXT_PUBLIC_CF_BEACON_TOKEN` **empty**, enable **Web Analytics** directly in **Cloudflare Pages → Metrics** or **Analytics & Logs → Web Analytics (Automatic Setup)**, and add a dashboard Rule excluding `/*/admin/*`. `src/proxy.ts` already bypasses `/cdn-cgi/*` so `/cdn-cgi/rum` never hits locale redirects. |
| **Cloud Production + Supabase Sync** | `.next/` + `.env.local` + `supabase/schema.sql` | 1. Execute `supabase/schema.sql` in Supabase SQL Editor (`tool_metrics`, `user_favorites`, `saved_presets`, `tool_ratings`, `feedback_submissions`, `feedback_admins`, RLS & RPCs).<br>2. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (plus optional `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_CF_BEACON_TOKEN`).<br>3. Deploy and verify `/{locale}`, `/{locale}/categories/[category]`, `/{locale}/tools/[category]/[slug]`, `/{locale}/{about,help,privacy,terms,contact}`, `/sitemap.xml` (`164` URLs), `/robots.txt`, and `/manifest.webmanifest`. |

---

## 3. Security & Privacy Posture
- **Zero Server Payload Storage**: All 28 utilities across 7 categories execute solely inside browser memory (`Web Crypto API`, `Web Audio API`, `HTML5 Canvas`, `FileReader`, `Intl`, `RegExp`); `/api/speedtest/*` streams ephemeral PRNG bytes (`<= 4 MiB`) with zero payload or IP retention.
- **Cookieless Cloudflare Web Analytics (`FR-46`–`FR-50`)**: Opt-in via `NEXT_PUBLIC_CF_BEACON_TOKEN` (validated strictly by `resolveCloudflareBeaconToken()`). Collects aggregate Pageviews & Core Web Vitals with zero cookies, zero `localStorage`, zero IP fingerprinting, query strings omitted, and `/admin` + `global-not-found.tsx` excluded.
- **Security Headers (`next.config.ts`)**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Static SEO & Crawler Hygiene**: `/sitemap.xml` (`164` localized URLs with `hreflang`), `/robots.txt` (disallows `/admin`, `/*/admin/*`, `/api/*`, `/cdn-cgi/*`), and `/manifest.webmanifest` are statically generated at build time.
