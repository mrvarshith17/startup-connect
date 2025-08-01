import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  id: string;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  message: string;
  timestamp: Date;
}

export interface IChat extends Document {
  founderId: mongoose.Types.ObjectId;
  investorId: mongoose.Types.ObjectId;
  ideaId: mongoose.Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  id: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema: Schema = new Schema({
  founderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  messages: [MessageSchema]
}, {
  timestamps: true
});

// Create indexes
ChatSchema.index({ founderId: 1, investorId: 1, ideaId: 1 }, { unique: true });
ChatSchema.index({ founderId: 1 });
ChatSchema.index({ investorId: 1 });

export default mongoose.model<IChat>('Chat', ChatSchema);
