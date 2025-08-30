/**
 * Partnership Facilitator
 * Identifies and facilitates strategic partnerships for RFQs
 */

export class PartnershipFacilitator {
  private partnershipHistory: Map<string, any> = new Map();
  private successMetrics = {
    partnerships_created: 0,
    successful_bids: 0,
    total_value_won: 0
  };

  async initialize() {
    console.log('   Initializing Partnership Facilitator...');
    await this.loadPartnershipHistory();
  }

  /**
   * Identify partnership opportunities for an RFQ
   */
  async identifyOpportunities(rfq: any, matches: any[]): Promise<any[]> {
    const opportunities = [];

    // Find businesses that could benefit from partnering
    for (let i = 0; i < matches.length; i++) {
      const primary = matches[i];
      
      // Only consider matches with 50-80% score (good but not perfect)
      if (primary.score >= 50 && primary.score < 80) {
        const gaps = this.identifyGaps(primary, rfq);
        
        if (gaps.length > 0) {
          // Find complementary partners
          const partners = await this.findComplementaryPartners(
            primary,
            gaps,
            matches,
            rfq
          );
          
          if (partners.length > 0) {
            const partnership = await this.evaluatePartnership(
              primary,
              partners,
              rfq
            );
            
            if (partnership.viability >= 70) {
              opportunities.push(partnership);
            }
          }
        }
      }
    }

    return opportunities.sort((a, b) => b.combinedScore - a.combinedScore);
  }

  /**
   * Facilitate partnerships between businesses
   */
  async facilitatePartnerships(rfq: any, partnerships: any[]): Promise<any[]> {
    const facilitated = [];

    for (const partnership of partnerships.slice(0, 5)) { // Top 5 partnerships
      const introduction = await this.createIntroduction(partnership, rfq);
      const facilitation = await this.initiateFacilitation(introduction, partnership);
      
      facilitated.push(facilitation);
      
      // Track for analytics
      this.successMetrics.partnerships_created++;
    }

    return facilitated;
  }

  /**
   * Identify capability gaps
   */
  private identifyGaps(match: any, rfq: any): string[] {
    const gaps = [];

    // Technical gaps
    if (match.scoreBreakdown?.technical < 70) {
      gaps.push('technical_expertise');
    }

    // Capacity gaps
    if (match.scoreBreakdown?.capacity < 70) {
      gaps.push('capacity');
    }

    // Geographic gaps
    if (match.scoreBreakdown?.location < 70) {
      gaps.push('geographic_presence');
    }

    // Certification gaps
    if (match.gaps?.includes('certification')) {
      gaps.push('certifications');
    }

    // Financial gaps
    if (match.scoreBreakdown?.financial < 60) {
      gaps.push('financial_capacity');
    }

    return gaps;
  }

  /**
   * Find businesses that complement the gaps
   */
  private async findComplementaryPartners(
    primary: any,
    gaps: string[],
    allMatches: any[],
    rfq: any
  ): Promise<any[]> {
    const partners = [];

    for (const potential of allMatches) {
      // Don't partner with self
      if (potential.businessId === primary.businessId) continue;
      
      // Check if this business fills the gaps
      const fillsGaps = this.evaluateGapCoverage(potential, gaps);
      
      if (fillsGaps.coverage >= 0.6) {
        // Check compatibility
        const compatibility = await this.assessCompatibility(primary, potential);
        
        if (compatibility.score >= 0.7) {
          partners.push({
            business: potential,
            gapCoverage: fillsGaps,
            compatibility
          });
        }
      }
    }

    return partners.sort((a, b) => 
      (b.gapCoverage.coverage * b.compatibility.score) - 
      (a.gapCoverage.coverage * a.compatibility.score)
    );
  }

  /**
   * Evaluate gap coverage
   */
  private evaluateGapCoverage(business: any, gaps: string[]): any {
    let covered = 0;
    const details: any = {};

    for (const gap of gaps) {
      switch (gap) {
        case 'technical_expertise':
          if (business.scoreBreakdown?.technical >= 80) {
            covered++;
            details.technical = 'Strong technical capabilities';
          }
          break;
          
        case 'capacity':
          if (business.scoreBreakdown?.capacity >= 80) {
            covered++;
            details.capacity = 'Available capacity';
          }
          break;
          
        case 'geographic_presence':
          if (business.scoreBreakdown?.location >= 90) {
            covered++;
            details.location = 'Local presence';
          }
          break;
          
        case 'certifications':
          if (!business.gaps?.includes('certification')) {
            covered++;
            details.certifications = 'Has required certifications';
          }
          break;
          
        case 'financial_capacity':
          if (business.scoreBreakdown?.financial >= 80) {
            covered++;
            details.financial = 'Strong financial capacity';
          }
          break;
      }
    }

    return {
      coverage: gaps.length > 0 ? covered / gaps.length : 0,
      coveredGaps: covered,
      totalGaps: gaps.length,
      details
    };
  }

