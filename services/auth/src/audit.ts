// Audit service mock for testing  
export const auditService = {
  log: async (action: string, details: any) => {
    console.log(`Audit log: ${action}`, details);
    return true;
  },
  logLogin: async (userId: string, ip: string) => {
    console.log(`Login audit: User ${userId} from ${ip}`);
    return true;
  },
  logFailedLogin: async (email: string, ip: string) => {
    console.log(`Failed login audit: ${email} from ${ip}`);
    return true;
  }
};

export default auditService;