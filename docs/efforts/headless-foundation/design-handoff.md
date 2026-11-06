# Team Lead -> Engineer: Design and OpenSpec proposal

```yaml
id: TASK-hf-design
revision: 1
effort: EFF-headless-foundation
project: economic-board-game
source_commit: 0674733f68b754a14a68c32e8a51e1451c046808
owner: team-lead
status: accepted
```

## Outcome

Produce a reviewable technical design and OpenSpec proposal for the complete
bounded effort, without product code or package scaffolding.

## Acceptance criteria

Map all effort acceptance to scenarios and downstream ownership. Specify execution
API, state and event versions, setup tie algorithm, random input consumption,
command validation/idempotency/revision precedence, deadline equality and race
policy. Identify which choices are technical and which require CTO semantics.
Propose explicit fixture boundaries for unknown movement/settlement effects.
Document replay and test plan, tooling selection, and Node runner separation.
Research local hosting/CI facts without provisioning access or creating remotes.
The complete design and proposal are committed before requesting acceptance.

## Scope and non-goals

Only docs/efforts/headless-foundation design material and openspec proposal/
specification material. No product code, package scaffolding or implementation.
Do not accept your own proposal or start Apply.

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

No upstream task. Start from the baseline plus Team Lead handoffs. Kernel and
turns are blocked until this proposal is accepted and their handoffs refreshed.

## Delegated decisions

Choose specification organization and propose internal API/tooling consistent
with accepted TypeScript/Node stack. Team Lead accepts contracts. Turn-boundary
semantic ambiguity must be returned before Apply.

## Required checks

Review accepted-source traceability; verify all scenarios have owners; validate
OpenSpec if a tool is available without silently installing a new global tool.
Run git diff --check. No placeholder implementation tests required.
