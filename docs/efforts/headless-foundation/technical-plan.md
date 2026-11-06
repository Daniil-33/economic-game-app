# Headless foundation technical plan

Status: Team Lead technical direction, revision 1. CTO effort revision 1 accepted.
Baseline: 0674733f68b754a14a68c32e8a51e1451c046808.

## Integration and ownership

Three sequential tasks avoid shared-contract writes. TASK-hf-design owns the
reviewable technical design and OpenSpec proposal only. TASK-hf-kernel owns
package/tooling, versioned execution contracts, deterministic setup, and their
specs/tests. TASK-hf-turns extends that accepted contract with turn boundaries,
fixture scenarios and local runner. No Engineer may implement a downstream task
under the design task. Later task handoffs must be revised with accepted proposal
and upstream SHA before launch. Team Lead owns technical acceptance and ordering.

## Proposed internal design to validate during Explore

Use a pure packages/game-core boundary with a Node runner outside it. An explicit
trusted input envelope carries actor/system identity, command identity, expected
state revision, time and finite scripted dice. Ordered execution returns explicit
success, rejection or duplicate outcomes, versioned state and ordered events.
Validate complete input before publishing state/events; choose and document exact
duplicate precedence, random consumption and concurrency semantics in the proposal.
Do not introduce persistence/recovery guarantees or a transport protocol here.

Keep setup order and active-turn progression as distinct explicit phases. Preserve
relative positions of untied players while recursively rerolling tied groups.
Separate a fresh doubles turn from the 20-second continuation of a forced roll.
Use legal scripted states to isolate movement/settlement boundaries; fixtures do
not establish a board catalog, an economy or prison-release behavior. Any required
undefined effect is an explicit unsupported boundary, never a silent successful
settlement. Proposal must explain how third doubles prison entry can be proved
before movement/reward without implementing release.

## Acceptance evidence

Design must map every effort criterion to a specification scenario and owning task.
Kernel proves 2 and 6 players, invalid counts, one-d6 setup, recursive ties,
version rejection, duplicate and stale-revision handling, immutable rejection,
explicit random validation and deterministic replay. Turns prove 45 seconds,
end-before-roll rejection, forced roll plus 20 seconds with quotas retained,
ordinary completion, fresh doubles turns, third doubles prison entry before
movement/reward, ordered events, deadline edges and timer/End Turn races in both
serialized orders. Include nonzero consumed-quota fixtures where meaningful.
Reject malformed inputs without partial state/event/random effects. Technical
checks include strict typecheck, meaningful sequence tests, and core import/I/O
boundary inspection. Full replay compares state, results and ordered events.
Independent review targets exact base/head; changed heads require fresh evidence.

## Delivery limits

No remote exists at baseline; protected main, hosting permission and remote CI are
unverified. Local exploration and verification may proceed. No merge-completion
claim without hosting, PR, independent review and current-head CI. No deployments
or capacity expansion. Repository-local agent attribution uses an .invalid email.

## Gates

Design Engineer stops at committed proposal and asks Team Lead for acceptance.
Semantic gaps go to CTO before Apply; independent design work continues.
Substantial implementation starts in a fresh context using accepted durable
proposal and current acknowledged handoff. Two returns maximum per strategy.
