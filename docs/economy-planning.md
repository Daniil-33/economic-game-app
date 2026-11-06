# Economy planning — 2026-11-05

Status: proposed CTO discussion package, not authorization to implement.
Authority for accepted user direction: product.md. All numbers need simulation.

Superseding user clarification: product.md, Turns, offers, mortgages, optional
layers. The historical 0.70 funding proposal below is replaced by the user's
approximately 1.0545 baseline. The blocking exchange proposal below is
superseded by persistent nonblocking offers. Bank credit/interest are optional.
Unselected rate and auction parameters remain proposals.

## Setup

Separate board slots/group sizes and mechanic types from category/company
catalogs. Generate bounded, validated economic parameters and save the actual
result with rules and generator versions. Names alone do not provide strategic
variation. Category effects and price-to-income relationships remain open.

Candidate composition: 22 ordinary assets plus a four-asset ownership-count
group, four named special spaces, and ten chance spaces = 40. The user has not
chosen the last group's size or the chance count. Alternative composition can
add explicitly designed asset groups rather than silently importing mechanics.

## Starting funds

Let S be the sum of all generated purchasable assets' fixed prices and N the
player count. Propose cash C = roundMoney(0.70*S/N), credit limit
L = roundMoney(0.30*C). Each participant gets equal C and L and zero initial
debt. Aggregate potential purchasing funds before rounding are 0.91*S.
Example: S=120000, N=4 gives C=21000 and L=6300.
Coefficients, rounding, and affordability validation remain unaccepted.

## Bank rate

Recommend evaluating after every two additional physical board circuits by
every eligible player, not after two turn-order rounds. A possible epoch
counter uses min(completedCircuits_i); elimination, prison, teleports, and
reverse movement must be settled before acceptance. This trigger can stall.

For an outlier-resistant indicator propose M=mean(min(cash_i,2*C)), equal
weight for each eligible player. Exclude undrawn credit; whether to deduct debt
is a separate choice. This is a capped mean, not an unexplained weighting by
wealth. Ratio q=M/C. Illustrative controller: q<0.75 lowers rate by one
percentage point; q>1.25 raises it by one point; otherwise unchanged. Candidate
initial rate 5%, bounds 2%-12%, all per an agreed interest period, not per year.
Interest period and debt exposure calculation are still open. A rate review
does not itself charge interest; avoid retroactive repricing. This controller
requires simulation and explicit treatment of money creation/destruction.

## Chance card candidates

Normalize amounts to C: refund +5%, grant +10%, expense -5%, penalty -10%.
Transfer candidate: receive 1% of C from each other participant, or pay each
1%; each multilateral effect must define its full atomic settlement boundary.
Movement candidate: move forward three spaces, subject to explicit crossing
and landing rules. Temporary sector bonus/penalty candidates require agreed
rent formulas and duration. No probabilities, deck model, or debt-shortfall
behavior is accepted. Equal positive/negative card counts do not prove balance.

## Auction and exchange candidates

Auction: opening price 60% of fixed price (40% discount), minimum step 5% of
fixed price, rounded to the monetary unit with positive minimum. Cyclic bids
in turn order, landing player first, irrevocable pass, no rebid by the current
leader. End when a leader exists and all others passed; all-pass leaves asset
unowned and resumes the landing player's turn. Current leader's funding is
reserved; conflicting spending and ownership changes are blocked. A live bid
may not be cancelled. Credit eligibility and response deadlines remain open.

Exchange: initiator owns current turn, submits exact asset/cash bundles for
both sides, recipient accepts or declines. Counteroffer would be a new version
requiring fresh acceptance. For MVP propose one blocking negotiation, no
counteroffers, resolved before continuing the turn. Revalidate ownership,
available cash, restrictions, and exact offer revision at acceptance; transfer
both bundles atomically or change nothing. Pure sale is a valid bundle pair.
Encumbrances, construction, shares, debt transfer, and timeout semantics remain
open; no implicit permission to trade such assets or borrow to settle.
