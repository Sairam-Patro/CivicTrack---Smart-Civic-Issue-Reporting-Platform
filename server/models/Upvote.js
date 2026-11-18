import mongoose from 'mongoose';

const upvoteSchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Unique constraint: one upvote per user per issue
upvoteSchema.index({ issue: 1, user: 1 }, { unique: true });

export default mongoose.model('Upvote', upvoteSchema);
