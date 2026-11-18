import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getIssues,
  getIssueById,
  createIssue,
  upvoteIssue,
  getComments,
  addComment,
} from '../controllers/issueController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage for issue images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `issue_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

router.get('/', getIssues);
router.post('/', optionalProtect, upload.array('images', 5), createIssue);
router.get('/:id', getIssueById);
router.post('/:id/upvote', protect, upvoteIssue);
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);

export default router;
