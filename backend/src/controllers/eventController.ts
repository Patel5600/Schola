import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { eventService } from '../services/eventService';

export const eventController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.create(req.body, req.user!.userId);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, departmentId, upcoming } = req.query;
      const events = await eventService.getAll({
        status: status as string,
        departmentId: departmentId as string,
        upcoming: upcoming === 'true' ? true : upcoming === 'false' ? false : undefined,
      });
      res.json(events);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getById(req.params.id);
      res.json(event);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.update(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );
      res.json(event);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await eventService.delete(
        req.params.id,
        req.user!.userId,
        req.user!.role
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const registration = await eventService.register(req.params.id, req.user!.userId);
      res.status(201).json(registration);
    } catch (error) {
      next(error);
    }
  },

  async markAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, attended } = req.body;
      const result = await eventService.markAttendance(
        req.params.id,
        userId,
        attended,
        req.user!.userId,
        req.user!.role
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
