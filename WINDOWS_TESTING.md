## Known Windows Issues & Fixes

### ✅ **RESOLVED: Config Directory Path Issue**

**Problem**: On Windows, the config directory was not being created correctly because the code only checked `process.env.HOME`, which is undefined on Windows.

**Solution**: Updated `FileConfigRepository.ts` to use cross-platform home directory detection:
```typescript
const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
```

**Impact**: Config files now save correctly to `%USERPROFILE%\.trello-cli-unofficial\config.json` on Windows.

### ✅ **RESOLVED: Commander.js Argument Parsing**

**Problem**: Commands like `tcu -v` and `tcu --version` were failing with "undefined is not an object" errors.

**Solution**: Reverted `CommandController.run()` logic to parse arguments only when necessary, maintaining proper Commander.js initialization order.

**Impact**: All CLI commands now work correctly on Windows.

This document explains how to set up and run tests on Windows for the Trello CLI Unofficial project.

## Prerequisites

### Windows Host Requirements

- Windows 10/11 Pro or Enterprise (for Docker Desktop)
- Docker Desktop for Windows with Windows containers enabled
- At least 4GB RAM available for containers

### Alternative: WSL2 (Recommended)

- Windows Subsystem for Linux 2 (WSL2)
- Ubuntu or another Linux distribution
- Docker Desktop configured for WSL2 backend

## Docker Setup for Windows

### Option 1: Windows Containers (Native)

1. Install Docker Desktop for Windows
2. Enable Windows containers in Docker Desktop settings
3. Switch to Windows containers mode

### Option 2: WSL2 with Linux Containers (Recommended)

1. Install WSL2: `wsl --install`
2. Install Ubuntu: `wsl --install -d Ubuntu`
3. Install Docker Desktop and configure for WSL2
4. Use Linux containers (default mode)

## Running Windows Tests

### Using npm scripts

```bash
# Run all cross-platform tests (includes Windows when on Windows host)
npm run test:docker

# Run Windows tests specifically
npm run test:docker:windows
```

### Manual execution

```bash
# Bash script (works in WSL2, Git Bash, or PowerShell with bash)
./docker/test-windows.sh

# PowerShell script (native Windows)
./docker/test-windows.ps1
```

## Windows Container Details

The Windows testing uses:

- **Base Image**: `mcr.microsoft.com/windows/servercore:ltsc2022`
- **Node.js**: Latest LTS version via Chocolatey
- **Bun**: Latest version via PowerShell script
- **Build Tools**: Visual Studio Build Tools for native compilation

## Troubleshooting

### Common Issues

1. **"Windows containers required" error**
   - Switch Docker Desktop to Windows containers mode
   - Or use WSL2 with Linux containers

2. **Chocolatey installation fails**
   - Run PowerShell as Administrator
   - Check internet connection
   - Try manual Chocolatey installation

3. **Bun installation fails**
   - Ensure PowerShell execution policy allows scripts
   - Check Windows version compatibility
   - Try manual Bun installation from official website

4. **Container build fails**
   - Ensure sufficient disk space (>10GB free)
   - Check Docker Desktop resources allocation
   - Try rebuilding without cache: `docker build --no-cache`

### Performance Tips

- Use WSL2 for better performance than native Windows containers
- Allocate at least 4GB RAM to Docker Desktop
- Use SSD storage for faster container operations

## CI/CD Integration

For GitHub Actions, use the `windows-latest` runner:

```yaml
jobs:
  test-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Windows tests
        run: ./docker/test-windows.ps1
```

## Development Workflow

1. Develop on your preferred platform (Windows/WSL2/macOS/Linux)
2. Run local tests: `npm run test:docker`
3. Push changes and let CI validate on all platforms
4. Windows-specific issues will be caught by Windows CI runners
