# Team Lead -> Engineer Task Handoff

```yaml
id: TASK-hf-ci
revision: 1
effort: EFF-headless-foundation
project: economic-board-game
source_commit: a9afba2c5b4a8788ef8ca7d9f93d0f2e0f980a9c
owner: team-lead
status: accepted
```

## Outcome

Add minimal hosted GitHub Actions verification for the accepted integrated
headless foundation in draft PR #1, without changing game behavior.

## Acceptance criteria

A pull request into main and a feature-branch push run committed-lockfile install,
strict typecheck, all standard tests including subprocess replay, and the Node
replay script. Use a stable check/job name suitable for required-check protection.
No secrets, deployments, write permissions or bypasses. Local checks pass and
workflow is independently reviewable at exact head; hosted PASS must be observed
at the eventual published PR head before claiming completion.

## Scope and non-goals

Only .github/workflows validation and concise delivery docs/evidence. No product
code, package version changes, domain/spec semantics, branch-protection mutation,
deployment or secrets. If existing scripts need modification, return to Team Lead.

## Canonical references

AGENTS.md; docs/development-workflow.md; docs/architecture.md;
docs/efforts/headless-foundation.md revision 1;
docs/efforts/headless-foundation/accepted-proposals.md; package.json and lockfile;
openspec/changes/headless-turns/verification.md. PR:
https://github.com/Daniil-33/economic-game-app/pull/1.

## Constraints and invariants

Preserve reviewed game behavior and exact dependencies. Use least-privilege read
permissions and supported pinned-major official Actions, Node 26 consistent with
current project tooling. No production effect or new paid service commitment.
agentctl exclusively writes runtime state. Never push main or merge PR yourself.

## Dependencies

Integrated source a9afba2 and accepted kernel/turns. Start on isolated worktree
from current planning branch including this handoff. Team Lead will integrate,
publish and obtain final exact-head independent review after this task.

## Delegated decisions

Choose minimal workflow organization, official action versions after verifying
upstream documentation, timeout and stable job name. No product/stack changes.

## Required workflow

Acknowledge revision 1 before editing. Explore -> Propose -> Apply -> Verify -> PR
-> review fixes. Commit a short workflow proposal and ask Team Lead with --wake
before Apply; no behavior OpenSpec change needed for CI-only work. Implementation
must stay bounded. Team Lead authorizes Apply. Keep evidence of exact commits.

## Required checks

Inspect YAML, event filters and least-privilege permissions. Run existing local
npm ci --ignore-scripts, npm run typecheck, npm test, npm run replay as appropriate.
No redundant new tests that mirror YAML. Hosted run/current-head evidence belongs
to delivery after publication; do not invent a local Actions PASS.

## Escalation conditions

Missing required access, nonzero cost, workflow policy conflict, script changes,
unsupported Node runtime or any domain changes -> Team Lead. No workarounds
that weaken the merge gate.

## Deliverables

Workflow, concise proposal/evidence, exact base/head, stable required-check name,
local verification and unresolved limits. Ask Team Lead with --wake for review.
Do not push/create an extra PR without explicit coordinated publication plan.
