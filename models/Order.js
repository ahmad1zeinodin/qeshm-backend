import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // ✅ اضافه شد
  serviceTitle: { type: String, required: true },
  items: [{ name: String, price: Number, quantity: Number }],
  
  basePrice: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  
  depositAmount: { type: Number, default: 0 },
  commissionAmount: { type: Number, default: 0 },
  workerShare: { type: Number, default: 0 },
  
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  isSettled: { type: Boolean, default: false },
  settledAt: { type: Date, default: null },
  
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);