# Architecture Contract

Status: architecture discovery.

## Decision status

### Accepted constraints

1. `game-core` is independent of UI, server frameworks, persistence, network,
   renderer, and platform SDKs.
2. The server is the authoritative source of game state.
3. Game scenarios are deterministic and reproducible from versioned state,
   ordered inputs, time, randomness, and rules.
4. Financial transitions are atomic.
5. Command handling protects against duplicates and races.
6. Rules, commands/events, and persisted state are versioned.
7. Tests prove business invariants and state sequences, not only functions.
8. Mechanics and platform adapters can expand without rewriting the core.

Changing these constraints requires a user decision with the CTO.

### Accepted backend stack — 2026-11-06

User approval: TypeScript modular backend and pure deterministic game core,
executed with Node.js outside the core. Voice evidence:
/srv/agent-runtime/state/inbox/VOICE-20261106T125957975023Z-fb8271/transcript.txt.
Frontend is out of the active effort; prior Vue/Pixi suggestions are preliminary.
No HTTP framework, database, transport or deployment choice is implied.

### Preliminary frontend direction

- TypeScript modular architecture.
- Vue 3 browser application.
- Node.js authoritative server.
- A pure deterministic TypeScript game core.
- PixiJS is a renderer candidate, not an accepted dependency.

The CTO may refine this direction but must bring a new fundamental technology or
stack choice to the user before acceptance.

### Open decisions

- Database and persistence model.
- State storage versus event sourcing, snapshots, or a hybrid.
- WebSocket protocol and client projection synchronization.
- Reconnect, timeout, command idempotency, and recovery contracts.
- Hosting, deployment, observability, and room distribution.
- Final game-state, command, domain-event, and error models.
- Renderer choice and frontend state architecture.

## Target repository boundaries



```text
apps/
  web/            Vue 3 application
  server/         Node.js authoritative server
packages/
  game-core/      Pure game rules engine
  protocol/       Shared commands, events, and DTOs
  test-utils/     Fixtures and deterministic simulations
infra/            Product infrastructure and deployment
docs/             Product and architecture knowledge
openspec/         Specifications and active changes
```

Dependencies point from applications toward packages. `game-core` must not
import applications, infrastructure, renderer, database, transport, or platform
adapters.

## Game core boundary

The core owns domain validation, phases, game transitions, financial rules,
ownership, and domain events. It performs no external I/O. Time and randomness
are trusted explicit inputs.

Current proposed entry shape:

```ts
execute(state, actorId, command, context): EngineResult
```

This signature is not yet an accepted API. Discovery must define actor
semantics, system actions, context trust, success/error results, event ordering,
random consumption, and versioning. A rejected command must not partially
change state or consume hidden external input.

## Authoritative server boundary

The server owns authenticated participants, sessions, access control, command
serialization, timers, persistence, recovery, client synchronization, and
private projections. It derives the actor from authenticated context and sends
trusted inputs to the core. It must not maintain a second conflicting set of
game or financial rules.

Clients send intent and render player-visible projections. Optimistic display
and animation may not become authoritative state.

## Exact money and concurrency

Money must use an exact representation selected during discovery. Each economic
operation defines its complete atomic boundary and invariants. Duplicate or
concurrent command delivery must not cause a repeated economic effect.

In-memory serialization alone is not a complete recovery or multi-instance
contract. Persistence, acknowledgement, event delivery, and replay semantics
must be decided together.

## Optional rules and independent procedures — 2026-11-05

Accepted user direction: base gameplay runs with bank credit/interest disabled;
later mechanics are optional layers. Enabled mechanics and their versions are
part of saved rules configuration. Core independence and atomicity remain
binding. Layer dependencies, valid combinations, and effect ordering must be
explicit before implementation. No plugin framework is selected.

Persistent offers have lifetimes independent of turn phases. Core state must
represent outstanding offers separately from turn progress. Acceptance, bids,
expiry, and other resource-changing commands share authoritative ordering and
revalidate current conditions. Exact expiry boundaries, auction clock policy,
and phase restrictions remain open. Time reads and scheduling stay outside the
core; trusted time inputs permit deterministic local simulation.

## Saved-game versions

Every saved game records rules configuration, board generation result, and the
versions needed to interpret state and events. Incompatible state must never be
silently read under new rules. Migration and compatibility policy remain open.
