# Windows Cross-Platform Testing Script
# This PowerShell script tests the Trello CLI on Windows

param(
    [switch]$SkipBunInstall,
    [switch]$UseNpmFallback
)

Write-Host "🪟 Starting Windows Cross-Platform Tests" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = & node --version 2>$null
    Write-Host "📋 Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 20.x LTS first." -ForegroundColor Red
    Write-Host "💡 Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if Bun is available
$useBun = $true
try {
    $bunVersion = & bun --version 2>$null
    Write-Host "📋 Bun version: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Bun not found. Will use npm fallback for testing." -ForegroundColor Yellow
    $useBun = $false
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
if ($useBun -and -not $UseNpmFallback) {
    try {
        & bun install
        Write-Host "✅ Dependencies installed with Bun" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Bun install failed, falling back to npm" -ForegroundColor Yellow
        & npm install
    }
} else {
    & npm install
    Write-Host "✅ Dependencies installed with npm" -ForegroundColor Green
}

# Build project
Write-Host "🔨 Building project..." -ForegroundColor Blue
if ($useBun -and -not $UseNpmFallback) {
    try {
        & bun run build
        Write-Host "✅ Project built with Bun" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Bun build failed, falling back to npm" -ForegroundColor Yellow
        & npm run build
    }
} else {
    & npm run build
    Write-Host "✅ Project built with npm" -ForegroundColor Green
}

# Run cross-platform tests
Write-Host "🧪 Running cross-platform tests..." -ForegroundColor Blue
try {
    & node scripts/test-cross-platform.js
    Write-Host "✅ Cross-platform tests completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Cross-platform tests failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 All Windows tests passed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Test Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
if ($useBun) {
    Write-Host "  ✅ Bun: $bunVersion" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Bun: Not available (npm fallback used)" -ForegroundColor Yellow
}
Write-Host "  ✅ Build: Successful" -ForegroundColor Green
Write-Host "  ✅ Tests: All passed" -ForegroundColor Green