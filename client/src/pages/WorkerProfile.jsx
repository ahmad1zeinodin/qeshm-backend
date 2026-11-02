import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Phone, ShoppingBag, Newspaper, Home, Ticket, Package } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../lib/axios';

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // دریافت اطلاعات سفیر
    api.get(`/workers/${id}`).then(res => {
      if (res.data.success) setWorker(res.data.data);
    }).catch(console.error);

    // دریافت سرویس‌های سفیر از API (آدرس صحیح: /services/worker/...)
    api.get(`/services/worker/${id}`).then(res => {
      if (res.data.success) setServices(res.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  if (!worker) return <div className="min-h-screen flex items-center justify-center">سفیر پیدا نشد.</div>;

  const handleOrder = (service) => {
    navigate(`/dashboard/client/request?serviceId=${service._id}&workerId=${worker._id}&serviceName=${encodeURIComponent(service.title)}&price=${service.price}`);
  };

  const renderContent = () => {
    if (services.length === 0) {
      return (
        <div className="bg-white p-6 rounded-2xl border text-center text-stone-500">
          خدمتی ثبت نشده است.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-r-4 border-orange-500 pr-3">لیست خدمات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 bg-stone-100 flex items-center justify-center rounded-lg">
                <ShoppingBag className="w-6 h-6 text-stone-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-stone-800">{item.title}</h3>
                <p className="text-sm font-black text-violet-700 mt-1">{item.price.toLocaleString()} تومان</p>
              </div>
              <button
                onClick={() => handleOrder(item)}
                className="bg-violet-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-violet-700 transition"
              >
                رزرو
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
        <Link to="/services" className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-6">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </Link>
        
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
                {worker.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-stone-400" /> {worker.phone}</span>}
              </div>
            </div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}