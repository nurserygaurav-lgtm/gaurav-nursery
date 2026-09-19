import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    benefits: { type: String, trim: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, trim: true, uppercase: true, sparse: true, index: true },
    tags: [{ type: String, trim: true }],
    variants: [
      {
        label: String,
        price: Number,
        stock: Number
      }
    ],
    care: {
      height: String,
      potSize: String,
      watering: String,
      sunlight: String,
      fertilizer: String,
      difficulty: { type: String, default: 'Easy' },
      airPurification: { type: String, default: 'Helps improve indoor freshness' }
    },
    seo: {
      title: String,
      metaDescription: String,
      altText: String
    },
    codAvailable: { type: Boolean, default: true },
    deliveryDays: { type: Number, default: 5, min: 1 },
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
