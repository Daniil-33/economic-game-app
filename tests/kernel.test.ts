import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, execute, RULES_VERSION, type Envelope, type GameState, type EngineResult } from '@economic-board-game/game-core';

const config = { stateVersion: 1, rulesVersion: RULES_VERSION };
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) freeze(item);
    Object.freeze(value);
  }
  return value;
}
function session(ids = ['A', 'B']): GameState {
  const result = createSession(freeze(config), freeze(ids));
  assert.equal(result.kind, 'created');
  if (result.kind !== 'created') throw new Error('creation failed');
  return freeze(result.state);
}
function request(commandId = 'round', expectedRevision = 0, dice: readonly number[] = [2, 2], nowMs = 10): Envelope {
  return { commandVersion: 1, commandId, expectedRevision, actor: { kind: 'system' }, command: { kind: 'SetupRound' }, context: { nowMs, dice } };
}
function run(state: GameState, input: unknown): EngineResult {
  const before = structuredClone(state);
  const inputBefore = structuredClone(input);
  const result = execute(freeze(state), freeze(input));
  assert.deepEqual(state, before);
  assert.deepEqual(input, inputBefore);
  if (result.kind !== 'success') {
    assert.strictEqual(result.state, state);
    assert.deepEqual(result.events, []);
    assert.equal(result.consumedDice, 0);
  } else {
    assert.notStrictEqual(result.state, state);
    assert.equal(result.state.revision, state.revision + 1);
    result.events.forEach((event, ordinal) => {
      assert.equal(event.eventVersion, 1);
      assert.equal(event.revision, result.state.revision);
      assert.equal(event.ordinal, ordinal);
    });
  }
  return result;
}
function reject(state: GameState, input: unknown, error: string): void {
  const result = run(state, input);
  assert.equal(result.kind, 'rejected');
  if (result.kind === 'rejected') assert.equal(result.error, error);
}
function success(state: GameState, input: unknown) {
  const result = run(state, input);
  assert.equal(result.kind, 'success');
  if (result.kind !== 'success') throw new Error('expected success');
  return result;
}

test('K01: creation boundaries, exact identifiers, no partial session or control input', () => {
  for (const ids of [['A', 'B'], ['A', 'B', 'C', 'D', 'E', 'F'], ['__proto__', 'constructor'], [' A', 'A']]) {
    const state = session(ids);
    assert.deepEqual(state.participants, ids);
    assert.deepEqual(state.setup, { phase: 'pending', groups: [ids] });
    assert.equal(state.revision, 0);
    assert.equal(state.lastNowMs, 0);
    assert.deepEqual(state.receipts, {});
  }
  for (const ids of [[], ['A'], ['A', 'B', 'C', 'D', 'E', 'F', 'G'], ['A', 'A'], ['', 'B'], [1, 'B'], ['x'.repeat(129), 'B'], Array(2), null, {}]) {
    assert.deepEqual(createSession(config, ids), { kind: 'rejected', error: 'INVALID_PARTICIPANTS' });
  }
  for (const invalid of [null, [], 1]) assert.deepEqual(createSession(invalid, ['A', 'B']), { kind: 'rejected', error: 'INVALID_CONFIG' });
  for (const invalid of [{}, { ...config, stateVersion: 2 }, { ...config, rulesVersion: 'future' }]) {
    assert.deepEqual(createSession(invalid, ['A', 'B']), { kind: 'rejected', error: 'UNSUPPORTED_VERSION' });
  }
  assert.equal(session(['x'.repeat(128), 'B']).participants[0]?.length, 128);
});

test('K02: malformed versions, envelope, actors, identity and safe numeric inputs', () => {
  const state = session();
  for (const field of ['stateVersion', 'rulesVersion']) reject({ ...state, [field]: 'future' } as GameState, request(), 'UNSUPPORTED_VERSION');
  for (const version of [undefined, 0, 2, '1']) reject(state, { ...request(), commandVersion: version }, 'UNSUPPORTED_VERSION');
  for (const input of [null, [], 1, 'command']) reject(state, input, 'INVALID_ENVELOPE');
  for (const commandId of ['', 'x'.repeat(129), null, 42]) reject(state, { ...request(), commandId }, 'INVALID_ENVELOPE');
  for (const actor of [null, {}, { kind: 'bot', id: 'A' }, { kind: 'player' }, { kind: 'player', id: '' }]) reject(state, { ...request(), actor }, 'INVALID_ENVELOPE');
  for (const command of [null, {}, { kind: 'Unknown' }, { kind: 'Timeout' }, { kind: 'Timeout', targetTurnId: '' }]) reject(state, { ...request(), command }, 'INVALID_ENVELOPE');
  for (const value of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, NaN, Infinity, '1', null]) {
    reject(state, { ...request(), expectedRevision: value }, 'INVALID_ENVELOPE');
    reject(state, { ...request(), context: { nowMs: value, dice: [1, 2] } }, 'INVALID_ENVELOPE');
  }
  for (const context of [null, {}, { nowMs: 0, dice: null }]) reject(state, { ...request(), context }, 'INVALID_ENVELOPE');
  const tied = success(state, request()).state;
  reject(tied, request('next', 1, [1, 2], 9), 'TIME_REGRESSION');
  success(tied, request('next', 1, [1, 2], 10));
  success(state, request('zero', 0, [1, 2], 0));
  reject(state, { ...request(), actor: { kind: 'player', id: 'A' } }, 'UNAUTHORIZED');
});

