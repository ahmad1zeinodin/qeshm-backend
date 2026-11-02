import { useState, useEffect } from 'react';
import { Search, User, Wallet, ShieldCheck, ShoppingBag, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import api from '../../lib/axios';

export default function SupportTab() {
  // استیت‌های مربوط به جستجوی کاربر
  const [searchPhone, setSearchPhone] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // استیت‌های مربوط به تیکت‌ها
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/admin/tickets');
      if (res.data.success) setTickets(res.data.data);
    } catch (err) {
      console.error('خطا در دریافت تیکت‌ها:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // تابع جستجوی کاربر با شماره تلفن
  const handleSearchUser = async (e) => {
    e.preventDefault();
    if (!searchPhone) return;
    setSearchLoading(true);
    setSearchError('');
    setSearchedUser(null);
    setUserOrders([]);
    
    try {
      // فرض بر این است که این روت در بک‌اند وجود دارد
      const res = await api.get(`/admin/users/search?phone=${searchPhone}`);
      if (res.data.success) {
        setSearchedUser(res.data.data.user);
        setUserOrders(res.data.data.orders || []);
      } else {
        setSearchError('کاربری با این شماره یافت نشد.');
      }
    } catch (err) {
      setSearchError('کاربری با این شماره یافت نشد یا خطایی رخ داد.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    try {
      await api.post(`/admin/tickets/${selectedTicket._id}/reply`, { message: replyText });
      alert('✅ پاسخ شما ارسال شد.');
      setReplyText('');
      fetchTickets(); 
    } catch (err) {
      alert('❌ خطا در ارسال پاسخ.');
    }
  };

  return (
    <div className="space-y-6">
      {/* بخش جستجوی کاربر */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-violet-600" /> جستجوی پروفایل کاربر</h2>
        <form onSubmit={handleSearchUser} className="flex gap-2">
          <input 
            type="text" 
            value={searchPhone} 
            onChange={e => setSearchPhone(e.target.value)} 
            placeholder="شماره تلفن کاربر را وارد کنید (مثلاً 09120000000)" 
            className="flex-1 border rounded-lg px-4 py-2 text-sm" 
          />
          <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold">جستجو</button>
        </form>

        {searchLoading && <p className="text-sm text-stone-500 mt-4">در حال جستجو...</p>}
        {searchError && <p className="text-sm text-red-500 mt-4">{searchError}</p>}

        {/* نمایش پروفایل کاربر پیدا شده */}
        {searchedUser && (
          <div className="mt-6 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border">
                <h3 className="font-bold flex items-center gap-2 mb-2"><User className="w-4 h-4" /> اطلاعات هویتی</h3>
                <p className="text-sm">نام: <span className="font-bold">{searchedUser.name}</span></p>
                <p className="text-sm">ایمیل: {searchedUser.email}</p>
                <p className="text-sm">تلفن: {searchedUser.phone}</p>
                <p className="text-sm flex items-center gap-1 mt-1">
                  وضعیت احراز هویت: 
                  {searchedUser.isVerified ? <span className="text-green-600 font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> تایید شده</span> : <span className="text-red-500 font-bold">تایید نشده</span>}
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border">
                <h3 className="font-bold flex items-center gap-2 mb-2"><Wallet className="w-4 h-4" /> وضعیت مالی</h3>
                <p className="text-sm">موجودی کیف پول: <span className="font-black text-green-600">{searchedUser.balance?.toLocaleString() || 0} ریال</span></p>
                <p className="text-sm">تعداد سفارشات: <span className="font-bold">{userOrders.length}</span></p>
              </div>
            </div>

            {/* لیست سفارشات کاربر */}
            <div className="mt-4">
              <h3 className="font-bold flex items-center gap-2 mb-2"><ShoppingBag className="w-4 h-4" /> آخرین سفارشات</h3>
              {userOrders.length === 0 ? (
                <p className="text-sm text-stone-500">این کاربر هنوز سفارشی ثبت نکرده است.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-stone-100">
                      <tr><th className="p-2">خدمت</th><th className="p-2">مبلغ</th><th className="p-2">وضعیت</th><th className="p-2">تاریخ</th></tr>
                    </thead>
                    <tbody>
                      {userOrders.map(o => (
                        <tr key={o._id} className="border-t">
                          <td className="p-2">{o.serviceTitle || '---'}</td>
                          <td className="p-2">{o.totalPrice?.toLocaleString()} ریال</td>
                          <td className="p-2"><span className="bg-stone-200 px-2 py-1 rounded text-xs">{o.status}</span></td>
                          <td className="p-2">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* بخش تیکت‌های پشتیبانی */}
      <div className="flex h-[60vh] bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="w-1/3 border-l border-stone-200 bg-stone-50 overflow-y-auto">
          <div className="p-4 border-b border-stone-200 bg-white">
            <h2 className="font-bold text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5" /> تیکت‌های پشتیبانی</h2>
          </div>
          {loading ? (
             <div className="p-4 text-center text-stone-500 text-sm mt-10">در حال بارگذاری...</div>
          ) : tickets.length === 0 ? (
            <div className="p-4 text-center text-stone-500 text-sm mt-10">هیچ تیکتی وجود ندارد.</div>
          ) : (
            tickets.map(ticket => (
              <div 
                key={ticket._id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border-b border-stone-200 cursor-pointer hover:bg-stone-100 transition ${selectedTicket?._id === ticket._id ? 'bg-violet-50 border-r-4 border-r-violet-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm">{ticket.subject}</h3>
                  {ticket.status === 'open' ? <Clock className="w-4 h-4 text-amber-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-xs text-stone-500">کاربر: {ticket.userId?.name || 'ناشناس'}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {selectedTicket ? (
            <>
              <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{selectedTicket.subject}</h3>
                  <p className="text-sm text-stone-500">از طرف: {selectedTicket.userId?.name}</p>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-100">
                <div className="bg-white p-3 rounded-xl rounded-tr-none shadow-sm w-3/4 ml-auto">
                  <p className="text-sm">{selectedTicket.message}</p>
                </div>
                {selectedTicket.replies?.map((reply, idx) => (
                  <div key={idx} className="bg-violet-100 p-3 rounded-xl rounded-tl-none shadow-sm w-3/4 mr-auto">
                    <p className="text-sm">{reply.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-stone-200 bg-white">
                <form onSubmit={handleReply} className="flex gap-2">
                  <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="پاسخ خود را بنویسید..." className="flex-1 border rounded-lg px-4 py-2 text-sm" />
                  <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Send className="w-4 h-4" /> ارسال</button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
              <MessageSquare className="w-16 h-16 mb-4 text-stone-300" />
              <p>یک تیکت را از سمت راست انتخاب کنید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}