import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import api from '../../lib/axios';
import SEO from '../../components/SEO';

export default function ClientChat() {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      if (res.data.success) {
        setTickets(res.data.data);
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

  const handleCreateTicket = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await api.post('/tickets', { text: newMessage });
      if (res.data.success) {
        setNewMessage('');
        await fetchTickets();
      }
    } catch (err) {
      alert('خطا در ارسال پیام');
    }
  };

  const handleReply = async () => {
    if (!newMessage.trim() || !activeTicket) return;
    try {
      const res = await api.post(`/tickets/${activeTicket._id}/reply`, { text: newMessage });
      if (res.data.success) {
        setNewMessage('');
        await fetchTickets();
      }
    } catch (err) {
      alert('خطا در ارسال پاسخ');
    }
  };

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="پشتیبانی" description="چت با پشتیبانی" url="/dashboard/client/chat" />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex h-[600px]">
        
        {/* لیست تیکت‌ها (سمت راست) */}
        <div className="w-1/3 border-l border-stone-200 bg-stone-50 flex flex-col">
          <div className="p-4 border-b border-stone-200 bg-white">
            <button onClick={() => setActiveTicket(null)} className="w-full bg-violet-600 text-white py-2 rounded-lg font-bold text-sm">+ گفتگوی جدید</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((t) => (
              <div key={t._id} onClick={() => setActiveTicket(t)} className={`p-4 border-b border-stone-200 cursor-pointer hover:bg-stone-100 ${activeTicket?._id === t._id ? 'bg-white border-r-4 border-r-violet-600' : ''}`}>
                <span className="font-bold text-sm text-stone-800 block truncate">{t.subject}</span>
                <span className="text-xs text-stone-500 block truncate">{t.messages[t.messages.length - 1]?.text}</span>
              </div>
            ))}
            {tickets.length === 0 && <div className="p-4 text-center text-stone-400 text-sm">گفتگویی وجود ندارد</div>}
          </div>
        </div>

        {/* بخش چت (سمت چپ) */}
        <div className="flex-1 flex flex-col">
          {activeTicket ? (
            <>
              <div className="p-4 border-b border-stone-200 bg-white">
                <h3 className="font-bold text-stone-800">{activeTicket.subject}</h3>
                <span className="text-xs text-stone-500">وضعیت: {activeTicket.status === 'open' ? 'در حال بررسی' : 'بسته شده'}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
                {activeTicket.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.senderRole === 'client' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.senderRole === 'client' ? 'bg-white border border-stone-200' : 'bg-violet-600 text-white'}`}>
                      <span className="block text-xs opacity-70 mb-1">{msg.senderName}</span>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-stone-200 bg-white flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="پیام خود را بنویسید..." />
                <button onClick={handleReply} className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700"><Send className="w-5 h-5" /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageCircle className="w-16 h-16 text-stone-300 mb-4" />
              <h2 className="text-xl font-bold text-stone-800 mb-2">شروع گفتگوی جدید</h2>
              <p className="text-sm text-stone-500 mb-6">پیام خود را بنویسید تا با پشتیبانی در ارتباط باشید.</p>
              <div className="w-full max-w-md flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="متن پیام..." />
                <button onClick={handleCreateTicket} className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-violet-700">ارسال</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