test('K03/K04: canonical receipts, precedence, conflicts, stale race and corrected rejection', () => {
  const initial = session();
  const accepted = success(initial, request('__proto__'));
  const current = accepted.state;
  assert.equal(Object.hasOwn(current.receipts, '__proto__'), true);
  assert.equal(Object.hasOwn(initial.receipts, '__proto__'), false);
  assert.deepEqual(current.receipts.__proto__?.events, accepted.events);
  const retry = run(current, request('__proto__', 0, [], 100));
  assert.equal(retry.kind, 'duplicate');
  if (retry.kind === 'duplicate') assert.strictEqual(retry.receipt, current.receipts.__proto__);
  // Context/key order/unknown adapter metadata do not form canonical request identity.
  const reordered = { context: { dice: [6], nowMs: 0 }, command: { kind: 'SetupRound', adapter: 'bot' }, actor: { kind: 'system' }, expectedRevision: 0, commandId: '__proto__', commandVersion: 1 };
  assert.equal(run(current, reordered).kind, 'duplicate');
  for (const delta of [{ expectedRevision: 1 }, { actor: { kind: 'player', id: 'A' } }, { command: { kind: 'BeginTurns' } }]) {
    reject(current, { ...request('__proto__'), ...delta }, 'ID_CONFLICT');
  }
  reject(current, request('__proto__', 0, [NaN]), 'INVALID_DICE');
  reject(current, { ...request('__proto__'), commandVersion: 2 }, 'UNSUPPORTED_VERSION');
  reject(current, request('racer', 0, [], 0), 'STALE_REVISION');
  reject(current, request('correctable', 1, [1]), 'DICE_COUNT');
  assert.equal(Object.hasOwn(current.receipts, 'correctable'), false);
  const next = success(current, request('correctable', 1, [1, 6]));
  const laterRetry = run(next.state, request('__proto__', 0, [3, 5], 1000));
  assert.equal(laterRetry.kind, 'duplicate');
  if (laterRetry.kind === 'duplicate') assert.deepEqual(laterRetry.receipt.events, accepted.events);
  success(initial, request('constructor', 0, [3, 4]));
});

test('K05: exact explicit d6 counts, invalid values and sparse arrays are atomic', () => {
  const state = session();
  for (const dice of [[], [1], [1, 2, 3]]) reject(state, request('d', 0, dice), 'DICE_COUNT');
  for (const dice of [[0, 1], [7, 1], [-1, 1], [1.5, 2], [NaN, 1], [Infinity, 1], Array(2), ['1', 2], [undefined, 2]]) {
    reject(state, { ...request(), context: { nowMs: 0, dice } }, 'INVALID_DICE');
  }
  assert.equal(success(state, request('d', 0, [1, 6])).consumedDice, 2);
  const exhausted = { ...state, revision: Number.MAX_SAFE_INTEGER };
  reject(exhausted, request('last', Number.MAX_SAFE_INTEGER, [1, 6]), 'REVISION_EXHAUSTED');
});

