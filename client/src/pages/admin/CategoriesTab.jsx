import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import api from '../../lib/axios';

const EMOJIS = ['🧹', '🛠️', '🍔', '🏨', '🚕', '💇‍♂️', '🎉', '🎨', '💻', '🛒', '🍕', '☕'];

export default function CategoriesTab({ categories, mainFields, fetchData }) {
  const [form, setForm] = useState({ 
    name: '', mainField: '', icon: '🛠️', depositPercent: 30, commissionPercent: 10, taxPercent: 10, showTax: true 
  });

  const [fields, setFields] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchDataFromApi = async () => {
    try {
      const [fieldsRes, catsRes] = await Promise.all([
        api.get('/categories/main-fields'),
        api.get('/categories')
      ]);
      if (fieldsRes.data.success) setFields(fieldsRes.data.data);
      if (catsRes.data.success) setCategoriesList(catsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mainField) return alert('نام شاخه و فیلد اصلی الزامی است.');
    
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, {
          name: form.name,
          mainField: form.mainField,
          icon: form.icon,
          depositPercent: Number(form.depositPercent) || 0,
          commissionPercent: Number(form.commissionPercent) || 0,
          taxPercent: Number(form.taxPercent) || 0,
          showTax: form.showTax
        });
        alert('✅ شاخه ویرایش شد.');
        setEditingId(null);
      } else {
        await api.post('/categories', {
          ...form,
          depositPercent: Number(form.depositPercent) || 0,
          commissionPercent: Number(form.commissionPercent) || 0,
          taxPercent: Number(form.taxPercent) || 0
        });
        alert('✅ شاخه اضافه شد.');
      }
      
      setForm({ name: '', mainField: '', icon: '🛠️', depositPercent: 30, commissionPercent: 10, taxPercent: 10, showTax: true });
      fetchDataFromApi();
      fetchData();
    } catch (err) { alert('❌ خطا: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('مطمئنی؟')) return;
    try { 
      await api.delete(`/categories/${id}`); 
      fetchDataFromApi(); 
      fetchData();
    } catch (err) { alert('خطا'); }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      mainField: cat.mainField,
      icon: cat.icon || '🛠️',
      depositPercent: cat.depositPercent,
      commissionPercent: cat.commissionPercent,
      taxPercent: cat.taxPercent,
      showTax: cat.showTax
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', mainField: '', icon: '🛠️', depositPercent: 30, commissionPercent: 10, taxPercent: 10, showTax: true });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'ویرایش شاخه' : 'تعریف شاخه جدید'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-sm font-bold mb-1">فیلد اصلی</label>
            <select value={form.mainField} onChange={e => setForm({ ...form, mainField: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required>
              <option value="">انتخاب فیلد اصلی...</option>
              {fields.map(f => <option key={f._id} value={f.name}>{f.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">نام شاخه</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثلاً نظافت" className="w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">انتخاب آیکون (ایموجی)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {EMOJIS.map(emoji => (
                <button 
                  key={emoji} type="button" onClick={() => setForm({ ...form, icon: emoji })}
                  className={`text-2xl p-2 rounded-lg border-2 transition ${form.icon === emoji ? 'border-violet-600 bg-violet-50' : 'border-stone-200 hover:border-stone-300'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="یا آیکون دلخواه خود را اینجا کپی کنید..." className="w-full border rounded-lg px-3 py-2 text-sm text-center text-xl" />
          </div>

          <div className="grid grid-cols-3 gap-2 md:col-span-2">
            <div><label className="block text-sm font-bold mb-1">بیعانه (%)</label><input type="number" value={form.depositPercent} onChange={e => setForm({ ...form, depositPercent: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">کمیسیون (%)</label><input type="number" value={form.commissionPercent} onChange={e => setForm({ ...form, commissionPercent: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">مالیات (%)</label><input type="number" value={form.taxPercent} onChange={e => setForm({ ...form, taxPercent: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
              <input type="checkbox" checked={form.showTax} onChange={e => setForm({ ...form, showTax: e.target.checked })} className="w-4 h-4 accent-violet-600" />
              اعمال و نمایش مالیات در فاکتور
            </label>
          </div>

          <div className="md:col-span-2 flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
              {editingId ? <><Check className="w-4 h-4" /> ذخیره تغییرات</> : <><Plus className="w-4 h-4" /> افزودن شاخه</>}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-lg font-bold">انصراف</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-bold mb-4">زیرشاخه‌های تعریف شده</h3>
        {loading ? (
          <p className="text-stone-500">در حال بارگذاری...</p>
        ) : categoriesList.length === 0 ? (
          <p className="text-stone-500">هنوز زیرشاخه‌ای تعریف نشده است.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoriesList.map(c => (
              <div key={c._id} className="bg-stone-50 p-4 rounded-xl border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-4xl p-2 bg-white rounded-lg border">{c.icon || '🛠️'}</div>
                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <span className="text-xs bg-stone-200 text-stone-700 px-2 py-1 rounded mt-1 inline-block">{c.mainField}</span>
                    <div className="text-xs text-stone-500 mt-1">بیعانه: {c.depositPercent}٪ | کمیسیون: {c.commissionPercent}٪ | مالیات: {c.taxPercent}٪</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(c)} className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}