export const mockNotificationService = {
  send: async (notification: any) => {
    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 5));
    
    return {
      notificationId: `notif-${Date.now()}`,
      delivered: true,
      deliveredAt: new Date().toISOString(),
      channel: notification.channel || 'email'
    };
  },
  
  sendBatch: async (notifications: any[]) => {
    const results = await Promise.all(
      notifications.map(n => mockNotificationService.send(n))
    );
    
    return {
      sent: results.filter(r => r.delivered).length,
      failed: results.filter(r => !r.delivered).length,
      deliveryIds: results.map(r => r.notificationId)
    };
  },
  
  createNotification: (params: any) => {
    const { score, type } = params;
    let priority = 'normal';
    let template = 'standard_match';
    
    if (score >= 90) {
      priority = 'high';
      template = 'excellent_match';
    } else if (score >= 75) {
      priority = 'medium';
      template = 'good_match';
    } else {
      template = 'potential_match';
    }
    
    return {
      ...params,
      priority,
      template,
      subject: getSubject(template, params),
      body: getBody(template, params)
    };
  },
  
  scheduleNotification: async (notification: any, sendAt: Date) => {
    return {
      scheduledId: `sched-${Date.now()}`,
      notification,
      sendAt: sendAt.toISOString(),
      status: 'scheduled'
    };
  },
  
  cancelScheduled: async (scheduledId: string) => {
    return {
      cancelled: true,
      scheduledId
    };
  },
  
  getDeliveryStatus: async (notificationId: string) => {
    return {
      notificationId,
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
      opened: Math.random() > 0.5,
      clicked: Math.random() > 0.7
    };
  },
  
  getStats: async (period: string) => {
    return {
      period,
      sent: 10000,
      delivered: 9800,
      opened: 4500,
      clicked: 1200,
      deliveryRate: 0.98,
      openRate: 0.459,
      clickRate: 0.122
    };
  }
};

function getSubject(template: string, params: any) {
  const subjects: Record<string, string> = {
    'excellent_match': `🎯 Perfect Match: ${params.rfqTitle} (${params.score}% match)`,
    'good_match': `Strong Match: ${params.rfqTitle} (${params.score}% match)`,
    'potential_match': `New Opportunity: ${params.rfqTitle}`,
    'standard_match': `RFQ Match: ${params.rfqTitle}`
  };
  
  return subjects[template] || 'New RFQ Opportunity';
}

function getBody(template: string, params: any) {
  const bodies: Record<string, string> = {
    'excellent_match': `This RFQ is an excellent match for your capabilities! With a ${params.score}% match score, you have a strong chance of winning this contract.`,
    'good_match': `This RFQ aligns well with your business profile. Your ${params.score}% match score indicates good potential for success.`,
    'potential_match': `This RFQ might be of interest to your business. Review the requirements to see if it's a good fit.`,
    'standard_match': `A new RFQ matching your profile is available.`
  };
  
  return bodies[template] || 'A new opportunity is available.';
}