import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Official email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: [
        'super_admin',      // Level 1: National
        'state_admin',      // Level 2: State / UT
        'district_admin',   // Level 3: District
        'local_admin',      // Level 4: Municipal / Panchayat
        'officer',          // Level 5: Department Officer
        'moderator',        // Level 6: Community Moderator
      ],
      default: 'local_admin',
    },
    designation: {
      type: String,
      trim: true,
      default: 'Civic Administrator',
    },
    // Geographic jurisdictions
    state: {
      type: String,
      trim: true,
      default: 'National', // 'National' for super_admin
    },
    district: {
      type: String,
      trim: true,
      default: 'All',
    },
    localBody: {
      type: String,
      trim: true,
      default: 'All',
    },
    localBodyType: {
      type: String,
      enum: ['National', 'State', 'Municipal Corporation', 'Municipal Council', 'Nagar Panchayat', 'Gram Panchayat', 'All'],
      default: 'All',
    },
    ward: {
      type: String,
      trim: true,
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    departmentName: {
      type: String,
      trim: true,
    },
    permissions: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active',
    },
    requiresPasswordChange: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },
    createdBy: {
      type: String,
      default: 'SYSTEM',
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
adminSchema.methods.matchPassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

// Check if locked out
adminSchema.methods.isLocked = function () {
  return !!(this.lockoutUntil && this.lockoutUntil > Date.now());
};

// Increment failed attempts & lock if >= 5
adminSchema.methods.incLoginAttempts = async function () {
  // If lockout expired, reset
  if (this.lockoutUntil && this.lockoutUntil < Date.now()) {
    this.failedLoginAttempts = 1;
    this.lockoutUntil = undefined;
    return this.save();
  }

  this.failedLoginAttempts += 1;
  // Lock for 15 minutes after 5 consecutive failures
  if (this.failedLoginAttempts >= 5 && !this.isLocked()) {
    this.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
  }
  return this.save();
};

// Reset failed attempts upon successful login
adminSchema.methods.resetLoginAttempts = async function (ip) {
  this.failedLoginAttempts = 0;
  this.lockoutUntil = undefined;
  this.lastLogin = new Date();
  if (ip) this.lastLoginIp = ip;
  return this.save();
};

export default mongoose.model('Admin', adminSchema);
