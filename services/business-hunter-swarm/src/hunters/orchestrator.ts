/**
 * Business Hunter Swarm Orchestrator
 * Coordinates 100+ agents to collect 500K businesses
 */

import { createClient } from '@supabase/supabase-js';
import PQueue from 'p-queue';
import { HUNTER_CONFIG, C5_MANDATORY_INDUSTRIES, PRIORITY_SCORING } from '../config';
import { CCABHunter } from './ccab-hunter';
import { LinkedInHunter } from './linkedin-hunter';
import { YellowPagesHunter } from './yellowpages-hunter';
import { GovernmentHunter } from './government-hunter';
import { EnrichmentService } from '../services/enrichment';
import { DeduplicationService } from '../services/deduplication';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env.local' });

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Business {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  industry?: string;
  employee_count?: number;
  revenue_estimate?: number;
  is_indigenous: boolean;
  indigenous_verified: boolean;
  indigenous_ownership_percentage?: number;
  band_affiliation?: string;
  certifications?: string[];
  priority_score: number;
  source: string;
  collected_at: Date;
  enriched: boolean;
  c5_mandatory: boolean;
}

export class BusinessHunterOrchestrator {
  private queue: PQueue;
  private hunters: Map<string, any>;
  private enrichmentService: EnrichmentService;
  private deduplicationService: DeduplicationService;
  private statistics = {
    total_collected: 0,
    indigenous_collected: 0,
    service_sector_collected: 0,
    government_contractors: 0,
    duplicates_removed: 0,
    enriched: 0,
    errors: 0
  };

  constructor() {
    this.queue = new PQueue({ 
      concurrency: HUNTER_CONFIG.hunters.concurrent_workers,
      interval: 60000, // 1 minute
      intervalCap: HUNTER_CONFIG.hunters.rate_limit
    });

    this.enrichmentService = new EnrichmentService();
    this.deduplicationService = new DeduplicationService();
    
    // Initialize hunters
    this.hunters = new Map([
      ['ccab', new CCABHunter()],
      ['linkedin', new LinkedInHunter()],
      ['yellowpages', new YellowPagesHunter()],
      ['government', new GovernmentHunter()]
    ]);
  }

  async deploySwarm() {
    console.log('🚀 Deploying Business Hunter Swarm');
    console.log('==================================');
    console.log(`Target: ${HUNTER_CONFIG.targets.total.toLocaleString()} businesses`);
    console.log(`Workers: ${HUNTER_CONFIG.hunters.concurrent_workers}`);
    console.log('');

    const startTime = Date.now();

    try {
      // Phase 1: Hunt Indigenous businesses (highest priority)
      console.log('📍 Phase 1: Hunting Indigenous businesses...');
      await this.huntIndigenousBusinesses();

      // Phase 2: Hunt government contractors (must comply with C-5)
      console.log('📍 Phase 2: Hunting government contractors...');
      await this.huntGovernmentContractors();

      // Phase 3: Hunt service sector (consulting, IT, construction)
      console.log('📍 Phase 3: Hunting service sector businesses...');
      await this.huntServiceSector();

      // Phase 4: Hunt general Canadian businesses
      console.log('📍 Phase 4: Hunting general Canadian businesses...');
      await this.huntGeneralBusinesses();

      // Phase 5: Enrich all businesses with AI
      console.log('📍 Phase 5: Enriching businesses with AI...');
      await this.enrichBusinesses();

      // Phase 6: Calculate priority scores
      console.log('📍 Phase 6: Calculating priority scores...');
      await this.calculatePriorityScores();

      const duration = (Date.now() - startTime) / 1000 / 60; // minutes
      
      console.log('');
      console.log('✅ Business Hunter Swarm Complete!');
      console.log('===================================');
      console.log(`Total collected: ${this.statistics.total_collected.toLocaleString()}`);
      console.log(`Indigenous: ${this.statistics.indigenous_collected.toLocaleString()}`);
      console.log(`Service sector: ${this.statistics.service_sector_collected.toLocaleString()}`);
      console.log(`Government contractors: ${this.statistics.government_contractors.toLocaleString()}`);
      console.log(`Duplicates removed: ${this.statistics.duplicates_removed.toLocaleString()}`);
      console.log(`Enriched: ${this.statistics.enriched.toLocaleString()}`);
      console.log(`Time taken: ${duration.toFixed(2)} minutes`);
      
      return this.statistics;
      
    } catch (error) {
      console.error('❌ Swarm deployment failed:', error);
      throw error;
    }
  }

  private async huntIndigenousBusinesses() {
    const tasks = [];

    // CCAB Certified businesses
    tasks.push(this.queue.add(async () => {
      const hunter = this.hunters.get('ccab');
      const businesses = await hunter.hunt();
      await this.saveBusinesses(businesses, 'ccab', true);
      return businesses.length;
    }));

    // LinkedIn Indigenous businesses
    tasks.push(this.queue.add(async () => {
      const hunter = this.hunters.get('linkedin');
      const businesses = await hunter.huntIndigenous();
      await this.saveBusinesses(businesses, 'linkedin', true);
      return businesses.length;
    }));

    const results = await Promise.all(tasks);
    const total = results.reduce((sum, count) => sum + count, 0);
    this.statistics.indigenous_collected += total;
    console.log(`  ✓ Collected ${total.toLocaleString()} Indigenous businesses`);
  }

