import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // ✅ ایمپورت استور
import SEO from '../components/SEO';
import api from '../lib/axios';

export default function FieldCategories() {
  const { fieldName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore(); // ✅ چک کردن لاگین
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/categories?mainField=${fieldName}`).then(res => {
      if (res.data.success) setCategories(res.data.data);
    }).finally(() => setLoading(false));
  }, [fieldName]);

  // ✅ تابع هندل کردن کلیک روی زیرشاخه
  const handleCategoryClick = (e, catId) => {
    if (!user) {
      e.preventDefault(); // جلوگیری از رفتن به لینک پیش‌فرض
      navigate('/register'); // هدایت به ثبت‌نام
    }
    // اگر لاگین کرده باشد، لینک به صورت عادی کار می‌کند
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title={`آنچه در ${fieldName} نیاز دارید`} description={`لیست زیرشاخه‌های ${fieldName}`} url={`/services/${fieldName}`} />
      
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3 mb-6">
          آنچه در {fieldName} نیاز دارید
        </h1>
        
        {loading ? (
          <div className="text-center py-20">در حال بارگذاری...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border">هنوز خدماتی در این بخش ثبت نشده است. به زودی...</div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {categories.map(cat => (
              <Link 
                key={cat._id} 
                to={`/category/${cat._id}`} 
                onClick={(e) => handleCategoryClick(e, cat._id)} // ✅ هندل کردن کلیک
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all w-40 flex flex-col items-center"
              >
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-stone-50 p-2">
                  <span className="text-6xl">{cat.icon || '📁'}</span>
                </div>
                <div className="p-3 w-full text-center bg-white border-t">
                  <h2 className="text-sm font-bold text-stone-800">{cat.name}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}