import React, { useState, useRef } from 'react';
import { Search, FileText, CheckCircle, Truck, ArrowRight, Layers, ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'swipe' | 'grid'>('swipe');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);

  const steps = [
    {
      step: '01',
      icon: <Search className="w-5 h-5 text-[#FF1E1E]" />,
      title: 'Browse & Inquire',
      description: 'Explore retail gear or rental services, or use our AI Advisor to auto-calculate your venue requirements.'
    },
    {
      step: '02',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      title: 'Get Detailed Quote',
      description: 'Receive an itemized quote detailing rates, generator kVA specs, tent sizes, and crew inclusions.'
    },
    {
      step: '03',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      title: 'Confirm Booking',
      description: 'Lock in your event date or reserve retail stock via GCash, Maya, Bank Transfer, or walk-in cash deposit.'
    },
    {
      step: '04',
      icon: <Truck className="w-5 h-5 text-blue-400" />,
      title: 'Setup / Delivery',
      description: 'Our technical crew arrives early for soundcheck, LED alignment, and full event supervision.'
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
      setCurrentSwipeIndex(Math.min(Math.max(0, index), steps.length - 1));
    }
  };

  return (
    <section className="py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">
            HOW IT WORKS
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Four simple steps from initial quote to event delivery and setup.
          </p>
        </div>

        {/* MOBILE MODULAR SWIPE SHOWCASE */}
        <div className={`sm:hidden ${mobileLayoutMode === 'swipe' ? 'block' : 'hidden'} space-y-3`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-[#FF1E1E]" />
              <span>Swipe step ({currentSwipeIndex + 1} of {steps.length})</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleScrollLeft}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleScrollRight}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                aria-label="Next step"
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
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="w-[82vw] max-w-[310px] shrink-0 snap-center bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-[#FF1E1E]/40 transition-all shadow-2xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:border-[#FF1E1E]/50 group-hover:bg-[#FF1E1E]/10 transition-colors">
                      {s.icon}
                    </div>
                    <span className="text-2xl font-black text-gray-600 font-mono tracking-wider">
                      {s.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{s.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1.5">{s.description}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center text-[10px] font-bold text-[#FF1E1E] uppercase tracking-widest gap-1">
                  <span>Phase {s.step}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1">
            {steps.map((_, idx) => (
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
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4 Steps Grid Layout (2x2 Quad Box Matrix on Mobile) */}
        <div className={`${mobileLayoutMode === 'swipe' ? 'hidden sm:grid' : 'grid'} grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 justify-center items-stretch`}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white/5 p-3.5 sm:p-6 rounded-2xl border border-white/10 hover:border-[#FF1E1E]/40 transition-all shadow-xl space-y-3 sm:space-y-4 relative group flex flex-col justify-between w-full"
            >
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5 sm:pb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:border-[#FF1E1E]/50 group-hover:bg-[#FF1E1E]/10 transition-colors">
                    {s.icon}
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-gray-600 font-mono tracking-wider">
                    {s.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-tight line-clamp-2 sm:line-clamp-none">{s.title}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed mt-1 sm:mt-1.5 line-clamp-3 sm:line-clamp-none">{s.description}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center text-[9px] sm:text-[10px] font-bold text-[#FF1E1E] uppercase tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                <span>Phase {s.step}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

