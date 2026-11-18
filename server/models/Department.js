import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    categories: [{ type: String }],
    contactEmail: { type: String },
    contactPhone: { type: String },
    headOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    headOfficerName: { type: String },
    state: { type: String, default: 'All' },
    district: { type: String, default: 'All' },
    ward: { type: String },
    slaHours: { type: Number, default: 48 },
    totalStaff: { type: Number, default: 12 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Department', departmentSchema);
