import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors({
  origin: ['https://qeshminoo.ir', 'http://qeshminoo.ir', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import walletRoutes from './routes/wallet.js';
import reviewRoutes from './routes/reviews.js';
import verifyRoutes from './routes/verify.js';
import settingsRoutes from './routes/settings.js';
import skillRoutes from './routes/skills.js';
import newsRoutes from './routes/news.js';
import ticketRoutes from './routes/tickets.js';
import vendorRoutes from './routes/vendor.js';
import categoryRoutes from './routes/categories.js';
import jobRoutes from './routes/jobs.js';

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/news', newsRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
// webhook active
