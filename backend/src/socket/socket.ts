import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { getIO } from './ioInstance';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export const initializeSocket = (io: Server) => {
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    logger.info(`User ${userId} connected`);

    // Join user's personal room
    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Join role-based room
    if (socket.userRole) {
      socket.join(`role:${socket.userRole}`);
    }

    // Handle notification subscriptions
    socket.on('subscribe', (channel: string) => {
      socket.join(channel);
      logger.info(`User ${userId} subscribed to ${channel}`);
    });

    socket.on('unsubscribe', (channel: string) => {
      socket.leave(channel);
      logger.info(`User ${userId} unsubscribed from ${channel}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User ${userId} disconnected`);
    });
  });

  return io;
};

export const emitNotification = (
  userId: string,
  notification: {
    title: string;
    message: string;
    type: string;
    relatedId?: string;
  }
) => {
  const io = getIO();
  io.to(`user:${userId}`).emit('notification', notification);
};

export const emitToRole = (
  role: string,
  event: string,
  data: any
) => {
  const io = getIO();
  io.to(`role:${role}`).emit(event, data);
};

export const emitToDepartment = (
  department: string,
  event: string,
  data: any
) => {
  const io = getIO();
  io.to(`dept:${department}`).emit(event, data);
};

