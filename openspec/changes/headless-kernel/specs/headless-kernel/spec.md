# Headless kernel verification refinement

Status: accepted for bounded implementation (proposal d989814); supplements the accepted upstream contract at
5da5697afdb26f72e5d26873cc1ea623ea89d919 and kernel handoff revision 2.
No turns behavior is authorized here. Upstream K01–K09 remain the acceptance IDs.

## ADDED Requirements

### Requirement: Kernel-only setup boundary

The kernel SHALL establish setup order without implicitly starting a turn.
Until TASK-hf-turns integrates active commands, known active-turn commands SHALL
reject atomically, preserving the shared validation/receipt precedence.

#### Scenario: K06 kernel proof

After ordinary two-player and six-player descending setup, phase/order explicitly
represent completed setup and there is no active turn or TurnStarted event.
BeginTurns, Roll, EndTurn and Timeout cannot succeed in this implementation.
T01 owns the later successful BeginTurns proof; this is a temporary boundary.

### Requirement: Complete kernel evidence

Verification SHALL exercise public entry points with deep-frozen nested inputs,
compare complete outputs and assert state identity on rejection and duplicate.
Success SHALL also preserve all input state and supplied envelope values.

#### Scenario: K01 and K02 boundaries

Creation accepts two/six unique IDs and rejects zero/one/seven, duplicate IDs and
invalid configuration/version. No control-type input is required. Invalid actors,
IDs, commands, time/revision (negative, fractional, unsafe, nonfinite), state,
rules and command versions reject. Tests include prototype-like IDs. Equal time
succeeds on an otherwise valid pending setup round; decreasing time rejects.

#### Scenario: K03 and K04 receipt/race sequence

Accept a setup round; retry it with changed valid context and original revision
and receive duplicate with original receipt, no new events and zero consumption.
Changed identity conflicts; malformed retry rejects before lookup. A different
ID at stale revision rejects. Correct an earlier rejected ID and succeed,
proving rejection did not reserve it. Snapshot nested receipts/events before
all attempts and assert no mutation or partial effects.

#### Scenario: K05 exact dice and precedence

Reject missing, extra, fractional, nonfinite, zero and seven-valued dice without
consumption. Malformed d6 precedes duplicate detection; a structurally valid
changed dice array on a duplicate does not reroll or alter the receipt. A fresh
setup command consumes exactly the selected group's size. Unsupported turn
commands consume zero even with supplied dice; their success counts await turns.

#### Scenario: K07 stable recursive ranking

For A–F, [6,4,4,2,2,1], then [3,3], [1,5], [2,6] yields
A,C,B,E,D,F. Inspect each intermediate group, roll membership and ordered event.
Repeat tied rounds without a cap, timeout, invented winner or reroll of fixed
players. Reject a later invalid round without altering established slots.

#### Scenario: K08 complete replay

Run independent sessions from identical versioned configuration and ordered
trusted envelopes including ties, successes, malformed input, conflicts, stale
revision, rejection correction and duplicate. Deep-compare every result, state,
receipt, event version/revision/ordinal and consumedDice. Validate expected
ranking/events separately so reproducibility alone cannot hide incorrect rules.

#### Scenario: K09 executable boundary checks

Local strict typecheck/build and compiled Node sequence tests pass. Core source
compiles without Node types and imports no applications, adapters or I/O modules.
Inspect for Date, timers, random, process, filesystem/network and dynamic imports.
No hidden cursor, clock or platform/control-type dependency exists.
