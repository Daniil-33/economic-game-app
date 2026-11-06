# TASK-hf-ci workflow proposal

Status: proposed; requires Team Lead Apply authorization under handoff revision 1.
Base: `7b14c3d93fe48f68707a135bc235728e1e930407`, containing integrated
foundation `a9afba2c5b4a8788ef8ca7d9f93d0f2e0f980a9c`.

## Bounded change

Add `.github/workflows/verify.yml`, workflow name `Headless foundation`, with
one job whose ID and display name are both `headless-foundation`. Preserve that
check name for subsequent required-check configuration by the delivery owner.
Use `pull_request` targeting `main` and branch `push` with `branches: ['**']`.
There are no path filters, tag triggers, conditional skips or allowed failures.

Run on `ubuntu-latest` with a 10-minute job timeout and workflow-level
`permissions: contents: read` (all other token permissions omitted). Use official
`actions/checkout@v6` with `persist-credentials: false`, followed by
`actions/setup-node@v6` with `node-version: '26'` and
`package-manager-cache: false`. No cache, secrets, artifacts, deployment,
write permission, branch-protection change or external service is needed.

Execute separate failing-on-error steps in this order:

1. `npm ci --ignore-scripts` (committed lockfile, unchanged dependencies).
2. `npm run typecheck` (existing strict core/test/runner compilation).
3. `npm test` (entire standard suite, including subprocess replay).
4. `npm run replay` (existing Node replay runner).

No package/script, product, architecture or behavior specification change is
authorized or necessary. Only workflow and concise delivery evidence change.

## Exploration and verification plan

The initial worktree is clean on `agent/task-hf-ci`; no workflow directory exists.
Local runtime is Node v26.13.0 / npm 11.20.0. Existing package scripts already
provide all required checks. After authorization, run the four commands above,
inspect workflow syntax/events/permissions and `git diff --check`, and record
exact base/head plus results. Do not add tests mirroring YAML or modify scripts.

Official upstream documentation checked on 2026-11-06:
[checkout v6](https://github.com/actions/checkout/tree/v6) and
[setup-node v6](https://github.com/actions/setup-node/tree/v6).
Both document Node 24 action runtimes and runner >= v2.327.1; GitHub-hosted
Ubuntu is the intended runner. The action runtime is separate from the project
Node 26 runtime selected by setup-node. Major tags follow the handoff's explicit
pinned-major policy.

## Delivery boundary

Commit the implementation locally and ask Team Lead for independent exact-head
review and coordinated integration/publication into draft PR #1. Do not push,
create another PR or merge. Local command success is not hosted Actions success.
Team Lead must observe a successful hosted `headless-foundation` check on the
eventual published PR head and obtain current-head independent review before
claiming completion. No gate is waived by this proposal.
