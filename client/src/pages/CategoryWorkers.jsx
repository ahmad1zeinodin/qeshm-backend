import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore'; // ✅ ایمپورت استور
import SEO from '../components/SEO';
import api from '../lib/axios';

export default function CategoryWorkers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore(); // ✅ چک کردن لاگین
  const [workers, setWorkers] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [fieldName, setFieldName] = useState(''); // ✅ برای دکمه بازگشت
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ اگر کاربر لاگین نکرده باشد، به ثبت‌نام برود
    if (!user) {
      navigate('/register');
      return;
    }

    // دریافت نام دسته بندی و فیلد اصلی
    api.get(`/categories/${id}`).then(res => {
      if (res.data.success) {
        setCategoryName(res.data.data.name);
        setFieldName(res.data.data.mainField); // ✅ ذخیره فیلد اصلی
      }
    }).catch(console.error);

    // دریافت لیست سفیران
    api.get(`/workers/category/${id}`).then(res => {
      if (res.data.success) {
        setWorkers(res.data.data || []);
      }
    }).catch(err => {
      console.error("خطا در دریافت سفیران:", err);
    }).finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title={`بهترین‌های ${categoryName} در قشم`} description={`لیست سفیران ${categoryName}`} url={`/category/${id}`} />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* ✅ دکمه بازگشت به صفحه زیرشاخه‌ها */}
        <Link 
          to={fieldName ? `/services/${fieldName}` : '/services'} 
          className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-6"
        >
          <ArrowRight className="w-4 h-4" /> بازگشت
        </Link>
        
        <h1 className="text-2xl font-bold text-stone-800 mb-6 border-r-4 border-orange-500 pr-3">
          بهترین‌های {categoryName || 'این دسته'} در قشم
        </h1>
        
        {workers.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border">در حال حاضر سفیری در این بخش آنلاین نیست. لطفاً بعداً مراجعه کنید.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workers.map(worker => (
              <Link key={worker._id} to={`/pro/${worker._id}`} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-3xl shrink-0">
                  {worker.profilePhoto ? <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full rounded-full object-cover" /> : '👤'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-800">{worker.name}</h2>
                  <p className="text-sm text-stone-500 line-clamp-1">{worker.bio || 'متخصص خدمات'}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {worker.rating || 'جدید'}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {worker.district || 'قشم'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}