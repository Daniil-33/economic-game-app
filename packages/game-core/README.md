# Headless foundation core

This package implements K01–K09 from the accepted headless-foundation design
(contract 5da5697) and kernel proposal d989814 under handoff revision 2.
Turn integration follows accepted proposal fc47e5f and the canonical CTO deadline
interpretation. No real board, economy, persistence or transport is implemented.

Use `npm ci`, `npm run typecheck`, and `npm test` at the repository root.
Typecheck compiles core first so tests resolve its public declarations even on
a clean checkout. Core uses strict ES2022 types without Node globals; tests use
a separate strict Node configuration and import the compiled public package.
Exact development versions and the generated lockfile are committed.

`createSession({stateVersion: 1, rulesVersion: 'headless-foundation/v1'}, ids)`
returns created/rejected. IDs are exact nonempty strings of at most 128 UTF-16
code units; 2–6 unique participant IDs are required. Creation rolls no dice.
`execute(state, envelope)` accepts a core-created state and validates an unknown
runtime envelope. Adapters authenticate actors, serialize commands and supply
trusted logical `context.nowMs` and `context.dice`. It returns explicit success,
rejected or duplicate results. State and outputs are readonly domain values;
callers must preserve that ownership contract. The implementation never mutates
inputs, including nested frozen values. It does not validate arbitrary persisted
or corrupted state; persistence/recovery is outside this contract.

SetupRound is system-only and rolls the leftmost tied group in stable order.
Every success advances revision once and records canonical identity, original
events and consumption. Duplicate lookup follows structural/version/d6 validation
and precedes revision/time checks. Context is excluded from request identity.
Rejected IDs are not reserved. Receipt keys safely support prototype-like IDs.
Revision exhaustion rejects atomically instead of producing an unsafe integer.
Completed setup has explicit order and no active turn. BeginTurns, Roll, EndTurn
and Timeout are explicit transitions as described below.

Tests cover participant/version/input boundaries, validation precedence,
idempotency/races, immutable results, exact dice, descending and recursive tied
setup, and full replay. K09 source checks enforce internal imports and detect
ambient I/O/clock/random use; strict compilation provides the complementary
ambient-type boundary. Neither check proves durable delivery or remote CI.


BeginTurns is system-only and starts 45 seconds after completed setup. Roll and
EndTurn require the active player and targetTurnId; Timeout requires system and
targetTurnId. All three targets form receipt identity. Player commands require
strictly before deadline, Timeout at/after it. EndTurn requires a roll. Timeout
before rolling forces two dice and continues the same turn for 20 seconds from
execution time with quotas retained. First/second doubles earn a fresh 45-second
turn only on completion/settlement. Third doubles enters symbolic prison before
movement, ends immediately and starts the immediately next ranked participant.
If that required participant is imprisoned the entire triggering command rejects;
no skipping, partial prison entry or consumed dice is published.

Creation accepts optional trusted `scenarioId` (default `turn-boundaries/v1`),
resolved through a frozen internal allowlist. State retains selection and progress
for independent replay. Fixtures are synthetic repeating opaque landings per
participant, without board indices, callbacks, client outcome flags or money.
The first ranked participant is unknown until setup completes: BeginTurns applies
the selected first-turn seeds, then every fresh turn resets consumed quotas.
No scenario changes setup ranking or implicitly starts turns.

| Fixture | Harness-only precondition / boundary |
| --- | --- |
| turn-boundaries/v1 | Free participants, zero quotas/streak, no-obligation movement |
| quotas/v1 | First turn housesUsed=1, offersUsed=2 |
| second-double/v1 | Nonzero quotas plus first participant streak=1 |
| third-double/v1 | Nonzero quotas, streak=2, unresolved crossing landing |
| third-double-prisoner-next/v1 | Same, next ranked participant imprisoned |
| prisoner-next/v1 | Clear landing, next ranked participant imprisoned |
| pending-settlement/v1 | First turn already rolled [2,3], mandatory settlement pending |
| purchase/v1, rent/v1, chance/v1, crossing/v1 | Corresponding undefined landing effect |

Unknown fixture selection rejects INVALID_CONFIG. Undefined movement, pending
settlement and prisoner release reject UNSUPPORTED_BOUNDARY atomically. Fixtures
establish no complete board or economic mechanics. State schema remains version 1
as an in-development extension; no persisted schema compatibility is claimed.
Run `npm run replay` for the separately compiled Node runner in
apps/headless-runner. It compares full results (including rejected/duplicate),
ordered events, receipts, consumed dice and final state across independent
initializations, reporting every unsupported boundary explicitly.

The independent money utility exports `quantizeMoney(numerator: bigint,
denominator: bigint): bigint`, `parseMoney(input: unknown): bigint`, and
`formatMoney(amount: bigint): string`. Quantization returns
`10n * (numerator / (10n * denominator))` for nonnegative numerator and positive
denominator. Keep intermediates exact and call it once at the final boundary.
Zero is valid; there is no rescaling, minimum payment or economic maximum.
The codec preserves unsigned canonical ASCII decimal integers, including values
not divisible by ten. Type or syntax failures throw TypeError; negative amounts
or nonpositive denominators throw RangeError. Error messages are not contractual.
These helpers do not change session state, commands, events or replay formats.

There is no artificial parser digit cap. Native bigint/string capacity and memory
limit computation and conversion; this is not production input admission policy.
Callers must establish resource and domain validation at their integration boundary.
