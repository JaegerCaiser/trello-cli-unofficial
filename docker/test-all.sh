#!/bin/bash

# Run All Cross-Platform Tests
# This script executes tests across multiple Docker environments

# set -e  # Removed to allow tests to fail individually

echo "🚀 Starting Cross-Platform Test Suite"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run a test and report result
run_test() {
    local test_name=$1
    local test_script=$2

    echo -e "\n${YELLOW}Running $test_name...${NC}"

    if $test_script; then
        echo -e "${GREEN}✅ $test_name PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name FAILED${NC}"
        return 1
    fi
}

# Track results
PASSED=0
FAILED=0

# Test Ubuntu environment
if run_test "Ubuntu 22.04 Tests" "./docker/test-ubuntu.sh"; then
    ((PASSED++))
else
    ((FAILED++))
fi

# Test Alpine environment
if run_test "Alpine Linux Tests" "./docker/test-alpine.sh"; then
    ((PASSED++))
else
    ((FAILED++))
fi

# Test Windows environment (only on Windows)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OS" =~ "Windows" ]]; then
    if run_test "Windows Tests" "./docker/test-windows.sh"; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Windows tests skipped (not on Windows host)${NC}"
fi

# Summary
echo -e "\n====================================="
echo -e "🏁 Test Suite Complete"
echo -e "====================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED${NC}"
    echo -e "\n${RED}Some tests failed. Please check the output above.${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 All cross-platform tests passed!${NC}"
fi