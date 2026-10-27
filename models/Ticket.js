import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['client', 'admin'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userPhone: { type: String },
  userEmail: { type: String },
  subject: { type: String, default: 'درخواست پشتیبانی' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  messages: [messageSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Ticket', ticketSchema);
