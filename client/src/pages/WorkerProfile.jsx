import { useState, useEffect } from 'react';
import { User, Phone, ShieldAlert, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

export default function WorkerProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // دریافت اطلاعات به‌روزِ خودِ سفیر از دیتابیس
    if (user?._id) {
      api.get(`/workers/${user._id}`)
        .then(res => {
          if (res.data.success) setProfile(res.data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;
  if (!profile) return <div className="text-center py-10 text-red-500">اطلاعات پروفایل پیدا نشد.</div>;

  // ساخت نام با جنسیت (اگر فیلد جنسیت وجود داشته باشد)
  const genderLabel = profile.gender === 'female' ? 'خانم' : profile.gender === 'male' ? 'آقای' : '';
  const displayName = `${genderLabel} ${profile.name}`.trim();

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
        <User className="w-5 h-5" /> پروفایل من
      </h2>

      <div className="bg-white p-6 rounded-2xl border flex flex-col items-center shadow-sm">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-5xl mb-4 overflow-hidden">
          {profile.profilePhoto ? (
            <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            '👤'
          )}
        </div>

        <h3 className="text-lg font-bold">{displayName}</h3>
        
        {/* نمایش نشان ادمین (اگر وجود داشته باشد) */}
        {profile.adminBadgeText && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full mt-2 flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5" /> {profile.adminBadgeText}
          </span>
        )}

        {/* نمایش بیوگرافی واقعی */}
        <p className="text-sm text-stone-500 mt-3 text-center">
          {profile.bio || 'هنوز توضیحاتی برای پروفایل خود ثبت نکرده‌اید.'}
        </p>

        {/* نمایش شماره تماس */}
        {profile.phone && (
          <div className="flex items-center gap-2 mt-4 text-sm text-stone-600 bg-stone-50 px-4 py-2 rounded-lg border">
            <Phone className="w-4 h-4 text-stone-400" />
            <span dir="ltr">{profile.phone}</span>
          </div>
        )}

        <p className="text-xs text-stone-400 mt-4">
          ویرایش اطلاعات از طریق پشتیبانی امکان‌پذیر است.
        </p>
      </div>

      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm">
        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5" /> تماس اضطراری با پشتیبانی
        </h3>
        <p className="text-sm text-red-600 mb-4">
          در صورت بروز هرگونه حادثه یا خطر، بلافاصله با شماره زیر تماس بگیرید:
        </p>
        <a
          href="tel:09120000000"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
        >
          <Phone className="w-5 h-5" /> تماس فوری با پشتیبانی (۰۹۱۲۰۰۰۰۰۰۰)
        </a>
      </div>
    </div>
  );
}