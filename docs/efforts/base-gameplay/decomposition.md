# Base gameplay technical decomposition

Status: Team Lead accepts CTO handoff revision 1 for Explore/Propose only.
Source: d8f434d9703d8d6c832a30c82ee27efe803ff075, including merged foundation.

Two disjoint proposal tasks run within the existing two-Engineer limit:
TASK-bg-board-design owns configurable board/generator design;
TASK-bg-economy-design owns exact money and command/economy integration design.
Their handoffs define acceptance IDs, source ownership and explicit Apply gates.
No product code is assigned in this stage.

Integration order after proposal review: reconcile board/value schemas; resolve
reserved decisions canonically through CTO; create bounded money, board,
movement and atomic purchase/rent/reward Apply handoffs as readiness permits.
Auction is separate and must not be replaced with an invented refusal path.
Fresh Engineer contexts are required for substantial Apply. Preserve the merged
kernel's receipt precedence, time/turn identity, replay and fixture boundaries.

## Focused CTO decision package

1. Board data: exact special/chance indices, admissible ordinary-group placement,
selection catalog with reference prices, and whether N changes composition or
only initial cash. Options: provide the production profile now, or keep generator
configurable with fixture-only demonstrations until data is accepted. Recommend
the latter for independent technical progress; it cannot complete default-board delivery.
2. Money: denomination, range and rounding for generated prices, cash, each rent
formula and circuit reward. Options: integer minor units with explicit rational
rounding, or exact rational ledger amounts with separate display rounding.
Recommend integer units with checked rational intermediates, subject to user
choice of units and rounding. This blocks economic numeric Apply.
3. Integration: clarify finite bank ledger versus source/sink accounting; define
partial-slice handling of unaffordable rent, refused purchase/auction and landing
on special/chance spaces. Accepted full rules exist for portions of these, but
collection and special-space dependencies exceed this slice. Recommend explicit
unsupported-boundary atomic rejection for fixture-only paths pending separately
scoped mechanics, never claim a complete playable session.

Engineers must research these against canonical sources and refine only the
remaining unresolved questions with exact consequences before CTO disposition.
Expected proposal checkpoint: approximately 15-30 minutes, estimate only.
Apply/delivery ETA depends on reserved decisions and proposal review.
