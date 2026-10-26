import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: String, required: true }, // شناسه رستوران/فروشگاه
  vendorName: { type: String, required: true },
  vendorType: { type: String, enum: ['restaurant', 'shop', 'attraction'], required: true },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'preparing', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
