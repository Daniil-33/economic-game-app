# Team Lead -> Engineer: Exact money and economic cycle proposal

```yaml
id: TASK-bg-economy-design
revision: 1
effort: EFF-base-gameplay
project: economic-board-game
source_commit: d8f434d9703d8d6c832a30c82ee27efe803ff075
owner: team-lead
status: accepted
```

## Outcome

Design exact-money/value boundaries and atomic movement/purchase/rent/reward integration on the existing command kernel, with explicit unsupported boundaries.

## Acceptance criteria

E01: Specify exact representation options, rational calculations, serialization/range/rounding boundaries; leave denomination and rounding selection to CTO/User.
E02: Trace equal cash alpha=600/569*S/N; ordinary bare/full-group rent, count-based and dice-group formulas; reward 2/15 initial cash; fixed session prices.
E03: Design move-to-free-asset/buy/second-player-rent/forward-start-crossing scenario with full state/event replay, receipt identity and race protection.
E04: Identify bank accounting, insufficient cash, buy refusal/auction, special-space landings, crossing/multiple crossings, complete-group/mortgage dependencies and settlement boundaries; distinguish accepted rules from unresolved integrations.
E05: Propose minimal independently reviewable Apply packages for money, movement and atomic economics, plus auction integration only if ready. No silent no-op or fallback turn transitions.

## Scope and non-goals

Own docs/efforts/base-gameplay/economy-design.md and openspec/changes/base-gameplay-economy/ only. No source/tests edits, full simulation, houses, offers, credit, mortgages or bankruptcy implementation.

## Dependencies

Parallel with TASK-bg-board-design; propose a board interface without writing board-owned files. Money policy gates numeric Apply; board integration follows reconciled board contract.

## Canonical references

AGENTS.md; docs/efforts/base-gameplay.md revision 1; docs/product.md;
docs/mvp-rules-proposal.md accepted baseline notice; docs/architecture.md;
docs/development-workflow.md; openspec/changes/headless-foundation/,
headless-kernel/ and headless-turns/; packages/game-core/src/.

## Constraints and invariants

Pure deterministic TypeScript core; no I/O, hidden time/randomness or platform
imports. Explicit trusted inputs, exact atomic finances, immutable inputs,
versioned rules/state/events/generated result, duplicate/race protection.
Fixture configuration is proof data, never a production default or product rule.
Preserve foundation behavior or explicitly propose versioned compatibility.
Keep node:test, node:assert/strict and tsc unless a concrete need is established.

## Delegated decisions

Choose internal schema/API, validation and algorithm proposals within accepted
boundaries. Do not choose missing product semantics. Return technical interface
conflicts to Team Lead and product/architecture gaps through Team Lead to CTO.

## Required workflow

Acknowledge handoff revision 1 through agentctl before editing. Explore ->
Propose only in this run: commit a design, OpenSpec proposal/tasks/spec delta,
and decision package. Report exact SHA and ask Team Lead for disposition using
agentctl engineer ask --wake. Do not Apply, publish, or open a PR yet.
Substantial Apply requires accepted durable proposal, updated handoff if scope
changes, and a fresh Engineer context launched through agentctl.

## Required checks

Audit every proposed behavior against accepted sources; label unresolved
semantics explicitly. Map acceptance IDs to executable future sequence tests,
including replay, immutable rejection/duplicate, stale revision and atomicity.
Run git diff --check. No runtime tests required for documentation-only changes.
Eventual implementation requires strict typecheck, complete existing tests/replay,
focused invariant/sequence tests, independent exact-head review and hosted CI.

## Escalation conditions

Missing product semantics, architecture conflict, changed public contract,
unplanned scope, blocked dependency, or inability to prove an acceptance criterion.
Continue independent design while clearly gating affected behavior.

## Deliverables

Committed scoped design and OpenSpec proposal, acceptance traceability, exact
branch/base/head, unresolved questions with facts/options/consequences and a
recommendation; proposed later Apply boundaries. No code in this stage.
