import mongoose from 'mongoose';

const InvestmentPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['crypto', 'stocks', 'real-estate', 'forex', 'commodities'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in days
    required: true,
  },
  expectedReturn: {
    type: Number, // percentage
    required: true,
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'pending'],
    default: 'pending',
  },
  returns: [{
    date: Date,
    value: Number,
    percentage: Number,
  }],
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
InvestmentPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.InvestmentPlan || mongoose.model('InvestmentPlan', InvestmentPlanSchema);




