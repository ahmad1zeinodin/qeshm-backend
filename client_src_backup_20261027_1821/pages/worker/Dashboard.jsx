import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Settings, LayoutDashboard, LogOut, Clock, Truck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import SEO from '../../components/SEO';
import WorkerOrders from './WorkerOrders';

export default function WorkerDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isOpen, setIsOpen] = useState(true);

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: LayoutDashboard },
    { id: 'products', label: 'محصولات / منو', icon: Package },
    { id: 'orders', label: 'سفارشات', icon: ShoppingBag },
    { id: 'settings', label: 'تنظیمات فروشگاه', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6" dir="rtl">
      <SEO title="پنل سفیر" description="مدیریت فروشگاه و سفارشات" url="/dashboard/worker" />
      
      <div className="max-w-6xl mx-auto">
        {/* هدر پنل */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">پنل مدیریت سفیر</h1>
            <p className="text-sm text-stone-500 mt-1">خوش آمدید، {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg">
              <span className="text-sm font-bold text-stone-600">وضعیت فروشگاه:</span>
              <button onClick={() => setIsOpen(!isOpen)} className={`px-3 py-1 rounded-md text-xs font-bold ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isOpen ? 'باز (آنلاین)' : 'بسته (آفلاین)'}
              </button>
            </div>
            <button onClick={logout} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* منوی کناری */}
          <div className="md:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>

          {/* محتوای اصلی */}
          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm min-h-[400px]">
            
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-stone-800 mb-6 border-b pb-2">خلاصه وضعیت</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                    <span className="text-sm text-violet-600 font-bold block mb-1">سفارشات امروز</span>
                    <span className="text-3xl font-black text-violet-800">۰</span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <span className="text-sm text-green-600 font-bold block mb-1">درآمد امروز</span>
                    <span className="text-2xl font-black text-green-800">۰ تومان</span>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <span className="text-sm text-amber-600 font-bold block mb-1">محصولات فعال</span>
                    <span className="text-3xl font-black text-amber-800">۰</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                  <h2 className="text-xl font-bold text-stone-800">مدیریت محصولات / منو</h2>
                  <Link to="/dashboard/worker/products" className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-violet-700 flex items-center gap-2">
                    <Package className="w-4 h-4" /> رفتن به صفحه محصولات
                  </Link>
                </div>
                <p className="text-stone-500 text-sm">برای افزودن، ویرایش یا حذف محصولات، روی دکمه بالا کلیک کنید.</p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-stone-800 mb-6 border-b pb-2">سفارشات دریافتی</h2>
                <div className="text-center py-10 bg-stone-50 rounded-xl border border-stone-200">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 font-bold">در حال حاضر سفارشی وجود ندارد.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-stone-800 mb-6 border-b pb-2">تنظیمات فروشگاه</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> ساعات کاری</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="۱۰:۰۰ تا ۲۳:۰۰" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Truck className="w-4 h-4" /> هزینه ارسال (تومان)</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" defaultValue="20000" />
                  </div>
                  <button className="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-violet-700">ذخیره تنظیمات</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
