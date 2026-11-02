import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import api from '../lib/axios'; // ✅ مسیر اصلاح شد (یک پله به عقب)
import { useAuthStore } from '../store/authStore'; // ✅ مسیر اصلاح شد (یک پله به عقب)

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success && res.data.data.user.role === 'admin') {
        login(res.data.data.user, res.data.data.token);
        navigate('/admin1410');
      } else {
        setError('شما دسترسی ادمین ندارید.');
      }
    } catch (err) {
      console.log("Login Error details:", err);
      setError(err.response?.data?.message || 'خطا در ورود. ایمیل یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-stone-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-700">
        <div className="flex flex-col items-center mb-6">
          <Shield className="w-12 h-12 text-violet-500 mb-3" />
          <h1 className="text-2xl font-bold text-white">ورود به پنل مدیریت</h1>
          <p className="text-stone-400 text-sm mt-1">فقط برای مدیران سیستم</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-500 text-left dir-ltr"
              placeholder="admin@qeshminoo.ir"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-500 text-left dir-ltr"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-colors">
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}