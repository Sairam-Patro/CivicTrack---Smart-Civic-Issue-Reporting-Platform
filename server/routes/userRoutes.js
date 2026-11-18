import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Issue from '../models/Issue.js';

const router = express.Router();

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/profile
router.patch('/profile', protect, async (req, res) => {
  try {
    const { name, phone, ward } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, ward }, { new: true, runValidators: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/users/my-issues
router.get('/my-issues', protect, async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id }).sort('-createdAt');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
