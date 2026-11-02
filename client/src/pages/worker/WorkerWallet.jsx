import { useState, useEffect } from 'react';
import { Wallet, ArrowDownToLine } from 'lucide-react';
import api from '../../lib/axios';

export default function WorkerWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wallet').then(res => {
      if (res.data.success) setWallet(res.data.data);
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-stone-800 border-b pb-2 flex items-center gap-2"><Wallet className="w-5 h-5" /> کیف پول من</h2>
      <div className="bg-gradient-to-br from-violet-600 to-pink-500 p-6 rounded-2xl text-white shadow-lg">
        <span className="text-sm opacity-80 block mb-1">موجودی قابل برداشت</span>
        <span className="text-4xl font-black">{(wallet?.balance || 0).toLocaleString()} <span className="text-lg font-normal">تومان</span></span>
      </div>
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="font-bold mb-4 flex items-center gap-2"><ArrowDownToLine className="w-5 h-5 text-violet-600" /> تاریخچه تراکنش‌ها</h3>
        {(!wallet?.transactions || wallet.transactions.length === 0) ? (
          <p className="text-center text-stone-500 py-4">هنوز تراکنشی ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {wallet.transactions.map((t, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                <div><span className="text-sm font-bold block">{t.description || (t.type === 'deposit' ? 'شارژ' : 'برداشت')}</span><span className="text-xs text-stone-500">{new Date(t.createdAt).toLocaleDateString('fa-IR')}</span></div>
                <span className={`font-bold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-500'}`}>{t.type === 'deposit' ? '+' : '-'}{t.amount.toLocaleString()} تومان</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
