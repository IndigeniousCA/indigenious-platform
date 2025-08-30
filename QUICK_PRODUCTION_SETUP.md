# 🚀 QUICK PRODUCTION SETUP - Launch by Sept 30

## What You ACTUALLY Need Working (Forget the rest for now)

### Step 1: Database (15 minutes)
```bash
# Go to https://supabase.com and create new project
# Get these values from Settings > API:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Get this from Settings > Database:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Step 2: Create Tables (5 minutes)
Run this SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Businesses table  
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_indigenous BOOLEAN DEFAULT false,
  band_number VARCHAR(50),
  ownership_percentage INTEGER,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RFQs table
CREATE TABLE rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(12,2),
  deadline DATE,
  posted_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bids table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID REFERENCES rfqs(id),
  business_id UUID REFERENCES businesses(id),
  amount DECIMAL(12,2),
  proposal TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Authentication (10 minutes)

Create `/apps/web/app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { email, password, name, isIndigenous } = await request.json()
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)
  
  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: passwordHash,
      name,
      role: 'buyer'
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  // Create business if provided
  if (name) {
    await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name,
        is_indigenous: isIndigenous
      })
  }
  
  return NextResponse.json({ success: true, user })
}
```

### Step 4: Minimum Viable Pages

1. **Registration Page** `/app/auth/register/page.tsx`:
```typescript
'use client'

export default function Register() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('businessName'),
        isIndigenous: formData.get('isIndigenous') === 'yes'
      })
    })
    
    window.location.href = '/dashboard'
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <input name="businessName" placeholder="Business Name" required />
      <select name="isIndigenous">
        <option value="no">Canadian Business</option>
        <option value="yes">Indigenous Business</option>
      </select>
      <button type="submit">Register</button>
    </form>
  )
}
```

2. **RFQ List Page** `/app/rfqs/page.tsx`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function RFQs() {
  const { data: rfqs } = await supabase
    .from('rfqs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
  
  return (
    <div>
      <h1>Open RFQs</h1>
      {rfqs?.map(rfq => (
        <div key={rfq.id}>
          <h2>{rfq.title}</h2>
          <p>{rfq.description}</p>
          <p>Budget: ${rfq.budget}</p>
          <p>Deadline: {rfq.deadline}</p>
        </div>
      ))}
    </div>
  )
}
```

### Step 5: Deploy (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Answer:
# - Link to existing project? No
# - What's your project name? indigenous-platform
# - Which directory? ./apps/web
# - Override settings? No
```

## That's It! 🎉

With just these 5 steps, you'll have:
- ✅ User registration
- ✅ Business profiles
- ✅ RFQ browsing
- ✅ Live deployment

## What to Add Next (After Launch)

1. **Week 1 Post-Launch**
   - Stripe payments
   - Email notifications
   - Better UI

2. **Week 2 Post-Launch**
   - Indigenous verification
   - Bid submission
   - Admin panel

3. **Month 1 Post-Launch**
   - Analytics
   - Document management
   - Chat system

## Emergency Contacts

If you get stuck:
- Supabase Discord: https://discord.supabase.com
- Vercel Support: https://vercel.com/support
- Stripe Support: https://support.stripe.com

## Remember

**Don't overcomplicate!** You need:
1. People can register ✅
2. People can see RFQs ✅
3. It's deployed ✅

Everything else can come after launch.