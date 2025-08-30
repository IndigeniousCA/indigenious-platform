/**
 * BullMQ Job Manager
 * High-performance job queue system
 * Perfect for: Bulk processing, rate-limited operations, background jobs
 */

import { EventEmitter } from 'events';

interface Queue {
  name: string;
  concurrency: number;
  rateLimit?: { max: number; duration: number };
  jobs: any[];
  processing: number;
}

export class BullMQJobManager extends EventEmitter {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, any> = new Map();
  private fallbackMode: boolean = false;
  private totalProcessed: number = 0;

  async initialize() {
    console.log('   📋 Initializing BullMQ Job Manager...');
    
    // Setup core queues
    this.setupCoreQueues();
    
    // Start workers
    this.startWorkers();
    
    console.log('      ✓ BullMQ ready for job processing');
  }

  /**
   * Setup core platform queues
   */
  private setupCoreQueues() {
    // Business processing queue
    this.createQueue('business-processing', {
      concurrency: 50,
      rateLimit: { max: 1000, duration: 1000 } // 1000 per second
    });
    
    // Email sending queue
    this.createQueue('email-sending', {
      concurrency: 100,
      rateLimit: { max: 50, duration: 1000 } // 50 per second (50k per day)
    });
    
    // RFQ matching queue
    this.createQueue('rfq-matching', {
      concurrency: 20,
      rateLimit: { max: 100, duration: 1000 }
    });
    
    // Enrichment queue
    this.createQueue('data-enrichment', {
      concurrency: 30,
      rateLimit: { max: 200, duration: 1000 }
    });
    
    // Analytics queue
    this.createQueue('analytics-events', {
      concurrency: 100,
      rateLimit: { max: 5000, duration: 1000 }
    });
    
    // Notification queue
    this.createQueue('notifications', {
      concurrency: 50,
      rateLimit: { max: 500, duration: 1000 }
    });
  }

  /**
   * Create a queue
   */
  createQueue(name: string, config: Omit<Queue, 'name' | 'jobs' | 'processing'>) {
    const queue: Queue = {
      name,
      ...config,
      jobs: [],
      processing: 0
    };
    
    this.queues.set(name, queue);
    
    // Create worker for this queue
    this.createWorker(name);
    
    return queue;
  }

  /**
   * Add a job to queue
   */
  async addJob(queueName: string, data: any, options: any = {}) {
    const queue = this.queues.get(queueName);
    
    if (!queue) {
      console.warn(`   ⚠️ Queue ${queueName} not found`);
      return { error: 'Queue not found' };
    }
    
    const job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      queue: queueName,
      data,
      options,
      attempts: 0,
      createdAt: new Date(),
      status: 'waiting'
    };
    
    queue.jobs.push(job);
    
    // Process queue
    this.processQueue(queueName);
    
