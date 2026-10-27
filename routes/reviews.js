import express from 'express';
import Review from '../models/Review.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// POST /api/reviews — ثبت امتیاز جدید توسط مشتری
router.post('/', authenticateToken, requireRole('client'), async (req, res) => {
  try {
    const { jobId, rating, comment } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'کار یافت نشد' });
    if (job.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'فقط برای کارهای انجام شده می‌توان امتیاز ثبت کرد.' });
    }
    if (String(job.clientId) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'شما مجاز به ثبت امتیاز برای این کار نیستید.' });
    }

    const review = await Review.create({
      jobId: job._id,
      clientId: req.user.id,
      workerId: job.assignedWorkerId,
      rating,
      comment,
    });

    // به‌روزرسانی امتیاز میانگین سفیر
    const reviews = await Review.find({ workerId: job.assignedWorkerId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(job.assignedWorkerId, { rating: avgRating });

    res.status(201).json({ success: true, data: review, message: 'امتیاز ثبت شد.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
