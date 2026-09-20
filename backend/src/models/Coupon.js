import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FLAT'], default: 'PERCENTAGE' },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0.0 },
    maxDiscount: { type: Number },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);
