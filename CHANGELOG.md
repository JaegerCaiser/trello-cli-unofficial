## [0.9.4](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.9.3...v0.9.4) (2025-11-14)


### Bug Fixes

* create CLI wrapper to ensure Bun execution ([87deabf](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/87deabf6c8be566a764bb52d057bebb49090f88f))

## [0.9.3](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.9.2...v0.9.3) (2025-11-14)


### Bug Fixes

* make check-dependencies script Windows-compatible ([358fb98](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/358fb9816045aef97631a257ab7a8d1dcfa4aea8))

## [0.9.2](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.9.1...v0.9.2) (2025-11-14)


### Bug Fixes

* add automatic Bun dependency check during installation ([362f68b](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/362f68bb26d330617da2bd7194e7ed0ee273d312))
* add eslint --fix to lint-staged ([17c0d98](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/17c0d9856d044b7a83606951e0a5a995f2b6b619))
* add NPM_TOKEN to semantic-release workflow ([9c93a67](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/9c93a678a0c46ea8a6697e05b3b38d38e756e140))

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
