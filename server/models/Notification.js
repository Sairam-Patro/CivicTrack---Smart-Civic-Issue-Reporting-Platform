import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['ISSUE_STATUS_UPDATE', 'UPVOTE', 'COMMENT', 'ISSUE_ASSIGNED', 'RESOLUTION'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedIssue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
