import { useState } from 'react';
import { Star, MapPin, ArrowRight, Lock, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import OrderFlow from '../components/OrderFlow';

const SHOP_CATEGORIES = [
  { id: 1, name: 'سوپرمارکت', icon: '🛒', desc: 'خرید روزانه و مواد غذایی' },
  { id: 2, name: 'هایپر میوه', icon: '🍎', desc: 'میوه و سبزیجات تازه' },
  { id: 3, name: 'کافه بستنی', icon: '🍦', desc: 'بستنی و نوشیدنی' },
];

const SHOPS_BY_CATEGORY = {
  1: [
    { id: 101, name: 'افق کوروش', desc: 'شعبه قشم - خرید روزانه', rating: 4.5, district: 'قشم', starLevel: 3, isOpen: true, hours: '۰۸:۰۰ تا ۲۳:۰۰' },
    { id: 102, name: 'شهروند', desc: 'شعبه درگهان - مواد غذایی', rating: 4.2, district: 'درگهان', starLevel: 2, isOpen: true, hours: '۰۸:۰۰ تا ۲۲:۰۰' },
  ],
  2: [
    { id: 201, name: 'هایپر میوه قشم', desc: 'میوه تازه', rating: 4.0, district: 'قشم', starLevel: 2, isOpen: true, hours: '۰۸:۰۰ تا ۲۱:۰۰' },
  ],
  3: [
    { id: 301, name: 'بستنی نعمت', desc: 'بستنی سنتی', rating: 4.8, district: 'قشم', starLevel: 3, isOpen: true, hours: '۱۰:۰۰ تا ۲۴:۰۰' },
  ],
};

const PRODUCTS = {
  101: [
    { id: 1001, name: 'برنج ایرانی', price: 150000, desc: 'برنج طارم', available: true, category: 'مواد غذایی' },
    { id: 1002, name: 'روغن مایع', price: 85000, desc: 'آفتابگردان', available: true, category: 'مواد غذایی' },
  ],
  102: [
    { id: 1003, name: 'شیرینی خشک', price: 120000, desc: 'شیرینی تازه', available: true, category: 'تنقلات' },
  ],
  201: [
    { id: 2001, name: 'سیب', price: 50000, desc: 'سیب سرخ', available: true, category: 'میوه' },
    { id: 2002, name: 'موز', price: 70000, desc: 'موز تازه', available: true, category: 'میوه' },
  ],
  301: [
    { id: 3001, name: 'بستنی سنتی', price: 35000, desc: 'با خلال بادام', available: true, category: 'بستنی' },
  ],
};

export default function ShopBrowse() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title="فروشگاه‌ها" description="بهترین فروشگاه‌های جزیره قشم" url="/shop" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3">
            {selectedShop ? selectedShop.name : selectedCategory ? selectedCategory.name : 'فروشگاه‌های قشم'}
          </h1>
        </div>

        {!selectedCategory && !selectedShop && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOP_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                <div className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center"><span className="text-6xl">{cat.icon}</span></div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-stone-800">{cat.name}</h2>
                  <p className="text-sm text-stone-500 mt-1">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCategory && !selectedShop && (
          <div className="space-y-6">
            <button onClick={() => setSelectedCategory(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1"><ArrowRight className="w-4 h-4" /> بازگشت به دسته‌بندی‌ها</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(SHOPS_BY_CATEGORY[selectedCategory.id] || []).map((shop) => (
                <div key={shop.id} className={`bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all relative ${shop.isOpen ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}`} onClick={() => shop.isOpen && setSelectedShop(shop)}>
                  {!shop.isOpen && <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[1px] z-10 flex items-center justify-center"><Lock className="w-12 h-12 text-white/80 drop-shadow-lg" /></div>}
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center"><span className="text-6xl">🛒</span></div>
                  <div className="p-4 relative z-20">
                    <h2 className="text-lg font-bold text-stone-800">{shop.name}</h2>
                    <p className="text-sm text-stone-500 mt-1">{shop.desc}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-800 mt-1 bg-white/90 px-2 py-1 rounded-md border border-stone-200 w-fit"><Clock className="w-3 h-3" /> {shop.hours}</div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="flex items-center gap-1 text-sm text-amber-500 font-bold"><Star className="w-4 h-4 fill-current" /> {shop.rating}</span>
                      <span className="flex items-center gap-1 text-xs text-stone-400"><MapPin className="w-3 h-3" /> {shop.district}</span>
                      <span className="text-xs text-amber-500 font-bold">{'⭐'.repeat(shop.starLevel)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedShop && (
          <div className="space-y-6">
            <button onClick={() => setSelectedShop(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1"><ArrowRight className="w-4 h-4" /> بازگشت به لیست فروشگاه‌ها</button>
            <OrderFlow vendorId={selectedShop.id} vendorName={selectedShop.name} vendorType="shop" items={PRODUCTS[selectedShop.id] || []} />
          </div>
        )}
      </div>
    </div>
  );
}