test('K06: descending 2/6 setup ends without implicit turns; integrated commands preserve phase/actor checks', () => {
  for (const ids of [['A', 'B'], ['A', 'B', 'C', 'D', 'E', 'F']]) {
    const initial = session(ids);
    const dice = ids.map((_, i) => i + 1);
    const result = success(initial, request('order', 0, dice));
    assert.deepEqual(result.state.setup, { phase: 'complete', groups: [...ids].reverse().map(id => [id]), order: [...ids].reverse() });
    assert.deepEqual(result.events, [
      { kind: 'SetupRolled', rolls: ids.map((participantId, i) => ({ participantId, die: i + 1 })), eventVersion: 1, revision: 1, ordinal: 0 },
      { kind: 'SetupOrderEstablished', order: [...ids].reverse(), eventVersion: 1, revision: 1, ordinal: 1 },
    ]);
    assert.equal('turn' in result.state, false);
    reject(result.state, request('again', 1, dice), 'INVALID_PHASE');
    reject(initial, { ...request('turn', 0, []), command: { kind: 'BeginTurns' } }, 'INVALID_PHASE');
    for (const state of [initial, result.state]) for (const kind of ['Roll', 'EndTurn', 'Timeout']) {
      reject(state, { ...request('turn', state.revision, []), command: { kind, targetTurnId: 't1' } },
        kind === 'Timeout' ? 'INVALID_PHASE' : 'UNAUTHORIZED');
    }
    const started = success(result.state, { ...request('turn', 1, []), command: { kind: 'BeginTurns' } });
    assert.equal(started.state.turn?.participantId, ids.at(-1));
  }
});

test('K07: leftmost recursive ties preserve fixed rank slots and stable member order', () => {
  let state = session(['A', 'B', 'C', 'D', 'E', 'F']);
  const rounds = [
    { dice: [6, 4, 4, 2, 2, 1], groups: [['A'], ['B', 'C'], ['D', 'E'], ['F']], rolled: ['A', 'B', 'C', 'D', 'E', 'F'], next: ['B', 'C'] },
    { dice: [3, 3], groups: [['A'], ['B', 'C'], ['D', 'E'], ['F']], rolled: ['B', 'C'], next: ['B', 'C'] },
    { dice: [1, 5], groups: [['A'], ['C'], ['B'], ['D', 'E'], ['F']], rolled: ['B', 'C'], next: ['D', 'E'] },
    { dice: [2, 6], groups: [['A'], ['C'], ['B'], ['E'], ['D'], ['F']], rolled: ['D', 'E'], next: null },
  ];
  for (const [i, round] of rounds.entries()) {
    const result = success(state, request(`r${i}`, i, round.dice));
    assert.deepEqual(result.state.setup.groups, round.groups);
    assert.deepEqual(result.events[0], { kind: 'SetupRolled', rolls: round.rolled.map((participantId, index) => ({ participantId, die: round.dice[index] })), eventVersion: 1, revision: i + 1, ordinal: 0 });
    if (round.next) assert.deepEqual(result.events[1], { kind: 'SetupTiePending', participants: round.next, eventVersion: 1, revision: i + 1, ordinal: 1 });
    state = result.state;
    if (i === 2) reject(state, request('invalid', 3, [7, 2]), 'INVALID_DICE');
  }
  assert.deepEqual(state.setup.phase === 'complete' && state.setup.order, ['A', 'C', 'B', 'E', 'D', 'F']);
  state = session();
  for (let i = 0; i < 128; i++) state = success(state, request(`tie${i}`, i, [4, 4], i)).state;
  assert.deepEqual(state.setup, { phase: 'pending', groups: [['A', 'B']] });
});

test('K08: independent complete replay includes success/rejection/conflict/stale/duplicates', () => {
  const script: unknown[] = [
    request('first', 0, [6, 4, 4, 2, 2, 1]), request('first', 0, [], 20),
    request('first', 0, [NaN]), { ...request('first'), actor: { kind: 'player', id: 'A' } },
    request('stale', 0), request('second', 1, [3, 3]), request('third', 2, [1]),
    request('third', 2, [1, 5]), request('fourth', 3, [2, 6]), request('fourth', 3, [1, 1], 30),
    { ...request('start', 4, []), command: { kind: 'BeginTurns' } },
  ];
  function replay() {
    let state = session(['A', 'B', 'C', 'D', 'E', 'F']);
    const results = [];
    for (const input of script) { const result = run(state, structuredClone(input)); results.push(result); state = result.state; }
    return { results, state };
  }
  const one = replay();
  assert.deepEqual(one, replay());
  assert.deepEqual(one.results.map(r => r.kind), ['success', 'duplicate', 'rejected', 'rejected', 'rejected', 'success', 'rejected', 'success', 'success', 'duplicate', 'success']);
  assert.deepEqual(one.results.map(r => r.consumedDice), [6, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0]);
  assert.equal(one.state.revision, 5);
  assert.deepEqual(one.state.setup.phase === 'complete' && one.state.setup.order, ['A', 'C', 'B', 'E', 'D', 'F']);
  assert.deepEqual(Object.keys(one.state.receipts), ['first', 'second', 'third', 'fourth', 'start']);
});
