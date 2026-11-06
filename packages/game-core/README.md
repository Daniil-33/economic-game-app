# Headless kernel

This package implements K01–K09 from the accepted headless-foundation design
(contract 5da5697) and kernel proposal d989814 under handoff revision 2.
No turn, board, economy, persistence or transport behavior is implemented.

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
and Timeout reject UNSUPPORTED_BOUNDARY until TASK-hf-turns implements them.

Tests cover participant/version/input boundaries, validation precedence,
idempotency/races, immutable results, exact dice, descending and recursive tied
setup, and full replay. K09 source checks enforce internal imports and detect
ambient I/O/clock/random use; strict compilation provides the complementary
ambient-type boundary. Neither check proves durable delivery or remote CI.
