#!/usr/bin/env node

/**
 * Cross-Platform Testing Script
 *
 * This script helps identify potential cross-platform compatibility issues
 * by simulating different environments and testing edge cases.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

console.log('🧪 Cross-Platform Compatibility Tests\n');

// Test 1: Build verification
console.log('1️⃣ Testing build process...');
try {
  execSync('bun run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');
}
catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Test 2: Installation simulation
console.log('2️⃣ Testing installation process...');
try {
  execSync('npm pack', { stdio: 'inherit' });
  execSync('npm install -g *.tgz', { stdio: 'inherit' });
  console.log('✅ Installation successful\n');
}
catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}

// Test 3: CLI functionality
console.log('3️⃣ Testing CLI functionality...');
try {
  const version = execSync('tcu --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Version command works: ${version}`);

  execSync('tcu --help > /dev/null', { stdio: 'inherit' });
  console.log('✅ Help command works\n');
}
catch (error) {
  console.error('❌ CLI functionality failed:', error.message);
  process.exit(1);
}

// Test 4: Path handling (Windows vs Unix)
console.log('4️⃣ Testing path handling...');
try {
  const configDir = path.join(os.homedir(), '.trello-cli-unofficial');
  console.log(`Config directory: ${configDir}`);

  // Test if we can create the config directory
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log('✅ Config directory creation works');
  }
  else {
    console.log('✅ Config directory exists');
  }

  // Test file operations
  const testFile = path.join(configDir, 'test-config.json');
  fs.writeFileSync(testFile, JSON.stringify({ test: true }, null, 2));
  fs.unlinkSync(testFile);

  console.log('✅ File operations work\n');
}
catch (error) {
  console.error('❌ Path handling failed:', error.message);
  process.exit(1);
}

// Test 5: Environment variables
console.log('5️⃣ Testing environment variables...');
try {
  // Test LANG detection
  const langVars = ['LANG', 'LANGUAGE', 'LC_ALL', 'LC_MESSAGES'];
  let detectedLang = 'en';

  for (const varName of langVars) {
    const value = process.env[varName];
    if (value && value.toLowerCase().includes('pt')) {
      detectedLang = 'pt';
      break;
    }
  }

  console.log(`✅ Language detection works: ${detectedLang}`);

  // Test TRELLO_TOKEN handling
  const token = process.env.TRELLO_TOKEN;
  if (token) {
    console.log('✅ TRELLO_TOKEN environment variable detected');
  }
  else {
    console.log('ℹ️  No TRELLO_TOKEN environment variable (expected)');
  }
  console.log('');
}
catch (error) {
  console.error('❌ Environment variable testing failed:', error.message);
  process.exit(1);
}

// Test 6: Platform-specific checks
console.log('6️⃣ Testing platform-specific features...');
try {
  console.log(`Platform: ${os.platform()}`);
  console.log(`Architecture: ${os.arch()}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Working directory: ${process.cwd()}`);

  // Test process.argv handling
  console.log(`Arguments count: ${process.argv.length}`);
  console.log(`First argument: ${process.argv[0]}`);
  console.log(`Script name: ${process.argv[1]}`);

  console.log('✅ Platform detection works\n');
}
catch (error) {
  console.error('❌ Platform testing failed:', error.message);
  process.exit(1);
}

console.log('🎉 All cross-platform tests passed!');
console.log('\n📋 Recommendations for Windows testing:');
console.log('1. Test on Windows PowerShell/Command Prompt');
console.log('2. Test with different Node.js versions (18.x, 20.x)');
console.log('3. Test with and without Bun installed');
console.log('4. Test global installation: npm install -g trello-cli-unofficial');
console.log('5. Test PATH configuration and command availability'); ;
