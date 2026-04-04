# Trello CLI Unofficial

[![npm version](https://img.shields.io/npm/v/trello-cli-unofficial.svg)](https://www.npmjs.com/package/trello-cli-unofficial)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-195%20passing-brightgreen.svg)](./tests)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/JaegerCaiser/trello-cli-unofficial/ci.yml?branch=main&label=CI)](https://github.com/JaegerCaiser/trello-cli-unofficial/actions)
[![Release](https://img.shields.io/github/actions/workflow/status/JaegerCaiser/trello-cli-unofficial/release.yml?branch=main&label=Release)](https://github.com/JaegerCaiser/trello-cli-unofficial/actions)

Um CLI não-oficial para Trello com autenticação Power-Up, feito em Bun e TypeScript. Permite gerenciar boards, lists e cards com saídas modernas e suporte a múltiplos perfis.

## Quick Start

```bash
npm install -g trello-cli-unofficial
```

```bash
tcu setup
tcu interactive
```

## Features

- 🚀 Modo interativo com menu guiado
- 📊 Saída em JSON, table e CSV
- 🌍 Suporte a i18n (pt-BR / en)
- 🔐 Autenticação Power-Up para Trello
- 👤 Suporte a múltiplos perfis e configuração persistente

## Commands

```bash
tcu boards

tcu lists

tcu cards

tcu config
```

*Para ver todos os parâmetros e opções, execute `tcu <comando> --help` no seu terminal.*

## 📚 Documentação Completa

- [./docs/commands.md](./docs/commands.md)
- [./docs/architecture.md](./docs/architecture.md)
- [./docs/migration-guide.md](./docs/migration-guide.md)
- [./docs/troubleshooting.md](./docs/troubleshooting.md)

## Contribuição

Quer ajudar a melhorar o projeto? Veja nosso [Guia de Contribuição](CONTRIBUTING.md).
