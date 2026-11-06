# Headless turns implementation specification

Status: accepted refinement at fc47e5f; implemented locally, delivery gates open.
No new product mechanics.
Normative scenarios: ../../../headless-foundation/specs/headless-foundation/spec.md.
The proposal in ../../proposal.md defines the public type refinements for review.

The implementation SHALL preserve K01–K09 invariants while extending temporary
unsupported turn behavior. Every rejected transition SHALL preserve the original
state object, receipts, events and dice consumption, including failure to start
the next imprisoned participant. No prisoner skipping or partial prison entry.

T01 SHALL prove explicit system BeginTurns after setup, 45000ms, EndTurn before
roll rejection, wrong actor/phase/target, and no hidden setup timeout.
T02 SHALL prove due and late pre-roll Timeout grants now+20000 with same ID and
nonzero quotas (1 house/2 offers); early, duplicate and malformed rolls are atomic.
T03 SHALL assert exact roll and completion event order, ordinary next participant,
and shared settlement rejection through EndTurn and after-roll Timeout.
T04 SHALL exercise first/second doubles to fresh same-player turns, resetting
nonzero quotas/time/ID, then nondouble resetting streak and advancing order.
T05 SHALL initialize streak two and an unsupported would-be movement/reward;
third doubles SHALL enter prison before movement/reward and start the immediately
next free ranked participant. With that next participant imprisoned the complete
transition SHALL reject, retaining even the original dice/streak/custody.
T06 SHALL check deadline-1, equality, deadline+1 for player and timer eligibility,
and equality races in both serialized orders with unchanged revision on rejection.
T07 SHALL check predeadline EndTurn then stale timer; due timer then stale EndTurn;
refreshed-revision old targets; first/second forced doubles continuation before
bonus; and forced third double without continuation.
T08 SHALL check unknown fixture selection, unsupported movement categories,
pending mandatory settlement, and prison-release boundary without partial effects.
T09 SHALL replay independently initialized setup/ordinary/forced/doubles/third,
duplicate/rejected/race/boundary scenarios, comparing all results/events and state.

All scenarios SHALL use core-owned immutable versioned fixture data, selected
through creation config; no untrusted outcome injection or arbitrary callbacks.
The runner SHALL execute outside core. Strict typecheck, full kernel/turn tests,
Node run and dependency inspection SHALL pass before implementation review.
