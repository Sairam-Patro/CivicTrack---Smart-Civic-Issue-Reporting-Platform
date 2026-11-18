import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    issueCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true, // e.g. CT-10432
    },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    images: [{ type: String }],
    location: {
      address: { type: String, required: [true, 'Address is required'] },
      state: { type: String, trim: true, default: 'Delhi' },
      district: { type: String, trim: true, default: 'New Delhi' },
      city: { type: String, trim: true },
      localBody: { type: String, trim: true },
      ward: { type: String, default: 'Ward 12' },
      coordinates: {
        lat: { type: Number, default: 28.6139 },
        lng: { type: Number, default: 77.2090 },
      },
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: [
        'Reported',
        'Pending',
        'Under Review',
        'Assigned',
        'Scheduled',
        'In Progress',
        'Resolved',
        'Rejected',
        'Duplicate',
        'Reopened',
        'On Hold',
        'Closed',
      ],
      default: 'Pending',
      index: true,
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reporterName: { type: String },
    reporterPhone: { type: String },
    assignedDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    assignedDepartmentName: { type: String },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    assignedOfficerName: { type: String },
    assignedAt: { type: Date },
    scheduledDate: { type: Date },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    verifiedByName: { type: String },
    verifiedAt: { type: Date },
    rejectionReason: { type: String },
    duplicateOf: { type: String }, // issueCode or ObjectId of original issue
    upvoteCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    escalated: { type: Boolean, default: false },
    escalationLevel: { type: String },
    escalationReason: { type: String },
    resolutionEvidence: { type: String },
    afterImages: [{ type: String }],
    resolutionNotes: { type: String },
    resolvedAt: { type: Date },
    adminNotes: [
      {
        adminId: String,
        adminName: String,
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        action: { type: String, required: true },
        status: { type: String },
        performedBy: { type: String, default: 'System' },
        note: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes
issueSchema.index({ 'location.coordinates': '2dsphere' });
issueSchema.index({ category: 1 });
issueSchema.index({ 'location.state': 1 });
issueSchema.index({ 'location.district': 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ createdAt: -1 });

export default mongoose.model('Issue', issueSchema);
