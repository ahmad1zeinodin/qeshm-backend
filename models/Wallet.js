import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['deposit', 'withdraw', 'payment', 'earning'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    createdAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('Wallet', walletSchema);
