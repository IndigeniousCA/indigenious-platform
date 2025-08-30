import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create a buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@indigenious.ca' },
    update: {},
    create: {
      email: 'buyer@indigenious.ca',
      passwordHash: hashedPassword,
      name: 'Test Buyer',
      role: 'BUYER',
      verified: true,
      profile: {
        create: {
          firstName: 'Test',
          lastName: 'Buyer',
          phone: '555-0001',
          city: 'Toronto',
          province: 'Ontario',
          country: 'Canada'
        }
      }
    }
  })

  // Create a supplier with business
  const supplier = await prisma.user.upsert({
    where: { email: 'supplier@indigenious.ca' },
    update: {},
    create: {
      email: 'supplier@indigenious.ca',
      passwordHash: hashedPassword,
      name: 'Eagle Construction',
      role: 'SUPPLIER',
      verified: true,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Eagle',
          phone: '555-0002',
          city: 'Vancouver',
          province: 'British Columbia',
          country: 'Canada'
        }
      },
      business: {
        create: {
          businessName: 'Eagle Construction Ltd.',
          description: 'Indigenous-owned construction company specializing in sustainable building',
          indigenousCertified: true,
          certificationNumber: 'IND-2024-001',
          verified: true,
          email: 'info@eagleconstruction.ca',
          phone: '555-0002',
          city: 'Vancouver',
          province: 'British Columbia',
          country: 'Canada',
          employees: 25,
          yearEstablished: 2015,
          annualRevenue: 2500000
        }
      }
    }
  })

  // Create another supplier
  const supplier2 = await prisma.user.upsert({
    where: { email: 'supplier2@indigenious.ca' },
    update: {},
    create: {
      email: 'supplier2@indigenious.ca',
      passwordHash: hashedPassword,
      name: 'Bear Services',
      role: 'SUPPLIER',
      verified: true,
      business: {
        create: {
          businessName: 'Bear IT Services',
          description: 'Technology services and consulting',
          indigenousCertified: true,
          certificationNumber: 'IND-2024-002',
          verified: true,
          email: 'info@bearservices.ca',
          phone: '555-0003',
          city: 'Calgary',
          province: 'Alberta',
          country: 'Canada',
          employees: 15,
          yearEstablished: 2018,
          annualRevenue: 1200000
        }
      }
    }
  })

  // Create categories
  const construction = await prisma.category.upsert({
    where: { name: 'Construction' },
    update: {},
    create: {
      name: 'Construction',
      description: 'Building and construction services'
    }
  })

  const itServices = await prisma.category.upsert({
    where: { name: 'IT Services' },
    update: {},
    create: {
      name: 'IT Services',
      description: 'Information technology and software services'
    }
  })

  // Create RFQs
  const rfq1 = await prisma.rFQ.create({
    data: {
      buyerId: buyer.id,
      title: 'Office Building Renovation',
      description: 'Looking for contractors to renovate our 5000 sq ft office space',
      requirements: 'Must be completed within 3 months. Indigenous-owned businesses preferred.',
      budgetMin: 100000,
      budgetMax: 150000,
      deadline: new Date('2025-12-31'),
      submissionDeadline: new Date('2025-09-30'),
      indigenousPreference: true,
      status: 'OPEN',
      categories: {
        create: {
          categoryId: construction.id
        }
      }
    }
  })

  const rfq2 = await prisma.rFQ.create({
    data: {
      buyerId: buyer.id,
      title: 'Website Development Project',
      description: 'Need a modern e-commerce website with payment integration',
      requirements: 'React/Next.js preferred. Must include mobile responsive design.',
      budgetMin: 25000,
      budgetMax: 50000,
      deadline: new Date('2025-10-31'),
      submissionDeadline: new Date('2025-09-15'),
      indigenousPreference: true,
      status: 'OPEN',
      categories: {
        create: {
          categoryId: itServices.id
        }
      }
    }
  })

  // Get supplier with business
  const supplierWithBusiness = await prisma.user.findUnique({
    where: { id: supplier.id },
    include: { business: true }
  })

  // Create a bid
  const bid = await prisma.bid.create({
    data: {
      rfqId: rfq1.id,
      businessId: supplierWithBusiness!.business!.id,
      userId: supplier.id,
      proposal: 'We can complete this renovation with our experienced team. We have 10 years of experience in office renovations.',
      price: 125000,
      deliveryDate: new Date('2025-11-30'),
      validUntil: new Date('2025-10-15'),
      status: 'SUBMITTED'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📊 Created:')
  console.log('  • 3 users (1 buyer, 2 suppliers)')
  console.log('  • 2 businesses')
  console.log('  • 2 categories')
  console.log('  • 2 RFQs')
  console.log('  • 1 bid')
  console.log('\n🔑 Test credentials:')
  console.log('  Buyer: buyer@indigenious.ca / password123')
  console.log('  Supplier 1: supplier@indigenious.ca / password123')
  console.log('  Supplier 2: supplier2@indigenious.ca / password123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })