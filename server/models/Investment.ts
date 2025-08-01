import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestment extends Document {
  ideaId: mongoose.Types.ObjectId;
  investorId: mongoose.Types.ObjectId;
  investorName: string;
  amount: string;
  status: 'interested' | 'liked_back' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema: Schema = new Schema({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investorName: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['interested', 'liked_back', 'declined'],
    default: 'interested'
  }
}, {
  timestamps: true
});

// Create indexes
InvestmentSchema.index({ ideaId: 1 });
InvestmentSchema.index({ investorId: 1 });
InvestmentSchema.index({ status: 1 });

export default mongoose.model<IInvestment>('Investment', InvestmentSchema);
