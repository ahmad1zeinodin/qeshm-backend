import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'commission'], required: true },
  reference: { type: String, unique: true, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'success' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
