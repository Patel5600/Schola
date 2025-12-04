import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authService } from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';

export const authController = {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }
      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async requestPasswordReset(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        throw new AppError('Email is required', 400);
      }
      const result = await authService.requestPasswordReset(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        throw new AppError('Token and new password are required', 400);
      }
      const result = await authService.resetPassword(token, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        throw new AppError('Verification token is required', 400);
      }
      const result = await authService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
};
