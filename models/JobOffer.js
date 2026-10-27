import mongoose from 'mongoose';

const jobOfferSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'], default: 'pending' },
  sentAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
});

export default mongoose.model('JobOffer', jobOfferSchema);
