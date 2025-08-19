import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'investment', 'profit', 'fee', 'bonus', 'refund'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  description: {
    type: String,
    required: true,
  },
  reference: {
    type: String, // Transaction hash, reference number, etc.
  },
  adminNotes: {
    type: String,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin who processed the transaction
  },
  processedAt: {
    type: Date,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Additional data like wallet addresses, etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
TransactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
