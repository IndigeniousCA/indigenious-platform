/**
 * RFQ Matching Engine Test
 * Test the complete matching system
 */

import { rfqMatchingEngine } from './index';

async function testRFQMatching() {
  console.log('🧪 Testing RFQ Matching Engine...\n');

  try {
    // Initialize engine
    await rfqMatchingEngine.initialize();
    console.log('');

    // Test 1: Process new RFQ
    console.log('📋 Test 1: Processing new RFQ');
    console.log('================================');
    
    const testRFQ = {
      id: 'rfq_test_1',
      title: 'Cloud Infrastructure Migration',
      industry: 'IT Services',
      location: { province: 'ON', city: 'Toronto' },
      estimated_value: 750000,
      budget_range: { min: 600000, max: 900000 },
      requiresIndigenous: true,
      required_certifications: ['ISO9001'],
      min_years_experience: 5,
      complexity: 'high',
      closing_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open'
    };

    const rfqResult = await rfqMatchingEngine.processNewRFQ(testRFQ);
    
    console.log(`\n📊 RFQ Processing Results:`);
    console.log(`   • Total matches found: ${rfqResult.matches}`);
    console.log(`   • Businesses notified: ${rfqResult.notified}`);
    console.log(`   • Partnerships identified: ${rfqResult.partnerships}`);
    
    if (rfqResult.topMatches.length > 0) {
      console.log(`\n   Top Matches:`);
      rfqResult.topMatches.forEach((match: any, index: number) => {
        console.log(`   ${index + 1}. ${match.businessName} - Score: ${match.score}%`);
        if (match.strengths?.length > 0) {
          console.log(`      Strengths: ${match.strengths[0]}`);
        }
      });
    }

    // Test 2: Match business to RFQs
    console.log('\n\n🎯 Test 2: Matching Business to RFQs');
    console.log('=====================================');
    
    const businessMatches = await rfqMatchingEngine.matchBusinessToRFQs('bus_1', {
      limit: 5,
      minScore: 60
    });
    
    console.log(`\n📊 Business Matching Results:`);
    console.log(`   • Found ${businessMatches.length} matching RFQs\n`);
    
    businessMatches.forEach((match: any, index: number) => {
      console.log(`   ${index + 1}. ${match.rfq.title}`);
      console.log(`      • Overall Score: ${Math.round(match.overall)}%`);
      console.log(`      • Win Probability: ${Math.round(match.winProbability * 100)}%`);
      
      if (match.bidAssistance?.pricing) {
        console.log(`      • Recommended Price: $${match.bidAssistance.pricing.recommended.optimal.toLocaleString()}`);
      }
      
      if (match.strengths?.length > 0) {
        console.log(`      • Key Strength: ${match.strengths[0]}`);
      }
      
      if (match.recommendations?.length > 0) {
        console.log(`      • Recommendation: ${match.recommendations[0]}`);
      }
      console.log('');
    });

    // Test 3: Get bid assistance
    console.log('\n📝 Test 3: Comprehensive Bid Assistance');
    console.log('========================================');
    
    const bidAssistance = await rfqMatchingEngine.getBidAssistance('bus_1', 'rfq_test_1');
    
    console.log(`\n📊 Bid Assistance Summary:`);
    console.log(`   • Opportunity Score: ${bidAssistance.executive_summary.opportunity_score}%`);
    console.log(`   • Win Probability: ${Math.round(bidAssistance.executive_summary.win_probability * 100)}%`);
    
    console.log(`\n💰 Pricing Strategy:`);
    console.log(`   • Recommended Range: $${bidAssistance.pricing_strategy.recommended_range.min.toLocaleString()} - $${bidAssistance.pricing_strategy.recommended_range.max.toLocaleString()}`);
    console.log(`   • Sweet Spot: $${bidAssistance.pricing_strategy.sweet_spot.toLocaleString()}`);
    console.log(`   • Position: ${bidAssistance.pricing_strategy.competitive_analysis}`);
    
    console.log(`\n📋 Proposal Structure:`);
    bidAssistance.proposal_guidance.outline.slice(0, 3).forEach((section: any) => {
      console.log(`   • ${section.section} (${section.pages} pages)`);
    });
    
    console.log(`\n🎯 Key Differentiators:`);
    bidAssistance.proposal_guidance.differentiators.slice(0, 3).forEach((diff: string) => {
      console.log(`   • ${diff}`);
    });
    
    console.log(`\n⚡ Immediate Actions:`);
    bidAssistance.action_plan.immediate_actions.forEach((action: string) => {
      console.log(`   • ${action}`);
    });

    // Test 4: Get analytics
    console.log('\n\n📈 Test 4: Platform Analytics');
    console.log('==============================');
    
    const analytics = await rfqMatchingEngine.getAnalytics();
    
    console.log(`\n📊 Platform Metrics:`);
    console.log(`   • Total RFQs: ${analytics.totalRFQs}`);
    console.log(`   • Total Matches: ${analytics.totalMatches}`);
    console.log(`   • Average Match Score: ${analytics.averageMatchScore}%`);
    console.log(`   • Partnership Success Rate: ${analytics.partnershipSuccess}%`);
    
    console.log(`\n📊 Top RFQ Categories:`);
    analytics.topCategories.forEach((cat: any) => {
      console.log(`   • ${cat.category}: ${cat.count} RFQs (${cat.percentage}%)`);
    });

    console.log('\n\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Run tests
testRFQMatching();