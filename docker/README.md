# Cross-Platform Testing with Docker

This directory contains Docker configurations for testing the Trello CLI across different platforms and environments.

## Quick Start

```bash
# Test on Ubuntu (Linux)
./test-linux.sh

# Test on Alpine Linux
./test-alpine.sh

# Test Node.js compatibility
./test-node-versions.sh

# Run all tests
./test-all.sh
```

## Available Test Environments

### Linux Distributions

- **Ubuntu 22.04** - Primary Linux testing environment
- **Ubuntu 20.04** - LTS compatibility testing
- **Alpine Linux** - Minimal environment testing

### Node.js Versions

- **Node.js 18.x** - LTS support
- **Node.js 20.x** - Current LTS
- **Node.js 22.x** - Latest (if available)

### Package Managers

- **npm** - Standard package manager
- **yarn** - Alternative package manager
- **bun** - Primary runtime (when available)

## Test Scenarios

Each test environment validates:

1. **Build Process** - Can the project build successfully?
2. **Installation** - Can the package be installed globally?
3. **CLI Functionality** - Do basic commands work?
4. **File Operations** - Can config files be created/read?
5. **Platform Features** - OS-specific functionality works?

## Manual Testing

For manual testing in containers:

```bash
# Enter Ubuntu container
docker run -it --rm -v $(pwd):/app trello-cli-test:ubuntu bash

# Run tests inside container
cd /app
npm test
npm run test:cross-platform
```

## CI/CD Integration

These Docker environments can be used in GitHub Actions:

```yaml
- name: Test in Ubuntu
  run: docker run --rm -v ${{ github.workspace }}:/app trello-cli-test:ubuntu

- name: Test in Alpine
  run: docker run --rm -v ${{ github.workspace }}:/app trello-cli-test:alpine
```
