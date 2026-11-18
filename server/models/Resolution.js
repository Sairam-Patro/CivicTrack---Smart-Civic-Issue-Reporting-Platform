import mongoose from 'mongoose';

const resolutionSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      index: true,
    },
    issueRef: {
      type: String,
      required: true,
      index: true,
    },
    issueTitle: {
      type: String,
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    submitterName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    beforeImages: [{ type: String }],
    afterImages: [{ type: String }],
    resolutionNotes: {
      type: String,
      required: [true, 'Resolution notes are required'],
    },
    workCost: {
      type: Number,
      default: 0,
    },
    materialsUsed: [{ type: String }],
    completionDate: {
      type: Date,
      default: Date.now,
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
      default: 'PENDING_APPROVAL',
      index: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    verifierName: {
      type: String,
    },
    verificationNotes: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    citizenFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      submittedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resolution', resolutionSchema);
