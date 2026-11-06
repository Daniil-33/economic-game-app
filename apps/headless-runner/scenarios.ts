import assert from 'node:assert/strict';
import { createSession, execute, RULES_VERSION, type Envelope, type GameState, type EngineResult, type Command } from '@economic-board-game/game-core';
const participants = ['A', 'B'];
function create(scenarioId: string): GameState {
  const r = createSession({ stateVersion: 1, rulesVersion: RULES_VERSION, scenarioId }, participants);
  assert.equal(r.kind, 'created');
  if (r.kind !== 'created') throw new Error('Invalid harness scenario');
  return r.state;
}
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
function replay(scenarioId: string, script: readonly Envelope[]) {
  let state = create(scenarioId);
  const results: EngineResult[] = [];
  for (const envelope of script) {
    const result = execute(freeze(state), freeze(structuredClone(envelope)));
    results.push(result); state = result.state;
  }
  return { state, results };
}
/** Construct trusted scripts locally. Replays initialize independently and use
 * the same complete envelopes, including intentionally rejected/stale inputs. */
export function runScenarios() {
  const reports = [];
  for (const scenarioId of ['turn-boundaries/v1', 'quotas/v1', 'second-double/v1', 'third-double/v1',
    'third-double-prisoner-next/v1', 'pending-settlement/v1', 'prisoner-next/v1',
    'purchase/v1', 'rent/v1', 'chance/v1', 'crossing/v1']) {
    let state = create(scenarioId);
    const script: Envelope[] = [];
    function command(kind: Command['kind'], nowMs: number, dice: readonly number[] = []): Envelope {
      return { commandVersion: 1, commandId: `script-${script.length}`, expectedRevision: state.revision,
        actor: kind === 'Roll' || kind === 'EndTurn' ? { kind: 'player', id: state.turn?.participantId ?? 'A' } : { kind: 'system' },
        command: kind === 'SetupRound' || kind === 'BeginTurns' ? { kind } : { kind, targetTurnId: state.turn!.turnId },
        context: { nowMs, dice } };
    }
    function send(e: Envelope) {
      script.push(e); const r = execute(state, e); state = r.state; return r;
    }
    send(command('SetupRound', 0, [6, 1])); send(command('BeginTurns', 100));
    if (scenarioId === 'turn-boundaries/v1') {
      send(command('EndTurn', 101));
      const roll = command('Roll', 102, [2, 3]); send(roll); send(roll);
      const oldTimer = command('Timeout', 45100);
      send(command('EndTurn', 45099)); send(oldTimer);
      send(command('Roll', 45100, [1, 2]));
      const lateEnd = command('EndTurn', state.turn!.deadlineMs);
      const timer = command('Timeout', state.turn!.deadlineMs);
      send(lateEnd); send(timer); send(lateEnd);
    } else if (scenarioId === 'quotas/v1' || scenarioId === 'second-double/v1') {
      // Forced first/second doubles retain the turn, then earn fresh bonus turns.
      for (let i = 0; i < (scenarioId === 'quotas/v1' ? 2 : 1); i++) {
        const forced = command('Timeout', state.turn!.deadlineMs, [2, 2]); send(forced); send(forced);
        send(command('EndTurn', state.lastNowMs + 1));
      }
      send(command('Roll', state.lastNowMs + 1, [1, 2])); send(command('EndTurn', state.lastNowMs + 1));
      send(command('Timeout', state.turn!.deadlineMs + 1000, [2, 3]));
      send(command('Timeout', state.turn!.deadlineMs));
    } else if (scenarioId.startsWith('third-double')) {
      send(command('Timeout', state.turn!.deadlineMs, [4, 4]));
    } else if (scenarioId === 'pending-settlement/v1') {
      send(command('EndTurn', 101)); send(command('Timeout', 45100));
    } else {
      send(command('Roll', 101, [2, 3]));
      send(command('EndTurn', 102)); send(command('Timeout', 45100, scenarioId === 'prisoner-next/v1' ? [] : [2, 3]));
    }
    const one = replay(scenarioId, script), two = replay(scenarioId, script);
    assert.deepEqual(one, two); assert.deepEqual(one.state, state);
    const boundaries = one.results.filter(r => r.kind === 'rejected' && r.error === 'UNSUPPORTED_BOUNDARY').length;
    reports.push({ scenarioId, inputs: script.length, revision: one.state.revision, boundaries });
  }
  return reports;
}
