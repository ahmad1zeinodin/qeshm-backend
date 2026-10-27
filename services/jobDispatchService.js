import User from '../models/User.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

const activeTimers = new Map();

export async function dispatchJobToNextWorker(jobId) {
  try {
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'pending') return;

    // ۱. پیدا کردن سفیران واجد شرایط (آنلاین، تایید شده، بدون بدهی)
    let candidates = await User.find({
      role: 'worker',
      isOnline: true,
      isSuspended: false,
      _id: { $nin: job.dispatchedTo || [] },
    }).sort({ acceptanceRate: -1, rating: -1 }); // اولویت: نرخ پذیرش و سپس امتیاز

    if (candidates.length === 0) {
      console.log('No eligible workers found for job ' + jobId);
      return;
    }

    const nextWorker = candidates[0];

    job.status = 'dispatching';
    job.currentCandidate = nextWorker._id;
    job.dispatchedTo = [...(job.dispatchedTo || []), nextWorker._id];
    job.offerExpiresAt = new Date(Date.now() + 10000); // ۱۰ ثانیه
    await job.save();

    // ۲. ارسال نوتیفیکیشن با مبلغ، آدرس و شرح کار
    await Notification.create({
      userId: nextWorker._id,
      type: 'new_job_offer',
      message: `درخواست جدید: ${job.title} - مبلغ سهم شما: ${job.vendorShare?.toLocaleString() || job.agreedRate.toLocaleString()} تومان - آدرس: ${job.address}`,
      jobId: job._id,
    });

    console.log('Job ' + jobId + ' dispatched to worker ' + nextWorker._id);

    if (activeTimers.has(jobId)) clearTimeout(activeTimers.get(jobId));

    const timer = setTimeout(async () => {
      const currentJob = await Job.findById(jobId);
      if (currentJob && currentJob.status === 'dispatching' && String(currentJob.currentCandidate) === String(nextWorker._id)) {
        // اگر ۱۰ ثانیه گذشت و پاسخی نداد، به نفر بعدی برود
        await dispatchJobToNextWorker(jobId);
      }
      activeTimers.delete(jobId);
    }, 10000);

    activeTimers.set(jobId, timer);

  } catch (err) {
    console.error('Error in dispatchJobToNextWorker:', err);
  }
}
