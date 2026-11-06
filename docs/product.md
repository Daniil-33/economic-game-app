# Product Contract

Status: architecture discovery.  
Product authority: the user.

## Product

Economic Board Game is a multiplayer browser economic board game inspired by
Monopoly and extended with a deeper financial system. Browser is the primary
platform. Discord Activities and Steam are potential future platforms and must
be attachable without rewriting the game core.

Inspiration is not a normative rule source. Behavior not described here or in
an accepted OpenSpec specification remains undefined.

## Product areas

- Company purchase, rent, monopolies, construction, and auctions.
- Banking, credit lines, taxes, mortgages, debt collection, and bankruptcy.
- Public companies, IPOs, shares, dividends, and controlling ownership.
- Dynamic economic events and variable board generation.

## Accepted domain requirements

| ID | Requirement | Still open |
| --- | --- | --- |
| DOM-01 | `CLASSIC_40` has 40 spaces; company placement is generated when a game is created. | Space composition, placement constraints, distribution. |
| DOM-02 | Three main company types have different rent and construction rules. | Names, formulas, exceptions. |
| DOM-03 | Turns and actions use explicit phases. | Complete phase graph and interruption rules. |
| DOM-04 | A player may add at most one new improvement per complete turn. | Precise improvement and turn boundaries, exceptions. |
| DOM-05 | An auction blocks conflicting actions until it completes. | Conflicting action set, bids, ties, termination. |
| DOM-06 | Financial operations are atomic. | Transaction boundaries and failure behavior per operation. |
| DOM-07 | Money uses exact representation without floating-point errors. | Denomination, ranges, rounding policy. |
| DOM-08 | Public companies use an actual share ledger; control requires at least 51%. | Issuance, divisibility, transfers, ties, dilution. |
| DOM-09 | Automatic debt collection minimizes the player's economic loss. | Loss function, allowed actions, tie-breaking, complexity limits. |
| DOM-10 | Every game stores its rules configuration and generated board result. | Storage format and migrations. |

These requirements constrain architecture but are not complete technical or
gameplay specifications. The user defines missing foundational mechanics and
expected behavior during planning with the CTO.

## Local MVP planning direction — 2026-11-05

Status: accepted user direction; detailed rules and acceptance criteria remain
open. Source: the user's Planner discussion on 2026-11-05, clarifying the work
required before multiplayer.

- Prioritize a locally simulated base game session after the basic StateMachine,
  without multiplayer connections or connected human participants.
- Use the 40-space board. Generate its company layout by randomly selecting
  monopoly groups from a catalog categorized into cheap, medium, and expensive
  tiers, with logically constrained placement. Tier counts, selection weights,
  adjacency/order constraints, and the exact algorithm remain open for CTO
  discussion. Placement constraints affecting gameplay require user agreement.
- Define the automatic mechanics of the base game cycle: random events,
  money awarded for completing a circuit of the board, credit-limit effects,
  and interest associated with credit used during a circuit.
- Define triggers, ordering, formulas, and boundaries with the user and CTO;
  the word "tick" does not select a real-time update loop. Player turns,
  individual circuits, and a round involving all players are not yet equated.
- In the user's subsequent confirmation on 2026-11-05, explicitly include
  board configuration, space types beyond monopoly companies, and definition
  of the tick's operations in base-game planning. The actual space types and
  their effects remain open; familiar Monopoly spaces are not assumed.
- Attempt local simulation with N simulated players after the base rules are
  implemented. Player count, decision strategy, and run criteria remain open.

This direction does not prescribe rates, award amounts, credit formulas,
event probabilities, automated player strategies, or game-ending rules.
The extent of a complete local simulation and its stopping condition remain
to be agreed. It does not bring every later financial feature into the MVP.

## StateMachine planning clarification — 2026-11-05

Status: accepted user inputs; unresolved details below are not implementation
authorization. Source: direct user discussion with the CTO on 2026-11-05.

- A session has N players, with a minimum of two. The core's game rules do not
  depend on whether a participant is human or a bot. Maximum count is open.
- Board structure is derived from configuration with player count as an input.
  The initial placeholder uses 40 spaces. The mapping from player count to
  composition is open; variable board sizes have not been accepted.
- Base space types include start, prison, casino, and go-to-prison. Purchasable
  assets occupy other spaces; chance spaces are under consideration. Counts,
  positions, effects, and asset group composition remain open.
- Turn order must be established during setup. Dice rolls are a suggested
  mechanism, not a finalized rule; dice details and ties remain open.
- All players begin with equal starting money and equal starting credit limits.
  Both values are calculated from asset costs using coefficients. The valuation
  base, inclusion of player count, coefficients, and rounding remain open.
