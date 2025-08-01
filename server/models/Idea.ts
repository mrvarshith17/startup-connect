import mongoose, { Document, Schema } from 'mongoose';

export interface IIdea extends Document {
  title: string;
  description: string;
  category: string;
  founderId: mongoose.Types.ObjectId;
  founder: {
    name: string;
    company?: string;
  };
  likes: number;
  status: 'active' | 'funded' | 'closed';
  fundingGoal?: string;
  document?: {
    filename: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'SaaS', 'AI/ML', 'Blockchain', 'IoT', 'CleanTech', 'FoodTech', 'Mobility', 'Other']
  },
  founderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  founder: {
    name: {
      type: String,
      required: true
    },
    company: {
      type: String
    }
  },
  likes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'funded', 'closed'],
    default: 'active'
  },
  fundingGoal: {
    type: String
  },
  document: {
    filename: String,
    url: String
  }
}, {
  timestamps: true
});

// Create indexes
IdeaSchema.index({ founderId: 1 });
IdeaSchema.index({ category: 1 });
IdeaSchema.index({ status: 1 });
IdeaSchema.index({ createdAt: -1 });

export default mongoose.model<IIdea>('Idea', IdeaSchema);
