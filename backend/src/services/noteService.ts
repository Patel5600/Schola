import { z } from 'zod';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const createNoteSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  subject: z.string().min(1),
  semester: z.number().int().min(1).max(8),
  departmentId: z.string().uuid().optional(),
});

const updateNoteSchema = createNoteSchema.partial();

export const noteService = {
  async create(data: z.infer<typeof createNoteSchema>, authorId: string) {
    const validated = createNoteSchema.parse(data);

    const note = await prisma.note.create({
      data: {
        ...validated,
        authorId,
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

    return note;
  },

  async getAll(filters: {
    subject?: string;
    semester?: number;
    departmentId?: string;
    authorId?: string;
  }) {
    const where: any = {};

    if (filters.subject) {
      where.subject = { contains: filters.subject, mode: 'insensitive' };
    }

    if (filters.semester) {
      where.semester = filters.semester;
    }

    if (filters.departmentId) {
      where.departmentId = filters.departmentId;
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    const notes = await prisma.note.findMany({
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

    return notes;
  },

  async getById(id: string) {
    // Check if note exists first
    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new AppError('Note not found', 404);
    }

    // Increment download count and return the updated note
    const note = await prisma.note.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
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

    return note;
  },

  async update(id: string, data: z.infer<typeof updateNoteSchema>, userId: string, userRole: string) {
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Only author, HOD, or admin can update
    if (note.authorId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    const validated = updateNoteSchema.parse(data);

    const updated = await prisma.note.update({
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
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Only author, HOD, or admin can delete
    if (note.authorId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    await prisma.note.delete({
      where: { id },
    });

    return { message: 'Note deleted successfully' };
  },
};

