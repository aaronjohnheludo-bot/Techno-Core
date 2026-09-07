import React, { useState, useRef } from 'react';
import { Radio, Award, Truck, Users, Cpu, ShieldCheck, ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid, Sparkles } from 'lucide-react';

export const WhyTechnoCore: React.FC = () => {
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'swipe' | 'grid'>('swipe');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);

  const reasons = [
    {
      icon: <Radio className="w-5 h-5 text-[#FF1E1E]" />,
      badge: 'Retail & Rentals',
      title: 'Two-in-One Powerhouse',
      description: 'The rare combined expertise of a full retail pro audio store and a large-scale event production house under one roof.'
    },
    {
      icon: <Award className="w-5 h-5 text-amber-400" />,
      badge: 'Authentic Warranty',
      title: '100% Genuine Pro Gear',
      description: 'We stock and deploy authentic equipment from QSC, Shure, Roland, Samson, Boss, DBX, Laney, Sonor, and more.'
    },
    {
      icon: <Truck className="w-5 h-5 text-emerald-400" />,
      badge: 'Mindanao Wide',
      title: 'Davao & Mindanao Logistics',
      description: 'Based in Ilustre Davao City with full logistics setup for Samal, Tagum, Digos, General Santos, and Bukidnon.'
    },
    {
      icon: <Users className="w-5 h-5 text-blue-400" />,
      badge: 'Certified Team',
      title: 'Certified Sound Engineers',
      description: 'Every rental includes on-site FOH sound directors, lighting technicians, and generator engineers for zero downtime.'
    }
  ];

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -290, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 290, behavior: 'smooth' });
    }
  };

  const handleContainerScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const index = Math.round(scrollLeft / 280);
      setCurrentSwipeIndex(Math.min(Math.max(0, index), reasons.length - 1));
    }
  };

  return (
    <section className="py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">
            WHY DAVAO TRUSTS TECHNO CORE
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Pro gear sales, rentals, certified sound engineers, and full Mindanao logistics.
          </p>
        </div>

        {/* MOBILE MODULAR SWIPE SHOWCASE */}
        <div className={`sm:hidden ${mobileLayoutMode === 'swipe' ? 'block' : 'hidden'} space-y-3`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-[#FF1E1E]" />
              <span>Swipe advantage ({currentSwipeIndex + 1} of {reasons.length})</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleScrollLeft}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                aria-label="Previous advantage"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleScrollRight}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                aria-label="Next advantage"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            onScroll={handleContainerScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-1 scrollbar-none scroll-smooth"
          >
            {reasons.map((r, i) => (
              <div
                key={i}
                className="w-[82vw] max-w-[310px] shrink-0 snap-center bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-[#FF1E1E]/40 transition-all shadow-2xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:border-[#FF1E1E]/50 group-hover:bg-[#FF1E1E]/10 transition-colors">
                      {r.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                      {r.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{r.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1.5">{r.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified Techno Core Standard</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1">
            {reasons.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ left: idx * 290, behavior: 'smooth' });
                  }
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSwipeIndex
                    ? 'w-6 bg-[#FF1E1E]'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Modular Grid Layout for Desktop & Mobile Grid toggle (2x2 Quad Box Matrix on Mobile) */}
        <div className={`${mobileLayoutMode === 'swipe' ? 'hidden sm:grid' : 'grid'} grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 justify-center items-stretch`}>
          {reasons.map((r, i) => (
            <div
              key={i}
              className="bg-white/5 p-3.5 sm:p-6 rounded-2xl border border-white/10 hover:border-[#FF1E1E]/40 transition-all hover:-translate-y-1 shadow-xl group flex flex-col justify-between space-y-3 sm:space-y-4 w-full"
            >
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:border-[#FF1E1E]/50 group-hover:bg-[#FF1E1E]/10 transition-colors">
                    {r.icon}
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 truncate max-w-[90px] sm:max-w-none">
                    {r.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-tight line-clamp-2 sm:line-clamp-none">{r.title}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed mt-1 sm:mt-1.5 line-clamp-3 sm:line-clamp-none">{r.description}</p>
                </div>
              </div>

              <div className="pt-2 sm:pt-3 border-t border-white/5 flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Techno Core Standard</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

