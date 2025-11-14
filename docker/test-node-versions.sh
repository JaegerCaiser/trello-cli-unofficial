#!/bin/bash

# Test Node.js Version Compatibility
# Tests the CLI with different Node.js versions using Docker

set -e

NODE_VERSIONS=("18" "20")
CONTAINER_NAME="trello-cli-node-test"

echo "🔍 Testing Node.js Version Compatibility"
echo "======================================="

for version in "${NODE_VERSIONS[@]}"; do
    echo -e "\n🧪 Testing Node.js $version..."

    # Run tests in Node.js container
    if docker run --rm \
        --name $CONTAINER_NAME \
        -v "$(pwd)":/app \
        -w /app \
        "node:$version" \
        bash -c "
            echo \"📦 Installing dependencies with npm...\"
            npm install

            echo \"🔨 Building project...\"
            npm run build

            echo \"🧪 Running tests...\"
            npm test

            echo \"✅ Node.js $version tests completed!\"
        "; then
        echo -e "✅ Node.js $version: PASSED"
    else
        echo -e "❌ Node.js $version: FAILED"
        exit 1
    fi
done

echo -e "\n🎉 All Node.js version tests passed!"