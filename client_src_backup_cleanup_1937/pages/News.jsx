import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const TEST_NEWS = [
  { _id: '1', title: 'افتتاح بزرگترین پارک ساحلی قشم', content: 'با حضور مسئولین، بزرگترین پارک ساحلی جزیره قشم در منطقه رمچاه افتتاح شد. این پارک شامل امکانات تفریحی و ورزشی متنوعی است.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', createdAt: '2026-10-25' },
  { _id: '2', title: 'جشنواره غذای دریایی در قشم', content: 'جشنواره سالانه غذای دریایی با حضور سرآشپزهای برتر جزیره برگزار می‌شود. علاقه‌مندان می‌توانند از انواع غذاهای دریایی تازه لذت ببرند.', imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800', createdAt: '2026-10-20' },
  { _id: '3', title: 'تخفیف ویژه تورهای جزیره هنگام', content: 'به مناسبت فصل گردشگری، تورهای جزیره هنگام با تخفیف ۳۰ درصدی ارائه می‌شوند. برای رزرو به بخش جاذبه‌های گردشگری مراجعه کنید.', imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800', createdAt: '2026-10-15' },
];

export default function News() {
  const [news] = useState(TEST_NEWS);

  return (
    <div className="min-h-screen bg-stone-50 pt-8 pb-16" dir="rtl">
      <SEO title="اخبار قشم" description="آخرین اخبار و رویدادهای جزیره قشم" url="/news" />
      
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black text-stone-900 mb-2 border-r-4 border-[#ea580c] pr-4">اخبار قشم</h1>
        <p className="text-stone-500 mb-8 pr-4">آخرین اخبار و رویدادهای جزیره قشم</p>

        <div className="space-y-6">
          {news.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
              {item.imageUrl && (
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                  <h2 className="text-lg font-bold text-stone-800 mb-2">{item.title}</h2>
                  <p className="text-sm text-stone-500 line-clamp-2">{item.content}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link to={`/news/${item._id}`} className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                    ادامه مطلب <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
