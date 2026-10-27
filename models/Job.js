import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  district: { type: String, required: true }, // منطقه (برای ارجاع)
  agreedRate: { type: Number, required: true }, // مبلغ کل
  vendorShare: { type: Number }, // سهم سفیر (بعد از کمیسیون)
  status: { type: String, enum: ['pending', 'dispatching', 'accepted', 'completed', 'cancelled'], default: 'pending' },
  currentCandidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // سفیر فعلی
  dispatchedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // لیست سفیرانی که پیام گرفته‌اند
  offerExpiresAt: { type: Date }, // زمان انقضای پیشنهاد (۱۰ ثانیه)
  history: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
