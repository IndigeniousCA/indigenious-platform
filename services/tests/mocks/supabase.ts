export const mockSupabaseClient = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      in: (column: string, values: any[]) => Promise.resolve({ data: [], error: null }),
      gte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      limit: (count: number) => Promise.resolve({ 
        data: Array.from({ length: count }, (_, i) => mockBusinessData(i)), 
        error: null 
      }),
      single: () => Promise.resolve({ 
        data: mockBusinessData(1), 
        error: null 
      })
    }),
    insert: (data: any) => Promise.resolve({ 
      data: Array.isArray(data) ? data : [data], 
      error: null 
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: [{ ...data, [column]: value }], 
        error: null 
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: [], 
        error: null 
      })
    }),
    upsert: (data: any) => Promise.resolve({ 
      data: Array.isArray(data) ? data : [data], 
      error: null 
    })
  }),
  
  rpc: (functionName: string, params?: any) => {
    const rpcMocks: Record<string, any> = {
      'calculate_match_score': () => Promise.resolve({ data: 85, error: null }),
      'get_compliance_metrics': () => Promise.resolve({ 
        data: {
          indigenousPercentage: 3.2,
          totalContracts: 125,
          contractsAtRisk: 12
        }, 
        error: null 
      }),
      'find_partnership_opportunities': () => Promise.resolve({
        data: [
          {
            leadPartner: 'ind-001',
            supportPartners: ['partner-001', 'partner-002'],
            combinedScore: 92
          }
        ],
        error: null
      })
    };
    
    return rpcMocks[functionName] ? rpcMocks[functionName](params) : Promise.resolve({ data: null, error: null });
  },
  
  auth: {
    signUp: ({ email, password }: any) => Promise.resolve({
      data: {
        user: { id: 'user-123', email },
        session: { access_token: 'mock-token' }
      },
      error: null
    }),
    signIn: ({ email, password }: any) => Promise.resolve({
      data: {
        user: { id: 'user-123', email },
        session: { access_token: 'mock-token' }
      },
      error: null
    }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({
      data: {
        user: { id: 'user-123', email: 'test@example.com' }
      },
      error: null
    })
  },
  
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: any) => Promise.resolve({
        data: { path: `${bucket}/${path}` },
        error: null
      }),
      download: (path: string) => Promise.resolve({
        data: new Blob(['mock file content']),
        error: null
      }),
      remove: (paths: string[]) => Promise.resolve({
        data: paths.map(p => ({ name: p })),
        error: null
      })
    })
  },
  
  realtime: {
    channel: (name: string) => ({
      on: (event: string, callback: Function) => {
        // Mock realtime subscription
        return {
          subscribe: () => {
            console.log(`Subscribed to ${name} channel`);
            return { unsubscribe: () => {} };
          }
        };
      }
    })
  }
};

function mockBusinessData(index: number) {
  const isIndigenous = index % 10 === 0;
  return {
    id: `biz-${index}`,
    name: `Business ${index}`,
    email: `contact${index}@example.com`,
    isIndigenous,
    verified: isIndigenous && index % 20 === 0,
    certifications: isIndigenous ? ['CCAB Certified'] : [],
    capabilities: ['consulting', 'IT', 'construction'],
    location: 'Toronto, ON',
    revenue: 1000000 + (index * 100000),
    employees: 10 + index,
    contractHistory: [
      { value: 100000, year: 2024 },
      { value: 200000, year: 2025 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}