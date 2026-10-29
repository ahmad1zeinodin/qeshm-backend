import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceTitle: { type: String, required: true },
  description: { type: String, default: '' },
  address: { type: String, required: true },
  depositAmount: { type: Number, required: true },
  totalAmount: { type: Number, default: 0 },
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
