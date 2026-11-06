# Kernel implementation evidence

Task TASK-hf-kernel, acknowledged handoff revision 2. Apply acceptance is for
proposal d98981487e59f6044c68afa0eb50e144cde9448d; upstream contract
5da5697afdb26f72e5d26873cc1ea623ea89d919. Implementation review range begins at
that proposal commit. This document is author evidence, not independent review.

Local environment: Node v26.13.0, npm 11.20.0. `npm ci --ignore-scripts`
reproduces the generated lockfile with TypeScript 5.9.3 and @types/node 26.0.0
(undici-types locked at 8.3.0); zero reported vulnerabilities. No runtime deps.

Checks: `npm run typecheck`, `npm test` (8 passing Node tests), and
`git diff --check`. Typecheck builds the core's public declarations before
checking tests; a clean generated-output run verifies that order. Core has
strict ES2022-only ambient types; tests separately enable Node types.

- K01/K02: two/six participant bounds, malformed creation/envelopes, IDs including
  __proto__/constructor, versions, actor/command shape, safe integer time and
  revision, monotonic/equal logical time, system authorization.
- K03/K04: canonical identity independent of object key order and context,
  receipt evidence, duplicate precedence, changed-identity conflict, stale
  revision, malformed retry precedence, corrected rejected IDs and frozen nested
  input snapshots. Rejections/duplicates retain exact input state identity.
- K05: exact dice count, invalid/nonfinite/fractional/sparse d6 arrays, successful
  consumption and revision overflow guard. All preconditions precede publication;
  ranking has no fallible external callback or post-publication operation.
- K06/K07: explicit complete setup without turn state/events, unsupported active
  commands, repeated rounds and stable leftmost tie-group ranking A,C,B,E,D,F.
- K08: independent replays compare entire results/states/receipts/events and dice
  consumption, with separately asserted sequence and final order.
- K09: executable AST source inspection checks internal imports and ambient
  I/O/clock/random/dynamic import usage; strict core compilation excludes Node.
  Manual import/source inspection agrees. No app, persistence, platform, network
  or control-type dependencies exist in core.

No turn behavior, timers, prisoner handling, settlement or financial convention
has been added. `execute` takes a core-created state; arbitrary corrupt saved
state recovery is outside scope. Readonly returned values remain caller-owned
immutable data; the implementation does not freeze caller objects at runtime.

Origin is configured. The accepted handoff context records unauthenticated gh
and no refs advertised by ls-remote; hosting write access/protection/CI is not
established. No push, PR, merge or hosting change was attempted in Apply. Remote
CI and exact-head independent implementation review remain pending, as does
Team Lead technical acceptance. No merged/completed delivery is claimed.
