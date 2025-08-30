/**
 * RFQ Matching Engine
 * Intelligent matching of businesses to procurement opportunities
 */

import { RFQMatcher } from './core/matcher';
import { RFQScorer } from './services/scorer';
import { MatchNotifier } from './services/notifier';
import { BidAssistant } from './services/bid-assistant';
import { PartnershipFacilitator } from './services/partnership-facilitator';

export class RFQMatchingEngine {
  private matcher: RFQMatcher;
  private scorer: RFQScorer;
  private notifier: MatchNotifier;
  private bidAssistant: BidAssistant;
  private partnershipFacilitator: PartnershipFacilitator;

  constructor() {
    this.matcher = new RFQMatcher();
    this.scorer = new RFQScorer();
    this.notifier = new MatchNotifier();
    this.bidAssistant = new BidAssistant();
    this.partnershipFacilitator = new PartnershipFacilitator();
  }

  /**
   * Initialize the engine
   */
  async initialize() {
    console.log('🚀 Initializing RFQ Matching Engine...');
    
    await Promise.all([
      this.matcher.initialize(),
      this.scorer.initialize(),
      this.notifier.initialize(),
      this.bidAssistant.initialize(),
      this.partnershipFacilitator.initialize()
    ]);

    console.log('✅ RFQ Matching Engine initialized');
  }

  /**
   * Process new RFQ
   */
  async processNewRFQ(rfq: any) {
    console.log(`📋 Processing RFQ: ${rfq.title}`);
    
    try {
      // Step 1: Find matching businesses
      const matches = await this.matcher.findMatches(rfq);
      console.log(`   Found ${matches.length} potential matches`);
      
      // Step 2: Score and rank matches
      const scoredMatches = await this.scorer.scoreMatches(rfq, matches);
      console.log(`   Scored ${scoredMatches.length} matches`);
      
      // Step 3: Identify partnership opportunities
      const partnerships = await this.partnershipFacilitator.identifyOpportunities(
        rfq, 
        scoredMatches
      );
      console.log(`   Identified ${partnerships.length} partnership opportunities`);
      
      // Step 4: Notify high-scoring matches
      const notifications = await this.notifier.notifyMatches(
        rfq,
        scoredMatches.filter(m => m.score >= 70)
      );
      console.log(`   Sent ${notifications.length} notifications`);
      
      // Step 5: Facilitate partnerships
      if (partnerships.length > 0) {
        await this.partnershipFacilitator.facilitatePartnerships(
          rfq,
          partnerships
        );
        console.log(`   Facilitated ${partnerships.length} partnerships`);
      }
      
      return {
        rfqId: rfq.id,
        matches: scoredMatches.length,
        notified: notifications.length,
        partnerships: partnerships.length,
        topMatches: scoredMatches.slice(0, 5)
      };
      
    } catch (error) {
      console.error('Error processing RFQ:', error);
      throw error;
    }
  }

  /**
   * Match business to RFQs
   */
  async matchBusinessToRFQs(businessId: string, options: any = {}) {
    console.log(`🎯 Matching business ${businessId} to RFQs...`);
    
    const { limit = 10, minScore = 70 } = options;
    
    try {
      // Get active RFQs
      const rfqs = await this.matcher.getActiveRFQs();
      console.log(`   Found ${rfqs.length} active RFQs`);
      
      // Score business against each RFQ
      const matches = [];
      for (const rfq of rfqs) {
        const score = await this.scorer.scoreBusinessForRFQ(businessId, rfq);
        
        if (score.overall >= minScore) {
          matches.push({
            rfq,
            ...score,
            bidAssistance: await this.bidAssistant.generateAssistance(businessId, rfq)
          });
        }
      }
      
      // Sort by score and return top matches
      matches.sort((a, b) => b.overall - a.overall);
      
      return matches.slice(0, limit);
      
    } catch (error) {
      console.error('Error matching business to RFQs:', error);
      throw error;
    }
  }

  /**
   * Get bid assistance
   */
  async getBidAssistance(businessId: string, rfqId: string) {
    return await this.bidAssistant.generateComprehensiveAssistance(
      businessId,
      rfqId
    );
  }

  /**
   * Get analytics
   */
  async getAnalytics() {
    return {
      totalRFQs: await this.matcher.getTotalRFQs(),
      totalMatches: await this.matcher.getTotalMatches(),
      averageMatchScore: await this.scorer.getAverageScore(),
      topCategories: await this.matcher.getTopCategories(),
      partnershipSuccess: await this.partnershipFacilitator.getSuccessRate()
    };
  }
}

// Export singleton instance
export const rfqMatchingEngine = new RFQMatchingEngine();