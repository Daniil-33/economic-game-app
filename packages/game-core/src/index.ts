export * from './types.js';
import { RULES_VERSION, type CreationResult, type EngineResult, type Envelope, type ErrorCode, type GameEvent, type GameState, type RequestIdentity } from './types.js';
import { canonical, identifier, record, validateEnvelope, versions } from './validation.js';
import { fixture } from './fixtures.js';
import { transition, type Transition } from './turns.js';
import { rankRound } from './setup.js';

export function createSession(config: unknown, participants: unknown): CreationResult {
  if (!record(config)) return { kind: 'rejected', error: 'INVALID_CONFIG' };
  if (!versions(config)) return { kind: 'rejected', error: 'UNSUPPORTED_VERSION' };
  if (!Array.isArray(participants) || participants.length < 2 || participants.length > 6
    || !Array.from(participants).every(identifier) || new Set(participants).size !== participants.length) {
    return { kind: 'rejected', error: 'INVALID_PARTICIPANTS' };
  }
  const scenarioId = config.scenarioId === undefined ? 'turn-boundaries/v1' : config.scenarioId;
  if (typeof scenarioId !== 'string' || !fixture(scenarioId)) return { kind: 'rejected', error: 'INVALID_CONFIG' };
  return { kind: 'created', state: {
    scenarioId, statuses: Object.fromEntries(participants.map(id => [id, { custody: 'free', doublesStreak: 0 }])),
    scenarioProgress: Object.fromEntries(participants.map(id => [id, 0])),
    stateVersion: 1, rulesVersion: RULES_VERSION, revision: 0, lastNowMs: 0,
    participants: [...participants], setup: { phase: 'pending', groups: [[...participants]] }, receipts: {},
  } };
}
function sameIdentity(a: RequestIdentity, b: RequestIdentity): boolean {
  return a.commandVersion === b.commandVersion && a.expectedRevision === b.expectedRevision
    && a.actor.kind === b.actor.kind && (a.actor.kind !== 'player' || (b.actor.kind === 'player' && a.actor.id === b.actor.id))
    && a.command.kind === b.command.kind && (!('targetTurnId' in a.command) || ('targetTurnId' in b.command && a.command.targetTurnId === b.command.targetTurnId));
}
/** State is a core-created session; envelope is a runtime validation boundary. */
export function execute(state: GameState, input: unknown): EngineResult {
  const reject = (error: ErrorCode): EngineResult => ({ kind: 'rejected', state, events: [], consumedDice: 0, error });
  if (!versions(state as unknown as Record<string, unknown>)) return reject('UNSUPPORTED_VERSION');
  const invalid = validateEnvelope(input);
  if (invalid) return reject(invalid);
  const envelope = input as Envelope;
  const identity = canonical(envelope);
  if (Object.hasOwn(state.receipts, envelope.commandId)) {
    const receipt = state.receipts[envelope.commandId]!;
    return sameIdentity(receipt.identity, identity)
      ? { kind: 'duplicate', state, events: [], consumedDice: 0, receipt }
      : reject('ID_CONFLICT');
  }
  if (envelope.expectedRevision !== state.revision) return reject('STALE_REVISION');
  if (envelope.context.nowMs < state.lastNowMs) return reject('TIME_REGRESSION');
  let candidate: Transition;
  if (envelope.command.kind === 'SetupRound') {
    if (envelope.actor.kind !== 'system') return reject('UNAUTHORIZED');
    if (state.setup.phase !== 'pending') return reject('INVALID_PHASE');
    const group = state.setup.groups.find(group => group.length > 1)!;
    if (envelope.context.dice.length !== group.length) return reject('DICE_COUNT');
    const ranked = rankRound(state.setup, envelope.context.dice);
    candidate = { state: { ...state, setup: ranked.setup }, payloads: ranked.payloads, consumedDice: group.length };
  } else candidate = transition(state, envelope);
  if ('error' in candidate) return reject(candidate.error);
  if (state.revision === Number.MAX_SAFE_INTEGER) return reject('REVISION_EXHAUSTED');
  const revision = state.revision + 1;
  const events: readonly GameEvent[] = candidate.payloads.map((payload, ordinal) => ({ ...payload, eventVersion: 1, revision, ordinal }));
  const consumedDice = candidate.consumedDice;
  const receipt = { identity, acceptedRevision: revision, events, consumedDice };
  // Computed property creates an own data property even for __proto__.
  const next: GameState = { ...candidate.state, revision, lastNowMs: envelope.context.nowMs,
    receipts: { ...state.receipts, [envelope.commandId]: receipt } };
  return { kind: 'success', state: next, events, consumedDice };
}
