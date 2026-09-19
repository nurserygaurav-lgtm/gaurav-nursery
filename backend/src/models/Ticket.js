import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    publicId: String
  },
  { _id: false }
);

const replySchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['seller', 'admin'],
      required: true
    },
    message: { type: String, required: true, trim: true },
    attachments: [attachmentSchema]
  },
  { timestamps: true, _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        'Product Issue',
        'Order Problem',
        'Payment Settlement',
        'Delivery Issue',
        'Technical Bug',
        'Bulk Upload Error',
        'Account Verification',
        'Inventory Problem'
      ],
      required: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved', 'closed'],
      default: 'open'
    },
    attachments: [attachmentSchema],
    replies: [replySchema],
    orderId: String,
    productId: String
  },
  { timestamps: true }
);

ticketSchema.pre('save', async function generateTicketId(next) {
  if (this.ticketId) return next();

  try {
    const lastTicket = await this.constructor.findOne({ ticketId: /^GN-TKT-/ })
      .sort({ createdAt: -1 })
      .select('ticketId')
      .lean();

    const nextNum = lastTicket?.ticketId?.match(/(\d+)$/)?.[1]
      ? Number(lastTicket.ticketId.match(/(\d+)$/)[1]) + 1
      : 1001;

    this.ticketId = `GN-TKT-${nextNum}`;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Ticket', ticketSchema);
