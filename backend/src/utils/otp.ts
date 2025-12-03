import nodemailer from 'nodemailer';
import { pool } from '../config/database';
import { logger } from './logger';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  try {
    // Save OTP to database
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    await pool.query(
      'INSERT INTO otps (email, code, expires_at) VALUES ($1, $2, $3)',
      [email.toLowerCase(), otp, expiresAt]
    );

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Schola" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Schola - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Schola Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0ea5e9; margin: 0; font-size: 32px; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    logger.info(`OTP sent to ${email}`);
  } catch (error) {
    logger.error('Error sending OTP email:', error);
    throw error;
  }
};

