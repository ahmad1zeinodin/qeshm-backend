import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CheckCircle, XCircle, User } from 'lucide-react';
import api from '../../lib/axios';
import SEO from '../../components/SEO';

export default function ClientRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/jobs'); // این API باید لیست درخواست‌های مشتری را برگرداند
        if (res.data.success) {
          setRequests(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="درخواست‌های من" description="لیست درخواست‌های مشتری" url="/dashboard/client/requests" />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-stone-800">درخواست‌های من</h1>
          <Link to="/dashboard/client/request" className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-violet-700">
            + درخواست جدید
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500">هنوز درخواستی ثبت نکرده‌اید.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-stone-800">{req.title}</h3>
                    <span className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    req.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    req.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {req.status === 'pending' ? 'در انتظار' :
                     req.status === 'dispatching' ? 'در حال ارجاع' :
                     req.status === 'accepted' ? 'پذیرفته شده' :
                     req.status === 'completed' ? 'انجام شده' : 'لغو شده'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-stone-600 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {req.address}</span>
                  <span className="font-bold text-violet-700">{req.agreedRate?.toLocaleString()} تومان</span>
                </div>

                {/* نمایش مشخصات سفیر (اگر پذیرفته شده باشد) */}
                {req.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Link to={`/dashboard/client/review/${req._id}`} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600">
                      ثبت امتیاز
                    </Link>
                  </div>
                )}
                {req.assignedWorkerId && (
                  <div className="bg-violet-50 p-3 rounded-xl flex items-center gap-3 border border-violet-100">
                    <div className="w-10 h-10 bg-violet-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 block">سفیر شما:</span>
                      <span className="font-bold text-stone-800">{req.assignedWorkerId.name}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
