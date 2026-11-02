import { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle, User } from 'lucide-react';
import api from '../../lib/axios';
import SEO from '../../components/SEO';

export default function WorkerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.data.success) {
          // فقط سفارشاتی که این سفیر پذیرفته است
          const myOrders = res.data.data.filter(order => order.status === 'accepted' || order.status === 'completed');
          setOrders(myOrders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="سفارشات من" description="لیست سفارشات سفیر" url="/dashboard/worker/orders" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">سفارشات من</h1>

        {orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500">هنوز سفارشی دریافت نکرده‌اید.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-stone-800">{order.title}</h3>
                    <span className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {order.status === 'accepted' ? 'در حال انجام' : order.status === 'completed' ? 'انجام شده' : order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-stone-600 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> مشتری: {order.clientId?.name || 'نامشخص'}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> آدرس: {order.address}
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg flex justify-between items-center">
                  <span className="font-bold text-sm text-stone-700">مبلغ:</span>
                  <span className="font-black text-violet-700">{order.agreedRate?.toLocaleString()} تومان</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
