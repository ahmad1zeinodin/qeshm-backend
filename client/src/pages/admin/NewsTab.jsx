import { useState, useEffect } from 'react';
import { Plus, Trash2, Newspaper } from 'lucide-react';
import api from '../../lib/axios';

export default function NewsTab() {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', image: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // دریافت لیست اخبار و دسته‌بندی‌های فیلد «اخبار»
  const fetchData = async () => {
    try {
      const [newsRes, catsRes] = await Promise.all([
        api.get('/news'),
        api.get('/categories?mainField=اخبار')
      ]);
      if (newsRes.data.success) setNewsList(newsRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
    } catch (err) {
      console.error('خطا در دریافت اطلاعات:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.category) return alert('عنوان، متن و دسته‌بندی الزامی است.');
    try {
      await api.post('/news', form);
      alert('✅ خبر با موفقیت ثبت شد.');
      setForm({ title: '', content: '', image: '', category: '' });
      fetchData();
    } catch (err) {
      alert('❌ خطا در ثبت خبر: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('مطمئنی؟')) return;
    try {
      await api.delete(`/news/${id}`);
      fetchData();
    } catch (err) {
      alert('خطا در حذف خبر');
    }
  };

  if (loading) return <div className="text-center py-10 font-bold text-stone-500">در حال بارگذاری اخبار...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Newspaper className="w-5 h-5" /> ثبت خبر جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">عنوان خبر</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثلاً: افتتاحیه بزرگ..." className="w-full border rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">دسته‌بندی (زیرشاخه)</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required>
                <option value="">انتخاب دسته‌بندی...</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">عکس خبر</label>
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg px-3 py-2 text-sm" />
              {form.image && <img src={form.image} alt="پیش‌نمایش" className="w-10 h-10 object-cover rounded" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">متن خبر</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows="4" required></textarea>
          </div>
          <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> ثبت خبر</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsList.map(item => (
          <div key={item._id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{item.content}</p>
              <div className="text-xs text-stone-400 mt-3 border-t pt-2 flex items-center gap-1">
                <span>دسته:</span>
                <span className="font-bold text-stone-600">{item.category || 'عمومی'}</span>
                <span className="mx-1">|</span>
                <span>نویسنده: {item.authorId?.name || 'نامشخص'}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg mt-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {newsList.length === 0 && (
          <div className="col-span-2 text-center py-10 bg-stone-50 rounded-xl border text-stone-500">
            هنوز خبری ثبت نشده است.
          </div>
        )}
      </div>
    </div>
  );
}