import { useState, useEffect } from 'react';
import { Plus, Trash2, ImagePlus, Loader2, Newspaper } from 'lucide-react';
import api from '../../lib/axios';

export default function NewsContent() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await api.get('/worker-content/me');
      if (res.data.success) setNews(res.data.data.news || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

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
    if (!form.title || !form.content) return alert('عنوان و متن الزامی است.');
    try {
      await api.post('/worker-content/me', { type: 'news', item: form });
      alert('✅ خبر اضافه شد.');
      setForm({ title: '', content: '', image: '' });
      fetchNews();
    } catch (err) { alert('خطا در ثبت: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('مطمئنی؟')) return;
    try { await api.delete(`/worker-content/me/news/${itemId}`); fetchNews(); } catch (err) { alert('خطا'); }
  };

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Newspaper className="w-5 h-5" /> ثبت خبر جدید</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div><label className="block text-sm font-bold mb-1">عنوان خبر</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
          <div><label className="block text-sm font-bold mb-1">عکس (اختیاری)</label><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-bold mb-1">متن خبر</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows="4" className="w-full border rounded-lg px-3 py-2 text-sm" required></textarea></div>
          <button type="submit" disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} ثبت خبر</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">اخبار من</h2>
        {news.length === 0 ? <p className="text-stone-500 text-center py-4">هنوز خبری ثبت نکردی.</p> : (
          <div className="space-y-3">
            {news.map(item => (
              <div key={item._id} className="flex items-center gap-4 p-4 border rounded-xl bg-stone-50">
                {item.image ? <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" /> : <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center"><Newspaper className="w-6 h-6 text-stone-400" /></div>}
                <div className="flex-1"><h3 className="font-bold text-sm">{item.title}</h3></div>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}