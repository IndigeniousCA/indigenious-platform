#!/bin/bash

# Indigenous Platform Backend Services Stop Script
# 🛑 Stop all running microservices

set -e

echo "🛑 Stopping Indigenous Platform Backend Services..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
PIDS_DIR="$BASE_DIR/pids"

# Function to stop a service
stop_service() {
    local service_name=$1
    local pid_file="$PIDS_DIR/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 $pid 2>/dev/null; then
            echo -e "${YELLOW}Stopping $service_name (PID: $pid)...${NC}"
            kill $pid
            rm "$pid_file"
            echo -e "${GREEN}✓ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}$service_name not running (stale PID file)${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "${YELLOW}$service_name not running (no PID file)${NC}"
    fi
}

# Stop all services
echo -e "\n${YELLOW}Stopping Services...${NC}"
echo "================================"

stop_service "api-gateway"
stop_service "Auth Service"
stop_service "Business Service"
stop_service "Procurement Service"
stop_service "Payments Service"
stop_service "Documents Service"
stop_service "Communications Service"
stop_service "Analytics Service"
stop_service "Compliance Service"

# Clean up any orphaned processes on known ports
echo -e "\n${YELLOW}Checking for orphaned processes...${NC}"
for port in 4000 4001 4002 4003 4004 4005 4006 4007 4008; do
    if lsof -ti:$port > /dev/null 2>&1; then
        echo -e "${YELLOW}Killing process on port $port${NC}"
        kill $(lsof -ti:$port) 2>/dev/null || true
    fi
done

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}✓ All services stopped${NC}"
echo -e "${GREEN}================================================${NC}"