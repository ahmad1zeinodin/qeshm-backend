export const RESTAURANT_CATEGORIES = [
  { id: 1, name: 'صبحانه‌خوری', icon: '🍳', desc: 'املت، عدسی، حلیم و...' },
  { id: 2, name: 'غذای ایرانی', icon: '🍚', desc: 'کباب، خورش، پلو و...' },
  { id: 3, name: 'فست‌فود', icon: '🍔', desc: 'پیتزا، ساندویچ، برگر' },
  { id: 4, name: 'محلی - دریایی', icon: '🐟', desc: 'غذاهای دریایی و محلی قشم' },
];

export const RESTAURANTS_BY_CATEGORY = {
  1: [
    { id: 101, name: 'صبحانه‌سرای قشم', food: 'املت، عدسی، حلیم', rating: 4.5, district: 'قشم', starLevel: 3, isOpen: true, hours: '۰۶:۰۰ تا ۱۲:۰۰' },
  ],
  2: [
    { id: 201, name: 'گلدن فود', food: 'انواع کباب و غذای ایرانی', rating: 4.5, district: 'قشم', starLevel: 3, isOpen: true, hours: '۱۲:۰۰ تا ۲۳:۰۰' },
    { id: 202, name: 'نعیم', food: 'پیتزا و ساندویچ', rating: 4.0, district: 'درگهان', starLevel: 2, isOpen: true, hours: '۱۱:۰۰ تا ۲۲:۰۰' },
  ],
  3: [
    { id: 301, name: 'فست‌فود درگهان', food: 'پیتزا، برگر، ساندویچ', rating: 4.2, district: 'درگهان', starLevel: 2, isOpen: true, hours: '۱۲:۰۰ تا ۲۴:۰۰' },
  ],
  4: [
    { id: 401, name: 'رستوران محلی کردستان', food: 'کباب و غذای سنتی', rating: 4.8, district: 'لافت', starLevel: 3, isOpen: false, hours: '۱۲:۰۰ تا ۲۳:۰۰' },
  ],
};

export const RESTAURANT_MENU = {
  101: [{ id: 1001, name: 'املت', price: 80000, desc: 'با نان تازه', available: true, category: 'صبحانه' }, { id: 1002, name: 'چای', price: 15000, desc: 'چای تازه', available: true, category: 'نوشیدنی' }],
  201: [{ id: 2001, name: 'کباب کوبیده', price: 250000, desc: 'گوشت تازه', available: true, category: 'غذای اصلی' }, { id: 2002, name: 'نوشابه', price: 20000, desc: 'کوکاکولا', available: true, category: 'نوشیدنی' }],
  202: [{ id: 2003, name: 'پیتزا مخصوص', price: 320000, desc: 'پنیر پیتزا', available: true, category: 'غذای اصلی' }],
  301: [{ id: 3001, name: 'برگر', price: 180000, desc: 'گوشت و پنیر', available: true, category: 'فست‌فود' }],
  401: [{ id: 4001, name: 'کباب سنتی', price: 280000, desc: 'با برنج', available: true, category: 'غذای اصلی' }],
};
