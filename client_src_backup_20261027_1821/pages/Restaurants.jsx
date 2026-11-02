import { useState } from 'react';
import { Star, MapPin, ArrowRight, Lock, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { RESTAURANT_CATEGORIES, RESTAURANTS_BY_CATEGORY, RESTAURANT_MENU } from '../data/restaurantsData';
import OrderFlow from '../components/OrderFlow';







export default function Restaurants() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title="رستوران‌ها" description="بهترین رستوران‌های جزیره قشم" url="/restaurants" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3">
            {selectedRestaurant ? selectedRestaurant.name : selectedCategory ? selectedCategory.name : 'رستوران‌های قشم'}
          </h1>
        </div>

        {!selectedCategory && !selectedRestaurant && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESTAURANT_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                <div className="h-32 bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center"><span className="text-6xl">{cat.icon}</span></div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-stone-800">{cat.name}</h2>
                  <p className="text-sm text-stone-500 mt-1">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCategory && !selectedRestaurant && (
          <div className="space-y-6">
            <button onClick={() => setSelectedCategory(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1"><ArrowRight className="w-4 h-4" /> بازگشت به دسته‌بندی‌ها</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(RESTAURANTS_BY_CATEGORY[selectedCategory.id] || []).map((rest) => (
                <div key={rest.id} className={`bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all relative ${rest.isOpen ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}`} onClick={() => rest.isOpen && setSelectedRestaurant(rest)}>
                  {!rest.isOpen && <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[1px] z-10 flex items-center justify-center"><Lock className="w-12 h-12 text-white/80 drop-shadow-lg" /></div>}
                  <div className="h-32 bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center"><span className="text-6xl">🍔</span></div>
                  <div className="p-4 relative z-20">
                    <h2 className="text-lg font-bold text-stone-800">{rest.name}</h2>
                    <p className="text-sm text-stone-500 mt-1">{rest.food}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-800 mt-1 bg-white/90 px-2 py-1 rounded-md border border-stone-200 w-fit"><Clock className="w-3 h-3" /> {rest.hours}</div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="flex items-center gap-1 text-sm text-amber-500 font-bold"><Star className="w-4 h-4 fill-current" /> {rest.rating}</span>
                      <span className="flex items-center gap-1 text-xs text-stone-400"><MapPin className="w-3 h-3" /> {rest.district}</span>
                      <span className="text-xs text-amber-500 font-bold">{'⭐'.repeat(rest.starLevel)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedRestaurant && (
          <div className="space-y-6">
            <button onClick={() => setSelectedRestaurant(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1"><ArrowRight className="w-4 h-4" /> بازگشت به لیست رستوران‌ها</button>
            <OrderFlow vendorId={selectedRestaurant.id} vendorName={selectedRestaurant.name} vendorType="restaurant" items={RESTAURANT_MENU[selectedRestaurant.id] || []} />
          </div>
        )}
      </div>
    </div>
  );
}
