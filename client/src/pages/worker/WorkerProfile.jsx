import { User, PhoneCall, ShieldAlert } from 'lucide-react';

export default function WorkerProfile() {
  const profile = {
    name: 'آقای احمدی',
    bio: 'تعمیرکار و نظافتچی حرفه‌ای',
    adminBadgeText: 'دارای مدرک تخصصی تعمیرات',
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><User className="w-5 h-5" /> پروفایل من</h2>
      
      <div className="bg-white p-6 rounded-2xl border flex flex-col items-center shadow-sm">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-5xl mb-4">
          👤
        </div>
        <h3 className="text-lg font-bold">{profile.name}</h3>
        {profile.adminBadgeText && <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full mt-2">{profile.adminBadgeText}</span>}
        <p className="text-sm text-stone-500 mt-2">{profile.bio}</p>
        <p className="text-xs text-stone-400 mt-4">ویرایش اطلاعات فقط توسط پشتیبانی امکان‌پذیر است.</p>
      </div>

      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm">
        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-2"><ShieldAlert className="w-5 h-5" /> تماس اضطراری با پشتیبانی</h3>
        <p className="text-sm text-red-600 mb-4">در صورت بروز هرگونه حادثه یا خطر، بلافاصله با شماره زیر تماس بگیرید:</p>
        <a href="tel:09120000000" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
          <PhoneCall className="w-5 h-5" /> تماس فوری با پشتیبانی (۰۹۱۲۰۰۰۰۰۰۰)
        </a>
      </div>
    </div>
  );
}
