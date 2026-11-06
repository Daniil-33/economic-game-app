# Economic Board Game

Status: pre-development / architecture discovery.

## Required reading

Read this file first. Then load only what the active task needs:

- Product behavior: `docs/product.md`
- Architecture boundaries and decision status: `docs/architecture.md`
- Current unresolved design work: `docs/discovery.md`
- Phase outcomes: `docs/roadmap.md`
- Delivery process: `docs/development-workflow.md`
- Accepted decisions: `docs/decisions/`
- Detailed behavior and active changes: `openspec/`

Infrastructure role prompts and policies are supplied by the agent runtime and
are not duplicated here.

For a direct Untether session rooted in this repository, the active role is CTO
unless its runtime preamble or an explicit handoff assigns another role.

## Source and status rules

- `Accepted` requirements and decisions are binding.
- `Preliminary` choices remain the working direction but may require a reserved
  user decision before they become mandatory.
- `Proposed` content is available for evaluation and is not authorization.
- `Open` means no decision exists yet.

Do not infer familiar Monopoly rules where this repository is silent. Escalate
missing product semantics through Team Lead -> CTO -> User.

## Engineering invariants

- The game core is deterministic and independent of UI, network, persistence,
  renderer, and platform SDKs.
- The server is authoritative; clients send intent and never author financial
  or game outcomes.
- Time and randomness enter the core explicitly.
- Financial operations are atomic and use exact monetary representation.
- Commands must support idempotent handling and race protection.
- Rules, state, events, and saved sessions are versioned.
- Tests cover business invariants and state sequences.
- Discord and Steam adapters must not require rewriting the game core.

## Change process

Use OpenSpec Explore -> Propose -> Apply. A behavior change updates the relevant
specification with the code. Development uses feature branches and pull
requests into protected `main`.
