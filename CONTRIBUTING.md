# Contributing to Trello CLI Unofficial

First off, thank you for considering contributing to Trello CLI Unofficial! 🎉

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and constructive.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, commands)
- **Describe the behavior you observed** and what you expected
- **Include your environment** (Bun version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some examples** of how it would be used

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following the project structure
3. **Add tests** if you're adding functionality
4. **Ensure the test suite passes**: `bun run validate`
5. **Update documentation** if needed (README.md, CHANGELOG.md)
6. **Follow the coding style** (ESLint will help you)
7. **Write a good commit message**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/trello-cli-unofficial.git
cd trello-cli-unofficial

# Install dependencies
bun install

# Run in development mode
bun run dev

# Run tests
bun test

# Run validation (lint + typecheck + test)
bun run validate
```

## Project Structure (DDD Architecture)

```
src/
├── domain/              # Business logic & entities (no external dependencies)
│   ├── entities/       # Core entities: Board, List, Card, Config
│   ├── repositories/   # Repository interfaces
│   └── services/       # Domain services
├── application/        # Use cases (business operations)
│   └── use-cases/     # GetBoards, CreateCard, etc.
├── infrastructure/     # External implementations
│   └── repositories/  # API and file system implementations
├── presentation/      # UI layer
│   └── cli/          # CLI controllers
└── shared/           # Cross-cutting concerns
```

## Coding Guidelines

### TypeScript

- Use **strict mode** (already configured)
- Prefer **type-only imports** when possible: `import type { ... }`
- Use **interfaces** for domain contracts
- Use **classes** for entities and services

### Testing

- Write tests for **new features** and **bug fixes**
- Follow **AAA pattern** (Arrange, Act, Assert)
- Use **mocks** for external dependencies
- Keep tests **fast and isolated**

```typescript
test("should create a card", async () => {
  // Arrange
  const useCase = new CreateCardUseCase(mockRepository);

  // Act
  const result = await useCase.execute({ name: "Test", listId: "123" });

  // Assert
  expect(result.name).toBe("Test");
});
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `test:` adding or updating tests
- `refactor:` code refactoring
- `chore:` maintenance tasks

Examples:

```
feat: add support for card labels
fix: handle network errors gracefully
docs: update installation instructions
test: add tests for MoveCardUseCase
```

### Code Style

We use **@antfu/eslint-config**. Run `bun run lint:fix` to auto-fix issues.

- Single quotes for strings
- Semicolons required
- 2 spaces indentation
- No unused variables
- Descriptive variable names

## Testing Your Changes

Before submitting a PR, ensure all checks pass:

```bash
# Lint your code
bun run lint

# Type check
bun run typecheck

# Run all tests
bun test

# Or run everything at once
bun run validate
```

## Documentation

- Update **README.md** if you're adding features or changing behavior
- Update **CHANGELOG.md** following [Keep a Changelog](https://keepachangelog.com/)
- Add inline comments for **complex logic**
- Update **.github/copilot-instructions.md** for architectural changes

## Release Process (Maintainers)

```bash
# Update version and create git tag
bun run version:patch   # 0.1.0 -> 0.1.1
bun run version:minor   # 0.1.0 -> 0.2.0
bun run version:major   # 0.1.0 -> 1.0.0

# Update CHANGELOG.md with the new version

# Publish to NPM (when ready)
npm publish
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🚀
