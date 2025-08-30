export const mockEmailService = {
  send: async (params: any) => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Simulate some failures for testing
    if (params.to.includes('bounce@')) {
      return { success: false, error: 'Email bounced' };
    }
    
    if (params.to.includes('temporary-failure@')) {
      // Fail first time, succeed on retry
      if (!params.retryCount || params.retryCount < 2) {
        return { success: false, error: 'Temporary failure', retry: true };
      }
    }
    
    return {
      success: true,
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deliveredAt: new Date().toISOString()
    };
  },
  
  sendBatch: async (emails: any[]) => {
    const results = await Promise.all(
      emails.map(email => mockEmailService.send(email))
    );
    
    return {
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  },
  
  validateEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  getSuppressList: async () => {
    return [
      'unsubscribed@example.com',
      'bounced@example.com',
      'complained@example.com'
    ];
  },
  
  addToSuppressList: async (email: string, reason: string) => {
    return { added: true, email, reason };
  },
  
  removeFromSuppressList: async (email: string) => {
    return { removed: true, email };
  }
};

export const mockResendClient = {
  emails: {
    send: async (params: any) => {
      // Rate limiting simulation
      if (mockResendClient.sentToday >= 50000) {
        throw new Error('Daily limit reached');
      }
      
      mockResendClient.sentToday++;
      
      return {
        id: `email-${Date.now()}`,
        from: params.from,
        to: params.to,
        subject: params.subject
      };
    },
    
    sendBatch: async (params: any) => {
      const results = [];
      for (const email of params.emails) {
        try {
          const result = await mockResendClient.emails.send(email);
          results.push({ ...result, success: true });
        } catch (error: any) {
          results.push({ 
            error: error.message, 
            success: false,
            to: email.to 
          });
        }
      }
      return results;
    }
  },
  
  domains: {
    list: async () => ({
      data: [
        { id: 'domain-1', name: 'indigenious.ca', verified: true }
      ]
    }),
    
    verify: async (domain: string) => ({
      verified: true,
      records: [
        { type: 'TXT', name: '_resend', value: 'verification-code' },
        { type: 'MX', name: '@', value: 'feedback-smtp.resend.com' }
      ]
    })
  },
  
  audiences: {
    create: async (params: any) => ({
      id: `audience-${Date.now()}`,
      name: params.name
    }),
    
    addContacts: async (audienceId: string, contacts: any[]) => ({
      added: contacts.length,
      audienceId
    })
  },
  
  sentToday: 0,
  
  reset: () => {
    mockResendClient.sentToday = 0;
  }
};