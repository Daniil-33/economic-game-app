# Engineer -> Reviewer Request

```yaml
review_id: REV-hf-turns-1
project: economic-board-game
effort: EFF-headless-foundation
task: TASK-hf-turns
handoff_revision: 2
base_sha: fc47e5f3aab39021299e003b95d4b20cf292fdaa
head_sha: b0523d8aa4c55816086509566085d41c8e8ab38d
pr: null
```

## Outcome and acceptance criteria

Independently review the full bounded turns implementation and integration:
T01-T09 plus retained K01-K09, under turns-handoff.md revision 2. Prove 45-second
turns, end-before-roll rejection, forced rolls with 20 seconds and retained quotas,
completion/common settlement, fresh doubles turns, third-double prison guard,
strict deadline eligibility, both serialized race orders, atomic unsupported
boundaries, replay and pure core. Verify targetTurnId and receipt identity changes.

## Scope and non-goals

Review exact committed proposal-to-implementation range above on
agent/task-hf-turns in /srv/agents/worktrees/economic-board-game/TASK-hf-turns.
Includes public types/validation, atomic turn transitions, core-owned immutable
versioned fixtures, external Node runner, tooling/tests/spec/evidence and kernel
integration. No real board/catalog, economy, reward amounts, house/offer actions,
prison release, network, UI, persistence or deployment. No PR exists because
hosting authentication is unavailable; assess local range, declare delivery limits.

## Canonical references

AGENTS.md; docs/efforts/headless-foundation.md revision 1;
docs/efforts/headless-foundation/turns-handoff.md revision 2;
docs/efforts/headless-foundation/design.md reconciled at 0d306f9;
docs/product.md section CTO interpretation: turn boundary execution;
docs/architecture.md; docs/development-workflow.md;
openspec/changes/headless-turns/proposal.md at base (accepted exact proposal);
openspec/changes/headless-turns/specs/headless-turns/spec.md;
openspec/changes/headless-foundation/specs/headless-foundation/spec.md T01-T09/K01-K09;
openspec/changes/headless-kernel/; kernel exact head 37eac12 (independent PASS).
Team Lead acceptance is at docs/efforts/headless-foundation/accepted-proposals.md
in project planning checkout. Design RVW-001 disposition: never skip prisoners;
T05 assumes the immediately next ranked participant is free. Reaching a required
imprisoned participant rejects the entire triggering command atomically.

## Required invariants

Pure deterministic versioned core without I/O, Node, platform, clock or random
sources. Trusted explicit time/dice, exact consumption, immutable input state,
atomic rejected/duplicate handling, command ID/revision/turn targeting protection,
ordered events and receipts, no invented financial or prison-release semantics.
CTO: player commands strictly before deadline; Timeout at/after; late commands
never implicitly time out. First/second forced doubles retain same-turn 20 seconds
and quotas then bonus only after settlement; third ends immediately in prison.

## Author verification

Committed openspec/changes/headless-turns/verification.md contains author evidence:
npm ci, typecheck, 20 tests, 11 replay scenarios and AST purity PASS; whitespace
check PASS. packages/game-core/README.md documents exact fixture seed limitations.
Independently verify rather than treating author checks as review evidence.

## Known risks and limitations

Origin advertises no refs; gh unauthenticated. No push, PR, remote mutation, CI,
merge or deployment claimed. In-development schema version 1 extended without
persistence compatibility. Synthetic fixtures prove only bounded transitions.

## Required output

Apply /srv/agents/infrastructure/skills/autonomous-code-review/SKILL.md and its
report contract; load required references. Read-only independent exact-head report
with range validation, coverage, findings, verification, limitations, verdict and
next actor. Do not edit implementation or accept risk. New head requires re-review.

## Re-review

Initial turns implementation review. Prior kernel PASS and non-blocking design
RVW-001 are context only, not acceptance of this changed head.
