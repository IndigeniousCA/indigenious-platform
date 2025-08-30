/**
 * Match Notifier
 * Intelligent notification system for RFQ matches
 */

import { createClient } from '@supabase/supabase-js';

export class MatchNotifier {
  private supabase: any;
  private notificationQueue: any[] = [];

  constructor() {
    // Initialize Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }
  }

  async initialize() {
    console.log('   Initializing Match Notifier...');
    // Setup notification channels
  }

  /**
   * Notify matched businesses about RFQ
   */
  async notifyMatches(rfq: any, matches: any[]): Promise<any[]> {
    const notifications = [];

    for (const match of matches) {
      const notification = await this.createNotification(rfq, match);
      
      // Queue notification
      this.notificationQueue.push(notification);
      notifications.push(notification);
      
      // Send immediately if high priority
      if (notification.priority === 'high') {
        await this.sendNotification(notification);
      }
    }

    // Process queue asynchronously
    this.processNotificationQueue();

    return notifications;
  }

  /**
   * Create personalized notification
   */
  private async createNotification(rfq: any, match: any) {
    const urgency = this.calculateUrgency(rfq);
    const personalization = this.personalizeMessage(rfq, match);
    
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'rfq_match',
      businessId: match.businessId,
      rfqId: rfq.id,
      priority: urgency.level,
      channels: this.selectChannels(urgency.level, match),
      subject: this.generateSubject(rfq, match),
      message: personalization.message,
      insights: personalization.insights,
      callToAction: personalization.cta,
      metadata: {
        matchScore: match.score,
        winProbability: match.winProbability,
        strengths: match.strengths,
        recommendations: match.recommendations
      },
      scheduledFor: this.calculateOptimalTiming(match),
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Calculate notification urgency
   */
  private calculateUrgency(rfq: any) {
    const daysToDeadline = this.getDaysToDeadline(rfq.closing_date);
    
    if (daysToDeadline < 3) {
      return { level: 'critical', reason: 'Deadline in less than 3 days' };
    } else if (daysToDeadline < 7) {
      return { level: 'high', reason: 'Deadline approaching' };
    } else if (daysToDeadline < 14) {
      return { level: 'medium', reason: 'Standard timeline' };
    } else {
      return { level: 'low', reason: 'Plenty of time' };
    }
  }

  /**
   * Personalize notification message
   */
  private personalizeMessage(rfq: any, match: any) {
    const insights = [];
    let message = '';
    let cta = 'View RFQ Details';

    // High match score
    if (match.score >= 90) {
      message = `🎯 Perfect match! This ${rfq.industry} opportunity aligns exceptionally with your capabilities.`;
      insights.push(`${match.score}% match score - one of your best opportunities`);
      cta = 'Review & Prepare Bid';
    }
    // Good match with high win probability
    else if (match.score >= 75 && match.winProbability >= 0.7) {
      message = `📊 Strong opportunity with ${Math.round(match.winProbability * 100)}% win probability based on your track record.`;
      insights.push(`Your strengths: ${match.strengths.slice(0, 2).join(', ')}`);
      cta = 'Analyze Opportunity';
    }
    // Good match but needs attention
    else if (match.score >= 70) {
      message = `💡 Good opportunity that could benefit from strategic positioning.`;
      insights.push(`Consider: ${match.recommendations[0]}`);
      cta = 'View Recommendations';
    }
    // Baseline match
    else {
      message = `New ${rfq.industry} opportunity matching your profile.`;
      insights.push(`Estimated value: $${(rfq.estimated_value || 0).toLocaleString()}`);
      cta = 'Explore Opportunity';
    }

    // Add specific insights
    if (rfq.requiresIndigenous && match.business?.is_indigenous) {
      insights.push('✅ Indigenous business requirement met');
    }

    if (match.business?.city === rfq.location?.city) {
      insights.push('📍 Local advantage - same city');
    }

    if (rfq.estimated_value && match.business?.max_project_size >= rfq.estimated_value) {
      insights.push('💰 Within your project capacity');
    }

    return {
      message,
      insights,
      cta
    };
  }

  /**
   * Generate notification subject
   */
  private generateSubject(rfq: any, match: any): string {
    if (match.score >= 90) {
      return `🎯 Perfect Match: ${rfq.title}`;
    } else if (match.winProbability >= 0.8) {
      return `⭐ High Win Probability: ${rfq.title}`;
    } else if (this.getDaysToDeadline(rfq.closing_date) < 7) {
      return `⏰ Urgent: ${rfq.title} - Closing Soon`;
    } else {
      return `New Opportunity: ${rfq.title}`;
    }
  }

  /**
   * Select notification channels based on priority
   */
  private selectChannels(priority: string, match: any): string[] {
    const channels = ['platform']; // Always use platform notifications

    switch (priority) {
      case 'critical':
        channels.push('email', 'sms', 'push');
        break;
      case 'high':
        channels.push('email', 'push');
        break;
      case 'medium':
        channels.push('email');
        break;
      default:
        // Platform only for low priority
        break;
    }

    // Check user preferences (mock)
    const preferences = match.business?.notification_preferences || {};
    
    return channels.filter(channel => 
      preferences[channel] !== false
    );
  }

  /**
   * Calculate optimal notification timing
   */
  private calculateOptimalTiming(match: any): string {
    const now = new Date();
    
    // Send high-scoring matches immediately
    if (match.score >= 85) {
      return now.toISOString();
    }

    // Otherwise, optimize for engagement
    const hour = now.getHours();
    
    // If it's outside business hours, schedule for next morning
    if (hour < 8 || hour > 18) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow.toISOString();
    }

    // Send within the next hour during business hours
    now.setMinutes(now.getMinutes() + Math.random() * 60);
    return now.toISOString();
  }

  /**
   * Send individual notification
   */
  private async sendNotification(notification: any) {
    console.log(`   Sending notification to business ${notification.businessId}`);

    // Store in database
    if (this.supabase) {
      await this.supabase
        .from('notifications')
        .insert(notification);
    }

    // Send through various channels
    for (const channel of notification.channels) {
      await this.sendViaChannel(channel, notification);
    }

    return notification;
  }

  /**
   * Send notification via specific channel
   */
  private async sendViaChannel(channel: string, notification: any) {
    switch (channel) {
      case 'platform':
        // In-app notification (always works)
        console.log(`      ✓ Platform notification sent`);
        break;
        
      case 'email':
        // Would integrate with email service
        console.log(`      ✓ Email notification queued`);
        break;
        
      case 'sms':
        // Would integrate with SMS service (Twilio, etc.)
        console.log(`      ✓ SMS notification queued`);
        break;
        
      case 'push':
        // Would integrate with push notification service
        console.log(`      ✓ Push notification sent`);
        break;
    }
  }

  /**
   * Process notification queue
   */
  private async processNotificationQueue() {
    // Process asynchronously
    setTimeout(async () => {
      while (this.notificationQueue.length > 0) {
        const batch = this.notificationQueue.splice(0, 10); // Process in batches
        
        await Promise.all(
          batch.map(notification => this.sendNotification(notification))
        );
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }, 100);
  }

  /**
   * Get days to deadline
   */
  private getDaysToDeadline(closingDate: string): number {
    const deadline = new Date(closingDate);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Track notification effectiveness
   */
  async trackEngagement(notificationId: string, action: string) {
    if (this.supabase) {
      await this.supabase
        .from('notification_engagement')
        .insert({
          notification_id: notificationId,
          action,
          timestamp: new Date().toISOString()
        });
    }

    console.log(`Tracked engagement: ${action} for notification ${notificationId}`);
  }
}