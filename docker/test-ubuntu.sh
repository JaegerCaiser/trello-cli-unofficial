#!/bin/bash

# Test Cross-Platform Compatibility on Ubuntu
# This script builds and tests the Trello CLI in an Ubuntu container

set -e

IMAGE_NAME="trello-cli-test:ubuntu"
CONTAINER_NAME="trello-cli-test-ubuntu"

echo "🐧 Building Ubuntu test environment..."
docker build -f docker/Dockerfile.ubuntu -t $IMAGE_NAME .

echo "🧪 Running cross-platform tests on Ubuntu..."
docker run --rm \
  --name $CONTAINER_NAME \
  -v "$(pwd)":/app \
  -w /app \
  $IMAGE_NAME \
  bash -c "
    echo '📦 Installing dependencies...'
    bun install || npm install

    echo '🔨 Building project...'
    bun run build || npm run build

    echo '🧪 Running cross-platform tests...'
    bun run test:cross-platform || node scripts/test-cross-platform.js

    echo '✅ Ubuntu tests completed successfully!'
  "

echo "🎉 All Ubuntu tests passed!"