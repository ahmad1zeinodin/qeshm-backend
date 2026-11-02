import api from '../../lib/axios';

export default function FinanceTab({ activeTab, financeSummary, transactions, withdrawals, vatReports, fetchData }) {
  
  if (activeTab === 'finance-summary') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border-r-4 border-green-500 shadow-sm">
          <span className="text-sm text-stone-500 block mb-1">کل درآمد پلتفرم</span>
          <span className="text-2xl font-black text-green-600">{financeSummary.totalDeposits.toLocaleString()} ریال</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border-r-4 border-red-500 shadow-sm">
          <span className="text-sm text-stone-500 block mb-1">کل پرداختی‌ها (سهم سفیران)</span>
          <span className="text-2xl font-black text-red-600">{financeSummary.totalPayouts.toLocaleString()} ریال</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border-r-4 border-violet-500 shadow-sm">
          <span className="text-sm text-stone-500 block mb-1">موجودی صندوق</span>
          <span className="text-2xl font-black text-violet-700">{financeSummary.totalBalance.toLocaleString()} ریال</span>
        </div>
      </div>
    );
  }

  if (activeTab === 'finance-transactions') {
    return (
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-stone-100">
            <tr><th className="p-3">کاربر</th><th className="p-3">نوع</th><th className="p-3">مبلغ</th><th className="p-3">توضیحات</th><th className="p-3">تاریخ</th></tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id} className="border-t hover:bg-stone-50">
                <td className="p-3">{t.userId?.name || '---'}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${['deposit', 'earning'].includes(t.type) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.type}</span></td>
                <td className={`p-3 font-bold ${['deposit', 'earning'].includes(t.type) ? 'text-green-600' : 'text-red-600'}`}>{t.amount.toLocaleString()} ریال</td>
                <td className="p-3 text-sm text-stone-500">{t.description}</td>
                <td className="p-3 text-sm">{new Date(t.createdAt).toLocaleDateString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'finance-withdrawals') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {withdrawals.length === 0 ? (
          <div className="text-center py-10 text-stone-500 bg-stone-50 rounded-xl border col-span-2">در حال حاضر درخواست برداشتی وجود ندارد.</div>
        ) : (
          withdrawals.map(w => (
            <div key={w._id} className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{w.workerId?.name}</h3>
                <span className={`text-xs px-2 py-1 rounded font-bold ${w.status === 'pending' ? 'bg-amber-100 text-amber-700' : w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{w.status}</span>
              </div>
              <p className="text-sm text-stone-500 mb-1">مبلغ: <span className="font-bold text-stone-800">{w.amount.toLocaleString()} ریال</span></p>
              <p className="text-sm text-stone-500 mb-4">شبا: {w.sheba}</p>
              {w.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => api.put(`/finance/withdrawals/${w._id}/status`, { status: 'approved' }).then(fetchData)} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold">تایید</button>
                  <button onClick={() => api.put(`/finance/withdrawals/${w._id}/status`, { status: 'rejected' }).then(fetchData)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold">رد</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  if (activeTab === 'finance-vat') {
    return (
      <div className="bg-white rounded-2xl border overflow-hidden p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">گزارش ارزش افزوده</h2>
        <div className="bg-stone-50 p-4 rounded-xl mb-4 text-violet-700 font-bold text-lg">
          مجموع کل مالیات جمع‌آوری شده: {vatReports.totalTax.toLocaleString()} ریال
        </div>
        <table className="w-full text-right">
          <thead className="bg-stone-100">
            <tr><th className="p-3">کد سفارش</th><th className="p-3">سفیر</th><th className="p-3">مبلغ پایه</th><th className="p-3">مالیات</th><th className="p-3">تاریخ</th></tr>
          </thead>
          <tbody>
            {vatReports.orders.map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-3 text-sm">{o._id.slice(-6)}</td>
                <td className="p-3 text-sm">{o.workerId?.name || '---'}</td>
                <td className="p-3 text-sm">{o.basePrice.toLocaleString()} ریال</td>
                <td className="p-3 text-sm font-bold text-red-600">{o.taxAmount.toLocaleString()} ریال</td>
                <td className="p-3 text-sm">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}