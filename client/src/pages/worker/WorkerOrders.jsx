import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import api from '../../lib/axios';

export default function WorkerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(res => {
      if (res.data.success) setOrders(res.data.data);
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-stone-800 border-b pb-2">سفارشات دریافتی</h2>
      {orders.length === 0 ? (
        <div className="text-center py-10 bg-stone-50 rounded-xl border">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 font-bold">در حال حاضر سفارشی وجود ندارد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div><span className="font-bold block">{o.serviceTitle}</span><span className="text-sm text-stone-500">{o.address}</span></div>
              <span className="text-sm font-bold text-violet-700">{o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
