import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';

// ✅ فیلدهای ایمیل و کد ملی غیرفعال شدند
const schema = z.object({
  name: z.string().min(2, 'نام الزامی است'),
  phone: z.string().min(10, 'شماره تلفن معتبر نیست'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر'),
});

export default function Register() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post('/auth/register', { ...data, role: 'client' }),
    onSuccess: ({ data }) => {
      const { user, accessToken, refreshToken } = data.data;
      setAuth(user, accessToken, refreshToken);
      navigate('/dashboard/client');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'خطا در ثبت‌نام');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-stone-50" dir="rtl">
      <SEO title="ثبت‌نام" description="ثبت‌نام در قشمی نو" url="/register" />
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">ثبت‌نام</h1>
          <p className="text-sm text-stone-500 mt-1">برای استفاده از خدمات وارد شوید</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">نام و نام خانوادگی</label>
            <input {...register('name')} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="مثلاً: احمد" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">شماره تلفن</label>
            <input {...register('phone')} type="tel" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="09123456789" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">رمز عبور</label>
            <input {...register('password')} type="password" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="حداقل ۶ کاراکتر" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={mutation.isPending} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold hover:bg-violet-700 transition-colors disabled:opacity-50">
            {mutation.isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login" className="text-violet-600 font-bold">ورود</Link>
        </p>
      </div>
    </div>
  );
}