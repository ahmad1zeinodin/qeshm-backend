import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

export default function AdminLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => api.post('/auth/login', data),
    onSuccess: ({ data }) => {
      const { user, accessToken, refreshToken } = data.data;
      if (user.role === 'admin') {
        setAuth(user, accessToken, refreshToken);
        setTimeout(() => navigate('/admin1410'), 100);
      } else {
        setError('شما دسترسی ادمین ندارید.');
      }
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'خطا در ورود');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-stone-900" dir="rtl">
      <div className="w-full max-w-sm bg-stone-800 p-8 rounded-2xl shadow-lg border border-stone-700">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-violet-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">ورود به پنل مدیریت</h1>
          <p className="text-sm text-stone-400 mt-1">فقط برای مدیران سیستم</p>
        </div>

        {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-1">ایمیل</label>
            <input {...register('email')} type="email" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="admin@qeshminoo.ir" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-1">رمز عبور</label>
            <input {...register('password')} type="password" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="••••••" />
          </div>
          <button type="submit" disabled={mutation.isPending} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold hover:bg-violet-700 transition-colors disabled:opacity-50">
            {mutation.isPending ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  );
}
