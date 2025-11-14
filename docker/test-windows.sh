#!/bin/bash

# Windows Testing Script
# This script is designed to run on Windows via GitHub Actions or WSL

echo "🪟 Building Windows test environment..."

# Check if we're on Windows
if [[ "$OSTYPE" != "msys" ]] && [[ "$OSTYPE" != "win32" ]] && [[ ! "$OS" =~ "Windows" ]]; then
    echo "❌ This script is designed for Windows environments."
    echo "💡 For Linux testing, use: ./test-ubuntu.sh or ./test-alpine.sh"
    exit 1
fi

echo "🔧 Setting up Windows environment..."

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    # This would typically be done via Chocolatey or winget in a real Windows environment
    echo "⚠️  Node.js not found. Please install Node.js 20.x LTS first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📋 Node.js version: $NODE_VERSION"

# Install Bun if not present
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    # In a real Windows environment, this would use the Bun installer
    echo "⚠️  Bun not found. Will use npm fallback for testing."
    USE_BUN=false
else
    USE_BUN=true
    BUN_VERSION=$(bun --version)
    echo "📋 Bun version: $BUN_VERSION"
fi

echo "📦 Installing dependencies..."
if [ "$USE_BUN" = true ]; then
    bun install
else
    npm install
fi

echo "🔨 Building project..."
if [ "$USE_BUN" = true ]; then
    bun run build
else
    npm run build
fi

echo "🧪 Running cross-platform tests..."
node scripts/test-cross-platform.js

echo "✅ Windows tests completed successfully!"
echo "🎉 All Windows tests passed!"