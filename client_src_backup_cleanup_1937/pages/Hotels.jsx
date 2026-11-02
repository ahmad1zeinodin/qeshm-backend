import { useState } from 'react';
import { Star, MapPin, ArrowRight, Building2, Tent, Home, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import OrderFlow from '../components/OrderFlow';

const HOTEL_CATEGORIES = [
  { id: 'hotel', name: 'هتل', icon: Building2 },
  { id: 'ecolodge', name: 'بوم‌گردی', icon: Tent },
  { id: 'villa', name: 'خانه و ویلا', icon: Home },
];

const VENDORS_BY_CATEGORY = {
  hotel: [
    { id: 1, name: 'هتل هرمز', desc: 'هتل ۵ ستاره با ویو دریا', rating: 4.8, district: 'قشم', starLevel: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  ],
  ecolodge: [
    { id: 3, name: 'اقامتگاه بومی لافت', desc: 'تجربه زندگی سنتی در لافت', rating: 4.9, district: 'لافت', starLevel: 4, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800' },
  ],
  villa: [
    { id: 4, name: 'ویلای ساحلی', desc: 'ویلا با استخر خصوصی', rating: 4.5, district: 'رمچاه', starLevel: 4, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' },
  ],
};

// اطلاعات اتاق‌ها با عکس و امکانات
const ROOMS = {
  1: [
    { id: 101, name: 'اتاق دو تخته دلوکس', price: 2500000, desc: 'با صبحانه و ویو دریا', available: true, category: 'اتاق', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500', amenities: ['وای‌فای رایگان', 'صبحانه', 'ویو دریا'] },
    { id: 102, name: 'سوئیت رویال', price: 4500000, desc: 'سوئیت با پذیرایی و جکوزی', available: true, category: 'سوئیت', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500', amenities: ['جکوزی', 'پذیرایی', 'صبحانه'] }
  ],
  3: [
    { id: 301, name: 'اتاق سنتی', price: 800000, desc: 'با صبحانه محلی', available: true, category: 'اقامت', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500', amenities: ['صبحانه محلی', 'حیاط سنتی'] }
  ],
  4: [
    { id: 401, name: 'ویلای کامل', price: 5000000, desc: 'مناسب ۸ نفر', available: true, category: 'ویلا', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500', amenities: ['استخر', 'آشپزخانه', 'پارکینگ'] }
  ],
};

export default function Hotels() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  return (
    <div className="min-h-screen bg-stone-50 py-10" dir="rtl">
      <SEO title="هتل و اقامتگاه" description="بهترین هتل‌ها و اقامتگاه‌های جزیره قشم" url="/hotels" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800 border-r-4 border-orange-500 pr-3">
            {selectedVendor ? selectedVendor.name : selectedCategory ? selectedCategory.name : 'هتل و اقامتگاه قشم'}
          </h1>
        </div>

        {/* مرحله ۱: دسته‌بندی‌ها */}
        {!selectedCategory && !selectedVendor && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOTEL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer text-center p-8" onClick={() => setSelectedCategory(cat)}>
                  <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-bold text-stone-800">{cat.name}</h2>
                </div>
              );
            })}
          </div>
        )}

        {/* مرحله ۲: لیست هتل‌ها */}
        {selectedCategory && !selectedVendor && (
          <div className="space-y-6">
            <button onClick={() => setSelectedCategory(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1"><ArrowRight className="w-4 h-4" /> بازگشت</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(VENDORS_BY_CATEGORY[selectedCategory.id] || []).map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                  <img src={vendor.image} alt={vendor.name} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-stone-800">{vendor.name}</h2>
                    <p className="text-sm text-stone-500 mt-1">{vendor.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="flex items-center gap-1 text-sm text-amber-500 font-bold"><Star className="w-4 h-4 fill-current" /> {vendor.rating}</span>
                      <span className="flex items-center gap-1 text-xs text-stone-400"><MapPin className="w-3 h-3" /> {vendor.district}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* مرحله ۳: نمایش اتاق‌ها با عکس و اطلاعات */}
        {selectedVendor && (
          <div className="space-y-6">
            <button onClick={() => setSelectedVendor(null)} className="text-sm text-violet-600 hover:underline flex items-center gap-1"><ArrowRight className="w-4 h-4" /> بازگشت به لیست هتل‌ها</button>
            
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <img src={selectedVendor.image} alt={selectedVendor.name} className="w-24 h-24 rounded-xl object-cover" />
                <div>
                  <h2 className="text-xl font-bold text-stone-800">{selectedVendor.name}</h2>
                  <p className="text-sm text-stone-500 mt-1">{selectedVendor.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-amber-500 font-bold">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current" /> {selectedVendor.rating}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">انتخاب اتاق</h3>
              
              <div className="space-y-4">
                {(ROOMS[selectedVendor.id] || []).map((room) => (
                  <div key={room.id} className="flex flex-col md:flex-row gap-4 p-3 border rounded-xl bg-stone-50 hover:border-violet-300 transition-all">
                    <img src={room.image} alt={room.name} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-stone-800">{room.name}</h4>
                          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded">{room.category}</span>
                        </div>
                        <p className="text-sm text-stone-500 mt-1">{room.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.amenities?.map((am, i) => (
                            <span key={i} className="text-xs text-stone-500 flex items-center gap-1 bg-white border px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3 text-green-500" /> {am}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3 md:mt-0">
                        <span className="text-lg font-black text-violet-700">{room.price.toLocaleString()} تومان <span className="text-xs font-normal text-stone-500">/ شب</span></span>
                        <button onClick={() => setSelectedRoomForBooking(room)} className="bg-violet-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-violet-700">
                          رزرو
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {selectedRoomForBooking && (
        <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4">
            <button onClick={() => setSelectedRoomForBooking(null)} className="mb-4 text-sm text-violet-600 flex items-center gap-1">
              <ArrowRight className="w-4 h-4" /> بازگشت
            </button>
            <OrderFlow 
              vendorId={selectedVendor?.id} 
              vendorName={selectedVendor?.name} 
              vendorType="hotel" 
              items={[{ ...selectedRoomForBooking, id: selectedRoomForBooking.id, available: true }]} 
              deliveryFee={0}
            />
          </div>
        </div>
      )}
    </div>
  );
}
