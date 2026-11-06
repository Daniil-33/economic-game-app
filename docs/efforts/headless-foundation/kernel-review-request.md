# Engineer -> Reviewer Request

```yaml
review_id: REV-hf-kernel-1
project: economic-board-game
effort: EFF-headless-foundation
task: TASK-hf-kernel
handoff_revision: 2
base_sha: d98981487e59f6044c68afa0eb50e144cde9448d
head_sha: 37eac12d1f70a46eb8caa6fce40da36408f54532
```

## Outcome and acceptance criteria

Independently review K01-K09 kernel implementation against kernel-handoff.md
revision 2 and accepted proposal at base SHA. Verify pure versioned execution,
validation/receipt precedence, deterministic recursive descending setup,
rejection atomicity, trusted exact dice/time, immutable inputs and replay.

## Scope and non-goals

Exact range above: tooling, core kernel/setup, tests and specs/evidence. Known
active-turn commands reject as a temporary task boundary. No turns, complete
board, economy, recovery, network or deployment. Team Lead prepares request
from author report; review remains independent and read-only.

## Canonical references

AGENTS.md; docs/efforts/headless-foundation.md revision 1;
docs/efforts/headless-foundation/kernel-handoff.md revision 2;
docs/efforts/headless-foundation/design.md at 5da5697afdb26f72e5d26873cc1ea623ea89d919;
openspec/changes/headless-kernel/ at base and head; upstream K01-K09 in
openspec/changes/headless-foundation/specs/headless-foundation/spec.md;
docs/product.md; docs/architecture.md; docs/development-workflow.md.
Team Lead acceptance: docs/efforts/headless-foundation/accepted-proposals.md
in project planning checkout. REV-hf-design-1 passed; RVW-001 is a non-blocking
turn-scenario clarification, not permission to skip imprisoned participants.

## Required invariants

Pure deterministic core without Node/I/O/clock/random; versioned contracts and
ordered events; explicit trusted inputs; atomic rejection and duplicate handling;
race revision protection; no invented product semantics or turn behavior.

## Author verification

Author reports npm ci --ignore-scripts, clean-output npm run typecheck, npm test
(8 tests), whitespace check and clean worktree. See
openspec/changes/headless-kernel/verification.md and packages/game-core/README.md.
Reproduce focused checks and inspect correctness independently.

## Known risks and limitations

No remote mutation or CI/PR claim. Hosting access/protection/CI unverified.
execute expects core-created state; saved-state corruption recovery excluded.
Deadline/forced-double semantics still need CTO, outside this kernel scope.

## Required output

Use infrastructure skills/autonomous-code-review/SKILL.md and report contract;
return complete report tied to exact head, with evidence and explicit limits.

## Re-review

First implementation review; no previous implementation findings.