- Credit has a base interest rate that can change under explicit game rules
  according to deterministic game state. Initial rate, whether later rates are
  global or individual, change triggers, and interest calculation remain open.
- A tick means one player's fully completed turn. This resolves the earlier
  terminology question; it does not make a tick equivalent to a board circuit
  or a round of all players, nor select interest or event triggers.

The exact turn phases, allowed actions, automatic effect ordering, interrupted
turns, and completion criteria still require user agreement.

## Asset economy, auctions, and exchange — 2026-11-05

Source: direct user discussion with the CTO on 2026-11-05, following the
StateMachine planning clarification. Accepted direction:

- Session variety comes from selecting monopoly categories and constituent
  companies from catalogs during setup. Candidate themes include microfinance,
  insurance, banks, investment banks, and technology companies. Final catalogs
  and category-to-mechanic mappings remain open.
- Asset prices can vary between sessions and influence starting capital.
  Each generated asset has a fixed purchase price within that session; price
  generation ranges and constraints remain open.
- A participant landing on an unowned purchasable asset may buy at its fixed
  price or initiate an auction starting below that price. Participants bid until
  the auction completes. Discount, increments, eligibility, ordering, passing,
  termination, no-bid outcome, and credit use remain open.
- During their own turn, a player may propose a bilateral exchange. Each side
  has a set of companies and a cash amount; a cash-only asset sale is supported.
  Acceptance, counteroffers, timing, restrictions, and credit use remain open.
- The bank rate responds to game liquidity with protection against individual
  wealth outliers. The estimator and adjustment rule are not yet selected.

Working configuration proposed by the user, not a finalized board contract:
one cheap two-asset group, six ranked three-asset groups, one expensive
two-asset group, and a further group whose income depends on the number of its
assets held by one player. The first eight groups total 22 assets. The size of
the further group remains open; prior CTO suggestions of 30 assets and six
chance spaces were not accepted.

User proposals still requiring selection: initial credit as a percentage of
starting cash; rate reviews no more frequently than every two complete board
circuits by all participants, with two/three/four circuits under discussion;
auction opening discounts of 40% or 50%. Circuit counting, movement shortcuts,
elimination, and stalled players require explicit semantics.

CTO numerical proposals and illustrative chance cards are recorded separately
in [economy planning](economy-planning.md); they are not accepted rules.

## Turns, offers, mortgages, optional layers — 2026-11-05

Accepted direct user clarification; overrides conflicting earlier proposals:

- Base Monopoly-like gameplay is the MVP, without importing unspecified
  external Monopoly rules. Bank credit and interest are optional layers; later
  mechanics must be optional layers too. Credit is not mandatory for local MVP.
  Whether the mortgage mechanic below is base or optional remains open.
- Each turn has 45 seconds, at most one new house, and at most two exchange
  offers. Each dice roll belongs to a separate turn. A doubles-granted extra
  roll starts a new turn with fresh time and limits. This clarifies DOM-04 for
  houses. Other improvements, doubles restrictions, timeout actions, and auction
  clock policy remain open.
- Offers persist beyond the proposing player's turn and do not block it. The
  same asset can appear in multiple offers to different participants. Offers
  automatically decline on timeout; duration is open. Acceptance, including
  outside one's turn, revalidates both parties' current ownership, funds, and
  all execution conditions, then settles atomically. A competing accepted offer
  may make another unexecutable. Phase restrictions, cancellation, and failed
  offer status remain open. The earlier blocking-offer proposal is superseded.
- Only assets without houses can be mortgaged; houses must first be sold.
  The bank advances a fraction of asset price, fraction open. Ownership remains
  with the player, who can sell/exchange the mortgaged asset. During a limited
  number of game circuits it can be redeemed by repaying the advance, with no
  stated surcharge. On expiry an unredeemed asset becomes unowned and available
  for purchase. Circuit counting, duration, transfer of obligations/deadlines,
  rent, and construction restrictions remain open.
- User calibration reference: 28 assets total 56900k; side totals 6400k,
  13500k, 18300k, 18700k. Four players start at 15000k each. Working formula
  C=alpha*S/N now uses alpha approximately 1.0545, replacing the unaccepted
  CTO 0.70 proposal. Exact reference ratio is 60000/56900=600/569. Final
  tuning and rounding remain open. The reference does not finalize generated
  board composition.

## Mortgage transfer and turn settlement — 2026-11-05

Accepted direct user clarification, superseding conflicting earlier open items:

- A transferred mortgaged asset remains mortgaged with the existing deadline
  and counter unchanged. It yields no rent. Mortgage and redemption coefficients
  still need selection; this reopens any earlier assumption of zero surcharge.
