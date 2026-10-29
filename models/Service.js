import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // به کدوم دسته وصل است
  title: { type: String, required: true }, // عنوان خدمت (مثلاً تعمیر یخچال)
  description: { type: String, default: '' },
  price: { type: Number, required: true }, // اجرت (قیمت پایه) - تعیین شده توسط سفیر
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Service', serviceSchema);