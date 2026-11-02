import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Phone, Mail, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      if (res.data.success) {
        setTickets(res.data.data);
        // اگر تیکت فعالی انتخاب نشده بود، اولین تیکت را انتخاب کن
        if (res.data.data.length > 0 && !activeTicket) {
          setActiveTicket(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket]);

  const handleReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    try {
      const res = await api.post(`/tickets/${activeTicket._id}/reply`, { text: replyText });
      if (res.data.success) {
        setReplyText('');
        await fetchTickets();
        // آپدیت تیکت فعال با دیتای جدید
        const updated = res.data.data;
        setActiveTicket(updated);
      }
    } catch (err) {
      alert('خطا در ارسال پاسخ');
    }
  };

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex h-[600px]">
      
      {/* لیست تیکت‌ها (سمت راست) */}
      <div className="w-1/3 border-l border-stone-200 bg-stone-50 flex flex-col">
        <div className="p-4 border-b border-stone-200 bg-white">
          <h2 className="font-bold text-stone-800">تیکت‌های پشتیبانی</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.map((t) => (
            <div 
              key={t._id} 
              onClick={() => setActiveTicket(t)} 
              className={`p-4 border-b border-stone-200 cursor-pointer hover:bg-stone-100 ${activeTicket?._id === t._id ? 'bg-white border-r-4 border-r-violet-600' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-stone-800 truncate">{t.userName}</span>
                {t.status === 'open' ? (
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">باز</span>
                ) : (
                  <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">بسته</span>
                )}
              </div>
              <span className="text-xs text-stone-500 block truncate">{t.messages[t.messages.length - 1]?.text}</span>
            </div>
          ))}
          {tickets.length === 0 && <div className="p-4 text-center text-stone-400 text-sm">هیچ تیکتی وجود ندارد</div>}
        </div>
      </div>

      {/* بخش چت (سمت چپ) */}
      <div className="flex-1 flex flex-col bg-stone-50">
        {activeTicket ? (
          <>
            {/* هدر اطلاعات کاربر */}
            <div className="p-4 border-b border-stone-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-stone-800">{activeTicket.subject}</h3>
                <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {activeTicket.userName}</span>
                  {activeTicket.userPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {activeTicket.userPhone}</span>}
                  {activeTicket.userEmail && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {activeTicket.userEmail}</span>}
                </div>
              </div>
            </div>

            {/* پیام‌ها */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeTicket.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.senderRole === 'admin' ? 'bg-violet-600 text-white' : 'bg-white border border-stone-200'}`}>
                    <span className="block text-xs opacity-70 mb-1">{msg.senderName}</span>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* فرم پاسخ */}
            <div className="p-4 border-t border-stone-200 bg-white flex gap-2">
              <input 
                type="text" 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                className="flex-1 border rounded-lg px-3 py-2 text-sm" 
                placeholder="پاسخ خود را بنویسید..." 
              />
              <button onClick={handleReply} className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700"><Send className="w-5 h-5" /></button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <MessageCircle className="w-16 h-16 text-stone-300 mb-4" />
            <h2 className="text-xl font-bold text-stone-800 mb-2">یک تیکت را انتخاب کنید</h2>
            <p className="text-sm text-stone-500">برای مشاهده و پاسخ، روی یکی از تیکت‌های سمت راست کلیک کنید.</p>
          </div>
        )}
      </div>
    </div>
  );
}
