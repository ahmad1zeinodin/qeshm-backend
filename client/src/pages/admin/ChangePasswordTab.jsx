import { useState } from 'react';
import api from '../../lib/axios';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ChangePasswordTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('رمز عبور جدید و تکرار آن یکسان نیستند.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage('✅ رمز عبور با موفقیت تغییر کرد.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || 'خطا در تغییر رمز عبور'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-lg">
      <div className="flex items-center gap-2 mb-6">
        <KeyRound className="w-6 h-6 text-violet-600" />
        <h2 className="text-lg font-bold text-stone-800">تغییر رمز عبور ادمین</h2>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            رمز عبور فعلی
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            رمز عبور جدید
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
          <p className="text-xs text-stone-400 mt-1">حداقل ۶ کاراکتر</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            تکرار رمز عبور جدید
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-bold hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
        </button>
      </form>
    </div>
  );
}