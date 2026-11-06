# CTO -> Team Lead: headless foundation

id: EFF-headless-foundation
revision: 1
project: economic-board-game
created_at: 2026-11-06
owner: cto
status: accepted
source_commit: unborn repository at handoff creation; establish traceable baseline

## Outcome and acceptance

Begin the accepted first roadmap step: deterministic TypeScript StateMachine
running locally under Node.js without UI/server transport. Provide versioned
state, commands, ordered domain events and explicit success/rejection results.
A bounded scenario establishes turn order using one d6 per participant,
descending, tie rerolls only among tied players; begins a turn with 45 seconds;
handles end-before-roll rejection, forced roll at timeout with 20 extra seconds
without quota reset, ordinary completion, doubles granting fresh turns, and
third consecutive doubles entering prison before movement/reward.
Use scripted legal board/state fixtures for turn-boundary scenarios; do not
claim complete board generation or playable MVP. If this requires an unresolved
cell or prison-release effect, stop at that explicit boundary, not invented rules.
Support 2-6 participants independent of human/bot control. Same versioned initial
state, ordered commands and trusted time/random inputs produce identical output.
Rejected/duplicate inputs must not repeat or partially apply effects. Events and
state transitions are tested as sequences, including timer vs End Turn races.

## Scope and non-goals

Foundation, setup order and defined turn boundaries; exact core API/state model
and proof belong to Team Lead design. No full economy, chance execution, board
catalog, mortgage expiry, frontend, WebSockets, persistence, deployment or credit.
A later effort delivers full 40-space generation and base economic scenarios.

## Canonical sources

AGENTS.md; docs/product.md (MVP baseline approval); docs/architecture.md;
docs/roadmap.md; docs/mvp-rules-proposal.md; docs/development-workflow.md.
OpenSpec begins with Explore -> Propose -> Apply. No existing runnable spec.
User evidence: /srv/agent-runtime/state/inbox/VOICE-20261106T125957975023Z-fb8271/transcript.txt.

## Constraints, delegated choices and open decisions

Pure core, explicit trusted time/randomness, deterministic ordering, versioning,
atomic effects, command duplicate/race protection, optional layers. No external
I/O, hidden clocks or randomness in core. Team Lead owns compliant API design,
package/test tooling and decomposition. User reserves product/stack changes.
Money denomination, exact collective mortgage counter, concrete board indices,
multilateral bankruptcy are deferred outside this effort; do not resolve by
assumption. Return any turn-boundary semantic ambiguity to CTO before Apply.
Do not add arbitrary setup timeout or prison behavior not accepted in sources.

## Dependencies, risks and limits

Repository has no commits/remotes verified at creation; documentation is untracked.
Establish baseline/source SHA and check repository hosting/review access before
PR work; do not claim protected main or remote CI exists. Keep implementation on
feature branches. No purchases, production changes, deployments or new external
access commitments. Use current local runtime capacity; no capacity expansion.

## Required output and completion evidence

Acknowledge revision 1; produce technical design, OpenSpec proposal, task/evidence
plan, and focused escalations. Substantial Apply uses a fresh Engineer context
with acknowledged current handoff. Follow infrastructure review and PR policy;
CI and independent review apply to exact current head. Local typecheck and
meaningful deterministic scenario tests, replay/duplicate/rejection evidence,
updated docs/specs and accepted integrated result required. Missing remote/CI
prevents claiming merged delivery, not local exploration. No engineering
implementation by CTO. Record acceptance of this exact handoff revision.
