import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: [true, 'Comment text is required'], trim: true, maxlength: 1000 },
    isOfficialResponse: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
