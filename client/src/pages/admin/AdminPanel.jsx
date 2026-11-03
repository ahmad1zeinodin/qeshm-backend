import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import AdminSidebar from './AdminSidebar';
import DashboardTab from './DashboardTab';
import MainFieldsTab from './MainFieldsTab';
import CategoriesTab from './CategoriesTab';
import WorkersTab from './WorkersTab';
import EmployeesTab from './EmployeesTab';
import FinanceTab from './FinanceTab';
import OrdersTab from './OrdersTab';
import UsersTab from './UsersTab';
import SettingsTab from './SettingsTab';
import SupportTab from './SupportTab';
import ChangePasswordTab from './ChangePasswordTab';   // ✅ اضافه شد

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({ finance: true, workers: true });
  const [selectedWorker, setSelectedWorker] = useState(null);
  
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkers: 0, totalOrders: 0, onlineWorkers: 0 });
  const [financeSummary, setFinanceSummary] = useState({ totalDeposits: 0, totalPayouts: 0, totalBalance: 0 });
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainFields, setMainFields] = useState([]);
  const [vatReports, setVatReports] = useState({ orders: [], totalTax: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleMenu = (menu) => setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, workersRes, ordersRes, transRes, withdrawRes, summaryRes, catsRes, fieldsRes, vatRes, empRes] = await Promise.all([
        api.get('/admin/stats'), api.get('/admin/users'), api.get('/admin/workers'), api.get('/admin/orders'),
        api.get('/finance/transactions'), api.get('/finance/withdrawals'), api.get('/finance/summary'),
        api.get('/categories'), api.get('/categories/main-fields'), api.get('/finance/vat-reports'), api.get('/employees')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (workersRes.data.success) setWorkers(workersRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (transRes.data.success) setTransactions(transRes.data.data);
      if (withdrawRes.data.success) setWithdrawals(withdrawRes.data.data);
      if (summaryRes.data.success) setFinanceSummary(summaryRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
      if (fieldsRes.data.success) setMainFields(fieldsRes.data.data);
      if (vatRes.data.success) setVatReports(vatRes.data.data);
      if (empRes.data.success) setEmployees(empRes.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="text-center py-20 text-xl font-bold">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 flex" dir="rtl">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setSelectedWorker(null); }} 
        expandedMenus={expandedMenus} 
        toggleMenu={toggleMenu} 
        mainFields={mainFields} 
        categories={categories} 
        workers={workers}
        onWorkerSelect={(worker) => { setSelectedWorker(worker); setActiveTab('worker-profile'); }} 
      />

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
          {activeTab === 'mainFields' && <MainFieldsTab mainFields={mainFields} fetchData={fetchData} />}
          {activeTab === 'categories' && <CategoriesTab categories={categories} mainFields={mainFields} fetchData={fetchData} />}
          
          {(activeTab === 'workers' || activeTab === 'workers-add') && (
            <WorkersTab workers={workers} mainFields={mainFields} categories={categories} fetchData={fetchData} />
          )}

          {activeTab === 'worker-profile' && selectedWorker && (
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4">پروفایل سفیر: {selectedWorker.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>تلفن: {selectedWorker.phone}</p>
                <p>ایمیل: {selectedWorker.email}</p>
                <p>فیلد: {selectedWorker.mainField || '---'}</p>
                <p>وضعیت هویت: {selectedWorker.isVerified ? 'تایید شده' : 'تایید نشده'}</p>
              </div>
              <button onClick={() => { setSelectedWorker(null); setActiveTab('workers'); }} className="mt-6 bg-stone-200 px-4 py-2 rounded-lg font-bold">بازگشت به لیست</button>
            </div>
          )}

          {activeTab === 'employees' && <EmployeesTab employees={employees} fetchData={fetchData} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} mainFields={mainFields} />}
          {activeTab === 'users' && <UsersTab users={users} />}
          {activeTab.startsWith('finance') && <FinanceTab activeTab={activeTab} financeSummary={financeSummary} transactions={transactions} withdrawals={withdrawals} vatReports={vatReports} fetchData={fetchData} />}
          {activeTab === 'support' && <SupportTab />}
          {activeTab === 'changePassword' && <ChangePasswordTab />}   {/* ✅ اضافه شد */}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}