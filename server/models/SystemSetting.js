import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. 'platform_config'
    platformName: { type: String, default: 'CivicTrack' },
    tagline: { type: String, default: 'Report Today. Better Tomorrow.' },
    contactEmail: { type: String, default: 'support@civictrack.gov.in' },
    emergencyHelpline: { type: String, default: '1800-CIVIC-GOV' },
    maintenanceMode: { type: Boolean, default: false },
    slaSettings: {
      criticalHours: { type: Number, default: 24 },
      highHours: { type: Number, default: 48 },
      mediumHours: { type: Number, default: 72 },
      lowHours: { type: Number, default: 120 },
    },
    autoEscalateHours: { type: Number, default: 48 },
    upvotesThresholdHighPriority: { type: Number, default: 25 },
    categories: [
      {
        name: { type: String, required: true },
        departmentCode: { type: String, required: true },
        basePriority: { type: String, default: 'Medium' },
        enabled: { type: Boolean, default: true },
      },
    ],
    updatedBy: { type: String, default: 'SYSTEM' },
  },
  { timestamps: true }
);

export default mongoose.model('SystemSetting', systemSettingSchema);
