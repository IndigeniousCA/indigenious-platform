#!/bin/bash

# Indigenous Platform - Production Deployment Script
# Launch Date: September 30, 2025

set -e

echo "🦅 Indigenous Platform - Production Deployment"
echo "=============================================="

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ ERROR: .env.production not found!"
    echo "Please create .env.production with:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=xxx"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx"
    echo "SUPABASE_SERVICE_ROLE_KEY=xxx"
    echo "DATABASE_URL=xxx"
    echo "NEXTAUTH_SECRET=xxx"
    echo "STRIPE_SECRET_KEY=xxx"
    echo "STRIPE_PUBLISHABLE_KEY=xxx"
    exit 1
fi

# Load production environment
export $(cat .env.production | xargs)

echo "✅ Environment loaded"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Step 2: Run database migrations
echo "🗄️ Running database migrations..."
npx prisma generate
npx prisma migrate deploy

# Step 3: Seed initial data
echo "🌱 Seeding database..."
npx prisma db seed

# Step 4: Build the application
echo "🔨 Building application..."
pnpm build

# Step 5: Run tests
echo "🧪 Running tests..."
# pnpm test

# Step 6: Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --env-file=.env.production

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Your app is live at: https://indigenious.ca"
echo ""
echo "Next steps:"
echo "1. Test registration flow"
echo "2. Test RFQ posting"
echo "3. Test payment processing"
echo "4. Monitor error logs"