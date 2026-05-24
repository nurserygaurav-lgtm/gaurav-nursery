import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required() {
        return this.loginProvider === 'email';
      },
      minlength: 6
    },
    avatar: String,
    loginProvider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email'
    },
    googleId: String,
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer'
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    isActive: { type: Boolean, default: true },
    sellerProfile: {
      shopName: String,
      businessAddress: String,
      isApproved: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
