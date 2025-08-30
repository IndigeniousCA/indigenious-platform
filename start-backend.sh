#!/bin/bash

# Indigenous Platform Backend Services Startup Script
# 🚀 Start all microservices for local development

set -e

echo "🌲 Starting Indigenous Platform Backend Services..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVICES_DIR="$BASE_DIR/services"

# Check if Redis is running (required for many services)
echo -e "${YELLOW}Checking Redis...${NC}"
if command -v redis-cli > /dev/null 2>&1; then
    if redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Redis is already running${NC}"
    else
        echo -e "${YELLOW}Starting Redis...${NC}"
        if command -v brew > /dev/null 2>&1; then
            brew services start redis > /dev/null 2>&1
        else
            redis-server --daemonize yes
        fi
        sleep 2
        if redis-cli ping > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Redis started successfully${NC}"
        else
            echo -e "${RED}✗ Failed to start Redis${NC}"
            exit 1
        fi
    fi
else
    echo -e "${RED}✗ Redis is not installed. Please install it first:${NC}"
    echo "  brew install redis"
    exit 1
fi

# Check if Supabase is running
echo -e "${YELLOW}Checking Supabase...${NC}"
cd "$BASE_DIR"
if ! npx supabase status > /dev/null 2>&1; then
    echo -e "${YELLOW}Starting Supabase...${NC}"
    npx supabase start
fi
echo -e "${GREEN}✓ Supabase is running${NC}"

# Function to start a service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo -e "${YELLOW}Starting $service_name on port $port...${NC}"
    
    if [ -d "$service_path" ]; then
        cd "$service_path"
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies for $service_name..."
            npm install --legacy-peer-deps
        fi
        
        # Start the service in background
        PORT=$port npm run dev > "$BASE_DIR/logs/${service_name}.log" 2>&1 &
        local pid=$!
        echo $pid > "$BASE_DIR/pids/${service_name}.pid"
        
        # Wait a moment to check if it started
        sleep 2
        if kill -0 $pid 2>/dev/null; then
            echo -e "${GREEN}✓ $service_name started (PID: $pid)${NC}"
        else
            echo -e "${RED}✗ Failed to start $service_name${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Service directory not found: $service_path${NC}"
        return 1
    fi
}

# Create logs and pids directories
mkdir -p "$BASE_DIR/logs"
mkdir -p "$BASE_DIR/pids"

# Start all services
echo -e "\n${YELLOW}Starting Microservices...${NC}"
echo "================================"

# Core Services
start_service "Auth Service" "$SERVICES_DIR/auth" 4001
start_service "Business Service" "$SERVICES_DIR/business" 4002
start_service "Procurement Service" "$SERVICES_DIR/procurement" 4003
start_service "Payments Service" "$SERVICES_DIR/payments" 4004
start_service "Documents Service" "$SERVICES_DIR/documents" 4005
start_service "Communications Service" "$SERVICES_DIR/communications" 4006
start_service "Analytics Service" "$SERVICES_DIR/analytics" 4007
start_service "Compliance Service" "$SERVICES_DIR/compliance" 4008

# API Gateway (starts last, needs other services)
echo -e "\n${YELLOW}Starting API Gateway...${NC}"
cd "$BASE_DIR/apps/api-gateway"
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps
fi
PORT=4000 npm run dev > "$BASE_DIR/logs/api-gateway.log" 2>&1 &
GATEWAY_PID=$!
echo $GATEWAY_PID > "$BASE_DIR/pids/api-gateway.pid"
sleep 2
if kill -0 $GATEWAY_PID 2>/dev/null; then
    echo -e "${GREEN}✓ API Gateway started on port 4000 (PID: $GATEWAY_PID)${NC}"
else
    echo -e "${RED}✗ Failed to start API Gateway${NC}"
fi

# Summary
echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}🎉 Indigenous Platform Backend Started!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Service URLs:"
echo "  • API Gateway:      http://localhost:4000"
echo "  • Auth Service:     http://localhost:4001"
echo "  • Business Service: http://localhost:4002"
echo "  • Procurement:      http://localhost:4003"
echo "  • Payments:         http://localhost:4004"
echo "  • Documents:        http://localhost:4005"
echo "  • Communications:   http://localhost:4006"
echo "  • Analytics:        http://localhost:4007"
echo "  • Compliance:       http://localhost:4008"
echo ""
echo "  • Frontend:         http://localhost:3001"
echo "  • Supabase Studio:  http://localhost:54323"
echo ""
echo "Logs are available in: $BASE_DIR/logs/"
echo "PIDs are stored in: $BASE_DIR/pids/"
echo ""
echo "To stop all services, run: ./stop-backend.sh"
echo ""