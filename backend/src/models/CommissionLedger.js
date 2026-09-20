import mongoose from 'mongoose';

const commissionLedgerSchema = new mongoose.Schema(
  {
    subOrderId: { type: String, required: true },
    subOrderNumber: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderAmount: { type: Number, required: true },
    commissionRate: { type: Number, default: 0.10 },
    platformFee: { type: Number, required: true },
    sellerGross: { type: Number, required: true },
    refundAmount: { type: Number, default: 0.0 },
    sellerPayable: { type: Number, required: true },
    settlementStatus: {
      type: String,
      enum: ['PENDING_DELIVERY', 'ELIGIBLE_FOR_PAYOUT', 'PAYOUT_REQUESTED', 'SETTLED'],
      default: 'PENDING_DELIVERY'
    },
    payoutId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('CommissionLedger', commissionLedgerSchema);
