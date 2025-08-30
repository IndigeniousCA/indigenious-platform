/**
 * Business Deduplication Service
 * Removes duplicate businesses from collected data
 */

export class DeduplicationService {
  /**
   * Deduplicate businesses based on multiple criteria
   */
  async deduplicate(businesses: any[]): Promise<any[]> {
    console.log(`🔍 Deduplicating ${businesses.length} businesses...`);
    
    const uniqueBusinesses = new Map<string, any>();
    const duplicateKeys = new Set<string>();
    
    for (const business of businesses) {
      // Generate multiple deduplication keys
      const keys = this.generateDeduplicationKeys(business);
      
      let isDuplicate = false;
      let existingBusiness = null;
      let matchingKey = '';
      
      // Check if any key already exists
      for (const key of keys) {
        if (uniqueBusinesses.has(key)) {
          isDuplicate = true;
          existingBusiness = uniqueBusinesses.get(key);
          matchingKey = key;
          break;
        }
      }
      
      if (isDuplicate && existingBusiness) {
        // Merge data if duplicate found
        const merged = this.mergeBusinessData(existingBusiness, business);
        uniqueBusinesses.set(matchingKey, merged);
        duplicateKeys.add(matchingKey);
      } else {
        // Add new business with all its keys
        for (const key of keys) {
          if (!uniqueBusinesses.has(key)) {
            uniqueBusinesses.set(key, business);
          }
        }
      }
    }
    
    // Get unique businesses (avoiding duplicates across different keys)
    const finalBusinesses = new Map<string, any>();
    const processedIds = new Set<string>();
    
    for (const [key, business] of uniqueBusinesses.entries()) {
      const uniqueId = this.generateUniqueId(business);
      if (!processedIds.has(uniqueId)) {
        finalBusinesses.set(uniqueId, business);
        processedIds.add(uniqueId);
      }
    }
    
    const result = Array.from(finalBusinesses.values());
    
    console.log(`✅ Deduplication complete: ${businesses.length} → ${result.length} businesses`);
    console.log(`   Removed ${businesses.length - result.length} duplicates`);
    
    return result;
  }

  /**
   * Generate multiple deduplication keys for a business
   */
  private generateDeduplicationKeys(business: any): string[] {
    const keys: string[] = [];
    
    // Key 1: Name + City
    if (business.name && business.city) {
      const nameCity = `${this.normalizeString(business.name)}_${this.normalizeString(business.city)}`;
      keys.push(nameCity);
    }
    
    // Key 2: Website domain
    if (business.website) {
      const domain = this.extractDomain(business.website);
      if (domain) keys.push(`domain_${domain}`);
    }
    
    // Key 3: Email domain
    if (business.email) {
      const emailDomain = this.extractEmailDomain(business.email);
      if (emailDomain) keys.push(`email_${emailDomain}`);
    }
    
    // Key 4: Phone number (normalized)
    if (business.phone) {
      const normalizedPhone = this.normalizePhone(business.phone);
      if (normalizedPhone) keys.push(`phone_${normalizedPhone}`);
    }
    
    // Key 5: Name + Address
    if (business.name && business.address) {
      const nameAddress = `${this.normalizeString(business.name)}_${this.normalizeString(business.address)}`;
      keys.push(nameAddress);
    }
    
    // Fallback: Just normalized name
    if (business.name) {
      keys.push(this.normalizeString(business.name));
    }
    
    return keys.filter(key => key && key.length > 0);
  }

  /**
   * Generate a unique ID for final deduplication
   */
  private generateUniqueId(business: any): string {
    const components = [
      this.normalizeString(business.name || ''),
      this.normalizeString(business.city || ''),
      this.normalizeString(business.province || ''),
      this.extractDomain(business.website || ''),
      this.normalizePhone(business.phone || '')
    ].filter(c => c);
    
    return components.join('_') || `business_${Math.random()}`;
  }

  /**
   * Normalize string for comparison
   */
  private normalizeString(str: string): string {
    if (!str) return '';
    
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_')     // Replace spaces with underscore
      .replace(/_{2,}/g, '_')   // Remove multiple underscores
      .replace(/^the_|_the_|_the$/g, '') // Remove 'the'
      .replace(/^a_|_a_|_a$/g, '')       // Remove 'a'
      .replace(/_(inc|corp|corporation|ltd|limited|llc|llp|company|co)$/g, ''); // Remove company suffixes
  }

  /**
   * Extract domain from website URL
   */
  private extractDomain(website: string): string {
    if (!website) return '';
    
    try {
      const url = website.startsWith('http') ? website : `https://${website}`;
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '').toLowerCase();
    } catch {
      return '';
    }
  }

  /**
   * Extract domain from email
   */
  private extractEmailDomain(email: string): string {
    if (!email || !email.includes('@')) return '';
    return email.split('@')[1]?.toLowerCase() || '';
  }

  /**
   * Normalize phone number
   */
  private normalizePhone(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Remove country code if present (1 for Canada/US)
    if (digits.startsWith('1') && digits.length === 11) {
      return digits.substring(1);
    }
    
    return digits;
  }

  /**
   * Merge data from duplicate businesses
   */
  private mergeBusinessData(existing: any, duplicate: any): any {
    const merged = { ...existing };
    
    // Merge fields, preferring non-empty values
    const fieldsToMerge = [
      'description', 'website', 'email', 'phone', 'address', 
      'city', 'province', 'postal_code', 'industry', 'employee_count',
      'revenue_estimate', 'year_established', 'linkedin_url'
    ];
    
    for (const field of fieldsToMerge) {
      if (!merged[field] && duplicate[field]) {
        merged[field] = duplicate[field];
      }
      // For numeric fields, prefer larger values
      if (field === 'employee_count' || field === 'revenue_estimate') {
        if (duplicate[field] > merged[field]) {
          merged[field] = duplicate[field];
        }
      }
    }
    
    // Merge boolean flags (OR operation)
    const booleanFields = [
      'is_indigenous', 'indigenous_verified', 'c5_mandatory', 
      'government_contractor', 'claimed', 'verified', 'enriched'
    ];
    
    for (const field of booleanFields) {
      merged[field] = merged[field] || duplicate[field];
    }
    
    // Merge arrays
    if (duplicate.certifications && Array.isArray(duplicate.certifications)) {
      merged.certifications = [...new Set([
        ...(merged.certifications || []),
        ...duplicate.certifications
      ])];
    }
    
    if (duplicate.federal_contracts && Array.isArray(duplicate.federal_contracts)) {
      merged.federal_contracts = [
        ...(merged.federal_contracts || []),
        ...duplicate.federal_contracts
      ];
    }
    
    // Update metadata
    merged.sources = [...new Set([
      ...(merged.sources || [merged.source]),
      duplicate.source
    ])].filter(Boolean);
    
    merged.merge_count = (merged.merge_count || 1) + 1;
    merged.last_merged = new Date().toISOString();
    
    // Recalculate priority score (take highest)
    if (duplicate.priority_score > (merged.priority_score || 0)) {
      merged.priority_score = duplicate.priority_score;
    }
    
    return merged;
  }
}