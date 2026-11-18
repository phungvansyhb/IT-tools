# OmniDev / IT-Tools Hub — Operations & Verification Runbook

## 1. Local Development

```bash
npm install
npm run dev
```

No environment variables are required to run locally. Favorites, pinned cheatsheet snippets, saved presets, and tool usage metrics operate immediately via browser `localStorage`.

---

## 2. Optional Supabase Cloud Sync Setup

1. Create a free-tier project at [supabase.com](https://supabase.com).
2. Execute `supabase/schema.sql` in the Supabase SQL Editor to create `tool_metrics`, `user_favorites`, `saved_presets`, RLS policies, and the `increment_tool_metric` RPC.
3. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

---

## 3. Quality Gates & Automated Verification

```bash
# 1. Lint & type validation
npm run lint

# 2. AIDLC logic & SEO verification suite
npx tsx scripts/verify-aidlc.ts

# 3. Production static & SSR build check (all 31+ routes)
npm run build
```

---

## 4. Security & Privacy Posture

- **Zero Server Payload Storage**: All 24 utilities process inputs solely inside client browser APIs (`Web Crypto`, `HTML5 Canvas`, `FileReader`, `Intl`, `RegExp`).
- **Security Headers**: Configured in `next.config.ts` (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`).
- **Static SEO Endpoints**: `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` are statically generated at build time.
