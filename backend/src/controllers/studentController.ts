import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ dashboard: {} });
  } catch (error) {
    next(error);
  }
};

export const getPortfolio = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ portfolio: {} });
  } catch (error) {
    next(error);
  }
};

