import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../lib/axios';

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    supportPhoneClient: '', supportPhoneWorker: '', aboutText: '', contactText: '', termsText: '',
    instagram: '', telegram: '', twitter: '', eitaa: '', bale: '', whatsapp: '', youtube: ''
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data.success) setSettings(prev => ({ ...prev, ...res.data.data }));
    }).catch(err => console.error(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings', settings);
      setMsg('✅ تنظیمات با موفقیت ذخیره شد.');
    } catch (err) { setMsg('❌ خطا در ذخیره تنظیمات.'); }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2">تنظیمات سایت</h2>
      {msg && <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm font-bold">{msg}</div>}
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">شماره‌های تماس فوری</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">پشتیبانی مشتری</label><input type="text" value={settings.supportPhoneClient} onChange={e => setSettings({...settings, supportPhoneClient: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">پشتیبانی سفیر</label><input type="text" value={settings.supportPhoneWorker} onChange={e => setSettings({...settings, supportPhoneWorker: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">متن‌های ثابت</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-bold mb-1">درباره ما</label><textarea value={settings.aboutText} onChange={e => setSettings({...settings, aboutText: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows="3"></textarea></div>
            <div><label className="block text-sm font-bold mb-1">تماس با ما</label><textarea value={settings.contactText} onChange={e => setSettings({...settings, contactText: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows="3"></textarea></div>
            <div><label className="block text-sm font-bold mb-1">قوانین و مقررات</label><textarea value={settings.termsText} onChange={e => setSettings({...settings, termsText: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows="3"></textarea></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">شبکه‌های اجتماعی</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['instagram','اینستاگرام'],['telegram','تلگرام'],['twitter','توییتر'],['eitaa','ایتا'],['bale','بله'],['whatsapp','واتساپ'],['youtube','یوتیوب']].map(([key,label]) => (
              <div key={key}><label className="block text-sm font-bold mb-1">{label}</label><input type="text" value={settings[key]} onChange={e => setSettings({...settings, [key]: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-violet-700">
          <Save className="w-5 h-5" /> ذخیره تمام تنظیمات
        </button>
      </form>
    </div>
  );
}