# Exact money arithmetic

Status: accepted bounded requirements. Source: docs/product.md Money quantum
clarification at 569a577 and docs/efforts/base-gameplay/reconciliation.md.

## ADDED Requirements

### Requirement: Exact final quantization

The pure helper SHALL quantize nonnegative rational amounts to multiples of ten
with floor, once, using exact bigint intermediates. Negative numerators and
nonpositive denominators SHALL reject. Zero output SHALL be valid arithmetic.

#### Scenario: Independent boundary oracle

0, 9, 10, 1254, 1255, 1259, 1260 yield 0,0,10,1250,1250,1250,1260.
Test fractions below/at/above ten and values beyond safe Number range.
Prove output <= input < output+10, divisibility by ten and idempotence.
Do not round an intermediate percentage before applying a multiplier.

### Requirement: Canonical codec

The codec SHALL preserve exact nonnegative integers as canonical decimal strings
and reject signs, whitespace, exponent notation, fractional notation and leading
zeros other than zero itself. It SHALL NOT rescale, round or impose domain price
minimums. Resource limits, if necessary, SHALL be documented technical limits.

#### Scenario: Round trip

Zero, nonmultiple-of-ten inputs and large integers round trip exactly. Invalid
inputs reject without hidden time, randomness, I/O or mutation. Legacy core
behavior and replay SHALL remain unchanged. Domain input validation is separate.

### Public API and errors

The package exports `quantizeMoney(numerator: bigint, denominator: bigint): bigint`,
`parseMoney(input: unknown): bigint`, and `formatMoney(amount: bigint): string`.
Quantization and formatting reject non-bigint runtime arguments with TypeError;
quantization validates both operand types before ranges. Negative numerator or
formatted amount, and zero/negative denominator, cause RangeError. Parsing rejects
non-string input or noncanonical ASCII decimal syntax with TypeError, including
all trailing line terminators. Codec input need not be a multiple of ten.
Error message text is not a stable API contract.

No finite economic maximum or artificial digit cap is imposed. Arithmetic,
parsing, and formatting are subject to the host's native bigint, string and memory
capacity; sufficiently large inputs can exhaust resources or cause native errors.
This utility is not an untrusted-request admission boundary. Production resource
limits and domain price validity require a separately accepted integration policy.
