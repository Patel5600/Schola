import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { createError } from '../middleware/errorHandler';

export const getNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { subject, tag } = req.query;
    let query = 'SELECT * FROM notes WHERE is_verified = TRUE';
    const params: any[] = [];
    
    if (subject) {
      query += ' AND subject = $1';
      params.push(subject);
    }
    if (tag) {
      query += ' AND $' + (params.length + 1) + ' = ANY(tags)';
      params.push(tag);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ notes: result.rows });
  } catch (error) {
    next(error);
  }
};

export const uploadNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw createError('File required', 400);
    const { title, description, subject, tags } = req.body;
    
    const result = await pool.query(
      `INSERT INTO notes (title, description, file_url, file_name, file_size, subject, tags, author_id, department)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, req.file.path, req.file.originalname, req.file.size, subject, 
       tags ? tags.split(',') : [], req.user!.id, req.user!.department]
    );
    
    res.status(201).json({ note: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await pool.query('DELETE FROM notes WHERE id = $1', [req.params.id]);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};

export const downloadNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) throw createError('Note not found', 404);
    
    await pool.query('UPDATE notes SET download_count = download_count + 1 WHERE id = $1', [req.params.id]);
    res.download(result.rows[0].file_url);
  } catch (error) {
    next(error);
  }
};

