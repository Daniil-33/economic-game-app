# TASK-hf-turns implementation verification

Apply authority: accepted proposal fc47e5f3aab39021299e003b95d4b20cf292fdaa,
handoff revision 2 acknowledged in fresh Engineer session. Implementation range
starts at that proposal SHA; the exact resulting head is reported through agentctl.
The original kernel implementation is 37eac12d1f70a46eb8caa6fce40da36408f54532.

## Local checks — 2026-11-06

- `npm ci`: installed committed lockfile locally, four packages, zero audit findings.
- `npm run typecheck`: PASS, strict ES-only core plus separate Node tests/runner.
- `npm test`: PASS, 20 tests covering retained K01–K09 and T01–T09.
- `npm run replay`: PASS, 11 scenario scripts independently initialized twice;
  complete results, ordered events, receipts, consumption and final state match.
- `git diff --check`: PASS.
- K09 AST inspection: PASS across all core sources; imports remain internal,
  no ambient I/O, timer, clock, random source, Node or platform dependency.
- Final source/diff inspection: only bounded core/fixtures, external runner,
  tooling, tests and associated documentation/specification changed.

## Acceptance mapping

| Criterion | Evidence |
| --- | --- |
| T01 | Explicit system BeginTurns, 45 seconds, no setup timeout, end-before-roll/actor/phase/target errors |
| T02 | Exact/late forced rolls, 20 seconds from execution, nonzero quotas, duplicate/conflict/malformed dice |
| T03 | Exact event order; EndTurn/after-roll Timeout share settlement and normalized domain results |
| T04 | First/second doubles fresh IDs/time/quotas, nonzero quota reset for both, nondouble advances and wraparound |
| T05 | Voluntary/forced third doubles bypass unresolved crossing; prisoner-next rejects whole candidate |
| T06 | Deadline-1/equality/+1 eligibility; both equality serialization orders |
| T07 | Predeadline EndTurn vs old timer, timer vs old EndTurn, refreshed revision/old target rejection, forced doubles bonus after completion |
| T08 | Unknown IDs, purchase/rent/chance/crossing, pending settlement, required next prisoner; original state/events/dice retained |
| T09 | Public-API Node runner and automated execution test, full independent replay of successful/rejected/duplicate/race/boundary scripts |

All turn test calls freeze nested inputs and compare snapshots; rejection and
duplicate retain original state identity, empty events and zero consumption.
K06 now asserts successful explicit BeginTurns while preserving setup order,
no implicit turn and actor/phase rejection. K08 retains full replay and updates
the successful final BeginTurns revision/receipt expectations. Canonical active
command targets are tested for all three kinds; unknown metadata on untargeted
commands remains excluded from identity. Safe deadline overflow is atomic.

## Fixture ownership and limits

Frozen internal versioned registry; trusted config selects only an allowlisted ID.
Creation records selection; BeginTurns applies seeds to first/next ranked players
after normal setup resolves their identities. Progress tracks accepted repeated
opaque no-obligation landings per participant. Detailed seed table is in
packages/game-core/README.md. No custom callbacks, board indices, financial values,
prison release, reward, house/offer execution or silent settlement is introduced.
No persistence compatibility is claimed for the in-development version-1 schema.

## Delivery evidence still required

`git ls-remote origin` returned successfully with no advertised refs. `gh auth
status` reports no logged-in host. Repository permissions, branch protection and
CI queries via `gh api`/`gh run list` could not authenticate. No push, PR creation,
remote mutation, merge or deployment was attempted; no operation retry is pending.
Independent review, Team Lead acceptance and current-head hosted CI remain open.
Hosting gates are not waived by local checks. Any future external mutation must
first have verified access and an agentctl operation intent, then confirmation.

Request Team Lead arrange independent review for the exact proposal-to-result
range, using /srv/agents/infrastructure/templates/engineer-to-reviewer.md and
skills/autonomous-code-review/SKILL.md. Review canonical docs/product.md CTO turn
interpretation, docs/architecture.md, docs/efforts/headless-foundation/design.md,
turns handoff revision 2, accepted proposal and T/K OpenSpec scenarios. Review must
return an exact-head report; author evidence above is not independent acceptance.
