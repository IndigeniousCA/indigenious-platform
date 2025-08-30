import { mockSupabaseClient } from './mocks/supabase';
import { mockEmailService, mockResendClient } from './mocks/email';
import { mockNotificationService } from './mocks/notifications';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
process.env.TEMPORAL_ADDRESS = 'localhost:7233';
process.env.N8N_URL = 'http://localhost:5678';
process.env.INNGEST_EVENT_KEY = 'test-inngest-key';
process.env.REDIS_URL = 'redis://localhost:6379';

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn((...args) => {
    // Only show actual errors, not expected ones
    if (!args[0]?.includes('Expected') && !args[0]?.includes('test')) {
      originalConsoleError(...args);
    }
  });
  
  console.warn = jest.fn((...args) => {
    // Filter out warning noise
    if (!args[0]?.includes('Mock') && !args[0]?.includes('test')) {
      originalConsoleWarn(...args);
    }
  });
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  mockResendClient.reset();
});

// Global test utilities
global.testUtils = {
  generateBusinessData: (count: number, options: any = {}) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `biz-${i}`,
      name: options.prefix ? `${options.prefix} ${i}` : `Business ${i}`,
      email: `contact${i}@example.com`,
      isIndigenous: options.allIndigenous || i % 10 === 0,
      verified: i % 20 === 0,
      capabilities: options.capabilities || ['consulting', 'IT'],
      location: options.location || 'Toronto, ON',
      revenue: 1000000 + (i * 100000)
    }));
  },
  
  generateRFQData: (count: number, options: any = {}) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `rfq-${i}`,
      title: `RFQ ${i}: ${options.title || 'IT Services'}`,
      budget: options.budget || 100000 + (i * 50000),
      indigenousRequirement: options.indigenousRequired || i % 3 === 0,
      requirements: options.requirements || ['consulting', 'development'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: options.location || 'Canada'
    }));
  },
  
  mockApiResponse: (data: any, error: any = null) => {
    return Promise.resolve({ data, error });
  },
  
  waitFor: (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Type declarations for global test utils
declare global {
  var testUtils: {
    generateBusinessData: (count: number, options?: any) => any[];
    generateRFQData: (count: number, options?: any) => any[];
    mockApiResponse: (data: any, error?: any) => Promise<any>;
    waitFor: (ms: number) => Promise<void>;
  };
}

// Export mocks for use in tests
export {
  mockSupabaseClient,
  mockEmailService,
  mockResendClient,
  mockNotificationService
};