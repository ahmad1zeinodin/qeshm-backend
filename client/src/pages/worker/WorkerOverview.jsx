import { ShoppingBag, DollarSign, Package, Users } from 'lucide-react';

export default function WorkerOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-stone-800 border-b pb-2">خلاصه وضعیت</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
          <span className="text-sm text-violet-600 font-bold block mb-1 flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> سفارشات امروز</span>
          <span className="text-3xl font-black text-violet-800">۰</span>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <span className="text-sm text-green-600 font-bold block mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4" /> درآمد امروز</span>
          <span className="text-2xl font-black text-green-800">۰ تومان</span>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <span className="text-sm text-amber-600 font-bold block mb-1 flex items-center gap-1"><Package className="w-4 h-4" /> محصولات فعال</span>
          <span className="text-3xl font-black text-amber-800">۰</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <span className="text-sm text-blue-600 font-bold block mb-1 flex items-center gap-1"><Users className="w-4 h-4" /> مشتریان</span>
          <span className="text-3xl font-black text-blue-800">۰</span>
        </div>
      </div>
    </div>
  );
}
