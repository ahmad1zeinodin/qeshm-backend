export function CleaningIcon({ className = "w-12 h-12" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
      {/* سایه زیر کاراکتر */}
      <ellipse cx="50" cy="90" rx="30" ry="8" fill="#e2e8f0" />
      
      {/* بدن (لباس فرم آبی) */}
      <path d="M 30 50 Q 30 80 35 85 L 65 85 Q 70 80 70 50 Z" fill="#2563eb" />
      <path d="M 30 50 Q 50 55 70 50 L 68 60 Q 50 65 32 60 Z" fill="#1e40af" opacity="0.3" />
      
      {/* سر (پوست) */}
      <circle cx="50" cy="35" r="18" fill="#fcd34d" />
      
      {/* کلاه (آبی) */}
      <path d="M 32 30 Q 50 15 68 30 Q 68 35 65 35 L 35 35 Q 32 35 32 30 Z" fill="#1d4ed8" />
      <rect x="35" y="32" width="30" height="4" rx="2" fill="#1e3a8a" />
      
      {/* چشم‌ها */}
      <circle cx="43" cy="38" r="2.5" fill="#1e293b" />
      <circle cx="57" cy="38" r="2.5" fill="#1e293b" />
      
      {/* لبخند */}
      <path d="M 45 45 Q 50 50 55 45" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* دست‌ها (دستکش زرد) */}
      <circle cx="25" cy="65" r="6" fill="#facc15" />
      <circle cx="75" cy="65" r="6" fill="#facc15" />
      
      {/* جارو (دسته) */}
      <rect x="72" y="55" width="4" height="30" rx="2" fill="#a16207" transform="rotate(15 74 55)" />
      
      {/* سر جارو */}
      <path d="M 68 85 L 85 85 L 82 90 L 70 90 Z" fill="#475569" />
      <path d="M 70 90 L 82 90 L 80 95 L 72 95 Z" fill="#334155" />
      
      {/* دستمال در دست چپ */}
      <path d="M 20 60 Q 15 70 20 75 Q 25 70 20 60 Z" fill="#38bdf8" />
    </svg>
  );
}