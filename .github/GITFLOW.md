# Git Flow Strategy - Trello CLI Unofficial

## 📚 Strategy for NPM Library/CLI

This project follows a **simplified Git Flow** optimized for libraries and CLIs published on NPM.

## 🌳 Branch Structure

### Main Branch

- **`main`** (protected)
  - Always stable and production-ready
  - Each commit should be a version published on NPM
  - Accepts merges ONLY via Pull Request
  - Version tags (v0.1.0, v0.2.0, etc.)
  - Automated CI/CD

### Development Branches

#### 1. **Feature Branches** (`feature/*`)

```bash
# For new features
feature/add-label-support
feature/add-due-dates
feature/improve-error-handling
```

- Created from: `main`
- Merge to: `main` (via PR)
- Naming: `feature/short-description`

#### 2. **Fix Branches** (`fix/*`)

```bash
# For non-urgent bug fixes
fix/card-creation-validation
fix/config-file-permissions
```

- Created from: `main`
- Merge to: `main` (via PR)
- Naming: `fix/short-description`

#### 3. **Hotfix Branches** (`hotfix/*`)

```bash
# For urgent production fixes
hotfix/v0.1.1-critical-auth-bug
hotfix/v0.2.3-security-vulnerability
```

- Created from: `main`
- Merge to: `main` (priority PR)
- Triggers automatic PATCH release
- Naming: `hotfix/vX.Y.Z-description`

#### 4. **Release Branches** (`release/*`)

```bash
# Preparation for MINOR or MAJOR releases
release/v0.2.0
release/v1.0.0
```

- Created from: `main`
- Merge to: `main` (via PR)
- Finalize CHANGELOG, bump version, final adjustments
- Naming: `release/vX.Y.Z`

### Auxiliary Branches (Optional)

#### 5. **Docs Branches** (`docs/*`)

```bash
docs/update-readme
docs/add-api-documentation
```

- Created from: `main`
- Merge to: `main` (via PR)
- Documentation changes only

#### 6. **Chore Branches** (`chore/*`)

```bash
chore/update-dependencies
chore/improve-ci-pipeline
```

- Created from: `main`
- Merge to: `main` (via PR)
- Maintenance, dependencies, CI/CD

## 🔄 Complete Workflow

### Feature/Fix Flow

```bash
# 1. Create branch
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Develop
git add .
git commit -m "feat: add new feature"

# 3. Push and create PR
git push origin feature/new-feature
gh pr create --title "feat: Add new feature" --body "Detailed description"

# 4. After approval and merge to main, CI/CD automatically:
#    - Analyzes the COMMIT MESSAGE (not PR title/body)
#    - If commit has "BREAKING CHANGE:" in body → Major bump (1.0.0)
#    - If commit message starts with "feat:" → Minor bump (0.2.0)
#    - If commit message starts with "fix:" → Patch bump (0.1.1)
#    - Other commits (docs, test, chore) → No release

# IMPORTANT: Ensure merge commit message follows Conventional Commits!
```

### Hotfix Flow (Urgent)

```bash
# 1. Create hotfix
git checkout main
git pull origin main
git checkout -b hotfix/v0.1.1-critical-bug

# 2. Fix
git add .
git commit -m "fix: resolve critical authentication bug"

# 3. Bump version manually
bun version patch  # 0.1.0 → 0.1.1

# 4. Push and create priority PR
git push origin hotfix/v0.1.1-critical-bug
gh pr create --title "hotfix: Critical authentication bug" --label "hotfix,priority:high"

# 5. Immediate merge (after CI) and automatic NPM publication
```

### Planned Release Flow

```bash
# 1. Create release branch
git checkout main
git pull origin main
git checkout -b release/v0.2.0

# 2. Prepare release
# - Update CHANGELOG.md
# - Review documentation
# - Bump version
bun version minor  # 0.1.x → 0.2.0

# 3. Push and create PR
git push origin release/v0.2.0
gh pr create --title "release: v0.2.0" --body "$(cat CHANGELOG.md | grep -A 20 '## \[0.2.0\]')"

# 4. Merge to main → CI publishes to NPM automatically
```

## 🤖 CI/CD Automation

### Automatic Triggers

```yaml
# When PR is merged to main:
- If commit has "feat:" → Minor bump (0.x.0)
- If commit has "fix:" → Patch bump (0.0.x)
- If commit has "BREAKING CHANGE:" → Major bump (x.0.0)
- Execute: bun run validate
- Execute: bun run build
- Publish to NPM if everything passes
- Create GitHub Release with CHANGELOG
```

### Protection Rules (main branch)

- ✅ Require pull request before merging
- ✅ Require status checks to pass (lint, typecheck, test)
- ✅ Require branches to be up to date
- ✅ Require linear history
- ❌ Do not allow force push
- ❌ Do not allow deletion

## 📋 Commit Rules

Follow **Conventional Commits**:

```bash
feat: adds new feature (minor bump)
fix: fixes bug (patch bump)
docs: updates documentation (no bump)
chore: maintenance tasks (no bump)
test: adds/updates tests (no bump)
refactor: refactors code (no bump, unless it breaks API)
perf: improves performance (patch bump)
style: formats code (no bump)

BREAKING CHANGE: in footer → major bump
```

## 🏷️ Semantic Versioning

- **MAJOR (1.0.0)**: Breaking changes - incompatible API
- **MINOR (0.x.0)**: New features - backward compatible
- **PATCH (0.0.x)**: Bug fixes - backward compatible

### When to use each:

```
0.1.0 → 0.1.1  (fix: bug fix)
0.1.1 → 0.2.0  (feat: new feature)
0.2.0 → 1.0.0  (BREAKING CHANGE: API changed)
```

## 🎯 Tag Strategy

```bash
# Tags are automatically created on merge to main
v0.1.0  # Initial release
v0.1.1  # Patch (hotfix)
v0.2.0  # Minor (feature)
v1.0.0  # Major (breaking change)
```

## 📊 Ideal History Example

```
* v0.3.0 (tag, main) Merge PR #15: feat: Add label support
|
| * feat: add label support to cards
| * test: add tests for label feature
|/
* v0.2.1 (tag) Merge PR #14: fix: Resolve config persistence issue
|
| * fix: ensure config directory exists
|/
* v0.2.0 (tag) Merge PR #13: release: v0.2.0
|
| * docs: update changelog for v0.2.0
| * feat: add due date support
| * feat: add checklist support
|/
* v0.1.0 (tag) Initial release
```

## 🚫 What NOT to Do

- ❌ Commit directly to `main`
- ❌ Merge without PR
- ❌ Skip tests before merge
- ❌ Forget to update CHANGELOG
- ❌ Publish version without tag
- ❌ Use long-lived branches (except main)

## ✅ PR Checklist

Before creating PR:

- [ ] `bun run validate` passes
- [ ] Tests added/updated
- [ ] CHANGELOG.md updated (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] Commit messages follow Conventional Commits
- [ ] Branch updated with `main`

## 🔐 Security

- Dependabot enabled for security updates
- Security PRs have priority (treated as hotfix)
- CVE vulnerabilities: create `hotfix/vX.Y.Z-cve-YYYY-XXXXX`

---

**Summary**: This project uses **Simplified Git Flow** optimized for NPM libraries, with `main` always stable, automatic releases, and strict semantic versioning.
