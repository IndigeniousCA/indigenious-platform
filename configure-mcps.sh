#!/bin/bash

echo "🔧 Configuring MCPs for Indigenous Platform"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}✗ .env.local not found!${NC}"
    echo "Creating from template..."
    cp .env.mcp .env.local
    echo -e "${GREEN}✓ Created .env.local from template${NC}"
    echo ""
fi

echo -e "${BLUE}📋 MCP Configuration Status${NC}"
echo "=============================="
echo ""

# Function to check environment variable
check_env() {
    local var_name=$1
    local service=$2
    local required=${3:-false}
    
    if [ -f ".env.local" ]; then
        value=$(grep "^$var_name=" .env.local | cut -d'=' -f2)
        if [ ! -z "$value" ] && [ "$value" != "YOUR_"* ] && [ "$value" != "sk_test_YOUR"* ]; then
            echo -e "${GREEN}✓ $service configured${NC}"
            return 0
        else
            if [ "$required" = true ]; then
                echo -e "${RED}✗ $service NOT configured (REQUIRED)${NC}"
            else
                echo -e "${YELLOW}⚠ $service not configured (optional)${NC}"
            fi
            return 1
        fi
    fi
}

# Check critical services
echo -e "${YELLOW}Critical Services:${NC}"
check_env "NEXT_PUBLIC_SUPABASE_URL" "Supabase" true
check_env "STRIPE_API_KEY" "Stripe" true
check_env "RESEND_API_KEY" "Resend Email" true
check_env "DATABASE_URL" "PostgreSQL" true
echo ""

echo -e "${YELLOW}Analytics & Monitoring:${NC}"
check_env "SENTRY_DSN" "Sentry"
check_env "AXIOM_API_TOKEN" "Axiom Analytics"
echo ""

echo -e "${YELLOW}AI & Orchestration:${NC}"
check_env "OPENAI_API_KEY" "OpenAI"
check_env "N8N_HOST" "n8n Workflows"
check_env "TEMPORAL_ADDRESS" "Temporal"
check_env "INNGEST_EVENT_KEY" "Inngest"
echo ""

# Create MCP test script
cat > test-mcps.js << 'EOF'
#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function testMCP(name, testCommand) {
    try {
        console.log(`Testing ${name}...`);
        const { stdout, stderr } = await execPromise(`claude mcp test ${name} "${testCommand}" 2>&1`);
        console.log(`✓ ${name} is working`);
        return true;
    } catch (error) {
        console.log(`✗ ${name} failed: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('\n🧪 Testing MCP Connections\n');
    
    const tests = [
        ['supabase', 'list tables'],
        ['stripe', 'list products'],
        ['resend', 'list domains'],
        ['postgres', 'SELECT version()'],
    ];
    
    for (const [mcp, command] of tests) {
        await testMCP(mcp, command);
    }
}

main();
EOF

chmod +x test-mcps.js

echo ""
echo -e "${BLUE}📝 Quick Setup Guide${NC}"
echo "===================="
echo ""
echo "1. Stripe Setup:"
echo "   - Go to https://dashboard.stripe.com"
echo "   - Get your API keys from Developers > API keys"
echo "   - Create products for each pricing tier"
echo ""
echo "2. Supabase Setup:"
echo "   - Your project is already configured!"
echo "   - URL: https://vpdamevzejawthwlcfvv.supabase.co"
echo ""
echo "3. Resend Email Setup:"
echo "   - Sign up at https://resend.com"
echo "   - Get API key from Settings > API Keys"
echo "   - Verify your domain"
echo ""
echo "4. Sentry Setup:"
echo "   - Sign up at https://sentry.io"
echo "   - Create a new project"
echo "   - Get DSN from Settings > Client Keys"
echo ""
echo "5. OpenAI Setup:"
echo "   - Get API key from https://platform.openai.com"
echo ""

echo -e "${BLUE}🚀 Next Steps${NC}"
echo "============="
echo ""
echo "1. Fill in API keys in .env.local"
echo "2. Run: ./test-mcps.js to test connections"
echo "3. Start development: pnpm dev"
echo "4. Deploy Business Hunter Swarm"
echo ""

echo -e "${GREEN}✓ Configuration script complete!${NC}"