import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'https://nodejs-g0qjve.chbkn.dev/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    // خواندن توکن از استور Zustand یا در صورت نیاز از localStorage به عنوان پشتیبان
    const token = useAuthStore.getState().accessToken || localStorage.getItem('accessToken');
    
    if (token) {
      // پاکسازی کاراکترهای اضافی یا دابل کوت از دور توکن
      const cleanToken = typeof token === 'string' ? token.replace(/"/g, '') : token;
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;