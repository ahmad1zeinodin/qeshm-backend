import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/products', authenticateToken, async (req, res) => {
  try {
    const { name, price, desc, category } = req.body;
    const product = await Product.create({ vendorId: req.user.id, name, price, desc, category });
    res.status(201).json({ success: true, data: product, message: 'محصول اضافه شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    res.json({ success: true, message: 'محصول حذف شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
