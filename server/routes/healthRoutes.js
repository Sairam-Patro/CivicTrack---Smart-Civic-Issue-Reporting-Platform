/**
 * Health check route.
 * GET /api/health — returns API and database status.
 */

import express from 'express';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

router.get('/health', (req, res) => {
  const dbStatus = getDBStatus();

  res.status(200).json({
    success: true,
    message: 'CivicTrack API is running',
    database: dbStatus,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

export default router;
