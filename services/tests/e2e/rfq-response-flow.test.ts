import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { RFQMatchingEngine } from '../../rfq-matching-engine/src/index';
import { mockSupabaseClient } from '../mocks/supabase';
import { mockNotificationService } from '../mocks/notifications';

describe('E2E: RFQ Response Flow', () => {
  let matchingEngine: RFQMatchingEngine;
  
  beforeAll(async () => {
    matchingEngine = new RFQMatchingEngine({
      supabase: mockSupabaseClient,
      notifications: mockNotificationService,
      mode: 'test'
    });
  });

  afterAll(async () => {
    await matchingEngine.cleanup();
  });

  it('should complete full RFQ response journey', async () => {
    // Step 1: Government agency creates RFQ with C-5 requirement
    const rfq = {
      id: 'gov-rfq-001',
      title: 'Cloud Infrastructure Modernization',
      agency: 'Public Services and Procurement Canada',
      budget: 5000000,
      indigenousRequirement: true,
      minIndigenousParticipation: 0.05, // C-5 compliance
      requirements: [
        'AWS migration',
        'Security compliance',
        'DevOps implementation',
        '24/7 support'
      ],
      evaluationCriteria: [
        { criterion: 'Technical Capability', weight: 35 },
        { criterion: 'Price', weight: 25 },
        { criterion: 'Indigenous Participation', weight: 20 },
        { criterion: 'Past Performance', weight: 20 }
      ],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // Step 2: Process RFQ and find matches
    const matchResults = await matchingEngine.processNewRFQ(rfq);
    
    expect(matchResults.matches).toBeDefined();
    expect(matchResults.matches.length).toBeGreaterThan(0);
    expect(matchResults.partnerships).toBeDefined();
    
    // Verify Indigenous businesses are prioritized
    const topMatches = matchResults.matches.slice(0, 5);
    const indigenousInTop = topMatches.filter(m => m.isIndigenous);
    expect(indigenousInTop.length).toBeGreaterThan(0);
    
    // Step 3: Notify matched businesses
    const notifications = await matchingEngine.notifyMatches(rfq, {
      matches: topMatches
    });
    
    expect(notifications.sent).toBe(5);
    expect(notifications.failed).toBe(0);
    
    // Step 4: Business views RFQ details
    const businessId = topMatches[0].businessId;
    const rfqView = await mockSupabaseClient.from('rfq_views').insert({
      rfq_id: rfq.id,
      business_id: businessId,
      viewed_at: new Date().toISOString()
    });
    
    expect(rfqView.error).toBeNull();
    
    // Step 5: Generate bid recommendations
    const business = {
      id: businessId,
      isIndigenous: true,
      capabilities: ['AWS', 'DevOps', 'Security'],
      certifications: ['AWS Partner', 'ISO 27001', 'CCAB Certified'],
      pastProjects: [
        { client: 'Gov Agency A', value: 2000000, success: true },
        { client: 'Gov Agency B', value: 3000000, success: true }
      ]
    };
    
    const recommendations = await matchingEngine.generateBidRecommendations(rfq, business);
    
    expect(recommendations.winProbability).toBeGreaterThan(0.6);
    expect(recommendations.strengths).toContain('Indigenous-owned business (C-5 compliance)');
    expect(recommendations.suggestions).toBeDefined();
    expect(recommendations.suggestions.length).toBeGreaterThan(0);
    
    // Step 6: Generate pricing guidance
    const pricing = await matchingEngine.generatePricingGuidance({
      ...rfq,
      historicalBids: [
        { amount: 4500000, won: false },
        { amount: 3800000, won: true },
        { amount: 4200000, won: false }
      ]
    });
    
    expect(pricing.recommendedRange).toBeDefined();
    expect(pricing.recommendedRange.min).toBeLessThan(pricing.recommendedRange.max);
    expect(pricing.competitivePrice).toBeGreaterThan(3500000);
    expect(pricing.competitivePrice).toBeLessThan(4500000);
    
    // Step 7: Business prepares response
    const response = {
      rfq_id: rfq.id,
      business_id: businessId,
      proposed_price: pricing.competitivePrice,
      technical_approach: recommendations.suggestions.join('\n'),
      indigenous_participation: 1.0, // 100% Indigenous owned
      team_composition: [
        { role: 'Project Manager', indigenous: true },
        { role: 'Lead Developer', indigenous: true },
        { role: 'Security Expert', indigenous: false },
        { role: 'DevOps Engineer', indigenous: true }
      ],
      delivery_timeline: '6 months',
      created_at: new Date().toISOString()
    };
    
    const submitted = await mockSupabaseClient.from('rfq_responses').insert(response);
    expect(submitted.error).toBeNull();
    
    // Step 8: Calculate response score
    const responseScore = await mockSupabaseClient.rpc('calculate_response_score', {
      rfq_id: rfq.id,
      response_id: submitted.data[0].id
    });
    
    expect(responseScore.data).toBeDefined();
    expect(responseScore.data.totalScore).toBeGreaterThan(75);
    expect(responseScore.data.breakdown).toHaveProperty('technical');
    expect(responseScore.data.breakdown).toHaveProperty('price');
    expect(responseScore.data.breakdown).toHaveProperty('indigenousParticipation');
    
    // Step 9: Track metrics
    const metrics = {
      rfq_created: 1,
      matches_found: matchResults.matches.length,
      notifications_sent: notifications.sent,
      responses_received: 1,
      indigenous_responses: 1,
      average_score: responseScore.data.totalScore
    };
    
    expect(metrics.matches_found).toBeGreaterThan(0);
    expect(metrics.indigenous_responses).toBe(1);
    expect(metrics.average_score).toBeGreaterThan(75);
  });

  it('should facilitate Indigenous-led partnership', async () => {
    // Create RFQ requiring partnership
    const rfq = {
      id: 'partnership-rfq-001',
      title: 'Large Infrastructure Project',
      budget: 20000000,
      indigenousRequirement: true,
      minIndigenousParticipation: 0.51, // Majority Indigenous
      requirements: [
        'Construction',
        'Electrical',
        'Plumbing',
        'Project Management'
      ]
    };
    
    // Find partnership opportunities
    const partnerships = await matchingEngine.identifyPartnerships(rfq);
    
    expect(partnerships.length).toBeGreaterThan(0);
    
    const bestPartnership = partnerships[0];
    expect(bestPartnership.leadPartner.isIndigenous).toBe(true);
    expect(bestPartnership.indigenousParticipation).toBeGreaterThanOrEqual(0.51);
    
    // Create partnership proposal
    const proposal = await matchingEngine.createPartnership(rfq, {
      leadBusinessId: bestPartnership.leadPartner.id,
      partnerIds: bestPartnership.supportPartners.map(p => p.id),
      workAllocation: {
        [bestPartnership.leadPartner.id]: 0.55,
        [bestPartnership.supportPartners[0].id]: 0.25,
        [bestPartnership.supportPartners[1].id]: 0.20
      }
    });
    
    expect(proposal.isValid).toBe(true);
    expect(proposal.meetsRequirements).toBe(true);
    expect(proposal.combinedCapabilities).toEqual(
      expect.arrayContaining(rfq.requirements)
    );
    
    // Notify all partners
    const partnerNotifications = await Promise.all([
      bestPartnership.leadPartner,
      ...bestPartnership.supportPartners
    ].map(partner => 
      mockNotificationService.send({
        businessId: partner.id,
        type: 'partnership_opportunity',
        rfqId: rfq.id,
        role: partner.id === bestPartnership.leadPartner.id ? 'lead' : 'support'
      })
    ));
    
    expect(partnerNotifications).toHaveLength(
      1 + bestPartnership.supportPartners.length
    );
    partnerNotifications.forEach(notif => {
      expect(notif.delivered).toBe(true);
    });
  });

  it('should track C-5 compliance impact', async () => {
    // Create government RFQs
    const rfqs = Array.from({ length: 10 }, (_, i) => ({
      id: `gov-rfq-${i}`,
      isGovernment: true,
      budget: 1000000 + (i * 500000),
      indigenousRequirement: i < 5, // 50% with requirement
      c5Compliance: true
    }));
    
    // Process all RFQs
    const results = await Promise.all(
      rfqs.map(rfq => matchingEngine.processNewRFQ(rfq))
    );
    
    // Calculate compliance metrics
    const metrics = {
      totalRFQs: rfqs.length,
      withIndigenousRequirement: rfqs.filter(r => r.indigenousRequirement).length,
      totalValue: rfqs.reduce((sum, r) => sum + r.budget, 0),
      indigenousAllocated: 0,
      nonIndigenousAllocated: 0
    };
    
    // Simulate awards (award to top match)
    for (let i = 0; i < results.length; i++) {
      const topMatch = results[i].matches[0];
      if (topMatch.isIndigenous) {
        metrics.indigenousAllocated += rfqs[i].budget;
      } else {
        metrics.nonIndigenousAllocated += rfqs[i].budget;
      }
    }
    
    const indigenousPercentage = 
      (metrics.indigenousAllocated / metrics.totalValue) * 100;
    
    expect(indigenousPercentage).toBeGreaterThan(5); // Should exceed C-5 requirement
    
    // Generate compliance report
    const report = {
      period: 'Q4 2025',
      totalContracts: metrics.totalRFQs,
      totalValue: metrics.totalValue,
      indigenousContracts: results.filter(r => r.matches[0].isIndigenous).length,
      indigenousValue: metrics.indigenousAllocated,
      compliancePercentage: indigenousPercentage,
      meetsC5: indigenousPercentage >= 5,
      recommendations: indigenousPercentage < 5 ? [
        'Increase Indigenous business requirements',
        'Partner with more Indigenous suppliers',
        'Use platform matching to find qualified Indigenous businesses'
      ] : ['Continue current procurement practices']
    };
    
    expect(report.meetsC5).toBe(true);
    expect(report.compliancePercentage).toBeGreaterThan(5);
  });
});