import { useState, useEffect } from 'react';
import { Settings, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';

export default function SiteSettings() {
  const [formData, setFormData] = useState({
    aboutUs: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/settings', formData);
      if (res.data.success) {
        setMessage('✅ تنظیمات با موفقیت ذخیره شد.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5 text-violet-600" /> تنظیمات سایت
      </h2>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">متن درباره ما</label>
          <textarea name="aboutUs" value={formData.aboutUs} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" rows="4"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">شماره تماس</label>
            <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">ایمیل</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">آدرس دفتر</label>
          <input type="text" name="contactAddress" value={formData.contactAddress} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" /> {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </button>
      </form>
    </div>
  );
}
