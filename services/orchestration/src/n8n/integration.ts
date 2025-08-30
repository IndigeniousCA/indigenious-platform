/**
 * n8n Integration
 * Handles simple automations and integrations
 * Perfect for: Email sequences, webhooks, API integrations, simple workflows
 */

import { EventEmitter } from 'events';

export class N8NIntegration extends EventEmitter {
  private workflows: Map<string, any> = new Map();
  private triggers: Map<string, any> = new Map();
  private activeAutomations: Set<string> = new Set();
  private isConnected: boolean = false;

  async initialize() {
    console.log('   🔧 Initializing n8n Integration...');
    
    // Setup core automations
    this.setupCoreAutomations();
    this.setupWebhooks();
    
    this.isConnected = true;
    console.log('      ✓ n8n ready for automations');
  }

  /**
   * Setup core platform automations
   */
  private setupCoreAutomations() {
    // Profile Claim Automation
    this.createWorkflow('profile-claim-automation', {
      trigger: 'webhook:profile.claimed',
      
      nodes: [
        {
          type: 'webhook',
          name: 'Profile Claimed',
          parameters: {
            path: '/webhook/profile-claimed',
            method: 'POST'
          }
        },
        {
          type: 'function',
          name: 'Validate Claim',
          code: `
            const { businessId, userId } = items[0].json;
            return {
              valid: businessId && userId,
              businessId,
              userId
            };
          `
        },
        {
          type: 'http',
          name: 'Get Business Data',
          parameters: {
            url: '{{$env.API_URL}}/businesses/{{businessId}}',
            method: 'GET'
          }
        },
        {
          type: 'email',
          name: 'Send Welcome Email',
          parameters: {
            to: '{{business.email}}',
            subject: 'Welcome to Indigenous Platform!',
            template: 'welcome'
          }
        },
        {
          type: 'slack',
          name: 'Notify Team',
          parameters: {
            channel: '#new-claims',
            message: 'New profile claimed: {{business.name}}'
          }
        },
        {
          type: 'http',
          name: 'Update CRM',
          parameters: {
            url: '{{$env.CRM_URL}}/contacts',
            method: 'POST',
            body: {
              business: '{{business}}',
              status: 'onboarding'
            }
          }
        }
      ]
    });
    
    // Engagement Tracking Automation
    this.createWorkflow('engagement-tracking', {
      trigger: 'webhook:email.opened',
      
      nodes: [
        {
          type: 'webhook',
          name: 'Email Opened'
        },
        {
          type: 'database',
          name: 'Update Engagement',
          operation: 'update',
          table: 'email_engagement',
          values: {
            opened: true,
            opened_at: '{{$now}}'
          }
        },
        {
          type: 'if',
          name: 'Check Engagement Level',
          conditions: {
            opens: { gte: 3 }
          },
          true: [
            {
              type: 'email',
              name: 'Send High Value Offer',
              template: 'high-engagement-offer'
            }
          ]
        },
        {
          type: 'http',
          name: 'Update Analytics',
          parameters: {
            url: '{{$env.ANALYTICS_URL}}/track',
            method: 'POST',
            body: {
              event: 'email.opened',
              properties: '{{data}}'
            }
          }
        }
      ]
    });
    
    // Daily Report Automation
    this.createWorkflow('daily-report-generation', {
      trigger: 'cron:0 18 * * *', // 6 PM daily
      
      nodes: [
        {
          type: 'database',
          name: 'Get Daily Stats',
          operation: 'query',
          query: `
            SELECT 
              COUNT(*) as total_rfqs,
              SUM(value) as total_value,
              AVG(match_score) as avg_score
            FROM rfqs 
            WHERE DATE(created_at) = CURRENT_DATE
          `
        },
        {
          type: 'function',
          name: 'Generate Report',
          code: `
            const stats = items[0].json;
            return {
              report: {
                date: new Date().toISOString().split('T')[0],
                rfqs: stats.total_rfqs,
                value: stats.total_value,
                avgScore: stats.avg_score,
                insights: generateInsights(stats)
              }
            };
          `
        },
        {
          type: 'html',
          name: 'Create HTML Report',
          template: 'daily-report-template'
        },
        {
          type: 'email',
          name: 'Send Report',
          parameters: {
            to: '{{$env.ADMIN_EMAILS}}',
            subject: 'Daily Platform Report - {{date}}',
            html: '{{report_html}}'
          }
        },
        {
          type: 'gsheets',
          name: 'Update Dashboard',
          operation: 'append',
          spreadsheet: '{{$env.DASHBOARD_SHEET_ID}}',
          data: '{{stats}}'
        }
      ]
    });
    
    // Payment Success Automation
    this.createWorkflow('payment-success-flow', {
      trigger: 'webhook:stripe.payment_succeeded',
      
      nodes: [
        {
          type: 'stripe',
          name: 'Get Payment Details',
          operation: 'get',
          resource: 'payment_intent'
        },
        {
          type: 'database',
          name: 'Update Subscription',
          operation: 'update',
          table: 'subscriptions',
          values: {
            status: 'active',
            paid_until: '{{calculateNextBilling()}}'
          }
        },
        {
          type: 'email',
          name: 'Send Receipt',
          template: 'payment-receipt'
        },
        {
          type: 'zapier',
          name: 'Update Accounting',
          webhook: '{{$env.ZAPIER_ACCOUNTING_HOOK}}'
        }
      ]
    });
  }

