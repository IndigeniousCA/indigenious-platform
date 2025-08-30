/**
 * Template Engine
 * Manages and personalizes email templates
 */

import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

export class TemplateEngine {
  private templates: Map<string, Template> = new Map();
  private handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
    this.loadTemplates();
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers() {
    // Format currency
    this.handlebars.registerHelper('currency', (amount: number) => {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(amount);
    });

    // Format percentage
    this.handlebars.registerHelper('percentage', (value: number) => {
      return `${value.toFixed(1)}%`;
    });

    // Format date
    this.handlebars.registerHelper('date', (date: string | Date) => {
      return new Date(date).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    // Conditional helpers
    this.handlebars.registerHelper('ifEquals', function(arg1: any, arg2: any, options: any) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    this.handlebars.registerHelper('ifGreaterThan', function(arg1: number, arg2: number, options: any) {
      return arg1 > arg2 ? options.fn(this) : options.inverse(this);
    });

    this.handlebars.registerHelper('ifLessThan', function(arg1: number, arg2: number, options: any) {
      return arg1 < arg2 ? options.fn(this) : options.inverse(this);
    });
  }

  /**
   * Load templates from files and memory
   */
  private async loadTemplates() {
    // Load built-in templates
    this.loadBuiltInTemplates();

    // Try to load file templates
    try {
      const templatesDir = path.join(__dirname, '../templates');
      const files = await fs.readdir(templatesDir).catch(() => []);
      
      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const templateId = file.replace('.hbs', '');
          const content = await fs.readFile(path.join(templatesDir, file), 'utf-8');
          
          this.templates.set(templateId, {
            id: templateId,
            name: this.formatTemplateName(templateId),
            subject: this.extractSubject(content),
            content,
            variables: this.extractVariables(content)
          });
        }
      }
    } catch (error) {
      console.log('Using built-in templates only');
    }
  }

  /**
   * Load built-in templates
   */
  private loadBuiltInTemplates() {
    // C-5 Critical Compliance Template
    this.templates.set('claim-profile-c5-critical', {
      id: 'claim-profile-c5-critical',
      name: 'C-5 Critical Compliance Alert',
      subject: '⚠️ URGENT: Your company is NON-COMPLIANT with Bill C-5',
      content: this.getC5CriticalTemplate(),
      variables: ['businessName', 'compliancePercentage', 'claimUrl']
    });

    // C-5 Warning Template
    this.templates.set('claim-profile-c5-warning', {
      id: 'claim-profile-c5-warning',
      name: 'C-5 Compliance Warning',
      subject: 'Action Required: C-5 Compliance Deadline in 45 Days',
      content: this.getC5WarningTemplate(),
      variables: ['businessName', 'currentPercentage', 'claimUrl']
    });

    // Indigenous Business Template
    this.templates.set('claim-profile-indigenous', {
      id: 'claim-profile-indigenous',
      name: 'Indigenous Business Profile Ready',
      subject: '🎯 Your Indigenous Business Profile is Ready',
      content: this.getIndigenousTemplate(),
      variables: ['businessName', 'claimUrl', 'opportunityCount']
    });

    // General Template
    this.templates.set('claim-profile-general', {
      id: 'claim-profile-general',
      name: 'General Profile Claim',
      subject: 'Your business has been added to Indigenous Platform',
      content: this.getGeneralTemplate(),
      variables: ['businessName', 'claimUrl']
    });
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<Template> {
    const template = this.templates.get(templateId);
    
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    return template;
  }

  /**
   * Personalize template with data
   */
  async personalize(templateContent: string, data: Record<string, any>): Promise<string> {
    // Compile template
    const compiled = this.handlebars.compile(templateContent);
    
    // Add default values
    const defaultData = {
      currentYear: new Date().getFullYear(),
      platformName: 'Indigenous Platform',
      platformUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://indigenious.ca',
      supportEmail: 'support@indigenious.ca',
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`,
      privacyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/privacy`,
      ...data
    };
    
    // Generate HTML
    return compiled(defaultData);
  }

  /**
   * Helper methods
   */
  private formatTemplateName(id: string): string {
    return id.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private extractSubject(content: string): string {
    const match = content.match(/<title>(.*?)<\/title>/);
    return match ? match[1] : 'Indigenous Platform Notification';
  }

  private extractVariables(content: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables = new Set<string>();
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      variables.add(match[1].trim());
    }
    
    return Array.from(variables);
  }

  /**
   * Built-in template content
   */
  private getC5CriticalTemplate(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>⚠️ URGENT: C-5 Compliance Alert</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
  <div style="background: #dc2626; color: white; padding: 15px; text-align: center;">
    <h2 style="margin: 0;">⚠️ URGENT: Bill C-5 Compliance Required</h2>
  </div>
  
  <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
    <h1>{{businessName}}</h1>
    
    <div style="background: #fef2f2; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #dc2626; margin-top: 0;">NON-COMPLIANT STATUS</h2>
      <p>Your current Indigenous procurement: <strong>{{compliancePercentage}}%</strong></p>
      <p>Required minimum: <strong>5.0%</strong></p>
    </div>
    
    <p><strong>You risk losing federal contracts if you don't act now.</strong></p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{claimUrl}}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        FIX COMPLIANCE NOW →
      </a>
    </div>
    
    <p style="color: #666; font-size: 12px; text-align: center;">
      {{platformName}} | <a href="{{unsubscribeUrl}}">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
  }

  private getC5WarningTemplate(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>C-5 Compliance Warning</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
  <div style="background: #f59e0b; color: white; padding: 15px; text-align: center;">
    <h2 style="margin: 0;">Action Required: C-5 Compliance</h2>
  </div>
  
  <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
    <h1>{{businessName}}</h1>
    
    <p>Your organization is currently at <strong>{{currentPercentage}}%</strong> Indigenous procurement.</p>
    
    <p>You have <strong>45 days</strong> until the Q4 compliance deadline.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{claimUrl}}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Check Compliance Status →
      </a>
    </div>
  </div>
</body>
</html>`;
  }

  private getIndigenousTemplate(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Your Indigenous Business Profile</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
  <div style="background: #059669; color: white; padding: 15px; text-align: center;">
    <h2 style="margin: 0;">🎯 Your Business Profile is Ready</h2>
  </div>
  
  <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
    <h1>Welcome {{businessName}}!</h1>
    
    <p>Your Indigenous business profile has been created on Indigenous Platform.</p>
    
    <p><strong>You have {{opportunityCount}} new RFQ matches waiting!</strong></p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{claimUrl}}" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Claim Your FREE Profile →
      </a>
    </div>
    
    <p>As an Indigenous business, your profile is <strong>always free</strong>.</p>
  </div>
</body>
</html>`;
  }

  private getGeneralTemplate(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Your Business Profile</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
    <h1>{{businessName}}</h1>
    
    <p>Your business has been added to Indigenous Platform, Canada's procurement and compliance infrastructure.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{claimUrl}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Claim Your Profile →
      </a>
    </div>
  </div>
</body>
</html>`;
  }
}