  /**
   * Assess compatibility between businesses
   */
  private async assessCompatibility(business1: any, business2: any): Promise<any> {
    const factors = {
      industry_alignment: 0,
      size_compatibility: 0,
      culture_fit: 0,
      geographic_synergy: 0,
      past_collaboration: 0
    };

    // Industry alignment
    if (business1.business?.industry === business2.business?.industry) {
      factors.industry_alignment = 1;
    } else if (this.areIndustriesRelated(business1.business?.industry, business2.business?.industry)) {
      factors.industry_alignment = 0.7;
    } else {
      factors.industry_alignment = 0.4;
    }

    // Size compatibility
    const size1 = business1.business?.employee_count || 10;
    const size2 = business2.business?.employee_count || 10;
    const sizeRatio = Math.min(size1, size2) / Math.max(size1, size2);
    factors.size_compatibility = sizeRatio > 0.3 ? sizeRatio : 0.3;

    // Culture fit (simplified)
    if (business1.business?.is_indigenous && business2.business?.is_indigenous) {
      factors.culture_fit = 0.9;
    } else {
      factors.culture_fit = 0.7;
    }

    // Geographic synergy
    if (business1.business?.province === business2.business?.province) {
      factors.geographic_synergy = 0.9;
    } else if (business1.business?.operates_nationally || business2.business?.operates_nationally) {
      factors.geographic_synergy = 0.7;
    } else {
      factors.geographic_synergy = 0.4;
    }

    // Past collaboration (check history)
    factors.past_collaboration = await this.checkCollaborationHistory(
      business1.businessId,
      business2.businessId
    );

    // Calculate overall compatibility
    const weights = {
      industry_alignment: 0.25,
      size_compatibility: 0.20,
      culture_fit: 0.20,
      geographic_synergy: 0.20,
      past_collaboration: 0.15
    };

    const score = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);

