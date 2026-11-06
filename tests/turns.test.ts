import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, execute, RULES_VERSION, type GameState, type Envelope, type Command, type EngineResult } from '@economic-board-game/game-core';
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
function fresh(scenarioId = 'turn-boundaries/v1'): GameState {
  const r = createSession({ stateVersion: 1, rulesVersion: RULES_VERSION, scenarioId }, ['A', 'B']);
  assert.equal(r.kind, 'created');
  if (r.kind !== 'created') throw new Error('creation');
  return r.state;
}
function input(s: GameState, kind: Command['kind'], nowMs = s.lastNowMs, dice: readonly number[] = [], id = `r${s.revision}-${kind}`): Envelope {
  const command: Command = kind === 'SetupRound' || kind === 'BeginTurns' ? { kind } : { kind, targetTurnId: s.turn?.turnId ?? 'absent' };
  return { commandVersion: 1, commandId: id, expectedRevision: s.revision,
    actor: kind === 'Roll' || kind === 'EndTurn' ? { kind: 'player', id: s.turn?.participantId ?? 'A' } : { kind: 'system' },
    command, context: { nowMs, dice } };
}
function run(s: GameState, e: unknown): EngineResult {
  const before = structuredClone(s), envelope = structuredClone(e);
  const r = execute(freeze(s), freeze(e));
  assert.deepEqual(s, before); assert.deepEqual(e, envelope);
  if (r.kind !== 'success') { assert.strictEqual(r.state, s); assert.deepEqual(r.events, []); assert.equal(r.consumedDice, 0); }
  else {
    assert.equal(r.state.revision, s.revision + 1);
    r.events.forEach((event, ordinal) => { assert.equal(event.ordinal, ordinal); assert.equal(event.revision, r.state.revision); assert.equal(event.eventVersion, 1); });
  }
  return r;
}
function ok(s: GameState, e: unknown) {
  const r = run(s, e); assert.equal(r.kind, 'success');
  if (r.kind !== 'success') throw new Error(JSON.stringify(r));
  return r;
}
function bad(s: GameState, e: unknown, error: string) {
  const r = run(s, e); assert.equal(r.kind, 'rejected');
  if (r.kind === 'rejected') assert.equal(r.error, error);
}
function start(id?: string): GameState {
  let s = fresh(id); s = ok(s, input(s, 'SetupRound', 0, [6, 1])).state;
  return ok(s, input(s, 'BeginTurns', 100)).state;
}
const kinds = (r: EngineResult) => r.events.map(e => e.kind);
function rolled(id?: string): GameState { const s = start(id); return ok(s, input(s, 'Roll', 101, [2, 3])).state; }

test('T01: explicit start, authorization, phase, target, no setup timeout and 45 seconds', () => {
  const pending = fresh();
  bad(pending, input(pending, 'Timeout', 999999), 'INVALID_PHASE');
  bad(pending, input(pending, 'BeginTurns'), 'INVALID_PHASE');
  const s = start(); assert.equal(s.turn?.deadlineMs, 45100); assert.equal(s.turn?.participantId, 'A');
  assert.equal(s.turn?.housesUsed, 0); assert.equal(s.turn?.offersUsed, 0);
  bad(s, input(s, 'EndTurn', 101), 'ROLL_REQUIRED');
  bad(s, input(s, 'BeginTurns'), 'INVALID_PHASE');
  bad(s, { ...input(s, 'Roll'), actor: { kind: 'player', id: 'B' } }, 'UNAUTHORIZED');
  bad(s, { ...input(s, 'BeginTurns'), actor: { kind: 'player', id: 'A' } }, 'UNAUTHORIZED');
  bad(s, { ...input(s, 'Timeout', 45100), actor: { kind: 'player', id: 'A' } }, 'UNAUTHORIZED');
  bad(s, { ...input(s, 'Roll'), command: { kind: 'Roll', targetTurnId: 'old' } }, 'TURN_MISMATCH');
  for (const kind of ['Roll', 'EndTurn', 'Timeout']) bad(s, { ...input(s, 'Roll'), command: { kind } }, 'INVALID_ENVELOPE');
  const ordered = ok(pending, input(pending, 'SetupRound', Number.MAX_SAFE_INTEGER, [6, 1])).state;
  bad(ordered, input(ordered, 'BeginTurns', Number.MAX_SAFE_INTEGER), 'INVALID_ENVELOPE');
});

