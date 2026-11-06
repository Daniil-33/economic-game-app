export const RULES_VERSION = 'headless-foundation/v1' as const;
export interface SessionConfig {
  readonly stateVersion: 1;
  readonly rulesVersion: typeof RULES_VERSION;
}
export type Actor = { readonly kind: 'system' } | { readonly kind: 'player'; readonly id: string };
export type Command =
  | { readonly kind: 'SetupRound' }
  | { readonly kind: 'BeginTurns' }
  | { readonly kind: 'Roll' }
  | { readonly kind: 'EndTurn' }
  | { readonly kind: 'Timeout'; readonly targetTurnId: string };
export interface RequestIdentity {
  readonly commandVersion: 1;
  readonly expectedRevision: number;
  readonly actor: Actor;
  readonly command: Command;
}
export interface Envelope extends RequestIdentity {
  readonly commandId: string;
  /** Supplied by the authoritative adapter, never derived from client values. */
  readonly context: { readonly nowMs: number; readonly dice: readonly number[] };
}
export type Setup =
  | { readonly phase: 'pending'; readonly groups: readonly (readonly string[])[] }
  | { readonly phase: 'complete'; readonly groups: readonly (readonly string[])[]; readonly order: readonly string[] };
export type EventPayload =
  | { readonly kind: 'SetupRolled'; readonly rolls: readonly { readonly participantId: string; readonly die: number }[] }
  | { readonly kind: 'SetupTiePending'; readonly participants: readonly string[] }
  | { readonly kind: 'SetupOrderEstablished'; readonly order: readonly string[] };
export type GameEvent = EventPayload & { readonly eventVersion: 1; readonly revision: number; readonly ordinal: number };
export interface Receipt {
  readonly identity: RequestIdentity;
  readonly acceptedRevision: number;
  readonly events: readonly GameEvent[];
  readonly consumedDice: number;
}
export interface GameState extends SessionConfig {
  readonly revision: number;
  readonly lastNowMs: number;
  readonly participants: readonly string[];
  readonly setup: Setup;
  readonly receipts: Readonly<Record<string, Receipt>>;
}
export type ErrorCode = 'INVALID_CONFIG' | 'INVALID_PARTICIPANTS' | 'UNSUPPORTED_VERSION'
  | 'INVALID_ENVELOPE' | 'INVALID_DICE' | 'ID_CONFLICT' | 'STALE_REVISION'
  | 'TIME_REGRESSION' | 'UNAUTHORIZED' | 'INVALID_PHASE' | 'UNSUPPORTED_BOUNDARY'
  | 'DICE_COUNT' | 'REVISION_EXHAUSTED';
export type CreationResult = { readonly kind: 'created'; readonly state: GameState }
  | { readonly kind: 'rejected'; readonly error: ErrorCode };
export type EngineResult =
  | { readonly kind: 'success'; readonly state: GameState; readonly events: readonly GameEvent[]; readonly consumedDice: number }
  | { readonly kind: 'rejected'; readonly state: GameState; readonly events: readonly []; readonly consumedDice: 0; readonly error: ErrorCode }
  | { readonly kind: 'duplicate'; readonly state: GameState; readonly events: readonly []; readonly consumedDice: 0; readonly receipt: Receipt };
