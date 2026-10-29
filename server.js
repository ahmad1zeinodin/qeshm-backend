import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import skillRoutes from './routes/skills.js';
import workerRoutes from './routes/workers.js';
import settingsRoutes from './routes/settings.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import financeRoutes from './routes/finance.js';
import financeRoutes from './routes/finance.js';
import financeRoutes from './routes/finance.js';
import orderRoutes from './routes/orders.js';
import serviceRoutes from './routes/services.js';
import walletRoutes from './routes/wallet.js';

dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/finance', financeRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is ready.' });
});

// آدرس دیتابیس چابکان مستقیماً اینجاست (بدون واسطه .env)
const MONGODB_URI = 'mongodb://root:sfx3eq0sFAojrbgo@services.irn12.chabokan.net:16658/qeshm?authSource=admin';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB Error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
