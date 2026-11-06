# Proposed headless foundation specification

Status: proposed. Contract details and source traceability:
../../../../../docs/efforts/headless-foundation/design.md.
Owners: K = TASK-hf-kernel; T = TASK-hf-turns. Scenario IDs are the effort
acceptance matrix and downstream verification obligations.

## ADDED Requirements

### Requirement: Versioned pure execution

The core SHALL execute only explicit versioned inputs, with no external I/O,
clock reads, randomness, Node or platform dependency. Creation SHALL support
2–6 unique participants independent of human/bot control. State, rules, commands
and ordered event envelopes SHALL be versioned; incompatible versions SHALL
reject without migration. Success SHALL advance revision once atomically.

#### Scenario: K01 — participant boundaries

Given valid configurations with two and six participants, creation succeeds;
counts zero, one and seven, duplicate IDs and invalid configurations reject.
The same player intents produce identical outputs regardless of adapter control
type. Creation returns explicit errors without partial sessions.

#### Scenario: K02 — version and envelope validation

Given a valid state, unsupported state/rules/command versions, malformed actor,
invalid IDs, negative/noninteger/unsafe revision or time, and invalid dice
reject without mutation, events or consumption. After one accepted command,
new commands with time earlier than lastNowMs reject; equal time is valid when
phase and deadline checks allow it. Event version and ordinal are explicit.

### Requirement: Atomic idempotent ordered handling

The core SHALL follow the design's validation precedence. A successful receipt
SHALL suppress repeated effects and retain its original event evidence; it SHALL
not redeliver events as newly emitted output. Rejected inputs SHALL neither
reserve IDs nor mutate state. The authoritative adapter SHALL serialize commands;
the core SHALL enforce expected revision and timer target identity.

#### Scenario: K03 — duplicates and ID conflicts

Given an accepted command, retrying the same canonical request with a later
trusted time returns duplicate, current state, empty new events and zero dice
consumption, even with its original stale expected revision. Original events
remain in the receipt. Reusing the ID for different actor/command/revision
rejects ID_CONFLICT. A structurally malformed retry rejects before lookup.

#### Scenario: K04 — stale revision and atomic rejection

Given two different IDs targeting the same revision, the first valid command
commits once and the second rejects stale revision. Frozen nested input state,
receipts and events stay unchanged for every rejected input. Corrected retries
of rejected IDs can succeed. Failure after candidate transition calculation
publishes no candidate events or state.

#### Scenario: K05 — explicit finite dice

SetupRound requires exactly one d6 per selected group member; movement Roll or
pre-roll Timeout requires exactly two; nondice commands require an empty array.
Missing, extra, fractional, out-of-range and nonfinite values reject with zero
consumption and no mutation. A successful command consumes exactly its required
count; no hidden external cursor advances on rejection or duplicate.

### Requirement: Deterministic setup ranking

Setup SHALL use descending d6 results, reroll only tied groups within their
existing rank slots, and preserve every established untied relative position.
Unresolved groups SHALL be selected left to right, members in stable original
participant order. Setup SHALL impose no timeout or retry cap.

#### Scenario: K06 — ordinary descending setup

Given two and six participants and distinct applicable dice, SetupRound records
one result per player and establishes descending order. Only a subsequent
BeginTurns starts the first active turn. Movement commands during setup reject.

#### Scenario: K07 — recursive ties

Given six IDs A–F and dice [6,4,4,2,2,1], groups become A,(B,C),(D,E),F.
B,C reroll [3,3] then [1,5], producing A,C,B,(D,E),F. D,E reroll [2,6],
producing A,C,B,E,D,F. A and F never reroll; fixed slots never move.
Repeated identical tie rounds remain unresolved without selecting a winner.

#### Scenario: K08 — deterministic replay

Given versioned initial state and ordered trusted envelopes including success,
rejection and duplicate, independent replays produce deep-equal results, states,
receipts, consumed dice and ordered events. No comparison ignores error outputs
or event order. Input state is not mutated on success either.

#### Scenario: K09 — core boundary and local tooling

Strict TypeScript compilation passes with no Node globals in core. Import and
I/O inspection finds no app/infrastructure/platform imports, clock, timer,
filesystem, network or random source. Local compiled sequence tests run through
Node outside core. No persistence or multi-instance recovery claim is made.

### Requirement: Explicit bounded turns