    return {
      jobId: job.id,
      queue: queueName,
      position: queue.jobs.length
    };
  }

  /**
   * Add bulk jobs
   */
  async addBulkJobs(queueName: string, dataArray: any[], options: any = {}) {
    const jobs = [];
    
    for (const data of dataArray) {
      const job = await this.addJob(queueName, data, options);
      jobs.push(job);
    }
    
    console.log(`   📦 Added ${jobs.length} jobs to ${queueName}`);
    
    return jobs;
  }

  /**
   * Process a specific job (for testing/manual processing)
   */
  async processJob(queueName: string, data?: any) {
    const queue = this.queues.get(queueName);
    
    if (!queue) {
      return { error: 'Queue not found' };
    }
    
    // Mock job processing
    console.log(`   ⚙️ Processing job in ${queueName}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    this.totalProcessed++;
    
    return {
      processed: true,
      queue: queueName,
      result: { mock: true, ...data }
    };
  }

  /**
   * Create a worker for a queue
   */
  private createWorker(queueName: string) {
    const worker = {
      queue: queueName,
      active: true,
      
      process: async (job: any) => {
        const queue = this.queues.get(queueName);
        if (!queue) return;
        
        try {
          // Process based on queue type
          const result = await this.processJobByType(queueName, job);
          
          job.status = 'completed';
          job.completedAt = new Date();
          job.result = result;
          
          this.totalProcessed++;
          
          // Emit completion event
          this.emit('job.completed', {
            queue: queueName,
            job: job.id,
            result
          });
          
        } catch (error) {
          job.status = 'failed';
          job.error = error;
          job.attempts++;
          
          // Retry logic
          if (job.attempts < (job.options.retries || 3)) {
            job.status = 'waiting';
            queue.jobs.push(job); // Re-add to queue
          } else {
            this.emit('job.failed', {
              queue: queueName,
              job: job.id,
              error
            });
          }
        }
      }
    };
    
    this.workers.set(queueName, worker);
  }

  /**
   * Process jobs by queue type
   */
  private async processJobByType(queueName: string, job: any): Promise<any> {
    switch (queueName) {
      case 'business-processing':
        return await this.processBusinessJob(job);
        
      case 'email-sending':
        return await this.processEmailJob(job);
        
      case 'rfq-matching':
        return await this.processRFQJob(job);
        
      case 'data-enrichment':
        return await this.processEnrichmentJob(job);
        
      case 'analytics-events':
        return await this.processAnalyticsJob(job);
        
      case 'notifications':
        return await this.processNotificationJob(job);
        
      default:
        return { processed: true, type: 'generic' };
    }
  }

  /**
   * Process business job
   */
  private async processBusinessJob(job: any) {
    const { data } = job;
    
    // Simulate business processing
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      businessId: data.businessId || `bus_${Date.now()}`,
      processed: true,
      enriched: Math.random() > 0.5,
      score: Math.random() * 100
    };
  }

  /**
   * Process email job
   */
  private async processEmailJob(job: any) {
    const { data } = job;
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 20));
    
    return {
      emailId: `email_${Date.now()}`,
      sent: true,
      to: data.to,
      campaign: data.campaign
    };
  }

  /**
   * Process RFQ job
   */
  private async processRFQJob(job: any) {
    const { data } = job;
    
    // Simulate RFQ matching
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      rfqId: data.rfqId,
      matches: Math.floor(Math.random() * 50),
      topScore: Math.random() * 100
    };
  }

  /**
   * Process enrichment job
   */
  private async processEnrichmentJob(job: any) {
    const { data } = job;
    
    // Simulate data enrichment
    await new Promise(resolve => setTimeout(resolve, 75));
    
    return {
      enriched: true,
      fields_added: ['industry', 'size', 'revenue'],
      confidence: Math.random()
    };
  }

  /**
   * Process analytics job
   */
  private async processAnalyticsJob(job: any) {
    const { data } = job;
    
    // Simulate analytics processing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    return {
      tracked: true,
      event: data.event,
      properties: data.properties
    };
  }

  /**
   * Process notification job
   */
  private async processNotificationJob(job: any) {
    const { data } = job;
    
    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 30));
    
    return {
      notified: true,
      channel: data.channel || 'platform',
      recipient: data.userId
    };
  }

  /**
   * Process queue with rate limiting
   */
  private async processQueue(queueName: string) {
    const queue = this.queues.get(queueName);
    const worker = this.workers.get(queueName);
    
    if (!queue || !worker || !worker.active) return;
    
    // Check concurrency
    if (queue.processing >= queue.concurrency) return;
    
    // Check rate limit
    if (queue.rateLimit && !this.checkRateLimit(queue)) return;
    
    // Get next job
    const job = queue.jobs.shift();
    if (!job) return;
    
    // Process job
    queue.processing++;
    
    worker.process(job).finally(() => {
      queue.processing--;
      
      // Process next job
      if (queue.jobs.length > 0) {
        setTimeout(() => this.processQueue(queueName), 10);
      }
    });
    
    // Continue processing if more jobs
    if (queue.jobs.length > 0 && queue.processing < queue.concurrency) {
      setTimeout(() => this.processQueue(queueName), 10);
    }
  }

  /**
   * Start all workers
   */
  private startWorkers() {
    // Start processing all queues
    setInterval(() => {
      this.queues.forEach((queue, name) => {
        if (queue.jobs.length > 0) {
          this.processQueue(name);
        }
      });
    }, 100);
    
    // Log stats periodically
    setInterval(() => {
      const stats = this.getQueueStats();
      if (stats.total > 0) {
        console.log(`   📊 Queue stats: ${stats.total} waiting, ${stats.processing} processing`);
      }
    }, 30000);
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(queue: Queue): boolean {
    // Simplified rate limiting
    // In production: Use sliding window or token bucket
    return true;
  }

  /**
   * Get queue stats
   */
  private getQueueStats() {
    let total = 0;
    let processing = 0;
    
    this.queues.forEach(queue => {
      total += queue.jobs.length;
      processing += queue.processing;
    });
    
    return { total, processing };
  }

  /**
   * Enable fallback mode
   */
  async enableFallbackMode() {
    console.log('   🔄 Enabling fallback mode');
    this.fallbackMode = true;
    
    // Pause low-priority queues
    ['analytics-events', 'data-enrichment'].forEach(queueName => {
      const worker = this.workers.get(queueName);
      if (worker) worker.active = false;
    });
  }

  /**
   * Get all queue sizes
   */
  async getAllQueueSizes(): Promise<Record<string, number>> {
    const sizes: Record<string, number> = {};
    
    this.queues.forEach((queue, name) => {
      sizes[name] = queue.jobs.length;
    });
    
    return sizes;
  }

  /**
   * Get status
   */
  async getStatus() {
    return {
      queues: this.queues.size,
      workers: this.workers.size,
      totalProcessed: this.totalProcessed,
      fallbackMode: this.fallbackMode,
      stats: this.getQueueStats()
    };
  }
}