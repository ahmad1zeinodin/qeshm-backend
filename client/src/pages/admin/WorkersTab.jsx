import { useState, useEffect } from 'react';
import { Plus, UserCheck, ShieldCheck, Key, Search, X, Download, Edit2, Trash2 } from 'lucide-react';
import api from '../../lib/axios';

export default function WorkersTab({ workers, mainFields, categories, fetchData }) {
  const [form, setForm] = useState({ 
    name: '', phone: '', password: '', nationalId: '', emergencyPhone: '', 
    sheba: '', adminBadgeText: '', mainField: '', categoryId: '', maritalStatus: 'single',
    documents: { nationalCardPhoto: '', birthCertificatePhoto: '', businessLicense: '', skillCertificate: '' }
  });
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [selectedWorkerForPass, setSelectedWorkerForPass] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (form.mainField) setFilteredCategories(categories.filter(c => c.mainField === form.mainField));
    else setFilteredCategories([]);
  }, [form.mainField, categories]);

  const handleImageUpload = (e, docKey) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, documents: { ...prev.documents, [docKey]: reader.result } }));
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (docKey) => {
    setForm(prev => ({ ...prev, documents: { ...prev.documents, [docKey]: '' } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return alert('نام و شماره تماس الزامی است.');
    try {
      if (editingWorker) {
        // ✅ در حالت ویرایش، فقط فیلدهای ضروری رو می‌فرستیم
        await api.put(`/admin/workers/${editingWorker._id}`, {
          name: form.name,
          phone: form.phone,
          nationalId: form.nationalId,
          emergencyPhone: form.emergencyPhone,
          sheba: form.sheba,
          adminBadgeText: form.adminBadgeText,
          mainField: form.mainField,
          categoryId: form.categoryId,
          maritalStatus: form.maritalStatus
        });
        alert('✅ اطلاعات سفیر ویرایش شد.');
        setEditingWorker(null);
      } else {
        if (!form.password) return alert('رمز عبور الزامی است.');
        await api.post('/admin/workers', form);
        alert('✅ سفیر ثبت شد.');
      }
      setForm({ name: '', phone: '', password: '', nationalId: '', emergencyPhone: '', sheba: '', adminBadgeText: '', mainField: '', categoryId: '', maritalStatus: 'single', documents: { nationalCardPhoto: '', birthCertificatePhoto: '', businessLicense: '', skillCertificate: '' } });
      setShowAddForm(false);
      fetchData();
    } catch (err) { alert('❌ خطا: ' + (err.response?.data?.message || err.message)); }
  };

  const handleEditClick = (worker) => {
    setEditingWorker(worker);
    setShowAddForm(true);
    setForm({
      name: worker.name || '',
      phone: worker.phone || '',
      password: '',
      nationalId: worker.nationalId || '',
      emergencyPhone: worker.emergencyPhone || '',
      sheba: worker.sheba || '',
      adminBadgeText: worker.adminBadgeText || '',
      mainField: worker.mainField || '',
      categoryId: worker.categoryId || '',
      maritalStatus: worker.maritalStatus || 'single',
      documents: worker.documents || { nationalCardPhoto: '', birthCertificatePhoto: '', businessLicense: '', skillCertificate: '' }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('مطمئنی؟')) return;
    try { await api.delete(`/admin/workers/${id}`); fetchData(); } catch (err) { alert('خطا در حذف'); }
  };

  const exportToCSV = () => {
    const headers = ['ردیف', 'نام', 'کد ملی', 'تلفن', 'شبا'];
    const rows = searchedWorkers.map((w, index) => [index + 1, w.name, w.nationalId || '---', w.phone, w.sheba || '---']);
    let csvContent = "\uFEFF" + headers.join(",") + "\n";
    rows.forEach(row => { csvContent += row.join(",") + "\n"; });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "workers.csv";
    link.click();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!selectedWorkerForPass || !newPassword) return alert('رمز عبور جدید را وارد کنید.');
    try {
      await api.post('/auth/change-password', { targetUserId: selectedWorkerForPass._id, newPassword });
      alert('✅ رمز عبور با موفقیت تغییر کرد.');
      setSelectedWorkerForPass(null);
      setNewPassword('');
    } catch (err) { alert('❌ خطا در تغییر رمز: ' + (err.response?.data?.message || err.message)); }
  };

  // ✅ اصلاح جستجو با مقاوم‌سازی در برابر undefined
  const searchedWorkers = workers.filter(w => {
    const name = w.name || '';
    const phone = w.phone || '';
    return name.includes(searchQuery) || phone.includes(searchQuery);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <Search className="w-5 h-5 text-stone-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="جستجو..." className="flex-1 outline-none text-sm" />
          {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 flex-1 md:flex-none"><Download className="w-4 h-4" /> خروجی اکسل</button>
          <button onClick={() => { setShowAddForm(!showAddForm); setEditingWorker(null); setForm({ name: '', phone: '', password: '', nationalId: '', emergencyPhone: '', sheba: '', adminBadgeText: '', mainField: '', categoryId: '', maritalStatus: 'single', documents: { nationalCardPhoto: '', birthCertificatePhoto: '', businessLicense: '', skillCertificate: '' } }); }} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 flex-1 md:flex-none"><Plus className="w-4 h-4" /> ثبت سفیر جدید</button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4">{editingWorker ? 'ویرایش سفیر' : 'ثبت‌نام سفیر جدید'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold mb-1">نام و نام خانوادگی</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
              <div><label className="block text-sm font-bold mb-1">شماره تماس</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
              {!editingWorker && <div><label className="block text-sm font-bold mb-1">رمز عبور</label><input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>}
              <div><label className="block text-sm font-bold mb-1">کد ملی</label><input type="text" value={form.nationalId} onChange={e => setForm({ ...form, nationalId: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-bold mb-1">شماره شبا</label><input type="text" value={form.sheba} onChange={e => setForm({ ...form, sheba: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-bold mb-1">شماره اضطراری</label><input type="text" value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-bold mb-1">وضعیت تأهل</label><select value={form.maritalStatus} onChange={e => setForm({ ...form, maritalStatus: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="single">مجرد</option><option value="married">متأهل</option></select></div>
              <div><label className="block text-sm font-bold mb-1">فیلد اصلی</label><select value={form.mainField} onChange={e => setForm({ ...form, mainField: e.target.value, categoryId: '' })} className="w-full border rounded-lg px-3 py-2 text-sm" required><option value="">انتخاب فیلد اصلی...</option>{mainFields.map(f => <option key={f._id} value={f.name}>{f.name}</option>)}</select></div>
              <div><label className="block text-sm font-bold mb-1">زیرشاخه</label><select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required disabled={!form.mainField}><option value="">{form.mainField ? 'انتخاب زیرشاخه...' : 'اول فیلد اصلی را انتخاب کنید'}</option>{filteredCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
              <div className="flex items-center gap-2"><div className="flex-1"><label className="block text-sm font-bold mb-1">عکس کارت ملی</label><input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'nationalCardPhoto')} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>{form.documents.nationalCardPhoto && <div className="relative"><img src={form.documents.nationalCardPhoto} alt="پیش‌نمایش" className="w-10 h-10 object-cover rounded" /><button type="button" onClick={() => handleRemoveImage('nationalCardPhoto')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button></div>}</div>
              <div className="flex items-center gap-2"><div className="flex-1"><label className="block text-sm font-bold mb-1">عکس شناسنامه</label><input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'birthCertificatePhoto')} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>{form.documents.birthCertificatePhoto && <div className="relative"><img src={form.documents.birthCertificatePhoto} alt="پیش‌نمایش" className="w-10 h-10 object-cover rounded" /><button type="button" onClick={() => handleRemoveImage('birthCertificatePhoto')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button></div>}</div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" /> احراز هویت (هدا)</h3>
              <button type="button" onClick={() => alert('اتصال به سامانه هدا در حال آماده‌سازی است.')} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm border border-blue-200">شروع فرآیند احراز هویت</button>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold">{editingWorker ? 'ذخیره تغییرات' : 'ثبت سفیر'}</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-stone-200 px-4 py-2 rounded-lg font-bold">انصراف</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-stone-100">
            <tr><th className="p-3">#</th><th className="p-3">نام</th><th className="p-3">کد ملی</th><th className="p-3">تلفن</th><th className="p-3">عملیات</th></tr>
          </thead>
          <tbody>
            {searchedWorkers.map((w, index) => (
              <tr key={w._id} className="border-t hover:bg-stone-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-bold">{w.name}</td>
                <td className="p-3">{w.nationalId || '---'}</td>
                <td className="p-3">{w.phone}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEditClick(w)} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(w._id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                  <button onClick={() => setSelectedWorkerForPass(w)} className="text-amber-500 hover:bg-amber-50 p-1 rounded"><Key className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWorkerForPass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">تغییر رمز {selectedWorkerForPass.name}</h3>
              <button onClick={() => setSelectedWorkerForPass(null)} className="text-stone-400 hover:text-red-500"><X className="w-5 h-5" /></button>
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