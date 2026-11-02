import { useState, useEffect } from 'react';
import { Wallet, ArrowDownToLine, History, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';
import SEO from '../../components/SEO';

export default function WorkerWallet() {
  const [walletData, setWalletData] = useState({ balance: 0, minWithdrawalLimit: 0 });
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/wallet');
        if (res.data.success) {
          setWalletData(res.data.data.wallet);
          setTransactions(res.data.data.transactions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setMessage('لطفاً مبلغ معتبری وارد کنید.');
      return;
    }
    try {
      const res = await api.post('/wallet/withdraw', { amount: Number(withdrawAmount) });
      if (res.data.success) {
        setMessage('✅ درخواست برداشت با موفقیت ثبت شد.');
        setWithdrawAmount('');
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="کیف پول" description="مدیریت مالی سفیر" url="/dashboard/worker/wallet" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-violet-600" /> کیف پول من
        </h1>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {/* کارت موجودی */}
        <div className="bg-gradient-to-br from-violet-600 to-pink-500 p-6 rounded-2xl text-white mb-6 shadow-lg">
          <span className="text-sm opacity-80 block mb-1">موجودی قابل برداشت</span>
          <span className="text-4xl font-black">{walletData.balance.toLocaleString()} <span className="text-lg font-normal">تومان</span></span>
          <div className="mt-3 text-xs opacity-80">حداقل موجودی (کف حساب): {walletData.minWithdrawalLimit.toLocaleString()} تومان</div>
        </div>

        {/* فرم درخواست برداشت */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-violet-600" /> درخواست برداشت وجه
          </h2>
          <form onSubmit={handleWithdraw} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-stone-600 mb-1">مبلغ درخواستی (تومان)</label>
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="مثلاً 500000" />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">ثبت درخواست</button>
          </form>
        </div>

        {/* تاریخچه تراکنش‌ها */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-violet-600" /> تاریخچه تراکنش‌ها
          </h2>
          {transactions.length === 0 ? (
            <p className="text-stone-500 text-sm">هنوز تراکنشی ثبت نشده است.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                  <div>
                    <span className="font-bold text-sm block">{tx.description}</span>
                    <span className="text-xs text-stone-500">{new Date(tx.createdAt).toLocaleDateString('fa-IR')}</span>
                  </div>
                  <div className="text-left">
                    <span className={`font-bold block ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()} تومان
                    </span>
                    <span className="text-xs text-stone-400">{tx.status === 'pending' ? 'در انتظار تایید' : tx.status === 'success' ? 'موفق' : 'ناموفق'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
