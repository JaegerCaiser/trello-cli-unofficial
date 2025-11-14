#!/usr/bin/env node

import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Detect language from environment
function detectLanguage() {
  const langVars = ['LANG', 'LANGUAGE', 'LC_ALL', 'LC_MESSAGES'];
  for (const varName of langVars) {
    const value = process.env[varName];
    if (value && value.toLowerCase().includes('pt')) {
      return 'pt';
    }
  }
  return 'en';
}

const lang = detectLanguage();

const messages = {
  pt: {
    bunRequired: '❌ Bun é necessário para executar o Trello CLI Unofficial',
    bunNotFound: 'Bun não foi encontrado no sistema',
    installBun: '📦 Instale o Bun primeiro:',
    installCommand: 'curl -fsSL https://bun.sh/install | bash',
    windowsInstall: 'powershell -c "irm bun.sh/install.ps1 | iex"',
    afterInstall: 'Após instalar, reinicie o terminal e execute novamente',
    versionCommand: 'Verifique com: bun --version',
  },
  en: {
    bunRequired: '❌ Bun is required to run Trello CLI Unofficial',
    bunNotFound: 'Bun was not found on the system',
    installBun: '📦 Please install Bun first:',
    installCommand: 'curl -fsSL https://bun.sh/install | bash',
    windowsInstall: 'powershell -c "irm bun.sh/install.ps1 | iex"',
    afterInstall: 'After installation, restart your terminal and run again',
    versionCommand: 'Check with: bun --version',
  },
};

const msg = messages[lang];

// Check if Bun is available (local or global)
function isBunAvailable() {
  try {
    // First try local Bun
    execSync('node_modules/.bin/bun --version', { stdio: 'pipe' });
    return 'local';
  }
  catch {
    try {
      // Then try global Bun
      execSync('bun --version', { stdio: 'pipe' });
      return 'global';
    }
    catch {
      return false;
    }
  }
}

// Main execution
const bunType = isBunAvailable();
if (!bunType) {
  console.log(msg.bunRequired);
  console.log(msg.bunNotFound);
  console.log('');
  console.log(msg.installBun);

  // Detect platform for appropriate install command
  const platform = process.platform;
  if (platform === 'win32') {
    console.log(`Windows: ${msg.windowsInstall}`);
  }
  else {
    console.log(`Unix/Linux/macOS: ${msg.installCommand}`);
  }

  console.log('');
  console.log(msg.afterInstall);
  console.log(msg.versionCommand);
  process.exit(1);
}

// Bun is available, execute the main script
const mainScript = path.join(__dirname, '..', 'dist', 'main.js');
const args = process.argv.slice(2);

// Use local Bun if available, otherwise global
const bunCommand = bunType === 'local'
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'bun')
  : 'bun';

const child = spawn(bunCommand, [mainScript, ...args], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

child.on('exit', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error('Failed to start Bun:', error.message);
  process.exit(1);
});
