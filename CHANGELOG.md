## [0.10.1](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.0...v0.10.1) (2025-11-14)


### Bug Fixes

* revert CommandController run() logic to fix Windows compatibility ([d9abffc](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/d9abffc87461d43aa51b3bd9215b9d7a6e6fce4b))

# [0.10.0](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.9.6...v0.10.0) (2025-11-14)


### Bug Fixes

* configure lint-staged to detect JSON issues without auto-fix ([31cf1f9](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/31cf1f9e22b767bb82bd1ba55969af6e9cfa5b55))
* correct lint-staged configuration and add pre-commit hook ([030b957](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/030b9575707e6062e826de225c5c7c7289807d98))
* remove dotenv verbose logging messages for cleaner CLI output ([ece06aa](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/ece06aa62bfd92b3a45e3c506c4b9c7829e99e9b))
* replace manual git hooks with husky ([18d3057](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/18d3057385756a4a75ba186a124b4d6a18f8cb83))


### Features

* implement dynamic version display from package.json ([5d2c9e3](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/5d2c9e30b0ed0dc44d65307e02ee84fbd694192f))

## [0.9.6](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.9.5...v0.9.6) (2025-11-14)


### Bug Fixes

* remove intrusive postinstall script from npm package ([0b8d109](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/0b8d109be026d0723480d7bd1bd8d53691485de2))

## [0.9.5](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.9.4...v0.9.5) (2025-11-14)


### Bug Fixes

* improve Bun dependency management and user experience ([fe12f62](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/fe12f627de9c7e0202ce77efe563480e37ab1c34))

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
