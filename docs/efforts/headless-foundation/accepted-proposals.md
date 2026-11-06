# Team Lead proposal dispositions

## Design: 5da5697afdb26f72e5d26873cc1ea623ea89d919

Technical design accepted within Team Lead authority. Independent report
REV-hf-design-1 evaluated base 507ca02b910904864aec6b3b2910bcc4adedef50 through
this exact head: PASS, no Hard Violations or Medium Risks.

RVW-001 is non-blocking: T05 must explicitly assume the immediately next ranked
participant is not imprisoned. It starts that participant; it does not skip
prisoners. A sequence reaching an imprisoned next participant stops at the
unsupported release boundary atomically. TASK-hf-turns must clarify its proposal
and specification before Apply; this is consistency with the existing design,
not a new prison mechanic. Pending T06/T07 recommendations remain unaccepted
until durable CTO disposition. Design acceptance is not merged delivery.

## Kernel: d98981487e59f6044c68afa0eb50e144cde9448d

Proposal accepted for fresh-context Apply under kernel handoff revision 2.
Implement K01-K09 and the kernel-only refinements under
openspec/changes/headless-kernel/. Upstream independent review has no blocking
findings. Temporary unsupported turn commands preserve scope; no active-turn
behavior, economics or deadline semantics are authorized. Local dependencies,
lockfile and separate strict core/test compilation are approved technical choices.

Author verification and Team Lead diff check pass; implementation checks,
independent exact-head implementation review and CI remain future requirements.
Use agentctl operation intent/confirmation for external mutations. Current origin
is configured; unauthenticated gh cannot verify permission/protection/CI and
ls-remote advertises no refs. No external mutation has been attempted. Local
Apply can proceed; unavailable delivery evidence must not be claimed as passing.

## Next gates

Kernel Engineer verifies and commits implementation, requests independent review
and Team Lead technical acceptance. Changes to the public contract return to Team
Lead. Turns remains blocked pending accepted kernel and CTO semantic disposition.

## Kernel technical result and CTO reconciliation — 2026-11-06

Kernel exact implementation 37eac12d1f70a46eb8caa6fce40da36408f54532 is technically
accepted: REV-hf-kernel-1 PASS, no findings; Team Lead reran strict typecheck and
all eight tests successfully at that head. Local integration supports downstream
work; PR/current-head CI and remote merge are not established or waived.

CTO canonical product interpretation resolves T06/T07: strict-before player
commands, at-or-after Timeout, no implicit timeout; first/second forced doubles
retain same turn/quotas for 20 seconds then earned bonus after settlement;
third double goes immediately to prison before movement/reward without continuation.
Reconciled design/OpenSpec and turns handoff revision 2 now carry this disposition.
RVW-001 is clarified in T05; no prisoner skipping is permitted. TASK-hf-turns
may Explore/Propose against the locally integrated kernel, with separate fresh
Apply acceptance required. Historical pending-gate text above is superseded.

## Turns proposal: fc47e5f3aab39021299e003b95d4b20cf292fdaa

Exact branch HEAD inspected and accepted for fresh Apply under acknowledged
turns handoff revision 2. Author report's short reference 629d8f7 does not match
the verified commit; this acceptance applies only to the full SHA above. Base is
0d306f9f1fc273c7fd9577ae976f66b726310217. Three proposed files inspected in full;
exact-range whitespace check passes; no implementation is accepted yet.

Public targetTurnId on Roll/EndTurn, receipt identity changes, explicit turn/status
state, revision-derived turn IDs and immutable allowlisted versioned scenario
initialization are accepted technical refinements within the bounded harness.
Fixture seeds never establish real board/economic semantics. Kernel-only
unsupported-command tests must be updated without losing original invariants.

CTO strict deadline/forced doubles interpretation remains binding. Atomic
unsupported next-prisoner rejection and T05 free immediate-next precondition
preserve RVW-001 disposition. Never skip prisoners. A completing command that
cannot start the required participant rejects wholly without partial effects.

Install only committed local lockfile dependencies; missing local tsc is an
unperformed baseline check, not an implementation failure. Fresh Apply must
verify strict compilation, all kernel/turn tests, independent full replay, Node
runner and core boundary. Exact-head independent implementation review and
current-head CI remain mandatory before merge. No hosting gate is waived;
no remote operation is authorized merely by assumed authentication readiness.
