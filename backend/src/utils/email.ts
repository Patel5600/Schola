// Email utility functions
// TODO: Implement with Resend API when RESEND_API_KEY is provided
// For now, these are placeholder functions that log the email content

import { logger } from './logger';

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  logger.info(`[EMAIL] Verification email for ${email}: ${verificationUrl}`);
  
  // TODO: Implement actual email sending with Resend
  // if (process.env.RESEND_API_KEY) {
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: 'noreply@schola.com',
  //     to: email,
  //     subject: 'Verify your email',
  //     html: `Click here to verify: ${verificationUrl}`,
  //   });
  // }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  logger.info(`[EMAIL] Password reset email for ${email}: ${resetUrl}`);
  
  // TODO: Implement actual email sending with Resend
  // if (process.env.RESEND_API_KEY) {
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: 'noreply@schola.com',
  //     to: email,
  //     subject: 'Reset your password',
  //     html: `Click here to reset: ${resetUrl}`,
  //   });
  // }
};

