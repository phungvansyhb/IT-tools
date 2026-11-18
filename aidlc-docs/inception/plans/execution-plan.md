# AI-DLC Master Execution Plan (`execution-plan.md`)

- **Phase**: `INCEPTION`
- **Stage**: `Workflow Planning`
- **Gate Status**: `Baseline v0.1.0 Complete — i18n Expansion (UNIT-05..UNIT-09) Ready for Gate 1 Sign-Off`

---

## 1. Adaptive Stage Selection Summary

| Phase | Stage | Execution Decision | Rationale |
| :--- | :--- | :--- | :--- |
| **INCEPTION** | Workspace Detection | **Executed (Completed)** | Classified as `Brownfield` Next.js 16.4.6 + TypeScript + Vanilla CSS + Supabase project. |
| **INCEPTION** | Requirements Analysis | **Executed (Baseline + i18n Delta)** | Validated `FR-01`–`FR-17`, `NFR-01`–`NFR-07`, `CON-01`–`CON-06`, `PRE-01`, `EX-01`–`EX-02`, `SC-01`–`SC-02`. |
| **INCEPTION** | User Stories | **Executed (Baseline + i18n Delta)** | Mapped `US-01`–`US-11` Given/When/Then criteria to `FR-*`. |
| **INCEPTION** | Application & UI Design | **Executed (Baseline + i18n Delta)** | Documented stateless `i18next`, `[locale]` SSG + `src/proxy.ts`, SEO `hreflang`, `sessionStorage` draft sync, Topbar Switcher, and Vietnamese/CJK typography. |
| **INCEPTION** | Units Generation | **Executed (Baseline + i18n Units)** | Decomposed baseline (`UNIT-01`–`UNIT-04`) and i18n expansion (`UNIT-05`–`UNIT-09`). |
| **CONSTRUCTION** | Per-Unit Design & Code Gen | **Pending Gate 1 (`UNIT-05`–`UNIT-09`)** | `UNIT-01`–`UNIT-04` complete; `UNIT-05`–`UNIT-09` queued behind Gate 1 Sign-Off. |
| **CONSTRUCTION** | Build & Test Verification | **Pending (`UNIT-05`–`UNIT-09`)** | Run `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build` after each Unit. |
| **OPERATIONS** | Release & Packaging | **Pending** | Verify `.next/` production static output (124 routes) and deployment/Supabase checklist. |

---

## 2. Construction Execution Sequence

1. **`UNIT-01`** – **`UNIT-04`**: Baseline v0.1.0 Hub, Registry, Supabase/LocalStorage, 24 Tools — *Implemented*
2. **Gate 1 Sign-Off (i18n Expansion)**: User approval of `FR-13`–`FR-17`, architecture, and `UNIT-05`–`UNIT-09`.
3. **`UNIT-05`**: i18n Core Runtime, Locale Detection & Package Setup (`npm install && npm install i18next`)
4. **`UNIT-06`**: Full 4-Language Dictionaries (`vi`, `ja`, `zh`) & Registry / Engine / Cheatsheet Localization
5. **`UNIT-07`**: App Router `[locale]` Routing, Proxy Redirect, SSG & Multi-Language SEO (`124` routes)
6. **`UNIT-08`**: Topbar Language Switcher, App Shell, Command Palette & Common UI Localization
7. **`UNIT-09`**: Tool Workspace, All 6 Tool Suites Localization & `sessionStorage` State Preservation
8. **Full Build & Verification Gate**: `npm run lint && npx tsx scripts/verify-aidlc.ts && npm run build`.
