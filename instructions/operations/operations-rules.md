# Operations Phase Rules (`instructions/operations/operations-rules.md`)

## Purpose
The **Operations Phase** governs production packaging, deployment readiness, release verification, and ongoing maintenance of **OmniDev / IT-Tools Hub**.

---

## Stage 1: Build, Packaging & Deployment Verification
- Verify production build output (`.next/`) contains all statically generated routes (`/`, 6 `/categories/[category]`, 24 `/tools/[category]/[slug]`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`) and passes smoke checks.
- Ensure target deployment/distribution steps and optional Supabase schema setup documented in [`aidlc-docs/operations/release-and-packaging.md`](../../aidlc-docs/operations/release-and-packaging.md) are verified.

## Stage 2: Continuous Feedback Loop
- Any bug report, UX adjustment, or new tool/feature request triggers a new scoped Inception review and Construction Unit (e.g., `UNIT-05`) recorded in `aidlc-docs/construction/plans/construction-plan.md`, `aidlc-docs/aidlc-state.md`, and `aidlc-docs/audit.md`.
