# Planner Intake

Date: 2026-11-05. Owner: Planner.

## Discussion source

The user requested a review of the Monopoly-inspired game's existing context,
next steps, and priorities in the Planner conversation on 2026-11-05.
This request does not authorize implementation or accept new game mechanics.

## Canonical context

- Product and accepted domain constraints: `product.md`.
- Accepted architecture boundaries and preliminary stack: `architecture.md`.
- Accepted phase direction: `roadmap.md`.
- CTO-owned Phase 1 readiness work: `discovery.md`.

## Proposed priorities

1. Agree with the user and CTO on the smallest complete headless scenario and
   its expected behavior. Do not infer unspecified Monopoly rules.
2. Resolve only foundational mechanics needed by that scenario, then agree on
   observable acceptance criteria and explicit non-goals.
3. Have the CTO complete the Phase 1 decision package in `discovery.md` and
   prepare a Team Lead handoff when its readiness conditions are satisfied.

These priorities are proposed, not newly accepted scope or an implementation
assignment. Later financial mechanics, rendering, and platform integrations
remain deferred as described in the roadmap and discovery documents.

## Open decisions

- The user and CTO have not yet agreed on the minimal scenario or Phase 1
  acceptance criteria in the available canonical documents.
- Detailed rules required by the chosen scenario remain to be identified.

No new architecture, stack, budget, or product decision was accepted during
this context review.

## Engine-first clarification — 2026-11-05

Source: the user recalled the next concrete task as a game engine with events
and a StateMachine, followed by additional gameplay layers, and requested
confirmation. Status: user recollection and planning context, not a newly
accepted technical design or an implementation assignment.

The accepted Phase 1 outcome in `roadmap.md` confirms an engine-first direction
with game state, commands, events, turns, and phases. `product.md` DOM-03
requires explicit phases. The available contracts do not yet select a concrete
StateMachine implementation or define its complete transition graph.
`discovery.md` still requires the initial scenario, state/command/event
boundaries, phase transitions, and acceptance evidence to be settled with the
CTO. Additional gameplay layers follow the existing roadmap.

## Confirmed priority and following phase — 2026-11-05

Source: the user's follow-up in the Planner conversation on 2026-11-05.
Status: accepted priority. The user confirmed the basic StateMachine engine
as the current implementation priority, with concrete details to be discussed
with the CTO. This confirms sequencing, not a specific transition graph,
library, API, or implementation-ready acceptance criteria.

The next phase in the accepted roadmap is Multiplayer Foundation:
authoritative sessions, persistence, WebSocket synchronization, reconnect,
idempotency, and recovery. Basic Gameplay follows it. A bare StateMachine
skeleton alone does not complete the Headless Engine phase described in
`roadmap.md`; its remaining outcomes still apply.

Proposed demonstration for CTO planning: multiple clients participate in one
minimal engine scenario; after a disconnect, a participant resumes from the
correct server state, and a retried command has no duplicate effect. This is
an illustrative planning proposal, not accepted Phase 2 acceptance criteria.

## Superseding local-first direction — 2026-11-05

The user's subsequent clarification prioritizes local base-game simulation
before multiplayer. The earlier immediate-multiplayer recommendation above is
superseded. User direction and unresolved rules are recorded in `product.md`,
Local MVP planning direction — 2026-11-05; sequencing is in `roadmap.md`,
Priority clarification — 2026-11-05.

Next CTO planning input: board generation constraints, local simulation scope,
automatic cycle triggers/order, circuit income, credit-limit effects, interest,
and random events. CTO owns technical design within accepted boundaries;
foundational gameplay and acceptance criteria remain for user agreement.
No implementation task has been assigned.

The user then confirmed the three-step sequence: StateMachine; base board
generation/configuration, space types, tick and automatic rules; local
simulation with N players. See `roadmap.md`, Current implementation sequence —
confirmed 2026-11-05. This is the current accepted priority order.
