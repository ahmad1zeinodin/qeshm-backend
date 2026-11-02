import { useState } from 'react';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import OrderFlow from '../components/OrderFlow';

const ATTRACTION_CATEGORIES = [
  { id: 1, name: 'جاذبه‌های گردشگری', icon: '🏖️', desc: 'غار خربس، تنگه چاهکوه و...' },
  { id: 2, name: 'سینما', icon: '🎬', desc: 'سینما سیتی و...' },
  { id: 3, name: 'کنسرت', icon: '🎵', desc: 'کنسرت‌های موسیقی' },
  { id: 4, name: 'تفریحات دریایی', icon: '🚢', desc: 'کشتی تفریحی، قایق‌سواری' },
];

const VENDORS_BY_CATEGORY = {
  1: [
    { id: 101, name: 'غار خربس', desc: 'بازدید از غار تاریخی', price: 50000, type: 'attraction', location: 'قشم', time: 'همه روزه', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
    { id: 102, name: 'تنگه چاهکوه', desc: 'بازدید از دره شگفت‌انگیز', price: 60000, type: 'attraction', location: 'قشم', time: 'همه روزه', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
  ],
  2: [
    { id: 201, name: 'سینما سیتی', desc: 'مدرن‌ترین سینمای قشم', type: 'cinema', location: 'قشم - بلوار امام', time: '۱۰:۰۰ تا ۲۴:۰۰', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400' },
  ],
  3: [
    { id: 301, name: 'تهیه‌کننده کنسرت موسیقی سنتی', desc: 'اجرای زنده گروه موسیقی', type: 'concert', location: 'قشم - سالن فرهنگی', time: '۲۱:۰۰', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400' },
  ],
  4: [
    { id: 401, name: 'کشتی تفریحی علی بابا', desc: 'بازدید از دلفین‌ها', price: 350000, type: 'boat', location: 'اسکله قشم', time: '۱۶:۰۰', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
    { id: 402, name: 'قایق‌سواری', desc: 'قایق موتوری', price: 150000, type: 'boat', location: 'اسکله قشم', time: 'همه روزه', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400' },
  ],
};

const CINEMA_MOVIES = [
  { id: 1, name: 'در چشم باد', price: 80000, desc: 'فیلم جدید', category: 'بلیط سینما', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', showtimes: ['۱۶:۰۰', '۱۸:۰۰', '۲۰:۰۰'] },
  { id: 2, name: 'فیلم کمدی', price: 90000, desc: 'خنده‌دار', category: 'بلیط سینما', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', showtimes: ['۱۷:۰۰', '۱۹:۰۰', '۲۱:۰۰'] },
];

const CONCERT_EVENTS = [
  { id: 1, name: 'کنسرت موسیقی سنتی', price: 250000, desc: 'اجرای زنده', category: 'بلیط کنسرت', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', showtimes: ['۲۱:۰۰'] },
];

export default function Attractions() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // مرحله ۱: دسته‌بندی‌ها
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
        <SEO title="تفریح و سرگرمی" description="بهترین تفریحات جزیره قشم" url="/attractions" />
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3 mb-6">تفریح و سرگرمی قشم</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ATTRACTION_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                <div className="h-32 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center"><span className="text-6xl">{cat.icon}</span></div>
                <div className="p-4"><h2 className="text-lg font-bold text-stone-800">{cat.name}</h2><p className="text-sm text-stone-500 mt-1">{cat.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // مرحله ۲: خدمات‌دهنده‌ها
  if (selectedCategory && !selectedVendor) {
    return (
      <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => setSelectedCategory(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-6"><ArrowRight className="w-4 h-4" /> بازگشت به دسته‌بندی‌ها</button>
          <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3 mb-6">{selectedCategory.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(VENDORS_BY_CATEGORY[selectedCategory.id] || []).map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                <img src={vendor.image} alt={vendor.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-stone-800">{vendor.name}</h2>
                  <p className="text-sm text-stone-500 mt-1">{vendor.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-stone-500 mt-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {vendor.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {vendor.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // مرحله ۳: فیلم‌ها و انتخاب سانس
  if (selectedVendor && !selectedItem && !selectedShowtime) {
    const items = selectedVendor.type === 'cinema' ? CINEMA_MOVIES : selectedVendor.type === 'concert' ? CONCERT_EVENTS : [{ ...selectedVendor, category: 'بلیط', showtimes: [] }];
    return (
      <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => setSelectedVendor(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-6"><ArrowRight className="w-4 h-4" /> بازگشت</button>
          <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3 mb-2">{selectedVendor.name}</h1>
          <p className="text-stone-500 mb-6">{selectedVendor.desc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all">
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-stone-800">{item.name}</h2>
                  <p className="text-sm text-stone-500 mt-1">{item.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-violet-700">{item.price.toLocaleString()} تومان</span>
                  </div>
                  {item.showtimes && item.showtimes.length > 0 ? (
                    <div className="mt-4 border-t pt-3">
                      <span className="text-xs font-bold text-stone-600 mb-2 block">انتخاب سانس:</span>
                      <div className="flex flex-wrap gap-2">
                        {item.showtimes.map((time) => (
                          <button 
                            key={time} 
                            onClick={() => { setSelectedItem(item); setSelectedShowtime(time); }}
                            className="relative flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-violet-700 transition-all shadow-md"
                          >
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedItem(item)} className="w-full mt-4 bg-violet-600 text-white py-2 rounded-lg font-bold">مشاهده و رزرو</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // مرحله ۴: انتخاب صندلی و پرداخت
  if (selectedItem) {
    const finalItem = { ...selectedItem, showtime: selectedShowtime };
    return (
      <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => { setSelectedItem(null); setSelectedShowtime(null); }} className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-6"><ArrowRight className="w-4 h-4" /> بازگشت</button>
          <OrderFlow 
            vendorId={selectedVendor.id} 
            vendorName={selectedVendor.name} 
            vendorType="attraction" 
            items={[{ 
              id: 1, 
              name: finalItem.name, 
              price: finalItem.price, 
              available: true, 
              showtime: finalItem.showtime,
              movieName: finalItem.name 
            }]} 
            deliveryFee={0}
          />
        </div>
      </div>
    );
  }

  return null;
}
