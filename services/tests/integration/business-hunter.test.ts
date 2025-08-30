import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { BusinessHunterService } from '../../business-hunter/src/index';
import { mockSupabaseClient } from '../mocks/supabase';
import { mockEmailService } from '../mocks/email';

describe('Business Hunter Service Integration', () => {
  let hunterService: BusinessHunterService;
  
  beforeAll(() => {
    hunterService = new BusinessHunterService({
      supabase: mockSupabaseClient,
      email: mockEmailService,
      mode: 'test'
    });
  });

  afterAll(async () => {
    await hunterService.cleanup();
  });

  describe('Business Discovery', () => {
    it('should discover Indigenous businesses from CCAB', async () => {
      const results = await hunterService.huntIndigenousBusinesses({
        source: 'ccab',
        limit: 100
      });

      expect(results).toBeDefined();
      expect(results.businesses).toHaveLength(100);
      expect(results.businesses[0]).toHaveProperty('name');
      expect(results.businesses[0]).toHaveProperty('isIndigenous', true);
      expect(results.businesses[0]).toHaveProperty('certifications');
    });

    it('should discover government contractors', async () => {
      const results = await hunterService.huntGovernmentContractors({
        limit: 50,
        minContractValue: 100000
      });

      expect(results.contractors).toHaveLength(50);
      expect(results.contractors[0]).toHaveProperty('contractHistory');
      expect(results.contractors[0].contractHistory.length).toBeGreaterThan(0);
    });

    it('should discover service sector businesses', async () => {
      const results = await hunterService.huntServiceSector({
        sectors: ['consulting', 'IT', 'construction'],
        limit: 200
      });

      expect(results.businesses).toHaveLength(200);
      expect(results.businesses[0]).toHaveProperty('sector');
      expect(['consulting', 'IT', 'construction']).toContain(results.businesses[0].sector);
    });
  });

  describe('Data Enrichment', () => {
    it('should enrich business with contact information', async () => {
      const business = {
        id: 'test-123',
        name: 'Test Indigenous Corp',
        website: 'https://example.com'
      };

      const enriched = await hunterService.enrichBusiness(business);

      expect(enriched).toHaveProperty('contacts');
      expect(enriched.contacts).toHaveLength(3);
      expect(enriched.contacts[0]).toHaveProperty('email');
      expect(enriched.contacts[0]).toHaveProperty('role');
    });

    it('should enrich with social profiles', async () => {
      const business = {
        id: 'test-456',
        name: 'Test Business'
      };

      const enriched = await hunterService.enrichWithSocial(business);

      expect(enriched).toHaveProperty('socialProfiles');
      expect(enriched.socialProfiles).toHaveProperty('linkedin');
      expect(enriched.socialProfiles).toHaveProperty('twitter');
    });
  });

  describe('Bulk Operations', () => {
    it('should handle bulk business import', async () => {
      const businesses = Array.from({ length: 1000 }, (_, i) => ({
        name: `Business ${i}`,
        email: `contact${i}@example.com`,
        isIndigenous: i % 10 === 0
      }));

      const result = await hunterService.bulkImport(businesses);

      expect(result.imported).toBe(1000);
      expect(result.failed).toBe(0);
      expect(result.duplicates).toBeDefined();
    });

    it('should handle rate limiting gracefully', async () => {
      const promises = Array.from({ length: 100 }, () => 
        hunterService.huntIndigenousBusinesses({ source: 'linkedin', limit: 10 })
      );

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(100);
      results.forEach(result => {
        expect(result.error).toBeUndefined();
      });
    });
  });

  describe('Campaign Integration', () => {
    it('should trigger claim profile campaign after discovery', async () => {
      const businesses = await hunterService.huntAndCampaign({
        source: 'ccab',
        limit: 50,
        campaignEnabled: true
      });

      expect(businesses.discovered).toBe(50);
      expect(businesses.emailsSent).toBe(50);
      expect(businesses.campaignId).toBeDefined();
    });
  });
});