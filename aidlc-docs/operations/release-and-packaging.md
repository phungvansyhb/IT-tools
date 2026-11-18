# Operations Phase: Release & Packaging (`release-and-packaging.md`)

- **Phase**: `OPERATIONS`
- **Target Environments / Platforms**: `Node.js 20+ SSR / Static Web Deployment (Vercel, Docker, or Node Server)`

---

## 1. Build & Verification Pipeline
```bash
# 1. Install dependencies (if not installed)
npm install

# 2. Lint & static TypeScript checks
npm run lint

# 3. Run AI-DLC registry, deterministic engine, and SEO schema assertions
npx tsx scripts/verify-aidlc.ts

# 4. Production Next.js build (all 31+ static routes + headers)
npm run build
```
Outputs production artifacts into `.next/`.

---

## 2. Release & Deployment Matrix

| Target / Environment | Artifact / Config | Verification & Release Steps |
| :--- | :--- | :--- |
| **Zero-Config Local / Self-Hosted** | `.next/` + `npm run start` | Run `npm run build && npm run start`. Favorites, presets, and pinned snippets work immediately via `localStorage` with zero `.env` variables required. |
| **Cloud Production + Supabase Sync** | `.next/` + `.env.local` + `supabase/schema.sql` | 1. Execute `supabase/schema.sql` in Supabase SQL Editor (`tool_metrics`, `user_favorites`, `saved_presets`, RLS, `increment_tool_metric`).<br>2. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.<br>3. Deploy and verify `/`, `/categories/[category]`, `/tools/[category]/[slug]`, `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest`. |

---

## 3. Security & Privacy Posture
- **Zero Server Payload Storage**: All 24 utilities execute solely inside browser memory (`Web Crypto API`, `HTML5 Canvas`, `FileReader`, `Intl`, `RegExp`).
- **Security Headers (`next.config.ts`)**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Static SEO Endpoints**: `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` are statically generated at build time.
