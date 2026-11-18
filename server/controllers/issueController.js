import Issue from '../models/Issue.js';
import Upvote from '../models/Upvote.js';
import Comment from '../models/Comment.js';

// GET /api/issues
export const getIssues = async (req, res) => {
  try {
    const { category, status, priority, q, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { 'location.address': { $regex: q, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const [issues, total] = await Promise.all([
      Issue.find(filter).populate('reportedBy', 'name').sort('-createdAt').skip(skip).limit(Number(limit)),
      Issue.countDocuments(filter),
    ]);

    res.json({ issues, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/issues/:id
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedDepartment', 'name')
      .populate('assignedOfficer', 'name');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/issues
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, priority, address, ward, lat, lng } = req.body;
    const images = req.files?.map(f => `/uploads/${f.filename}`) || [];

    const issue = await Issue.create({
      title, description, category, priority,
      location: { address, ward, coordinates: { lat: Number(lat) || 0, lng: Number(lng) || 0 } },
      images,
      reportedBy: req.user?._id,
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/issues/:id/upvote
export const upvoteIssue = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Login required to upvote' });

    const existing = await Upvote.findOne({ issue: req.params.id, user: req.user._id });
    if (existing) {
      await existing.deleteOne();
      await Issue.findByIdAndUpdate(req.params.id, { $inc: { upvoteCount: -1 } });
      return res.json({ upvoted: false });
    }

    await Upvote.create({ issue: req.params.id, user: req.user._id });
    const issue = await Issue.findByIdAndUpdate(req.params.id, { $inc: { upvoteCount: 1 } }, { new: true });
    res.json({ upvoted: true, upvoteCount: issue.upvoteCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/issues/:id/comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.id })
      .populate('author', 'name role')
      .sort('createdAt');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/issues/:id/comments
export const addComment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Login required to comment' });
    const comment = await Comment.create({
      issue: req.params.id,
      author: req.user._id,
      text: req.body.text,
      isOfficialResponse: req.user.role !== 'citizen',
    });
    await Issue.findByIdAndUpdate(req.params.id, { $inc: { commentCount: 1 } });
    await comment.populate('author', 'name role');
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
