#!/bin/bash
set -e

echo "�� Validating package.json..."
node -e "JSON.parse(require(fs).readFileSync(package.json)); console.log(✅ package.json is valid)"

echo "🎯 Running lint-staged..."
npx lint-staged
