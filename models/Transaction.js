import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'online'], required: true },
  totalAmount: { type: Number, required: true },
  platformCommission: { type: Number, required: true },
  vendorShare: { type: Number, required: true },
  customerReceipt: { type: String },
  platformReceipt: { type: String },
  vendorReceipt: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
