# Turn settlement planning — 2026-11-05

Status: proposed CTO package. Accepted behavior lives in product.md.

2026-11-06: the user accepted the liquidation loss formula including H=8;
other proposals here remain unaccepted unless product.md explicitly says so.

## Collective circuits

Candidate global counter G=min(completedPhysicalCircuits_i) over active players,
monotonic for the session. Mortgage deadline G_at_creation+8; ownership transfers
never change it. This can yield less than eight fresh personal circuits for a
player already ahead. Removing an eliminated lagging player can advance G and
expire mortgages immediately; recommend displaying and accepting this explicitly
or selecting an epoch scheme instead. Prison can stall G. Teleports/reverse
movement, crossing/expiry ordering, and circuit credit remain open.

## End-turn settlement

Propose 15-second bid timeout means pass. The auction owns its response clock;
normal turn clock pauses. If entered via timeout/End Turn, auction completion
resumes mandatory settlement then closes the turn; no new 45-second allowance.
Forced roll grants 20 seconds once per turn without resetting house/offer limits.
Doubles earned by a forced roll follow the agreed doubles rule after settlement;
they never skip outstanding obligations.

Propose cash rent settles immediately on landing. On shortage create an immutable
rent obligation (amount/payee) and allow manual funding until End Turn/timeout.
While unresolved, block discretionary purchases, construction, and outgoing
trades/payments that impair collection; allow compatible funding actions. Exact
offer-acceptance permissions during this phase require agreement.

## Automatic liquidation

Let R be rent and B available cash. D=max(0,R-B). Evaluate legal plans containing
house sales and new mortgages only; no speculative player trades, asset auctions,
redemption-remortgage loops, or implicit bank-credit draws. Existing mortgaged
assets cannot produce another advance. Respect all house sale/group constraints
once defined. Maximum legal proceeds determine solvency, not list-price wealth.

For plans raising at least D propose minimizing, lexicographically:
1. Loss(plan) = construction acquisition cost minus sale proceeds for sold houses
   + H * sum over affected assets(max(0, rentBefore-rentAfter)).
2. Excess proceeds above D.
3. Number of affected assets.
4. Stable asset/action identifiers.

H=8 is a proposed valuation weight, not predicted actual visits or true strategic
value. Rent is the normal payable amount for one reference landing under the
before/after ownership and building state, excluding transient modifiers; exact
rent formulas must exist first. Include group effects. This deliberately prices
mortgaged rent as zero through the comparison horizon. Bank advance itself is
liquidity, not profit; redemption obligation persists. Include a redemption fee
in Loss if such a fee is accepted. No claim of globally optimal player utility.

Choose the exact best legal plan for the accepted score via bounded search/DP
with a proven strategy for configured limits; no greedy fallback may silently
weaken DOM-09. The algorithm and budget are technical design still to prove.
Apply house sales, new mortgages, and full rent transfer atomically; keep excess
cash. Concurrent offers revalidate after the settlement and cannot double-spend.

If no legal plan covers D, bankruptcy follows accepted user direction. Do not
partially liquidate as a failed successful-payment plan. Bankruptcy recovery for
the creditor and treatment of remaining cash/buildings/encumbrances/offers are
open, so no complete bankruptcy transition is yet authorized.

Illustration: cash=200, rent=700, shortage=500. Plan A mortgages a bare asset,
raises 500, loses reference rent 40: score 320. Plan B sells houses costing 600
for 300 and mortgages another asset for 200, losing reference rent 15 in total:
score 300+120=420. Under the proposed score choose A. Parameters illustrative.

## Candidate calibration

Mortgage advance 50% of fixed purchase price; redemption equals advance with
no surcharge; house resale 50% of construction cost. These are proposals only,
and supersede no accepted coefficient. Optional credit remains excluded unless
its rules explicitly authorize automatic borrowing.
