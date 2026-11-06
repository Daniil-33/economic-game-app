# Apply verification

Handoff: TASK-bg-money revision 1; accepted API checkpoint/base
189bd5e88511ded0ea247f7a1c3b0437e9fda57f, branch agent/task-bg-money.
Implementation is limited to the pure exported money utility, focused tests,
API/error/resource documentation and this change's task/evidence files.

Environment: Node v26.13.0, npm 11.20.0; dependencies installed using npm ci
from the committed lockfile after the initial checks found tsc absent.

- npm run typecheck: passed strict core, test and runner checks.
- npm run build; node --test dist/tests/money.test.js: passed 4 focused tests.
- npm test: passed all 24 tests, including K09 purity and independent replay.
- npm run replay: passed all 11 synthetic scenarios, comparing full results,
  ordered events, receipts, consumed dice and final state.
- git diff --check: passed.
- Manual diff/source inspection: only additive public export and isolated pure
  helper; no command/state/event, board, catalog or economy defaults changed.
  No I/O, time, randomness, Number conversion or input mutation in money.ts.

The arithmetic oracle binary-searches the largest quantum count satisfying a
multiplicative inequality, independently of implementation division. Coverage
includes 6,923 small rationals, named boundaries, fractional edges, 400-digit
values, output inequalities/divisibility/idempotence and premature-rounding
regression. Codec tests include nonquanta, runtime types, malformed ASCII and
Unicode syntax, and final line terminators.

Native bigint/string/memory capacity is the remaining technical limit; no
production request admission or economic maximum is selected. Hosted CI and
independent review must be tied to the resulting exact commit before acceptance.
