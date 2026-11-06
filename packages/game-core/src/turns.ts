import type { Envelope, ErrorCode, EventPayload, GameState, Turn } from './types.js';
import { fixture } from './fixtures.js';
export type Transition = { readonly error: ErrorCode } | {
  readonly state: GameState; readonly payloads: readonly EventPayload[]; readonly consumedDice: number;
};
export function transition(state: GameState, envelope: Envelope): Transition {
  const { command, actor, context: { nowMs, dice } } = envelope;
  const seed = fixture(state.scenarioId)!;
  const payloads: EventPayload[] = [];
  let next = state;
  const fail = (error: ErrorCode): Transition => ({ error });
  function start(participantId: string, initial: boolean): ErrorCode | null {
    if (next.statuses[participantId]!.custody === 'prison') return 'UNSUPPORTED_BOUNDARY';
    if (!Number.isSafeInteger(nowMs + 45000)) return 'INVALID_ENVELOPE';
    const turn: Turn = { turnId: `turn-${state.revision + 1}`, participantId,
      phase: initial && seed.pending ? 'after-roll' : 'awaiting-roll',
      startedAtMs: nowMs, deadlineMs: nowMs + 45000,
      roll: initial && seed.pending ? [2, 3] : null,
      housesUsed: initial ? seed.housesUsed : 0, offersUsed: initial ? seed.offersUsed : 0,
      settlement: initial && seed.pending ? 'pending/v1' : 'unrolled/v1' };
    next = { ...next, turn };
    payloads.push({ kind: 'TurnStarted', turnId: turn.turnId, participantId,
      deadlineMs: turn.deadlineMs, housesUsed: turn.housesUsed, offersUsed: turn.offersUsed });
    return null;
  }
  if (command.kind === 'BeginTurns') {
    if (actor.kind !== 'system') return fail('UNAUTHORIZED');
    if (state.setup.phase !== 'complete' || state.turn) return fail('INVALID_PHASE');
    if (dice.length) return fail('DICE_COUNT');
    const first = state.setup.order[0]!;
    const second = state.setup.order[1]!;
    next = { ...state, statuses: { ...state.statuses,
      [first]: { custody: 'free', doublesStreak: seed.streak },
      ...(seed.nextPrisoner ? { [second]: { custody: 'prison' as const, doublesStreak: 0 } } : {}) } };
    const error = start(first, true);
    return error ? fail(error) : { state: next, payloads, consumedDice: 0 };
  }
  if (command.kind === 'SetupRound') return fail('INVALID_PHASE');
  const turn = state.turn;
  if (command.kind === 'Timeout' ? actor.kind !== 'system'
    : actor.kind !== 'player' || actor.id !== turn?.participantId) return fail('UNAUTHORIZED');
  if (!turn || state.setup.phase !== 'complete') return fail('INVALID_PHASE');
  if (command.targetTurnId !== turn.turnId) return fail('TURN_MISMATCH');
  if (command.kind === 'Timeout' ? nowMs < turn.deadlineMs : nowMs >= turn.deadlineMs)
    return fail(command.kind === 'Timeout' ? 'DEADLINE_NOT_REACHED' : 'DEADLINE_REACHED');
  if (command.kind === 'Roll' && turn.phase !== 'awaiting-roll') return fail('INVALID_PHASE');
  if (command.kind === 'EndTurn' && turn.phase === 'awaiting-roll') return fail('ROLL_REQUIRED');
  const rolling = command.kind === 'Roll' || turn.phase === 'awaiting-roll';
  if (dice.length !== (rolling ? 2 : 0)) return fail('DICE_COUNT');
  let third = false;
  if (rolling) {
    const double = dice[0] === dice[1];
    const streak = double ? state.statuses[turn.participantId]!.doublesStreak + 1 : 0;
    third = streak === 3;
    next = { ...next, statuses: { ...next.statuses,
      [turn.participantId]: { custody: third ? 'prison' : 'free', doublesStreak: third ? 0 : streak } } };
    payloads.push({ kind: 'DiceRolled', turnId: turn.turnId, participantId: turn.participantId,
      dice: [...dice], forced: command.kind === 'Timeout' });
    if (third) payloads.push({ kind: 'PrisonEntered', participantId: turn.participantId });
    else {
      if (seed.landing !== 'clear/v1') return fail('UNSUPPORTED_BOUNDARY');
      const progress = state.scenarioProgress[turn.participantId]!;
      payloads.push({ kind: 'FixtureMoved', origin: `fixture-${progress}`, landing: `fixture-${progress + 1}` },
        { kind: 'SettlementSatisfied', fixtureId: seed.landing });
      next = { ...next, scenarioProgress: { ...state.scenarioProgress, [turn.participantId]: progress + 1 },
        turn: { ...turn, phase: 'after-roll', roll: [...dice], settlement: seed.landing } };
      if (command.kind === 'Timeout') {
        if (!Number.isSafeInteger(nowMs + 20000)) return fail('INVALID_ENVELOPE');
        next = { ...next, turn: { ...next.turn!, deadlineMs: nowMs + 20000 } };
        payloads.push({ kind: 'TurnContinued', turnId: turn.turnId, deadlineMs: nowMs + 20000,
          housesUsed: turn.housesUsed, offersUsed: turn.offersUsed });
      }
      return { state: next, payloads, consumedDice: 2 };
    }
  }
  if (!third && turn.settlement !== 'clear/v1') return fail('UNSUPPORTED_BOUNDARY');
  payloads.push({ kind: 'TurnCompleted', turnId: turn.turnId, participantId: turn.participantId });
  const order = state.setup.order;
  const participantId = !third && next.statuses[turn.participantId]!.doublesStreak > 0
    ? turn.participantId : order[(order.indexOf(turn.participantId) + 1) % order.length]!;
  const error = start(participantId, false);
  return error ? fail(error) : { state: next, payloads, consumedDice: rolling ? 2 : 0 };
}
