#!/usr/bin/env node

/* eslint-disable node/prefer-global/process */
/* eslint-disable unused-imports/no-unused-vars */

import { execSync } from 'node:child_process';
import os from 'node:os';

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

// Messages in both languages
const messages = {
  pt: {
    checking: '🔍 Verificando dependências do Trello CLI Unofficial...',
    bunFound: '✅ Bun encontrado:',
    bunNotFound: '❌ Bun NÃO encontrado!',
    bunRequired: '📦 O Trello CLI Unofficial requer Bun para funcionar corretamente.',
    bunBenefit: '   Bun oferece performance 10-50x superior ao Node.js para este projeto.',
    installPrompt: '🔧 Deseja instalar o Bun agora? (Y/n): ',
    installing: '🚀 Instalando Bun...',
    installSuccess: '✅ Bun instalado com sucesso!',
    version: '   Versão:',
    installFailed: '❌ Falha ao instalar Bun. Verifique sua conexão e tente novamente.',
    cancelled: '❌ Instalação cancelada.',
    manualInstall: '💡 Para instalar manualmente:',
    manualCommand: os.platform() === 'win32'
      ? '   powershell -c "irm bun.sh/install.ps1 | iex"'
      : '   curl -fsSL https://bun.sh/install | bash',
    retry: '🔄 Depois execute: npm install -g trello-cli-unofficial',
    success: '🎉 Todas as dependências verificadas com sucesso!',
  },
  en: {
    checking: '🔍 Checking Trello CLI Unofficial dependencies...',
    bunFound: '✅ Bun found:',
    bunNotFound: '❌ Bun NOT found!',
    bunRequired: '📦 Trello CLI Unofficial requires Bun to work correctly.',
    bunBenefit: '   Bun offers 10-50x better performance than Node.js for this project.',
    installPrompt: '🔧 Do you want to install Bun now? (Y/n): ',
    installing: '🚀 Installing Bun...',
    installSuccess: '✅ Bun installed successfully!',
    version: '   Version:',
    installFailed: '❌ Failed to install Bun. Check your connection and try again.',
    cancelled: '❌ Installation cancelled.',
    manualInstall: '💡 To install manually:',
    manualCommand: os.platform() === 'win32'
      ? '   powershell -c "irm bun.sh/install.ps1 | iex"'
      : '   curl -fsSL https://bun.sh/install | bash',
    retry: '🔄 Then run: npm install -g trello-cli-unofficial',
    success: '🎉 All dependencies checked successfully!',
  },
};

const msg = messages[lang];

console.log(msg.checking);
console.log('');

// Check if Bun is installed
function isBunInstalled() {
  try {
    const result = execSync('bun --version', { stdio: 'pipe' });
    return result.toString().trim();
  }
  catch (error) {
    return false;
  }
}

const bunVersion = isBunInstalled();

if (bunVersion) {
  console.log(`${msg.bunFound} ${bunVersion}`);
}
else {
  console.log(msg.bunNotFound);
  console.log('');
  console.log(msg.bunRequired);
  console.log(msg.bunBenefit);
  console.log('');

  // Read user input
  process.stdout.write(msg.installPrompt);

  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.once('data', (key) => {
    process.stdin.setRawMode(false);
    process.stdin.pause();

    const answer = key.toString().toLowerCase();
    console.log(''); // New line after input

    if (answer === 'y' || answer === '\r' || answer === '\n') {
      console.log(msg.installing);

      try {
        // Install Bun based on platform
        const platform = os.platform();
        let installCommand;

        if (platform === 'win32') {
          // Windows - use PowerShell
          installCommand = 'powershell -c "irm bun.sh/install.ps1 | iex"';
        }
        else {
          // Unix-like systems
          installCommand = 'curl -fsSL https://bun.sh/install | bash';
        }

        execSync(installCommand, { stdio: 'inherit' });

        // Check if installation was successful
        const newBunVersion = isBunInstalled();
        if (newBunVersion) {
          console.log(msg.installSuccess);
          console.log(`${msg.version} ${newBunVersion}`);
        }
        else {
          console.log(msg.installFailed);
          process.exit(1);
        }
      }
      catch (error) {
        console.log(msg.installFailed);
        process.exit(1);
      }
    }
    else {
      console.log(msg.cancelled);
      console.log('');
      console.log(msg.manualInstall);
      console.log(msg.manualCommand);
      console.log('');
      console.log(msg.retry);
      process.exit(1);
    }
  });
}

console.log('');
console.log(msg.success);
