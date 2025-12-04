import { z } from 'zod';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  isPinned: z.boolean().optional(),
  targetRole: z.enum(['student', 'teacher', 'hod', 'admin']).optional(),
  departmentId: z.string().uuid().optional(),
  expiresAt: z.string().datetime().optional(),
});

const updateAnnouncementSchema = createAnnouncementSchema.partial();

export const announcementService = {
  async create(data: z.infer<typeof createAnnouncementSchema>, authorId: string) {
    const validated = createAnnouncementSchema.parse(data);

    const announcement = await prisma.announcement.create({
      data: {
        ...validated,
        authorId,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return announcement;
  },

  async getAll(filters: {
    role?: string;
    departmentId?: string;
    pinned?: boolean;
  }) {
    const where: any = {};

    if (filters.role) {
      where.targetRole = filters.role;
    }

    if (filters.departmentId) {
      where.departmentId = filters.departmentId;
    }

    if (filters.pinned !== undefined) {
      where.isPinned = filters.pinned;
    }

    // Filter out expired announcements
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } },
    ];

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return announcements;
  },

  async getById(id: string) {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    return announcement;
  },

  async update(id: string, data: z.infer<typeof updateAnnouncementSchema>, userId: string, userRole: string) {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    // Only author, HOD, or admin can update
    if (announcement.authorId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    const validated = updateAnnouncementSchema.parse(data);

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...validated,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updated;
  },

  async delete(id: string, userId: string, userRole: string) {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    // Only author, HOD, or admin can delete
    if (announcement.authorId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return { message: 'Announcement deleted successfully' };
  },
};

