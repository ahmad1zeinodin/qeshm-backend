import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nodejs-g0qjve.chbkn.dev/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    // ✅ همیشه از localStorage بخون، نه از Zustand
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;