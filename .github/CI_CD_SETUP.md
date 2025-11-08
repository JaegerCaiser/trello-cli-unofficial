# CI/CD Setup Guide

This document explains how to configure the GitHub Actions workflows for automated CI/CD.

## 🔐 Required Secrets

To enable automatic releases and NPM publishing, you need to configure the following secrets in your GitHub repository:

### NPM_TOKEN

**Required for**: Automatic NPM publishing

**How to get it:**

1. Login to [npmjs.com](https://www.npmjs.com/)
2. Go to your profile → Access Tokens
3. Click "Generate New Token" → "Classic Token"
4. Select "Automation" type
5. Copy the token (starts with `npm_...`)

**How to add it to GitHub:**

1. Go to your repository on GitHub
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your NPM token
6. Click "Add secret"

### CODECOV_TOKEN (Optional)

**Required for**: Code coverage reports

**How to get it:**

1. Go to [codecov.io](https://codecov.io/)
2. Sign up/Login with GitHub
3. Add your repository
4. Copy the upload token

**How to add it to GitHub:**

Same process as NPM_TOKEN, but name it `CODECOV_TOKEN`

## 📋 Workflows Overview

### 1. CI Workflow (`ci.yml`)

**Triggers:**

- On every Pull Request to `main`
- On every push to `main`

**What it does:**

- ✅ Runs linter (`bun run lint`)
- ✅ Type checks (`bun run typecheck`)
- ✅ Runs all tests (`bun test`)
- ✅ Generates coverage report
- ✅ Builds the package (`bun run build`)

### 2. Release Workflow (`release.yml`)

**Triggers:**

- On push to `main` (after PR merge)

**What it does:**

- 📦 Analyzes commit message to determine version bump:
  - `feat:` → Minor bump (0.x.0)
  - `fix:` → Patch bump (0.0.x)
  - `BREAKING CHANGE:` → Major bump (x.0.0)
  - Other commits → No release
- 🏷️ Creates git tag with new version
- 📝 Creates GitHub Release
- 🚀 Publishes to NPM automatically

**Example commit messages:**

```bash
feat: add label support           # 0.1.0 → 0.2.0
fix: resolve authentication bug   # 0.1.0 → 0.1.1
feat!: change API structure       # 0.1.0 → 1.0.0
BREAKING CHANGE: remove old API   # 0.1.0 → 1.0.0
```

### 3. PR Validation Workflow (`pr-validation.yml`)

**Triggers:**

- On Pull Request opened, synchronized, or reopened

**What it does:**

- ✅ Validates PR title follows Conventional Commits
- 🏷️ Automatically labels PRs based on branch name
- ⚠️ Detects breaking changes in PR body

**Valid PR titles:**

- ✅ `feat: add new feature`
- ✅ `fix: resolve bug`
- ✅ `docs: update readme`
- ❌ `Add new feature` (missing type)
- ❌ `Feat: add feature` (capital letter after colon)

### 4. Security Workflow (`security.yml`)

**Triggers:**

- Every Monday at midnight (scheduled)
- Manual trigger via GitHub UI

**What it does:**

- 🔍 Checks for outdated dependencies
- 🔒 Runs security audit for vulnerabilities

### 5. Dependabot (`dependabot.yml`)

**What it does:**

- 🤖 Automatically creates PRs for dependency updates
- 📦 Groups minor/patch updates together
- 🔄 Runs weekly on Mondays
- 🏷️ Auto-labels PRs with `dependencies`

## 🚀 How to Use

### First-Time Setup

1. **Add NPM_TOKEN secret** (see above)
2. **Enable GitHub Actions** in repository settings
3. **Protect main branch**:
   - Go to Settings → Branches
   - Add branch protection rule for `main`:
     - ✅ Require pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - ✅ Include administrators
     - ❌ Allow force pushes

### Making a Release

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/awesome-feature
   ```

2. **Make your changes and commit:**

   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

3. **Push and create PR:**

   ```bash
   git push origin feature/awesome-feature
   gh pr create --title "feat: Add awesome feature" --body "Description"
   ```

4. **Wait for CI to pass** (lint, typecheck, test)

5. **Merge PR to main** (via GitHub UI)

6. **Automatic release happens:**
   - Version bump (0.1.0 → 0.2.0)
   - Git tag created (v0.2.0)
   - GitHub Release created
   - Published to NPM
   - All automatic! ✨

### Manual Release (if needed)

```bash
# On main branch
git checkout main
git pull origin main

# Bump version manually
bun run version:minor  # or version:patch, version:major

# This will:
# - Update package.json
# - Create git tag
# - Push to GitHub
# Then CI will handle the rest
```

## 🔧 Customization

### Changing Release Behavior

Edit `.github/workflows/release.yml`:

```yaml
# Skip release for specific commits
if: "!contains(github.event.head_commit.message, 'skip ci')"
# Change version bump logic
# Line 38-49: Modify commit message patterns
```

### Changing CI Checks

Edit `.github/workflows/ci.yml`:

```yaml
# Add more checks
- name: Custom check
  run: bun run custom-script
```

### Branch Protection

Recommended settings in GitHub:

- Require 1 approving review (if team project)
- Require status checks: `validate`, `build`
- Require linear history
- No force pushes

## 📊 Monitoring

### Check Workflow Status

- Go to Actions tab in your repository
- See all workflow runs and their status
- Click on a run to see detailed logs

### NPM Package Status

- Check [npmjs.com/package/trello-cli-unofficial](https://www.npmjs.com/package/trello-cli-unofficial)
- See download stats, version history

### GitHub Releases

- Go to Releases page in your repository
- See all published versions with changelogs

## 🐛 Troubleshooting

### Release workflow fails to publish

**Issue:** NPM_TOKEN is invalid or expired

**Solution:**

1. Generate new token on npmjs.com
2. Update NPM_TOKEN secret in GitHub

### CI fails on lint/test

**Issue:** Code doesn't pass validation

**Solution:**

1. Run `bun run validate` locally
2. Fix issues
3. Push again

### Version bump not working

**Issue:** Commit message doesn't follow convention

**Solution:**

- Use `feat:`, `fix:`, or `BREAKING CHANGE:`
- Check PR title validation for examples

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [NPM Publishing](https://docs.npmjs.com/cli/v9/commands/npm-publish)

---

**Ready to automate!** 🚀
