/**
 * Business Hunter Swarm Configuration
 * Target: 500,000 businesses before launch
 */

export const HUNTER_CONFIG = {
  // Targets
  targets: {
    indigenous: 50_000,        // Indigenous businesses
    service_sector: 200_000,   // Consulting, IT, Construction (MUST comply with C-5)
    corporate: 150_000,        // Other Canadian corporations
    government: 100_000,       // Federal contractors
    total: 500_000
  },

  // Data Sources
  sources: {
    indigenous: [
      { name: 'CCAB', url: 'https://www.ccab.com/certified-aboriginal-businesses/', count: 3000 },
      { name: 'ISC Registry', url: 'https://www.sac-isc.gc.ca', count: 5000 },
      { name: 'LinkedIn Indigenous', query: 'Indigenous business Canada', count: 15000 },
      { name: 'Provincial Registries', urls: [], count: 20000 },
      { name: 'Band Websites', urls: [], count: 10000 }
    ],
    canadian: [
      { name: 'Yellow Pages', url: 'https://www.yellowpages.ca', count: 100000 },
      { name: 'Industry Canada', url: 'https://www.ic.gc.ca', count: 150000 },
      { name: 'LinkedIn Canada', query: 'consulting construction IT Canada', count: 200000 },
      { name: 'Government Contractors', url: 'https://buyandsell.gc.ca', count: 100000 }
    ]
  },

  // Hunter Settings
  hunters: {
    concurrent_workers: 10,
    batch_size: 1000,
    rate_limit: 100, // requests per minute
    retry_attempts: 3,
    timeout: 30000 // 30 seconds
  },

  // Enrichment Settings
  enrichment: {
    use_ai: true,
    fields: [
      'industry_classification',
      'revenue_estimate',
      'employee_count',
      'contact_info',
      'social_media',
      'certifications'
    ]
  },

  // Database Settings
  database: {
    batch_insert_size: 100,
    deduplication: true,
    update_existing: true
  },

  // Compliance Scoring
  compliance: {
    indigenous_verified: 100,
    indigenous_claimed: 75,
    indigenous_potential: 50,
    service_sector: 80,    // High priority - they NEED C-5 compliance
    corporate: 60,
    government_contractor: 90
  }
}

// Industries that MUST comply with C-5 (federal contractors)
export const C5_MANDATORY_INDUSTRIES = [
  'Information Technology',
  'Management Consulting',
  'Engineering Services',
  'Construction',
  'Architecture',
  'Environmental Consulting',
  'Professional Services',
  'Scientific Research',
  'Technical Services',
  'Defense Contracting',
  'Healthcare Services',
  'Financial Services',
  'Legal Services',
  'Telecommunications',
  'Transportation'
]

// Keywords indicating Indigenous business
export const INDIGENOUS_KEYWORDS = [
  'indigenous', 'aboriginal', 'first nations', 'métis', 'inuit',
  'native', 'band-owned', 'tribal', 'indigenous-owned',
  'first nation', 'nation-owned', 'community-owned'
]

// Priority scoring for email campaigns
export const PRIORITY_SCORING = {
  government_contractor: 100,  // Highest - they MUST comply
  service_sector_large: 90,    // Large consulting/IT firms
  indigenous_verified: 85,     // Verified Indigenous businesses
  service_sector_medium: 80,   // Medium service companies
  corporate_large: 75,         // Large corporations
  indigenous_potential: 70,    // Potential Indigenous businesses
  service_sector_small: 65,    // Small service companies
  corporate_medium: 60,        // Medium corporations
  corporate_small: 50,         // Small corporations
  other: 30                    // Everyone else
}