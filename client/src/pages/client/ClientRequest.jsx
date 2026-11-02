import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, MapPin, FileText, DollarSign, User, Phone, ShieldCheck } from 'lucide-react';
import api from '../../lib/axios';
import SEO from '../../components/SEO';

export default function ClientRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const serviceId = searchParams.get('serviceId');
  const workerId = searchParams.get('workerId');
  const serviceName = searchParams.get('serviceName');
  const basePrice = searchParams.get('price');

  const [worker, setWorker] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    district: 'قشم',
  });

  useEffect(() => {
    if (workerId) {
      api.get(`/workers/${workerId}`).then(res => {
        if (res.data.success) setWorker(res.data.data);
      }).catch(console.error);
    }
  }, [workerId]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // شبیه‌سازی پرداخت موفق (در واقعیت باید به درگاه متصل شود)
      setTimeout(() => {
        setIsPaid(true);
        setMessage('✅ پرداخت بیعانه با موفقیت انجام شد. اطلاعات کامل سفیر برای شما نمایش داده می‌شود.');
        setLoading(false);
      }, 1500);
    } catch (err) {
      setMessage('❌ خطا در پرداخت.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address) {
      setMessage('لطفاً آدرس را وارد کنید.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        serviceId,
        address: formData.address,
        description: formData.description,
        paymentMethod: 'wallet',
      });
      if (res.data.success) {
        setMessage('✅ سفارش شما با موفقیت ثبت شد.');
        setTimeout(() => navigate('/dashboard/client/requests'), 2000);
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId || !workerId) {
    return <div className="text-center py-20 text-red-500">خطا: اطلاعات سرویس یافت نشد.</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title={`رزرو ${serviceName || 'خدمت'}`} description="ثبت سفارش" url="/dashboard/client/request" />
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        
        <h1 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <Send className="w-6 h-6 text-violet-600" /> رزرو خدمت
        </h1>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {/* نمایش اطلاعات سفیر قبل از پرداخت */}
        {worker && !isPaid && (
          <div className="bg-stone-50 p-4 rounded-xl border mb-4">
            <h3 className="font-bold text-stone-700 mb-2 flex items-center gap-1"><User className="w-4 h-4" /> اطلاعات سفیر (قبل از پرداخت)</h3>
            <p className="text-sm text-stone-600">نام: {worker.name.split(' ')[0]}</p>
            <p className="text-sm text-stone-600">منطقه: {worker.district || 'قشم'}</p>
            <p className="text-sm text-stone-600">سن: {worker.age || 'نامشخص'}</p>
            <p className="text-xs text-stone-400 mt-2">برای مشاهده اطلاعات کامل و شماره تماس، ابتدا بیعانه را پرداخت کنید.</p>
          </div>
        )}

        {/* نمایش اطلاعات کامل بعد از پرداخت */}
        {worker && isPaid && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-4">
            <h3 className="font-bold text-green-800 mb-2 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> اطلاعات کامل سفیر</h3>
            <p className="text-sm text-green-800">نام کامل: {worker.name}</p>
            <p className="text-sm text-green-800">شماره تماس: {worker.phone}</p>
            <p className="text-sm text-green-800">آدرس دقیق: {worker.address || 'ثبت نشده'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> آدرس شما</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="قشم، بلوار امام، کوچه ۱۲" required disabled={isPaid} />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">توضیحات</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows="3" placeholder="توضیحات اضافی..." disabled={isPaid}></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4" /> مبلغ خدمت</label>
            <input type="text" value={Number(basePrice).toLocaleString() + ' تومان'} className="w-full border rounded-lg px-3 py-2 text-sm bg-stone-100" readOnly />
          </div>

          {!isPaid ? (
            <button type="button" onClick={handlePayment} disabled={loading} className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors disabled:opacity-50">
              {loading ? 'در حال پرداخت...' : 'پرداخت بیعانه و مشاهده اطلاعات کامل'}
            </button>
          ) : (
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50">
              {loading ? 'در حال ثبت...' : 'ثبت نهایی سفارش'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}