/**
 * Email Service
 * Handles actual email sending through Resend/SendGrid
 */

import { Resend } from 'resend';
import * as sgMail from '@sendgrid/mail';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export class EmailService {
  private resend: Resend | null = null;
  private sendgrid: typeof sgMail | null = null;
  private provider: 'resend' | 'sendgrid' | 'mock' = 'mock';

  constructor() {
    // Initialize based on available API keys
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'YOUR_RESEND_API_KEY') {
      this.resend = new Resend(process.env.RESEND_API_KEY);
      this.provider = 'resend';
      console.log('📧 Email Service: Using Resend');
    } else if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'YOUR_SENDGRID_API_KEY') {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.sendgrid = sgMail;
      this.provider = 'sendgrid';
      console.log('📧 Email Service: Using SendGrid');
    } else {
      console.log('📧 Email Service: Using mock mode (no API keys configured)');
    }
  }

  /**
   * Send an email
   */
  async send(options: EmailOptions): Promise<any> {
    const from = options.from || process.env.RESEND_FROM_EMAIL || 'noreply@indigenious.ca';
    const replyTo = options.replyTo || process.env.RESEND_REPLY_TO || 'support@indigenious.ca';

    try {
      switch (this.provider) {
        case 'resend':
          return await this.sendViaResend(options, from, replyTo);
        
        case 'sendgrid':
          return await this.sendViaSendGrid(options, from, replyTo);
        
        default:
          return await this.sendViaMock(options, from, replyTo);
      }
    } catch (error) {
      console.error('❌ Email send error:', error);
      throw error;
    }
  }

  /**
   * Send via Resend
   */
  private async sendViaResend(options: EmailOptions, from: string, replyTo: string) {
    if (!this.resend) throw new Error('Resend not configured');

    const result = await this.resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: replyTo,
      tags: options.tags?.map(tag => ({ name: tag, value: tag }))
    });

    return {
      provider: 'resend',
      messageId: result.id,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Send via SendGrid
   */
  private async sendViaSendGrid(options: EmailOptions, from: string, replyTo: string) {
    if (!this.sendgrid) throw new Error('SendGrid not configured');

    const msg = {
      to: options.to,
      from,
      replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text,
      categories: options.tags,
      customArgs: options.metadata
    };

    const [response] = await this.sendgrid.send(msg);

    return {
      provider: 'sendgrid',
      messageId: response.headers['x-message-id'],
      status: 'sent',
      statusCode: response.statusCode,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Mock send for development/testing
   */
  private async sendViaMock(options: EmailOptions, from: string, replyTo: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Log email details for debugging
    console.log('📨 Mock Email Sent:');
    console.log(`  To: ${options.to}`);
    console.log(`  From: ${from}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  Tags: ${options.tags?.join(', ') || 'none'}`);
    
    // Simulate different response scenarios
    const randomSuccess = Math.random() > 0.1; // 90% success rate

    if (randomSuccess) {
      return {
        provider: 'mock',
        messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'sent',
        timestamp: new Date().toISOString(),
        mock: true
      };
    } else {
      throw new Error('Mock email failure (simulated)');
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulk(emails: EmailOptions[]): Promise<any[]> {
    const results = [];
    
    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(email => this.send(email))
      );
      
      results.push(...batchResults);
      
      // Add delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Get provider status
   */
  getStatus(): { provider: string; configured: boolean; healthy: boolean } {
    return {
      provider: this.provider,
      configured: this.provider !== 'mock',
      healthy: true // Could add health check logic here
    };
  }
}