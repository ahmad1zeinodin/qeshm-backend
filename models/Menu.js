import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  title: { type: String, required: true }, // نام منو (مثلاً مدیریت مالی)
  icon: { type: String, default: '' }, // آیکون
  path: { type: String, default: '' }, // مسیر (برای لینک)
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null }, // منوی والد
  order: { type: Number, default: 0 }, // ترتیب نمایش
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Menu', menuSchema);
