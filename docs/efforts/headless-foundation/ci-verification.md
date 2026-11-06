# TASK-hf-ci implementation evidence

Implemented accepted proposal `6a551722008f05051d5a073c8ae054f0a6c1ae0c`
under acknowledged handoff revision 1 in a fresh Apply context. This proposal
commit is the implementation base; the exact resulting head is in the agentctl
report. Only `.github/workflows/verify.yml` and this evidence file change.

Local verification on 2026-11-06, Node v26.13.0 / npm 11.20.0:

- `npm ci --ignore-scripts`: PASS, committed lockfile, zero audit findings.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 20/20 tests, including subprocess replay.
- `npm run replay`: PASS, all 11 scenarios matched complete independent replay.
- PyYAML 6.0.1 syntax parsing and explicit structure assertions: PASS. The `on`
  key was quoted for the YAML 1.1 parser to preserve GitHub's YAML 1.2 meaning.
  Verified PR target `main`, all branch pushes (`**`), no tag/path filters,
  stable job ID/name `headless-foundation`, Ubuntu, 10-minute timeout,
  `contents: read`, official checkout/setup-node v6, disabled credential
  persistence and package-manager cache, project Node 26 and exact command order.
- Exact diff inspection and `git diff --check`: PASS. No scripts, dependencies,
  behavior, secrets, write permissions, allowed failures or conditional skips.

Stable required-check name: `headless-foundation` (workflow `Headless foundation`).
No push, PR creation, branch administration, merge or deployment was performed.
Local PASS does not establish hosted Actions success. Team Lead must arrange
independent exact-head review and coordinated publication into existing draft
PR #1, then observe hosted success and independent review for the current
published head before merge. Protection and review gates remain mandatory.
