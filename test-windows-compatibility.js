#!/usr/bin/env node

/**
 * Windows Compatibility Test Script
 *
 * Run this script on Windows to test if the CLI initialization issue is fixed.
 * This simulates the exact same conditions that were failing before.
 */

import { execSync } from 'node:child_process';
import os from 'node:os';
import { cwd, exit, version } from 'node:process';

console.warn('🪟 Windows Compatibility Test for Trello CLI');
console.warn(`📋 Platform: ${os.platform()} ${os.arch()}`);
console.warn(`📋 Node.js: ${version}`);
console.warn(`📋 Working Directory: ${cwd()}`);

// Test 1: Basic CLI help command
console.warn('1️⃣ Testing basic CLI help command...');
try {
  const helpOutput = execSync('tcu --help', {
    encoding: 'utf8',
    timeout: 10000,
  });

  if (helpOutput.includes('Unofficial Trello CLI')) {
    console.warn('✅ CLI help command works correctly');
  }
  else {
    console.error('❌ CLI help command returned unexpected output');
    console.error('Output:', helpOutput);
  }
}
catch (error) {
  console.error('❌ CLI help command failed:', error.message);
  console.error('This indicates the Commander.js initialization issue persists');
  exit(1);
}

// Test 2: Version command
console.warn('2️⃣ Testing version command...');
try {
  const versionOutput = execSync('tcu --version', {
    encoding: 'utf8',
    timeout: 5000,
  }).trim();

  console.warn(`✅ Version command works: ${versionOutput}`);
}
catch (error) {
  console.error('❌ Version command failed:', error.message);
}

// Test 3: Try to trigger the original error scenario
console.warn('3️⃣ Testing command setup (original failure point)...');
try {
  // This would have failed with "this.program is undefined" before the fix
  execSync('tcu boards --help', {
    encoding: 'utf8',
    timeout: 5000,
  });
  console.warn('✅ Command setup works correctly');
}
catch (error) {
  console.error('❌ Command setup failed:', error.message);
  console.error('This might indicate the original issue still exists');
}

// Test 4: Test version reading specifically (suspected issue)
console.warn('4️⃣ Testing version reading robustness...');
try {
  const versionOutput = execSync('tcu --version', {
    encoding: 'utf8',
    timeout: 3000,
  }).trim();

  // Extract just the version from the last line (ignore debug logs)
  const lines = versionOutput.split('\n');
  const lastLine = lines[lines.length - 1].trim();

  // Check if version looks valid (should be like "0.11.4")
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (versionRegex.test(lastLine)) {
    console.warn(`✅ Version reading works: ${lastLine}`);
  }
  else {
    console.error(`❌ Version format unexpected: ${lastLine}`);
    console.error('Expected format: x.y.z (e.g., 0.11.4)');
  }
}
catch (error) {
  console.error('❌ Version reading failed:', error.message);
  console.error('This was the suspected issue - dynamic package.json reading on Windows');
}

// Test 5: Check debug logs (new feature)
console.warn('5️⃣ Checking debug logs output...');
try {
  const debugOutput = execSync('tcu --version 2>&1', {
    encoding: 'utf8',
    timeout: 5000,
  });

  const hasDebugLogs = debugOutput.includes('DEBUG:');
  const hasCommandInit = debugOutput.includes('Command instance created');

  if (hasDebugLogs && hasCommandInit) {
    console.warn('✅ Debug logs are working - Commander initialization visible');
  }
  else {
    console.error('❌ Debug logs not found in output');
    console.error('Expected to see DEBUG messages and "Command instance created"');
  }
}
catch (error) {
  console.error('❌ Debug log test failed:', error.message);
}

console.warn('🎉 All tests completed!');
console.warn('If all tests passed, the Windows compatibility issue is likely fixed.');
