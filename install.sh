#!/bin/bash

# Trello CLI Unofficial - Global Installation Script
# This script installs the CLI globally on the system

set -e

echo "🚀 Installing Trello CLI Unofficial..."

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "main.ts" ]; then
    echo "❌ Run this script inside the trello-cli-unofficial project directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Create global link
echo "🔗 Creating global link..."
bun link

# Verify installation
if command -v trello-cli-unofficial &> /dev/null; then
    echo "✅ Installation complete!"
    echo ""
    echo "🎯 How to use:"
    echo "   trello-cli-unofficial          # Interactive mode"
    echo "   tcu                            # Shortcut (interactive mode)"
    echo "   tcu boards                     # View boards"
    echo "   tcu setup                      # Configure token"
    echo ""
    echo "📚 For more information, check the README.md"
else
    echo "❌ Installation failed. Check permissions and try again."
    exit 1
fi
