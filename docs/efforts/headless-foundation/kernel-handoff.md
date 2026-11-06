# Team Lead -> Engineer: Versioned kernel and deterministic setup

```yaml
id: TASK-hf-kernel
revision: 1
effort: EFF-headless-foundation
project: economic-board-game
source_commit: 0674733f68b754a14a68c32e8a51e1451c046808
owner: team-lead
status: accepted
```

## Outcome

Implement the accepted pure execution contract and setup-order state machine,
with meaningful tests and a runnable local package/toolchain.

## Acceptance criteria

Versioned explicit success/rejection/duplicate outcomes and ordered events;
2-6 participants, one d6 each, descending order and tied-only recursive rerolls.
Deterministic replay, complete rejection atomicity, duplicate and stale revision
handling, trusted time/random validation. No dependency on control type or I/O.

## Scope and non-goals

Package/tooling, packages/game-core execution contracts and setup logic, their
specs/tests. No active-turn mechanics, economy, real board generation, transport,
persistence or deployment.

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

TASK-hf-design accepted proposal and exact commit are mandatory. DO NOT START
until Team Lead revision 2 pins proposal/base and final contract. This revision
is decomposition only. TASK-hf-turns follows this task's accepted result.

## Delegated decisions

Implementation structure within accepted contract; strict TypeScript and focused
test tooling. Changes to accepted API/design return to Team Lead.

## Required checks

Typecheck and setup/validation/replay sequence tests, including repeated ties,
invalid d6/random inputs, duplicate commands and stale revisions, no mutation
on rejection, version mismatch, 2/6 counts and illegal counts. Core import and
hidden I/O inspection. Exact-head independent review and CI when available.
