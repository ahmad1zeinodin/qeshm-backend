import { useState } from 'react';
import { UserPlus, CheckCircle, Camera, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';

const FIELDS_AND_SERVICES = {
  'خدمات': ['نظافت و پذیرایی', 'تعمیرات لوازم خانگی', 'تاسیسات'],
};

export default function AddVendor() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nationalId: '',
    email: '',
    password: '',
    field: '',
    service: '',
    selfie: null, // فایل عکس سلفی
    documents: null, // فایل مدارک
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'field') {
      setFormData(prev => ({ ...prev, service: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const nextStep = () => {
    // اعتبارسنجی هر مرحله
    if (step === 1 && (!formData.name || !formData.phone || !formData.nationalId || !formData.email || !formData.password)) {
      setMessage('لطفاً همه فیلدهای مشخصات فردی را پر کنید.');
      return;
    }
    if (step === 2 && !formData.selfie) {
      setMessage('عکس سلفی الزامی است.');
      return;
    }
    setMessage('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.field || !formData.service) {
      setMessage('لطفاً فیلد و خدمت را انتخاب کنید.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/admin/vendors', { ...formData, role: 'worker' });
      if (res.data.success) {
        setMessage('✅ سفیر با موفقیت ثبت‌نام شد.');
        setFormData({ name: '', phone: '', nationalId: '', email: '', password: '', field: '', service: '', selfie: null, documents: null });
        setStep(1);
      }
    } catch (err) {
      setMessage('❌ خطا: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-violet-600" /> ثبت‌نام سفیر (بخش خدمات)
      </h2>

      {/* نشانگر مراحل */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -z-10"></div>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-violet-600 text-white' : 'bg-stone-200 text-stone-500'}`}>
            {s}
          </div>
        ))}
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* مرحله ۱: مشخصات فردی */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-stone-800 border-b pb-2">۱. مشخصات فردی</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-stone-700 mb-1">نام و نام خانوادگی</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
              <div><label className="block text-sm font-bold text-stone-700 mb-1">شماره تماس</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
              <div><label className="block text-sm font-bold text-stone-700 mb-1">کد ملی</label><input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
              <div><label className="block text-sm font-bold text-stone-700 mb-1">ایمیل</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
              <div><label className="block text-sm font-bold text-stone-700 mb-1">رمز عبور</label><input type="text" name="password" value={formData.password} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold mt-4 flex items-center justify-center gap-2">مرحله بعد <ChevronLeft className="w-4 h-4" /></button>
          </div>
        )}

        {/* مرحله ۲: عکس سلفی */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-stone-800 border-b pb-2">۲. عکس سلفی (الزامی)</h3>
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center">
              <Camera className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="text-sm text-stone-500 mb-4">لطفاً یک عکس سلفی واضح از چهره سفیر بارگذاری کنید.</p>
              <input type="file" name="selfie" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
              {formData.selfie && <p className="text-green-600 text-sm mt-3">✅ عکس انتخاب شد: {formData.selfie.name}</p>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="flex-1 bg-stone-100 text-stone-700 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"><ChevronRight className="w-4 h-4" /> مرحله قبل</button>
              <button type="button" onClick={nextStep} className="flex-1 bg-violet-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2">مرحله بعد <ChevronLeft className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* مرحله ۳: مدارک */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-stone-800 border-b pb-2">۳. مدارک هویتی</h3>
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center">
              <FileText className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="text-sm text-stone-500 mb-4">لطفاً تصویر کارت ملی یا مدارک مهارت را بارگذاری کنید.</p>
              <input type="file" name="documents" accept="image/*,.pdf" onChange={handleFileChange} className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
              {formData.documents && <p className="text-green-600 text-sm mt-3">✅ مدرک انتخاب شد: {formData.documents.name}</p>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={prevStep} className="flex-1 bg-stone-100 text-stone-700 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"><ChevronRight className="w-4 h-4" /> مرحله قبل</button>
              <button type="button" onClick={nextStep} className="flex-1 bg-violet-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2">مرحله بعد <ChevronLeft className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* مرحله ۴: انتخاب فیلد و خدمت */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-stone-800 border-b pb-2">۴. اتصال به فیلد و خدمت</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">فیلد اصلی</label>
                <select name="field" value={formData.field} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required>
                  <option value="">انتخاب کنید...</option>
                  {Object.keys(FIELDS_AND_SERVICES).map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">خدمت</label>
                <select name="service" value={formData.service} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required disabled={!formData.field}>
                  <option value="">انتخاب کنید...</option>
                  {formData.field && FIELDS_AND_SERVICES[formData.field].map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={prevStep} className="flex-1 bg-stone-100 text-stone-700 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"><ChevronRight className="w-4 h-4" /> مرحله قبل</button>
              <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> {loading ? 'در حال ثبت...' : 'ثبت‌نام نهایی'}</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
