import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5000',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    // Client joins room (e.g. geographic or role room)
    socket.on('join_room', (room) => {
      if (room) {
        socket.join(room);
      }
    });

    socket.on('leave_room', (room) => {
      if (room) {
        socket.leave(room);
      }
    });

    // Client can ping for health/sync
    socket.on('sync_request', () => {
      socket.emit('sync_response', { status: 'connected', timestamp: new Date() });
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  console.log('⚡ Socket.IO initialized for real-time dashboard events');
  return io;
};

export const getIO = () => {
  if (!io) {
    // Return dummy broadcaster if io not ready yet to prevent crashes
    return {
      emit: () => {},
      to: () => ({ emit: () => {} }),
    };
  }
  return io;
};

/**
 * Broadcast event to all or specific room
 * @param {string} event - Event name
 * @param {object} payload - Event payload
 * @param {string} room - Optional room name
 */
export const emitEvent = (event, payload, room = null) => {
  const socketInstance = getIO();
  if (room) {
    socketInstance.to(room).emit(event, payload);
  } else {
    socketInstance.emit(event, payload);
  }
};

export default { initSocket, getIO, emitEvent };
