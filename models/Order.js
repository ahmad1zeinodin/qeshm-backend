import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // خدمت انتخاب شده
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // دسته خدمت
  serviceTitle: { type: String, required: true },
  description: { type: String, default: '' },
  address: { type: String, required: true },
  
  // فیلدهای مالی
  basePrice: { type: Number, required: true }, // اجرت (قیمت پایه)
  depositAmount: { type: Number, required: true }, // بیعانه (از دسته گرفته می‌شود)
  taxAmount: { type: Number, default: 0 }, // مبلغ مالیات محاسبه شده
  totalPaid: { type: Number, required: true }, // مبلغ کل پرداختی (بیعانه + مالیات)
  remainingAmount: { type: Number, required: true }, // مابقی که باید به سفیر داده شود
  
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'reassigned'], 
    default: 'pending' 
  },
  reassignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);