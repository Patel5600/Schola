import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { noteService } from '../services/noteService';

export const noteController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const note = await noteService.create(req.body, req.user!.userId);
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { subject, semester, departmentId, authorId } = req.query;
      const notes = await noteService.getAll({
        subject: subject as string,
        semester: semester ? parseInt(semester as string) : undefined,
        departmentId: departmentId as string,
        authorId: authorId as string,
      });
      res.json(notes);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const note = await noteService.getById(req.params.id);
      res.json(note);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const note = await noteService.update(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );
      res.json(note);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await noteService.delete(
        req.params.id,
        req.user!.userId,
        req.user!.role
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
