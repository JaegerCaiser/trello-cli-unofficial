#!/usr/bin/env bun

import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

// Read LCOV coverage data
const lcovContent = readFileSync('./coverage/lcov.info', 'utf-8');

// Parse LCOV format to extract totals
const lines = lcovContent.split('\n');
const totals = { lines: 0, functions: 0, branches: 0, statements: 0 };

for (const line of lines) {
  if (line.startsWith('LF:')) {
    // Lines found
    const totalLines = Number.parseInt(line.split(':')[1]);
    const nextLine = lines[lines.indexOf(line) + 1];
    if (nextLine && nextLine.startsWith('LH:')) {
      const hitLines = Number.parseInt(nextLine.split(':')[1]);
      totals.lines = Math.round((hitLines / totalLines) * 100);
    }
  }
  else if (line.startsWith('FNF:')) {
    // Functions found
    const totalFunctions = Number.parseInt(line.split(':')[1]);
    const nextLine = lines[lines.indexOf(line) + 1];
    if (nextLine && nextLine.startsWith('FNH:')) {
      const hitFunctions = Number.parseInt(nextLine.split(':')[1]);
      totals.functions = Math.round((hitFunctions / totalFunctions) * 100);
    }
  }
}

// For statements, we'll use lines as approximation since LCOV doesn't have separate statement count
totals.statements = totals.lines;

// Check if all metrics meet the 95% threshold
const thresholds = {
  lines: 95,
  functions: 95,
  statements: 95,
};

let allPassed = true;
const results = [];

for (const [metric, threshold] of Object.entries(thresholds)) {
  const actual = totals[metric] || 0;
  const passed = actual >= threshold;
  results.push(`${metric}: ${actual}% (threshold: ${threshold}%) - ${passed ? '✅' : '❌'}`);

  if (!passed) {
    allPassed = false;
  }
}

console.log('Coverage Threshold Check:');
results.forEach(result => console.log(`  ${result}`));

if (!allPassed) {
  console.log('\n❌ Coverage threshold not met!');
  exit(1);
}
else {
  console.log('\n✅ All coverage thresholds met!');
  exit(0);
}
