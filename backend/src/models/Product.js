import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'rejected', 'archived'],
      default: 'draft'
    },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
