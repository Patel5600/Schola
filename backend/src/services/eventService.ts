import { z } from 'zod';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().datetime(),
  location: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  maxAttendees: z.number().int().positive().optional(),
});

const updateEventSchema = createEventSchema.partial();

export const eventService = {
  async create(data: z.infer<typeof createEventSchema>, organizerId: string) {
    const validated = createEventSchema.parse(data);

    const event = await prisma.event.create({
      data: {
        ...validated,
        organizerId,
        date: new Date(validated.date),
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return event;
  },

  async getAll(filters: {
    status?: string;
    departmentId?: string;
    upcoming?: boolean;
  }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.departmentId) {
      where.departmentId = filters.departmentId;
    }

    if (filters.upcoming !== undefined) {
      if (filters.upcoming) {
        where.date = { gte: new Date() };
      } else {
        where.date = { lt: new Date() };
      }
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return events;
  },

  async getById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    return event;
  },

  async update(id: string, data: z.infer<typeof updateEventSchema>, userId: string, userRole: string) {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Only organizer, HOD, or admin can update
    if (event.organizerId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    const validated = updateEventSchema.parse(data);

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...validated,
        date: validated.date ? new Date(validated.date) : undefined,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return updated;
  },

  async delete(id: string, userId: string, userRole: string) {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Only organizer, HOD, or admin can delete
    if (event.organizerId !== userId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    await prisma.event.delete({
      where: { id },
    });

    return { message: 'Event deleted successfully' };
  },

  async register(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: true,
      },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if already registered
    const existingRegistration = event.registrations.find((r) => r.userId === userId);
    if (existingRegistration) {
      throw new AppError('Already registered for this event', 400);
    }

    // Check capacity
    if (event.maxAttendees && event.registrations.length >= event.maxAttendees) {
      throw new AppError('Event is full', 400);
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
      },
    });

    return registration;
  },

  async markAttendance(eventId: string, userId: string, attended: boolean, organizerId: string, userRole: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Only organizer, HOD, or admin can mark attendance
    if (event.organizerId !== organizerId && userRole !== 'hod' && userRole !== 'admin') {
      throw new AppError('Forbidden', 403);
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!registration) {
      throw new AppError('Registration not found', 404);
    }

    const updated = await prisma.eventRegistration.update({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      data: {
        attended,
      },
      include: {
        user: {
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
};