test('T02: exact/late forced roll preserves nonzero quotas, receipt target identity and atomic dice', () => {
  for (const now of [45100, 46000]) {
    const s = start('quotas/v1');
    bad(s, input(s, 'Timeout', 45099, [2, 3]), 'DEADLINE_NOT_REACHED');
    for (const dice of [[], [2], [2, 3, 4]]) bad(s, input(s, 'Timeout', now, dice), 'DICE_COUNT');
    for (const dice of [[0, 3], [2.5, 3], [NaN, 3], Array(2)]) bad(s, input(s, 'Timeout', now, dice), 'INVALID_DICE');
    const e = input(s, 'Timeout', now, [2, 3]); const r = ok(s, e);
    assert.equal(r.state.turn?.turnId, s.turn?.turnId); assert.equal(r.state.turn?.deadlineMs, now + 20000);
    assert.equal(r.state.turn?.housesUsed, 1); assert.equal(r.state.turn?.offersUsed, 2);
    assert.deepEqual(kinds(r), ['DiceRolled', 'FixtureMoved', 'SettlementSatisfied', 'TurnContinued']);
    assert.equal(run(r.state, { ...e, context: { nowMs: now + 1, dice: [] } }).kind, 'duplicate');
    bad(r.state, { ...e, command: { kind: 'Timeout', targetTurnId: 'changed' } }, 'ID_CONFLICT');
  }
});

test('T03: ordered ordinary completion, fresh next quotas and identical shared settlement paths', () => {
  const before = start('quotas/v1'); const roll = ok(before, input(before, 'Roll', 101, [2, 3]));
  assert.deepEqual(kinds(roll), ['DiceRolled', 'FixtureMoved', 'SettlementSatisfied']);
  const s = roll.state;
  bad(s, input(s, 'Roll', 102, [2, 3]), 'INVALID_PHASE');
  bad(s, input(s, 'EndTurn', 102, [1]), 'DICE_COUNT');
  const end = ok(s, input(s, 'EndTurn', 102)); const timer = ok(s, input(s, 'Timeout', 45100));
  assert.deepEqual(kinds(end), ['TurnCompleted', 'TurnStarted']); assert.deepEqual(kinds(timer), kinds(end));
  for (const r of [end, timer]) { assert.equal(r.state.turn?.participantId, 'B'); assert.equal(r.state.turn?.housesUsed, 0); assert.equal(r.state.turn?.offersUsed, 0); assert.equal(r.state.turn?.deadlineMs, r.state.lastNowMs + 45000); }
  // Normalize only trusted execution time, derived turn times, and receipt identity.
  function domain(r: typeof end) {
    const { receipts, lastNowMs, turn, ...rest } = r.state;
    return { ...rest, turn: { ...turn, startedAtMs: 0, deadlineMs: 45000 },
      events: r.events.map(event => event.kind === 'TurnStarted' ? { ...event, deadlineMs: 45000 } : event) };
  }
  assert.deepEqual(domain(end), domain(timer));
});

