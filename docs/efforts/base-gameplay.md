# CTO -> Team Lead: base gameplay

id: EFF-base-gameplay
revision: 1
project: economic-board-game
created_at: 2026-11-06
owner: cto
status: accepted for Explore/Propose; Apply gated per bounded task
source_commit: 6b1413b (merged foundation, PR #1)

## Outcome

Prepare and deliver the next accepted roadmap slice: generated CLASSIC_40 board
and base economic cycle on the existing pure TypeScript/Node.js core. First
observable scenario: create board, calculate equal starting funds, move one
player onto a free asset, buy it, move another onto it, transfer correct rent,
and award the agreed circuit reward on a forward start crossing. Replay must
reproduce complete state/events and preserve duplicate/race/atomicity contracts.
User explicitly authorized initiation on 2026-11-06; evidence:
/srv/agent-runtime/state/inbox/VOICE-20261106T154640221364Z-a61597/transcript.txt.
Earlier concrete profile approval evidence:
/srv/agent-runtime/state/inbox/VOICE-20261106T125957975023Z-fb8271/transcript.txt.

## Sources and accepted behavior

AGENTS.md; docs/product.md; docs/mvp-rules-proposal.md accepted-status notice;
docs/architecture.md; docs/roadmap.md; docs/development-workflow.md; existing
OpenSpec foundation/kernel specs and merged source. Accepted profile: 2-6
players; 40 cells with 22 ordinary assets, four count-based assets, two
dice-dependent assets, four named special cells and eight chance cells. Ranked
price generation +/-10%, alpha=600/569 for equal initial cash, ordinary bare
rent 5%, complete-group rules, count/dice-group formulas, reward 2/15 initial
cash, fixed per-session prices. No familiar external Monopoly rules assumed.

## Current readiness and task gates

There is scope and authorization for Explore/Propose now, not blanket readiness
for full-game Apply. Produce technical design and OpenSpec proposals, decompose
bounded tasks, and present exact unresolved product decisions to CTO. Do not
implement economic defaults or complete board presets before these decisions
are recorded canonically. Independent tasks whose behavior is fully accepted
may Apply after proposal approval and current handoff acknowledgement.

Blockers before generated default-board/economy Apply: exact cell indices and
placement constraints; actual catalog/reference prices; money denomination and
rounding for cash/rent/reward; N-to-board relationship. Team Lead may design
validated configurable inputs/fixtures but must not promote fixture values to
production rules. Examine and escalate uncovered integration semantics, e.g.
bank payments, landing on special cells, insufficient cash and purchase refusal.
No invented fallback transitions; clear boundaries are allowed for partial work
but cannot be reported as a complete playable session.

## Scope, non-goals and dependency order

Initial engineering packages: Explore/Propose; exact-money/value boundary;
board model and reproducible generation; basic movement/landing integration;
fixed purchase/rent/reward atomic operations; agreed auction integration as a
separate bounded task if ready. Team Lead owns technical ordering and task size.
Houses, async trades, mortgages/collection/bankruptcy and full simulation remain
accepted later product scope but are not all required for this first slice.
Credit/rates, frontend, network, persistence, deployment and platform adapters
are excluded. Special spaces retain identity in board data; implementing their
full effects requires explicitly scoped subsequent tasks, never silent no-ops.
Collective mortgage counter and multilateral chance debts are deferred.

## Delegation and architecture

Team Lead owns compliant API/schema, generator strategy, decomposition, tooling
and verification; keep node:test, node:assert/strict and tsc absent a concrete
need to change. Core is deterministic, no I/O/hidden random/time, exact finances,
atomic transitions, explicit trusted inputs, versioned rules/state/events/board
result and command idempotency/race protection. UI/server adapters cannot own a
second rules engine. Product/stack changes and unknown game semantics escalate
to CTO, then User if reserved. Fresh Engineer context for substantial Apply.

## Evidence and completion

Tests for composition/group constraints, price boundaries/order, same-input
reproducibility, invalid config rejection, exact-money rounding once accepted,
atomic purchase/rent/reward and no duplicate effects, plus the first end-to-end
scenario. Ensure previous foundation/replay tests remain green. Independent
exact-head review and hosted CI, PR into protected main, accepted integrated
result and specs/docs reconciliation required for completed delivery.
No new spend/access/production work. Existing runtime resource limits apply.
Acknowledge revision 1 and return design/decomposition and focused decision
package. Report current task, blockers and realistic ETA (estimate, not promise).
