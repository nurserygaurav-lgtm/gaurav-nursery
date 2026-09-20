import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: String,
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: '/shop' },
    badgeText: String,
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);
