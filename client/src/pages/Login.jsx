import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { User } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'ایمیل یا شماره تلفن الزامی است'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر'),
});

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post('/auth/login', data),
    onSuccess: (response) => {
      // ✅ درست خواندن توکن از پاسخ سرور
      const { user, accessToken } = response.data.data;
      
      // ✅ ذخیره توکن در لوکال استوریج
      localStorage.setItem('accessToken', accessToken);
      
      // ✅ ذخیره در استور
      login(user, accessToken);
      
      if (user.role === 'admin') navigate('/admin1410');
      else if (user.role === 'worker') navigate('/dashboard/worker');
      else navigate('/dashboard/client');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'خطا در ورود');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-stone-50" dir="rtl">
      <SEO title="ورود" description="ورود به قشمی نو" url="/login" />
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">ورود به حساب</h1>
          <p className="text-sm text-stone-500 mt-1">برای استفاده از خدمات وارد شوید</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">ایمیل یا شماره تلفن</label>
            <input {...register('email')} type="text" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="example@email.com یا 09120000000" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">رمز عبور</label>
            <input {...register('password')} type="password" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="••••••" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex justify-between items-center text-xs">
            <Link to="/forgot-password" className="text-violet-600 hover:underline">فراموشی رمز عبور؟</Link>
          </div>
          <button type="submit" disabled={mutation.isPending} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold hover:bg-violet-700 transition-colors disabled:opacity-50">
            {mutation.isPending ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
        
        <p className="text-center text-sm text-stone-500 mt-6">
          حساب ندارید؟ <Link to="/register" className="text-violet-600 font-bold">ثبت‌نام</Link>
        </p>
      </div>
    </div>
  );
}