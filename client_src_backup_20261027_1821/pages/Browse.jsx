import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Home, Monitor, GraduationCap, HeartPulse, Sparkles, Briefcase, Camera, Car, Palette, ChevronDown, ChevronRight } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import SEO from '../components/SEO';

const GROUP_META = {
  home_property:         { Icon: Home,          bg: 'bg-orange-100',  fg: 'text-orange-600'  },
  technology_digital:    { Icon: Monitor,        bg: 'bg-blue-100',    fg: 'text-blue-600'    },
  education_coaching:    { Icon: GraduationCap,  bg: 'bg-indigo-100',  fg: 'text-indigo-600'  },
  health_medical:        { Icon: HeartPulse,     bg: 'bg-red-100',     fg: 'text-red-600'     },
  beauty_wellness:       { Icon: Sparkles,       bg: 'bg-rose-100',    fg: 'text-rose-600'    },
  business_professional: { Icon: Briefcase,      bg: 'bg-violet-100',  fg: 'text-violet-600'  },
  events_creative:       { Icon: Camera,         bg: 'bg-pink-100',    fg: 'text-pink-600'    },
  automotive_transport:  { Icon: Car,            bg: 'bg-slate-100',   fg: 'text-slate-600'   },
  lifestyle_leisure:     { Icon: Palette,        bg: 'bg-fuchsia-100', fg: 'text-fuchsia-600' },
};

export default function Browse() {
  const { categories, isLoading } = useCategories();
  const [query, setQuery] = useState('');
  const [openFolders, setOpenFolders] = useState({});

  const tree = useMemo(() => {
    const roots = categories.filter(c => !c.parentId);
    return roots.map(root => ({
      ...root,
      children: categories.filter(c => c.parentId === root._id)
    }));
  }, [categories]);

  const filteredTree = useMemo(() => {
    if (!query.trim()) return tree;
    const q = query.toLowerCase();
    return tree.map(root => ({
      ...root,
      children: root.children.filter(c => c.name.toLowerCase().includes(q))
    })).filter(root => root.name.toLowerCase().includes(q) || root.children.length > 0);
  }, [query, tree]);

  const toggleFolder = (slug) => {
    setOpenFolders(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      <SEO title="مرور خدمات" description="خدمات جزیره قشم" url="/services" />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-violet-600 via-violet-500 to-pink-500 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-14 pb-10 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-black mb-3 text-white tracking-tight">مرور خدمات</h1>
          <p className="text-violet-100 text-base mb-6">
            {categories.length} خدمت — متخصص مناسب برای هر کاری را پیدا کنید
          </p>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-xl shadow-violet-900/20 overflow-hidden">
              <svg className="w-5 h-5 text-stone-400 mr-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی خدمات..."
                className="flex-1 px-3 py-4 text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tree view */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {isLoading && <p className="text-center text-stone-500 py-20">در حال بارگذاری...</p>}

        {!isLoading && filteredTree.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-600 font-medium">هیچ خدمتی یافت نشد</p>
            <p className="text-stone-400 text-sm mt-1">یک کلمه کلیدی متفاوت را امتحان کنید</p>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            {filteredTree.map((root) => {
              const meta = GROUP_META[root.group] || GROUP_META.home_property;
              const Icon = meta.Icon;
              const isOpen = openFolders[root.slug] ?? (query.trim() !== '');
              const hasChildren = root.children.length > 0;

              return (
                <div key={root.slug} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <button
                    onClick={() => toggleFolder(root.slug)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-stone-50 transition-colors text-right"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta.bg}`}>
                      <Icon className={`w-5 h-5 ${meta.fg}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-stone-800">{root.name}</h2>
                      <p className="text-xs text-stone-400">{root.children.length} زیرمجموعه</p>
                    </div>
                    {hasChildren && (
                      <div className="text-stone-400">
                        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    )}
                  </button>

                  {isOpen && hasChildren && (
                    <div className="border-t border-stone-100 p-4 bg-stone-50">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {root.children.map((child) => (
                          <Link
                            key={child._id}
                            to={`/professionals?category=${child.slug}`}
                            className="bg-white rounded-xl p-3 border border-stone-200 hover:border-violet-400 hover:shadow-md transition-all group flex flex-col justify-between"
                          >
                            <div className="text-sm font-semibold text-stone-800 group-hover:text-violet-700">{child.name}</div>
                            <div className="flex items-center justify-between mt-2">
                              {child.workerCount > 0 ? (
                                <span className="text-xs text-stone-500">{child.workerCount} متخصص</span>
                              ) : (
                                <span className="text-xs text-amber-500">اولین نفر باشید!</span>
                              )}
                              {child.starLevel && (
                                <span className="text-xs text-amber-500 flex items-center gap-1">
                                  {'⭐'.repeat(child.starLevel)}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
