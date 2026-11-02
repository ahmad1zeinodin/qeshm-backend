import { useState } from 'react';

export default function OrdersTab({ orders, mainFields }) {
  const [selectedField, setSelectedField] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter(o => {
    // فیلتر فیلد اصلی (فعلاً چون در سفارشات ذخیره نشده، بر اساس نام خدمت یا فیلد چک می‌کنیم - این بخش در آینده با بک‌اند دقیق‌تر می‌شود)
    const matchesField = selectedField === 'all' || o.serviceTitle?.includes(selectedField) || o.mainField === selectedField;
    
    // فیلتر وضعیت
    let matchesStatus = true;
    if (filterStatus === 'active') matchesStatus = ['pending', 'accepted', 'in_progress'].includes(o.status);
    if (filterStatus === 'cancelled') matchesStatus = o.status === 'cancelled';
    if (filterStatus === 'completed') matchesStatus = o.status === 'completed';

    return matchesField && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* بخش فیلترها */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1">فیلد اصلی</label>
            <select value={selectedField} onChange={e => setSelectedField(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm min-w-[150px]">
              <option value="all">همه بخش‌ها</option>
              {mainFields.map(f => <option key={f._id} value={f.name}>{f.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1">وضعیت سفارش</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm min-w-[150px]">
              <option value="all">همه سفارشات</option>
              <option value="active">در جریان / آنلاین</option>
              <option value="completed">تکمیل شده</option>
              <option value="cancelled">کنسل شده</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm font-bold text-stone-500 mt-4 md:mt-0">
          تعداد کل: {filteredOrders.length} سفارش
        </div>
      </div>

      {/* جدول سفارشات */}
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-stone-100">
            <tr>
              <th className="p-3">خدمت / فیلد</th>
              <th className="p-3">مشتری</th>
              <th className="p-3">وضعیت</th>
              <th className="p-3">تاریخ</th>
              <th className="p-3">دلیل کنسلی</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o._id} className="border-t hover:bg-stone-50">
                <td className="p-3 font-bold text-sm">{o.serviceTitle || '---'}</td>
                <td className="p-3 text-sm">{o.clientId?.name || '---'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                    o.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-stone-500">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</td>
                <td className="p-3 text-sm text-red-500">
                  {o.status === 'cancelled' ? (o.cancelReason || 'نامشخص') : '---'}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-stone-500">سفارشی با این فیلتر یافت نشد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}