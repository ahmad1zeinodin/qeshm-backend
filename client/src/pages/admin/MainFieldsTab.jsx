import { useState, useEffect } from 'react';
import { Plus, Edit2, Check, X } from 'lucide-react';
import api from '../../lib/axios';

export default function MainFieldsTab() {
  const [fields, setFields] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  // ۱. گرفتن لیست فیلدها از بک‌اند
  const fetchFields = async () => {
    try {
      const res = await api.get('/categories/main-fields');
      if (res.data.success) setFields(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFields(); }, []);

  // ۲. ثبت فیلد جدید
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await api.post('/categories/main-fields', { name: newName, isActive: true });
      setNewName('');
      fetchFields(); // لیست رو آپدیت میکنه
    } catch (err) {
      alert('خطا در ثبت: ' + (err.response?.data?.message || err.message));
    }
  };

  // ۳. ذخیره اسم ویرایش شده
  const handleSaveEdit = async (id) => {
    if (!editName) return;
    try {
      await api.put(`/categories/main-fields/${id}`, { name: editName });
      setEditingId(null);
      fetchFields();
    } catch (err) {
      alert('خطا در ویرایش');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <h2 className="text-lg font-bold mb-6">مدیریت فیلدهای اصلی</h2>

      {/* فرم ثبت فیلد جدید */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newName} 
          onChange={e => setNewName(e.target.value)} 
          placeholder="نام فیلد جدید (مثلاً آموزش)" 
          className="flex-1 border rounded-lg px-4 py-2 text-sm" 
        />
        <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> افزودن
        </button>
      </form>

      {/* لیست فیلدهای ساخته شده */}
      <div>
        <h3 className="text-sm font-bold text-stone-500 mb-3">فیلدهای تعریف شده:</h3>
        {loading ? (
          <p className="text-sm text-stone-400">در حال بارگذاری...</p>
        ) : fields.length === 0 ? (
          <p className="text-sm text-stone-400">هنوز هیچ فیلدی تعریف نکردی.</p>
        ) : (
          <div className="space-y-2">
            {fields.map(f => (
              <div key={f._id} className="flex items-center justify-between p-3 border rounded-xl bg-stone-50">
                {editingId === f._id ? (
                  // حالت ویرایش
                  <div className="flex items-center gap-2 flex-1">
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      className="flex-1 border rounded-lg px-3 py-1.5 text-sm" 
                    />
                    <button onClick={() => handleSaveEdit(f._id)} className="bg-green-600 text-white p-1.5 rounded-lg"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingId(null)} className="bg-red-600 text-white p-1.5 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  // حالت نمایش
                  <>
                    <span className="font-bold text-sm">{f.name}</span>
                    <button 
                      onClick={() => { setEditingId(f._id); setEditName(f.name); }} 
                      className="text-stone-500 hover:text-violet-600 p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}