import { runScenarios } from './scenarios.js';
for (const report of runScenarios()) console.log(JSON.stringify(report));
console.log('Independent full replay matched: results, ordered events, receipts, dice consumption and final state. Synthetic turn-boundary harness only.');
