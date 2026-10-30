import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainField: { type: String, required: true }, // نام فیلد اصلی
  icon: { type: String, default: '' },
  depositPercent: { type: Number, default: 30 },
  commissionPercent: { type: Number, default: 10 },
  taxPercent: { type: Number, default: 10 },
  showTax: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Category', categorySchema);