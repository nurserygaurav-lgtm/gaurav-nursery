import mongoose from 'mongoose';

const restockSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'ordered', 'received', 'cancelled'],
      default: 'pending',
      index: true
    },
    expectedAt: Date,
    receivedAt: Date,
    note: String
  },
  { timestamps: true }
);

export default mongoose.model('Restock', restockSchema);
