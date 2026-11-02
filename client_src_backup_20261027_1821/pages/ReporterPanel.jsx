import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { Send, Image as ImageIcon, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function ReporterPanel() {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);

      await api.post('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ خبر با موفقیت ارسال شد و در انتظار تایید ادمین است.');
      setTitle('');
      setContent('');
      setImage(null);
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'reporter') {
    return <div className="text-center py-20 text-stone-500">شما دسترسی به این صفحه ندارید.</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title="پنل خبرنگار" description="ارسال خبر جدید" url="/reporter" />
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-xl font-bold text-stone-800 mb-6 border-b pb-3">ارسال خبر جدید</h1>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">عنوان خبر</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">متن خبر</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" rows="5" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">عکس خبر (اختیاری)</label>
              <div className="flex items-center gap-2 border border-stone-300 rounded-lg px-3 py-2 bg-white">
                <ImageIcon className="w-4 h-4 text-stone-400" />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm focus:outline-none" accept="image/*" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> {loading ? 'در حال ارسال...' : 'ارسال خبر'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
