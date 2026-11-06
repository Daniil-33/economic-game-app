# Team Lead -> Engineer: independent exact money boundary

```yaml
id: TASK-bg-money
revision: 1
effort: EFF-base-gameplay
project: economic-board-game
source_commit: 569a577
owner: team-lead
status: accepted
```

## Outcome

Deliver pure exact rational quantization and canonical integer money codec,
independent of board/economy execution.

## Acceptance criteria

M01: Q(n/d)=10*floor(n/(10*d)) using bigint; nonnegative numerator, positive
denominator; once at final boundary; zero allowed; no rescaling or minimum.
M02: Canonical unsigned decimal codec, exact round trips, malformed rejection;
accept nonmultiples of ten as input integers without implicit quantization.
M03: Boundary/fraction/large-value independent oracle tests and legacy regression.

## Scope and non-goals

New isolated money utility in packages/game-core, focused tests, money OpenSpec
and evidence/docs only. No command/state/event changes, integration, catalog,
layout, bank, rent dispatch, maximum economic balance or production input policy.

## Canonical references

AGENTS.md; docs/product.md Money quantum clarification at 569a577;
docs/efforts/base-gameplay.md revision 1; docs/architecture.md;
docs/efforts/base-gameplay/reconciliation.md money readiness update;
openspec/changes/base-gameplay-money/ accepted bounded proposal/spec.
Prior board/economy proposal alternatives are superseded only for this value task.

## Constraints and invariants

Pure deterministic core, no I/O/hidden randomness/time, no floating point money
or unsafe conversions. Negative penalties are not signed-floor inputs: quantize
positive obligation; transfers use same amount; redemption reuses stored advance.
These are contracts for later integration, no ledger implementation here.

## Dependencies

Accepted quantum resolves all numeric prerequisites for this helper. No catalog
or bank dependency. Existing design Engineers remain held; no overlapping writes.

## Delegated decisions

Choose utility names, result/error shape and focused test placement consistent
with core. Technical parse resource bounds require justification and evidence.
Do not choose zero-price admission, zero-payment events or reference-price policy.

## Required workflow

Acknowledge exact revision before editing. Explore accepted proposal and report
API/test plan to Team Lead; do not duplicate completed economy design. No Apply
in initial context. Team Lead will confirm and launch fresh Apply via agentctl.
Then Verify -> PR -> independent review -> review fixes. No gate bypass.

## Required checks

Strict typecheck, focused independent-oracle arithmetic/codec tests, existing
full tests/replay and purity checks, git diff --check. Exact-head independent
review and hosted CI required for merge; current evidence and limitations recorded.

## Escalation conditions

Return domain/input semantics, architecture conflicts, shared API changes,
unjustified range limits or inability to prove exactness. No generic P4 blocker.

## Deliverables

Proposal/API checkpoint, code/spec/tests/evidence, exact branch/base/head, PR,
verification/review and residual risks. No full gameplay completion claim.
