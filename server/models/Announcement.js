import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'ALERT', 'EMERGENCY'],
      default: 'INFO',
    },
    targetAudience: {
      type: String,
      enum: ['ALL_CITIZENS', 'ADMINS_ONLY', 'STATE', 'DISTRICT', 'DEPARTMENT'],
      default: 'ALL_CITIZENS',
    },
    targetScope: {
      state: { type: String, default: 'All' },
      district: { type: String, default: 'All' },
      department: { type: String, default: 'All' },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    creatorName: { type: String, required: true },
    creatorRole: { type: String, default: 'Super Admin' },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
