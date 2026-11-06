# Development Workflow

## Flow

```text
User + CTO planning
  -> CTO effort handoff
  -> Team Lead design and decomposition
  -> Engineer OpenSpec cycle
  -> independent review
  -> current-SHA CI and acceptance
  -> merge
  -> specification and roadmap reconciliation
```

The user defines expected behavior and acceptance criteria with the CTO but is
not a routine PR approver. Escalation follows Engineer -> Team Lead -> CTO ->
User and stops at the lowest role with authority.

## OpenSpec

Each behavior-changing task uses:

```text
Explore -> Propose -> Apply -> Verify -> PR -> Review fixes -> Complete
```

For substantial or architecture-sensitive work, Apply begins in a fresh
Engineer context using only the accepted handoff, committed OpenSpec proposal,
and referenced decisions. The runtime requires the current handoff revision to
be delivered and acknowledged before this transition.

Specs and active changes stay in `openspec/` beside code. A merged behavior
change leaves canonical specs and durable docs consistent with implementation.

## Git and review

- Protected `main` and isolated feature branches/worktrees.
- Pull requests identify exact acceptance criteria and commit range.
- Independent review follows the infrastructure Review Skill.
- CI and review must apply to the current head SHA.
- Hard Violations block merge. Medium Risks require authorized disposition.
- Non-Blocking Specification findings do not block merge.

Routine PRs merge automatically after CI, independent review, and Team Lead or
CTO acceptance at the appropriate level. A PR containing a reserved unresolved
decision waits for the user.

## Environments

Autonomous deployment is limited to staging. Production policy and approval do
not exist until separately accepted.

## Completion

An effort is complete when acceptance evidence passes, PRs are merged, OpenSpec
and durable documentation are reconciled, residual risks have owners, and no
blocker exists only in a transient session or checkpoint.
