import { useState, useEffect } from 'react';
import { Plus, Trash2, ImagePlus, Loader2, Package } from 'lucide-react';
import api from '../../lib/axios';

export default function WholesaleContent() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', stock: '', minOrder: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.get('/worker-content/me');
      if (res.data.success) setItems(res.data.data.products || []); // از فیلد products استفاده میکنیم
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => { setForm(prev => ({ ...prev, image: reader.result })); setUploading(false); };
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return alert('نام محصول و قیمت الزامی است.');
    try {
      await api.post('/worker-content/me', { type: 'products', item: { ...form, price: Number(form.price), stock: Number(form.stock) || 0, minOrder: Number(form.minOrder) || 1 } });
      alert('✅ محصول عمده اضافه شد.');
      setForm({ title: '', description: '', price: '', stock: '', minOrder: '', image: '' });
      fetchItems();
    } catch (err) { alert('خطا در ثبت: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('مطمئنی؟')) return;
    try { await api.delete(`/worker-content/me/products/${itemId}`); fetchItems(); } catch (err) { alert('خطا'); }
  };

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> افزودن محصول عمده جدید</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">نام محصول</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-1">قیمت عمده (تومان)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-1">موجودی</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">حداقل سفارش (تعداد)</label><input type="number" value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">عکس</label><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-bold mb-1">توضیحات (اختیاری)</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <button type="submit" disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} ثبت محصول عمده</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">محصولات عمده من</h2>
        {items.length === 0 ? <p className="text-stone-500 text-center py-4">هنوز محصولی ثبت نکردی.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item._id} className="flex items-center gap-4 p-4 border rounded-xl bg-stone-50">
                {item.image ? <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" /> : <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center"><Package className="w-6 h-6 text-stone-400" /></div>}
                <div className="flex-1"><h3 className="font-bold text-sm">{item.title}</h3><p className="text-sm font-bold text-violet-700 mt-1">{item.price.toLocaleString()} تومان</p></div>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}