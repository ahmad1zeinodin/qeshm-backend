import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Clock, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  
  const { user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // تاریخ شمسی
      const dateStr = now.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
      setCurrentDate(dateStr);
      
      // روز هفته
      const dayStr = now.toLocaleDateString('fa-IR', { weekday: 'long' });
      setCurrentDay(dayStr);
      
      // ساعت
      const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(timeStr);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000); // هر دقیقه آپدیت شود
    return () => clearInterval(timer);
  }, []);

  const mainLinks = [
    { to: '/news', label: 'اخبار' },
    { to: '/services', label: 'خدمات' },
    { to: '/shop', label: 'فروشگاه' },
    { to: '/restaurants', label: 'رستوران' },
    { to: '/attractions', label: 'تفریح و سرگرمی' },
    { to: '/hotels', label: 'هتل و اقامتگاه' },
  ];

  const secondaryLinks = [
    { to: '/about', label: 'درباره ما' },
    { to: '/contact', label: 'تماس با ما' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-3xl font-black text-[#ea580c]">
          قشمی نو
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {mainLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                location.pathname === link.to 
                  ? 'bg-orange-50 border-orange-200 text-[#ea580c]' 
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {secondaryLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-stone-200 mx-1"></div>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-bold text-stone-600 hover:text-[#ea580c] flex items-center gap-1"><User className="w-4 h-4" /> پنل کاربری</Link>
              <button onClick={logout} className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-1"><LogOut className="w-4 h-4" /> خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-stone-600 hover:text-[#ea580c]">ورود</Link>
              <Link to="/register" className="bg-[#ea580c] text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-orange-700 transition-colors shadow-sm">ثبت‌نام</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-stone-600" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          {mobileNavOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* نوار اوقات شرعی و تاریخ */}
      <div className="bg-stone-50 border-t border-stone-100 py-1.5 px-4 text-right">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 font-medium">
          {/* سمت راست: تاریخ و ساعت */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {currentDay}، {currentDate}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ساعت: {currentTime}</span>
          </div>
          
          {/* سمت چپ: اوقات شرعی */}
          <div className="flex items-center gap-2">
            <span>اوقات شرعی قشم:</span>
            <span className="font-bold text-stone-700">صبح ۰۵:۱۲</span> |
            <span className="font-bold text-stone-700">طلوع ۰۶:۳۰</span> |
            <span className="font-bold text-stone-700">ظهر ۱۱:۵۸</span> |
            <span className="font-bold text-stone-700">غروب ۱۷:۲۵</span> |
            <span className="font-bold text-stone-700">مغرب ۱۷:۴۳</span>
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-4 space-y-3">
          {mainLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileNavOpen(false)} className="block text-sm font-bold text-stone-600 hover:text-[#ea580c] py-1">{link.label}</Link>
          ))}
          <div className="border-t border-stone-100 pt-3 mt-3 space-y-2">
            {secondaryLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileNavOpen(false)} className="block text-xs font-bold text-stone-400 hover:text-stone-600 py-1">{link.label}</Link>
            ))}
          </div>
          <div className="border-t border-stone-100 pt-3 mt-3 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileNavOpen(false)} className="block text-sm font-bold text-stone-600">پنل کاربری</Link>
                <button onClick={() => { logout(); setMobileNavOpen(false); }} className="block text-sm font-bold text-red-500">خروج</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileNavOpen(false)} className="block text-sm font-bold text-stone-600">ورود</Link>
                <Link to="/register" onClick={() => setMobileNavOpen(false)} className="block text-sm font-bold text-[#ea580c]">ثبت‌نام</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
