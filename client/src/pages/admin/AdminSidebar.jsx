import { useState } from 'react';
import { 
  LayoutDashboard, Users, Shield, ShoppingBag, Wallet, Settings, 
  ChevronDown, ChevronRight, Layers, FolderTree, UserPlus, LifeBuoy, PlusCircle 
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, expandedMenus, toggleMenu, mainFields, categories, workers, onWorkerSelect }) {
  const [expandedFields, setExpandedFields] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleField = (fieldName) => setExpandedFields(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  const toggleCategory = (catId) => setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));

  return (
    <div className="w-64 bg-white border-l border-stone-200 min-h-screen p-4 overflow-y-auto">
      <h1 className="text-xl font-black text-orange-500 mb-6">پنل مدیریت</h1>
      <div className="space-y-1">
        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'dashboard' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <LayoutDashboard className="w-5 h-5" /> داشبورد
        </button>
        <button onClick={() => setActiveTab('mainFields')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'mainFields' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <Layers className="w-5 h-5" /> فیلد اصلی
        </button>
        <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'categories' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <FolderTree className="w-5 h-5" /> زیرشاخه
        </button>

        <div>
          <button onClick={() => toggleMenu('workers')} className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab.startsWith('workers') ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
            <div className="flex items-center gap-3"><Shield className="w-5 h-5" /> سفیران</div>
            {expandedMenus.workers ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {expandedMenus.workers && (
            <div className="mr-4 mt-1 space-y-1 border-r-2 border-stone-200 pr-2">
              <button 
                onClick={() => setActiveTab('workers-add')} 
                className={`w-full flex items-center gap-2 text-right px-3 py-2 rounded-lg text-xs font-bold ${activeTab === 'workers-add' ? 'bg-stone-100 text-violet-700' : 'text-stone-500 hover:bg-stone-100'}`}
              >
                <PlusCircle className="w-3 h-3" /> ثبت‌نام سفیر جدید
              </button>

              {mainFields.map(field => (
                <div key={field._id}>
                  <button 
                    onClick={() => toggleField(field.name)} 
                    className="w-full flex items-center justify-between text-right px-3 py-2 rounded-lg text-xs font-bold text-stone-500 hover:bg-stone-100"
                  >
                    {field.name}
                    {expandedFields[field.name] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  
                  {expandedFields[field.name] && (
                    <div className="mr-3 mt-1 space-y-1 border-r border-stone-300 pr-2">
                      {categories.filter(c => c.mainField === field.name).map(cat => (
                        <div key={cat._id}>
                          <button 
                            onClick={() => toggleCategory(cat._id)} 
                            className="w-full flex items-center justify-between text-right px-2 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:bg-stone-100"
                          >
                            {cat.name}
                            {expandedCategories[cat._id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>

                          {expandedCategories[cat._id] && (
                            <div className="mr-2 mt-1 space-y-1 border-r border-stone-200 pr-2">
                              {/* ✅ تبدیل هر دو به String برای مقایسه درست */}
                              {workers.filter(w => String(w.categoryId) === String(cat._id)).map(worker => (
                                <button 
                                  key={worker._id} 
                                  onClick={() => onWorkerSelect(worker)} 
                                  className="w-full text-right px-2 py-1.5 rounded-lg text-xs text-stone-500 hover:bg-violet-50 hover:text-violet-700"
                                >
                                  {worker.name}
                                </button>
                              ))}
                              {workers.filter(w => String(w.categoryId) === String(cat._id)).length === 0 && (
                                <span className="text-[10px] text-stone-300 block px-2 py-1">سفیری ندارد</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      {categories.filter(c => c.mainField === field.name).length === 0 && (
                        <span className="text-[10px] text-stone-300 block px-2 py-1">زیرشاخه‌ای ندارد</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setActiveTab('employees')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'employees' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <UserPlus className="w-5 h-5" /> همکاران
        </button>
        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'orders' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <ShoppingBag className="w-5 h-5" /> سفارشات
        </button>
        <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'users' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <Users className="w-5 h-5" /> کاربران
        </button>

        <div>
          <button onClick={() => toggleMenu('finance')} className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab.startsWith('finance') ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
            <div className="flex items-center gap-3"><Wallet className="w-5 h-5" /> مدیریت مالی</div>
            {expandedMenus.finance ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {expandedMenus.finance && (
            <div className="mr-4 mt-1 space-y-1 border-r-2 border-stone-200 pr-2">
              <button onClick={() => setActiveTab('finance-summary')} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold ${activeTab === 'finance-summary' ? 'bg-stone-100 text-violet-700' : 'text-stone-500 hover:bg-stone-100'}`}>خلاصه وضعیت</button>
              <button onClick={() => setActiveTab('finance-transactions')} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold ${activeTab === 'finance-transactions' ? 'bg-stone-100 text-violet-700' : 'text-stone-500 hover:bg-stone-100'}`}>گردش حساب</button>
              <button onClick={() => setActiveTab('finance-withdrawals')} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold ${activeTab === 'finance-withdrawals' ? 'bg-stone-100 text-violet-700' : 'text-stone-500 hover:bg-stone-100'}`}>درخواست‌های برداشت</button>
              <button onClick={() => setActiveTab('finance-vat')} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold ${activeTab === 'finance-vat' ? 'bg-stone-100 text-violet-700' : 'text-stone-500 hover:bg-stone-100'}`}>ارزش افزوده</button>
            </div>
          )}
        </div>

        <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'support' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <LifeBuoy className="w-5 h-5" /> پشتیبانی
        </button>
        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'settings' ? 'bg-violet-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <Settings className="w-5 h-5" /> تنظیمات
        </button>
      </div>
    </div>
  );
}