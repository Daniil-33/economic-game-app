/** Quantize a final nonnegative rational amount in the quoted scale. */
export function quantizeMoney(numerator: bigint, denominator: bigint): bigint {
  if (typeof numerator !== 'bigint' || typeof denominator !== 'bigint') {
    throw new TypeError('Money operands must be bigint');
  }
  if (numerator < 0n || denominator <= 0n) {
    throw new RangeError('Money requires a nonnegative numerator and positive denominator');
  }
  return 10n * (numerator / (10n * denominator));
}

/** Decode an unsigned canonical decimal integer without quantization. */
export function parseMoney(input: unknown): bigint {
  if (typeof input !== 'string' || !/^(0|[1-9][0-9]*)(?![\s\S])/.test(input)) {
    throw new TypeError('Money must be a canonical unsigned decimal integer');
  }
  return BigInt(input);
}

/** Encode an exact nonnegative integer without quantization. */
export function formatMoney(amount: bigint): string {
  if (typeof amount !== 'bigint') throw new TypeError('Money amount must be bigint');
  if (amount < 0n) throw new RangeError('Money amount must be nonnegative');
  return amount.toString(10);
}
