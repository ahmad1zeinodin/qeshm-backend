import { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Wallet, LogOut, Wrench, User, Newspaper, Home, Ticket, Package, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import WorkerOverview from './WorkerOverview';
import WorkerOrders from './WorkerOrders';
import WorkerWallet from './WorkerWallet';
import WorkerProfile from './WorkerProfile';
import RestaurantContent from './RestaurantContent';
import ServicesContent from './ServicesContent';
import NewsContent from './NewsContent';
import ShopContent from './ShopContent';
import HotelContent from './HotelContent';
import AttractionContent from './AttractionContent';
import WholesaleContent from './WholesaleContent';
import api from '../../lib/axios';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const toggleOnlineStatus = async () => {
    setUpdatingStatus(true);
    try {
      const newStatus = !isOnline;
      const res = await api.put('/workers/me/online-status', { isOnline: newStatus });
      if (res.data.success) {
        setIsOnline(newStatus);
        // ✅ خط login حذف شد (چون توکن را پاک می‌کرد)
      }
    } catch (err) {
      alert('خطا در تغییر وضعیت آنلاین: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'نمای کلی', Icon: LayoutDashboard },
      { id: 'profile', label: 'پروفایل من', Icon: User },
    ];

    if (user?.mainField === 'رستوران') {
      baseTabs.push({ id: 'menu', label: 'منوی من', Icon: Wrench });
    } else if (user?.mainField === 'اخبار') {
      baseTabs.push({ id: 'news', label: 'اخبار من', Icon: Newspaper });
    } else if (user?.mainField === 'فروشگاه') {
      baseTabs.push({ id: 'shop', label: 'محصولات من', Icon: ShoppingBag });
    } else if (user?.mainField === 'هتل و اقامتگاه') {
      baseTabs.push({ id: 'hotel', label: 'اتاق‌های من', Icon: Home });
    } else if (user?.mainField === 'تفریح و سرگرمی') {
      baseTabs.push({ id: 'attraction', label: 'برنامه‌های من', Icon: Ticket });
    } else if (user?.mainField === 'فروش عمده') {
      baseTabs.push({ id: 'wholesale', label: 'محصولات عمده', Icon: Package });
    } else {
      baseTabs.push({ id: 'services', label: 'خدمات من', Icon: Wrench });
    }

    baseTabs.push(
      { id: 'orders', label: 'سفارشات', Icon: ShoppingBag },
      { id: 'wallet', label: 'کیف پول', Icon: Wallet }
    );

    return baseTabs;
  };

  const tabs = getTabs();

  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl">
      <div className="w-64 bg-white border-l border-stone-200 min-h-screen p-4 flex flex-col">
        <h1 className="text-xl font-black text-orange-500 mb-4">پنل سفیر</h1>

        {/* ✅ کلید آنلاین/آفلاین */}
        <div className="mb-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
          <span className="text-sm font-bold text-stone-600">وضعیت من:</span>
          <button 
            onClick={toggleOnlineStatus} 
            disabled={updatingStatus}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {updatingStatus ? 'در حال تغییر...' : (isOnline ? 'آنلاین' : 'آفلاین')}
          </button>
        </div>

        <div className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100'}`}>
              <tab.Icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 mt-4"><LogOut className="w-5 h-5" /> خروج</button>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'overview' && <WorkerOverview />}
          {activeTab === 'profile' && <WorkerProfile />}
          {activeTab === 'services' && <ServicesContent />}
          {activeTab === 'menu' && <RestaurantContent />}
          {activeTab === 'news' && <NewsContent />}
          {activeTab === 'shop' && <ShopContent />}
          {activeTab === 'hotel' && <HotelContent />}
          {activeTab === 'attraction' && <AttractionContent />}
          {activeTab === 'wholesale' && <WholesaleContent />}
          {activeTab === 'orders' && <WorkerOrders />}
          {activeTab === 'wallet' && <WorkerWallet />}
        </div>
      </div>
    </div>
  );
}