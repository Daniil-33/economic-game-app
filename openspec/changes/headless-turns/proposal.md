# Headless turns proposal

Status: proposed; Apply requires Team Lead acceptance and fresh context.
Task: TASK-hf-turns, handoff revision 2.
Exploration base: 0d306f9f1fc273c7fd9577ae976f66b726310217.
Kernel implementation: 37eac12d1f70a46eb8caa6fce40da36408f54532,
locally integrated at dad6a0b. Accepted design: 5da5697, reconciled at base.

## Scope and authority

Implement T01–T09 from ../headless-foundation/specs/headless-foundation/spec.md
using docs/efforts/headless-foundation/design.md and handoff revision 2.
The CTO interpretation in docs/product.md controls deadline and forced doubles.
No economy, real board, rewards, prison release, house/offer actions, transport,
persistence or UI. This proposal refines public types and fixture initialization
for Team Lead disposition; it does not itself authorize Apply.

## Public contract changes requiring acceptance

Keep createSession(config, participants), execute(state, unknown), result unions,
receipt precedence and setup ranking. Extend SessionConfig with optional
scenarioId, defaulting to `turn-boundaries/v1`; only fixed allowlisted IDs resolve.
Store the resolved scenarioId in GameState so replay includes scenario selection.
Unknown IDs reject INVALID_CONFIG. The profile remains headless-foundation/v1
and stateVersion 1 because this extends the initial in-development schema;
no persistence compatibility or migration is claimed.

Add optional turn (absent until explicit BeginTurns), participant status records
(custody free/prison and doublesStreak 0–2), and scenario progress. Turn contains
turnId, participantId, awaiting-roll/after-roll phase, startedAtMs, deadlineMs,
roll or null, housesUsed/offersUsed quotas, and settlement fixture reference.
A blocked transition never installs a boundary-blocked state: it rejects with
the original state. Derive fresh turn IDs from the successful revision, never
randomness; IDs fit existing identifier bounds even at revision exhaustion.

Require targetTurnId on Roll and EndTurn as on Timeout. Extend runtime command
validation, canonical receipt identity and equality accordingly. This guards
old player inputs even when their revision is refreshed; changing a target under
an accepted ID is ID_CONFLICT. BeginTurns and SetupRound remain untargeted.
Add explicit errors DEADLINE_REACHED, DEADLINE_NOT_REACHED, TURN_MISMATCH and
ROLL_REQUIRED; retain existing authorization/phase/dice/boundary errors. Deadline
addition must remain a safe integer; overflow rejects INVALID_ENVELOPE atomically.

Extend event payloads with TurnStarted (ID, participant, deadline, quotas),
DiceRolled (ID, participant, dice, forced), FixtureMoved (opaque origin/landing),
SettlementSatisfied (fixture ID), TurnContinued (same ID, new deadline, quotas),
PrisonEntered (participant), and TurnCompleted (ID, participant). Event envelopes,
revision increments and accepted receipt format remain unchanged. These are
fixture markers, not financial or real-board outcomes.

## Fixture ownership and initialization

Core owns a finite immutable data registry in a dedicated internal module. It
contains versioned synthetic scenario definitions: no-obligation movement;
unsupported landing effects (purchase/rent/chance/crossing); pending settlement;
third-double guard with unresolved would-be movement; and prisoner-next boundary.
No callbacks, executable extensions, monetary amounts, arbitrary positions or
outcome flags enter via commands/context. Configuration is selected by a trusted
local harness at creation, never treated as client authority. Labels are opaque
fixture locations, not CLASSIC_40 indices or legal real board generation.

Each scenario explicitly declares initial status/quotas and per-participant
scripted landing references. Scenario initialization occurs through createSession;
setup still runs normally and BeginTurns is always explicit. Separate seeded
scenarios may initialize nonzero consumed quotas, streak two, prison custody,
or an already-rolled pending settlement solely for boundary proofs. Definitions
must document these harness-only preconditions. Ordinary/default starts have
zero quotas, zero streaks and free custody. Fresh earned or next-player turns
reset quotas; synthetic nonzero seeds apply only to the first turn. A pending
settlement seed cannot be silently cleared. Tests and runner import the public
creation/execution API and never patch arbitrary financial state. Replaying the
same config, participants and envelopes reestablishes every fixture precondition.

## Transition implementation

Extract pure turn transition calculation from the shared receipt/publication
wrapper. Keep kernel validation precedence, immutable staging, exact dice counts,
one revision per success and zero dice/events on rejection. Actor checks precede
turn phase/target/deadline checks. BeginTurns requires system actor, complete
setup, no turn, zero dice, and a free first ranked participant. Roll/EndTurn
require active player and matching target; Timeout requires system and matching
target. Player commands require nowMs < deadline; Timeout requires >= deadline.
No late player input executes timeout implicitly.

BeginTurns starts 45 seconds. EndTurn before roll rejects ROLL_REQUIRED.
Roll and awaiting-roll Timeout require two dice. Other commands require zero.
Roll computes doubles first: third double bypasses all movement/settlement,
resets streak, enters symbolic custody and completes. Otherwise movement must
resolve an allowlisted no-obligation fixture, emitting DiceRolled, FixtureMoved,
SettlementSatisfied. Undefined effects reject the entire roll, including streak,
events and dice. Nondoubles reset streak; first/second doubles increment it.

Pre-roll Timeout follows the same roll guard, then emits TurnContinued and
sets nowMs+20000 on the same turn, preserving quotas. First/second forced doubles
earn a bonus only when that continued turn completes. Third doubles completes
immediately with no continuation. After-roll EndTurn and Timeout share settlement
and completion logic; pending obligations reject. Emit TurnCompleted then
TurnStarted for same participant after first/second doubles, otherwise immediately
next ranked participant with wraparound. Third doubles emits DiceRolled,
PrisonEntered, TurnCompleted, TurnStarted. Never skip prisoners: if the required
next participant is imprisoned, reject the entire triggering command, retaining
state/events/dice. T05 successful fixture explicitly has a free next participant.

## Integration and proof

Update temporary K06 unsupported-command expectations for integrated behavior,
preserving no implicit BeginTurns, setup ordering and actor/phase rejection.
Adjust K08's final BeginTurns result/revision/receipt expectations rather than
removing replay coverage. Retain K01–K09 invariant tests and frozen-input checks.
Add focused T01–T09 tests and an external apps/headless-runner Node entry point,
with separate strict Node compilation and root script. No new runtime dependency
or global installation is required. Runner compares complete results/events and
final state across two independently initialized replays; prints explicit
unsupported boundaries and no winner or complete-game claim.

Initial npm run typecheck could not start: local tsc is absent. Apply must run
npm ci from committed lockfile, then strict typecheck, full tests, Node scenario
run and core dependency inspection. Origin is configured, but hosting access,
PR and CI are unverified. This turn performs no external mutation. Commit the
proposal, report exact SHA, and request Team Lead disposition through agentctl.
