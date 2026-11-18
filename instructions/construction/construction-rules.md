# Construction Phase Rules (`instructions/construction/construction-rules.md`)

## Purpose
The **Construction Phase** determines **HOW** to build each approved Unit ("Bolt") and executes code generation, type-checking, testing, and build verification iteratively per Unit.

---

## Per-Unit Execution Loop (Bolt Cadence)
For each Unit defined in [`aidlc-docs/inception/units/units.md`](../../aidlc-docs/inception/units/units.md):

### 1. Functional & NFR Design Check
- Verify data structures, interfaces/contracts, error handling, client-side privacy boundaries (`NFR-02`), and edge cases documented in [`aidlc-docs/construction/plans/construction-plan.md`](../../aidlc-docs/construction/plans/construction-plan.md).
- Ensure strict compliance with all `NFR-*` and `CON-*` constraints from `requirements.md` (including Next.js App Router rules in `node_modules/next/dist/docs/`).

### 2. Code Generation
- Write clean, modular, strictly typed TypeScript/React/CSS code inside project source directories (`src/`, `public/`, `scripts/`, `supabase/`) and NEVER inside `aidlc-docs/`.
- Respect architectural boundaries from `architecture.md` and visual tokens from `ui-design.md`.

### 3. Build & Test Verification
- Run the project verification suite:
  - `npm run lint`
  - `npx tsx scripts/verify-aidlc.ts`
  - `npm run build`
- Fix any errors before marking the Unit complete.
- Mark the completed Unit `[x]` in `aidlc-docs/aidlc-state.md` and `aidlc-docs/construction/plans/construction-plan.md`.
- Append a completed log entry in `aidlc-docs/audit.md`.
