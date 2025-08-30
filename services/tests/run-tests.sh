#!/bin/bash

# Indigenous Platform Test Suite Runner
# Comprehensive testing for all services

set -e

echo "🧪 Indigenous Platform Test Suite"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test suite
run_test_suite() {
    local suite_name=$1
    local test_command=$2
    
    echo -e "${BLUE}Running $suite_name...${NC}"
    
    if npm run $test_command 2>&1 | tee test-output.log; then
        echo -e "${GREEN}✓ $suite_name passed${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}✗ $suite_name failed${NC}"
        ((FAILED_TESTS++))
        
        # Show last 10 lines of error
        echo -e "${YELLOW}Last 10 lines of error:${NC}"
        tail -10 test-output.log
    fi
    
    ((TOTAL_TESTS++))
    echo ""
}

# Function to check dependencies
check_dependencies() {
    echo "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed${NC}"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed${NC}"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    echo -e "${GREEN}Dependencies OK${NC}"
    echo ""
}

# Function to setup test environment
setup_test_env() {
    echo "Setting up test environment..."
    
    # Export test environment variables
    export NODE_ENV=test
    export SUPABASE_URL=https://test.supabase.co
    export SUPABASE_ANON_KEY=test-anon-key
    export RESEND_API_KEY=test-resend-key
    export STRIPE_SECRET_KEY=test-stripe-key
    
    echo -e "${GREEN}Test environment ready${NC}"
    echo ""
}

# Function to generate coverage report
generate_coverage_report() {
    echo "Generating coverage report..."
    
    npm run test:coverage > coverage-report.txt 2>&1
    
    # Extract coverage summary
    if grep -q "Statements" coverage-report.txt; then
        echo "Coverage Summary:"
        grep -A 4 "----------|---------|----------|---------|---------|" coverage-report.txt
    fi
    
    echo ""
}

# Main execution
main() {
    echo "Starting test suite at $(date)"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Setup test environment
    setup_test_env
    
    # Run different test suites
    echo -e "${BLUE}=== Running Unit Tests ===${NC}"
    run_test_suite "Business Hunter Unit Tests" "test -- business-hunter.test.ts"
    run_test_suite "RFQ Matching Unit Tests" "test -- rfq-matching.test.ts"
    run_test_suite "Email Campaign Unit Tests" "test -- email-campaign.test.ts"
    
    echo -e "${BLUE}=== Running Integration Tests ===${NC}"
    run_test_suite "Orchestration Integration" "test -- orchestration.test.ts"
    run_test_suite "Service Integration" "test:integration"
    
    echo -e "${BLUE}=== Running E2E Tests ===${NC}"
    run_test_suite "Claim Profile Flow" "test -- claim-profile-flow.test.ts"
    run_test_suite "RFQ Response Flow" "test -- rfq-response-flow.test.ts"
    
    # Generate coverage report
    generate_coverage_report
    
    # Summary
    echo "================================="
    echo -e "${BLUE}Test Summary${NC}"
    echo "================================="
    echo "Total Test Suites: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        echo ""
        
        # Run performance benchmark
        echo "Running performance benchmark..."
        node performance-benchmark.js
        
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Some tests failed. Please check the logs.${NC}"
        echo ""
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "unit")
        setup_test_env
        npm run test:unit
        ;;
    "integration")
        setup_test_env
        npm run test:integration
        ;;
    "e2e")
        setup_test_env
        npm run test:e2e
        ;;
    "coverage")
        setup_test_env
        npm run test:coverage
        ;;
    "watch")
        setup_test_env
        npm run test:watch
        ;;
    "ci")
        setup_test_env
        npm run test:ci
        ;;
    *)
        main
        ;;
esac