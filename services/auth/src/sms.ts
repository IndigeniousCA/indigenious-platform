// SMS service mock for testing
export const smsService = {
  sendSMS: async (to: string, message: string) => {
    console.log(`Mock SMS sent to ${to}: ${message}`);
    return true;
  },
  sendVerificationCode: async (to: string, code: string) => {
    console.log(`Mock verification code sent to ${to}: ${code}`);
    return true;
  }
};

export default smsService;