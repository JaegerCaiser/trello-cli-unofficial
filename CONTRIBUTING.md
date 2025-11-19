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

- `feat:` new feature → **Minor version bump** (0.5.0 → 0.6.0)
- `fix:` bug fix → **Patch version bump** (0.5.0 → 0.5.1)
- `docs:` documentation changes → No version bump
- `test:` adding or updating tests → No version bump
- `refactor:` code refactoring → No version bump
- `chore:` maintenance tasks → No version bump
- `BREAKING CHANGE:` in commit body → **Major version bump** (0.5.0 → 1.0.0)

Examples:

```bash
feat: add support for card labels         # 0.5.0 → 0.6.0
fix: handle network errors gracefully     # 0.5.0 → 0.5.1
docs: update installation instructions    # No release
test: add tests for MoveCardUseCase       # No release

# Breaking change example
feat!: redesign authentication flow        # 0.5.0 → 1.0.0

BREAKING CHANGE: token format changed from legacy to Power-Up
```

**Important:** Version bumps are **automatic** based on commit messages when merged to `main`.

### Code Style

We use **@antfu/eslint-config**. Run `bun run lint:fix` to auto-fix issues.

- Single quotes for strings
- Semicolons required
- 2 spaces indentation
- No unused variables
- Descriptive variable names

## Merge Guidelines

### Branch Strategy

- **main**: Production-ready code, protected branch
- **feature branches**: `feat/description` or `fix/description`
- **hotfix branches**: `hotfix/description` (only for critical production issues)

### Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/add-new-feature
   ```

2. **Make your changes** following the coding guidelines

3. **Test thoroughly**:
   ```bash
   bun run validate    # Lint + TypeScript + Tests
   bun test:coverage   # Check coverage (must be >95%)
   ```

4. **Update documentation** if needed:
   - README.md for user-facing changes
   - CHANGELOG.md for version history
   - docs/ for detailed documentation

5. **Create a PR** with:
   - Clear title following conventional commits
   - Detailed description of changes
   - Screenshots/videos for UI changes
   - Test results showing all checks pass

### Code Review Requirements

**Must be approved by at least 1 maintainer**

**Required checks:**
- ✅ All CI/CD pipelines pass
- ✅ Test coverage > 95%
- ✅ No linting errors
- ✅ TypeScript compilation succeeds
- ✅ Conventional commit message

**Review focus areas:**
- Code quality and maintainability
- Test coverage and correctness
- Documentation updates
- Breaking changes clearly documented
- Performance implications

### Merge Strategy

- **Squash merge** for feature branches
- **Merge commit** for hotfixes
- **Linear history** maintained
- **Automatic versioning** based on commit messages

## Testing Guidelines

### Test Coverage Requirements

- **Minimum 95% coverage** enforced in CI/CD
- **All new features** must include tests
- **All bug fixes** must include regression tests
- **Critical paths** must have integration tests

### Test Types

#### Unit Tests (`tests/unit/`)
- Test individual functions/classes in isolation
- Use mocks for external dependencies
- Fast execution (< 100ms per test)
- Cover happy path and error cases

#### Integration Tests (`tests/integration/`)
- Test component interactions
- Use real dependencies where possible
- Test CLI commands end-to-end
- Cover API integrations

#### Test Structure
```
tests/
├── unit/
│   ├── domain/          # Entity and service tests
│   ├── application/     # Use case tests with mocks
│   ├── infrastructure/  # Repository implementation tests
│   └── presentation/    # Controller and CLI tests
├── integration/         # End-to-end CLI command tests
├── mocks/              # Reusable mock implementations
└── helpers/            # Test utilities and data factories
```

### Writing Tests

```typescript
import { describe, test, expect, beforeEach } from "bun:test";
import { CreateCardUseCase } from "@application/use-cases";
import { MockTrelloRepository } from "@tests/mocks";

describe("CreateCardUseCase", () => {
  let useCase: CreateCardUseCase;
  let mockRepository: MockTrelloRepository;

  beforeEach(() => {
    mockRepository = new MockTrelloRepository();
    useCase = new CreateCardUseCase(mockRepository);
  });

  test("should create card with valid data", async () => {
    // Arrange
    const input = { name: "Test Card", listId: "list-123" };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.name).toBe("Test Card");
    expect(result.id).toBeDefined();
  });

  test("should throw error for empty name", async () => {
    const input = { name: "", listId: "list-123" };

    await expect(useCase.execute(input)).rejects.toThrow("Name is required");
  });
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run with coverage
bun test:coverage

# Run specific test file
bun test tests/unit/domain/entities/Card.test.ts

# Run tests in watch mode
bun test --watch

# Run only unit tests
bun test tests/unit/

# Run only integration tests
bun test tests/integration/
```

### Test Data Management

Use the `TestData` helper for consistent test data:

```typescript
import { TestData } from "@tests/helpers";

const mockBoard = TestData.createMockBoard({ name: "Test Board" });
const mockList = TestData.createMockList({ name: "Test List", boardId: mockBoard.id });
```

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

Releases are **fully automated** via GitHub Actions. When commits are pushed to `main`:

1. **Automatic Version Bump**: Based on commit message type
   - `feat:` → Minor bump (0.6.0 → 0.7.0)
   - `fix:` → Patch bump (0.6.0 → 0.6.1)
   - `BREAKING CHANGE:` → Major bump (0.6.0 → 1.0.0)
   
2. **Automatic Publishing**:
   - Git tag created (`v0.7.0`)
   - GitHub Release published
   - NPM package published with provenance
   - CHANGELOG.md should be updated manually before merge

**Manual version bumps** (for testing only):
```bash
bun run version:patch   # 0.1.0 → 0.1.1
bun run version:minor   # 0.1.0 → 0.2.0
bun run version:major   # 0.1.0 → 1.0.0
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🚀
