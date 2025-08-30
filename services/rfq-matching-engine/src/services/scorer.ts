/**
 * RFQ Scorer
 * Advanced scoring algorithms for RFQ matches
 */

export class RFQScorer {
  private weights = {
    technical: 0.30,
    financial: 0.20,
    experience: 0.20,
    capacity: 0.15,
    location: 0.10,
    cultural: 0.05
  };

  async initialize() {
    console.log('   Initializing RFQ Scorer...');
    // Load ML models or scoring configurations
  }

  /**
   * Score matches for an RFQ
   */
  async scoreMatches(rfq: any, matches: any[]): Promise<any[]> {
    const scoredMatches = [];

    for (const match of matches) {
      const score = await this.calculateScore(match.business, rfq);
      
      scoredMatches.push({
        ...match,
        score: score.overall,
        scoreBreakdown: score.breakdown,
        winProbability: score.winProbability,
        strengths: score.strengths,
        gaps: score.gaps,
        recommendations: score.recommendations
      });
    }

    // Sort by score
    return scoredMatches.sort((a, b) => b.score - a.score);
  }

  /**
   * Score a specific business for an RFQ
   */
  async scoreBusinessForRFQ(businessId: string, rfq: any): Promise<any> {
    // Get business data (mock for now)
    const business = this.getMockBusiness(businessId);
    
    return await this.calculateScore(business, rfq);
  }

  /**
   * Calculate comprehensive score
   */
  private async calculateScore(business: any, rfq: any) {
    const breakdown = {
      technical: this.calculateTechnicalScore(business, rfq),
      financial: this.calculateFinancialScore(business, rfq),
      experience: this.calculateExperienceScore(business, rfq),
      capacity: this.calculateCapacityScore(business, rfq),
      location: this.calculateLocationScore(business, rfq),
      cultural: this.calculateCulturalScore(business, rfq)
    };

    // Calculate weighted overall score
    const overall = Object.entries(breakdown).reduce((sum, [key, score]) => {
      return sum + (score * this.weights[key as keyof typeof this.weights]);
    }, 0);

    // Calculate win probability
    const winProbability = this.calculateWinProbability(overall, breakdown);

    // Identify strengths and gaps
    const { strengths, gaps } = this.analyzeStrengthsAndGaps(breakdown);

    // Generate recommendations
    const recommendations = this.generateRecommendations(gaps, business, rfq);

    return {
      overall: Math.round(overall),
      breakdown,
      winProbability,
      strengths,
      gaps,
      recommendations
    };
  }

