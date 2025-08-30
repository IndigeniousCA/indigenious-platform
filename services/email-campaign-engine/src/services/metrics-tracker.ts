/**
 * Metrics Tracker
 * Tracks email campaign performance metrics
 */

import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
  claimed: number;
  converted: number;
}

export class MetricsTracker {
  private supabase: any;
  private redis: Redis | null = null;
  private metrics: Map<string, EmailMetrics> = new Map();

  constructor() {
    // Initialize Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }

    // Initialize Redis if available
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
    }
  }

  /**
   * Track an email event
   */
  async track(event: string, data: Record<string, any>): Promise<void> {
    const timestamp = new Date().toISOString();
    
    try {
      // Update in-memory metrics
      this.updateMetrics(event, data);

      // Store in Redis for real-time access
      if (this.redis) {
        await this.trackInRedis(event, data, timestamp);
      }

      // Store in Supabase for persistence
      if (this.supabase) {
        await this.trackInSupabase(event, data, timestamp);
      }

      // Log for debugging
      console.log(`📊 Tracked: ${event}`, {
        businessId: data.businessId,
        campaign: data.campaign,
        timestamp
      });

    } catch (error) {
      console.error('❌ Metrics tracking error:', error);
    }
  }

  /**
   * Update in-memory metrics
   */
  private updateMetrics(event: string, data: Record<string, any>) {
    const campaign = data.campaign || 'default';
    
    if (!this.metrics.has(campaign)) {
      this.metrics.set(campaign, {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        complained: 0,
        unsubscribed: 0,
        claimed: 0,
        converted: 0
      });
    }

    const metrics = this.metrics.get(campaign)!;

    switch (event) {
      case 'email_sent':
        metrics.sent++;
        break;
      case 'email_delivered':
        metrics.delivered++;
        break;
      case 'email_opened':
        metrics.opened++;
        break;
      case 'email_clicked':
        metrics.clicked++;
        break;
      case 'email_bounced':
        metrics.bounced++;
        break;
      case 'email_complained':
        metrics.complained++;
        break;
      case 'email_unsubscribed':
        metrics.unsubscribed++;
        break;
      case 'profile_claimed':
        metrics.claimed++;
        break;
      case 'subscription_started':
        metrics.converted++;
        break;
    }
  }

  /**
   * Track in Redis for real-time metrics
   */
  private async trackInRedis(event: string, data: Record<string, any>, timestamp: string) {
    if (!this.redis) return;

    const key = `metrics:${event}:${data.campaign || 'default'}`;
    const hourKey = `metrics:hourly:${new Date().getHours()}`;
    const dailyKey = `metrics:daily:${new Date().toISOString().split('T')[0]}`;

    // Increment counters
    await this.redis.hincrby(key, 'total', 1);
    await this.redis.hincrby(hourKey, event, 1);
    await this.redis.hincrby(dailyKey, event, 1);

    // Store event details
    await this.redis.zadd(
      `events:${event}`,
      Date.now(),
      JSON.stringify({ ...data, timestamp })
    );

    // Set expiry for hourly metrics (24 hours)
    await this.redis.expire(hourKey, 86400);

    // Set expiry for daily metrics (30 days)
    await this.redis.expire(dailyKey, 2592000);
  }

  /**
   * Track in Supabase for persistence
   */
  private async trackInSupabase(event: string, data: Record<string, any>, timestamp: string) {
    if (!this.supabase) return;

    await this.supabase
      .from('email_events')
      .insert({
        event_type: event,
        business_id: data.businessId,
        campaign: data.campaign,
        segment: data.segment,
        email: data.email,
        metadata: data,
        created_at: timestamp
      });

    // Update campaign statistics
    await this.supabase
      .from('campaign_stats')
      .upsert({
        campaign: data.campaign || 'default',
        date: new Date().toISOString().split('T')[0],
        [event.replace('email_', '')]: this.supabase.raw('COALESCE(' + event.replace('email_', '') + ', 0) + 1'),
        updated_at: timestamp
      }, {
        onConflict: 'campaign,date'
      });
  }

  /**
   * Get metrics for a campaign
   */
  async getMetrics(campaign: string = 'default'): Promise<EmailMetrics> {
    // Try Redis first for real-time data
    if (this.redis) {
      const redisMetrics = await this.getRedisMetrics(campaign);
      if (redisMetrics) return redisMetrics;
    }

    // Fall back to in-memory
    if (this.metrics.has(campaign)) {
      return this.metrics.get(campaign)!;
    }

    // Fall back to Supabase
    if (this.supabase) {
      return await this.getSupabaseMetrics(campaign);
    }

    // Return empty metrics
    return {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      complained: 0,
      unsubscribed: 0,
      claimed: 0,
      converted: 0
    };
  }

  /**
   * Get metrics from Redis
   */
  private async getRedisMetrics(campaign: string): Promise<EmailMetrics | null> {
    if (!this.redis) return null;

    try {
      const keys = [
        'email_sent', 'email_delivered', 'email_opened', 'email_clicked',
        'email_bounced', 'email_complained', 'email_unsubscribed',
        'profile_claimed', 'subscription_started'
      ];

      const values = await Promise.all(
        keys.map(key => this.redis!.hget(`metrics:${key}:${campaign}`, 'total'))
      );

      return {
        sent: parseInt(values[0] || '0'),
        delivered: parseInt(values[1] || '0'),
        opened: parseInt(values[2] || '0'),
        clicked: parseInt(values[3] || '0'),
        bounced: parseInt(values[4] || '0'),
        complained: parseInt(values[5] || '0'),
        unsubscribed: parseInt(values[6] || '0'),
        claimed: parseInt(values[7] || '0'),
        converted: parseInt(values[8] || '0')
      };
    } catch (error) {
      console.error('Redis metrics error:', error);
      return null;
    }
  }

  /**
   * Get metrics from Supabase
   */
  private async getSupabaseMetrics(campaign: string): Promise<EmailMetrics> {
    if (!this.supabase) {
      return {
        sent: 0, delivered: 0, opened: 0, clicked: 0,
        bounced: 0, complained: 0, unsubscribed: 0,
        claimed: 0, converted: 0
      };
    }

    try {
      const { data } = await this.supabase
        .from('campaign_stats')
        .select('*')
        .eq('campaign', campaign);

      if (!data || data.length === 0) {
        return {
          sent: 0, delivered: 0, opened: 0, clicked: 0,
          bounced: 0, complained: 0, unsubscribed: 0,
          claimed: 0, converted: 0
        };
      }

      // Aggregate all daily stats
      return data.reduce((acc: EmailMetrics, row: any) => ({
        sent: acc.sent + (row.sent || 0),
        delivered: acc.delivered + (row.delivered || 0),
        opened: acc.opened + (row.opened || 0),
        clicked: acc.clicked + (row.clicked || 0),
        bounced: acc.bounced + (row.bounced || 0),
        complained: acc.complained + (row.complained || 0),
        unsubscribed: acc.unsubscribed + (row.unsubscribed || 0),
        claimed: acc.claimed + (row.claimed || 0),
        converted: acc.converted + (row.converted || 0)
      }), {
        sent: 0, delivered: 0, opened: 0, clicked: 0,
        bounced: 0, complained: 0, unsubscribed: 0,
        claimed: 0, converted: 0
      });
    } catch (error) {
      console.error('Supabase metrics error:', error);
      return {
        sent: 0, delivered: 0, opened: 0, clicked: 0,
        bounced: 0, complained: 0, unsubscribed: 0,
        claimed: 0, converted: 0
      };
    }
  }

  /**
   * Calculate campaign performance
   */
  async calculatePerformance(campaign: string = 'default'): Promise<{
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    claimRate: number;
    conversionRate: number;
    bounceRate: number;
    complaintRate: number;
  }> {
    const metrics = await this.getMetrics(campaign);

    return {
      deliveryRate: metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0,
      openRate: metrics.delivered > 0 ? (metrics.opened / metrics.delivered) * 100 : 0,
      clickRate: metrics.opened > 0 ? (metrics.clicked / metrics.opened) * 100 : 0,
      claimRate: metrics.sent > 0 ? (metrics.claimed / metrics.sent) * 100 : 0,
      conversionRate: metrics.claimed > 0 ? (metrics.converted / metrics.claimed) * 100 : 0,
      bounceRate: metrics.sent > 0 ? (metrics.bounced / metrics.sent) * 100 : 0,
      complaintRate: metrics.delivered > 0 ? (metrics.complained / metrics.delivered) * 100 : 0
    };
  }

  /**
   * Get hourly metrics
   */
  async getHourlyMetrics(): Promise<Record<string, number>> {
    if (!this.redis) return {};

    const hour = new Date().getHours();
    const key = `metrics:hourly:${hour}`;
    
    const data = await this.redis.hgetall(key);
    
    return Object.entries(data).reduce((acc, [k, v]) => ({
      ...acc,
      [k]: parseInt(v)
    }), {});
  }

  /**
   * Get daily metrics
   */
  async getDailyMetrics(): Promise<Record<string, number>> {
    if (!this.redis) return {};

    const date = new Date().toISOString().split('T')[0];
    const key = `metrics:daily:${date}`;
    
    const data = await this.redis.hgetall(key);
    
    return Object.entries(data).reduce((acc, [k, v]) => ({
      ...acc,
      [k]: parseInt(v)
    }), {});
  }
}