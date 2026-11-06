import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
test('T09: external Node runner independently replays complete scenario traces', () => {
  const output = execFileSync(process.execPath, ['dist/headless-runner/main.js'], { encoding: 'utf8' });
  assert.match(output, /Independent full replay matched/);
  const reports = output.trim().split('\n').slice(0, -1).map(line => JSON.parse(line) as { scenarioId: string; boundaries: number });
  assert.equal(reports.length, 11);
  assert.ok(reports.some(r => r.scenarioId === 'quotas/v1' && r.boundaries === 0));
  assert.ok(reports.some(r => r.scenarioId === 'third-double/v1' && r.boundaries === 0));
  assert.ok(reports.some(r => r.scenarioId === 'third-double-prisoner-next/v1' && r.boundaries > 0));
  for (const id of ['pending-settlement/v1', 'prisoner-next/v1', 'purchase/v1', 'rent/v1', 'chance/v1', 'crossing/v1'])
    assert.ok(reports.some(r => r.scenarioId === id && r.boundaries > 0));
});
