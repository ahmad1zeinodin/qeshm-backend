import User from '../models/User.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

const activeTimers = new Map();

export async function dispatchJobToNextWorker(jobId) {
  try {
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'pending') return;

    let baseQuery = {
      role: 'worker',
      isOnline: true,
      isSuspended: false,
      _id: { $nin: job.dispatchedTo || [] },
    };

    // فیلتر بر اساس جنسیت درخواستی
    if (job.preferredGender && job.preferredGender !== 'any') {
      baseQuery.gender = job.preferredGender;
    }

    // ۱. اول سفیران هم‌شهر مشتری را جستجو کن
    let candidates = [];
    if (job.district) {
      candidates = await User.find({ ...baseQuery, district: job.district })
        .sort({ rating: -1, acceptanceRate: -1 });
    }

    // ۲. اگر سفیر هم‌شهری نبود، از شهرهای دیگر جستجو کن
    if (candidates.length === 0) {
      candidates = await User.find(baseQuery)
        .sort({ rating: -1, acceptanceRate: -1 });
    }

    if (candidates.length === 0) {
      console.log('No eligible workers found for job ' + jobId);
      return;
    }

    const nextWorker = candidates[0];

    job.status = 'dispatching';
    job.currentCandidate = nextWorker._id;
    job.dispatchedTo = [...(job.dispatchedTo || []), nextWorker._id];
    job.offerExpiresAt = new Date(Date.now() + 10000);
    await job.save();

    await Notification.create({
      userId: nextWorker._id,
      type: 'new_job_offer',
      message: `درخواست جدید: ${job.title} - مبلغ: ${job.agreedRate.toLocaleString()} تومان - آدرس: ${job.address}`,
      jobId: job._id,
    });

    if (activeTimers.has(jobId)) clearTimeout(activeTimers.get(jobId));

    const timer = setTimeout(async () => {
      const currentJob = await Job.findById(jobId);
      if (currentJob && currentJob.status === 'dispatching' && String(currentJob.currentCandidate) === String(nextWorker._id)) {
        await dispatchJobToNextWorker(jobId);
      }
      activeTimers.delete(jobId);
    }, 10000);

    activeTimers.set(jobId, timer);

  } catch (err) {
    console.error('Error in dispatchJobToNextWorker:', err);
  }
}
