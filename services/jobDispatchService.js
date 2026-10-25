import WorkerProfile from '../models/WorkerProfile.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

// نگهداری تایمرهای فعال (برای جلوگیری از ارسال همزمان)
const activeTimers = new Map();

export async function dispatchJobToNextWorker(jobId) {
  try {
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'pending') return;

    // پیدا کردن متخصصین واجد شرایط
    // ۱. در منطقه مشتری باشند (اولویت اول)
    // ۲. آنلاین و آماده به کار باشند (acceptingWork: true)
    // ۳. تعلیق نشده باشند (isSuspended: false)
    // ۴. بدهی نداشته باشند (debtAmount: 0)
    // ۵. قبلاً درخواست برایشان ارسال نشده باشد
    
    const query = {
      category: job.category,
      acceptingWork: true,
      isSuspended: false,
      debtAmount: { $lte: 0 },
      _id: { $nin: job.dispatchedTo || [] },
    };

    // اول متخصصین در همان منطقه را جستجو می‌کنیم
    let candidates = await WorkerProfile.find({
      ...query,
      serviceDistricts: job.location?.district, // اگر منطقه مشتری مشخص باشد
    }).sort({ starLevel: -1, skillScore: -1 });

    // اگر در آن منطقه کسی نبود، کل جزیره را جستجو می‌کنیم
    if (candidates.length === 0) {
      candidates = await WorkerProfile.find(query).sort({ starLevel: -1, skillScore: -1 });
    }

    if (candidates.length === 0) {
      // کسی پیدا نشد، درخواست در حالت pending می‌ماند
      console.log(`No eligible workers found for job ${jobId}`);
      return;
    }

    // انتخاب نفر اول (بالاترین ستاره در نزدیک‌ترین منطقه)
    const nextWorker = candidates[0];
    
    // به‌روزرسانی وضعیت سفارش
    job.status = 'dispatching';
    job.currentCandidate = nextWorker._id;
    job.dispatchedTo = [...(job.dispatchedTo || []), nextWorker._id];
    job.offerExpiresAt = new Date(Date.now() + 10000); // ۱۰ ثانیه فرصت
    await job.save();

    // ارسال نوتیفیکیشن به متخصص
    await Notification.create({
      userId: nextWorker.userId,
      type: 'new_job_offer',
      message: `درخواست خدمت جدید: ${job.title} - ۱۰ ثانیه فرصت پاسخ`,
      jobId: job._id,
    });

    console.log(`Job ${jobId} dispatched to worker ${nextWorker._id}`);

    // تنظیم تایمر ۱۰ ثانیه‌ای
    if (activeTimers.has(jobId)) {
      clearTimeout(activeTimers.get(jobId));
    }

    const timer = setTimeout(async () => {
      const currentJob = await Job.findById(jobId);
      // اگر هنوز در حالت dispatching است و همان متخصص هنوز پاسخ نداده
      if (currentJob && currentJob.status === 'dispatching' && String(currentJob.currentCandidate) === String(nextWorker._id)) {
        console.log(`Timeout for job ${jobId}, dispatching to next worker`);
        // به نفر بعدی ارسال کن
        await dispatchJobToNextWorker(jobId);
      }
      activeTimers.delete(jobId);
    }, 10000);

    activeTimers.set(jobId, timer);

  } catch (err) {
    console.error('Error in dispatchJobToNextWorker:', err);
  }
}
