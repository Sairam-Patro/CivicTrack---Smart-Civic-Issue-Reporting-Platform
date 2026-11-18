import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      index: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
      // e.g. ADMIN_LOGIN, ADMIN_LOGOUT, ISSUE_STATUS_CHANGE, ISSUE_ASSIGNED, ISSUE_VERIFIED,
      // ISSUE_ESCALATED, RESOLUTION_APPROVED, DEPARTMENT_CREATED, OFFICER_ASSIGNED, etc.
    },
    targetType: {
      type: String,
      required: true,
      enum: ['Issue', 'Admin', 'User', 'Department', 'Officer', 'Escalation', 'Resolution', 'Setting', 'Auth', 'System'],
    },
    targetId: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'WARNING'],
      default: 'SUCCESS',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable append-only
  }
);

auditLogSchema.index({ createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
