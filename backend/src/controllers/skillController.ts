import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { skillService } from '../services/skillService';

export const skillController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const skill = await skillService.create(req.body, req.user!.userId);
      res.status(201).json(skill);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type, tags, isActive } = req.query;
      const skills = await skillService.getAll({
        type: type as 'offer' | 'request',
        tags: tags ? (Array.isArray(tags) ? tags as string[] : [tags as string]) : undefined,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      });
      res.json(skills);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const skill = await skillService.getById(req.params.id);
      res.json(skill);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const skill = await skillService.update(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );
      res.json(skill);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await skillService.delete(
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
