# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Enhanced error handling and user feedback
- Configuration export/import functionality
- Support for additional Trello features (labels, due dates, checklists)
- Integration tests with real Trello API

## [0.1.0] - 2025-11-08

### Added

- 🎉 Initial release of Trello CLI Unofficial
- ⚡ Built with Bun for maximum performance (10-50x faster than Node.js)
- 🏗️ Clean Domain-Driven Design (DDD) architecture
- 🔐 Trello Power-Up authentication system
- 📋 Interactive CLI with inquirer menus
- 🛠️ Direct command support with commander
- ✅ Comprehensive test suite (57 tests, 100% pass rate)
- 🎨 ESLint integration with @antfu/eslint-config
- 📦 Dual command aliases: `trello-cli-unofficial` and `tcu`

### Core Features

- View all Trello boards
- Explore boards and lists
- Create, edit, and delete cards
- Move cards between lists
- Persistent configuration in `~/.trello-cli-unofficial/config.json`

### Developer Experience

- TypeScript with strict mode
- Bun test runner (30ms execution time)
- Hot reload development mode
- CI validation pipeline (lint + typecheck + test)
- Comprehensive documentation for AI agents

[Unreleased]: https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/JaegerCaiser/trello-cli-unofficial/releases/tag/v0.1.0
