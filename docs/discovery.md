# Architecture Discovery

Status: active.  
Owner: CTO.

## Goal

Resolve only the decisions needed to hand Phase 1, Headless Engine, to the Team
Lead without prematurely designing later infrastructure.

## Phase 1 decision package

The CTO must define or obtain decisions for:

1. The smallest end-to-end headless game scenario.
2. Initial `GameState`, command, domain-event, result, and error boundaries.
3. Turn and phase transitions required by that scenario.
4. Trusted time and randomness inputs and deterministic consumption.
5. Seeded `CLASSIC_40` generation inputs, output, and reproducibility.
6. Exact monetary representation for the initial engine.
7. Rules/state/event version identifiers.
8. Invariant and simulation evidence required for acceptance.

## Questions reserved for the user when they become blocking

- Missing foundational behavior for the selected minimal scenario.
- A change to the preliminary TypeScript/Node/Vue direction.
- A new mandatory architecture boundary or platform commitment.
- Acceptance criteria that cannot be derived from prior discussion.

The CTO should present researched options and a recommendation rather than raw
questions.

## Deferred unless Phase 1 depends on them

- Database and event-sourcing choice.
- Production hosting and horizontal room distribution.
- Final WebSocket and reconnect protocol.
- PixiJS selection.
- Complete banking, public-company, and bankruptcy algorithms.
- Discord and Steam integration details.

Late mechanics still constrain data and dependency boundaries, but do not need
complete algorithms before their roadmap phase.

## Ready for Team Lead

Phase 1 is ready when expected behavior and acceptance criteria are agreed,
required reserved decisions are closed, the architecture package is internally
consistent, non-goals are explicit, and the Team Lead can decompose the outcome
without inventing product semantics.
