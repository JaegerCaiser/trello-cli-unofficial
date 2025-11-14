#!/bin/bash

# Test Cross-Platform Compatibility on Alpine Linux
# This script builds and tests the Trello CLI in an Alpine container

set -e

IMAGE_NAME="trello-cli-test:alpine"
CONTAINER_NAME="trello-cli-test-alpine"

echo "🏔️ Building Alpine test environment..."
docker build -f docker/Dockerfile.alpine -t $IMAGE_NAME .

echo "🧪 Running cross-platform tests on Alpine..."
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

    echo '✅ Alpine tests completed successfully!'
  "

echo "🎉 All Alpine tests passed!"