# Team Lead -> Engineer: Board model and generation proposal

```yaml
id: TASK-bg-board-design
revision: 1
effort: EFF-base-gameplay
project: economic-board-game
source_commit: d8f434d9703d8d6c832a30c82ee27efe803ff075
owner: team-lead
status: accepted
```

## Outcome

Design a validated configurable CLASSIC_40 board model and reproducible generator without selecting production board or catalog data.

## Acceptance criteria

B01: Account for 40 cells, 22 ordinary assets in 2+6*3+2 groups, four count-based assets, two dice-dependent assets, four named special cells and eight chance cells.
B02: Propose explicit configuration and trusted randomness contracts, deterministic generation, persisted/versioned board result and invalid-config rejection.
B03: Specify ranked +/-10% price boundaries and tier ordering with exact calculations contingent on money policy; identify selection/distribution gaps rather than invent them.
B04: Provide constraint/reproducibility test plans and clearly labelled configurable fixtures; escalate exact indices, catalog/reference prices, placement constraints and N-to-board relationship.

## Scope and non-goals

Own docs/efforts/base-gameplay/board-design.md and openspec/changes/base-gameplay-board/ only. No source/tests/default preset edits, economic integration, special-space effects or catalog invention.

## Dependencies

Parallel with TASK-bg-economy-design; read its handoff but do not write its files. Team Lead reconciles shared board/economy schema before Apply.

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
