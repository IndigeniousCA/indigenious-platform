import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { EmailCampaignService } from '../../email-campaign/src/index';
import { mockResendClient } from '../mocks/resend';
import { mockSupabaseClient } from '../mocks/supabase';

describe('Email Campaign Service Integration', () => {
  let campaignService: EmailCampaignService;
  
  beforeAll(() => {
    campaignService = new EmailCampaignService({
      resend: mockResendClient,
      supabase: mockSupabaseClient,
      mode: 'test'
    });
  });

  afterAll(async () => {
    await campaignService.cleanup();
  });

  describe('Campaign Creation', () => {
    it('should create claim profile campaign', async () => {
      const campaign = await campaignService.createCampaign({
        name: 'Claim Your Profile - Service Sector',
        segment: 'service_sector',
        template: 'claim_profile',
        schedule: {
          startDate: '2025-09-01',
          dailyLimit: 50000,
          sendTime: '09:00'
        }
      });

      expect(campaign).toHaveProperty('campaignId');
      expect(campaign).toHaveProperty('status', 'scheduled');
      expect(campaign).toHaveProperty('totalRecipients');
      expect(campaign.totalRecipients).toBeGreaterThan(100000);
    });

    it('should create C-5 compliance alert campaign', async () => {
      const campaign = await campaignService.createCampaign({
        name: 'C-5 Compliance Alert',
        segment: 'government_contractors',
        template: 'c5_compliance_alert',
        personalização: {
          compliancePercentage: true,
          contractsAtRisk: true
        }
      });

      expect(campaign).toHaveProperty('template', 'c5_compliance_alert');
      expect(campaign).toHaveProperty('personalizationFields');
      expect(campaign.personalizationFields).toContain('compliancePercentage');
    });
  });

  describe('Segmentation', () => {
    it('should segment Indigenous businesses', async () => {
      const segment = await campaignService.createSegment({
        name: 'Verified Indigenous',
        criteria: {
          isIndigenous: true,
          verified: true
        }
      });

      expect(segment).toHaveProperty('count');
      expect(segment.count).toBeGreaterThan(40000);
      expect(segment).toHaveProperty('segmentId');
    });

    it('should segment by contract value', async () => {
      const segment = await campaignService.createSegment({
        name: 'High Value Contractors',
        criteria: {
          minContractValue: 1000000,
          contractsLastYear: { min: 5 }
        }
      });

      expect(segment.count).toBeGreaterThan(5000);
      expect(segment).toHaveProperty('averageContractValue');
    });

    it('should create dynamic segments', async () => {
      const segment = await campaignService.createDynamicSegment({
        name: 'At Risk for C-5',
        query: `
          SELECT * FROM businesses 
          WHERE is_government_contractor = true 
          AND indigenous_procurement_percentage < 5
          AND total_contract_value > 1000000
        `
      });

      expect(segment).toHaveProperty('isDynamic', true);
      expect(segment).toHaveProperty('refreshInterval', 3600);
    });
  });

  describe('Template Management', () => {
    it('should render personalized claim profile email', async () => {
      const rendered = await campaignService.renderTemplate('claim_profile', {
        businessName: 'Tech Solutions Inc',
        profileViews: 45,
        matchedRFQs: 12,
        estimatedRevenue: 250000
      });

      expect(rendered.html).toContain('Tech Solutions Inc');
      expect(rendered.html).toContain('45 companies have viewed');
      expect(rendered.html).toContain('12 matching RFQs');
      expect(rendered.subject).toBe('Tech Solutions Inc - Claim Your Profile (45 Views!)');
    });

    it('should render compliance alert with urgency', async () => {
      const rendered = await campaignService.renderTemplate('compliance_alert', {
        companyName: 'Gov Contractor Corp',
        currentPercentage: 2.3,
        contractsAtRisk: 5000000,
        deadline: '2025-12-31'
      });

      expect(rendered.html).toContain('URGENT: C-5 Compliance Alert');
      expect(rendered.html).toContain('2.3%');
      expect(rendered.html).toContain('$5M at risk');
      expect(rendered.priority).toBe('high');
    });
  });

  describe('Sending and Delivery', () => {
    it('should send batch of 1000 emails', async () => {
      const recipients = Array.from({ length: 1000 }, (_, i) => ({
        email: `business${i}@example.com`,
        data: { businessName: `Business ${i}` }
      }));

      const result = await campaignService.sendBatch({
        campaignId: 'campaign-001',
        recipients,
        template: 'claim_profile'
      });

      expect(result.sent).toBe(1000);
      expect(result.failed).toBe(0);
      expect(result.deliveryIds).toHaveLength(1000);
    });

    it('should respect rate limits', async () => {
      const batches = Array.from({ length: 60 }, (_, i) => 
        Array.from({ length: 1000 }, (_, j) => ({
          email: `batch${i}_user${j}@example.com`
        }))
      );

      const start = Date.now();
      const results = await Promise.all(
        batches.map(batch => campaignService.sendBatch({
          campaignId: 'campaign-002',
          recipients: batch,
          template: 'claim_profile'
        }))
      );
      const duration = Date.now() - start;

      expect(results).toHaveLength(60);
      expect(duration).toBeGreaterThan(60000); // Should take at least 1 minute due to rate limiting
      
      const totalSent = results.reduce((sum, r) => sum + r.sent, 0);
      expect(totalSent).toBeLessThanOrEqual(50000); // Daily limit
    });

    it('should handle bounces and retries', async () => {
      const recipients = [
        { email: 'valid@example.com' },
        { email: 'bounce@example.com' },
        { email: 'temporary-failure@example.com' }
      ];

      const result = await campaignService.sendWithRetry({
        recipients,
        maxRetries: 3
      });

      expect(result.successful).toContain('valid@example.com');
      expect(result.permanent_failures).toContain('bounce@example.com');
      expect(result.retried).toContain('temporary-failure@example.com');
    });
  });

  describe('Analytics and Tracking', () => {
    it('should track email opens', async () => {
      const trackingId = 'track-001';
      await campaignService.trackOpen(trackingId);

      const stats = await campaignService.getEmailStats(trackingId);
      
      expect(stats.opened).toBe(true);
      expect(stats.openCount).toBe(1);
      expect(stats.firstOpenedAt).toBeDefined();
    });

    it('should track click-through rates', async () => {
      const campaignId = 'campaign-003';
      
      await campaignService.trackClick(campaignId, 'claim-button');
      await campaignService.trackClick(campaignId, 'claim-button');
      await campaignService.trackClick(campaignId, 'learn-more');

      const stats = await campaignService.getCampaignStats(campaignId);

      expect(stats.clicks).toBe(3);
      expect(stats.uniqueClicks).toBe(2);
      expect(stats.clicksByLink['claim-button']).toBe(2);
      expect(stats.ctr).toBeGreaterThan(0);
    });

    it('should track conversions', async () => {
      const campaignId = 'campaign-004';
      
      await campaignService.trackConversion(campaignId, {
        businessId: 'biz-001',
        action: 'profile_claimed',
        value: 699
      });

      const conversions = await campaignService.getConversions(campaignId);

      expect(conversions.total).toBe(1);
      expect(conversions.totalValue).toBe(699);
      expect(conversions.conversionRate).toBeDefined();
    });
  });

  describe('A/B Testing', () => {
    it('should split test subject lines', async () => {
      const test = await campaignService.createABTest({
        campaignId: 'campaign-005',
        variants: [
          { name: 'A', subject: 'Claim Your Profile Now' },
          { name: 'B', subject: '45 Companies Viewed Your Profile' }
        ],
        sampleSize: 1000,
        metric: 'open_rate'
      });

      expect(test).toHaveProperty('testId');
      expect(test).toHaveProperty('variants');
      expect(test.variants).toHaveLength(2);
      expect(test).toHaveProperty('status', 'running');
    });

    it('should determine winning variant', async () => {
      const testId = 'test-001';
      
      // Simulate results
      await campaignService.recordTestResults(testId, {
        'A': { sent: 500, opens: 150 },
        'B': { sent: 500, opens: 225 }
      });

      const winner = await campaignService.determineWinner(testId);

      expect(winner).toHaveProperty('variant', 'B');
      expect(winner).toHaveProperty('confidence');
      expect(winner.confidence).toBeGreaterThan(0.95);
    });
  });

  describe('Compliance and Unsubscribes', () => {
    it('should handle unsubscribe requests', async () => {
      const result = await campaignService.unsubscribe({
        email: 'user@example.com',
        reason: 'not_interested'
      });

      expect(result).toHaveProperty('unsubscribed', true);
      expect(result).toHaveProperty('suppressionList');
      
      const canSend = await campaignService.canSendTo('user@example.com');
      expect(canSend).toBe(false);
    });

    it('should respect communication preferences', async () => {
      const preferences = {
        email: 'business@example.com',
        preferences: {
          marketing: false,
          transactional: true,
          compliance_alerts: true
        }
      };

      await campaignService.updatePreferences(preferences);

      const canSendMarketing = await campaignService.canSendCampaign('business@example.com', 'marketing');
      const canSendCompliance = await campaignService.canSendCampaign('business@example.com', 'compliance');

      expect(canSendMarketing).toBe(false);
      expect(canSendCompliance).toBe(true);
    });
  });
});