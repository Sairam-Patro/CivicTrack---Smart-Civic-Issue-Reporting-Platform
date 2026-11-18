/**
 * MongoDB connection configuration using Mongoose.
 * Uses MONGODB_URI from environment variables.
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === 'your_mongodb_connection_string') {
    console.warn('⚠️  MONGODB_URI not configured. Server starting without database.');
    console.warn('   Set MONGODB_URI in server/.env to enable database features.');
    return; // Start server without DB — health check will report "disconnected"
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('   Server will continue running, but database features are unavailable.');
    // Do NOT exit — server still starts, /api/health will report the real status
  }
};

/**
 * Returns a string describing the current DB connection state.
 * 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
export const getDBStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
};

export default connectDB;
