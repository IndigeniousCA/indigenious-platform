#!/bin/bash

# Simple Backend Development Script
# Starts essential services for Indigenous Platform

echo "🌲 Starting Indigenous Platform (Simple Mode)..."
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Redis
echo -e "${YELLOW}Checking Redis...${NC}"
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Redis is running${NC}"
else
    echo -e "${RED}✗ Redis not running. Starting...${NC}"
    brew services start redis
fi

# Check Supabase
echo -e "${YELLOW}Checking Supabase...${NC}"
if curl -s http://localhost:54321/rest/v1/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Supabase is running${NC}"
else
    echo -e "${YELLOW}Starting Supabase...${NC}"
    cd /Users/Jon/Desktop/Unations/indigenious-microservices/indigenous-platform
    npx supabase start &
    sleep 5
fi

# Create a simple API server as a temporary backend
echo -e "${YELLOW}Creating temporary API server...${NC}"

cat > /tmp/indigenous-api.js << 'EOF'
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Indigenous Platform API', timestamp: new Date() });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Mock authentication
  res.json({
    success: true,
    user: {
      id: '123',
      email: email,
      name: 'Test User',
      role: 'SUPPLIER'
    },
    token: 'mock-jwt-token'
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful'
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    user: {
      id: '123',
      email: 'test@indigenious.ca',
      name: 'Test User',
      role: 'SUPPLIER'
    }
  });
});

// Business endpoints
app.get('/api/businesses', (req, res) => {
  res.json({
    businesses: [
      { id: '1', name: 'Eagle Construction', verified: true },
      { id: '2', name: 'Bear Services', verified: true }
    ]
  });
});

// RFQ endpoints
app.get('/api/rfqs', (req, res) => {
  res.json({
    rfqs: [
      { id: '1', title: 'Construction Project', status: 'OPEN', budget: 50000 },
      { id: '2', title: 'IT Services', status: 'OPEN', budget: 25000 }
    ]
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(\`✓ API Server running on http://localhost:\${PORT}\`);
});
EOF

# Install minimal dependencies
cd /tmp
npm init -y > /dev/null 2>&1
npm install express cors > /dev/null 2>&1

# Start the API server
echo -e "${YELLOW}Starting API server on port 4000...${NC}"
node /tmp/indigenous-api.js &
API_PID=$!
echo $API_PID > /tmp/indigenous-api.pid

sleep 2

# Test the API
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API Server is running${NC}"
else
    echo -e "${RED}✗ API Server failed to start${NC}"
fi

echo ""
echo -e "${GREEN}=============================================="
echo -e "🎉 Indigenous Platform Backend Ready!"
echo -e "=============================================="
echo ""
echo "Services:"
echo "  • API Server:       http://localhost:4000"
echo "  • Frontend:         http://localhost:3001"
echo "  • Supabase Studio:  http://localhost:54323"
echo "  • Redis:            localhost:6379"
echo ""
echo "API Endpoints:"
echo "  • Health:     GET  http://localhost:4000/health"
echo "  • Login:      POST http://localhost:4000/api/auth/login"
echo "  • Register:   POST http://localhost:4000/api/auth/register"
echo "  • Me:         GET  http://localhost:4000/api/auth/me"
echo "  • Businesses: GET  http://localhost:4000/api/businesses"
echo "  • RFQs:       GET  http://localhost:4000/api/rfqs"
echo ""
echo "To stop the API server: kill \$(cat /tmp/indigenous-api.pid)"
echo ""