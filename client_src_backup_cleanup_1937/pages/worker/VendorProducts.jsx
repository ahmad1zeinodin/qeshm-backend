import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import SEO from '../../components/SEO';
import { SHOP_CATEGORIES } from '../../data/shopCategories';

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', desc: '', category: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setMessage('نام و قیمت الزامی است.');
      return;
    }
    
    // در آینده اینجا به API وصل می‌شود
    const newProduct = { ...formData, id: Date.now(), available: true };
    setProducts([...products, newProduct]);
    setFormData({ name: '', price: '', desc: '', category: '' });
    setShowForm(false);
    setMessage('✅ محصول با موفقیت اضافه شد.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6" dir="rtl">
      <SEO title="مدیریت محصولات" description="محصولات سفیر" url="/dashboard/worker/products" />
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard/worker" className="text-stone-500 hover:text-violet-600">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-stone-800">مدیریت محصولات / منو</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-violet-700">
            <Plus className="w-4 h-4" /> افزودن محصول جدید
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {/* فرم افزودن محصول */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6 space-y-4">
            <h3 className="font-bold text-stone-800">افزودن محصول / آیتم جدید</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">نام محصول</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">قیمت (تومان)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">توضیحات</label>
              <textarea value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">دسته‌بندی</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" required>
                <option value="">انتخاب کنید...</option>
                {SHOP_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">عکس محصول (اختیاری)</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
                <ImageIcon className="w-4 h-4 text-stone-400" />
                <input type="text" className="w-full text-sm focus:outline-none" placeholder="لینک عکس..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="text-stone-500 text-sm px-4 py-2 hover:bg-stone-200 rounded-lg">لغو</button>
              <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold">ذخیره محصول</button>
            </div>
          </form>
        )}

        {/* لیست محصولات */}
        {products.length === 0 ? (
          <div className="text-center py-10 text-stone-500 bg-white rounded-2xl border border-stone-200">
            هنوز هیچ محصولی ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-xl border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-stone-800 block">{product.name}</span>
                  <span className="text-xs text-stone-500">{product.category}</span>
                  <span className="text-sm font-bold text-violet-700 block mt-1">{Number(product.price).toLocaleString()} تومان</span>
                </div>
                <button onClick={() => setProducts(products.filter(p => p.id !== product.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
