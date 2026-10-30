import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'wallet', 'system', 'support'], default: 'system' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);