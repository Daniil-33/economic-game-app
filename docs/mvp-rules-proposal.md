# MVP rules proposal — 2026-11-06

Status: accepted baseline profile by explicit user approval on 2026-11-06.
Source: /srv/agent-runtime/state/inbox/VOICE-20261106T125957975023Z-fb8271/transcript.txt.
This approval accepts concrete proposed rules, not an automatic resolution of
items explicitly left open. Historical "candidate", "propose" and "unaccepted"
wording below is superseded for concrete choices by this status notice.
Eight collective circuits' counting scheme, exact board indices/catalogs,
monetary denomination/rounding and multi-creditor settlement remain open.
Implement only a bounded effort whose dependencies on these are resolved.
Final engineering handoff readiness is determined per effort, not for all MVP.

## Mortgage, houses, offers, auction

Mortgage advance floorMoney(0.50*fixedAssetPrice); store actual advance and
redeem for exactly that amount. Sell houses for floorMoney(0.50*buildPrice).
No construction on a mortgaged asset. Eight collective circuits and counting
scheme remain open. Offers expire after 90 seconds, originator may cancel;
acceptance while in mandatory settlement may not impair its funding.

Auction package: open at 60% of fixed price, minimum increment 5% of fixed
price, positive money-unit minimum and explicit rounding. First bid may equal
opening price. Cyclic turns, landing player first, permanent pass; 15 seconds
without response means pass. Current leader skips bidding; all opponents out
ends with leader winning; no bids leaves asset unowned. Reserve leader's funds,
pause normal turn clock, and resume settlement if entered via End Turn/timeout.
Optional credit is not implicitly usable. All these details require confirmation.

## Bankruptcy

Propose for base MVP with one rent creditor: if no legal liquidation plan covers
rent, sell houses at normal resale rates, pay min(outstandingRent,cash+houseSale
proceeds) to creditor, then eliminate debtor. Do not create new mortgages on
assets immediately freed. Remaining bad debt is written off, without compensation
from bank. Remove all houses, clear existing asset mortgages, return all assets
unowned at original purchase prices, cancel offers involving eliminated player,
remove from order; debtor does not reenter. No asset transfer to creditor.
Whether unused residue can occur under final legal constraints must be checked;
do not silently destroy/redistribute money. Bankruptcy effects commit atomically.
Multilateral chance debts require a separate payout ordering/pro-rata contract;
do not include those cards in first executable subset without defining it.
Propose last active player wins; simulation step cap yields incomplete run, not
an invented winner. Both are unaccepted product decisions.

## Candidate 40-space board

28 assets: eight ordinary groups (2+6*3+2=22); four assets with group-ownership
rent; two assets with dice-dependent rent (candidate third mechanic, not inferred
from Monopoly). Four special spaces (start/prison/casino/go-to-prison), eight
chance spaces. Exact indices, catalog category matching, and player-count effect
on composition remain open. Candidate initial profile 2-6 players.

Generate ordinary prices by ranked slots with bounded +/-10% variation while
preserving tier order; save fixed generated prices. Set cash using alpha=600/569
and S/N. Asset prices alone do not determine group/catalog mechanics.

Candidate ordinary rent schedule relative to purchase price: 0 houses 5%; owning
whole group with no mortgages doubles bare rent; 1/2/3/4 houses 15/35/65/100%.
One house costs 50% of that asset price; max four; require entire group, no group
mortgages, and even building/sale (house-count difference <=1). One new house
per turn remains binding. Values are untested placeholders; rounding open.
Four-asset group's rent is 5/10/20/40% of landed asset price for 1/2/3/4 active
holdings; mortgaged holdings excluded. Two-asset dice group rent candidate is
(groupMeanPrice * movementDiceSum / 200) * activeHoldings. No houses on these
two special group types. Exact reference-rent normalization for accepted
liquidation score must be defined; propose expected dice sum seven for this type.

## Candidate special spaces and setup

Setup one six-sided die each, descending result; reroll ties within positions.
Movement two six-sided dice. Third consecutive double sends directly to prison
before movement/reward, resets streak and ends turn; ordinary nondouble resets.
Prison: up to three personal turns attempting doubles; successful double exits
and moves without bonus turn; after third failed attempt pay one circuit reward
and move by failed roll. Allow voluntary release for one reward before rolling.
Mandatory fee uses collection rules; prison fee/prison timing remain unaccepted.

Circuit reward accepted ratio 2/15 initial cash; propose award on each forward
start crossing including exact landing, never for direct prison transfer or
reverse movement. Cards explicitly decide crossing effects.
Casino candidate: optional once-per-landing wager up to 10% initial cash, 50%
win probability, profit equal wager or loss of wager; skipping/timeout no wager.
Unsettled mandatory payments prohibit gambling. No future credit dependence.
Initial executable chance subset: +/-5%, +/-10% initial cash, equal draw weights,
independent draws. Wider user-approved provisional catalog remains available
for subsequent effect specification; cannot pretend undefined effects executable.

All prices, rates, timeout policies, rules combinations and saved games versioned.
No acceptance claim or engineering handoff until user choices and scenario
acceptance criteria are settled.