test('T04: first/second doubles earn new same-player turns; nondouble resets streak', () => {
  let s = start('quotas/v1');
  for (const streak of [1, 2]) {
    s = ok(s, input(s, 'Roll', s.lastNowMs + 1, [3, 3])).state;
    assert.equal(s.statuses.A?.doublesStreak, streak); const old = s.turn!;
    s = ok(s, input(s, 'EndTurn', s.lastNowMs + 1)).state;
    assert.equal(s.turn?.participantId, 'A'); assert.notEqual(s.turn?.turnId, old.turnId);
    assert.equal(s.turn?.housesUsed, 0); assert.equal(s.turn?.offersUsed, 0); assert.equal(s.turn?.deadlineMs, s.lastNowMs + 45000);
  }
  s = ok(s, input(s, 'Roll', s.lastNowMs + 1, [1, 2])).state;
  assert.equal(s.statuses.A?.doublesStreak, 0);
  s = ok(s, input(s, 'EndTurn', s.lastNowMs + 1)).state; assert.equal(s.turn?.participantId, 'B');
  s = ok(s, input(s, 'Roll', s.lastNowMs + 1, [1, 2])).state;
  s = ok(s, input(s, 'EndTurn', s.lastNowMs + 1)).state; assert.equal(s.turn?.participantId, 'A');
});

test('T05: third doubles bypass unresolved crossing before movement; prisoner-next rejects whole roll', () => {
  for (const kind of ['Roll', 'Timeout'] as const) {
    const s = start('third-double/v1'); const r = ok(s, input(s, kind, kind === 'Roll' ? 101 : 45100, [4, 4]));
    assert.deepEqual(kinds(r), ['DiceRolled', 'PrisonEntered', 'TurnCompleted', 'TurnStarted']);
    assert.deepEqual(r.state.statuses.A, { custody: 'prison', doublesStreak: 0 });
    assert.equal(r.state.turn?.participantId, 'B'); assert.deepEqual(r.state.scenarioProgress, s.scenarioProgress);
    const blocked = start('third-double-prisoner-next/v1');
    bad(blocked, input(blocked, kind, kind === 'Roll' ? 101 : 45100, [4, 4]), 'UNSUPPORTED_BOUNDARY');
  }
});

test('T06/T07: strict deadline edges, equality races in both orders and old targets', () => {
  const s = rolled();
  for (const now of [45099, 45100, 45101]) {
    if (now < 45100) { ok(s, input(s, 'EndTurn', now)); bad(s, input(s, 'Timeout', now), 'DEADLINE_NOT_REACHED'); }
    else { bad(s, input(s, 'EndTurn', now), 'DEADLINE_REACHED'); ok(s, input(s, 'Timeout', now)); }
  }
  for (const now of [45100, 45101]) bad(start(), input(start(), 'Roll', now, [2, 3]), 'DEADLINE_REACHED');
  for (const timerFirst of [false, true]) {
    let current = s; const end = input(s, 'EndTurn', 45100); const timer = input(s, 'Timeout', 45100);
    if (!timerFirst) bad(current, end, 'DEADLINE_REACHED');
    current = ok(current, timer).state;
    bad(current, end, 'STALE_REVISION');
    for (const kind of ['EndTurn', 'Roll', 'Timeout'] as const)
      bad(current, { ...input(current, kind, 45101), actor: kind === 'Timeout' ? { kind: 'system' } : { kind: 'player', id: 'B' }, command: { kind, targetTurnId: s.turn!.turnId } }, 'TURN_MISMATCH');
  }
  const end = input(s, 'EndTurn', 45099), timer = input(s, 'Timeout', 45100);
  const next = ok(s, end).state; bad(next, timer, 'STALE_REVISION');
  assert.equal(run(next, end).kind, 'duplicate');
});

test('T07: first/second forced doubles continue same turn before earned fresh bonus', () => {
  let s = start('quotas/v1');
  for (const streak of [1, 2]) {
    const old = s.turn!; s = ok(s, input(s, 'Timeout', old.deadlineMs, [2, 2])).state;
    assert.equal(s.statuses.A?.doublesStreak, streak); assert.equal(s.turn?.turnId, old.turnId);
    assert.equal(s.turn?.housesUsed, old.housesUsed); assert.equal(s.turn?.offersUsed, old.offersUsed);
    assert.equal(s.turn?.deadlineMs, old.deadlineMs + 20000);
    s = ok(s, input(s, 'Timeout', s.turn!.deadlineMs)).state;
    assert.equal(s.turn?.participantId, 'A'); assert.notEqual(s.turn?.turnId, old.turnId);
    assert.equal(s.turn?.housesUsed, 0); assert.equal(s.turn?.offersUsed, 0);
  }
});

