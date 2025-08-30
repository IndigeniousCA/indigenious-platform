import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { RFQMatchingEngine } from '../../rfq-matching-engine/src/index';
import { mockSupabaseClient } from '../mocks/supabase';
import { mockNotificationService } from '../mocks/notifications';

describe('RFQ Matching Engine Integration', () => {
  let matchingEngine: RFQMatchingEngine;
  
  beforeAll(() => {
    matchingEngine = new RFQMatchingEngine({
      supabase: mockSupabaseClient,
      notifications: mockNotificationService,
      mode: 'test'
    });
  });

  afterAll(async () => {
    await matchingEngine.cleanup();
  });

  describe('RFQ Processing', () => {
    it('should process new RFQ and find matches', async () => {
      const rfq = {
        id: 'rfq-001',
        title: 'IT Infrastructure Modernization',
        budget: 500000,
        indigenousRequirement: true,
        requirements: ['cloud migration', 'security', 'DevOps'],
        deadline: '2025-12-31',
        location: 'Toronto, ON'
      };

      const result = await matchingEngine.processNewRFQ(rfq);

      expect(result.matches).toBeDefined();
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.matches[0]).toHaveProperty('businessId');
      expect(result.matches[0]).toHaveProperty('score');
      expect(result.matches[0].score).toBeGreaterThanOrEqual(0);
      expect(result.matches[0].score).toBeLessThanOrEqual(100);
    });

    it('should prioritize Indigenous businesses when required', async () => {
      const rfq = {
        id: 'rfq-002',
        indigenousRequirement: true,
        requirements: ['construction']
      };

      const matches = await matchingEngine.findMatches(rfq);
      const indigenousMatches = matches.filter(m => m.isIndigenous);

      expect(indigenousMatches.length).toBeGreaterThan(0);
      expect(matches[0].isIndigenous).toBe(true);
    });
  });

  describe('Scoring Algorithm', () => {
    it('should score based on multiple criteria', async () => {
      const rfq = {
        requirements: ['AWS', 'Python', 'Machine Learning'],
        budget: 250000,
        timeline: '3 months'
      };

      const business = {
        id: 'biz-001',
        capabilities: ['AWS', 'Python', 'Machine Learning', 'DevOps'],
        pastProjects: [
          { value: 300000, duration: '4 months', success: true },
          { value: 200000, duration: '2 months', success: true }
        ],
        certifications: ['AWS Partner', 'ISO 27001']
      };

      const score = await matchingEngine.calculateMatchScore(rfq, business);

      expect(score).toHaveProperty('overall');
      expect(score).toHaveProperty('breakdown');
      expect(score.breakdown).toHaveProperty('capabilityMatch');
      expect(score.breakdown).toHaveProperty('budgetFit');
      expect(score.breakdown).toHaveProperty('experienceScore');
      expect(score.overall).toBeGreaterThan(70);
    });

    it('should apply C-5 compliance bonus', async () => {
      const rfq = {
        isGovernment: true,
        c5Compliance: true
      };

      const indigenousBusiness = {
        id: 'ind-001',
        isIndigenous: true,
        certifications: ['CCAB Certified']
      };

      const regularBusiness = {
        id: 'reg-001',
        isIndigenous: false
      };

      const indScore = await matchingEngine.calculateMatchScore(rfq, indigenousBusiness);
      const regScore = await matchingEngine.calculateMatchScore(rfq, regularBusiness);

      expect(indScore.overall).toBeGreaterThan(regScore.overall);
      expect(indScore.breakdown.c5Bonus).toBeGreaterThan(0);
    });
  });

  describe('Partnership Facilitation', () => {
    it('should identify partnership opportunities', async () => {
      const rfq = {
        id: 'rfq-003',
        requirements: ['construction', 'electrical', 'plumbing'],
        budget: 2000000
      };

      const partnerships = await matchingEngine.identifyPartnerships(rfq);

      expect(partnerships).toBeDefined();
      expect(partnerships.length).toBeGreaterThan(0);
      expect(partnerships[0]).toHaveProperty('leadPartner');
      expect(partnerships[0]).toHaveProperty('supportPartners');
      expect(partnerships[0]).toHaveProperty('combinedScore');
      expect(partnerships[0]).toHaveProperty('synergyScore');
    });

    it('should create Indigenous-led partnerships', async () => {
      const rfq = {
        indigenousRequirement: true,
        minIndigenousParticipation: 0.51
      };

      const partnership = await matchingEngine.createPartnership(rfq, {
        leadBusinessId: 'ind-business-001',
        partnerIds: ['partner-001', 'partner-002']
      });

      expect(partnership.indigenousParticipation).toBeGreaterThanOrEqual(0.51);
      expect(partnership.leadPartner.isIndigenous).toBe(true);
    });
  });

  describe('Notification System', () => {
    it('should notify matched businesses', async () => {
      const rfq = {
        id: 'rfq-004',
        title: 'Test RFQ'
      };

      const notifications = await matchingEngine.notifyMatches(rfq, {
        matches: [
          { businessId: 'biz-001', score: 85 },
          { businessId: 'biz-002', score: 78 }
        ]
      });

      expect(notifications.sent).toBe(2);
      expect(notifications.failed).toBe(0);
      expect(notifications.deliveryIds).toHaveLength(2);
    });

    it('should send different notifications based on score', async () => {
      const highScoreNotification = await matchingEngine.createNotification({
        businessId: 'biz-001',
        rfqId: 'rfq-005',
        score: 92
      });

      const lowScoreNotification = await matchingEngine.createNotification({
        businessId: 'biz-002',
        rfqId: 'rfq-005',
        score: 65
      });

      expect(highScoreNotification.priority).toBe('high');
      expect(highScoreNotification.template).toContain('excellent match');
      expect(lowScoreNotification.priority).toBe('normal');
      expect(lowScoreNotification.template).toContain('potential match');
    });
  });

  describe('Bid Assistance', () => {
    it('should generate bid recommendations', async () => {
      const rfq = {
        id: 'rfq-006',
        requirements: ['web development', 'React', 'Node.js'],
        evaluationCriteria: [
          { criterion: 'Technical', weight: 40 },
          { criterion: 'Price', weight: 30 },
          { criterion: 'Experience', weight: 30 }
        ]
      };

      const business = {
        id: 'biz-003',
        capabilities: ['React', 'Node.js', 'TypeScript']
      };

      const recommendations = await matchingEngine.generateBidRecommendations(rfq, business);

      expect(recommendations).toHaveProperty('strengths');
      expect(recommendations).toHaveProperty('weaknesses');
      expect(recommendations).toHaveProperty('suggestions');
      expect(recommendations).toHaveProperty('winProbability');
      expect(recommendations.suggestions).toContain('Emphasize your React expertise');
    });

    it('should provide pricing guidance', async () => {
      const rfq = {
        budget: 100000,
        historicalBids: [
          { amount: 95000, won: false },
          { amount: 85000, won: true },
          { amount: 92000, won: false }
        ]
      };

      const pricing = await matchingEngine.generatePricingGuidance(rfq);

      expect(pricing).toHaveProperty('recommendedRange');
      expect(pricing).toHaveProperty('competitivePrice');
      expect(pricing).toHaveProperty('winProbability');
      expect(pricing.recommendedRange.min).toBeLessThan(pricing.recommendedRange.max);
    });
  });
});