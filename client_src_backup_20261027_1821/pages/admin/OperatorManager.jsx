import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { UserPlus, Shield, CheckCircle, XCircle } from 'lucide-react';

const PERMISSIONS = [
  { key: 'orders', label: 'مدیریت سفارشات' },
  { key: 'finance', label: 'مدیریت مالی' },
  { key: 'news', label: 'مدیریت اخبار' },
  { key: 'users', label: 'مدیریت کاربران' },
  { key: 'categories', label: 'مدیریت خدمات' },
  { key: 'vendors', label: 'مدیریت فروشندگان' },
];

export default function OperatorManager() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState({});
  const [message, setMessage] = useState('');

  const { data: operators = [], isLoading } = useQuery({
    queryKey: ['adminOperators'],
    queryFn: () => api.get('/admin/operators').then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post('/admin/operators', data),
    onSuccess: () => {
      setMessage('✅ اپراتور با موفقیت اضافه شد.');
      setName(''); setEmail(''); setPassword(''); setPermissions({});
      qc.invalidateQueries(['adminOperators']);
    },
    onError: (err) => {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage('نام، ایمیل و رمز عبور الزامی است.');
      return;
    }
    mutation.mutate({ name, email, password, adminPermissions: permissions });
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
        <Shield className="w-5 h-5 text-violet-600" /> مدیریت اپراتورها
      </h2>

      {message && <div className={`p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{message}</div>}

      {/* فرم افزودن اپراتور جدید */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-800 flex items-center gap-2"><UserPlus className="w-4 h-4" /> افزودن اپراتور جدید</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-xs font-bold text-stone-600 mb-1">نام</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-bold text-stone-600 mb-1">ایمیل</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-bold text-stone-600 mb-1">رمز عبور</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-2">دسترسی‌ها (تیک بزنید):</label>
          <div className="flex flex-wrap gap-4">
            {PERMISSIONS.map((p) => (
              <label key={p.key} className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
                <input type="checkbox" checked={!!permissions[p.key]} onChange={() => togglePermission(p.key)} className="w-4 h-4 accent-violet-600" />
                {p.label}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={mutation.isPending} className="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-violet-700 disabled:opacity-50">
          {mutation.isPending ? 'در حال ثبت...' : 'افزودن اپراتور'}
        </button>
      </form>

      {/* لیست اپراتورها */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100 border-b">
            <tr>
              <th className="p-3 font-bold">نام</th>
              <th className="p-3 font-bold">ایمیل</th>
              <th className="p-3 font-bold">دسترسی‌ها</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op) => (
              <tr key={op._id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="p-3">{op.name}</td>
                <td className="p-3">{op.email}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(op.adminPermissions || {}).filter(([_, v]) => v).map(([k]) => (
                      <span key={k} className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                        {PERMISSIONS.find(p => p.key === k)?.label || k}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
