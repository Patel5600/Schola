import { Server } from 'socket.io';

// Store the io instance
let ioInstance: Server | null = null;

// Set the io instance (called from server.ts after initialization)
export const setIO = (io: Server) => {
  ioInstance = io;
};

// Get the io instance (used by controllers)
export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error('Socket.IO instance not initialized. Make sure server.ts has initialized the socket.');
  }
  return ioInstance;
};

