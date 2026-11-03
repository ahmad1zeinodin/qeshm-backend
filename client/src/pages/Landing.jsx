import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/SEO';
import api from '../lib/axios';

const heroImages = '/assets/backg-CuHfEock.jpg';
const heroWebp = '/assets/backg-ERrGBo2t.webp';
const roles = ["clients", "workers", "businesses"];
const rotatingWords = ["ویلا", "تعمیرکار", "کشتی تفریحی", "غواصی", "رستوران", "تور گشت جزیره", "صنایع دستی", "هتل", "بازار", "سوغات", "اقامتگاه", "جاذبه گردشگری"];

export default function Landing() {
  const { t } = useTranslation();
  const [activeRole, setActiveRole] = useState("clients");
  const [hasVideo, setHasVideo] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(false);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsTransitioning(true);
      }, 380);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const faqGroups = useMemo(() => roles.map(role => {
    const items = t(`landing.faq.groups.${role}.items`, { returnObjects: true });
    return {
      key: role,
      label: t(`landing.faq.groups.${role}.label`),
      items: Array.isArray(items) ? items : []
    };
  }), [t]);

  const { data: featuredWorkers = [] } = useQuery({
    queryKey: ['featuredWorkers'],
    queryFn: () => api.get('/workers/featured').then(res => res.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "پلتفرم خدمات قشمی نو",
    "description": "ارائه خدمات و نیازمندی‌های جزیره قشم",
    "provider": { "@type": "Organization", "name": "قشمی نو" },
    "areaServed": { "@type": "AdministrativeArea", "name": "جزیره قشم" }
  };

  return (
    <div>
      <SEO
        url="/"
        description="جامع‌ترین پلتفرم خدمات، گردشگری و نیازمندی‌های جزیره قشم."
        schema={schema}
      />

      {/* بخش هیرو (Hero) */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "clamp(600px, 92vh, 960px)", display: "flex", alignItems: "center" }}
      >
        <picture>
          <source srcSet={heroWebp} type="image/webp" />
          <img
            src={heroImages}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
        </picture>

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
                  transition: "opacity 0.38s ease, transform 0.38s ease",
                  opacity: isTransitioning ? 1 : 0,
                  transform: isTransitioning ? "translateY(0px)" : "translateY(-14px)",
                  display: "inline-block",
                  color: "#ea580c",
                  textShadow: "0 2px 10px rgba(234, 88, 12, 0.3)"
                }}
                className="text-6xl sm:text-7xl lg:text-8xl font-black"
              >
                {rotatingWords[currentWordIndex]}
              </span>
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              را در قشم پیدا کنید
            </span>
          </h1>

          <div className="flex flex-wrap gap-3 justify-center mb-14">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-900/40 hover:scale-[1.02] text-base"
            >
              مشاهده خدمات
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-stone-800 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:scale-[1.02] text-base"
            >
              عضویت در قشمی نو
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}