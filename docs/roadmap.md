# Product Roadmap

## Superseding MVP scope clarification — 2026-11-05

Accepted direct user clarification: base Monopoly-like mechanics form the local
MVP; bank credit and interest are optional layers, not prerequisites for the
first local simulation. Later mechanics must be optional layers too. This
supersedes any mandatory-credit interpretation below. Exact base rules and
acceptance criteria remain under CTO/user discovery; see product.md.

Status: accepted phase direction; individual efforts require planning.

## Priority clarification — 2026-11-05

Accepted user direction, source: Planner discussion on 2026-11-05.
After the basic StateMachine, prioritize a local base-game simulation before
Multiplayer Foundation. Scope: generated CLASSIC_40 boards and definition of
automatic game-cycle and basic credit mechanics; see `product.md`, Local MVP
planning direction — 2026-11-05.

This supersedes the immediate transition from the basic engine to multiplayer
suggested by the table below. CTO planning must reconcile the affected parts of
Basic Gameplay, Financial Systems, and economic events with this local
milestone. Detailed scope and acceptance criteria remain open. The table is the
broader capability roadmap, not authorization to implement all later features.

## Current implementation sequence — confirmed 2026-11-05

Status: accepted user sequencing, source: the user's Planner follow-up on
2026-11-05 summarizing the intended plan.

1. Basic StateMachine engine with state transitions and domain events.
2. Base gameplay: generation and configuration of the 40-space board; define
   space types beyond monopoly companies; define the game tick, its operations,
   and automatic mechanics, then implement the agreed rules.
3. Attempt a local game simulation with N simulated players using those rules.
   N, player decision strategy, run length, and completion criteria remain open.

Concrete behavior and acceptance criteria are to be agreed with the user and
CTO before implementation; this sequence does not assign engineering tasks.
Multiplayer follows the local milestone. The capability phases below provide
the broader roadmap rather than the immediate implementation order.

## Broader capability phases

| Phase | Outcome |
| --- | --- |
| 1. Headless Engine | Versioned game state, commands, events, turns, phases, seeded board generation, and deterministic invariant tests run without server or UI. |
| 2. Multiplayer Foundation | Authoritative sessions, persistence, WebSocket synchronization, reconnect, idempotency, and recovery. |
| 3. Basic Gameplay | Company purchase, rent, construction, auctions, and a basic browser UI work end to end. |
| 4. Financial Systems | Accounts, credit, taxes, mortgages, collection, and bankruptcy preserve accepted financial invariants. |
| 5. Public Companies | IPOs, shares, dividends, control, and financial auctions use a consistent share ledger. |
| 6. Expansion | Economic events, additional business types, Discord/Steam adapters, and balancing extend the existing boundaries. |

The phase order is not blanket authorization to implement all phases. The CTO
may activate the next sufficiently planned phase under the autonomy policy.

Phase 1 must establish the headless foundation without silently implementing
all later mechanics. Phase 2 needs only enough engine behavior to prove the
multiplayer contract. Later mechanics influence boundaries now but receive full
specification near their phase unless they block an earlier contract.

Dates, capacity, budgets, and phase-specific acceptance criteria are set through
CTO planning.
