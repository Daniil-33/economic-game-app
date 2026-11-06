# Headless kernel implementation proposal

Status: proposed for Team Lead acceptance; no Apply authorization.
Task: TASK-hf-kernel, handoff revision 2.
Exploration base: 2cc7a38c295644118bb8469fbbf74b58952218aa.
Accepted upstream contract: 5da5697afdb26f72e5d26873cc1ea623ea89d919.

## Outcome and scope

Deliver local package/tooling, versioned pure execution and deterministic setup
for K01–K09 in ../headless-foundation/specs/headless-foundation/spec.md.
The contract in ../../../docs/efforts/headless-foundation/design.md remains the
execution authority, subject to independent design review and Team Lead approval.
This proposal refines implementation and verification; it does not authorize
turn semantics, economy, board generation, persistence, transport or deployment.

## Implementation plan

Use a root npm workspace with packages/game-core. Pin TypeScript 5.9.3 and
@types/node 26.0.0 as exact development dependencies and commit npm's generated
lockfile during Apply. Registry metadata confirms both versions exist; TypeScript
requires Node >=14.17, compatible with observed Node v26.13.0/npm 11.20.0.
No matching entries were returned by local npm cache queries. Install locally
only; no global tooling. Use strict TypeScript, ES2022 library types, explicit
empty types for core, and NodeNext module resolution with ESM packages. Compile
Node test files with a separate configuration allowing Node types; tests import
the public compiled core. Root scripts provide build, typecheck and test using
tsc and node --test. No runtime dependencies are needed.

Keep public types/exports, input validation, execution/receipts and setup ranking
as small modules within core. Tests stay outside core source compilation. Export
createSession(config, participants) and execute(state, envelope); expose readonly
state/result/event unions. Runtime boundary validation accepts malformed values
without relying on TypeScript types to establish validity. Unsupported versions
and invalid envelopes return explicit rejection unions, not business exceptions.
Creation returns an explicit created/rejected union without partial state.
Identifiers use bounded nonempty strings (proposed implementation bound: 128
UTF-16 code units), compared exactly without normalization. Participant lookup
and receipts must safely handle IDs such as __proto__ and constructor, with
own-property lookup and data properties rather than prototype-based membership.
No identifier restriction may silently remove otherwise valid participants.

Use setup ranking groups in stable participant order, an explicit setup-complete
phase/order and no active turn record. Replace only the selected leftmost tied
group with descending die partitions. Emit SetupRolled followed by
SetupTiePending or SetupOrderEstablished with revision/ordinal envelopes.
Creation revision is zero; each successful SetupRound increments it once.
A completed setup cannot accept another SetupRound. Time starts at logical zero
and is monotonically nondecreasing on success only. Creation performs no roll.

Preserve the accepted validation order: structure/versions/time/revision/d6;
receipt identity or conflict; expected revision; monotonic time; authorization
and phase; required dice and transition preconditions. Compare canonical typed
identity fields explicitly, not object key order or trusted context. Receipts
retain identity, accepted revision, original events and consumption without
recursive states. Build fresh state/events/receipts without modifying inputs;
only publish a success after complete validation and transition calculation.
Unknown or malformed commands reject structurally. Known BeginTurns, Roll,
EndTurn and Timeout variants remain extensible contract variants but reject
atomically as unsupported at this task boundary; no placeholder turn succeeds.
Their complete behavior and deadline rules belong to TASK-hf-turns. Duplicate
recognition still follows the shared validation precedence.

## Verification and delivery

The accompanying spec and tasks define concrete K01–K09 proof. Inspect core for
imports and hidden I/O alongside strict compilation with no Node globals.
Compare complete replay outputs, not hashes. No test invents money, positions,
setup timeout, turn deadline behavior or settlement.

Observed origin is now https://github.com/Daniil-33/economic-game-app.git;
this supersedes the historical no-remote observation, but does not establish
write access, branch protection, PR status or CI. No push/PR is part of this
Explore/Propose turn. External mutations require agentctl intent and confirmed
results; later Apply must reconcile hosting before delivery operations.

Commit this proposal, report its exact SHA and request Team Lead disposition.
Independent upstream design-review findings must be resolved before acceptance.
Apply requires Team Lead acceptance of this exact proposal, the current handoff,
and a fresh context through agentctl engineer apply. This proposal does not
claim implementation, independent review, CI or completed delivery.
