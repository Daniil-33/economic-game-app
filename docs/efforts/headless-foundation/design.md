# Headless foundation design

Status: proposed for Team Lead acceptance; no Apply authorization.
Task TASK-hf-design, handoff revision 1. Exploration base
507ca02b910904864aec6b3b2910bcc4adedef50; accepted-source baseline
0674733f68b754a14a68c32e8a51e1451c046808.

## Authority and traceability

The accepted effort in ../headless-foundation.md bounds this design to setup and
turn boundaries. technical-plan.md assigns kernel and turns ownership.
../../architecture.md supplies purity, atomicity, authority and versioning.
../../product.md sections “Turns, offers, mortgages, optional layers”, “Mortgage
transfer and turn settlement” and “MVP baseline approval” supply turn duration,
quotas, timeout continuation and settlement requirements. ../../mvp-rules-proposal.md
supplies d6 setup descending order, two movement dice, and third-double behavior;
its explicitly open money/board details remain open. Historical proposal wording
does not override its accepted-status notice. No external Monopoly rules apply.
The scenario matrix in the proposed spec maps every effort criterion to an owner.

## Pure execution contract (technical proposal)

packages/game-core exports createSession(config, participants) and
execute(state, envelope). Both return explicit result unions, never business
exceptions. Creation accepts stable unique participant IDs in declared order,
2–6 participants, rules profile headless-foundation/v1, and schema version 1.
No money, generated board or control-type property is needed. Human/bot identity
belongs outside the domain; the same participant intents execute identically.

Envelope fields: commandVersion=1, commandId (nonempty bounded string),
expectedRevision (nonnegative safe integer), actor ({kind:player,id} or
{kind:system}), command, and trusted context {nowMs,dice}. nowMs is a nonnegative
safe integer of logical milliseconds from an adapter-owned epoch, monotonically
nondecreasing across successful commands. dice is a finite array of integers
1–6. The adapter authenticates actors and serializes inputs; the core validates
command authorization. No client-provided time or dice is authoritative.

Commands: SetupRound (system), BeginTurns (system), Roll (active player),
EndTurn (active player), and Timeout (system, targetTurnId). SetupRound rolls
all members of the next unresolved group; BeginTurns starts the first turn after
setup resolves. There is no setup timeout. Setup inputs need no wall-clock delay.
No public network protocol, persistence or recovery guarantee is introduced.

State carries stateVersion=1, rulesVersion, revision, lastNowMs, participants,
setup ranking groups or active turn, per-player doubles streak and custody, and
an accepted-command receipt map. Turn carries unique turnId, participantId,
phase awaiting-roll/after-roll/boundary-blocked, startedAtMs, deadlineMs,
roll-or-null, quotas {housesUsed,offersUsed}, and settlement fixture reference.
Terminal setup order is explicit; prison custody has no release operation here.
Unknown schema/rules/command versions reject; no implicit migrations.

Success returns {kind:success,state,events,consumedDice}; rejection returns
{kind:rejected,state:original,events:[],consumedDice:0,error}; duplicate returns
{kind:duplicate,state:current,events:[],consumedDice:0,receipt}. Receipts hold
canonical request identity (actor, version, expectedRevision and command),
accepted revision, original ordered events and original dice usage. Trusted
context is excluded from identity so retries with a later delivery time do not
reroll. Receipt data never recursively contains full prior states. Receipts are
retained for the bounded in-memory session; pruning/recovery is future work.
Every accepted command increments revision once, regardless of event count;
creation starts at zero. Event envelopes carry eventVersion=1, resulting revision
and zero-based ordinal. No random IDs or implicit timestamps are generated.

Validation precedence: (1) envelope structure and supported versions, including
safe integer time/revision and d6 element validity; (2) known ID: same canonical
request returns duplicate even if stale, different request rejects ID_CONFLICT;
(3) expectedRevision equality; (4) monotonic time; (5) actor/phase/target and
applicable deadline; (6) required dice count and all transition preconditions.
Malformed retries reject before receipt lookup. Rejections do not reserve IDs.
New command IDs may retry rejected intents after correcting inputs. Successful
receipts suppress repeated effects; rejected inputs cannot change receipts.
This does not establish durable exactly-once delivery.

Randomness is supplied per invocation, with exactly the count needed by the
command: SetupRound uses the size of the selected group, Roll and pre-roll
Timeout use two, all others zero. Extra or insufficient values reject. Dice are
values, never a mutable external cursor. Stage validation and all effects in a
candidate state; publish once only if the entire transition succeeds. Rejections
consume zero dice and preserve the input object, nested values and events.
The adapter advances its own script cursor only by successful consumedDice.

## Setup algorithm

Initial unresolved group is all participant IDs in configuration order. A round
assigns one die per member in that group's current stable ID order. Partition
by value descending, replacing that group's slot with the ordered partitions.
Singletons are fixed. Select the first unresolved partition from left to right
for the next round; reroll only its members. Repeat until all singletons.
Previously fixed relative positions never change. Unlimited repeated ties are
legal: no tie cap or invented winner. SetupRound emits SetupRolled then either
SetupTiePending or SetupOrderEstablished. BeginTurns emits TurnStarted.

