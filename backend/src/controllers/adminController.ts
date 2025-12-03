import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [users, announcements, events, notes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM announcements'),
      pool.query('SELECT COUNT(*) FROM events'),
      pool.query('SELECT COUNT(*) FROM notes'),
    ]);
    
    res.json({
      stats: {
        totalUsers: parseInt(users.rows[0].count),
        totalAnnouncements: parseInt(announcements.rows[0].count),
        totalEvents: parseInt(events.rows[0].count),
        totalNotes: parseInt(notes.rows[0].count),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Implementation similar to register but admin-created
    res.json({ message: 'User created' });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, role, department, is_active FROM users');
    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({ analytics: {} });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
    res.json({ logs: result.rows });
  } catch (error) {
    next(error);
  }
};