test('T08: unsupported landing/settlement/release and unknown fixtures never partially commit', () => {
  for (const scenarioId of ['unknown/v1', '__proto__']) assert.deepEqual(createSession({ stateVersion: 1, rulesVersion: RULES_VERSION, scenarioId }, ['A', 'B']), { kind: 'rejected', error: 'INVALID_CONFIG' });
  for (const id of ['purchase/v1', 'rent/v1', 'chance/v1', 'crossing/v1']) {
    const s = start(id); bad(s, input(s, 'Roll', 101, [2, 3]), 'UNSUPPORTED_BOUNDARY'); bad(s, input(s, 'Timeout', 45100, [2, 3]), 'UNSUPPORTED_BOUNDARY');
  }
  const pending = start('pending-settlement/v1');
  bad(pending, input(pending, 'EndTurn', 101), 'UNSUPPORTED_BOUNDARY'); bad(pending, input(pending, 'Timeout', 45100), 'UNSUPPORTED_BOUNDARY');
  const s = rolled('prisoner-next/v1');
  bad(s, input(s, 'EndTurn', 102), 'UNSUPPORTED_BOUNDARY'); bad(s, input(s, 'Timeout', 45100), 'UNSUPPORTED_BOUNDARY');
  let prison = start('third-double/v1'); prison = ok(prison, input(prison, 'Roll', 101, [3, 3])).state;
  // The next participant cannot move across this scenario's unresolved crossing either.
  bad(prison, input(prison, 'Roll', 102, [2, 3]), 'UNSUPPORTED_BOUNDARY');
});

test('T04/T07: second doubles reset nonzero quotas only on completion', () => {
  for (const kind of ['Roll', 'Timeout'] as const) {
    let s = start('second-double/v1'); const old = s.turn!;
    s = ok(s, input(s, kind, kind === 'Roll' ? 101 : 45100, [2, 2])).state;
    assert.equal(s.statuses.A?.doublesStreak, 2); assert.equal(s.turn?.turnId, old.turnId);
    assert.equal(s.turn?.housesUsed, 1); assert.equal(s.turn?.offersUsed, 2);
    s = ok(s, input(s, 'EndTurn', s.lastNowMs + 1)).state;
    assert.equal(s.turn?.participantId, 'A'); assert.notEqual(s.turn?.turnId, old.turnId);
    assert.equal(s.turn?.housesUsed, 0); assert.equal(s.turn?.offersUsed, 0);
  }
});

test('safe deadline arithmetic rejects forced/completing transitions atomically', () => {
  const s = start(); bad(s, input(s, 'Timeout', Number.MAX_SAFE_INTEGER, [2, 3]), 'INVALID_ENVELOPE');
  const after = rolled(); bad(after, input(after, 'Timeout', Number.MAX_SAFE_INTEGER), 'INVALID_ENVELOPE');
});


test('targetTurnId is canonical for each active command, while untargeted metadata stays ignored', () => {
  let s = start();
  const roll = input(s, 'Roll', 101, [2, 3]); s = ok(s, roll).state;
  bad(s, { ...roll, command: { kind: 'Roll', targetTurnId: 'other' } }, 'ID_CONFLICT');
  const end = input(s, 'EndTurn', 102); s = ok(s, end).state;
  bad(s, { ...end, command: { kind: 'EndTurn', targetTurnId: 'other' } }, 'ID_CONFLICT');
  const initial = fresh(); const setup = input(initial, 'SetupRound', 0, [6, 1]);
  const ordered = ok(initial, setup).state;
  assert.equal(run(ordered, { ...setup, command: { kind: 'SetupRound', targetTurnId: 'adapter-metadata' } }).kind, 'duplicate');
  const begin = input(ordered, 'BeginTurns', 100);
  const active = ok(ordered, begin).state;
  assert.equal(run(active, { ...begin, command: { kind: 'BeginTurns', targetTurnId: 'adapter-metadata' } }).kind, 'duplicate');
});
