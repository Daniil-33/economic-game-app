# Team Lead -> Engineer: Turn boundaries and headless replay scenarios

```yaml
id: TASK-hf-turns
revision: 2
effort: EFF-headless-foundation
project: economic-board-game
source_commit: 37eac12d1f70a46eb8caa6fce40da36408f54532
owner: team-lead
status: accepted
```

## Outcome

Extend the accepted kernel with the effort turn boundaries and a Node-local
scripted scenario runner demonstrating deterministic replay.

## Acceptance criteria

45-second turns; End Turn before roll rejects; pre-roll timeout forces a roll
and grants 20 seconds without resetting quotas; ordinary completion; doubles
start fresh turns; third consecutive doubles enters prison before movement or
reward. Prove ordered events and timer/End Turn races in both orders. Unknown
board/cell/prison-release effects stop at explicit boundaries.

## Scope and non-goals

Active-turn state transitions, legal scripted state/board fixtures, tests and
Node runner outside the core. No complete playable game, generated board,
settlement economy, prison release, frontend, network or persistence.

## Canonical references

AGENTS.md; docs/efforts/headless-foundation.md revision 1;
docs/product.md (MVP baseline approval); docs/architecture.md;
docs/mvp-rules-proposal.md (accepted concrete profile; explicitly open remains open);
docs/roadmap.md; docs/development-workflow.md;
docs/efforts/headless-foundation/technical-plan.md revision 1; openspec/README.md.
Infrastructure autonomy policy and Engineer role apply.

## Constraints and invariants

Pure deterministic TypeScript core; Node.js outside core; explicit trusted time
and randomness; versioned rules/state/commands/events; atomic application;
idempotency and revision race protection; no hidden I/O or randomness. No invented
Monopoly semantics, money conventions, board indices, prison release or setup
timeout. All behavior must trace to accepted sources. Humans/bots have identical
rules. Keep feature branches; do not push/merge without operation records and
verified access. agentctl is the only writer of live runtime state.

## Required workflow

Acknowledge this exact handoff revision with agentctl before editing. Follow
Explore -> Propose -> Apply -> Verify -> PR -> Review fixes. Commit proposal and
report its SHA before requesting Apply. Substantial Apply needs Team Lead
acceptance and a fresh context through agentctl engineer apply. Use agentctl
engineer ask --wake for questions and when ready for Team Lead disposition.
Do not stop silently after reporting a proposal. Do not claim remote CI or merge
when unavailable. No work on another task's scope.

## Escalation conditions

Missing product semantics, architecture conflict, changed public contract,
unplanned scope, blocked dependency or inability to prove acceptance -> Team
Lead. Team Lead routes reserved questions to CTO. Research facts first; list
options, consequences, recommendation and exactly which work is blocked.

## Deliverables

Committed docs/specs and any authorized code/tests, exact base/head, verification
evidence, PR when hosting is available, independent review report at exact range,
and residual risks. No completion claim without current-head acceptance evidence.

## Dependencies

Kernel 37eac12d1f70a46eb8caa6fce40da36408f54532 is technically accepted after
REV-hf-kernel-1 PASS with no findings and Team Lead reproduced typecheck/8 tests.
Use its execution/receipt/setup contract (accepted proposal d989814 and design
5da5697), locally integrated into the planning branch. Read reconciled design
and OpenSpec in your launch base, plus docs/product.md CTO interpretation:
turn boundary execution. Hosting/PR/CI remains a delivery gate, not local
implementation authorization. Sequential ownership; kernel Engineer must not
edit while this task owns extension of its contract.

## Delegated decisions

Implement accepted state transitions and fixture arrangement. No authority to
invent undefined effects or silently settle obligations. Contract changes go
to Team Lead; semantic gaps go through Team Lead to CTO before Apply.

## Required checks

Strict typecheck; meaningful boundary and sequence tests with nonzero quotas;
exact-deadline and both race orders; duplicate/rejected commands produce no
repeated or partial effects; replay compares state/results/events; third doubles
prevents movement/reward. Node local run and core dependency inspection.
Independent review and required CI must apply to exact final head.

## Revision 2 authorization and reconciliation

Explore/Propose authorized; Apply is NOT yet authorized. Commit a bounded turns
proposal and return it for Team Lead acceptance. Apply must start fresh through
agentctl. Mandatory CTO rules: player commands strictly before deadline; Timeout
at/after; no implicit timeout for late player commands. First/second forced
doubles keep the same turn/quotas for 20 seconds and earn fresh bonus only after
completion/mandatory settlement. Third doubles enters prison and ends without
continuation before movement/reward. Revision and target turn ID guard old inputs.

Resolve design RVW-001 consistently with reconciled T05: fixture assumes the
immediately next ranked participant is not imprisoned. Do not skip imprisoned
participants; reaching one stops atomically at the unsupported release boundary.
A blocked transition must retain state/events/dice with an explicit rejection.
Document fixture configuration, ownership and replay initialization without
untrusted financial outcomes or arbitrary callbacks. No real board generator,
prison release, house/offer actions, rewards or economy are authorized.

Re-run kernel tests with new turn integration. K06 kernel-only assertions about
unsupported commands are temporary: update them for completed integration while
preserving setup order, no implicit BeginTurns, actor/phase rejection and K01-K09
invariants. Explain all necessary public type changes in the proposal. Add
T01-T09 and external Node runner; no server/UI. No global installs. Delivery
access remains unverified; do not claim current-head CI, review or merge early.
