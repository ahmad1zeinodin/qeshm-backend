import { useState, useEffect } from 'react';
import api from '../lib/axios';

export function useJobOffer() {
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    const checkForJobs = async () => {
      try {
        // این API باید در بک‌اند ساخته شود تا آخرین درخواست در حال ارجاع را برگرداند
        const res = await api.get('/jobs/current-offer');
        if (res.data.success && res.data.data) {
          setActiveJob(res.data.data);
        } else {
          setActiveJob(null);
        }
      } catch (err) {
        // اگر خطایی داد، یعنی درخواستی نیست
      }
    };

    // هر ۵ ثانیه یک بار چک کن
    const interval = setInterval(checkForJobs, 5000);
    checkForJobs(); // بار اول هم چک کن

    return () => clearInterval(interval);
  }, []);

  return { activeJob, setActiveJob };
}
