import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { ShoppingBag, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';

export default function OrdersManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [vendorTypeFilter, setVendorTypeFilter] = useState('all');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['adminOrders', filter],
    queryFn: () => api.get(`/orders${filter !== 'all' ? `?status=${filter}` : ''}`).then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/orders/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries(['adminOrders']),
  });

  if (isLoading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-violet-600" /> مدیریت سفارشات
        </h2>
        <div className="flex gap-2">
          <select value={vendorTypeFilter} onChange={(e) => setVendorTypeFilter(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm">
            <option value="all">همه بخش‌ها</option>
            <option value="restaurant">رستوران‌ها</option>
            <option value="shop">سوپرمارکت‌ها</option>
            <option value="attraction">جاذبه‌ها</option>
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm">
          <option value="all">همه سفارشات</option>
          <option value="pending">در انتظار تایید</option>
          <option value="accepted">تایید شده</option>
          <option value="delivered">تحویل شده</option>
          <option value="cancelled">لغو شده</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-stone-500 bg-white rounded-xl border">هیچ سفارشی یافت نشد.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">{order.vendorName}</h3>
                  <span className="text-xs text-stone-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString('fa-IR')}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {order.status === 'pending' ? 'در انتظار' : order.status === 'accepted' ? 'تایید شده' : order.status === 'delivered' ? 'تحویل شده' : 'لغو شده'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-stone-600"><User className="w-4 h-4" /> مشتری: {order.userId?.name || 'نامشخص'}</div>
                <div className="flex items-center gap-2 text-stone-600"><MapPin className="w-4 h-4" /> آدرس: {order.address}</div>
              </div>

              <div className="bg-stone-50 p-3 rounded-lg mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-stone-600 mb-1">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{(item.price * item.quantity).toLocaleString()} تومان</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t">
                  <span>مجموع:</span>
                  <span>{order.finalAmount.toLocaleString()} تومان</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => mutation.mutate({ id: order._id, status: 'accepted' })} className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> تایید</button>
                <button onClick={() => mutation.mutate({ id: order._id, status: 'cancelled' })} className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center justify-center gap-1"><XCircle className="w-4 h-4" /> لغو</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
