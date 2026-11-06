import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import ts from 'typescript';

test('K09: core imports stay internal and source has no ambient I/O or random/clock reads', () => {
  const root = resolve('packages/game-core/src');
  const forbidden = new Set(['Date', 'performance', 'process', 'console', 'fetch', 'WebSocket',
    'XMLHttpRequest', 'setTimeout', 'setInterval', 'setImmediate', 'queueMicrotask',
    'crypto', 'require', 'eval', 'Function', 'globalThis']);
  const files = readdirSync(root, { recursive: true }).filter((name): name is string => typeof name === 'string' && name.endsWith('.ts'));
  assert.ok(files.length > 0);
  for (const name of files) {
    const path = resolve(root, name);
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node: ts.Node) {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        const specifier = node.moduleSpecifier;
        if (specifier) {
          assert.ok(ts.isStringLiteral(specifier));
          const module = (specifier as ts.StringLiteral).text;
          assert.ok(module.startsWith('./') || module.startsWith('../'), `${name}: external import ${module}`);
          assert.ok(!relative(root, resolve(dirname(path), module)).startsWith('..'), `${name}: boundary escape`);
        }
      }
      if (ts.isIdentifier(node)) assert.ok(!forbidden.has(node.text), `${name}: forbidden ambient ${node.text}`);
      if (ts.isPropertyAccessExpression(node)) assert.notEqual(node.getText(source), 'Math.random');
      if (ts.isCallExpression(node)) assert.notEqual(node.expression.kind, ts.SyntaxKind.ImportKeyword, `${name}: dynamic import`);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  const config = JSON.parse(readFileSync('packages/game-core/tsconfig.json', 'utf8'));
  assert.deepEqual(config.compilerOptions.types, []);
  assert.deepEqual(config.compilerOptions.lib, ['ES2022']);
  assert.equal(config.compilerOptions.strict, true);
});
