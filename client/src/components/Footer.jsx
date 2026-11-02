import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data.success) setSettings(res.data.data);
    }).catch(err => console.error("Error loading settings:", err));
  }, []);

  return (
    <footer className="bg-stone-900 text-stone-300 py-6 mt-auto border-t border-stone-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* کپی‌رایت */}
        <p className="text-xs text-stone-500">
          © ۱۴۰۵ قشمی نو. تمامی حقوق محفوظ است.
        </p>

        {/* لینک‌های ضروری */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/terms" className="hover:text-orange-400 transition-colors">قوانین و مقررات</Link>
          <Link to="/privacy" className="hover:text-orange-400 transition-colors">حریم خصوصی</Link>
        </div>

        {/* آیکون‌های شبکه‌های اجتماعی */}
        <div className="flex gap-3">
          {settings.instagram && (
            <a href={settings.instagram} target="_blank" rel="noreferrer" className="bg-stone-800 p-2 rounded-lg hover:bg-orange-500 transition-colors" title="اینستاگرام">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          )}
          {settings.telegram && (
            <a href={settings.telegram} target="_blank" rel="noreferrer" className="bg-stone-800 p-2 rounded-lg hover:bg-orange-500 transition-colors" title="تلگرام">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </a>
          )}
          {settings.whatsapp && (
            <a href={settings.whatsapp} target="_blank" rel="noreferrer" className="bg-stone-800 p-2 rounded-lg hover:bg-orange-500 transition-colors" title="واتساپ">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </a>
          )}
        </div>

      </div>
    </footer>
  );
}