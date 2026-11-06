import { RULES_VERSION, type Actor, type Command, type Envelope, type ErrorCode } from './types.js';
export function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function identifier(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 128;
}
export function natural(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
export function versions(value: Record<string, unknown>): boolean {
  return value.stateVersion === 1 && value.rulesVersion === RULES_VERSION;
}
function actor(value: unknown): value is Actor {
  return record(value) && (value.kind === 'system' || (value.kind === 'player' && identifier(value.id)));
}
function command(value: unknown): value is Command {
  return record(value) && (['SetupRound', 'BeginTurns'].includes(value.kind as string)
    || (['Roll', 'EndTurn', 'Timeout'].includes(value.kind as string) && identifier(value.targetTurnId)));
}
export function validateEnvelope(value: unknown): ErrorCode | null {
  if (!record(value)) return 'INVALID_ENVELOPE';
  if (value.commandVersion !== 1) return 'UNSUPPORTED_VERSION';
  if (!identifier(value.commandId) || !natural(value.expectedRevision) || !actor(value.actor)
    || !command(value.command) || !record(value.context) || !natural(value.context.nowMs)
    || !Array.isArray(value.context.dice)) return 'INVALID_ENVELOPE';
  // Array iteration must include holes: sparse dice are not supplied d6 values.
  for (const die of value.context.dice) {
    if (typeof die !== 'number' || !Number.isInteger(die) || die < 1 || die > 6) return 'INVALID_DICE';
  }
  return null;
}
export function canonical(value: Envelope) {
  const actor: Actor = value.actor.kind === 'system' ? { kind: 'system' } : { kind: 'player', id: value.actor.id };
  const command: Command = value.command.kind === 'Roll' || value.command.kind === 'EndTurn' || value.command.kind === 'Timeout'
    ? { kind: value.command.kind, targetTurnId: value.command.targetTurnId } : { kind: value.command.kind };
  return { commandVersion: value.commandVersion, expectedRevision: value.expectedRevision, actor, command };
}
