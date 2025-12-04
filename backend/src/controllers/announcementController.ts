import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { announcementService } from '../services/announcementService';

export const announcementController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.create(req.body, req.user!.userId);
      res.status(201).json(announcement);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role, departmentId, pinned } = req.query;
      const announcements = await announcementService.getAll({
        role: role as string,
        departmentId: departmentId as string,
        pinned: pinned === 'true' ? true : pinned === 'false' ? false : undefined,
      });
      res.json(announcements);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.getById(req.params.id);
      res.json(announcement);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.update(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );
      res.json(announcement);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await announcementService.delete(
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
