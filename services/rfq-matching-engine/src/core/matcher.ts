/**
 * RFQ Matcher
 * Core matching logic for RFQs and businesses
 */

import { createClient } from '@supabase/supabase-js';

export class RFQMatcher {
  private supabase: any;
  private matchCache: Map<string, any> = new Map();

  constructor() {
    // Initialize Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }
  }

  async initialize() {
    console.log('   Initializing RFQ Matcher...');
    // Load any ML models or data needed
  }

  /**
   * Find matching businesses for an RFQ
   */
  async findMatches(rfq: any): Promise<any[]> {
    // Check cache first
    const cacheKey = `rfq_${rfq.id}`;
    if (this.matchCache.has(cacheKey)) {
      return this.matchCache.get(cacheKey);
    }

    const matches = [];

    try {
      // Get businesses that match basic criteria
      const businesses = await this.getEligibleBusinesses(rfq);
      
      for (const business of businesses) {
        const matchData = {
          businessId: business.id,
          businessName: business.name,
          business,
          matchCriteria: this.evaluateMatchCriteria(business, rfq)
        };

        // Only include if meets minimum criteria
        if (matchData.matchCriteria.meetsMinimum) {
          matches.push(matchData);
        }
      }

      // Cache results for 5 minutes
      this.matchCache.set(cacheKey, matches);
      setTimeout(() => this.matchCache.delete(cacheKey), 5 * 60 * 1000);

    } catch (error) {
      console.error('Error finding matches:', error);
    }

    return matches;
  }

  /**
   * Get eligible businesses based on RFQ requirements
   */
  private async getEligibleBusinesses(rfq: any): Promise<any[]> {
    const filters: any = {
      status: 'active',
      verified: true
    };

    // Industry filter
    if (rfq.industry) {
      filters.industry = rfq.industry;
    }

    // Location filter
    if (rfq.location?.province) {
      filters.province = rfq.location.province;
    }

    // C-5 compliance filter
    if (rfq.requiresIndigenous) {
      filters.is_indigenous = true;
    }

    // Mock data for development
    if (!this.supabase) {
      return this.getMockBusinesses(filters);
    }

    // Real Supabase query
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*')
      .match(filters)
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
      return this.getMockBusinesses(filters);
    }

