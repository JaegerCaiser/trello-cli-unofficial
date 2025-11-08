# Trello CLI Unofficial

[![npm version](https://img.shields.io/npm/v/trello-cli-unofficial.svg)](https://www.npmjs.com/package/trello-cli-unofficial)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-57%20passing-brightgreen.svg)](./tests)

An unofficial Trello CLI using Power-Up authentication, built with Bun for maximum performance.

## 🚀 Features

- ⚡ **Ultra-fast**: Built with Bun (10-50x faster than Node.js)
- 🔐 **Power-Up Authentication**: Compatible with Trello's newer authentication system
- 💾 **Persistent Configuration**: Automatically saves your token
- 🎯 **Interactive Interface**: Intuitive menu with interactive prompts
- 📋 **Complete Management**: Boards, lists, cards
- ✏️ **CRUD Operations**: Create, read, update, and delete cards
- 📦 **Move Cards**: Between lists in the same board
- 🛠️ **Traditional CLI**: Also works as a command-line tool

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh/) installed
- Trello account with Power-Up enabled

### Global Installation (Recommended)

```bash
# Clone the repository
git clone https://github.com/JaegerCaiser/trello-cli-unofficial.git
cd trello-cli-unofficial

# Install dependencies
bun install

# Install globally (optional)
bun link
```

### Local Installation

```bash
# Clone and install
git clone https://github.com/JaegerCaiser/trello-cli-unofficial.git
cd trello-cli-unofficial
bun install
```

## 🔧 Configuration

### First Run

On first run, the CLI will guide you through setup:

```bash
# Run the CLI
bun run main.ts

# Or if installed globally
trello-cli-unofficial
# or use the shortcut:
tcu
```

The CLI will ask for your Trello token. To get it:

1. Go to [https://trello.com/power-ups/admin](https://trello.com/power-ups/admin)
2. Create a new Power-Up or use an existing one
3. Copy the "API Key" and generate a token
4. Paste the token when prompted (starts with `ATTA...`)

### Manual Configuration

```bash
# Configure token
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

## 🎮 Usage

### Interactive Mode (Recommended)

```bash
# With global installation
tcu

# Or directly
bun run main.ts
```

Main menu options:

- 📋 View my boards
- 📝 Explore board
- ➕ Create card
- ⚙️ Settings
- 🚪 Exit

### Direct Commands

```bash
# View boards
tcu boards

# Interactive mode
tcu interactive

# Configure token
tcu setup
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

## 🛠️ Development

### Project Structure

```
trello-cli-unofficial/
├── src/
│   ├── domain/           # Business logic & entities
│   ├── application/      # Use cases
│   ├── infrastructure/   # External implementations
│   └── presentation/     # CLI controllers
├── tests/                # Test suite
├── main.ts              # Entry point
├── package.json         # Dependencies
└── README.md           # This documentation
```

### Dependencies

- `commander`: CLI framework
- `inquirer`: Interactive prompts
- `fs-extra`: File operations
- `dotenv`: Environment variables

### Available Scripts

```bash
# Run
bun run main.ts

# Development
bun run dev

# Build
bun run build

# Tests
bun test

# Validation (lint + typecheck + test)
bun run validate
```

## 🔒 Security

- Token saved locally in protected file
- No data sent to external servers
- Uses HTTPS for all Trello communications
- Compatible with Trello's Power-Up authentication

## 🐛 Troubleshooting

### 401 Unauthorized Error

- Verify the token is correct
- Confirm the Power-Up has necessary permissions
- Try generating a new token

### Network Error

- Check your internet connection
- Confirm api.trello.com is accessible

### Configuration Not Saving

- Check write permissions in `~/.trello-cli-unofficial/`
- Run as user with appropriate permissions

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Run the tests (`bun run validate`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Trello API](https://developer.atlassian.com/cloud/trello/) - Official Trello API
- [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive command-line interface
- [Commander](https://github.com/tj/commander.js) - CLI framework for Node.js

## 📊 Project Status

- ✅ Initial release (v0.1.0)
- 🚀 57 tests passing
- 📦 Clean DDD architecture
- 🎨 ESLint + TypeScript strict
- ⚡ Performance optimized with Bun

---

**Note**: This is an unofficial project and is not affiliated with Atlassian or Trello.

---

**Made with ❤️ and Bun**
