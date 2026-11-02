import { useState, useEffect } from 'react';
import { Plus, Trash2, ImagePlus, Loader2, Edit2 } from 'lucide-react';
import api from '../../lib/axios';

export default function ServicesContent() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchServices = async () => {
    try {
      // ✅ آدرس صحیح: /worker-content/me
      const res = await api.get('/worker-content/me');
      if (res.data.success) setServices(res.data.data.services || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return alert('نام خدمت و قیمت الزامی است.');
    try {
      if (editingId) {
        // ✅ آدرس صحیح ویرایش: /worker-content/me/services/:id
        await api.put(`/worker-content/me/services/${editingId}`, {
          ...form,
          price: Number(form.price)
        });
        alert('✅ خدمت ویرایش شد.');
        setEditingId(null);
      } else {
        // ✅ آدرس صحیح ثبت: /worker-content/me
        await api.post('/worker-content/me', {
          type: 'services',
          item: { ...form, price: Number(form.price) }
        });
        alert('✅ خدمت اضافه شد.');
      }
      setForm({ title: '', description: '', price: '', image: '' });
      fetchServices();
    } catch (err) { alert('خطا در ثبت: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('مطمئنی؟')) return;
    try {
      // ✅ آدرس صحیح حذف: /worker-content/me/services/:id
      await api.delete(`/worker-content/me/services/${itemId}`);
      fetchServices();
    } catch (err) { alert('خطا در حذف'); }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      price: item.price || '',
      image: item.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', price: '', image: '' });
  };

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> {editingId ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">نام خدمت</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-1">اجرت (تومان)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-1">عکس (اختیاری)</label><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-bold mb-1">توضیحات (اختیاری)</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="flex gap-2">
            <button type="submit" disabled={uploading} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {editingId ? 'ذخیره تغییرات' : 'ثبت خدمت'}</button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="bg-stone-200 text-stone-800 px-4 py-2 rounded-lg font-bold">انصراف</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">لیست خدمات فعلی</h2>
        {services.length === 0 ? (
          <p className="text-stone-500 text-center py-4">هنوز خدمتی ثبت نکردی.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(item => (
              <div key={item._id} className="flex items-center gap-4 p-4 border rounded-xl bg-stone-50">
                {item.image ? <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" /> : <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center"><ImagePlus className="w-6 h-6 text-stone-400" /></div>}
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-sm font-bold text-violet-700 mt-1">{item.price.toLocaleString()} تومان</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditClick(item)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}