Fresh turns SHALL start with 45 seconds and fresh one-house/two-offer quotas.
EndTurn SHALL reject before rolling. Pre-roll Timeout SHALL force two dice and
provide 20 seconds from trusted execution time without resetting quotas or turn
identity. EndTurn and post-roll Timeout SHALL use identical mandatory-settlement
checks. Doubles SHALL grant fresh turns; third consecutive doubles SHALL enter
prison before movement/reward, reset streak and end the turn.

#### Scenario: T01 — start and pre-roll rejection

BeginTurns starts the first ranked participant with deadline nowMs+45000 and
zero quotas. EndTurn before rolling rejects without changing deadline, quotas,
revision or events. No arbitrary setup timeout is introduced.

#### Scenario: T02 — forced roll continuation

Given awaiting-roll with housesUsed=1 and offersUsed=2, Timeout at a due deadline
rolls supplied [2,3], preserves quotas/turn ID and grants deadline nowMs+20000.
A late timer uses execution time rather than the expired deadline for extension.
Repeat delivery produces no second roll. A premature timer rejects.

#### Scenario: T03 — ordinary completion and common settlement

A nondouble roll in a no-obligation fixture produces DiceRolled, movement marker
and SettlementSatisfied. EndTurn completes and starts the next ranked player
with fresh time/quotas. From the same after-roll fixture, due Timeout has the
same settlement/completion events and state apart from explicit input timing
and receipt identity. Pending obligations never disappear through either path.

#### Scenario: T04 — doubles fresh turns

Given streak zero then first and second doubles, each completed turn starts a
fresh turn for the same participant, with new ID, 45 seconds and fresh quotas.
A later nondouble clears the streak and completion advances to the next player.
Nonzero quotas in the previous turn prove reset. No house/offer operations are
implemented merely to create this fixture.

#### Scenario: T05 — third double prison guard

Given streak two and a would-be movement fixture with unresolved reward/effect,
a double emits DiceRolled, PrisonEntered and TurnCompleted, resets streak and
starts the next non-imprisoned participant. No movement/reward marker or effect
runs. Custody is symbolic, with no invented location or release behavior.

### Requirement: Deadline and race policy pending disposition

The following scenarios SHALL become binding only after CTO semantic disposition:
player commands require nowMs < deadline; Timeout requires nowMs >= deadline.
Pre-roll forced doubles retain continuation until ordinary completion, with
third doubles ending immediately. Team Lead SHALL update these scenarios to the
durable disposition before turns Apply if this recommendation is changed.

#### Scenario: T06 — deadline edges and equality

At deadline-1 a post-roll EndTurn succeeds and Timeout rejects as premature.
At deadline and deadline+1 EndTurn rejects DEADLINE_REACHED and Timeout succeeds.
Both equal-time serialized orders are tested: rejected EndTurn then successful
Timeout; successful Timeout then stale-revision EndTurn. Exactly one completion
occurs and the old target cannot affect a new turn.

#### Scenario: T07 — races across the boundary and forced doubles

EndTurn accepted before deadline causes a later old timer to reject stale
revision. A due accepted timer causes an old EndTurn to reject stale revision.
Neither order repeats effects; revised envelopes targeting old turn IDs reject.
A non-third forced double retains the same quotas/ID for 20 seconds and starts
its bonus turn only on completion. A forced third double enters prison directly.

### Requirement: Explicit fixture limits and executable evidence

The bounded harness SHALL use versioned allowlisted scripted fixtures without
inventing a board catalog, money, crossing settlement or prison release.
Undefined effects SHALL return UNSUPPORTED_BOUNDARY atomically. The Node runner
SHALL remain outside core and demonstrate replay rather than a playable MVP.

#### Scenario: T08 — unsupported boundary safety

A roll requiring undefined purchase/rent/chance/crossing effect rejects with no
state/events/dice change; after-roll pending settlement fixtures reject both
EndTurn and Timeout. Unknown fixture IDs and prison-release attempts reject.
No fixture silently forgives debt, credits rewards or manufactures release.
The third-double guard succeeds without touching an undefined movement effect.

#### Scenario: T09 — integrated Node replay

The external runner replays setup, ordinary turns, forced timeout continuation,
first/second/third doubles, duplicates, rejection and race traces with scripted
time/dice. Two runs compare complete output sequences and final states. A run
that encounters an unsupported boundary reports it explicitly; it claims no
winner, full simulation or complete board. Strict typecheck, focused tests and
core boundary inspection pass at the exact downstream head SHA.
