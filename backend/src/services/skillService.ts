import { z } from 'zod';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const createSkillSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['offer', 'request']),
  tags: z.array(z.string()).optional(),
});

const updateSkillSchema = createSkillSchema.partial();

export const skillService = {
  async create(data: z.infer<typeof createSkillSchema>, authorId: string) {
    const validated = createSkillSchema.parse(data);

    const skill = await prisma.skillExchange.create({
      data: {
        ...validated,
        authorId,
        tags: validated.tags || [],
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

    return skill;
  },

  async getAll(filters: {
    type?: 'offer' | 'request';
    tags?: string[];
    isActive?: boolean;
  }) {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const skills = await prisma.skillExchange.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return skills;
  },

  async getById(id: string) {
    const skill = await prisma.skillExchange.findUnique({
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

    if (!skill) {
      throw new AppError('Skill exchange not found', 404);
    }

    return skill;
  },

  async update(id: string, data: z.infer<typeof updateSkillSchema>, userId: string, userRole: string) {
    const skill = await prisma.skillExchange.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new AppError('Skill exchange not found', 404);
    }

    // Only author, HOD, or admin can update
    if (skill.authorId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    const validated = updateSkillSchema.parse(data);

    const updated = await prisma.skillExchange.update({
      where: { id },
      data: validated,
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
    const skill = await prisma.skillExchange.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new AppError('Skill exchange not found', 404);
    }

    // Only author, HOD, or admin can delete
    if (skill.authorId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    await prisma.skillExchange.delete({
      where: { id },
    });

    return { message: 'Skill exchange deleted successfully' };
  },
};