- The user suggests eight collective board circuits as the redemption period
  and requests a CTO proposal. Eight and exact collective counting are proposed,
  not finalized; this is not eight rounds of turns.
- If the turn timer expires before the player rolls, the system rolls for them
  and grants 20 additional seconds after the forced roll. This is a continuation
  of the same turn, not an extra roll/turn or a reset of action quotas.
- If the timer expires after landing on an unowned purchasable asset without
  buying, an auction starts. Bid response timeout is 15 seconds; an auction with
  no bids leaves the asset unowned. Timeout-as-pass, bidding order, successful
  auction termination, and normal-clock suspension remain to be agreed.
- After purchase, timeout completes the turn subject to mandatory settlement.
- Rent is automatically taken from cash when sufficient. If cash is short but
  legally realizable funds suffice, houses are sold/assets mortgaged to settle
  it. If realizable funds are insufficient, the player is bankrupt, eliminated,
  and all their assets become unowned and purchasable. The loss function,
  liquidation procedure, creditor recovery on bankruptcy, and clearing houses,
  mortgages, offers, or other obligations require explicit agreement.
- End Turn becomes available only after rolling. It invokes the same settlement
  behavior as turn timeout, including unresolved purchases/rent; it never skips
  obligations. It does not implicitly decline persistent exchange offers.

CTO proposals for the remaining settlement rules are in
[turn settlement planning](turn-settlement-planning.md).

## Planning confirmations — 2026-11-06

Source: direct user response to the CTO's numbered open-question brief.

- Accepted: automatic liquidation uses the previously proposed loss formula:
  house acquisition cost minus sale proceeds plus eight times lost reference
  rent. Apply group effects and the deterministic tie-breakers described in
  turn-settlement-planning.md. Legal sale constraints and rent formulas still
  require definition; algorithmic proof remains technical design work.
- The user includes mortgage in MVP (transcribed as "gold", interpreted from
  mortgage context; correct if disputed). Advance coefficient remains open;
  equal advance and redemption amounts are the requested working direction.
- Exchange offers may only be created on the proposer's turn and may be accepted
  on or off the recipient's turn before expiry, subject to execution validation.
  Expiry duration and mandatory-payment restrictions remain open.
- The existing chance-card list is retained as a provisional extensible catalog,
  not a fully specified deck: probabilities, durations and effect details remain
  open. Changing it later must still update versioned rules/specifications.
- Circuit reward uses the reference 2000 per 15000 initial cash, i.e.
  reward=roundMoney((2/15)*initialCash). Crossing rules and rounding remain open.
- A third consecutive doubles result sends the player to prison. Prison entry
  movement, release rules, and resetting the streak still need detailed rules.
- Turn order is determined in a separate setup phase: each player rolls one die,
  with tied players rerolling among themselves to establish relative order.
  The latest wording specifies one die; die faces and descending ordering need
  confirmation in the complete rules profile.
- The user answered "yes" to the auction question bundle. This does not select
  an opening discount, increment, or exact bidding/clock policy; those are shown
  as a concrete package for confirmation in mvp-rules-proposal.md.

See [MVP rules proposal](mvp-rules-proposal.md) for unaccepted CTO proposals on
board composition, coefficients, bankruptcy, auctions, and special spaces.

## MVP baseline approval — 2026-11-06

The user explicitly accepted the CTO's proposed package and authorized beginning
backend development. Evidence:
/srv/agent-runtime/state/inbox/VOICE-20261106T125957975023Z-fb8271/transcript.txt.
The concrete profile in mvp-rules-proposal.md is now accepted, superseding prior
proposed status: mortgage advance/redemption and house resale at 50%; 90-second
cancellable offers; auction 60% opening/5% increment, cyclic permanent pass,
15-second timeout-as-pass and paused turn clock; bankruptcy recovery/asset reset;
28-asset composition with two dice-dependent assets; stated rent/building and
special-space profiles; last survivor wins and capped simulations incomplete.
Accepted liquidation reference rent for dice-dependent assets uses expected sum
seven. Explicitly open items in that profile remain open, particularly collective
mortgage counting, concrete board/catalog data and exact money conventions.

Backend scope uses TypeScript and Node.js ("but JS" in voice understood in the
prior Node.js backend context). No frontend stack is accepted by this approval.
First effort: deterministic headless StateMachine foundation; later base rules
and simulation follow. Full-MVP readiness is not implied by starting foundation.

## Product decisions reserved for the user

- Changes to the product direction or core mechanics.
- New foundational game semantics not implied by accepted requirements.
- Expected behavior and acceptance criteria for roadmap efforts.
- Material changes to platform direction, budget, or risk.

Detailed domain logic may be delegated when it does not change these
foundations.
