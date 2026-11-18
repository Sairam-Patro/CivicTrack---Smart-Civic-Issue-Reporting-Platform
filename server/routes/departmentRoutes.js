import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import Department from '../models/Department.js';

const router = express.Router();

// GET /api/departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).select('name code categories');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/departments (admin only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
