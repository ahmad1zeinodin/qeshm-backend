import { useState, useEffect } from 'react';
import { ShoppingBag, Wallet, Clock, ArrowDownToLine, Bell, PhoneCall, ShieldAlert } from 'lucide-react';
import api from '../../lib/axios';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [withdrawals, setWithdrawals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // فرم برداشت
  const [amount, setAmount] = useState('');
  const [sheba, setSheba] = useState('');

  const fetchData = async () => {
    try {
      const [ordersRes, walletRes, withdrawRes, notifRes] = await Promise.all([
        api.get('/orders'),
        api.get('/wallet'),
        api.get('/wallet/withdrawals'),
        api.get('/notifications')
      ]);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (walletRes.data.success) setWallet(walletRes.data.data);
      if (withdrawRes.data.success) setWithdrawals(withdrawRes.data.data);
      if (notifRes.data.success) setNotifications(notifRes.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!amount || !sheba) return;
    try {
      await api.post('/wallet/withdrawals', { amount: Number(amount), sheba });
      alert('✅ درخواست برداشت ثبت شد.');
      setAmount('');
      setSheba('');
      fetchData();
    } catch (err) { alert('❌ خطا: ' + (err.response?.data?.message || err.message)); }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className="text-center py-20 text-xl font-bold">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl">
      <div className="w-64 bg-white border-l border-stone-200 min-h-screen p-4">
        <h1 className="text-xl font-black text-orange-500 mb-6">پنل کاربری</h1>
        <div className="space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'orders' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
            <ShoppingBag className="w-5 h-5" /> سفارشات من
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'wallet' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
            <Wallet className="w-5 h-5" /> کیف پول
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'notifications' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
            <div className="flex items-center gap-3"><Bell className="w-5 h-5" /> صندوق پیام</div>
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
          </button>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 mt-4">خروج</button>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* دکمه تماس فوری */}
          <div className="bg-red-50 p-4 rounded-2xl border border-red-200 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-700">پشتیبانی ۲۴ ساعته</h3>
                <p className="text-sm text-red-600">در صورت بروز هرگونه مشکل، بلافاصله تماس بگیرید.</p>
              </div>
            </div>
            <a href="tel:09120000000" className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700">
              <PhoneCall className="w-5 h-5" /> تماس فوری
            </a>
          </div>

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">سفارشات من</h2>
              {orders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border">هنوز سفارشی ثبت نکرده‌اید.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map(o => (
                    <div key={o._id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                      <div>
                        <h3 className="font-bold">{o.serviceTitle}</h3>
                        <p className="text-sm text-stone-500">{o.address}</p>
                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded mt-1 inline-block">مبلغ کل: {o.basePrice?.toLocaleString()} تومان</span>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' : o.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {o.status === 'pending' ? 'در انتظار' : o.status === 'completed' ? 'انجام شده' : 'لغو شده'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-violet-600 to-pink-500 p-6 rounded-2xl text-white shadow-lg">
                <span className="text-sm opacity-80 block mb-1">موجودی کیف پول</span>
                <span className="text-4xl font-black">{wallet.balance.toLocaleString()} <span className="text-lg font-normal">تومان</span></span>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><ArrowDownToLine className="w-5 h-5 text-red-600" /> درخواست برداشت وجه</h3>
                <form onSubmit={handleWithdraw} className="flex flex-col md:flex-row gap-3">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="مبلغ درخواستی (تومان)" className="flex-1 border rounded-lg px-3 py-2 text-sm" required />
                  <input type="text" value={sheba} onChange={e => setSheba(e.target.value)} placeholder="شماره شبا (IR...)" className="flex-1 border rounded-lg px-3 py-2 text-sm" required />
                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm">ثبت درخواست</button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-violet-600" /> تاریخچه درخواست‌های برداشت</h3>
                {withdrawals.length === 0 ? (
                  <p className="text-center text-stone-500 py-4">هنوز درخواست برداشتی ثبت نکرده‌اید.</p>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map(w => (
                      <div key={w._id} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div>
                          <span className="text-sm font-bold block">{w.amount.toLocaleString()} تومان</span>
                          <span className="text-xs text-stone-500">شبا: {w.sheba}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${w.status === 'pending' ? 'bg-amber-100 text-amber-700' : w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {w.status === 'pending' ? 'در انتظار' : w.status === 'approved' ? 'تایید شده' : 'رد شده'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-stone-500" /> تاریخچه تراکنش‌ها</h3>
                {wallet.transactions?.length === 0 ? (
                  <p className="text-center text-stone-500 py-4">هنوز تراکنشی ثبت نشده است.</p>
                ) : (
                  <div className="space-y-3">
                    {wallet.transactions?.map((t, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div><span className="text-sm font-bold block">{t.description || (t.type === 'deposit' ? 'شارژ' : 'برداشت')}</span><span className="text-xs text-stone-500">{new Date(t.createdAt).toLocaleDateString('fa-IR')}</span></div>
                        <span className={`font-bold ${['deposit', 'refund'].includes(t.type) ? 'text-green-600' : 'text-red-500'}`}>{['deposit', 'refund'].includes(t.type) ? '+' : '-'}{t.amount.toLocaleString()} تومان</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">صندوق پیام</h2>
              {notifications.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border">صندوق پیام شما خالی است.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {notifications.map(n => (
                    <div key={n._id} onClick={() => markAsRead(n._id)} className={`p-4 rounded-xl border cursor-pointer shadow-sm ${n.isRead ? 'bg-white' : 'bg-violet-50 border-violet-200'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold ${n.isRead ? 'text-stone-700' : 'text-violet-800'}`}>{n.title}</h3>
                        <span className="text-xs text-stone-400">{new Date(n.createdAt).toLocaleDateString('fa-IR')}</span>
                      </div>
                      <p className="text-sm text-stone-600">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}