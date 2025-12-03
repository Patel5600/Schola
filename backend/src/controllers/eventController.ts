import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import QRCode from 'qrcode';
import { createError } from '../middleware/errorHandler';

export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events ORDER BY start_date DESC'
    );
    res.json({ events: result.rows });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, eventType, startDate, endDate, venue, maxParticipants, department } = req.body;
    const result = await pool.query(
      `INSERT INTO events (title, description, event_type, start_date, end_date, venue, 
                          organizer_id, department, max_participants)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, eventType, startDate, endDate, venue, req.user!.id, department, maxParticipants]
    );
    
    const event = result.rows[0];
    const qrCode = await QRCode.toDataURL(event.id);
    await pool.query('UPDATE events SET qr_code_url = $1 WHERE id = $2', [qrCode, event.id]);
    
    res.status(201).json({ event: { ...event, qr_code_url: qrCode } });
  } catch (error) {
    next(error);
  }
};

export const registerEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await pool.query(
      'INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)',
      [id, req.user!.id]
    );
    res.json({ message: 'Registered successfully' });
  } catch (error) {
    next(error);
  }
};

export const getEventQR = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT qr_code_url FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) throw createError('Event not found', 404);
    res.json({ qrCode: result.rows[0].qr_code_url });
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE event_registrations 
       SET attended = TRUE, attendance_verified_at = NOW() 
       WHERE event_id = $1 AND user_id = $2`,
      [id, req.user!.id]
    );
    res.json({ message: 'Attendance marked' });
  } catch (error) {
    next(error);
  }
};

