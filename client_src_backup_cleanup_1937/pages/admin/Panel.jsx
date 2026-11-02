import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  Users, Tag, UserPlus, CheckCircle, XCircle, LayoutDashboard,
  Shield, ShoppingBag, Settings, MessageCircle
} from 'lucide-react';
import CategoryManager from './CategoryManager';
import AddVendor from './AddVendor';
import OrdersManager from './OrdersManager';
import SiteSettings from './SiteSettings';
import TaxSettings from './TaxSettings';
import AdminTickets from './AdminTickets';
import AdminsManager from './AdminsManager';
import OperatorManager from './OperatorManager';
import SEO from '../../components/SEO';

export default function AdminPanel() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { id: 'categories', label: 'مدیریت خدمات', Icon: Tag },
    { id: 'addVendor', label: 'ثبت‌نام سفیر', Icon: UserPlus },
    { id: 'orders', label: 'مدیریت سفارشات', Icon: ShoppingBag },
    { id: 'tickets', label: 'پشتیبانی', Icon: MessageCircle },
    { id: 'admins', label: 'مدیریت ادمین‌ها', Icon: Shield },
    { id: 'operators', label: 'مدیریت اپراتورها', Icon: Shield },
    { id: 'tax', label: 'تنظیمات مالیات', Icon: Settings },
    { id: 'settings', label: 'تنظیمات سایت', Icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="پنل ادمین" description="مدیریت سایت" url="/admin1410" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-800">پنل مدیریت قشمی نو</h1>
          <p className="text-sm text-stone-500 mt-1">خوش آمدید، {user?.name || 'مدیر'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <tab.Icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm min-h-[500px]">
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'addVendor' && <AddVendor />}
            {activeTab === 'orders' && <OrdersManager />}
            {activeTab === 'tickets' && <AdminTickets />}
            {activeTab === 'admins' && <AdminsManager />}
            {activeTab === 'operators' && <OperatorManager />}
            {activeTab === 'tax' && <TaxSettings />}
            {activeTab === 'settings' && <SiteSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
