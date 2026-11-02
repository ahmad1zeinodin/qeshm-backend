import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  district: { type: String, required: true },
  agreedRate: { type: Number, required: true },
  preferredGender: { type: String, enum: ['any', 'male', 'female'], default: 'any' }, // فیلتر جنسیت درخواستی
  status: { type: String, enum: ['pending', 'dispatching', 'accepted', 'completed', 'cancelled'], default: 'pending' },
  currentCandidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dispatchedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  offerExpiresAt: { type: Date },
  history: [{ action: String, timestamp: { type: Date, default: Date.now }, note: String }]
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
