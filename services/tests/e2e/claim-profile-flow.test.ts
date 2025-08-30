import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { BusinessHunterService } from '../../business-hunter/src/index';
import { EmailCampaignService } from '../../email-campaign/src/index';
import { mockSupabaseClient } from '../mocks/supabase';
import { mockResendClient } from '../mocks/email';

describe('E2E: Claim Profile Flow', () => {
  let hunterService: BusinessHunterService;
  let campaignService: EmailCampaignService;
  
  beforeAll(async () => {
    hunterService = new BusinessHunterService({
      supabase: mockSupabaseClient,
      mode: 'test'
    });
    
    campaignService = new EmailCampaignService({
      resend: mockResendClient,
      supabase: mockSupabaseClient,
      mode: 'test'
    });
  });

  afterAll(async () => {
    await hunterService.cleanup();
    await campaignService.cleanup();
  });

  it('should complete full claim profile journey', async () => {
    // Step 1: Hunt and discover businesses
    const discovered = await hunterService.huntServiceSector({
      sectors: ['IT'],
      limit: 100
    });
    
    expect(discovered.businesses).toHaveLength(100);
    
    // Step 2: Enrich with contact information
    const enriched = await Promise.all(
      discovered.businesses.slice(0, 10).map(biz => 
        hunterService.enrichBusiness(biz)
      )
    );
    
    expect(enriched[0].contacts).toBeDefined();
    expect(enriched[0].contacts.length).toBeGreaterThan(0);
    
    // Step 3: Create and send claim profile campaign
    const campaign = await campaignService.createCampaign({
      name: 'Claim Your Profile - IT Sector',
      segment: 'it_sector',
      template: 'claim_profile'
    });
    
    expect(campaign.campaignId).toBeDefined();
    
    // Step 4: Send emails to discovered businesses
    const emailBatch = enriched.map(biz => ({
      email: biz.contacts[0].email,
      data: {
        businessName: biz.name,
        profileViews: Math.floor(Math.random() * 100),
        matchedRFQs: Math.floor(Math.random() * 20)
      }
    }));
    
    const sent = await campaignService.sendBatch({
      campaignId: campaign.campaignId,
      recipients: emailBatch,
      template: 'claim_profile'
    });
    
    expect(sent.sent).toBe(10);
    expect(sent.failed).toBe(0);
    
    // Step 5: Simulate user clicking claim link
    const claimToken = 'claim-token-123';
    const claimData = {
      businessId: enriched[0].id,
      email: enriched[0].contacts[0].email,
      token: claimToken
    };
    
    // Step 6: Verify business ownership
    const verification = await mockSupabaseClient.rpc('verify_business_claim', claimData);
    expect(verification.data).toBeDefined();
    
    // Step 7: Create user account
    const signUp = await mockSupabaseClient.auth.signUp({
      email: claimData.email,
      password: 'Test123!@#'
    });
    
    expect(signUp.data.user).toBeDefined();
    expect(signUp.data.session).toBeDefined();
    
    // Step 8: Link business to user
    const linked = await mockSupabaseClient.from('business_users').insert({
      business_id: claimData.businessId,
      user_id: signUp.data.user?.id,
      role: 'owner',
      claimed_at: new Date().toISOString()
    });
    
    expect(linked.error).toBeNull();
    
    // Step 9: Update business as claimed
    const updated = await mockSupabaseClient.from('businesses').update({
      claimed: true,
      claimed_by: signUp.data.user?.id,
      claimed_at: new Date().toISOString()
    }).eq('id', claimData.businessId);
    
    expect(updated.error).toBeNull();
    
    // Step 10: Send welcome email
    const welcomeEmail = await campaignService.renderTemplate('welcome_claimed', {
      businessName: enriched[0].name,
      userName: claimData.email.split('@')[0]
    });
    
    expect(welcomeEmail.html).toContain('Welcome');
    
    // Step 11: Track conversion
    const conversion = await campaignService.trackConversion(campaign.campaignId, {
      businessId: claimData.businessId,
      action: 'profile_claimed',
      value: 0 // Free for now
    });
    
    expect(conversion).toBeDefined();
  });

  it('should handle Indigenous business claim with free tier', async () => {
    // Hunt Indigenous businesses
    const indigenous = await hunterService.huntIndigenousBusinesses({
      source: 'ccab',
      limit: 10
    });
    
    expect(indigenous.businesses[0].isIndigenous).toBe(true);
    
    // Send claim campaign
    const campaign = await campaignService.createCampaign({
      name: 'Indigenous Business - Free Forever',
      segment: 'indigenous_verified',
      template: 'indigenous_claim'
    });
    
    const sent = await campaignService.sendBatch({
      campaignId: campaign.campaignId,
      recipients: [{
        email: indigenous.businesses[0].email,
        data: {
          businessName: indigenous.businesses[0].name,
          freeForever: true
        }
      }],
      template: 'indigenous_claim'
    });
    
    expect(sent.sent).toBe(1);
    
    // Simulate claim and verify Indigenous status
    const verification = await mockSupabaseClient.rpc('verify_indigenous_business', {
      businessId: indigenous.businesses[0].id,
      certifications: indigenous.businesses[0].certifications
    });
    
    expect(verification.data).toEqual({
      verified: true,
      tier: 'indigenous_free',
      price: 0
    });
  });

  it('should track claim rate metrics', async () => {
    // Create test campaign
    const campaign = await campaignService.createCampaign({
      name: 'Test Claim Rate',
      segment: 'test',
      template: 'claim_profile'
    });
    
    // Send 100 emails
    const recipients = Array.from({ length: 100 }, (_, i) => ({
      email: `business${i}@test.com`,
      data: { businessName: `Business ${i}` }
    }));
    
    await campaignService.sendBatch({
      campaignId: campaign.campaignId,
      recipients,
      template: 'claim_profile'
    });
    
    // Simulate 20% claim rate (20 businesses claim)
    const claimPromises = Array.from({ length: 20 }, (_, i) => 
      campaignService.trackConversion(campaign.campaignId, {
        businessId: `biz-${i}`,
        action: 'profile_claimed'
      })
    );
    
    await Promise.all(claimPromises);
    
    // Get campaign stats
    const stats = await campaignService.getCampaignStats(campaign.campaignId);
    
    expect(stats.sent).toBe(100);
    expect(stats.conversions).toBe(20);
    expect(stats.conversionRate).toBeCloseTo(0.20, 2);
  });
});