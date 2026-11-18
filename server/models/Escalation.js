import mongoose from 'mongoose';

const escalationSchema = new mongoose.Schema(
  {
    escalationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    issueRef: {
      type: String,
      required: true,
      index: true, // e.g. CT-10415
    },
    issueTitle: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Level 1 - Department', 'Level 2 - District', 'Level 3 - State', 'Level 4 - National'],
      default: 'Level 2 - District',
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium'],
      default: 'High',
    },
    reason: {
      type: String,
      required: true, // e.g. "No action for 48 hrs", "Pending for 72 hrs", "Repeated unresolved safety hazard"
    },
    triggerType: {
      type: String,
      enum: ['AUTOMATIC_SLA', 'MANUAL_OFFICIAL', 'CITIZEN_OUTCRY'],
      default: 'AUTOMATIC_SLA',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'],
      default: 'ACTIVE',
      index: true,
    },
    currentOfficer: {
      type: String,
      default: 'Unassigned',
    },
    escalatedTo: {
      type: String,
      default: 'District Magistrate Office',
    },
    timeRemainingHours: {
      type: Number,
      default: 0,
    },
    overdueHours: {
      type: Number,
      default: 48,
    },
    recommendedAction: {
      type: String,
      default: 'Immediate inspection by senior officer and emergency dispatch',
    },
    history: [
      {
        action: String,
        performedBy: String,
        timestamp: { type: Date, default: Date.now },
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

escalationSchema.index({ status: 1, priority: 1 });

export default mongoose.model('Escalation', escalationSchema);
