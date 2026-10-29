import mongoose from 'mongoose';

const mainFieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // نام فیلد اصلی (مثلاً خدمات، رستوران)
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('MainField', mainFieldSchema);