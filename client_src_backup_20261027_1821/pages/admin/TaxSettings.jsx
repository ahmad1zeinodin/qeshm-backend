import { useState } from 'react';
import { Receipt, CheckCircle } from 'lucide-react';

const SECTIONS = [
  { id: 'restaurant', name: 'رستوران‌ها' },
  { id: 'shop', name: 'فروشگاه‌ها (سوپرمارکت)' },
  { id: 'attraction', name: 'تفریح و سرگرمی (سینما/کنسرت)' },
  { id: 'services', name: 'خدمات (متخصصین)' },
];

export default function TaxSettings() {
  const [taxConfig, setTaxConfig] = useState({
    restaurant: { enabled: false, percent: 9 },
    shop: { enabled: false, percent: 9 },
    attraction: { enabled: true, percent: 9 },
    services: { enabled: false, percent: 9 },
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (sectionId) => {
    setTaxConfig(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], enabled: !prev[sectionId].enabled }
    }));
  };

  const handlePercentChange = (sectionId, value) => {
    setTaxConfig(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], percent: Number(value) }
    }));
  };

  const handleSave = () => {
    // در آینده این اطلاعات به دیتابیس ذخیره می‌شود
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-violet-600" /> تنظیمات مالیات بر ارزش افزوده
      </h2>

      <p className="text-sm text-stone-500 mb-6">
        برای هر بخش، مشخص کنید که آیا مالیات بر ارزش افزوده اعمال شود یا خیر. درصد مالیات را نیز می‌توانید تعیین کنید.
      </p>

      <div className="space-y-4 mb-6">
        {SECTIONS.map((section) => (
          <div key={section.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl bg-stone-50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={taxConfig[section.id].enabled}
                onChange={() => handleToggle(section.id)}
                className="w-5 h-5 accent-violet-600 cursor-pointer"
              />
              <span className="font-bold text-stone-700">{section.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">درصد:</span>
              <input
                type="number"
                value={taxConfig[section.id].percent}
                onChange={(e) => handlePercentChange(section.id, e.target.value)}
                disabled={!taxConfig[section.id].enabled}
                className="w-16 border border-stone-300 rounded-lg px-2 py-1 text-sm text-center disabled:opacity-50"
              />
              <span className="text-sm text-stone-500">%</span>
            </div>
          </div>
        ))}
      </div>

      {saved && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> تنظیمات با موفقیت ذخیره شد.
        </div>
      )}

      <button onClick={handleSave} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold hover:bg-violet-700 transition-colors">
        ذخیره تنظیمات
      </button>
    </div>
  );
}
