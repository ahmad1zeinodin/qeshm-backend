import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Phone, ShoppingBag, Home, Utensils, Ticket } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [worker, setWorker] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/register');
      return;
    }

    api.get(`/workers/${id}`).then(res => {
      if (res.data.success) setWorker(res.data.data);
    }).catch(console.error);

    api.get(`/workers/${id}`).then(res => {
      const w = res.data.data;
      if (!w) return;

      let url = '';
      if (w.mainField === 'خدمات' || w.mainField === 'تفریح و سرگرمی') {
        url = `/services/worker/${id}`;
      } else if (w.mainField === 'رستوران') {
        url = `/menus/worker/${id}`; 
      } else if (w.mainField === 'فروشگاه' || w.mainField === 'فروش عمده' || w.mainField === 'هتل و اقامتگاه') {
        url = `/workers/${id}/products`;
      }

      if (url) {
        api.get(url).then(itemRes => {
          if (itemRes.data.success) setItems(itemRes.data.data);
        }).catch(console.error);
      }
    }).catch(console.error);

    api.get(`/orders/check-payment/${id}`).then(res => {
      if (res.data.success) setHasPaid(res.data.hasPaid);
    }).catch(console.error).finally(() => setLoading(false));

  }, [id, user, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  if (!worker) return <div className="min-h-screen flex items-center justify-center">سفیر پیدا نشد.</div>;

  const handleAction = (item) => {
    // ✅ همه رو به ClientRequest می‌فرستیم، ولی نوع رو مشخص می‌کنیم
    let type = 'service';
    if (worker.mainField === 'هتل و اقامتگاه') type = 'hotel';
    else if (worker.mainField === 'فروشگاه' || worker.mainField === 'فروش عمده' || worker.mainField === 'رستوران') type = 'shop';

    navigate(`/dashboard/client/request?serviceId=${item._id}&workerId=${worker._id}&serviceName=${encodeURIComponent(item.title)}&price=${item.price}&type=${type}`);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/services');
    }
  };

  const getSectionTitle = () => {
    switch (worker.mainField) {
      case 'خدمات': return 'لیست خدمات';
      case 'رستوران': return 'منوی غذا';
      case 'فروشگاه': return 'محصولات فروشگاه';
      case 'فروش عمده': return 'محصولات عمده';
      case 'هتل و اقامتگاه': return 'اتاق‌های هتل';
      case 'تفریح و سرگرمی': return 'برنامه‌ها و بلیط‌ها';
      default: return 'لیست خدمات';
    }
  };

  const getButtonLabel = () => {
    if (worker.mainField === 'هتل و اقامتگاه' || worker.mainField === 'تفریح و سرگرمی' || worker.mainField === 'خدمات') return 'رزرو';
    return 'خرید';
  };

  const renderContent = () => {
    if (items.length === 0) {
      return (
        <div className="bg-white p-6 rounded-2xl border text-center text-stone-500">
          هنوز آیتمی در این بخش ثبت نشده است.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-r-4 border-orange-500 pr-3">{getSectionTitle()}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 bg-stone-100 flex items-center justify-center rounded-lg">
                {worker.mainField === 'رستوران' ? <Utensils className="w-6 h-6 text-stone-300" /> : 
                 worker.mainField === 'هتل و اقامتگاه' ? <Home className="w-6 h-6 text-stone-300" /> :
                 worker.mainField === 'تفریح و سرگرمی' ? <Ticket className="w-6 h-6 text-stone-300" /> :
                 <ShoppingBag className="w-6 h-6 text-stone-300" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-stone-800">{item.title}</h3>
                <p className="text-sm font-black text-violet-700 mt-1">{item.price.toLocaleString()} تومان</p>
              </div>
              <button
                onClick={() => handleAction(item)}
                className="bg-violet-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-violet-700 transition"
              >
                {getButtonLabel()}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title={worker.name} description={worker.bio} url={`/pro/${id}`} />
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={handleBack}
          className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-6"
        >
          <ArrowRight className="w-4 h-4" /> بازگشت
        </button>
        
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-md">
              {worker.profilePhoto ? <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full rounded-full object-cover" /> : '👤'}
            </div>
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-2xl font-black text-stone-800 mb-2">{worker.name}</h1>
              <p className="text-stone-500 mb-3">{worker.bio || 'متخصص خدمات'}</p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-stone-600">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-stone-400" /> {worker.district || 'قشم'}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {worker.rating || 'جدید'}</span>
                
                {hasPaid && worker.phone && (
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    <Phone className="w-4 h-4" /> {worker.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}