# 🚀 MCP Usage Guide - Indigenous Platform

## Overview
We have 9 MCPs installed that give us 10x development speed. **NEVER build from scratch what an MCP can do!**

## Available MCPs & Their Powers

### 1. 💳 Stripe MCP
**Use for:** ALL payment operations
```javascript
// DON'T write Stripe SDK code
// DO use MCP commands:
- Create payment links
- Process payments
- Manage subscriptions
- Handle invoices
- Create products/prices
```

### 2. 📧 Resend MCP  
**Use for:** ALL email operations
```javascript
// DON'T use nodemailer or sendgrid
// DO use MCP commands:
- Send transactional emails
- Bulk email campaigns
- Email templates
- Domain verification
```

### 3. 🐛 Sentry MCP
**Use for:** Error tracking & monitoring
```javascript
// Automatic error capture
- Track errors
- Performance monitoring
- User sessions
- Release tracking
```

### 4. 📊 Axiom MCP
**Use for:** Analytics & logging
```javascript
// Alternative to Mixpanel
- Track events
- Query logs
- Custom dashboards
- Real-time metrics
```

### 5. 🔄 n8n MCP
**Use for:** Simple workflows & automations
```javascript
// Visual workflow builder
- Email sequences
- Webhook handling
- API integrations
- Scheduled tasks
```

### 6. 🤖 OpenAI MCP
**Use for:** AI operations
```javascript
// AI/ML operations
- Text generation
- Embeddings
- Classification
- Content moderation
```

### 7. 🗄️ Supabase MCP
**Use for:** Database & auth operations
```javascript
// Complete backend
- Database queries
- Authentication
- Real-time subscriptions
- File storage
- Edge functions
```

### 8. 🐘 PostgreSQL MCP
**Use for:** Direct database operations
```javascript
// When you need raw SQL
- Complex queries
- Migrations
- Bulk operations
- Performance optimization
```

### 9. 🔴 Redis MCP
**Use for:** Caching & sessions
```javascript
// High-performance cache
- Session storage
- Rate limiting
- Pub/sub
- Queues
```

## MCP Development Patterns

### Pattern 1: Business Hunter
```
Playwright (scrape) → 
Supabase MCP (store) → 
OpenAI MCP (enrich) → 
Resend MCP (email)
```

### Pattern 2: Payment Flow
```
Stripe MCP (checkout) → 
Supabase MCP (save) → 
Resend MCP (receipt) → 
Axiom MCP (track)
```

### Pattern 3: Compliance Tracking
```
Supabase MCP (data) → 
OpenAI MCP (calculate) → 
n8n MCP (workflow) → 
Resend MCP (alert)
```

## Critical Rules

1. **ALWAYS use MCPs first** - Check if an MCP can do it before writing code
2. **Never duplicate MCP functionality** - Don't install SDKs for services with MCPs
3. **Chain MCPs together** - They work best in combination
4. **Use MCP for all integrations** - External services should go through MCPs

## Quick MCP Commands

```bash
# List all MCPs
claude mcp list

# Add new MCP
claude mcp add <name> <command>

# Test MCP connection
claude mcp test <name>

# Remove MCP
claude mcp remove <name>
```

## What We DON'T Have MCPs For (Use SDKs)

- **Temporal** - Use SDK for complex workflows
- **LangChain** - Use Python/JS SDK for agent orchestration  
- **Inngest** - Use SDK for event-driven functions
- **Trigger.dev** - Use SDK for background jobs
- **CrewAI** - Use Python SDK for multi-agent systems

## Remember

**MCPs = 10x Speed**
- With MCPs: 2 weeks to launch
- Without MCPs: 6 months to launch

**This is how we build a billion-dollar platform in 8 days!**