import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import {
  HardHat, Monitor, GraduationCap, Camera, Sparkles,
  Home, HeartPulse, Car, Briefcase, Truck, Plane, Palette,
  ChevronRight, Award, ShieldCheck, Store, Lock,
  User, Hammer, Search, ClipboardList, CheckCircle,
  Rocket, Megaphone, DollarSign, Check,
} from 'lucide-react';
import SEO from '../components/SEO';
import { useCategories } from '../hooks/useCategories';
import { CATEGORY_GROUPS } from '../lib/categoryGroups';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ScoreRing from '../components/ScoreRing';
import WorkerCard from '../components/WorkerCard';
import api from '../lib/axios';
import bg from '../img/backg.jpg';
import bgWebp from '../img/backg.webp';
import bgtwo from "../img/img.jpg";
import imgClient from '../img/client.png';
import imgPros   from '../img/pro.jpg';
import { DISTRICTS, SERVICE_AREA, SITE_NAME, CONTACT_EMAIL, HERO_VIDEO_URL, CURRENCY_SYMBOL } from '../config/site.js';

const GROUP_META = {
  home_property:         { Icon: Home,          bg: 'bg-orange-100',  fg: 'text-orange-600',  cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75&auto=format&fit=crop' },
  technology_digital:    { Icon: Monitor,        bg: 'bg-blue-100',    fg: 'text-blue-600',    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=75&auto=format&fit=crop' },
  education_coaching:    { Icon: GraduationCap,  bg: 'bg-indigo-100',  fg: 'text-indigo-600',  cover: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=75&auto=format&fit=crop' },
  health_medical:        { Icon: HeartPulse,     bg: 'bg-red-100',     fg: 'text-red-600',     cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=75&auto=format&fit=crop' },
  beauty_wellness:       { Icon: Sparkles,       bg: 'bg-rose-100',    fg: 'text-rose-600',    cover: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=75&auto=format&fit=crop' },
  business_professional: { Icon: Briefcase,      bg: 'bg-violet-100',  fg: 'text-violet-600',  cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=75&auto=format&fit=crop' },
  events_creative:       { Icon: Camera,         bg: 'bg-pink-100',    fg: 'text-pink-600',    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=75&auto=format&fit=crop' },
  automotive_transport:  { Icon: Car,            bg: 'bg-slate-100',   fg: 'text-slate-600',   cover: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&q=75&auto=format&fit=crop' },
  lifestyle_leisure:     { Icon: Palette,        bg: 'bg-fuchsia-100', fg: 'text-fuchsia-600', cover: 'https://images.unsplash.com/photo-1452827073306-6e6e661baf57?w=600&q=75&auto=format&fit=crop' },
};

const FAQ_KEYS = ['clients', 'workers', 'businesses'];
const TOPIC_KEYS = ['general', 'subscription', 'dispute', 'partnership', 'other'];

const HERO_WORDS = [
  'ویلا',
  'تعمیرکار',
  'کشتی تفریحی',
  'غواصی',
  'رستوران',
  'تور گشت جزیره',
  'صنایع دستی',
  'هتل',
  'بازار',
  'سوغات',
  'اقامتگاه',
  'جاذبه گردشگری',
];

export default function Landing() {
  const { groupedCategories } = useCategories();
  const { t } = useTranslation();
  const [faqTab, setFaqTab]   = useState('clients');
  const [openFaq, setOpenFaq] = useState(null);

  const [wordIdx,  setWordIdx]  = useState(0);
  const [wordShow, setWordShow] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordShow(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % HERO_WORDS.length);
        setWordShow(true);
      }, 380);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const [showHeroVideo, setShowHeroVideo] = useState(false);
  useEffect(() => {
    if (!HERO_VIDEO_URL) return;
    const mq = window.matchMedia('(min-width: 640px) and (prefers-reduced-motion: no-preference)');
    setShowHeroVideo(mq.matches);
    const onChange = (e) => setShowHeroVideo(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleFaqTab = (key) => { setFaqTab(key); setOpenFaq(null); };
  const handleFaqItem = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  const FAQ_GROUPS = useMemo(
    () =>
      FAQ_KEYS.map((key) => {
        const items = t(`landing.faq.groups.${key}.items`, { returnObjects: true });
        return {
          key,
          label: t(`landing.faq.groups.${key}.label`),
          items: Array.isArray(items) ? items : [],
        };
      }),
    [t],
  );

  const { data: featured = [] } = useQuery({
    queryKey: ['featuredWorkers'],
    queryFn: () => api.get('/workers/featured').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const landingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'پلتفرم خدمات قشمی نو',
    'description': 'ارائه خدمات و نیازمندی‌های جزیره قشم',
    'provider': { '@type': 'Organization', 'name': 'قشمی نو' },
    'areaServed': { '@type': 'AdministrativeArea', 'name': SERVICE_AREA },
  };

  return (
    <div>
      <SEO
        url="/"
        description="جامع‌ترین پلتفرم خدمات، گردشگری و نیازمندی‌های جزیره قشم."
        schema={landingSchema}
      />
      
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "clamp(600px, 92vh, 960px)", display: "flex", alignItems: "center" }}
      >
        <picture>
          <source srcSet={bgWebp} type="image/webp" />
          <img src={bg} alt="" aria-hidden="true" fetchpriority="high" decoding="async" className="absolute inset-0 z-0 w-full h-full object-cover" />
        </picture>

        {showHeroVideo && (
          <video autoPlay muted loop playsInline preload="auto" poster={bg} aria-hidden="true" className="absolute inset-0 z-0 w-full h-full object-cover">
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-24">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase">
              پلتفرم جامع خدمات جزیره قشم
            </span>
          </div>

          <h1 className="text-center text-white drop-shadow-xl mb-5 leading-tight">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              بهترین
            </span>
            <span className="block my-1 sm:my-2" aria-live="polite" aria-atomic="true">
              <span
                style={{
                  fontFamily: "'Vazirmatn', sans-serif",
                  transition: 'opacity 0.38s ease, transform 0.38s ease',
                  opacity:    wordShow ? 1 : 0,
                  transform:  wordShow ? 'translateY(0px)' : 'translateY(-14px)',
                  display:    'inline-block',
                  color: '#ea580c',
                  textShadow: '0 2px 10px rgba(234, 88, 12, 0.3)'
                }}
                className="text-6xl sm:text-7xl lg:text-8xl font-black"
              >
                {HERO_WORDS[wordIdx]}
              </span>
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              را در قشم پیدا کنید
            </span>
          </h1>

          <p className="text-center text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
                      </p>

          <div className="flex flex-wrap gap-3 justify-center mb-14">
            <Link to="/services" className="inline-flex items-center gap-2 bg-gradient-to-br from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-900/40 hover:scale-[1.02] text-base">
              مشاهده خدمات
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-stone-800 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:scale-[1.02] text-base">
              عضویت در قشمی نو
            </Link>
          </div>
        </div>
      </section>

      {/* بخش‌های دیگر (به عنوان یک بلوک ساده در پایین صفحه) */}
      <div className="py-20 text-center bg-white text-stone-600">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">به زودی...</h2>
        <p>بخش‌های دیگر این صفحه (دسته‌بندی خدمات، نظرات، تعرفه‌ها) در حال آماده‌سازی است.</p>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 text-center text-sm">
        <div className="flex justify-center mb-5">
          <LanguageSwitcher compact dark />
        </div> 
        <p className="mb-3">© ۲۰۲۶ قشمی نو. تمامی حقوق محفوظ است.</p>
        <div className="flex items-center justify-center gap-5 text-xs text-stone-500">
          <Link to="/terms" className="hover:text-[#ea580c] transition-colors">قوانین</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-[#ea580c] transition-colors">حریم خصوصی</Link>
          <span>·</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#ea580c] transition-colors">تماس با ما</a>
        </div>
      </footer>
    </div>
  );
}