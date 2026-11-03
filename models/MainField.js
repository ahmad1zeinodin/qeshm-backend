import mongoose from 'mongoose';

const mainFieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '' }, // آدرس عکس یا آیکون
  isActive: { type: Boolean, default: true }, // نمایش یا عدم نمایش در سایت
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('MainField', mainFieldSchema);