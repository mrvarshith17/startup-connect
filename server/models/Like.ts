import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  ideaId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate likes
LikeSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
