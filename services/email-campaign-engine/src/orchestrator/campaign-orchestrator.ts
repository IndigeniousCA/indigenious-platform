/**
 * Email Campaign Orchestrator
 * Manages 50K emails/day across multiple campaigns
 */

import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { createClient } from '@supabase/supabase-js';
import PQueue from 'p-queue';
import { 
  CAMPAIGN_CONFIG, 
  EMAIL_SEGMENTS, 
  CAMPAIGN_SEQUENCES,
  AB_TEST_VARIANTS 
} from '../config/campaigns';
import { EmailService } from '../services/email-service';
import { TemplateEngine } from '../services/template-engine';
import { MetricsTracker } from '../services/metrics-tracker';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env.local' });

// Initialize services
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class CampaignOrchestrator {
  private emailQueue: Queue;
  private worker: Worker;
  private events: QueueEvents;
  private concurrencyQueue: PQueue;
  private emailService: EmailService;
  private templateEngine: TemplateEngine;
  private metricsTracker: MetricsTracker;
  
  private stats = {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    claimed: 0,
    converted: 0,
    failed: 0,
    dailySent: 0,
    hourlySent: 0
  };

  constructor() {
    // Initialize BullMQ queue for email processing
    this.emailQueue = new Queue('email-campaigns', {
      connection: redis,
      defaultJobOptions: {
        attempts: CAMPAIGN_CONFIG.retry.attempts,
        backoff: {
          type: CAMPAIGN_CONFIG.retry.backoff,
          delay: CAMPAIGN_CONFIG.retry.delay
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    });

    // Initialize rate-limited queue
    this.concurrencyQueue = new PQueue({
      concurrency: CAMPAIGN_CONFIG.limits.perSecond,
      interval: 1000,
      intervalCap: CAMPAIGN_CONFIG.limits.perSecond
    });

    // Initialize services
    this.emailService = new EmailService();
    this.templateEngine = new TemplateEngine();
    this.metricsTracker = new MetricsTracker();

    // Setup worker
    this.setupWorker();
    
    // Setup event monitoring
    this.events = new QueueEvents('email-campaigns', { connection: redis });
    this.setupEventHandlers();
  }

  /**
   * Launch a campaign targeting specific segment
   */
  async launchCampaign(segmentKey: keyof typeof EMAIL_SEGMENTS, options?: {
    limit?: number;
    testMode?: boolean;
    abTest?: boolean;
  }) {
    console.log(`🚀 Launching campaign: ${segmentKey}`);
    const segment = EMAIL_SEGMENTS[segmentKey];
    
    try {
      // Check daily limits
      if (this.stats.dailySent >= CAMPAIGN_CONFIG.limits.daily) {
        console.log('⚠️ Daily limit reached. Campaign will resume tomorrow.');
        return { status: 'daily_limit_reached', sent: this.stats.dailySent };
      }

      // Fetch target businesses
      const businesses = await this.fetchTargetBusinesses(segment.query, options?.limit);
      console.log(`📊 Found ${businesses.length} businesses for segment: ${segment.name}`);

      if (businesses.length === 0) {
        return { status: 'no_targets', sent: 0 };
      }

      // Prepare email jobs
      const jobs = businesses.map(business => ({
        name: 'send-email',
        data: {
          businessId: business.id,
          email: business.email,
          businessName: business.name,
          template: segment.template,
          segment: segmentKey,
          priority: CAMPAIGN_CONFIG.templates[segment.template].priority,
          abTest: options?.abTest,
          metadata: {
            isIndigenous: business.is_indigenous,
            isC5Mandatory: business.c5_mandatory,
            employeeCount: business.employee_count,
            industry: business.industry,
            city: business.city,
            province: business.province
          }
        }
      }));

      // Add jobs to queue with priority
      const addedJobs = await this.emailQueue.addBulk(
        jobs.sort((a, b) => b.data.priority - a.data.priority)
      );

      console.log(`✅ Queued ${addedJobs.length} emails for delivery`);

      // Start processing
      if (!options?.testMode) {
        await this.startProcessing();
      }

      return {
        status: 'launched',
        queued: addedJobs.length,
        segment: segment.name,
        expectedConversion: Math.floor(addedJobs.length * segment.expectedConversion)
      };

    } catch (error) {
      console.error('❌ Campaign launch failed:', error);
      throw error;
    }
  }

  /**
   * Launch sequence campaign (drip campaign)
   */
  async launchSequence(sequenceKey: keyof typeof CAMPAIGN_SEQUENCES, segmentKey: keyof typeof EMAIL_SEGMENTS) {
    const sequence = CAMPAIGN_SEQUENCES[sequenceKey];
    const segment = EMAIL_SEGMENTS[segmentKey];
    
    console.log(`🔄 Launching sequence: ${sequence.name}`);
    
    // Get businesses for this segment
    const businesses = await this.fetchTargetBusinesses(segment.query);
    
    // Schedule emails for each business in the sequence
    for (const business of businesses) {
      for (const email of sequence.emails) {
        const deliveryTime = new Date();
        deliveryTime.setDate(deliveryTime.getDate() + email.day);
        
        await this.emailQueue.add(
          'send-sequence-email',
          {
            businessId: business.id,
            email: business.email,
            template: email.template,
            subject: email.subject,
            sequence: sequenceKey,
            sequenceDay: email.day,
            stopConditions: sequence.stopOnAction
          },
          {
            delay: deliveryTime.getTime() - Date.now(),
            priority: CAMPAIGN_CONFIG.priorities.HIGH
          }
        );
      }
    }
    
    console.log(`✅ Scheduled ${businesses.length * sequence.emails.length} emails in sequence`);
    
    return {
      status: 'sequence_scheduled',
      businesses: businesses.length,
      emails: sequence.emails.length,
      totalScheduled: businesses.length * sequence.emails.length
    };
  }

  /**
   * Setup worker to process email jobs
   */
  private setupWorker() {
    this.worker = new Worker(
      'email-campaigns',
      async (job) => {
        // Rate limiting
        await this.concurrencyQueue.add(async () => {
          // Check hourly limits
          if (this.stats.hourlySent >= CAMPAIGN_CONFIG.limits.hourly) {
            await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
            this.stats.hourlySent = 0;
          }

          // Process based on job type
          if (job.name === 'send-email') {
            return await this.sendCampaignEmail(job.data);
          } else if (job.name === 'send-sequence-email') {
            return await this.sendSequenceEmail(job.data);
          }
        });
      },
      {
        connection: redis,
        concurrency: CAMPAIGN_CONFIG.limits.batchSize
      }
    );

    this.worker.on('completed', (job) => {
      this.stats.sent++;
      this.stats.dailySent++;
      this.stats.hourlySent++;
      console.log(`✉️ Email sent: ${job.data.email} (${this.stats.dailySent}/${CAMPAIGN_CONFIG.limits.daily})`);
    });

    this.worker.on('failed', (job, err) => {
      this.stats.failed++;
      console.error(`❌ Email failed: ${job?.data.email}`, err);
    });
  }

  /**
   * Send individual campaign email
   */
  private async sendCampaignEmail(data: any) {
    try {
      // Get template
      const template = await this.templateEngine.getTemplate(data.template);
      
      // Apply A/B testing if enabled
      let subject = template.subject;
      let ctaText = 'Claim Your Profile';
      
      if (data.abTest) {
        // Randomly select variant
        const subjectVariants = AB_TEST_VARIANTS.subject_lines.urgency;
        subject = subjectVariants[Math.floor(Math.random() * subjectVariants.length)];
        
        const ctaVariants = AB_TEST_VARIANTS.cta_buttons.urgent;
        ctaText = ctaVariants[Math.floor(Math.random() * ctaVariants.length)];
      }
      
      // Personalize content
      const personalizedContent = await this.templateEngine.personalize(template.content, {
        businessName: data.businessName,
        claimUrl: `${process.env.NEXT_PUBLIC_APP_URL}/claim/${data.businessId}`,
        ctaText,
        ...data.metadata
      });
      
      // Send email
      const result = await this.emailService.send({
        to: data.email,
        subject,
        html: personalizedContent,
        tags: [data.segment, data.template],
        metadata: {
          businessId: data.businessId,
          campaign: data.template,
          segment: data.segment,
          abVariant: data.abTest ? 'test' : 'control'
        }
      });
      
      // Track metrics
      await this.metricsTracker.track('email_sent', {
        businessId: data.businessId,
        campaign: data.template,
        segment: data.segment
      });
      
      // Update business record
      await supabase
        .from('businesses')
        .update({
          last_email_sent: new Date().toISOString(),
          email_campaign_status: 'sent'
        })
        .eq('id', data.businessId);
      
      return result;
      
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send sequence email with stop condition checking
   */
  private async sendSequenceEmail(data: any) {
    // Check stop conditions
    const shouldStop = await this.checkStopConditions(data.businessId, data.stopConditions);
    
    if (shouldStop) {
      console.log(`🛑 Stopping sequence for ${data.email} - condition met`);
      return { status: 'stopped', reason: 'condition_met' };
    }
    
    // Send the email
    return await this.sendCampaignEmail(data);
  }

  /**
   * Check if sequence should stop
   */
  private async checkStopConditions(businessId: string, conditions: string[]) {
    const { data: business } = await supabase
      .from('businesses')
      .select('claimed, subscription_status')
      .eq('id', businessId)
      .single();
    
    if (!business) return false;
    
    // Check each condition
    for (const condition of conditions) {
      if (condition === 'profile_claimed' && business.claimed) return true;
      if (condition === 'subscription_started' && business.subscription_status === 'active') return true;
    }
    
    return false;
  }

  /**
   * Fetch businesses for targeting
   */
  private async fetchTargetBusinesses(query: any, limit?: number) {
    let supabaseQuery = supabase
      .from('businesses')
      .select('*')
      .eq('email_valid', true)
      .is('unsubscribed', false);
    
    // Apply query filters
    Object.entries(query).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'object' && value.gte) {
        supabaseQuery = supabaseQuery.gte(key, value.gte);
      } else if (typeof value === 'object' && value.lte) {
        supabaseQuery = supabaseQuery.lte(key, value.lte);
      } else {
        supabaseQuery = supabaseQuery.eq(key, value);
      }
    });
    
    // Apply limit
    if (limit) {
      supabaseQuery = supabaseQuery.limit(limit);
    } else {
      // Default to remaining daily capacity
      const remaining = CAMPAIGN_CONFIG.limits.daily - this.stats.dailySent;
      supabaseQuery = supabaseQuery.limit(remaining);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) {
      console.error('Error fetching businesses:', error);
      return [];
    }
    
    return data || [];
  }

  /**
   * Setup event handlers for monitoring
   */
  private setupEventHandlers() {
    this.events.on('completed', async ({ jobId, returnvalue }) => {
      await this.metricsTracker.track('email_delivered', { jobId });
    });
    
    this.events.on('failed', async ({ jobId, failedReason }) => {
      await this.metricsTracker.track('email_failed', { jobId, reason: failedReason });
    });
  }

  /**
   * Start processing emails
   */
  async startProcessing() {
    console.log('📬 Email processing started');
    // Worker starts automatically
  }

  /**
   * Get campaign statistics
   */
  async getStats() {
    const waiting = await this.emailQueue.getWaitingCount();
    const active = await this.emailQueue.getActiveCount();
    const completed = await this.emailQueue.getCompletedCount();
    const failed = await this.emailQueue.getFailedCount();
    
    return {
      queue: { waiting, active, completed, failed },
      campaign: this.stats,
      limits: {
        dailyRemaining: CAMPAIGN_CONFIG.limits.daily - this.stats.dailySent,
        hourlyRemaining: CAMPAIGN_CONFIG.limits.hourly - this.stats.hourlySent
      }
    };
  }

  /**
   * Reset daily counters (run at midnight)
   */
  async resetDailyCounters() {
    this.stats.dailySent = 0;
    this.stats.hourlySent = 0;
    console.log('📊 Daily counters reset');
  }
}

// Export singleton instance
export const campaignOrchestrator = new CampaignOrchestrator();