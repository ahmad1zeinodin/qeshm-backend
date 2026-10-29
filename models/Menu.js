import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  path: { type: String, default: '' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Menu', menuSchema);