  private async huntGovernmentContractors() {
    const hunter = this.hunters.get('government');
    const businesses = await hunter.huntContractors();
    
    // Mark these as C-5 mandatory
    const processedBusinesses = businesses.map(b => ({
      ...b,
      c5_mandatory: true,
      priority_score: PRIORITY_SCORING.government_contractor
    }));
    
    await this.saveBusinesses(processedBusinesses, 'government', false);
    this.statistics.government_contractors += businesses.length;
    console.log(`  ✓ Collected ${businesses.length.toLocaleString()} government contractors`);
  }

  private async huntServiceSector() {
    const tasks = [];
    
    // Target specific industries that must comply with C-5
    for (const industry of C5_MANDATORY_INDUSTRIES) {
      tasks.push(this.queue.add(async () => {
        const hunter = this.hunters.get('yellowpages');
        const businesses = await hunter.huntByIndustry(industry);
        
        // Mark service sector as high priority
        const processedBusinesses = businesses.map(b => ({
          ...b,
          c5_mandatory: true,
          priority_score: this.calculateServiceSectorScore(b)
        }));
        
        await this.saveBusinesses(processedBusinesses, 'yellowpages', false);
        return businesses.length;
      }));
    }
    
    const results = await Promise.all(tasks);
    const total = results.reduce((sum, count) => sum + count, 0);
    this.statistics.service_sector_collected += total;
    console.log(`  ✓ Collected ${total.toLocaleString()} service sector businesses`);
  }

  private async huntGeneralBusinesses() {
    const hunter = this.hunters.get('yellowpages');
    const businesses = await hunter.huntGeneral(
      HUNTER_CONFIG.targets.corporate
    );
    
    await this.saveBusinesses(businesses, 'yellowpages', false);
    console.log(`  ✓ Collected ${businesses.length.toLocaleString()} general businesses`);
  }

  private async saveBusinesses(businesses: any[], source: string, isIndigenous: boolean) {
    // Deduplicate
    const unique = await this.deduplicationService.deduplicate(businesses);
    this.statistics.duplicates_removed += businesses.length - unique.length;
    
    // Batch insert to Supabase
    const batches = [];
    for (let i = 0; i < unique.length; i += HUNTER_CONFIG.database.batch_insert_size) {
      batches.push(unique.slice(i, i + HUNTER_CONFIG.database.batch_insert_size));
    }
    
    for (const batch of batches) {
      const { error } = await supabase
        .from('businesses')
        .upsert(batch.map(b => ({
          ...b,
          source,
          is_indigenous: isIndigenous,
          collected_at: new Date().toISOString(),
          claimed: false,
          verified: false
        })), { onConflict: 'name,city' });
      
      if (error) {
        console.error('Error saving batch:', error);
        this.statistics.errors++;
      } else {
        this.statistics.total_collected += batch.length;
      }
    }
  }

  private async enrichBusinesses() {
    // Get unenriched businesses
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('enriched', false)
      .limit(10000);
    
    if (error || !businesses) {
      console.error('Error fetching businesses for enrichment:', error);
      return;
    }
    
    // Enrich in batches
    const enrichmentTasks = businesses.map(business => 
      this.queue.add(async () => {
        const enriched = await this.enrichmentService.enrich(business);
        
        const { error } = await supabase
          .from('businesses')
          .update({
            ...enriched,
            enriched: true,
            enriched_at: new Date().toISOString()
          })
          .eq('id', business.id);
        
        if (!error) {
          this.statistics.enriched++;
        }
      })
    );
    
    await Promise.all(enrichmentTasks);
    console.log(`  ✓ Enriched ${this.statistics.enriched.toLocaleString()} businesses`);
  }

  private async calculatePriorityScores() {
    // Update priority scores based on various factors
    const { error } = await supabase.rpc('calculate_priority_scores');
    
    if (error) {
      console.error('Error calculating priority scores:', error);
    } else {
      console.log('  ✓ Priority scores calculated');
    }
  }

  private calculateServiceSectorScore(business: any): number {
    // Large service companies get highest priority
    if (business.employee_count > 100) {
      return PRIORITY_SCORING.service_sector_large;
    } else if (business.employee_count > 20) {
      return PRIORITY_SCORING.service_sector_medium;
    } else {
      return PRIORITY_SCORING.service_sector_small;
    }
  }

  async getStatistics() {
    const { data, error } = await supabase
      .from('businesses')
      .select('is_indigenous, c5_mandatory, source', { count: 'exact' });
    
    if (error) {
      console.error('Error fetching statistics:', error);
      return null;
    }
    
    return {
      total: data?.length || 0,
      indigenous: data?.filter(b => b.is_indigenous).length || 0,
      c5_mandatory: data?.filter(b => b.c5_mandatory).length || 0,
      by_source: data?.reduce((acc, b) => {
        acc[b.source] = (acc[b.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

// Deploy the swarm if run directly
if (require.main === module) {
  const orchestrator = new BusinessHunterOrchestrator();
  orchestrator.deploySwarm()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}