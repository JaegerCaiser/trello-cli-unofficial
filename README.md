# Trello CLI Unofficial

[![npm version](https://img.shields.io/npm/v/trello-cli-unofficial.svg)](https://www.npmjs.com/package/trello-cli-unofficial)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-57%20passing-brightgreen.svg)](./tests)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/JaegerCaiser/trello-cli-unofficial/ci.yml?branch=main&label=CI)](https://github.com/JaegerCaiser/trello-cli-unofficial/actions)
[![Release](https://img.shields.io/github/actions/workflow/status/JaegerCaiser/trello-cli-unofficial/release.yml?branch=main&label=Release)](https://github.com/JaegerCaiser/trello-cli-unofficial/actions)

An unofficial Trello CLI using Power-Up authentication, built with Bun for maximum performance. Features automated CI/CD with semantic versioning and NPM publishing.

## 🚀 Features

- ⚡ **Ultra-fast**: Built with Bun (10-50x faster than Node.js)
- 🔐 **Power-Up Authentication**: Compatible with Trello's newer authentication system
- 💾 **Persistent Configuration**: Automatically saves your token
- 🎯 **Interactive Interface**: Intuitive menu with interactive prompts
- 📋 **Complete Management**: Boards, lists, cards
- ✏️ **CRUD Operations**: Create, read, update, and delete cards
- 📦 **Move Cards**: Between lists in the same board
- 🛠️ **Traditional CLI**: Also works as a command-line tool
- 🌍 **Internationalization**: Support for Portuguese (pt-BR) and English (en) with auto-detection
- 🤖 **Automated CI/CD**: Semantic versioning and NPM publishing on every release
- � **Quality Gates**: 95% test coverage threshold enforced in CI/CD
- �🔒 **Secure Publishing**: NPM provenance with GitHub Actions OIDC

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh/) or Node.js installed
- Trello account with Power-Up enabled

### NPM Installation (Recommended)

```bash
# Install globally via NPM
npm install -g trello-cli-unofficial

# Or using Bun
bun add -g trello-cli-unofficial

# Verify installation
tcu --version
```

### Manual Installation (Development)

```bash
# Clone the repository
git clone https://github.com/JaegerCaiser/trello-cli-unofficial.git
cd trello-cli-unofficial

# Install dependencies
bun install

# Install globally (optional)
bun link
```

## 🔧 Configuration

### First Run Setup

On first run, the CLI will guide you through setup:

```bash
# Run the CLI
tcu

# Or if running from source
bun run main.ts
```

The CLI will ask for your Trello token. To get it:

1. Go to [https://trello.com/power-ups/admin](https://trello.com/power-ups/admin)
2. Create a new Power-Up or use an existing one
3. Copy the "API Key" and generate a token
4. Paste the token when prompted (starts with `ATTA...`)

### Manual Configuration

```bash
# Configure token interactively
tcu setup

# View current configuration
tcu config
```

### Configuration File

The token is automatically saved in `~/.trello-cli-unofficial/config.json`:

```json
{
  "apiKey": "630a01228b85df706aa520f3611e6490",
  "token": "ATTA..."
}
```

### Environment Variables

You can configure the CLI using environment variables instead of the configuration file:

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env
```

Available environment variables:

- `TRELLO_API_KEY`: Your Trello API key (optional, defaults to built-in key)
- `TRELLO_TOKEN`: Your Trello token (optional, will be prompted if not set)

Example `.env` file:

```bash
# Trello CLI Unofficial - Environment Variables
TRELLO_TOKEN=ATTA...
TRELLO_API_KEY=your-custom-api-key
```

**Security Note**: Never commit your `.env` file to version control. The `.env.example` file contains safe defaults.

## Internationalization (i18n)

The CLI automatically detects your system language and displays messages in the appropriate language.

### Supported Languages

- 🇧🇷 **Portuguese (pt-BR)** - Default for Portuguese-speaking systems
- 🇺🇸 **English (en)** - Default for other systems

### Language Detection

The language is automatically detected from your system's `LANG` environment variable:

```bash
# Force Portuguese
LANG=pt_BR.UTF-8 tcu

# Force English
LANG=en_US.UTF-8 tcu
```

### Manual Language Switching

```typescript
import { changeLanguage } from "trello-cli-unofficial";

// Switch to Portuguese
changeLanguage("pt-BR");

// Switch to English
changeLanguage("en");
```

## �🎮 Usage

### Interactive Mode (Recommended)

```bash
# Start interactive mode
tcu

# Or the full command name
trello-cli-unofficial
```

Main menu options:

- 📋 View my boards
- 📝 Explore board
- ➕ Create card
- ⚙️ Settings
- 🚪 Exit

### Direct Commands

```bash
# View all boards
tcu boards

# Start interactive mode
tcu interactive

# Configure token
tcu setup

# Show version
tcu --version
```

## 📚 Usage Examples

### Create a Card

```bash
# Interactive mode
tcu
# Select "➕ Create card"
# Choose board → list → enter name and description
```

### Explore a Board

```bash
# Interactive mode
tcu
# Select "📝 Explore board"
# Choose board → list → see cards
# Optionally: edit, delete, or move cards
```

### Manage Cards

- **Edit**: Change name and description
- **Delete**: Confirm before removing
- **Move**: Select destination list

## 🤖 CI/CD & Automation

This project uses automated CI/CD with semantic versioning based on **commit messages**:

### Version Bumping

- `feat:` commits → **Minor version bump** (0.5.0 → 0.6.0)
- `fix:` commits → **Patch version bump** (0.5.0 → 0.5.1)
- `BREAKING CHANGE:` in commit body → **Major version bump** (0.5.0 → 1.0.0)
- Other commits (docs, test, chore) → **No release**

### Automated Publishing

Every push to `main` branch triggers:

1. **CI Pipeline**: Linting, type checking, tests, coverage, and build
2. **Release Pipeline**: Automatic version bump based on commit message
3. **NPM Publishing**: Package published with provenance and signed builds
4. **GitHub Release**: Automatic release notes and changelog

### Conventional Commits

```bash
# Feature commit (minor version bump)
git commit -m "feat: add new card templates"

# Bug fix (patch version bump)
git commit -m "fix: handle network timeouts gracefully"

# Breaking change (major version bump) - Method 1
git commit -m "feat!: redesign authentication flow"

# Breaking change (major version bump) - Method 2
git commit -m "feat: redesign authentication flow

BREAKING CHANGE: token format changed from legacy API to Power-Up"

# Non-releasing commits
git commit -m "docs: update installation guide"
git commit -m "test: add integration tests"
git commit -m "chore: update dependencies"
```

**Important:** Version bumps are **automatic** and based on the **commit message when merged to main**, not PR titles or descriptions.

## 🛠️ Development

### Project Structure

```
trello-cli-unofficial/
├── src/
│   ├── domain/           # Business logic & entities
│   ├── application/      # Use cases & orchestration
│   ├── infrastructure/   # External implementations
│   └── presentation/     # CLI controllers & UI
├── tests/                # Test suite (57 tests)
├── .github/workflows/    # CI/CD pipelines
├── main.ts              # Entry point
├── package.json         # Dependencies & scripts
└── README.md           # This documentation
```

### Dependencies

- `commander`: CLI framework
- `inquirer`: Interactive prompts
- `fs-extra`: File operations
- `dotenv`: Environment variables

### Available Scripts

```bash
# Run locally
bun run main.ts

# Development with watch mode
bun run --watch main.ts

# Build for production
bun run build

# Run tests
bun test

# Run tests with coverage
bun test:coverage

# Validation (lint + typecheck + test)
bun run validate

# Type checking only
bun run typecheck

# Linting only
bun run lint
```

## 🔒 Security

- Token saved locally in protected file (`~/.trello-cli-unofficial/config.json`)
- No data sent to external servers
- Uses HTTPS for all Trello API communications
- Compatible with Trello's Power-Up authentication
- NPM packages published with provenance attestation

## 🐛 Troubleshooting

### 401 Unauthorized Error

- Verify the token is correct and starts with `ATTA`
- Confirm the Power-Up has necessary permissions
- Try generating a new token from [trello.com/power-ups/admin](https://trello.com/power-ups/admin)

### Network Error

- Check your internet connection
- Confirm `api.trello.com` is accessible
- Try again in a few minutes

### Configuration Not Saving

- Check write permissions in `~/.trello-cli-unofficial/`
- Run as user with appropriate permissions
- Try running `tcu setup` again

### Installation Issues

- Ensure Bun or Node.js is installed
- Try `npm install -g trello-cli-unofficial` if Bun fails
- Check that `tcu` command is in your PATH

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add some amazing feature'`)
4. Run the tests (`bun run validate`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Development Setup

```bash
# Clone and setup
git clone https://github.com/JaegerCaiser/trello-cli-unofficial.git
cd trello-cli-unofficial
bun install

# Run tests
bun test

# Start development
bun run --watch main.ts
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Trello API](https://developer.atlassian.com/cloud/trello/) - Official Trello REST API
- [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive command-line interface
- [Commander](https://github.com/tj/commander.js) - CLI framework for Node.js
- [GitHub Actions](https://github.com/features/actions) - CI/CD automation

## 📊 Project Status

- 🚀 57 tests passing
- 📦 Clean Domain-Driven Design architecture
- 🎨 ESLint + TypeScript strict mode
- ⚡ Performance optimized with Bun
- 🤖 Automated CI/CD with semantic versioning
- 🔒 Secure publishing with NPM provenance

---

**Note**: This is an unofficial project and is not affiliated with Atlassian or Trello.

---

**Made with ❤️, Bun, and automated CI/CD**
