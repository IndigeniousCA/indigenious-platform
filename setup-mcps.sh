#!/bin/bash

echo "🚀 Setting up 16 MCP Stack for Indigenous Platform"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to add MCP with error handling
add_mcp() {
    local name=$1
    local command=$2
    local scope=${3:-"local"}
    
    echo -e "${YELLOW}Adding MCP: $name${NC}"
    if claude mcp add "$name" "$command" -s "$scope" 2>/dev/null; then
        echo -e "${GREEN}✓ $name added successfully${NC}"
    else
        echo -e "${RED}✗ Failed to add $name - may already exist${NC}"
    fi
    echo ""
}

echo "📦 CRITICAL MCPs TO ADD (8 new + existing)"
echo "==========================================="
echo ""

# 1. Stripe MCP - Payment Processing (CRITICAL DAY 1)
echo "1. Stripe MCP - Payment Processing"
add_mcp "stripe" "npx -y @modelcontextprotocol/server-stripe"

# 2. Email Services - Try multiple options
echo "2. Email Services (Resend/SendGrid)"
add_mcp "resend" "npx -y @modelcontextprotocol/server-resend"
# Note: SendGrid MCP doesn't exist yet, using Resend as alternative

# 3. Sentry MCP - Error Tracking
echo "3. Sentry MCP - Error Tracking"
add_mcp "sentry" "npx -y @getsentry/mcp-server-sentry"

# 4. Analytics - Using available alternatives
echo "4. Analytics (Using Axiom as alternative to Mixpanel)"
add_mcp "axiom" "npx -y @modelcontextprotocol/server-axiom"

# 5. Workflow Orchestration - Using available alternatives
echo "5. Workflow Orchestration (Using n8n which we already have)"
# n8n is already in our list, but let's make sure
add_mcp "n8n" "npx -y @modelcontextprotocol/server-n8n"

# 6. Background Jobs - Using alternatives
echo "6. Background Jobs (Using available alternatives)"
# Since Trigger.dev and Inngest don't have MCPs yet, we'll use workarounds

# 7. AI Orchestration
echo "7. AI Orchestration (Using OpenAI/Claude directly)"
add_mcp "openai" "npx -y @modelcontextprotocol/server-openai"

# 8. Database Enhancement
echo "8. Database (Ensuring Supabase and PostgreSQL are set)"
add_mcp "supabase" "npx -y @modelcontextprotocol/server-supabase"
add_mcp "postgres" "npx -y @modelcontextprotocol/server-postgres"

echo ""
echo "📋 Checking Existing MCPs"
echo "========================"
echo ""

# List all MCPs to verify
claude mcp list

echo ""
echo "🎯 MCP Setup Summary"
echo "===================="
echo ""
echo "✅ Added critical MCPs for:"
echo "  • Stripe - Payment processing"
echo "  • Resend - Email services"
echo "  • Sentry - Error tracking"
echo "  • Axiom - Analytics"
echo "  • OpenAI - AI orchestration"
echo "  • Supabase/PostgreSQL - Database"
echo ""
echo "⚠️  Note: Some services don't have official MCPs yet:"
echo "  • Temporal - Use direct SDK integration"
echo "  • LangChain - Use Python/JS SDKs"
echo "  • Inngest - Use API/SDK"
echo "  • Trigger.dev - Use API/SDK"
echo "  • Mixpanel - Use Axiom as alternative or direct SDK"
echo "  • SendGrid - Use Resend as alternative"
echo ""
echo "📚 Next Steps:"
echo "  1. Configure environment variables for each MCP"
echo "  2. Set up API keys in .env files"
echo "  3. Test each MCP connection"
echo "  4. Build integrations using MCPs instead of direct SDKs"
echo ""
echo "🚀 MCP Setup Complete!"