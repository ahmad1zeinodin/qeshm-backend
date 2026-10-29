import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // نام دسته (مثلاً امور منزل)
  icon: { type: String, default: '' },
  depositAmount: { type: Number, default: 0 }, // مبلغ بیعانه (تعیین شده توسط ادمین)
  taxPercent: { type: Number, default: 0 }, // درصد مالیات بر ارزش افزوده
  showTax: { type: Boolean, default: false }, // آیا مالیات نمایش داده شود؟
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Category', categorySchema);