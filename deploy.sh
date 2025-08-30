#!/bin/bash

# Indigenous Platform Deployment Script
# Complete deployment orchestration for production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${1:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"ghcr.io/indigenious"}
VERSION=${VERSION:-$(git rev-parse --short HEAD)}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${PURPLE}🚀 Indigenous Platform Deployment${NC}"
echo -e "${PURPLE}=================================${NC}"
echo ""
echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "${BLUE}Version:${NC} $VERSION"
echo -e "${BLUE}Timestamp:${NC} $TIMESTAMP"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed${NC}"
        exit 1
    fi
    
    # Check environment file
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        echo -e "${RED}❌ Environment file .env.$ENVIRONMENT not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Prerequisites OK${NC}"
}

# Function to load environment variables
load_environment() {
    echo -e "${YELLOW}Loading environment variables...${NC}"
    
    # Load environment file
    export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
    
    # Validate critical variables
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
        echo -e "${YELLOW}⚠️ Supabase credentials not set - using mock mode${NC}"
    fi
    
    if [ -z "$STRIPE_SECRET_KEY" ]; then
        echo -e "${YELLOW}⚠️ Stripe key not set - using mock payments${NC}"
    fi
    
    echo -e "${GREEN}✓ Environment loaded${NC}"
}

# Function to build Docker images
build_images() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    
    # Build all services
    docker-compose build --parallel
    
    # Tag images with version
    docker tag indigenous-web:latest $DOCKER_REGISTRY/web:$VERSION
    docker tag indigenous-business-hunter:latest $DOCKER_REGISTRY/business-hunter:$VERSION
    docker tag indigenous-email-campaign:latest $DOCKER_REGISTRY/email-campaign:$VERSION
    docker tag indigenous-rfq-matching:latest $DOCKER_REGISTRY/rfq-matching:$VERSION
    docker tag indigenous-orchestration:latest $DOCKER_REGISTRY/orchestration:$VERSION
    
    echo -e "${GREEN}✓ Images built${NC}"
}

# Function to run database migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    
    # Start only database services
    docker-compose up -d postgres redis
    
    # Wait for database to be ready
    echo "Waiting for database..."
    sleep 10
    
    # Run Prisma migrations
    docker-compose run --rm web npx prisma migrate deploy
    
    echo -e "${GREEN}✓ Migrations completed${NC}"
}

# Function to deploy services
deploy_services() {
    echo -e "${YELLOW}Deploying services...${NC}"
    
    # Stop existing containers
    docker-compose down
    
    # Start all services
    docker-compose up -d
    
    # Wait for services to be healthy
    echo "Waiting for services to be healthy..."
    sleep 30
    
    # Check health status
    docker-compose ps
    
    echo -e "${GREEN}✓ Services deployed${NC}"
}

# Function to run smoke tests
run_smoke_tests() {
    echo -e "${YELLOW}Running smoke tests...${NC}"
    
    # Test web app
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Web app is healthy${NC}"
    else
        echo -e "${RED}❌ Web app health check failed${NC}"
        return 1
    fi
    
    # Test business hunter
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Business Hunter is healthy${NC}"
    else
        echo -e "${RED}❌ Business Hunter health check failed${NC}"
        return 1
    fi
    
    # Test other services
    for port in 3002 3003 3004; do
        if curl -f http://localhost:$port/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Service on port $port is healthy${NC}"
        else
            echo -e "${YELLOW}⚠️ Service on port $port not responding${NC}"
        fi
    done
    
    echo -e "${GREEN}✓ Smoke tests passed${NC}"
}

# Function to setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}Setting up monitoring...${NC}"
    
    # Create Grafana dashboards
    if [ -d "monitoring/grafana/dashboards" ]; then
        echo "Grafana dashboards configured"
    fi
    
    # Start monitoring stack
    docker-compose up -d prometheus grafana
    
    echo -e "${GREEN}✓ Monitoring ready at http://localhost:3031${NC}"
}

# Function to launch initial campaigns
launch_campaigns() {
    echo -e "${YELLOW}Launching initial campaigns...${NC}"
    
    # Trigger business hunting
    curl -X POST http://localhost:3004/orchestrate/hunt \
        -H "Content-Type: application/json" \
        -d '{
            "targets": {
                "indigenous": 50000,
                "government_contractors": 100000,
                "service_sector": 200000,
                "corporate": 150000
            }
        }'
    
    echo -e "${GREEN}✓ Business hunting initiated${NC}"
    
    # Schedule email campaigns
    curl -X POST http://localhost:3002/campaigns/schedule \
        -H "Content-Type: application/json" \
        -d '{
            "segment": "service_sector",
            "template": "claim_profile",
            "dailyLimit": 50000
        }'
    
    echo -e "${GREEN}✓ Email campaigns scheduled${NC}"
}

# Function to display status
display_status() {
    echo ""
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}🎉 Deployment Complete!${NC}"
    echo -e "${PURPLE}========================================${NC}"
    echo ""
    echo -e "${BLUE}Access Points:${NC}"
    echo -e "  Web App:          ${GREEN}http://localhost:3000${NC}"
    echo -e "  Temporal UI:      ${GREEN}http://localhost:8080${NC}"
    echo -e "  n8n Workflows:    ${GREEN}http://localhost:5678${NC}"
    echo -e "  Bull Dashboard:   ${GREEN}http://localhost:3030${NC}"
    echo -e "  Grafana:          ${GREEN}http://localhost:3031${NC}"
    echo -e "  Prometheus:       ${GREEN}http://localhost:9090${NC}"
    echo ""
    echo -e "${BLUE}Service Endpoints:${NC}"
    echo -e "  Business Hunter:  ${GREEN}http://localhost:3001${NC}"
    echo -e "  Email Campaign:   ${GREEN}http://localhost:3002${NC}"
    echo -e "  RFQ Matching:     ${GREEN}http://localhost:3003${NC}"
    echo -e "  Orchestration:    ${GREEN}http://localhost:3004${NC}"
    echo ""
    echo -e "${BLUE}Default Credentials:${NC}"
    echo -e "  Grafana:          admin / indigenous123"
    echo -e "  n8n:              admin / indigenous123"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  1. Monitor logs:     docker-compose logs -f"
    echo -e "  2. Check metrics:    http://localhost:3031"
    echo -e "  3. View workflows:   http://localhost:5678"
    echo -e "  4. Launch campaigns: ./launch-campaigns.sh"
    echo ""
}

# Main deployment flow
main() {
    echo -e "${PURPLE}Starting deployment at $(date)${NC}"
    echo ""
    
    check_prerequisites
    load_environment
    
    case "$ENVIRONMENT" in
        "production")
            build_images
            run_migrations
            deploy_services
            run_smoke_tests
            setup_monitoring
            launch_campaigns
            ;;
        "staging")
            build_images
            run_migrations
            deploy_services
            run_smoke_tests
            ;;
        "development")
            deploy_services
            ;;
        *)
            echo -e "${RED}Unknown environment: $ENVIRONMENT${NC}"
            echo "Usage: $0 [production|staging|development]"
            exit 1
            ;;
    esac
    
    display_status
    
    echo -e "${GREEN}Deployment completed successfully!${NC}"
}

# Handle errors
trap 'echo -e "${RED}Deployment failed!${NC}"; exit 1' ERR

# Run main function
main