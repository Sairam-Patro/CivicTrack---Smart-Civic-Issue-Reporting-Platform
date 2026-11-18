import mongoose from 'mongoose';

// State / Union Territory Model
const stateSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. 'PB', 'DL', 'MH'
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['State', 'Union Territory'], default: 'State' },
    capital: { type: String, trim: true },
    districtsCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// District Model
const districtSchema = new mongoose.Schema(
  {
    stateCode: { type: String, required: true, uppercase: true, trim: true },
    stateName: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    headquarters: { type: String, trim: true },
    localBodiesCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
districtSchema.index({ stateCode: 1, name: 1 }, { unique: true });

// Local Governance Body Model
const localBodySchema = new mongoose.Schema(
  {
    stateName: { type: String, required: true, trim: true },
    districtName: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Municipal Corporation', 'Municipal Council', 'Nagar Panchayat', 'Gram Panchayat'],
    },
    wardsCount: { type: Number, default: 10 },
    wards: [{ type: String }],
    headOfficial: { type: String }, // e.g., Commissioner, Sarpanch
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const State = mongoose.model('State', stateSchema);
export const District = mongoose.model('District', districtSchema);
export const LocalBody = mongoose.model('LocalBody', localBodySchema);
