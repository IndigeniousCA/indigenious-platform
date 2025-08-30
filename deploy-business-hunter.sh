#!/bin/bash

echo "🎯 Deploying Business Hunter Swarm"
echo "=================================="
echo ""
echo "Target: 500,000 businesses"
echo "  • 50,000 Indigenous businesses"
echo "  • 200,000 Service sector (C-5 mandatory)"
echo "  • 150,000 Corporate"
echo "  • 100,000 Government contractors"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Supabase is configured
if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo -e "${RED}✗ Supabase not configured in .env.local${NC}"
    echo "Please configure Supabase first"
    exit 1
fi

echo -e "${GREEN}✓ Supabase configured${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
cd services/business-hunter-swarm
pnpm install
cd ../..

# Create database tables if they don't exist
echo "🗄️ Setting up database tables..."
cat > setup-hunter-tables.sql << 'EOF'
-- Businesses table for 500K businesses
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Canada',
    
    -- Industry & Size
    industry VARCHAR(100),
    sub_industry VARCHAR(100),
    employee_count INTEGER,
    revenue_estimate DECIMAL(15,2),
    year_established INTEGER,
    
    -- Indigenous Status
    is_indigenous BOOLEAN DEFAULT false,
    indigenous_verified BOOLEAN DEFAULT false,
    indigenous_ownership_percentage INTEGER,
    band_affiliation VARCHAR(255),
    indigenous_certifications JSONB,
    
    -- C-5 Compliance
    c5_mandatory BOOLEAN DEFAULT false,
    c5_compliance_score DECIMAL(5,2),
    government_contractor BOOLEAN DEFAULT false,
    contract_history JSONB,
    
    -- Platform Status
    claimed BOOLEAN DEFAULT false,
    claimed_by UUID REFERENCES auth.users(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    verified BOOLEAN DEFAULT false,
    verification_level VARCHAR(50),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Enrichment
    enriched BOOLEAN DEFAULT false,
    enriched_at TIMESTAMP WITH TIME ZONE,
    enrichment_data JSONB,
    
    -- Scoring
    priority_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    
    -- Meta
    source VARCHAR(100),
    source_url TEXT,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Search
    search_vector tsvector,
    
    -- Constraints
    UNIQUE(name, city)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_indigenous ON businesses(is_indigenous);
CREATE INDEX IF NOT EXISTS idx_businesses_c5_mandatory ON businesses(c5_mandatory);
CREATE INDEX IF NOT EXISTS idx_businesses_priority ON businesses(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_claimed ON businesses(claimed);
CREATE INDEX IF NOT EXISTS idx_businesses_industry ON businesses(industry);
CREATE INDEX IF NOT EXISTS idx_businesses_search ON businesses USING GIN(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_business_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.industry, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for search vector
DROP TRIGGER IF EXISTS businesses_search_vector_trigger ON businesses;
CREATE TRIGGER businesses_search_vector_trigger
    BEFORE INSERT OR UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_business_search_vector();

-- RLS Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Public can view all businesses
CREATE POLICY "Public can view businesses" ON businesses
    FOR SELECT USING (true);

-- Only business owners can update their business
CREATE POLICY "Owners can update their business" ON businesses
    FOR UPDATE USING (auth.uid() = claimed_by);

-- Function to calculate priority scores
CREATE OR REPLACE FUNCTION calculate_priority_scores()
RETURNS void AS $$
BEGIN
    UPDATE businesses SET priority_score = 
        CASE 
            WHEN government_contractor THEN 100
            WHEN c5_mandatory AND employee_count > 100 THEN 90
            WHEN indigenous_verified THEN 85
            WHEN c5_mandatory AND employee_count > 20 THEN 80
            WHEN employee_count > 500 THEN 75
            WHEN is_indigenous THEN 70
            WHEN c5_mandatory THEN 65
            WHEN employee_count > 100 THEN 60
            WHEN employee_count > 20 THEN 50
            ELSE 30
        END;
END;
$$ LANGUAGE plpgsql;

-- Stats view
CREATE OR REPLACE VIEW business_statistics AS
SELECT 
    COUNT(*) as total_businesses,
    COUNT(*) FILTER (WHERE is_indigenous) as indigenous_businesses,
    COUNT(*) FILTER (WHERE c5_mandatory) as c5_mandatory_businesses,
    COUNT(*) FILTER (WHERE government_contractor) as government_contractors,
    COUNT(*) FILTER (WHERE claimed) as claimed_businesses,
    COUNT(*) FILTER (WHERE verified) as verified_businesses,
    COUNT(*) FILTER (WHERE enriched) as enriched_businesses,
    AVG(priority_score) as avg_priority_score
FROM businesses;

GRANT SELECT ON business_statistics TO anon, authenticated;
EOF

# Apply to Supabase
echo "Applying database schema..."
# Note: In production, use Supabase migrations or direct connection
echo -e "${YELLOW}⚠ Please run the SQL above in Supabase SQL Editor${NC}"
echo ""

# Deploy the swarm
echo "🚀 Starting Business Hunter Swarm..."
echo ""

cd services/business-hunter-swarm

# Create deployment command
cat > deploy.ts << 'EOF'
import { BusinessHunterOrchestrator } from './src/hunters/orchestrator';

async function main() {
    console.log('🤖 Business Hunter Swarm Initializing...');
    console.log('');
    
    const orchestrator = new BusinessHunterOrchestrator();
    
    // Get current statistics
    const stats = await orchestrator.getStatistics();
    if (stats && stats.total > 0) {
        console.log('📊 Current Database Status:');
        console.log(`  Total: ${stats.total.toLocaleString()}`);
        console.log(`  Indigenous: ${stats.indigenous.toLocaleString()}`);
        console.log(`  C-5 Mandatory: ${stats.c5_mandatory.toLocaleString()}`);
        console.log('');
        
        const remaining = 500000 - stats.total;
        if (remaining <= 0) {
            console.log('✅ Target of 500,000 businesses already reached!');
            return;
        }
        
        console.log(`📈 Need to collect ${remaining.toLocaleString()} more businesses`);
        console.log('');
    }
    
    // Deploy the swarm
    await orchestrator.deploySwarm();
    
    // Final statistics
    const finalStats = await orchestrator.getStatistics();
    console.log('');
    console.log('📊 Final Statistics:');
    console.log(`  Total: ${finalStats?.total.toLocaleString() || 0}`);
    console.log(`  Indigenous: ${finalStats?.indigenous.toLocaleString() || 0}`);
    console.log(`  C-5 Mandatory: ${finalStats?.c5_mandatory.toLocaleString() || 0}`);
    
    if (finalStats?.by_source) {
        console.log('');
        console.log('📍 By Source:');
        Object.entries(finalStats.by_source).forEach(([source, count]) => {
            console.log(`  ${source}: ${count.toLocaleString()}`);
        });
    }
}

main().catch(console.error);
EOF

# Run the deployment
echo -e "${GREEN}Deploying swarm...${NC}"
echo ""

# For now, create a simple test deployment
tsx deploy.ts

cd ../..

echo ""
echo "✅ Business Hunter Swarm Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Monitor collection progress in Supabase"
echo "2. Set up email campaigns for collected businesses"
echo "3. Enable 'Claim Your Profile' feature"
echo "4. Launch C-5 compliance tracking"
echo ""
echo "🎯 Ready to send 50K emails/day to collected businesses!"