import test from 'node:test';
import assert from 'node:assert/strict';
import { quantizeMoney, parseMoney, formatMoney } from '@economic-board-game/game-core';

// Search by multiplication and ordering, independently of the division formula.
function oracle(n: bigint, d: bigint): bigint {
  let low = 0n;
  let high = n + 1n;
  while (high - low > 1n) {
    const mid = (low + high) >> 1n;
    if (10n * mid * d <= n) low = mid;
    else high = mid;
  }
  return 10n * low;
}
function check(n: bigint, d: bigint): void {
  const result = quantizeMoney(n, d);
  assert.equal(result, oracle(n, d));
  assert.equal(result % 10n, 0n);
  assert.ok(result * d <= n);
  assert.ok(n < (result + 10n) * d);
  assert.equal(quantizeMoney(result, 1n), result);
}

test('money named integer and fractional boundaries', () => {
  for (const [n, expected] of [[0n, 0n], [9n, 0n], [10n, 10n], [1254n, 1250n],
    [1255n, 1250n], [1259n, 1250n], [1260n, 1260n]]) {
    assert.equal(quantizeMoney(n!, 1n), expected);
    check(n!, 1n);
  }
  for (const d of [3n, 7n, 1000n]) {
    for (const quantum of [10n, 1260n]) {
      for (const offset of [-1n, 0n, 1n]) check(quantum * d + offset, d);
    }
  }
  // A percentage must remain exact until the final multiplied amount.
  assert.equal(quantizeMoney(199n * 5n * 3n, 100n), 20n);
  assert.equal(quantizeMoney(199n * 5n, 100n) * 3n, 0n);
});

test('money exhaustive small rationals and large exact values', () => {
  for (let n = 0n; n <= 300n; n++) {
    for (let d = 1n; d <= 23n; d++) check(n, d);
  }
  const huge = 10n ** 400n;
  for (const n of [9007199254740993n, huge - 1n, huge, huge + 1n]) {
    for (const d of [1n, 7n, 10n ** 100n + 3n]) check(n, d);
  }
});

test('money rejects runtime types and invalid arithmetic domains', () => {
  for (const bad of [undefined, null, 10, '10', {}, true]) {
    assert.throws(() => quantizeMoney(bad as bigint, 1n), TypeError);
    assert.throws(() => quantizeMoney(0n, bad as bigint), TypeError);
    assert.throws(() => formatMoney(bad as bigint), TypeError);
  }
  for (const [n, d] of [[-1n, 1n], [0n, 0n], [10n, -1n]]) {
    assert.throws(() => quantizeMoney(n!, d!), RangeError);
  }
  assert.throws(() => formatMoney(-1n), RangeError);
});

test('canonical money codec preserves zero, nonquanta and large integers', () => {
  for (const value of [0n, 1n, 9n, 10n, 1255n, 9007199254740993n, 10n ** 400n + 7n]) {
    const encoded = formatMoney(value);
    assert.equal(encoded, value.toString());
    assert.equal(parseMoney(encoded), value);
    assert.equal(formatMoney(parseMoney(encoded)), encoded);
  }
  for (const bad of [undefined, null, 0, 1n, {}, [], true, '', '00', '01', '+1', '-1',
    '-0', ' 1', '1 ', '1\n', '1\r', '1\r\n', '1\u2028', '1\u2029', '1e3', '1.0', '１', '١', '0x10', '1_000']) {
    assert.throws(() => parseMoney(bad), TypeError);
  }
});
