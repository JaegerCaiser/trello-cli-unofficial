# [0.13.0](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.12.1...v0.13.0) (2025-11-19)


### Bug Fixes

* make tests multilingual to support CI environment ([39db26a](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/39db26ae871eabf5fe43970182217e56b94189b7))


### Features

* implement card 1.12 - migration & backward compatibility ([adc668b](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/adc668b961f8ae8bed6244b4fad2f70b104dbb46))

## [0.12.1](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.12.0...v0.12.1) (2025-11-17)


### Bug Fixes

* **cli:** remove hardcoded version fallback in getVersion() ([72c04ef](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/72c04ef59966efada5ba095f7e2c5282540015f6))

# [0.12.0](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.11.6...v0.12.0) (2025-11-17)


### Features

* **cards:** add cards show command ([a98fa9f](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/a98fa9fe2244bbd8ba754e725b867ee22cfd4c33))

## [0.11.6](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.11.5...v0.11.6) (2025-11-14)


### Bug Fixes

* Add debug logs to CommandController for Windows troubleshooting ([5c146a9](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/5c146a9801502747c9eb1dee3f6db38fa9ad20ab))
* Implement lazy Commander initialization for Windows compatibility ([e08ca9f](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/e08ca9f298fb15d9b29e4e3daa98584c5d6321ad))
* Improve Windows compatibility test script ([2b230d9](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/2b230d9b36e0b0b4f2fec52bbd9200fd424b4de9))

## [0.11.5](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.11.4...v0.11.5) (2025-11-14)


### Bug Fixes

* Make version reading robust for Windows compatibility ([5af0780](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/5af07803c4bd074fa28a4a77de24790aa1bda666))

## [0.11.4](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.11.3...v0.11.4) (2025-11-14)


### Bug Fixes

* Initialize Commander.js in constructor to fix Windows compatibility ([7762da8](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/7762da85b532e90e68be3717609639f838c88b45))
* revert to synchronous Commander import for Windows compatibility ([badcea4](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/badcea41b971e8e5dbb1ba8993f9661cb01d7358))

## [0.11.3](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.11.2...v0.11.3) (2025-11-14)


### Bug Fixes

* switch to dynamic Commander import for better Windows compatibility ([e1ea7c5](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/e1ea7c588a10a635365a14099e7d6902a8f0eacb))

## [0.11.2](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.11.1...v0.11.2) (2025-11-14)


### Bug Fixes

* resolve Commander.js initialization issues ([c6588e7](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/c6588e75a5c9ca173921e1719849a7f8bce99abf))

## [0.11.1](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.11.0...v0.11.1) (2025-11-14)


### Bug Fixes

* use static import for Commander to fix cross-platform compatibility ([9796c57](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/9796c57b2f24638a652b4bf989e798fccbc9ea76))

# [0.11.0](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.8...v0.11.0) (2025-11-14)


### Features

* add --verbose option for detailed error reporting ([76d0fbe](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/76d0fbedcc6fefbe8841dfb56e1cd095cb224548))

## [0.10.8](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.7...v0.10.8) (2025-11-14)


### Bug Fixes

* use dynamic import for Commander initialization ([0810a65](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/0810a65526ea55f4b6082d0f6964eed62f1eddf6))

## [0.10.7](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.6...v0.10.7) (2025-11-14)


### Bug Fixes

* add Prettier configuration to align with ESLint rules ([c50bab8](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/c50bab8b8451eca95a0ae60967e3ed29b2ec5dbf))

## [0.10.6](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.5...v0.10.6) (2025-11-14)


### Bug Fixes

* update package.json engines to specify Bun instead of Node ([0856f74](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/0856f7406de5eb26a3756dbc907e1e0f147a5449))

## [0.10.5](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.4...v0.10.5) (2025-11-14)


### Bug Fixes

* ensure CommandController program initialization on Windows ([ed3f571](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/ed3f5710c4fd0e4d7fef9fdc3c6a1c00a49f227f))

## [0.10.4](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.3...v0.10.4) (2025-11-14)


### Bug Fixes

* update Node.js version to 22 for ESLint compatibility ([9a933e2](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/9a933e2f5d8eeb09c16cf144d5dd3a00448768ae))

## [0.10.3](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.2...v0.10.3) (2025-11-14)


### Bug Fixes

* add Windows USERPROFILE support for config directory ([36f72ca](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/36f72ca4685236e5bb2f03a5966e81b14815ad9c))

## [0.10.2](https://github.com/JaegerCaiser/trello-cli-unofficial/compare/v0.10.1...v0.10.2) (2025-11-14)


### Bug Fixes

* resolve Commander.js undefined error by fixing build target ([1e3370d](https://github.com/JaegerCaiser/trello-cli-unofficial/commit/1e3370de85ff3f3aefa22f42eac34361607947e1))

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
