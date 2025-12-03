import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';

export const getSkills = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { canTeach, seekingMentorship } = req.query;
    let query = 'SELECT * FROM skills WHERE 1=1';
    const params: any[] = [];
    
    if (canTeach === 'true') {
      query += ' AND can_teach = TRUE';
    }
    if (seekingMentorship === 'true') {
      query += ' AND seeking_mentorship = TRUE';
    }
    
    const result = await pool.query(query, params);
    res.json({ skills: result.rows });
  } catch (error) {
    next(error);
  }
};

export const addSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { skillName, skillLevel, description, canTeach, seekingMentorship } = req.body;
    const result = await pool.query(
      `INSERT INTO skills (user_id, skill_name, skill_level, description, can_teach, seeking_mentorship)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user!.id, skillName, skillLevel, description, canTeach || false, seekingMentorship || false]
    );
    res.status(201).json({ skill: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { skillName, skillLevel, description, canTeach, seekingMentorship } = req.body;
    const result = await pool.query(
      `UPDATE skills 
       SET skill_name = COALESCE($1, skill_name),
           skill_level = COALESCE($2, skill_level),
           description = COALESCE($3, description),
           can_teach = COALESCE($4, can_teach),
           seeking_mentorship = COALESCE($5, seeking_mentorship)
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [skillName, skillLevel, description, canTeach, seekingMentorship, req.params.id, req.user!.id]
    );
    res.json({ skill: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await pool.query('DELETE FROM skills WHERE id = $1 AND user_id = $2', [req.params.id, req.user!.id]);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
};