  /**
   * Technical capability score
   */
  private calculateTechnicalScore(business: any, rfq: any): number {
    let score = 70; // Base score

    // Check certifications
    if (rfq.required_certifications) {
      const hasCerts = rfq.required_certifications.every((cert: string) =>
        business.certifications?.some((c: any) => c.type === cert)
      );
      score += hasCerts ? 20 : -20;
    }

    // Check industry match
    if (business.industry === rfq.industry) {
      score += 10;
    }

    // Check specific skills/capabilities
    if (rfq.required_skills && business.capabilities) {
      const matchingSkills = rfq.required_skills.filter((skill: string) =>
        business.capabilities.includes(skill)
      ).length;
      
      const matchRatio = matchingSkills / rfq.required_skills.length;
      score += matchRatio * 20 - 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Financial capability score
   */
  private calculateFinancialScore(business: any, rfq: any): number {
    let score = 80; // Base score

    if (!rfq.estimated_value) return score;

    const projectSize = rfq.estimated_value;
    const businessMax = business.max_project_size || 1000000;

    // Check if business can handle the project size
    if (projectSize > businessMax) {
      score -= 40;
    } else if (projectSize > businessMax * 0.7) {
      score -= 20;
    }

    // Check bonding requirements
    if (rfq.bonding_required && !business.has_bonding) {
      score -= 30;
    }

    // Check insurance requirements
    if (rfq.insurance_required && !business.has_insurance) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Experience score
   */
  private calculateExperienceScore(business: any, rfq: any): number {
    let score = 60; // Base score

    // Years in business
    const yearsInBusiness = business.years_in_business || 0;
    const requiredYears = rfq.min_years_experience || 0;

    if (yearsInBusiness >= requiredYears) {
      score += Math.min(20, (yearsInBusiness - requiredYears) * 2);
    } else {
      score -= (requiredYears - yearsInBusiness) * 10;
    }

    // Past similar projects
    if (business.similar_projects) {
      score += Math.min(20, business.similar_projects * 5);
    }

    // Past performance rating
    if (business.performance_rating) {
      score += (business.performance_rating - 3) * 10; // Assuming 5-point scale
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Capacity score
   */
  private calculateCapacityScore(business: any, rfq: any): number {
    let score = 80; // Base score

    // Employee count vs project size
    const employees = business.employee_count || 10;
    const projectComplexity = rfq.complexity || 'medium';

    if (projectComplexity === 'high' && employees < 50) {
      score -= 30;
    } else if (projectComplexity === 'medium' && employees < 20) {
      score -= 20;
    }

    // Current workload (if available)
    if (business.current_capacity_percentage) {
      const availableCapacity = 100 - business.current_capacity_percentage;
      if (availableCapacity < 20) {
        score -= 40;
      } else if (availableCapacity < 40) {
        score -= 20;
      }
    }

    // Timeline match
    if (rfq.timeline && business.availability) {
      if (business.availability === 'immediate') {
        score += 10;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Location score
   */
  private calculateLocationScore(business: any, rfq: any): number {
    let score = 100; // Start with perfect score

    if (!rfq.location) return score;

    // Province match
    if (rfq.location.province && business.province !== rfq.location.province) {
      score -= 30;
      
      // Unless they operate nationally
      if (business.operates_nationally) {
        score += 20;
      }
    }

    // City match
    if (rfq.location.city && business.city !== rfq.location.city) {
      score -= 20;
      
      // Check service areas
      if (business.service_areas?.includes(rfq.location.city)) {
        score += 15;
      }
    }

    // Local preference bonus
    if (rfq.local_preference && business.city === rfq.location.city) {
      score = Math.min(100, score + 20);
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Cultural alignment score
   */
  private calculateCulturalScore(business: any, rfq: any): number {
    let score = 70; // Base score

    // Indigenous requirement
    if (rfq.requiresIndigenous) {
      if (business.is_indigenous) {
        score += 30;
        
        // Certified Indigenous business bonus
        if (business.indigenous_certified) {
          score += 10;
        }
      } else {
        score -= 50;
      }
    }

    // Community benefit requirements
    if (rfq.community_benefits) {
      if (business.community_involvement) {
        score += 15;
      }
      
      if (business.local_employment_ratio > 0.7) {
        score += 10;
      }
    }

    // Sustainability requirements
    if (rfq.sustainability_required && business.sustainability_certified) {
      score += 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate win probability based on scores
   */
  private calculateWinProbability(overall: number, breakdown: any): number {
    // Base probability from overall score
    let probability = overall / 100;

    // Adjust based on critical factors
    if (breakdown.technical < 50) probability *= 0.5;
    if (breakdown.financial < 40) probability *= 0.6;
    if (breakdown.experience < 30) probability *= 0.7;

    // Boost for high scores
    if (overall > 85) probability *= 1.2;
    if (breakdown.technical > 90) probability *= 1.1;

    return Math.min(0.95, probability); // Cap at 95%
  }

  /**
   * Analyze strengths and gaps
   */
  private analyzeStrengthsAndGaps(breakdown: any) {
    const strengths: string[] = [];
    const gaps: string[] = [];

    Object.entries(breakdown).forEach(([category, score]) => {
      if (score >= 80) {
        strengths.push(this.getCategoryStrength(category, score));
      } else if (score < 60) {
        gaps.push(this.getCategoryGap(category, score));
      }
    });

    return { strengths, gaps };
  }

  /**
   * Generate category-specific strength message
   */
  private getCategoryStrength(category: string, score: number): string {
    const messages: Record<string, string> = {
      technical: `Strong technical capabilities (${score}%)`,
      financial: `Excellent financial capacity (${score}%)`,
      experience: `Extensive relevant experience (${score}%)`,
      capacity: `Ideal capacity for this project (${score}%)`,
      location: `Perfect location match (${score}%)`,
      cultural: `Strong cultural alignment (${score}%)`
    };
    
    return messages[category] || `Strong ${category} score (${score}%)`;
  }

  /**
   * Generate category-specific gap message
   */
  private getCategoryGap(category: string, score: number): string {
    const messages: Record<string, string> = {
      technical: `Technical capabilities gap (${score}%)`,
      financial: `Financial capacity concerns (${score}%)`,
      experience: `Limited relevant experience (${score}%)`,
      capacity: `Capacity constraints (${score}%)`,
      location: `Location mismatch (${score}%)`,
      cultural: `Cultural alignment gap (${score}%)`
    };
    
    return messages[category] || `${category} needs improvement (${score}%)`;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(gaps: string[], business: any, rfq: any): string[] {
    const recommendations: string[] = [];

    gaps.forEach(gap => {
      if (gap.includes('Technical')) {
        recommendations.push('Consider obtaining required certifications');
        recommendations.push('Partner with a technically qualified firm');
      }
      
      if (gap.includes('Financial')) {
        recommendations.push('Consider joint venture for larger capacity');
        recommendations.push('Obtain bonding/insurance if required');
      }
      
      if (gap.includes('Experience')) {
        recommendations.push('Highlight transferable experience from similar projects');
        recommendations.push('Partner with experienced firms');
      }
      
      if (gap.includes('Capacity')) {
        recommendations.push('Consider subcontracting portions of the work');
        recommendations.push('Hire additional staff or contractors');
      }
      
      if (gap.includes('Location')) {
        recommendations.push('Establish local partnership or presence');
        recommendations.push('Highlight ability to mobilize to location');
      }
    });

    // Remove duplicates and limit to top 3
    return [...new Set(recommendations)].slice(0, 3);
  }

  /**
   * Get average score across all matches
   */
  async getAverageScore(): Promise<number> {
    // This would calculate from historical data
    return 72.5;
  }

  /**
   * Mock business data
   */
  private getMockBusiness(businessId: string): any {
    return {
      id: businessId,
      name: 'Sample Business',
      industry: 'IT Services',
      province: 'ON',
      city: 'Toronto',
      is_indigenous: true,
      indigenous_certified: true,
      employee_count: 50,
      years_in_business: 10,
      max_project_size: 5000000,
      certifications: [
        { type: 'ISO9001', valid: true },
        { type: 'CCAB', valid: true }
      ],
      capabilities: ['software development', 'cloud services', 'consulting'],
      performance_rating: 4.5,
      similar_projects: 5,
      has_bonding: true,
      has_insurance: true,
      operates_nationally: true,
      service_areas: ['Toronto', 'Ottawa', 'Montreal'],
      current_capacity_percentage: 60,
      availability: 'immediate',
      community_involvement: true,
      local_employment_ratio: 0.8,
      sustainability_certified: true
    };
  }
}