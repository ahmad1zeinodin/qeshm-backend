import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import api from '../lib/axios';
import SEO from '../components/SEO';

export default function About() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setContent(res.data.data.aboutUs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-12" dir="rtl">
      <SEO title="درباره ما" description="درباره قشمی نو" url="/about" />
      <div className="max-w-3xl mx-auto px-4 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-violet-600" /> درباره قشمی نو
        </h1>
        <div className="text-stone-600 leading-relaxed text-sm whitespace-pre-line">
          {content || 'در حال بارگذاری...'}
        </div>
      </div>
    </div>
  );
}
