# Trello CLI Unofficial

*Read this in other languages: [English](#-english) | [Português](#-português)*

[![npm version](https://img.shields.io/npm/v/trello-cli-unofficial.svg)](https://www.npmjs.com/package/trello-cli-unofficial)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-195%20passing-brightgreen.svg)](./tests)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/JaegerCaiser/trello-cli-unofficial/ci.yml?branch=main&label=CI)](https://github.com/JaegerCaiser/trello-cli-unofficial/actions)
[![Release](https://img.shields.io/github/actions/workflow/status/JaegerCaiser/trello-cli-unofficial/release.yml?branch=main&label=Release)](https://github.com/JaegerCaiser/trello-cli-unofficial/actions)

---

## 🇺🇸 English

An unofficial Trello CLI with Power-Up authentication, built with Bun and TypeScript. It allows you to manage boards, lists, and cards with modern outputs and multi-profile support.

### Quick Start

```bash
npm install -g trello-cli-unofficial
```

```bash
tcu setup
tcu interactive
```

### 🔑 Configuring the Trello Token

On the first run, the CLI will ask for your Trello token (via Power-Up authentication). Follow these steps:

**Step 1 — Access the Power-Ups admin dashboard:**
Open in your browser: **https://trello.com/power-ups/admin**
Log in to Trello if necessary.

**Step 2 — Create a new Power-Up:**
Click on **"New"** and fill in any name (e.g., `My CLI`). The name doesn't matter — it's just to identify the app in your account.
> If you have created a Power-Up before, simply select it from the list.

**Step 3 — Generate the token manually:**
Inside your Power-Up's page, you will see a message on the right panel:
> *"Most developers will need to ask each user to authorize their app. If you are building an app for yourself or doing local testing, you can manually generate a **token**."*

Click on the highlighted word **token** in that message. A new page will open asking for confirmation — click **"Allow"**.

**Step 4 — Copy the token:**
The page will display a long sequence of characters starting with `ATTA`. Copy the entire string.

**Step 5 — Paste it into the terminal:**
When the CLI asks `Please enter your Trello token:`, paste the token and press Enter.

> **Tip:** The token must always start with `ATTA`. If the CLI rejects your input, make sure you copied the full token without any extra spaces.

> **Security:** The token is saved locally in `~/.trello-cli-unofficial/config.json`. To revoke access, go to [trello.com/account](https://trello.com/account) → **Power-Ups & Tokens** and revoke the token for this application.

### Features

- 🚀 Interactive mode with a guided menu
- 📊 Output in JSON, table, and CSV formats
- 🌍 i18n support (English / pt-BR)
- 🔐 Power-Up authentication for Trello
- 👤 Multi-profile support with persistent configuration

### Commands

```bash
tcu boards

tcu lists

tcu cards

tcu checklists

tcu config
```

*To see all available parameters and options, run `tcu <command> --help` in your terminal.*

### 📚 Full Documentation

- [./docs/commands.md](./docs/commands.md)
- [./docs/architecture.md](./docs/architecture.md)
- [./docs/migration-guide.md](./docs/migration-guide.md)
- [./docs/troubleshooting.md](./docs/troubleshooting.md)

### Contributing

Want to help improve the project? See our [Contributing Guide](CONTRIBUTING.md).

---

## 🇧🇷 Português

Um CLI não-oficial para Trello com autenticação Power-Up, feito em Bun e TypeScript. Permite gerenciar boards, lists e cards com saídas modernas e suporte a múltiplos perfis.

### Quick Start

```bash
npm install -g trello-cli-unofficial
```

```bash
tcu setup
tcu interactive
```

### 🔑 Configurando o Token do Trello

Na primeira execução o CLI vai pedir seu token do Trello (autenticação via Power-Up). Siga os passos abaixo:

**Passo 1 — Acesse o painel de administração de Power-Ups:**
Abra no navegador: **https://trello.com/power-ups/admin**
Faça login no Trello se necessário.

**Passo 2 — Crie um novo Power-Up:**
Clique em **"New"** e preencha com qualquer nome (ex: `Meu CLI`). O nome não importa — é só para identificar o app na sua conta.
> Se você já criou um Power-Up antes, basta selecioná-lo na lista.

**Passo 3 — Gere o token manualmente:**
Dentro da página do seu Power-Up, você verá no painel à direita a mensagem:
> *"A maioria dos desenvolvedores precisará solicitar a cada usuário que autorize seu aplicativo. Se você deseja criar um aplicativo para si mesmo ou está fazendo testes locais, é possível gerar um **token** manualmente."*

Clique na palavra **token** destacada nessa mensagem. Uma nova página abrirá pedindo confirmação — clique em **"Permitir"**.

**Passo 4 — Copie o token:**
A página exibirá uma longa sequência de caracteres começando com `ATTA`. Copie tudo.

**Passo 5 — Cole no terminal:**
Quando o CLI perguntar `Por favor, insira seu token do Trello:`, cole o token e pressione Enter.

> **Dica:** O token começa obrigatoriamente com `ATTA`. Se o CLI rejeitar sua entrada, verifique se copiou o token completo sem espaços extras.

> **Segurança:** O token fica salvo localmente em `~/.trello-cli-unofficial/config.json`. Para revogar o acesso, acesse [trello.com/account](https://trello.com/account) → **Power-Ups & Tokens** e revogue o token desta aplicação.

### Features

- 🚀 Modo interativo com menu guiado
- 📊 Saída em JSON, table e CSV
- 🌍 Suporte a i18n (pt-BR / en)
- 🔐 Autenticação Power-Up para Trello
- 👤 Suporte a múltiplos perfis e configuração persistente

### Commands

```bash
tcu boards

tcu lists

tcu cards

tcu checklists

tcu config
```

*Para ver todos os parâmetros e opções, execute `tcu <comando> --help` no seu terminal.*

### 📚 Documentação Completa

- [./docs/commands.md](./docs/commands.md)
- [./docs/architecture.md](./docs/architecture.md)
- [./docs/migration-guide.md](./docs/migration-guide.md)
- [./docs/troubleshooting.md](./docs/troubleshooting.md)

### Contribuição

Quer ajudar a melhorar o projeto? Veja nosso [Guia de Contribuição](CONTRIBUTING.md).