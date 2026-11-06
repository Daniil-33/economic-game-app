# Engineer -> Reviewer Request

```yaml
review_id: REV-hf-design-1
project: economic-board-game
effort: EFF-headless-foundation
task: TASK-hf-design
handoff_revision: 1
base_sha: 507ca02b910904864aec6b3b2910bcc4adedef50
head_sha: 5da5697afdb26f72e5d26873cc1ea623ea89d919
```

## Outcome and acceptance criteria

Review the four design-only files against design-handoff.md revision 1 and
CTO effort revision 1. Assess accepted-source traceability, completeness of
K01-K09/T01-T09, coherent execution and setup contract, safe fixture boundaries,
and whether pending semantics remain explicitly gated rather than invented.

## Scope and non-goals

Exact range above, documentation/OpenSpec only. No product implementation,
package scaffolding, remote CI or playable game is claimed. This request is
prepared by Team Lead on the author's evidence; the reviewer is independent.

## Canonical references

AGENTS.md; docs/efforts/headless-foundation.md revision 1;
docs/efforts/headless-foundation/design-handoff.md revision 1;
docs/efforts/headless-foundation/technical-plan.md revision 1;
docs/product.md; docs/architecture.md; docs/mvp-rules-proposal.md;
docs/development-workflow.md; proposed design and OpenSpec at exact head.

## Required invariants

Core independence, explicit time/randomness, determinism, atomic effects,
versioning, idempotency/race protection, no invented product semantics.

## Author verification

Author reports whitespace and 18-scenario audit pass; clean worktree.
No OpenSpec executable, TypeScript/package/CI config or remote available.
Team Lead read entire diff and identified pending CTO gate T06/T07.

## Known risks and limitations

Deadline equality and forced-doubles continuation await CTO disposition.
Kernel design may proceed but turns Apply cannot. No merged delivery claim.

## Required output

Apply infrastructure skills/autonomous-code-review/SKILL.md and report contract.
Return complete report tied to exact head; no edits or semantic authorization.

## Re-review

Initial review; no prior report.
