import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // خبرنگار
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // وضعیت تایید
  reporterFee: { type: Number, default: 0 }, // مبلغ پرداختی به خبرنگار
  publishedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('News', newsSchema);
