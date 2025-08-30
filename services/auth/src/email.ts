// Email service mock for testing
export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log(`Mock email sent to ${to}: ${subject}`);
  return true;
};

export const sendVerificationEmail = async (to: string, token: string) => {
  return sendEmail(to, 'Verify your email', `Token: ${token}`);
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  return sendEmail(to, 'Reset your password', `Token: ${token}`);
};

export const emailService = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};

export default emailService;