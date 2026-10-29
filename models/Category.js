import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // نام شاخه (مثلاً امور منزل)
  mainField: { type: String, required: true }, // فیلد اصلی (مثلاً خدمات، رستوران)
  icon: { type: String, default: '' },
  depositAmount: { type: Number, default: 0 }, // مبلغ بیعانه
  taxPercent: { type: Number, default: 0 }, // درصد مالیات
  showTax: { type: Boolean, default: false }, // نمایش مالیات
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Category', categorySchema);