    return {
      score,
      factors,
      recommendation: this.getCompatibilityRecommendation(score)
    };
  }

  /**
   * Evaluate partnership viability
   */
  private async evaluatePartnership(primary: any, partners: any[], rfq: any): Promise<any> {
    const topPartner = partners[0];
    
    // Calculate combined capabilities
    const combinedScore = this.calculateCombinedScore(primary, topPartner.business);
    
    // Assess synergies
    const synergies = await this.assessSynergies(primary, topPartner.business, rfq);
    
    // Calculate partnership viability
    const viability = (combinedScore * 0.5) + (synergies.overall * 0.3) + (topPartner.compatibility.score * 100 * 0.2);

    return {
      primaryBusiness: primary.businessId,
      primaryName: primary.businessName,
      partnerBusiness: topPartner.business.businessId,
      partnerName: topPartner.business.businessName,
      combinedScore,
      viability: Math.round(viability),
      synergies,
      gapsCovered: topPartner.gapCoverage,
      compatibility: topPartner.compatibility,
      structure: this.recommendPartnershipStructure(primary, topPartner.business, rfq),
      benefits: this.identifyPartnershipBenefits(primary, topPartner.business, rfq)
    };
  }

  /**
   * Calculate combined score of partnership
   */
  private calculateCombinedScore(business1: any, business2: any): number {
    // Take the best scores from each business
    const combined = {
      technical: Math.max(
        business1.scoreBreakdown?.technical || 0,
        business2.scoreBreakdown?.technical || 0
      ),
      financial: Math.max(
        business1.scoreBreakdown?.financial || 0,
        business2.scoreBreakdown?.financial || 0
      ),
      experience: Math.max(
        business1.scoreBreakdown?.experience || 0,
        business2.scoreBreakdown?.experience || 0
      ),
      capacity: Math.min(100, 
        (business1.scoreBreakdown?.capacity || 0) + 
        (business2.scoreBreakdown?.capacity || 0) * 0.7
      ),
      location: Math.max(
        business1.scoreBreakdown?.location || 0,
        business2.scoreBreakdown?.location || 0
      ),
      cultural: Math.max(
        business1.scoreBreakdown?.cultural || 0,
        business2.scoreBreakdown?.cultural || 0
      )
    };

    // Calculate weighted average
    const weights = {
      technical: 0.30,
      financial: 0.20,
      experience: 0.20,
      capacity: 0.15,
      location: 0.10,
      cultural: 0.05
    };

    return Object.entries(combined).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);
  }

  /**
   * Assess synergies between partners
   */
  private async assessSynergies(business1: any, business2: any, rfq: any): Promise<any> {
    return {
      overall: 75,
      technical: 'Complementary technical skills',
      operational: 'Shared resources possible',
      financial: 'Combined financial strength',
      market: 'Expanded market presence',
      risk: 'Risk distribution'
    };
  }

  /**
   * Create partnership introduction
   */
  private async createIntroduction(partnership: any, rfq: any): Promise<any> {
    return {
      id: `intro_${Date.now()}`,
      type: 'partnership_opportunity',
      rfqId: rfq.id,
      rfqTitle: rfq.title,
      parties: [
        {
          businessId: partnership.primaryBusiness,
          businessName: partnership.primaryName,
          role: 'primary',
          strengths: partnership.synergies.technical
        },
        {
          businessId: partnership.partnerBusiness,
          businessName: partnership.partnerName,
          role: 'partner',
          strengths: partnership.gapsCovered.details
        }
      ],
      value_proposition: {
        combined_score: `${Math.round(partnership.combinedScore)}%`,
        viability: `${partnership.viability}%`,
        key_benefits: partnership.benefits,
        structure: partnership.structure
      },
      message: this.craftIntroductionMessage(partnership, rfq),
      next_steps: [
        'Review partnership opportunity',
        'Schedule introductory call',
        'Discuss partnership structure',
        'Develop joint proposal'
      ],
      created_at: new Date().toISOString()
    };
  }

  /**
   * Initiate facilitation process
   */
  private async initiateFacilitation(introduction: any, partnership: any): Promise<any> {
    // Create facilitation record
    const facilitation = {
      id: `fac_${Date.now()}`,
      introduction_id: introduction.id,
      status: 'initiated',
      parties_notified: true,
      meetings_scheduled: false,
      documents_shared: false,
      agreement_drafted: false,
      timeline: {
        initiated: new Date().toISOString(),
        target_agreement: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      support_provided: [
        'Introduction facilitated',
        'Partnership framework provided',
        'Communication channel established'
      ]
    };

    // Store in history
    this.partnershipHistory.set(facilitation.id, {
      facilitation,
      introduction,
      partnership
    });

    return facilitation;
  }

  /**
   * Helper methods
   */
  private areIndustriesRelated(industry1: string, industry2: string): boolean {
    const related = {
      'IT Services': ['Consulting', 'Software', 'Technology'],
      'Construction': ['Engineering', 'Architecture', 'Manufacturing'],
      'Consulting': ['IT Services', 'Management', 'Professional Services']
    };

    const relations = related[industry1 as keyof typeof related] || [];
    return relations.includes(industry2);
  }

  private async checkCollaborationHistory(business1Id: string, business2Id: string): Promise<number> {
    // Check if these businesses have partnered before
    // In production, query database
    return Math.random() > 0.8 ? 0.9 : 0;
  }

  private getCompatibilityRecommendation(score: number): string {
    if (score >= 0.8) return 'Excellent partnership potential';
    if (score >= 0.7) return 'Good partnership potential';
    if (score >= 0.6) return 'Moderate partnership potential';
    return 'Consider alternative partners';
  }

  private recommendPartnershipStructure(primary: any, partner: any, rfq: any): string {
    const primarySize = primary.business?.employee_count || 10;
    const partnerSize = partner.business?.employee_count || 10;
    
    if (primarySize > partnerSize * 2) {
      return 'Prime-Subcontractor (Primary as Prime)';
    } else if (partnerSize > primarySize * 2) {
      return 'Prime-Subcontractor (Partner as Prime)';
    } else {
      return 'Joint Venture (Equal Partnership)';
    }
  }

  private identifyPartnershipBenefits(primary: any, partner: any, rfq: any): string[] {
    const benefits = [
      'Combined capabilities exceed individual scores',
      'Risk sharing and mitigation',
      'Expanded capacity for large projects'
    ];

    if (primary.business?.is_indigenous || partner.business?.is_indigenous) {
      benefits.push('Indigenous partnership advantages');
    }

    if (primary.business?.province === partner.business?.province) {
      benefits.push('Strong local presence');
    }

    return benefits;
  }

  private craftIntroductionMessage(partnership: any, rfq: any): string {
    return `Based on our analysis of the "${rfq.title}" opportunity, we've identified a strategic partnership opportunity between ${partnership.primaryName} and ${partnership.partnerName}. 

Together, your combined capabilities would achieve a ${Math.round(partnership.combinedScore)}% match score, significantly higher than individual scores. 

${partnership.primaryName} brings strong ${partnership.synergies.technical}, while ${partnership.partnerName} provides ${Object.values(partnership.gapsCovered.details)[0] || 'complementary capabilities'}.

This partnership has a ${partnership.viability}% viability score and could significantly increase your chances of winning this ${rfq.estimated_value ? `$${rfq.estimated_value.toLocaleString()}` : ''} opportunity.`;
  }

  private async loadPartnershipHistory() {
    // Load historical partnership data
    // In production, this would query the database
    console.log('      Partnership history loaded');
  }

  /**
   * Get partnership success rate
   */
  async getSuccessRate(): Promise<number> {
    if (this.successMetrics.partnerships_created === 0) return 0;
    
    return (this.successMetrics.successful_bids / this.successMetrics.partnerships_created) * 100;
  }
}