import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin, FileText, DollarSign } from 'lucide-react';
import api from '../../lib/axios';
import SEO from '../../components/SEO';

const SERVICES = [
  { id: 'cleaning', name: 'نظافت و پذیرایی', icon: '🧹' },
  { id: 'repair', name: 'تعمیرات لوازم خانگی', icon: '🛠️' },
  { id: 'plumbing', name: 'لوله‌کشی و تاسیسات', icon: '🔧' },
  { id: 'electrical', name: 'برق‌کاری', icon: '⚡' },
];

export default function ClientRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service: '',
    title: '',
    description: '',
    address: '',
    district: 'قشم',
    agreedRate: '',
    preferredGender: 'any',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service || !formData.title || !formData.address || !formData.agreedRate) {
      setMessage('لطفاً همه فیلدهای ضروری را پر کنید.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/jobs', {
        ...formData,
        agreedRate: Number(formData.agreedRate),
      });
      if (res.data.success) {
        setMessage('✅ درخواست شما ثبت شد و در حال ارسال به متخصصین است...');
        setTimeout(() => navigate('/dashboard/client/requests'), 3000);
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const needsGender = ['نظافت و پذیرایی', 'مراقبت از سالمند', 'آرایش در محل'].includes(formData.service);

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="ثبت درخواست خدمت" description="درخواست متخصص" url="/dashboard/client/request" />
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <Send className="w-6 h-6 text-violet-600" /> ثبت درخواست خدمت
        </h1>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* انتخاب خدمت */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">چه خدمتی نیاز دارید؟</label>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, service: s.name })}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    formData.service === s.name ? 'border-violet-600 bg-violet-50' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <span className="text-sm font-bold">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* عنوان درخواست */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">عنوان درخواست</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="مثلاً: نظافت آپارتمان ۱۰۰ متری" required />
          </div>

          {/* توضیحات */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center gap-1"><FileText className="w-4 h-4" /> توضیحات</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows="3" placeholder="مثلاً: ۳ طبقه، ۱۵ پله، نیاز به نظافت کامل..."></textarea>
          </div>

          {/* آدرس و منطقه */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> آدرس</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="قشم، بلوار امام، کوچه ۱۲" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">منطقه</label>
              <select value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="قشم">قشم</option>
                <option value="درگهان">درگهان</option>
                <option value="رمچاه">رمچاه</option>
                <option value="لافت">لافت</option>
              </select>
            </div>
          </div>

          {/* جنسیت متخصص (فقط برای خدمات خاص) */}
          {needsGender && (
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">جنسیت متخصص</label>
              <select value={formData.preferredGender} onChange={(e) => setFormData({ ...formData, preferredGender: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="any">فرقی نمی‌کند</option>
                <option value="female">فقط خانم</option>
                <option value="male">فقط آقا</option>
              </select>
            </div>
          )}

          {/* مبلغ پیشنهادی */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4" /> مبلغ پیشنهادی (تومان)</label>
            <input type="number" value={formData.agreedRate} onChange={(e) => setFormData({ ...formData, agreedRate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="مثلاً ۵۰۰۰۰۰" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <Send className="w-5 h-5" /> {loading ? 'در حال ثبت...' : 'ثبت درخواست'}
          </button>
        </form>
      </div>
    </div>
  );
}
