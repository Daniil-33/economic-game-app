# Headless foundation

Status: accepted technical proposal; CTO semantics reconciled on 2026-11-06. Task-specific Apply authorization remains required.

## Why

The accepted first roadmap effort needs a deterministic headless contract before
kernel and turn implementation. Existing documentation has no runnable core.

## Changes

Propose pure versioned execution, setup ranking, bounded turn transitions,
explicit fixture limitations and sequence/replay evidence. The complete contract
and unresolved semantic gate are in
../../../docs/efforts/headless-foundation/design.md.

## Scope and impact

Future packages/game-core kernel then turns, and external Node scenario runner.
This change currently contains documentation/specifications only. No economy,
board generation, prison release, server, persistence, frontend or deployment.
Normative requirements follow accepted technical design and the CTO interpretation
in docs/product.md, CTO interpretation: turn boundary execution. Downstream
handoffs pin exact upstream SHAs; fresh Apply remains a separate gate.
