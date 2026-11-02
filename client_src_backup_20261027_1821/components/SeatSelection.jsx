import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

// قالب‌های پیش‌فرض سالن
const HALL_TEMPLATES = {
  small: { name: 'سالن کوچک (۳۰ نفره)', rows: 5, cols: 6 },
  medium: { name: 'سالن متوسط (۱۰۰ نفره)', rows: 10, cols: 10 },
  large: { name: 'سالن بزرگ (۲۰۰ نفره)', rows: 10, cols: 20 },
};

export default function SeatSelection({ eventName, basePrice, onConfirm, onBack, hallTemplate = 'medium' }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [template, setTemplate] = useState(hallTemplate);

  const hall = HALL_TEMPLATES[template];
  const ROWS = hall.rows;
  const COLS = hall.cols;
  const VIP_ROWS = [1, 2]; // ردیف‌های VIP

  const toggleSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatPrice = (row) => {
    return VIP_ROWS.includes(row) ? basePrice * 1.5 : basePrice;
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const row = parseInt(seatId.split('-')[0]);
    return sum + getSeatPrice(row);
  }, 0);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-violet-600 flex items-center gap-1"><ArrowRight className="w-4 h-4" /> بازگشت</button>
      
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-bold text-lg mb-2 text-center">{eventName}</h3>
        <p className="text-sm text-stone-500 text-center mb-4">سالن: {hall.name} - ظرفیت: {ROWS * COLS} نفر</p>
        
        {/* انتخاب قالب سالن (فقط برای تست) */}
        <div className="flex justify-center gap-2 mb-6">
          {Object.entries(HALL_TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => { setTemplate(key); setSelectedSeats([]); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${template === key ? 'bg-violet-600 text-white' : 'bg-stone-100 text-stone-600'}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* صفحه نمایش */}
        <div className="w-full h-4 bg-stone-300 rounded-t-lg mb-8 text-center text-xs text-stone-500">صفحه نمایش</div>

        {/* نقشه صندلی‌ها */}
        <div className="flex flex-col items-center gap-1 mb-6 overflow-x-auto">
          {Array.from({ length: ROWS }, (_, r) => r + 1).map((row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: COLS }, (_, c) => c + 1).map((col) => {
                const seatId = `${row}-${col}`;
                const isSelected = selectedSeats.includes(seatId);
                const isVIP = VIP_ROWS.includes(row);
                return (
                  <button
                    key={seatId}
                    onClick={() => toggleSeat(row, col)}
                    className={`w-7 h-7 rounded-t-lg text-xs font-bold transition-colors ${
                      isSelected ? 'bg-violet-600 text-white' : 
                      isVIP ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
                      'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* راهنما */}
        <div className="flex justify-center gap-4 text-xs text-stone-500 mb-6">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 rounded"></span> VIP</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-stone-100 rounded"></span> معمولی</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-600 rounded"></span> انتخاب شده</span>
        </div>

        {/* خلاصه */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-sm mb-1"><span>صندلی‌های انتخاب شده:</span><span>{selectedSeats.length} عدد</span></div>
          <div className="flex justify-between font-bold text-lg"><span>مجموع:</span><span>{totalPrice.toLocaleString()} تومان</span></div>
        </div>

        <button 
          onClick={() => onConfirm(selectedSeats.map(seatId => ({ id: seatId, name: `صندلی ${seatId}`, price: getSeatPrice(parseInt(seatId.split('-')[0])) })))}
          disabled={selectedSeats.length === 0}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> تایید و ادامه
        </button>
      </div>
    </div>
  );
}