    return data || [];
  }

  /**
   * Evaluate match criteria
   */
  private evaluateMatchCriteria(business: any, rfq: any) {
    const criteria = {
      industryMatch: false,
      locationMatch: false,
      capacityMatch: false,
      certificationMatch: false,
      experienceMatch: false,
      budgetMatch: false,
      indigenousMatch: false,
      meetsMinimum: false
    };

    // Industry match
    criteria.industryMatch = this.matchesIndustry(business, rfq);

    // Location match
    criteria.locationMatch = this.matchesLocation(business, rfq);

    // Capacity match
    criteria.capacityMatch = this.hasCapacity(business, rfq);

    // Certification match
    criteria.certificationMatch = this.hasCertifications(business, rfq);

    // Experience match
    criteria.experienceMatch = this.hasExperience(business, rfq);

    // Budget match
    criteria.budgetMatch = this.matchesBudget(business, rfq);

    // Indigenous requirement
    criteria.indigenousMatch = !rfq.requiresIndigenous || business.is_indigenous;

    // Determine if meets minimum requirements
    const requiredCriteria = [
      criteria.industryMatch,
      criteria.indigenousMatch
    ];

    criteria.meetsMinimum = requiredCriteria.every(c => c);

    return criteria;
  }

  /**
   * Check industry match
   */
  private matchesIndustry(business: any, rfq: any): boolean {
    if (!rfq.industry) return true;
    
    const businessIndustries = [
      business.industry,
      ...(business.secondary_industries || [])
    ].filter(Boolean);

    return businessIndustries.some(ind => 
      ind.toLowerCase().includes(rfq.industry.toLowerCase()) ||
      rfq.industry.toLowerCase().includes(ind.toLowerCase())
    );
  }

  /**
   * Check location match
   */
  private matchesLocation(business: any, rfq: any): boolean {
    if (!rfq.location) return true;

    // Province match
    if (rfq.location.province && business.province !== rfq.location.province) {
      // Check if business operates nationally
      if (!business.operates_nationally) {
        return false;
      }
    }

    // City match (if specified)
    if (rfq.location.city && business.city !== rfq.location.city) {
      // Check service area
      const serviceAreas = business.service_areas || [];
      if (!serviceAreas.includes(rfq.location.city)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check capacity
   */
  private hasCapacity(business: any, rfq: any): boolean {
    if (!rfq.estimated_value) return true;

    const maxProjectSize = business.max_project_size || 
                           (business.employee_count || 10) * 100000;

    return maxProjectSize >= rfq.estimated_value;
  }

  /**
   * Check certifications
   */
  private hasCertifications(business: any, rfq: any): boolean {
    if (!rfq.required_certifications || rfq.required_certifications.length === 0) {
      return true;
    }

    const businessCerts = business.certifications || [];
    
    return rfq.required_certifications.every((reqCert: string) =>
      businessCerts.some((cert: any) => 
        cert.type === reqCert && cert.valid
      )
    );
  }

  /**
   * Check experience
   */
  private hasExperience(business: any, rfq: any): boolean {
    if (!rfq.min_years_experience) return true;

    const yearsInBusiness = business.years_in_business || 0;
    return yearsInBusiness >= rfq.min_years_experience;
  }

  /**
   * Check budget match
   */
  private matchesBudget(business: any, rfq: any): boolean {
    if (!rfq.budget_range) return true;

    const avgProjectSize = business.avg_project_size || 50000;
    const { min, max } = rfq.budget_range;

    // Check if business typically handles projects in this range
    return avgProjectSize >= min * 0.5 && avgProjectSize <= max * 2;
  }

  /**
   * Get active RFQs
   */
  async getActiveRFQs(): Promise<any[]> {
    if (!this.supabase) {
      return this.getMockRFQs();
    }

    const { data, error } = await this.supabase
      .from('rfqs')
      .select('*')
      .eq('status', 'open')
      .gte('closing_date', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching RFQs:', error);
      return this.getMockRFQs();
    }

    return data || [];
  }

  /**
   * Get total RFQs
   */
  async getTotalRFQs(): Promise<number> {
    if (!this.supabase) return 150;

    const { count } = await this.supabase
      .from('rfqs')
      .select('*', { count: 'exact', head: true });

    return count || 0;
  }

  /**
   * Get total matches
   */
  async getTotalMatches(): Promise<number> {
    // This would track in a matches table
    return 4500; // Mock value
  }

  /**
   * Get top categories
   */
  async getTopCategories(): Promise<any[]> {
    return [
      { category: 'IT Services', count: 45, percentage: 30 },
      { category: 'Construction', count: 38, percentage: 25 },
      { category: 'Consulting', count: 30, percentage: 20 },
      { category: 'Manufacturing', count: 23, percentage: 15 },
      { category: 'Other', count: 15, percentage: 10 }
    ];
  }

  /**
   * Mock data for development
   */
  private getMockBusinesses(filters: any): any[] {
    const businesses = [
      {
        id: 'bus_1',
        name: 'Eagle Technologies',
        industry: 'IT Services',
        province: 'ON',
        city: 'Toronto',
        is_indigenous: true,
        indigenous_certified: true,
        employee_count: 50,
        years_in_business: 10,
        max_project_size: 5000000,
        avg_project_size: 250000,
        certifications: [
          { type: 'ISO9001', valid: true },
          { type: 'CCAB', valid: true }
        ],
        operates_nationally: true,
        service_areas: ['Toronto', 'Ottawa', 'Montreal']
      },
      {
        id: 'bus_2',
        name: 'Northern Construction',
        industry: 'Construction',
        province: 'MB',
        city: 'Winnipeg',
        is_indigenous: true,
        indigenous_certified: true,
        employee_count: 100,
        years_in_business: 15,
        max_project_size: 10000000,
        avg_project_size: 500000,
        certifications: [
          { type: 'COR', valid: true },
          { type: 'CCAB', valid: true }
        ],
        operates_nationally: false,
        service_areas: ['Winnipeg', 'Brandon']
      },
      {
        id: 'bus_3',
        name: 'Raven Consulting',
        industry: 'Consulting',
        province: 'BC',
        city: 'Vancouver',
        is_indigenous: true,
        indigenous_certified: true,
        employee_count: 25,
        years_in_business: 8,
        max_project_size: 2000000,
        avg_project_size: 150000,
        certifications: [
          { type: 'PMP', valid: true }
        ],
        operates_nationally: true,
        service_areas: ['Vancouver', 'Victoria', 'Calgary']
      }
    ];

    // Filter based on criteria
    return businesses.filter(b => {
      if (filters.is_indigenous && !b.is_indigenous) return false;
      if (filters.province && b.province !== filters.province) return false;
      if (filters.industry && !b.industry.includes(filters.industry)) return false;
      return true;
    });
  }

  /**
   * Mock RFQs for development
   */
  private getMockRFQs(): any[] {
    return [
      {
        id: 'rfq_1',
        title: 'IT Infrastructure Modernization',
        industry: 'IT Services',
        location: { province: 'ON', city: 'Ottawa' },
        estimated_value: 500000,
        budget_range: { min: 400000, max: 600000 },
        requiresIndigenous: true,
        required_certifications: ['ISO9001'],
        min_years_experience: 5,
        closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open'
      },
      {
        id: 'rfq_2',
        title: 'Northern Community Center Construction',
        industry: 'Construction',
        location: { province: 'MB', city: 'Winnipeg' },
        estimated_value: 2000000,
        budget_range: { min: 1800000, max: 2200000 },
        requiresIndigenous: true,
        required_certifications: ['COR'],
        min_years_experience: 10,
        closing_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open'
      },
      {
        id: 'rfq_3',
        title: 'Strategic Planning Consultation',
        industry: 'Consulting',
        location: { province: 'BC', city: 'Vancouver' },
        estimated_value: 150000,
        budget_range: { min: 100000, max: 200000 },
        requiresIndigenous: false,
        required_certifications: [],
        min_years_experience: 3,
        closing_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open'
      }
    ];
  }
}