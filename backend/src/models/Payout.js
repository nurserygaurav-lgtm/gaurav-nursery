import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    commission: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'cancelled'],
      default: 'pending',
      index: true
    },
    periodStart: Date,
    periodEnd: Date,
    paidAt: Date,
    reference: String
  },
  { timestamps: true }
);

export default mongoose.model('Payout', payoutSchema);
