# Team Lead -> Engineer: Turn boundaries and headless replay scenarios

```yaml
id: TASK-hf-turns
revision: 1
effort: EFF-headless-foundation
project: economic-board-game
source_commit: 0674733f68b754a14a68c32e8a51e1451c046808
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

TASK-hf-design proposal and TASK-hf-kernel accepted result. DO NOT START until
Team Lead revision 2 pins accepted proposal, kernel SHA and finalized interface.
Sequential ownership; no parallel edits to kernel contract.

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
