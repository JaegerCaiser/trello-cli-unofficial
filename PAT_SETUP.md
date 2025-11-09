# Personal Access Token (PAT) Setup

## Why do I need a PAT?

The release workflow needs to push back to the repository to:

- Update the version in `package.json`
- Create release commits
- Create version tags
- Push the tags

The default `GITHUB_TOKEN` doesn't have sufficient permissions for these operations on protected branches.

## How to create a PAT

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name, e.g., "Trello CLI Release"
4. Select the following permissions:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **COPY THE TOKEN IMMEDIATELY** (it only appears once!)

## How to add the PAT to the repository

1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `PAT_TOKEN`
5. Value: Paste the token you copied
6. Click "Add secret"

## Verification

After adding the secret, the next commit with `feat:`, `fix:`, or `BREAKING CHANGE` will:

1. Detect the type of change
2. Update the version automatically
3. Create a GitHub release
4. Publish to NPM

## Troubleshooting

- **"Permission denied" error**: Check if the PAT has the correct permissions
- **"Resource not accessible" error**: The PAT may have expired, generate a new one
- **Workflow doesn't run**: Check if the commit message follows conventional commits pattern</content>
  <parameter name="filePath">/home/matheus/Desenvolvimento/personal/trello-cli-unofficial/PAT_SETUP.md
