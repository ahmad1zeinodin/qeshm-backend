import { useState } from 'react';
import { Plus, Trash2, ShieldCheck, Key, Fingerprint, X } from 'lucide-react';
import api from '../../lib/axios';

const PERMISSIONS_LIST = [
  { key: 'dashboard', label: 'داشبورد' },
  { key: 'mainFields', label: 'فیلد اصلی' },
  { key: 'categories', label: 'زیرشاخه' },
  { key: 'workers', label: 'سفیران' },
  { key: 'orders', label: 'سفارشات' },
  { key: 'users', label: 'کاربران' },
  { key: 'finance', label: 'مدیریت مالی' },
  { key: 'support', label: 'پشتیبانی' },
  { key: 'news', label: 'اخبار' },
  { key: 'settings', label: 'تنظیمات' },
];

export default function EmployeesTab({ employees, fetchData }) {
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', password: '', personnelNumber: '', jobTitle: '', maritalStatus: 'single', emergencyPhone: '', nationalId: '',
    adminPermissions: { dashboard: false, mainFields: false, categories: false, workers: false, orders: false, users: false, finance: false, support: false, news: false, settings: false },
    documents: { nationalCardPhoto: '', birthCertificatePhoto: '' }
  });
  
  const [selectedEmpForPass, setSelectedEmpForPass] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handlePermissionChange = (key) => {
    setForm(prev => ({
      ...prev,
      adminPermissions: { ...prev.adminPermissions, [key]: !prev.adminPermissions[key] }
    }));
  };

  const handleImageUpload = (e, docKey) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, documents: { ...prev.documents, [docKey]: reader.result } }));
    reader.readAsDataURL(file);
  };

  // ✅ تابع برای حذف عکس
  const handleRemoveImage = (docKey) => {
    setForm(prev => ({ ...prev, documents: { ...prev.documents, [docKey]: '' } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return alert('نام، ایمیل و رمز عبور الزامی است.');
    try {
      await api.post('/employees', form);
      alert('✅ همکار ثبت شد.');
      setForm({ name: '', email: '', phone: '', password: '', personnelNumber: '', jobTitle: '', maritalStatus: 'single', emergencyPhone: '', nationalId: '', adminPermissions: { dashboard: false, mainFields: false, categories: false, workers: false, orders: false, users: false, finance: false, support: false, news: false, settings: false }, documents: { nationalCardPhoto: '', birthCertificatePhoto: '' } });
      fetchData();
    } catch (err) { alert('❌ خطا: ' + (err.response?.data?.message || err.message)); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!selectedEmpForPass || !newPassword) return alert('رمز عبور جدید را وارد کنید.');
    try {
      await api.post('/auth/change-password', { targetUserId: selectedEmpForPass._id, newPassword });
      alert('✅ رمز عبور با موفقیت تغییر کرد.');
      setSelectedEmpForPass(null);
      setNewPassword('');
    } catch (err) { alert('❌ خطا در تغییر رمز: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('مطمئنی؟')) return;
    try { await api.delete(`/employees/${id}`); fetchData(); } catch (err) { alert('خطا'); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">ثبت‌نام همکار جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">نام و نام خانوادگی</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-1">ایمیل (نام کاربری)</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-1">شماره تماس</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">رمز عبور</label><input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-1">شماره پرسنلی</label><input type="text" value={form.personnelNumber} onChange={e => setForm({ ...form, personnelNumber: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">عنوان سمت</label><input type="text" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">کد ملی</label><input type="text" value={form.nationalId} onChange={e => setForm({ ...form, nationalId: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">شماره اضطراری</label><input type="text" value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">وضعیت تأهل</label><select value={form.maritalStatus} onChange={e => setForm({ ...form, maritalStatus: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="single">مجرد</option><option value="married">متأهل</option></select></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">عکس کارت ملی</label>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'nationalCardPhoto')} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              {form.documents.nationalCardPhoto && (
                <div className="relative">
                  <img src={form.documents.nationalCardPhoto} alt="پیش‌نمایش" className="w-10 h-10 object-cover rounded" />
                  {/* ✅ دکمه X برای پاک کردن عکس */}
                  <button type="button" onClick={() => handleRemoveImage('nationalCardPhoto')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">عکس شناسنامه</label>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'birthCertificatePhoto')} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              {form.documents.birthCertificatePhoto && (
                <div className="relative">
                  <img src={form.documents.birthCertificatePhoto} alt="پیش‌نمایش" className="w-10 h-10 object-cover rounded" />
                  {/* ✅ دکمه X برای پاک کردن عکس */}
                  <button type="button" onClick={() => handleRemoveImage('birthCertificatePhoto')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-violet-600" /> سطح دسترسی به بخش‌ها</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {PERMISSIONS_LIST.map(p => (
                <label key={p.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.adminPermissions[p.key]} onChange={() => handlePermissionChange(p.key)} className="w-4 h-4 accent-violet-600" />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2 flex items-center gap-2"><Fingerprint className="w-5 h-5 text-green-600" /> احراز هویت (هدا)</h3>
            <p className="text-xs text-stone-500 mb-2">برای ثبت‌نام نهایی، همکار باید از طریق سامانه هدا احراز هویت شود.</p>
            <button type="button" onClick={() => alert('اتصال به سامانه هدا در حال آماده‌سازی است.')} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm border border-blue-200">شروع فرآیند احراز هویت</button>
          </div>

          <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 mt-4"><Plus className="w-4 h-4" /> ثبت همکار</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map(emp => (
          <div key={emp._id} className="bg-white p-4 rounded-xl border shadow-sm relative">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{emp.name}</h3>
                <p className="text-sm text-stone-500">{emp.email} | {emp.phone}</p>
                <p className="text-xs text-stone-400 mt-1">شماره پرسنلی: {emp.personnelNumber || '---'} | سمت: {emp.jobTitle || '---'}</p>
              </div>
              <button onClick={() => handleDelete(emp._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1 mb-8">
              {Object.entries(emp.adminPermissions || {}).filter(([_, val]) => val).map(([key]) => (
                <span key={key} className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded">
                  {PERMISSIONS_LIST.find(p => p.key === key)?.label || key}
                </span>
              ))}
            </div>
            
            <button onClick={() => setSelectedEmpForPass(emp)} className="absolute bottom-3 left-3 text-xs flex items-center gap-1 text-stone-500 hover:text-violet-600 bg-stone-50 px-2 py-1 rounded border">
              <Key className="w-3 h-3" /> تغییر رمز
            </button>
          </div>
        ))}
      </div>

      {selectedEmpForPass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">تغییر رمز {selectedEmpForPass.name}</h3>
              <button onClick={() => setSelectedEmpForPass(null)} className="text-stone-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleChangePassword}>
              <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="رمز عبور جدید" className="w-full border rounded-lg px-3 py-2 text-sm mb-4" />
              <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-bold">ثبت رمز جدید</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}