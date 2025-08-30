/**
 * Business Enrichment Service
 * Enriches business data with additional information
 */

import OpenAI from 'openai';

export class EnrichmentService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
    });
  }

  async enrich(business: any): Promise<any> {
    try {
      // Enrich with calculated fields
      const enriched = {
        ...business,
        
        // Industry classification
        industry_classification: this.classifyIndustry(business.industry),
        naics_code: this.getNAICSCode(business.industry),
        
        // Size classification
        size_category: this.classifySize(business.employee_count),
        
        // Revenue estimation (if not provided)
        revenue_estimate: business.revenue_estimate || this.estimateRevenue(business),
        
        // Contact enrichment
        email_domain: this.extractDomain(business.email || business.website),
        email_valid: this.validateEmail(business.email),
        phone_formatted: this.formatPhone(business.phone),
        
        // Location enrichment
        region: this.getRegion(business.province),
        timezone: this.getTimezone(business.province),
        
        // Scoring
        data_completeness: this.calculateCompleteness(business),
        engagement_potential: this.calculateEngagementPotential(business),
        
        // Compliance flags
        requires_c5: this.requiresC5Compliance(business),
        compliance_urgency: this.getComplianceUrgency(business),
        
        // Metadata
        enriched: true,
        enriched_at: new Date().toISOString(),
        enrichment_version: '1.0'
      };

      // AI enrichment (if API key available)
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key') {
        enriched.ai_insights = await this.getAIInsights(business);
      }

      return enriched;

    } catch (error) {
      console.error('Enrichment error:', error);
      return {
        ...business,
        enriched: false,
        enrichment_error: true
      };
    }
  }

  private classifyIndustry(industry: string): string {
    const classifications = {
      'Information Technology': 'Technology',
      'IT Services': 'Technology',
      'Software': 'Technology',
      'Consulting': 'Professional Services',
      'Management Consulting': 'Professional Services',
      'Construction': 'Construction & Engineering',
      'Engineering': 'Construction & Engineering',
      'Healthcare': 'Healthcare & Social',
      'Medical': 'Healthcare & Social',
      'Financial': 'Financial Services',
      'Banking': 'Financial Services',
      'Manufacturing': 'Manufacturing',
      'Retail': 'Retail & Consumer',
      'Restaurant': 'Hospitality',
      'Hotel': 'Hospitality'
    };

    for (const [key, value] of Object.entries(classifications)) {
      if (industry?.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return 'Other';
  }

  private getNAICSCode(industry: string): string {
    const codes: Record<string, string> = {
      'Information Technology': '54151',
      'Construction': '23',
      'Manufacturing': '31-33',
      'Retail': '44-45',
      'Professional Services': '54',
      'Healthcare': '62',
      'Financial Services': '52'
    };

    const classification = this.classifyIndustry(industry);
    return codes[classification] || '99';
  }

  private classifySize(employeeCount: number): string {
    if (!employeeCount) return 'Unknown';
    if (employeeCount < 20) return 'Small';
    if (employeeCount < 100) return 'Medium';
    if (employeeCount < 500) return 'Large';
    return 'Enterprise';
  }

  private estimateRevenue(business: any): number {
    const { employee_count, industry } = business;
    
    if (!employee_count) return 0;

    // Industry multipliers (revenue per employee)
    const multipliers: Record<string, number> = {
      'Technology': 250000,
      'Professional Services': 200000,
      'Financial Services': 300000,
      'Construction & Engineering': 180000,
      'Manufacturing': 150000,
      'Retail & Consumer': 120000,
      'Healthcare & Social': 140000,
      'Hospitality': 80000,
      'Other': 100000
    };

    const classification = this.classifyIndustry(industry);
    const multiplier = multipliers[classification] || 100000;
    
    return Math.floor(employee_count * multiplier * (0.8 + Math.random() * 0.4));
  }

  private extractDomain(input: string): string {
    if (!input) return '';
    
    // Extract from email
    if (input.includes('@')) {
      return input.split('@')[1];
    }
    
    // Extract from website
    try {
      const url = new URL(input.startsWith('http') ? input : `https://${input}`);
      return url.hostname.replace('www.', '');
    } catch {
      return '';
    }
  }

  private validateEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private formatPhone(phone: string): string {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  }

  private getRegion(province: string): string {
    const regions: Record<string, string> = {
      'BC': 'Western Canada',
      'AB': 'Western Canada',
      'SK': 'Prairie',
      'MB': 'Prairie',
      'ON': 'Central Canada',
      'QC': 'Quebec',
      'NB': 'Atlantic',
      'NS': 'Atlantic',
      'PE': 'Atlantic',
      'NL': 'Atlantic',
      'YT': 'Northern',
      'NT': 'Northern',
      'NU': 'Northern'
    };
    
    return regions[province] || 'Canada';
  }

  private getTimezone(province: string): string {
    const timezones: Record<string, string> = {
      'BC': 'America/Vancouver',
      'AB': 'America/Edmonton',
      'SK': 'America/Regina',
      'MB': 'America/Winnipeg',
      'ON': 'America/Toronto',
      'QC': 'America/Montreal',
      'NB': 'America/Halifax',
      'NS': 'America/Halifax',
      'PE': 'America/Halifax',
      'NL': 'America/St_Johns',
      'YT': 'America/Whitehorse',
      'NT': 'America/Yellowknife',
      'NU': 'America/Iqaluit'
    };
    
    return timezones[province] || 'America/Toronto';
  }

  private calculateCompleteness(business: any): number {
    const fields = [
      'name', 'description', 'website', 'email', 'phone',
      'address', 'city', 'province', 'industry', 'employee_count'
    ];
    
    const filledFields = fields.filter(field => business[field]).length;
    return Math.round((filledFields / fields.length) * 100);
  }

  private calculateEngagementPotential(business: any): number {
    let score = 50; // Base score
    
    // Higher score for government contractors
    if (business.government_contractor) score += 30;
    
    // Higher score for C-5 mandatory
    if (business.c5_mandatory) score += 20;
    
    // Higher score for larger companies
    if (business.employee_count > 100) score += 15;
    else if (business.employee_count > 50) score += 10;
    
    // Higher score for complete data
    score += business.data_completeness * 0.2;
    
    // Cap at 100
    return Math.min(100, Math.round(score));
  }

  private requiresC5Compliance(business: any): boolean {
    return business.government_contractor || 
           business.c5_mandatory || 
           (business.federal_contracts && business.federal_contracts.length > 0);
  }

  private getComplianceUrgency(business: any): string {
    if (!this.requiresC5Compliance(business)) return 'None';
    
    const compliance = business.current_compliance || 0;
    
    if (compliance < 3) return 'CRITICAL';
    if (compliance < 5) return 'HIGH';
    if (compliance < 7.5) return 'MEDIUM';
    return 'LOW';
  }

  private async getAIInsights(business: any): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate brief business insights for procurement and compliance purposes.'
          },
          {
            role: 'user',
            content: `Business: ${business.name}, Industry: ${business.industry}, Size: ${business.employee_count} employees`
          }
        ],
        max_tokens: 100
      });
      
      return {
        summary: completion.choices[0].message.content,
        generated_at: new Date().toISOString()
      };
    } catch {
      return null;
    }
  }
}