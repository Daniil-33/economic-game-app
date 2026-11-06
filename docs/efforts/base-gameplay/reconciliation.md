# Team Lead reconciliation and CTO decision request

Status: technical planning disposition; no Apply or merge authorization.
Board proposal: 91d7aa52ef75beed9974f8434d28fd6c3784abd0.
Economy proposal: 1e70a0ca00466132c536f4d9f68dd2e976dcc033.
Both descend from a1e0739405329ff40ea80e0b4f93e38e7e99c906.
Both design deliverables satisfy B01–B04/E01–E05 for planning only. Full scoped
ranges inspected; diff checks pass; no product code/tests changed. Independent
review and current-head CI remain required before eventual merge acceptance.

## Technical interface disposition (Team Lead authority)

- Board owns pure generateBoard(config, trustedDraws), config/catalog validation,
  composition, fixed prices and a complete immutable GeneratedBoard result.
  It publishes no session state or financial outcome. Failure commits no draws.
- Use boardVersion as the result schema field (economy resultVersion is the same
  concept, not a second version). Distinct rules/state/command/event versions
  identify the new gameplay mode. Preserve legacy v1 fixtures unchanged and
  reject mixed versions. No implicit migration or persistence choice.
- GeneratedBoard contains ordered cells 0..39 with stable IDs, group mechanics,
  membership, exact reference/fixed prices, explicit start/prison coordinates,
  participantCount, policy versions, normalized config/catalog and draw trace.
  A separate boardId is unnecessary for this slice: save the immutable result.
- Board and economics share one value codec: bigint internal arithmetic and
  canonical unsigned decimal-string integer serialization are the recommended
  implementation if the user selects an integer ledger. The representation
  recommendation does not decide denomination, rounding or product range.
- Economics consumes that board directly; ownership, positions and balances are
  session state. Compute S once as the sum of all 28 fixed purchase prices for
  the proposed cash valuation; CTO confirms this product interpretation below.
  Read all group prices for dice-group mean, active holdings only for multiplier.
- Normalize movement coordinates relative to the explicit start index; preserve
  physical indices in board/state. No start=0 or prison=10 production assumption.
- New-session creation validates board/value/policy versions and computes all
  initial values before publishing any state. No AttachBoard command is needed
  for this slice. Board setup has no receipt until there is a separately scoped
  command; successful gameplay commands retain the kernel receipt boundary.
- BuyAsset identity includes assetId and targetTurnId plus existing semantic
  fields. Both canonicalization and comparison must include new fields.
  Movement, reward and landing effects are one candidate/commit with one revision.
- Unsupported mandatory effects reject the whole command in the bounded harness;
  they never waive debt, clear purchase choice, consume dice or advance a turn.
  This is an incomplete testable subset, not a playable-session claim. Approved
  full auction, collection and special-space rules are not re-opened by deferral.

The proposal SHAs remain unchanged. Future Engineer handoffs must cite this
reconciliation and reconcile proposal/spec wording before Apply. No source API
is frozen beyond the technical responsibilities above.

## Exact product decisions requested from CTO

CTO should resolve interpretations within its authority and route only reserved
foundational choices to User. Concrete suggestions below remain unaccepted.

| ID / owner | Decision and options | Recommendation and consequence |
| --- | --- | --- |
| P1 CTO -> User | Exact special/chance indices and asset/group placement: approved explicit layout versus generated layouts with explicit constraints | Obtain a versioned explicit first production layout. Configurable synthetic layout remains possible but cannot complete default-board delivery. |
| P2 CTO -> User | Catalog, reference prices, category/mechanic eligibility and selection distribution: explicit catalog selections versus defined weighted/uniform sampling, replacement and quotas | Obtain catalog/rank mapping and selection policy. No invented companies/prices or probability defaults. |
| P3 CTO -> User | Price generation: strict vs nondecreasing adjacent ranks, within-group order, tier/rank mapping, distribution over admissible prices, and count/dice asset price policy | Confirm each rule; recommend strict adjacent ordinary ranks and separately specified special prices. +/-10% alone defines bounds, not distribution. Blocks production generator. |
| P4 resolved for independent arithmetic | User decision at 569a577: quoted amount scale, quantum 10, Q(x)=10*floor(x/10) for nonnegative final amounts | Exact intermediates; same quantized transfer debit/credit; positive penalty obligation; stored mortgage advance redeemed unchanged. No rescaling or minimum payment. Production input constraints and catalog-dependent bounds remain outside the arithmetic task. |
| P5 CTO interpretation, User if foundational | Does N change board selection/layout, or only cash? Does S include all 28 fixed prices? | Recommend constant CLASSIC_40 composition for 2–6, N affecting cash only, S=sum(all 28 fixed prices). No production N mapping until confirmed. |
| P6 CTO interpretation, User if foundational | Finite bank account with initial reserves/solvency rules versus explicit source/sink accounting for setup, purchases and reward | Recommend explicit source/sink ledger entries, no invented bank reserve limit. Player rent transfers conserve payer+payee. Blocks financial initialization/purchase/reward. |
| P7 CTO interpretation, User if foundational | Reward before landing settlement versus after; own-asset and zero-rent dispatch; exact start landing dispatch | Recommend reward first within the same atomic Roll, own/zero-rent/start landing clears settlement, including exact-start crossing reward. Ordering affects affordability; dispatch affects turn completion, so these are not silently chosen by Team Lead. |

Already accepted: crossing includes exact forward start landing, no reward for
reverse/direct-prison transfer; two d6 movement; fixed session prices; formula
ratios; auctions on unresolved purchase completion. Do not ask to reapprove these.
Only the unresolved ordering/dispatch and production data are requested above.

## Readiness and next handoffs

After decisions: money codec/arithmetic -> configurable board validator/generator
-> movement/economic integration, with separate auction proposal if needed.
Money and board may proceed independently only after their actual prerequisites
are accepted. Use fresh Apply contexts, bounded current handoffs and exact-head
review/CI. Fixture-only schema/proof work needs an explicitly narrowed handoff;
it does not unlock production defaults or complete effort acceptance.

Active Team Lead task: consolidate proposals and obtain CTO disposition.
Engineers: proposal work finished; branches held, no restart needed.
Remaining decision owner: CTO, escalating reserved P1–P7 choices to User.
Technical owner: Team Lead for follow-up handoffs and integrated acceptance.
Decision package delivered now. Next readiness/handoff checkpoint estimated
15–30 minutes after canonical decisions arrive; implementation/merge ETA is
not yet credible until policy and production data are fixed.

## Money readiness update

Canonical product clarification at 569a577 supersedes the proposals’ unresolved
rounding alternatives. Pure rational-to-money quantization and canonical integer
codec are ready independently of P1–P3/P5–P7. Team Lead selects bigint arithmetic
and decimal strings as technical representation, with no Number conversion.
The arithmetic helper accepts nonnegative integral numerator and positive integral
denominator and returns 10*(numerator/(10*denominator)) with exact integer division.
Zero is a valid arithmetic result: no invented minimum of 10. This does not decide
whether a production asset may have zero price or a zero rent creates an event.
Canonical amount codec accepts nonnegative decimal integers in the quoted scale;
it does not silently round arbitrary input or require multiples of 10. Validity
of reference/input prices and manually entered money is a separate domain gate.
No finite economic maximum is selected: bigint correctness is proved above safe
Number limits; any parser resource bound must be explicit and technically justified.
No residual denomination question blocks this pure helper. Residual questions:
may a generated asset quantizing to zero be admitted, what constraints apply to
reference/manual prices, and what events/settlement follow zero obligations?
These block affected board/domain integration, not exact arithmetic.
