import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// ... (کدهای قبلی برای ثبت سفارش و ...)

// PUT /api/jobs/:id/accept — قبول کردن کار توسط سفیر
router.put('/:id/accept', authenticateToken, requireRole('worker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'کار یافت نشد' });
    if (String(job.currentCandidate) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'این پیشنهاد برای شما نیست یا منقضی شده' });
    }

    job.status = 'accepted';
    await job.save();

    // به‌روزرسانی نرخ پذیرش سفیر
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalOffers: 1, acceptedOffers: 1 },
    });
    const user = await User.findById(req.user.id);
    user.acceptanceRate = (user.acceptedOffers / user.totalOffers) * 100;
    await user.save();

    res.json({ success: true, data: job, message: 'کار پذیرفته شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/jobs/:id/reject — رد کردن کار توسط سفیر
router.put('/:id/reject', authenticateToken, requireRole('worker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'کار یافت نشد' });
    if (String(job.currentCandidate) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'این پیشنهاد برای شما نیست' });
    }

    // به‌روزرسانی نرخ پذیرش سفیر (فقط totalOffers زیاد می‌شود)
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalOffers: 1 } });
    const user = await User.findById(req.user.id);
    user.acceptanceRate = (user.acceptedOffers / user.totalOffers) * 100;
    await user.save();

    // ارسال به نفر بعدی (منطق ارجاع)
    const { dispatchJobToNextWorker } = await import('../services/jobDispatchService.js');
    await dispatchJobToNextWorker(job._id);

    res.json({ success: true, message: 'کار رد شد و به نفر بعدی ارسال می‌شود.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
