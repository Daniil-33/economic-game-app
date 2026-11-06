/** Synthetic, versioned harness data. No board coordinates or financial outcomes.
 * Initial seeds apply only to the first ranked turn; subsequent turns reset quotas.
 * Every participant's scripted landing repeats; progress counts accepted moves.
 */
interface Scenario {
  readonly landing: string;
  readonly housesUsed: number;
  readonly offersUsed: number;
  readonly streak: number;
  readonly pending: boolean;
  readonly nextPrisoner: boolean;
}
const scenario = (landing = 'clear/v1', housesUsed = 0, offersUsed = 0,
  streak = 0, pending = false, nextPrisoner = false): Scenario =>
  Object.freeze({ landing, housesUsed, offersUsed, streak, pending, nextPrisoner });
const registry: Readonly<Record<string, Scenario>> = Object.freeze({
  'turn-boundaries/v1': scenario(),
  'quotas/v1': scenario('clear/v1', 1, 2),
  'pending-settlement/v1': scenario('pending/v1', 1, 2, 0, true),
  'second-double/v1': scenario('clear/v1', 1, 2, 1),
  'third-double/v1': scenario('crossing/v1', 1, 2, 2),
  'third-double-prisoner-next/v1': scenario('crossing/v1', 1, 2, 2, false, true),
  'prisoner-next/v1': scenario('clear/v1', 0, 0, 0, false, true),
  'purchase/v1': scenario('purchase/v1'),
  'rent/v1': scenario('rent/v1'),
  'chance/v1': scenario('chance/v1'),
  'crossing/v1': scenario('crossing/v1'),
});
export function fixture(id: string): Scenario | undefined {
  return Object.hasOwn(registry, id) ? registry[id] : undefined;
}
