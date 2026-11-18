# Inception Phase Rules (`instructions/inception/inception-rules.md`)

## Purpose
The **Inception Phase** determines **WHAT** to build and **WHY**, transforming high-level user intent into validated requirements, user stories, architectural boundaries, and independent implementation units ("Bolts") before code construction begins.

---

## Stage 1: Workspace Detection
- Inspect existing repository files (`package.json`, `tsconfig.json`, `next.config.ts`, `src/`, `scripts/`, `supabase/`) to classify the workspace (`Greenfield` vs. `Brownfield`) and record the baseline stack in `aidlc-docs/aidlc-state.md`.

## Stage 2: Requirements Analysis (9-Step Flow)
1. Load existing context from `aidlc-docs/`.
2. Analyze user request for scope, clarity, and complexity.
3. Evaluate across 6 requirement categories:
   - **Functional Requirements (`FR-*`)**
   - **Non-Functional Requirements (`NFR-*`)**
   - **Technical Constraints (`CON-*`)**
   - **Environment / Platform Prerequisites (`PRE-*`)**
   - **Out-of-Scope Exclusions (`EX-*`)**
   - **Success Criteria (`SC-*`)**
4. Ask clarifying questions for any ambiguities.
5. Synthesize validated answers into [`aidlc-docs/inception/requirements/requirements.md`](../../aidlc-docs/inception/requirements/requirements.md).

## Stage 3: User Stories
- Define user-centric stories (`US-*`) with Given/When/Then acceptance criteria in [`aidlc-docs/inception/user-stories/user-stories.md`](../../aidlc-docs/inception/user-stories/user-stories.md), tracing each story back to `FR-*` IDs.

## Stage 4: Application & UI/UX Design
- Document component boundaries, Next.js Server/Client isolation, Supabase schema/fallback contracts, and SEO JSON-LD outputs in [`aidlc-docs/inception/application-design/architecture.md`](../../aidlc-docs/inception/application-design/architecture.md).
- Clarify visual aesthetic, Monochrome Zinc Glass + Bento Grid design tokens, typography, and micro-interactions with the user and document them in [`aidlc-docs/inception/application-design/ui-design.md`](../../aidlc-docs/inception/application-design/ui-design.md).

## Stage 5: Units Generation
- Decompose the system into cohesive, independently verifiable implementation units (**Units / Bolts**) in [`aidlc-docs/inception/units/units.md`](../../aidlc-docs/inception/units/units.md), specifying each Unit's scope, target files, dependencies, and verification criteria.

## Stage 6: Workflow Planning & Gate 1 Sign-Off
- Produce [`aidlc-docs/inception/plans/execution-plan.md`](../../aidlc-docs/inception/plans/execution-plan.md) and [`aidlc-docs/construction/plans/construction-plan.md`](../../aidlc-docs/construction/plans/construction-plan.md) and request explicit user sign-off (**Gate 1**) before executing Construction units.
