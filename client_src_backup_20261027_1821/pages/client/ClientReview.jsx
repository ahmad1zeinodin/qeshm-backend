import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import api from '../../lib/axios';
import SEO from '../../components/SEO';

export default function ClientReview() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/reviews', { jobId, rating, comment });
      if (res.data.success) {
        setMessage('✅ امتیاز شما با موفقیت ثبت شد.');
        setTimeout(() => navigate('/dashboard/client/requests'), 2000);
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="ثبت امتیاز" description="امتیازدهی به سفیر" url="/dashboard/client/review" />
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mt-10">
        <h1 className="text-xl font-bold text-stone-800 mb-6 text-center">به سفیر خود امتیاز دهید</h1>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-stone-300'}`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">نظر شما (اختیاری)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows="3" placeholder="تجربه خود را بنویسید..."></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <Send className="w-5 h-5" /> {loading ? 'در حال ثبت...' : 'ثبت امتیاز'}
          </button>
        </form>
      </div>
    </div>
  );
}
