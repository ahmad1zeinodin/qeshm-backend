import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Home, CreditCard, CheckCircle, ArrowRight, Ticket } from 'lucide-react';
import api from '../lib/axios';
import SeatSelectionModal from './SeatSelectionModal';

export default function OrderFlow({ vendorId, vendorName, vendorType, items, deliveryFee = 20000, userAddress = 'قشم، بلوار امام خمینی، کوچه ۱۲، پلاک ۵' }) {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState('menu');
  const [address, setAddress] = useState(userAddress);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [newAddressText, setNewAddressText] = useState('');
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [currentSeatItem, setCurrentSeatItem] = useState(null);
  const [trackingCode, setTrackingCode] = useState('');

  const addToCart = (item) => {
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    else setCart([...cart, { item, quantity: 1 }]);
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => prev.map(c => {
      if (c.item.id === itemId) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const vatPercent = 9; // درصد مالیات (فعلاً تستی)
  const vatAmount = (totalPrice * vatPercent) / 100;
  const finalAmount = totalPrice + vatAmount;
  const isTicket = vendorType === 'attraction';
  const isHotel = vendorType === 'hotel';
  const needsCart = vendorType !== 'hotel' && vendorType !== 'attraction';

  const handleCheckout = async () => {
    try {
      const generatedCode = 'TRK-' + Math.floor(10000000 + Math.random() * 90000000);
      setTrackingCode(generatedCode);

      const res = await api.post('/orders', {
        vendorId, vendorName, vendorType,
        items: cart.map(c => ({ name: c.item.name, price: c.item.price, quantity: c.quantity })),
        totalPrice, deliveryFee: isTicket ? 0 : deliveryFee, finalAmount: totalPrice + (isTicket ? 0 : deliveryFee), address: isTicket ? 'بدون آدرس (بلیط)' : address,
        trackingCode: generatedCode,
      });
      if (res.data.success) setStep('success');
      else alert('خطا در ثبت سفارش');
    } catch (err) { alert('خطا: ' + (err.response?.data?.message || err.message)); }
  };

  if (step === 'menu') {
    return (
      <div className="space-y-4 relative">
        <div className="space-y-3">
          {items.map((item) => {
            const cartItem = cart.find(c => c.item.id === item.id);
            return (
              <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl border ${item.available ? 'bg-white border-stone-200' : 'bg-stone-50 opacity-60'}`}>
                <div>
                  <span className="text-sm font-bold block">{item.name}</span>
                  {item.desc && <span className="text-xs text-stone-500 block">{item.desc}</span>}
                  <span className="text-xs font-bold text-violet-700">{item.price.toLocaleString()} تومان</span>
                </div>
                {cartItem ? (
                  <div className="flex items-center gap-3 bg-violet-50 border rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus className="w-4 h-4 text-violet-600" /></button>
                    <span className="text-sm font-bold">{cartItem.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus className="w-4 h-4 text-red-500" /></button>
                  </div>
                ) : (
                  <button onClick={() => { if (isTicket) { setCurrentSeatItem(item); setShowSeatModal(true); } else { addToCart(item); if (!needsCart) setStep('checkout'); } }} className="text-xs px-4 py-2 rounded-lg font-bold bg-violet-600 text-white hover:bg-violet-700">افزودن</button>
                )}
              </div>
            );
          })}
        </div>
        {cart.length > 0 && !isHotel && (
          <button onClick={() => setStep('cart')} className="fixed bottom-6 left-6 z-50 bg-violet-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold">
            <ShoppingCart className="w-6 h-6" /> <span>سبد خرید</span> <span className="bg-white text-violet-700 rounded-full w-6 h-6 flex items-center justify-center">{cart.reduce((n, c) => n + c.quantity, 0)}</span>
          </button>
        )}
        {showSeatModal && currentSeatItem && (
          <SeatSelectionModal 
            isOpen={showSeatModal} 
            onClose={() => setShowSeatModal(false)} 
            eventName={currentSeatItem.name} 
            basePrice={currentSeatItem.price}
            onConfirm={(seats) => { seats.forEach(s => addToCart({ ...currentSeatItem, id: s.id, name: `${currentSeatItem.movieName || currentSeatItem.name} - صندلی ${s.id}`, price: s.price })); }}
          />
        )}
      </div>
    );
  }
  if (step === 'cart') {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-3 border-b pb-2">سبد خرید</h3>
          {cart.map(c => (
            <div key={c.item.id} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-sm">{c.item.name}</span>
              <span className="text-sm font-bold">{(c.item.price * c.quantity).toLocaleString()} تومان</span>
            </div>
          ))}
          <div className="mt-4 flex justify-between font-bold"><span>مجموع:</span><span>{(totalPrice + (isTicket ? 0 : deliveryFee)).toLocaleString()} تومان</span></div>
          <button onClick={() => setStep('checkout')} className="w-full mt-4 bg-violet-600 text-white py-2 rounded-lg font-bold">ادامه</button>
        </div>
      </div>
    );
  }
  if (step === 'checkout') {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-3 border-b pb-2 text-stone-800 flex items-center gap-2"><Home className="w-4 h-4" /> پیش‌فاکتور</h3>
          
          <div className="bg-stone-50 p-3 rounded-lg mb-4">
            <div className="flex justify-between text-sm mb-2"><span>فروشنده:</span><span className="font-bold">{vendorName}</span></div>
            <div className="flex justify-between text-sm mb-2"><span>تاریخ:</span><span className="font-bold">{new Date().toLocaleDateString('fa-IR')}</span></div>
            <div className="border-t pt-2 mt-2">
              {cart.map(c => (
                <div key={c.item.id} className="flex justify-between items-start text-xs text-stone-600 mb-3 border-b border-stone-100 pb-2 last:border-0">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm text-stone-800">{c.item.name.split(' - ')[0]}</span>
                    <span className="text-stone-500">
                      {c.item.showtime ? `ساعت ${c.item.showtime}` : ''} 
                      {c.item.name.includes('صندلی') ? ` - ${c.item.name.split(' - ')[1]}` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-stone-800 whitespace-nowrap">{c.item.price.toLocaleString()} تومان</span>
                </div>
              ))}
            </div>
          </div>

          {!isTicket ? (
            <>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm"><Home className="w-4 h-4" /> آدرس تحویل</h4>
              {!isNewAddress ? (
                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg mb-4">
                  <span className="text-sm">{address}</span>
                  <button onClick={() => setIsNewAddress(true)} className="text-xs text-violet-600 font-bold">تغییر</button>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  <textarea value={newAddressText} onChange={(e) => setNewAddressText(e.target.value)} className="w-full border rounded-lg p-2 text-sm" rows="2" />
                  <button onClick={() => { if(newAddressText.trim()) { setAddress(newAddressText.trim()); setIsNewAddress(false); } }} className="bg-violet-600 text-white px-4 py-1 rounded-lg text-sm">تایید</button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 p-3 rounded-lg mb-4">
              <Ticket className="w-4 h-4" /> این یک بلیط است و نیازی به آدرس ندارد. کد رهگیری پس از پرداخت صادر می‌شود.
            </div>
          )}

          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between text-sm mb-1"><span>جمع کل:</span><span>{totalPrice.toLocaleString()} تومان</span></div>
            <div className="flex justify-between text-sm mb-1"><span>مالیات بر ارزش افزوده ({vatPercent}%):</span><span>{vatAmount.toLocaleString()} تومان</span></div>
            {!isTicket && <div className="flex justify-between text-sm mb-1"><span>هزینه ارسال:</span><span>{deliveryFee.toLocaleString()} تومان</span></div>}
            <div className="flex justify-between font-bold mt-2 text-lg"><span>قابل پرداخت:</span><span>{(finalAmount + (isTicket ? 0 : deliveryFee)).toLocaleString()} تومان</span></div>
          </div>
          <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-green-700"><CreditCard className="w-4 h-4" /> پرداخت آنلاین</button>
        </div>
      </div>
    );
  }
  return (
    <div className="text-center py-10 bg-white rounded-xl border shadow-sm">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="font-bold text-xl text-stone-800">سفارش شما با موفقیت ثبت شد!</h3>
      {isTicket && (
        <div className="mt-4 bg-violet-50 p-4 rounded-xl inline-block border border-violet-200">
          <p className="text-sm text-stone-600 mb-1">کد رهگیری شما:</p>
          <p className="font-mono font-black text-2xl text-violet-700 tracking-wider">{trackingCode}</p>
          <p className="text-xs text-stone-400 mt-2">این کد را در سینما ارائه دهید.</p>
        </div>
      )}
    </div>
  );
}