## Turns and unresolved semantic gate

Fresh turns have 45,000 ms and zero quotas (one house/two offers maxima). A
pre-roll Timeout rolls two dice and sets deadline to execution nowMs+20,000,
preserving turn ID and nonzero quotas. After-roll EndTurn and Timeout invoke
the same settlement path. Ordinary completion emits TurnCompleted then
TurnStarted for the next participant. A non-third double completes then starts
a fresh turn for the same player with fresh quotas/time; a nondouble clears
that player's streak. Third consecutive doubles emits DiceRolled, PrisonEntered,
TurnCompleted before the next TurnStarted, resets streak and bypasses every
movement/reward hook. Prison location is symbolic custody, not a board index.
An upcoming prisoner's release attempt is an explicit unsupported boundary.

PROPOSED, requiring CTO disposition before turns Apply: player intents allowed
only at nowMs < deadline; Timeout allowed at nowMs >= deadline. Late player
commands reject DEADLINE_REACHED without silently executing timeout. Timeout
is targeted to turnId and revision, preventing a delayed timer from touching a
fresh turn. Equality then has a single winner: timeout. Pre-deadline EndTurn
wins only if serialized before a due timer; the old timer rejects stale revision.
At equality EndTurn rejects even if delivered first; due Timeout then succeeds
at unchanged revision. If Timeout succeeds first, old EndTurn rejects stale
revision. No scheduler runs inside the core.

Accepted sources do not explicitly select deadline equality, late-delivery
policy, or whether pre-roll timeout doubles immediately start a fresh turn or
retain the promised 20-second continuation. Recommendation: every roll follows
the same settlement/completion path; doubles bonus starts only at completion,
so forced rolls retain 20 seconds unless third doubles ends immediately.
Alternatives are player priority at equality and immediate fresh doubles turns;
these change observable gameplay. Team Lead must route this focused gate to CTO.
Kernel contract review can continue; turns Apply waits for durable disposition.

## Explicit fixture boundary

No board generator, monetary denomination, prices, board indices or financial
state is introduced. Test-only scripted scenarios specify opaque origin/landing
labels and an already settled/no-obligation landing result. This is a proof
harness for turn progression, never a legal real-board catalog. Deterministic
fixture selection is part of the versioned scenario rules; no arbitrary callback
or outcome supplied by an untrusted command is accepted. Allowlisted fixture
IDs resolve to immutable scenario definitions; unknown IDs reject.

Roll emits DiceRolled then fixture movement marker then SettlementSatisfied
only for an explicitly no-obligation fixture. EndTurn completes only from a
satisfied fixture. Undefined purchase, rent, chance, crossing reward or prison
release yields UNSUPPORTED_BOUNDARY with original state/events/dice unchanged;
it never silently clears an obligation. Preloaded unresolved after-roll fixtures
prove EndTurn and Timeout cannot skip settlement. Third-double fixtures place a
would-be unresolved movement/reward behind the prison guard and prove it is
never visited. No reward amount or prison index is needed. Ordinary scenarios
exclude an upcoming imprisoned participant; a sequence that reaches one stops
explicitly without manufacturing release. Tests must label fixture legality as
legality within this bounded harness, not proof of a complete playable board.

## Tooling and replay

Propose npm with a committed lockfile, TypeScript as a local dev dependency,
strict tsc compilation, and Node's built-in test runner on compiled test output.
Kernel pins compatible exact tool versions during implementation, with no global
installation. Build core with ES library types only (no Node globals); put Node
types, filesystem, console, process and runner configuration outside core.
apps/headless owns scripted runner I/O and deterministic input serialization;
core never imports it. No HTTP framework or new platform choice is needed.

Replay stores versioned initial state/config and ordered full trusted envelopes,
including rejected and duplicate attempts, logical times and supplied dice.
Compare complete result unions, final state, each event and its order, receipts
and consumption across two independent executions; do not compare only a hash.
Test deep-frozen input state and rejection snapshots, multi-round ties, nonzero
quotas, third-double guard and both race orders. Typecheck and inspect imports
and use of Date, timers, random, process, filesystem and network in core.

Local facts observed 2026-11-06: Node v26.13.0, npm 11.20.0; gh installed;
no tsc or openspec executable, no package/lockfile or CI configuration, and git
remote -v empty. No remote/protection/access/CI is verified. Do not provision,
create remotes, install global tooling or claim remote CI. Downstream local
checks can proceed; PR and merge evidence needs a separately available host.

## Acceptance and delivery

Design-only checks: source/scenario ownership audit and git diff --check;
OpenSpec CLI validation unavailable locally. Team Lead accepts the exact proposal
commit and resolves gates before refreshed downstream handoffs. Kernel then
owns tooling/API/setup; turns extends its accepted SHA and owns runner/turns.
Each downstream task runs focused sequences, strict typecheck and boundary
inspection, with independent review and CI at the exact head when hosting is
available. No product code or scaffolding is part of this proposal. Acceptance,
review and merge are not implied by a local design commit.
