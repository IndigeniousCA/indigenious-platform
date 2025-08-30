#!/bin/bash

# Full Stack Integration Test for Indigenous Platform
# Tests all critical endpoints and functionality

echo "🧪 Indigenous Platform Full Stack Test"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3001"
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -n "Testing $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_status, got $response)"
        ((FAILED++))
    fi
}

# Test health/status
echo -e "\n${YELLOW}1. Testing System Health${NC}"
echo "-------------------------"
test_endpoint "GET" "/" "200" "200" "Homepage"
test_endpoint "GET" "/dashboard" "200" "200" "Dashboard page"
test_endpoint "GET" "/auth/login" "200" "200" "Login page"
test_endpoint "GET" "/auth/register" "200" "200" "Register page"
test_endpoint "GET" "/rfqs" "200" "200" "RFQs page"

# Test API endpoints
echo -e "\n${YELLOW}2. Testing API Endpoints${NC}"
echo "-------------------------"
test_endpoint "GET" "/api/rfqs" "" "200" "GET /api/rfqs"
test_endpoint "GET" "/api/businesses" "" "200" "GET /api/businesses"

# Test authentication
echo -e "\n${YELLOW}3. Testing Authentication${NC}"
echo "--------------------------"
test_endpoint "POST" "/api/auth/login" '{"email":"supplier@indigenious.ca","password":"password123"}' "200" "Login with valid credentials"
test_endpoint "POST" "/api/auth/login" '{"email":"invalid@test.com","password":"wrong"}' "401" "Login with invalid credentials"
test_endpoint "GET" "/api/auth/me" "" "401" "Get user without auth"

# Test data retrieval
echo -e "\n${YELLOW}4. Testing Data Retrieval${NC}"
echo "-------------------------"

# Get RFQs and check if we have data
rfq_data=$(curl -s "$BASE_URL/api/rfqs")
rfq_count=$(echo "$rfq_data" | jq '.rfqs | length')
if [ "$rfq_count" -gt 0 ]; then
    echo -e "RFQ data: ${GREEN}✓ Found $rfq_count RFQs${NC}"
    ((PASSED++))
else
    echo -e "RFQ data: ${RED}✗ No RFQs found${NC}"
    ((FAILED++))
fi

# Get businesses and check if we have data
business_data=$(curl -s "$BASE_URL/api/businesses")
business_count=$(echo "$business_data" | jq '.businesses | length')
if [ "$business_count" -gt 0 ]; then
    echo -e "Business data: ${GREEN}✓ Found $business_count businesses${NC}"
    ((PASSED++))
else
    echo -e "Business data: ${RED}✗ No businesses found${NC}"
    ((FAILED++))
fi

# Test database connectivity
echo -e "\n${YELLOW}5. Testing Database${NC}"
echo "-------------------"
if redis-cli ping > /dev/null 2>&1; then
    echo -e "Redis: ${GREEN}✓ Connected${NC}"
    ((PASSED++))
else
    echo -e "Redis: ${RED}✗ Not connected${NC}"
    ((FAILED++))
fi

if curl -s http://localhost:54321/rest/v1/ > /dev/null 2>&1; then
    echo -e "Supabase: ${GREEN}✓ Connected${NC}"
    ((PASSED++))
else
    echo -e "Supabase: ${RED}✗ Not connected${NC}"
    ((FAILED++))
fi

# Summary
echo -e "\n${YELLOW}================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}================================${NC}"
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Your full stack is working perfectly!${NC}"
    
    echo -e "\n${YELLOW}📋 Available Test Credentials:${NC}"
    echo "  Buyer: buyer@indigenious.ca / password123"
    echo "  Supplier: supplier@indigenious.ca / password123"
    
    echo -e "\n${YELLOW}🔗 Access Points:${NC}"
    echo "  Frontend: http://localhost:3001"
    echo "  Login: http://localhost:3001/auth/login"
    echo "  Dashboard: http://localhost:3001/dashboard"
    echo "  RFQs: http://localhost:3001/rfqs"
    echo "  Supabase Studio: http://localhost:54323"
else
    echo -e "\n${RED}⚠️  Some tests failed. Please check the errors above.${NC}"
    exit 1
fi