import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceTitle: { type: String, required: true },
  items: [{ name: String, price: Number, quantity: Number }],
  
  // مبالغ (به ریال)
  basePrice: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  
  // تسویه
  depositAmount: { type: Number, default: 0 }, // بیعانه پرداخت شده
  commissionAmount: { type: Number, default: 0 }, // سهم پلتفرم
  workerShare: { type: Number, default: 0 }, // سهم سفیر (از بیعانه)
  
  // وضعیت
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  isSettled: { type: Boolean, default: false }, // آیا تسویه نهایی شده است؟
  settledAt: { type: Date, default: null }, // زمان تسویه
  
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);