  /**
   * Setup webhook endpoints
   */
  private setupWebhooks() {
    // Register webhook triggers
    const webhooks = [
      '/webhook/profile-claimed',
      '/webhook/email-opened',
      '/webhook/email-clicked',
      '/webhook/rfq-submitted',
      '/webhook/bid-submitted',
      '/webhook/payment-received',
      '/webhook/subscription-cancelled'
    ];
    
    webhooks.forEach(path => {
      this.triggers.set(path, {
        path,
        active: true,
        handler: async (data: any) => {
          await this.handleWebhook(path, data);
        }
      });
    });
  }

  /**
   * Create a workflow
   */
  async createWorkflow(name: string, config: any) {
    this.workflows.set(name, {
      ...config,
      id: `wf_${Date.now()}`,
      active: true,
      executions: 0
    });
    
    // If it's a cron workflow, schedule it
    if (config.trigger?.startsWith('cron:')) {
      console.log(`      📅 Scheduled: ${name} (${config.trigger})`);
    }
    
    return { created: true, name };
  }

  /**
   * Trigger a workflow
   */
  async trigger(workflowName: string, data?: any) {
    const workflow = this.workflows.get(workflowName);
    
    if (!workflow) {
      console.warn(`   ⚠️ Workflow ${workflowName} not found`);
      return { error: 'Workflow not found' };
    }
    
    console.log(`   ▶️ Triggering n8n workflow: ${workflowName}`);
    
    // Track active automation
    const executionId = `exec_${Date.now()}`;
    this.activeAutomations.add(executionId);
    
    // Mock execution
    setTimeout(() => {
      workflow.executions++;
      this.activeAutomations.delete(executionId);
      
      console.log(`   ✅ n8n workflow completed: ${workflowName}`);
      this.emit('automation.completed', {
        workflow: workflowName,
        executionId,
        data
      });
    }, Math.random() * 2000 + 500);
    
    return {
      triggered: true,
      executionId,
      workflow: workflowName
    };
  }

  /**
   * Handle incoming webhook
   */
  private async handleWebhook(path: string, data: any) {
    console.log(`   🔔 Webhook received: ${path}`);
    
    // Find workflows triggered by this webhook
    const triggeredWorkflows = Array.from(this.workflows.values())
      .filter(w => w.trigger === `webhook:${path.replace('/webhook/', '')}`);
    
    // Trigger all matching workflows
    for (const workflow of triggeredWorkflows) {
      await this.executeWorkflow(workflow, data);
    }
  }

  /**
   * Execute a workflow
   */
  private async executeWorkflow(workflow: any, inputData: any) {
    console.log(`   🔄 Executing workflow: ${workflow.id}`);
    
    let data = inputData;
    
    // Execute each node in sequence
    for (const node of workflow.nodes || []) {
      try {
        data = await this.executeNode(node, data);
      } catch (error) {
        console.error(`   ❌ Node failed: ${node.name}`, error);
        // Continue to next node or stop based on error handling config
      }
    }
    
    return data;
  }

  /**
   * Execute a single node
   */
  private async executeNode(node: any, inputData: any) {
    switch (node.type) {
      case 'webhook':
        return inputData; // Pass through
        
      case 'function':
        // Execute custom function
        return { processed: true, ...inputData };
        
      case 'http':
        // Make HTTP request
        console.log(`      🌐 HTTP: ${node.parameters.method} ${node.parameters.url}`);
        return { ...inputData, http_response: 'mock_data' };
        
      case 'email':
        // Send email
        console.log(`      📧 Email: ${node.parameters.subject}`);
        return inputData;
        
      case 'database':
        // Database operation
        console.log(`      💾 Database: ${node.operation}`);
        return { ...inputData, db_result: 'success' };
        
      case 'if':
        // Conditional logic
        const condition = this.evaluateCondition(node.conditions, inputData);
        if (condition && node.true) {
          for (const trueNode of node.true) {
            inputData = await this.executeNode(trueNode, inputData);
          }
        }
        return inputData;
        
      default:
        console.log(`      📦 ${node.type}: ${node.name}`);
        return inputData;
    }
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(conditions: any, data: any): boolean {
    // Simplified condition evaluation
    return Math.random() > 0.5;
  }

  /**
   * Get status
   */
  async getStatus() {
    return {
      connected: this.isConnected,
      workflows: this.workflows.size,
      webhooks: this.triggers.size,
      active: this.activeAutomations.size
    };
  }

  /**
   * Get active automations
   */
  async getActiveAutomations() {
    return this.activeAutomations.size;
  }
}