#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mainScript = path.join(__dirname, '..', 'dist', 'main.js');

if (!existsSync(mainScript)) {
  const lang = ['LANG', 'LANGUAGE', 'LC_ALL', 'LC_MESSAGES']
    .map(v => process.env[v] || '')
    .some(v => v.toLowerCase().includes('pt'))
    ? 'pt'
    : 'en';

  const messages = {
    pt: [
      '❌ Build não encontrado. O pacote pode ter sido corrompido.',
      '   Tente reinstalar: npm install -g trello-cli-unofficial',
      '   Ou, se for desenvolvedor: bun run build',
    ],
    en: [
      '❌ Build not found. The package may be corrupted.',
      '   Try reinstalling: npm install -g trello-cli-unofficial',
      '   Or, if you are a developer: bun run build',
    ],
  };

  console.error(messages[lang].join('\n'));
  process.exit(1);
}

await import(pathToFileURL(mainScript).href);
