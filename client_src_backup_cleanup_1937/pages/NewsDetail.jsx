import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const TEST_NEWS = [
  { _id: '1', title: 'افتتاح بزرگترین پارک ساحلی قشم', content: 'با حضور مسئولین، بزرگترین پارک ساحلی جزیره قشم در منطقه رمچاه افتتاح شد. این پارک شامل امکانات تفریحی و ورزشی متنوعی است.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', createdAt: '2026-10-25' },
  { _id: '2', title: 'جشنواره غذای دریایی در قشم', content: 'جشنواره سالانه غذای دریایی با حضور سرآشپزهای برتر جزیره برگزار می‌شود. علاقه‌مندان می‌توانند از انواع غذاهای دریایی تازه لذت ببرند.', imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800', createdAt: '2026-10-20' },
];

export default function NewsDetail() {
  const { id } = useParams();
  const newsItem = TEST_NEWS.find(n => n._id === id) || TEST_NEWS[0];

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title={newsItem.title} description={newsItem.content} url={`/news/${id}`} />
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/news" className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-6">
          <ArrowRight className="w-4 h-4" /> بازگشت به اخبار
        </Link>
        
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          {newsItem.imageUrl && (
            <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-64 object-cover" />
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
              <Calendar className="w-4 h-4" />
              {new Date(newsItem.createdAt).toLocaleDateString('fa-IR')}
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-4">{newsItem.title}</h1>
            <p className="text-stone-600 leading-relaxed whitespace-pre-line">{newsItem.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
