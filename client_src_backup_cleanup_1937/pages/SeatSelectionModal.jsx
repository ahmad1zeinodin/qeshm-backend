import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const HALL_TEMPLATES = {
  small: { name: 'سالن کوچک (۳۰ نفره)', rows: 5, cols: 6 },
  medium: { name: 'سالن متوسط (۱۰۰ نفره)', rows: 10, cols: 10 },
  large: { name: 'سالن بزرگ (۲۰۰ نفره)', rows: 10, cols: 20 },
};

export default function SeatSelectionModal({ isOpen, onClose, eventName, basePrice, onConfirm }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [template, setTemplate] = useState('medium');

  if (!isOpen) return null;

  const hall = HALL_TEMPLATES[template];
  const ROWS = hall.rows;
  const COLS = hall.cols;
  const VIP_ROWS = [1, 2];

  const toggleSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    if (selectedSeats.includes(seatId)) setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    else setSelectedSeats([...selectedSeats, seatId]);
  };

  const getSeatPrice = (row) => VIP_ROWS.includes(row) ? basePrice * 1.5 : basePrice;
  const totalPrice = selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(parseInt(seatId.split('-')[0])), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">{eventName}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-red-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex justify-center gap-2 mb-4">
            {Object.entries(HALL_TEMPLATES).map(([key, t]) => (
              <button key={key} onClick={() => { setTemplate(key); setSelectedSeats([]); }} className={`px-2 py-1 rounded-lg text-xs font-bold ${template === key ? 'bg-violet-600 text-white' : 'bg-stone-100 text-stone-600'}`}>{t.name}</button>
            ))}
          </div>
          <div className="w-full h-3 bg-stone-300 rounded-t-lg mb-6 text-center text-[10px] text-stone-500">صفحه نمایش</div>
          <div className="flex flex-col items-center gap-1 mb-6 overflow-x-auto">
            {Array.from({ length: ROWS }, (_, r) => r + 1).map((row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: COLS }, (_, c) => c + 1).map((col) => {
                  const seatId = `${row}-${col}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isVIP = VIP_ROWS.includes(row);
                  return (
                    <button key={seatId} onClick={() => toggleSeat(row, col)} className={`w-6 h-6 rounded-t-lg text-[10px] font-bold ${isSelected ? 'bg-violet-600 text-white' : isVIP ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>{col}</button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-stone-50 flex justify-between items-center">
          <div className="text-sm"><span className="font-bold">{selectedSeats.length} صندلی</span> - <span className="font-bold text-violet-700">{totalPrice.toLocaleString()} تومان</span></div>
          <button onClick={() => { onConfirm(selectedSeats.map(seatId => ({ id: seatId, name: `صندلی ${seatId}`, price: getSeatPrice(parseInt(seatId.split('-')[0])) }))); onClose(); }} disabled={selectedSeats.length === 0} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> تایید</button>
        </div>
      </div>
    </div>
  );
}
