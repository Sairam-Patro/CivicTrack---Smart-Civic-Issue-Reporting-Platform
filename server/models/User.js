import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    email: {
      type: String, required: [true, 'Email is required'],
      unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phone: { type: String, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role: { type: String, enum: ['citizen', 'officer', 'admin'], default: 'citizen' },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    ward: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

export default mongoose.model('User', userSchema);
