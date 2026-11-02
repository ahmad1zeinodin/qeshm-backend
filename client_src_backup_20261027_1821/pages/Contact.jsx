import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import api from '../lib/axios';
import SEO from '../components/SEO';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', text: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) setSettings(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text) {
      setMessage('نام و متن پیام الزامی است.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/tickets/public', formData);
      if (res.data.success) {
        setMessage('✅ پیام شما ثبت شد. به زودی پاسخ داده می‌شود.');
        setFormData({ name: '', phone: '', email: '', text: '' });
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return <div className="text-center py-20">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 py-12" dir="rtl">
      <SEO title="تماس با ما" description="راه‌های ارتباط با قشمی نو" url="/contact" />
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* اطلاعات تماس */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h1 className="text-2xl font-bold text-stone-800 mb-6 border-r-4 border-violet-500 pr-3">تماس با ما</h1>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-800 block">شماره تماس</span>
                  <span className="text-sm text-stone-600" dir="ltr">{settings.contactPhone}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-800 block">ایمیل</span>
                  <span className="text-sm text-stone-600" dir="ltr">{settings.contactEmail}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-800 block">آدرس</span>
                  <span className="text-sm text-stone-600">{settings.contactAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* فرم پشتیبانی */}
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-600" /> ارسال پیام به پشتیبانی
          </h2>
          <p className="text-sm text-stone-500 mb-6">بدون نیاز به ثبت‌نام، سوال یا پیام خود را ارسال کنید.</p>

          {message && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">نام شما</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">شماره تماس</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ایمیل</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">متن پیام</label>
              <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows="4" required></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-violet-700 disabled:opacity-50">
              <Send className="w-4 h-4" /> {loading ? 'در حال ارسال...' : 'ارسال پیام'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
