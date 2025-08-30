/**
 * Email Campaign Configuration
 * 50,000 emails per day targeting 500K businesses
 */

export const CAMPAIGN_CONFIG = {
  // Daily limits
  limits: {
    daily: 50_000,
    hourly: 2_100,  // ~50K/24 hours
    perMinute: 35,
    perSecond: 1,
    batchSize: 100
  },

  // Retry settings
  retry: {
    attempts: 3,
    backoff: 'exponential',
    delay: 1000,
    maxDelay: 30000
  },

  // Campaign priorities
  priorities: {
    CRITICAL: 100,      // Government contractors non-compliant
    URGENT: 90,         // Service sector needing C-5
    HIGH: 80,           // Large corporations
    INDIGENOUS: 75,     // Indigenous businesses (free tier)
    MEDIUM: 60,         // Medium businesses
    LOW: 40,            // Small businesses
    BATCH: 20           // General outreach
  },

  // Email templates
  templates: {
    'claim-profile-c5-critical': {
      subject: '⚠️ URGENT: Your company is NON-COMPLIANT with Bill C-5',
      priority: 100,
      segments: ['government_contractor', 'non_compliant']
    },
    'claim-profile-c5-warning': {
      subject: 'Action Required: C-5 Compliance Deadline in 45 Days',
      priority: 90,
      segments: ['service_sector', 'at_risk']
    },
    'claim-profile-indigenous': {
      subject: '🎯 Your Indigenous Business Profile is Ready',
      priority: 75,
      segments: ['indigenous', 'verified']
    },
    'claim-profile-opportunity': {
      subject: 'You have 3 new RFQ matches worth $2.1M',
      priority: 70,
      segments: ['has_matches', 'active_rfqs']
    },
    'claim-profile-general': {
      subject: 'Your business has been added to Indigenous Platform',
      priority: 40,
      segments: ['general', 'unclaimed']
    }
  }
};

// Email segments based on business characteristics
export const EMAIL_SEGMENTS = {
  // HIGHEST PRIORITY - Must comply with C-5
  government_contractor: {
    name: 'Government Contractors',
    query: {
      government_contractor: true,
      claimed: false
    },
    template: 'claim-profile-c5-critical',
    urgency: 'CRITICAL',
    expectedConversion: 0.35  // 35% will claim
  },

  // HIGH PRIORITY - Service sector
  service_sector_large: {
    name: 'Large Service Companies',
    query: {
      c5_mandatory: true,
      employee_count: { gte: 100 },
      claimed: false
    },
    template: 'claim-profile-c5-warning',
    urgency: 'URGENT',
    expectedConversion: 0.30
  },

  // INDIGENOUS BUSINESSES - Free tier
  indigenous_verified: {
    name: 'Verified Indigenous Businesses',
    query: {
      is_indigenous: true,
      indigenous_verified: true,
      claimed: false
    },
    template: 'claim-profile-indigenous',
    urgency: 'HIGH',
    expectedConversion: 0.40  // Higher conversion for free tier
  },

  // MEDIUM PRIORITY
  corporate_large: {
    name: 'Large Corporations',
    query: {
      employee_count: { gte: 500 },
      claimed: false
    },
    template: 'claim-profile-opportunity',
    urgency: 'MEDIUM',
    expectedConversion: 0.20
  },

  // GENERAL OUTREACH
  general_unclaimed: {
    name: 'Unclaimed Profiles',
    query: {
      claimed: false,
      enriched: true
    },
    template: 'claim-profile-general',
    urgency: 'LOW',
    expectedConversion: 0.15
  }
};

// Campaign sequences (drip campaigns)
export const CAMPAIGN_SEQUENCES = {
  'c5-compliance-urgency': {
    name: 'C-5 Compliance Urgency Sequence',
    emails: [
      {
        day: 0,
        template: 'claim-profile-c5-critical',
        subject: '⚠️ URGENT: Your company is NON-COMPLIANT with Bill C-5'
      },
      {
        day: 3,
        template: 'c5-risk-assessment',
        subject: 'You could lose $12.5M in federal contracts'
      },
      {
        day: 7,
        template: 'c5-solution',
        subject: 'How [Company] achieved C-5 compliance in 14 days'
      },
      {
        day: 14,
        template: 'c5-final-warning',
        subject: 'Final Notice: 31 days until audit deadline'
      },
      {
        day: 21,
        template: 'c5-last-chance',
        subject: 'Last chance: Competitors are becoming compliant'
      }
    ],
    stopOnAction: ['profile_claimed', 'subscription_started']
  },

  'indigenous-opportunity': {
    name: 'Indigenous Business Opportunity',
    emails: [
      {
        day: 0,
        template: 'claim-profile-indigenous',
        subject: '🎯 Your Indigenous Business Profile is Ready'
      },
      {
        day: 2,
        template: 'indigenous-rfqs',
        subject: '17 new RFQs match your business'
      },
      {
        day: 5,
        template: 'indigenous-success',
        subject: 'How this Indigenous business won $3.2M in contracts'
      },
      {
        day: 10,
        template: 'indigenous-network',
        subject: 'Join 3,847 Indigenous businesses already winning'
      }
    ],
    stopOnAction: ['profile_claimed']
  },

  'general-activation': {
    name: 'General Activation',
    emails: [
      {
        day: 0,
        template: 'claim-profile-general',
        subject: 'Your business profile has been created'
      },
      {
        day: 7,
        template: 'profile-views',
        subject: 'Your profile was viewed 23 times this week'
      },
      {
        day: 14,
        template: 'missed-opportunities',
        subject: 'You missed 3 RFQ opportunities worth $450K'
      }
    ],
    stopOnAction: ['profile_claimed']
  }
};

// A/B test variants
export const AB_TEST_VARIANTS = {
  subject_lines: {
    urgency: [
      '⚠️ URGENT: C-5 Non-Compliance Alert',
      'WARNING: Your federal contracts are at risk',
      'Action Required: C-5 Compliance Status'
    ],
    opportunity: [
      'You have {count} new RFQ matches',
      '${amount} in new opportunities for your business',
      'Buyers are looking for your services'
    ],
    social_proof: [
      '{count} similar businesses joined this week',
      'Your competitors are already compliant',
      'Join {count}+ businesses winning contracts'
    ]
  },
  
  cta_buttons: {
    urgent: ['Claim Now', 'Secure Compliance', 'Fix This Now'],
    standard: ['View Profile', 'Get Started', 'Claim Your Profile'],
    soft: ['Learn More', 'See Details', 'Explore']
  }
};

// Performance metrics to track
export const CAMPAIGN_METRICS = {
  tracking: [
    'sent',
    'delivered',
    'opened',
    'clicked',
    'profile_claimed',
    'subscription_started',
    'bounced',
    'complained',
    'unsubscribed'
  ],
  
  goals: {
    delivery_rate: 0.98,      // 98% delivery
    open_rate: 0.25,          // 25% open
    click_rate: 0.05,         // 5% click
    claim_rate: 0.20,         // 20% claim profile
    conversion_rate: 0.06     // 6% convert to paid
  }
};