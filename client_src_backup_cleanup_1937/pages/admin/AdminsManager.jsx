import { useState, useEffect } from 'react';
import { Users, UserPlus, CheckCircle, Calendar, Shield } from 'lucide-react';
import api from '../../lib/axios';

const PERMISSION_LABELS = {
  dashboard: 'نمای کلی',
  users: 'مدیریت کاربران',
  categories: 'مدیریت خدمات',
  vendors: 'مدیریت سفیران',
  addVendor: 'ثبت‌نام سفیر',
  orders: 'مدیریت سفارشات',
  settings: 'تنظیمات سایت',
  tickets: 'پشتیبانی',
};

export default function AdminsManager() {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', adminRoleTitle: '',
    adminPermissions: {
      dashboard: false, users: false, categories: false, vendors: false,
      addVendor: false, orders: false, settings: false, tickets: false,
    },
    accessStart: new Date().toISOString().split('T')[0],
    accessEnd: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin/sub-admins');
      if (res.data.success) setAdmins(res.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handlePermissionChange = (key) => {
    setFormData(prev => ({
      ...prev,
      adminPermissions: { ...prev.adminPermissions, [key]: !prev.adminPermissions[key] }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('نام، ایمیل و رمز عبور الزامی است.');
      return;
    }
    try {
      const res = await api.post('/admin/sub-admins', formData);
      if (res.data.success) {
        setMessage('✅ ادمین جدید با موفقیت ساخته شد.');
        setShowForm(false);
        setFormData({
          name: '', email: '', password: '', adminRoleTitle: '',
          adminPermissions: { dashboard: false, users: false, categories: false, vendors: false, addVendor: false, orders: false, settings: false, tickets: false },
          accessStart: new Date().toISOString().split('T')[0],
          accessEnd: '',
        });
        fetchAdmins();
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-600" /> مدیریت ادمین‌ها
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-violet-700">
          <UserPlus className="w-4 h-4" /> افزودن ادمین جدید
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {/* فرم ساخت ادمین */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-800 border-b pb-2">اطلاعات ادمین جدید</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">نام و نام خانوادگی</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">عنوان سمت</label>
              <input type="text" value={formData.adminRoleTitle} onChange={(e) => setFormData({...formData, adminRoleTitle: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="مثلاً: مدیر مالی" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">ایمیل</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">رمز عبور</label>
              <input type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> تاریخ شروع دسترسی</label>
              <input type="date" value={formData.accessStart} onChange={(e) => setFormData({...formData, accessStart: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> تاریخ پایان دسترسی (اختیاری)</label>
              <input type="date" value={formData.accessEnd} onChange={(e) => setFormData({...formData, accessEnd: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-bold text-sm text-stone-800 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-violet-600" /> دسترسی‌ها</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer bg-stone-50 p-2 rounded-lg border border-stone-200 hover:bg-stone-100">
                  <input type="checkbox" checked={formData.adminPermissions[key]} onChange={() => handlePermissionChange(key)} className="w-4 h-4 accent-violet-600" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-stone-500 text-sm px-4 py-2 hover:bg-stone-200 rounded-lg">لغو</button>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700"><CheckCircle className="w-4 h-4" /> ساخت ادمین</button>
          </div>
        </form>
      )}

      {/* لیست ادمین‌ها */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100 border-b">
            <tr>
              <th className="p-3 font-bold">نام</th>
              <th className="p-3 font-bold">عنوان سمت</th>
              <th className="p-3 font-bold">ایمیل</th>
              <th className="p-3 font-bold">دسترسی‌ها</th>
              <th className="p-3 font-bold">تاریخ شروع</th>
              <th className="p-3 font-bold">تاریخ پایان</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-6 text-center text-stone-500">در حال بارگذاری...</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-stone-500">هیچ ادمینی یافت نشد.</td></tr>
            ) : (
              admins.map(admin => (
                <tr key={admin._id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-3 font-bold text-stone-800">{admin.name}</td>
                  <td className="p-3"><span className="bg-violet-50 text-violet-700 px-2 py-0.5 rounded text-xs">{admin.adminRoleTitle || 'بدون عنوان'}</span></td>
                  <td className="p-3 text-stone-600">{admin.email}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(admin.adminPermissions || {}).filter(([_, v]) => v).map(([key]) => (
                        <span key={key} className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded">{PERMISSION_LABELS[key]}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-xs text-stone-500">{admin.accessStart ? new Date(admin.accessStart).toLocaleDateString('fa-IR') : '-'}</td>
                  <td className="p-3 text-xs text-stone-500">{admin.accessEnd ? new Date(admin.accessEnd).toLocaleDateString('fa-IR') : 'نامحدود'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
