import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { emitNotification, emitToRole, emitToDepartment } from '../socket/socket';

export const getAnnouncements = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { role, department } = req.user!;
    const query = role === 'admin' 
      ? 'SELECT * FROM announcements ORDER BY is_pinned DESC, created_at DESC'
      : `SELECT * FROM announcements 
         WHERE (target_role = $1 OR target_role = 'all' OR department = $2)
         AND (expires_at IS NULL OR expires_at > NOW())
         ORDER BY is_pinned DESC, created_at DESC`;
    
    const result = await pool.query(query, role === 'admin' ? [] : [role, department]);
    res.json({ announcements: result.rows });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, department, targetRole, isPinned, expiresAt } = req.body;
    const result = await pool.query(
      `INSERT INTO announcements (title, content, author_id, department, target_role, is_pinned, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, content, req.user!.id, department, targetRole || 'all', isPinned || false, expiresAt || null]
    );
    
    const announcement = result.rows[0];
    emitNotification(req.user!.id, {
      title: 'New Announcement',
      message: title,
      type: 'announcement',
      relatedId: announcement.id,
    });
    
    res.status(201).json({ announcement });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, content, isPinned, expiresAt } = req.body;
    const result = await pool.query(
      `UPDATE announcements 
       SET title = COALESCE($1, title), content = COALESCE($2, content),
           is_pinned = COALESCE($3, is_pinned), expires_at = COALESCE($4, expires_at)
       WHERE id = $5 RETURNING *`,
      [title, content, isPinned, expiresAt, id]
    );
    res.json({ announcement: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await pool.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    next(error);
  }
};

