export default function DashboardTab({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-2xl border-r-4 border-violet-500 shadow-sm">
        <span className="text-sm text-stone-500 block mb-1">کل کاربران</span>
        <span className="text-2xl font-black text-violet-700">{stats.totalUsers}</span>
      </div>
      <div className="bg-white p-6 rounded-2xl border-r-4 border-amber-500 shadow-sm">
        <span className="text-sm text-stone-500 block mb-1">کل سفیران</span>
        <span className="text-2xl font-black text-amber-600">{stats.totalWorkers}</span>
      </div>
      <div className="bg-white p-6 rounded-2xl border-r-4 border-green-500 shadow-sm">
        <span className="text-sm text-stone-500 block mb-1">کل سفارشات</span>
        <span className="text-2xl font-black text-green-600">{stats.totalOrders}</span>
      </div>
      <div className="bg-white p-6 rounded-2xl border-r-4 border-blue-500 shadow-sm">
        <span className="text-sm text-stone-500 block mb-1">سفیران آنلاین</span>
        <span className="text-2xl font-black text-blue-600">{stats.onlineWorkers || 0}</span>
      </div>
    </div>
  );
}