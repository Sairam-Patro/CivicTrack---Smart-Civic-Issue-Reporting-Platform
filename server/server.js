/**
 * server.js — Entry point.
 * Loads environment variables, connects to MongoDB, starts HTTP + Socket.IO server.
 */

import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './utils/socket.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start HTTP + Socket.io
connectDB().then(() => {
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 CivicTrack Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
