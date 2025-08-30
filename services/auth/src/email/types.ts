// Email types for testing
export interface EmailTemplate {
  subject: string;
  body: string;
  html?: string;
}

export interface EmailOptions {
  to: string;
  from?: string;
  template?: EmailTemplate;
}