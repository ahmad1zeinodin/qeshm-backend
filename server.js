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
import userRoutes from './routes/users.js';
import workerRoutes from './routes/workers.js';
import businessRoutes from './routes/businesses.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import walletRoutes from './routes/wallet.js';
import reviewRoutes from './routes/reviews.js';
import verifyRoutes from './routes/verify.js';
import settingsRoutes from './routes/settings.js';
import ticketRoutes from './routes/tickets.js';
import vendorRoutes from './routes/vendor.js';
import liveClassRoutes from './routes/liveclasses.js';
import shopRoutes from './routes/shop.js';
import consultationRoutes from './routes/consultations.js';
import categoryRoutes from './routes/categories.js';
import jobRoutes from './routes/jobs.js';
import groupRoutes from './routes/groups.js';
import notificationRoutes from './routes/notifications.js';
import subscriptionRoutes from './routes/subscriptions.js';
import newsRoutes from './routes/news.js';
import orderRoutes from './routes/orders.js';
import financeRoutes from './routes/finance.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/finance', financeRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
// webhook active
