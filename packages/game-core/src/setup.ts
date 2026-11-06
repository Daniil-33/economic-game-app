import type { EventPayload, Setup } from './types.js';
/** Replace only the leftmost tied rank slot; members retain declared order. */
export function rankRound(setup: Setup, dice: readonly number[]): { setup: Setup; payloads: readonly EventPayload[] } {
  const index = setup.groups.findIndex(group => group.length > 1);
  const selected = setup.groups[index]!; // execute validates a pending group and exact dice count.
  const partitions: string[][] = [];
  for (let die = 6; die >= 1; die--) {
    const group = selected.filter((_, i) => dice[i] === die);
    if (group.length) partitions.push(group);
  }
  const groups = [...setup.groups.slice(0, index), ...partitions, ...setup.groups.slice(index + 1)];
  const pending = groups.find(group => group.length > 1);
  const rolled: EventPayload = { kind: 'SetupRolled', rolls: selected.map((participantId, i) => ({ participantId, die: dice[i]! })) };
  if (pending) return { setup: { phase: 'pending', groups }, payloads: [rolled, { kind: 'SetupTiePending', participants: [...pending] }] };
  const order = groups.map(group => group[0]!);
  return { setup: { phase: 'complete', groups, order }, payloads: [rolled, { kind: 'SetupOrderEstablished', order: [...order] }] };
}
