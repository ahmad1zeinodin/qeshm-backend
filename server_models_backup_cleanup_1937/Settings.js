import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  aboutUs: { type: String, default: 'پلتفرم جامع خدمات، گردشگری و نیازمندی‌های جزیره قشم.' },
  contactPhone: { type: String, default: '076-3222XXXX' },
  contactEmail: { type: String, default: 'info@qeshminoo.ir' },
  contactAddress: { type: String, default: 'جزیره قشم، بلوار امام خمینی، ساختمان قشمی نو' },
  prayerTimes: {
    fajr: { type: String, default: '۰۵:۱۲' },
    sunrise: { type: String, default: '۰۶:۳۰' },
    dhuhr: { type: String, default: '۱۱:۵۸' },
    sunset: { type: String, default: '۱۷:۲۵' },
    maghrib: { type: String, default: '۱۷:۴۳' },
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Settings', settingsSchema);
