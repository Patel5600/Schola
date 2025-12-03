import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { createError } from '../middleware/errorHandler';
import { generateOTP, sendOTPEmail } from '../utils/otp';
import { logger } from '../utils/logger';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName, role, department, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      throw createError('Missing required fields', 400);
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw createError('User already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, department, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role, department, is_verified`,
      [email.toLowerCase(), passwordHash, firstName, lastName, role, department || null, phone || null]
    );

    const user = result.rows[0];

    // Generate and send OTP
    const otp = generateOTP();
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password required', 400);
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      throw createError('Invalid credentials', 401);
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      throw createError('Account is deactivated', 403);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        isVerified: user.is_verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      throw createError('Email and OTP code required', 400);
    }

    // Find valid OTP
    const otpResult = await pool.query(
      `SELECT * FROM otps 
       WHERE email = $1 AND code = $2 AND used = FALSE AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [email.toLowerCase(), code]
    );

    if (otpResult.rows.length === 0) {
      throw createError('Invalid or expired OTP', 400);
    }

    // Mark OTP as used
    await pool.query(
      'UPDATE otps SET used = TRUE WHERE id = $1',
      [otpResult.rows[0].id]
    );

    // Verify user
    await pool.query(
      'UPDATE users SET is_verified = TRUE WHERE email = $1',
      [email.toLowerCase()]
    );

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw createError('Email required', 400);
    }

    const otp = generateOTP();
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log it for audit purposes
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

