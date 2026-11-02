import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../lib/axios';

export default function Browse() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // نمایش همه فیلدهای اصلی
    api.get('/categories/main-fields').then(res => {
      if (res.data.success) setFields(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title="خدمات" description="لیست دسته‌بندی خدمات" url="/services" />
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3 mb-6">دسته‌بندی خدمات</h1>
        
        {fields.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border">هنوز هیچ فیلد اصلی تعریف نشده است.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map(field => (
              <Link key={field._id} to={`/services/${field.name}`} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all block p-6 text-center">
                <div className="text-6xl mb-4">{field.icon || '📁'}</div>
                <h2 className="text-lg font-bold text-stone-800">{field.name}</h2>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}