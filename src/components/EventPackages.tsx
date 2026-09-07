import React, { useState, useRef } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { EventPackage } from '../types';

interface EventPackagesProps {
  packages: EventPackage[];
  onSelectPackage: (pkg: EventPackage) => void;
  onOpenAiAdvisor: () => void;
}

export const EventPackages: React.FC<EventPackagesProps> = ({
  packages,
  onSelectPackage,
  onOpenAiAdvisor
}) => {
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'swipe' | 'grid'>('swipe');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -310, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 310, behavior: 'smooth' });
    }
  };

  const handleContainerScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length > 0) {
        let closestIdx = 0;
        let minDiff = Infinity;
        children.forEach((child, idx) => {
          const childOffset = child.offsetLeft - container.offsetLeft - 16;
          const diff = Math.abs(scrollLeft - childOffset);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        setCurrentSwipeIndex(closestIdx);
      }
    }
  };

  return (
    <section id="packages" className="py-8 sm:py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FF1E1E] animate-pulse" />
            <span>Turnkey Event Production</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase">
            POPULAR ALL-IN-ONE PACKAGES
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Pre-configured production packages engineered for Davao’s leading venues. Fully customizable to your guest count & venue layout.
          </p>

          {/* Mobile Display View Switcher */}
          <div className="flex sm:hidden items-center justify-between pt-3 border-t border-white/5 w-full">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF1E1E]" />
              <span>Display Layout:</span>
            </div>
            <div className="flex items-center gap-1 bg-black/80 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setMobileLayoutMode('swipe')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                  mobileLayoutMode === 'swipe'
                    ? 'bg-[#FF1E1E] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setMobileLayoutMode('grid')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                  mobileLayoutMode === 'grid'
                    ? 'bg-[#FF1E1E] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MODULAR SWIPE SHOWCASE */}
        <div className={`sm:hidden ${mobileLayoutMode === 'swipe' ? 'block' : 'hidden'} space-y-3`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-[#FF1E1E]" />
              <span>Swipe package ({currentSwipeIndex + 1} of {packages.length})</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleScrollLeft}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                aria-label="Previous package"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleScrollRight}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                aria-label="Next package"
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
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="w-[85vw] max-w-[340px] shrink-0 snap-start bg-white/5 rounded-2xl border border-white/10 hover:border-[#FF1E1E]/50 transition-all flex flex-col overflow-hidden shadow-2xl relative justify-between"
              >
                {pkg.badge && (
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded bg-[#FF1E1E] text-black font-black text-[9px] uppercase tracking-widest shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                <div className="relative h-[180px] bg-[#050505] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/techno_core_3d_logo.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-bold text-[#FF1E1E] font-mono">
                    <span className="uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border border-white/10">{pkg.tag}</span>
                    <span className="text-gray-200 font-sans bg-black/80 px-2 py-0.5 rounded border border-white/10">{pkg.guestCapacity}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{pkg.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{pkg.subtitle}</p>

                    <div className="pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                        Inclusions:
                      </div>
                      <div className="space-y-1.5">
                        {pkg.inclusions.slice(0, 3).map((inc, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Starting Rate</div>
                        <div className="text-lg font-black text-white">
                          ₱{pkg.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-400 text-right uppercase tracking-wider font-bold">
                        Setup Included
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className="w-full min-h-[48px] rounded-xl bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Customize & Book</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progressive Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {packages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const targetChild = container.children[idx] as HTMLElement;
                    if (targetChild) {
                      container.scrollTo({
                        left: targetChild.offsetLeft - container.offsetLeft - 16,
                        behavior: 'smooth'
                      });
                    }
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSwipeIndex
                    ? 'w-6 bg-[#FF1E1E] shadow-[0_0_10px_rgba(255,30,30,0.6)]'
                    : 'w-1.5 bg-white/20 hover:bg-white/50'
                }`}
                aria-label={`Go to package ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Modular Grid Layout for Desktop & Mobile Grid toggle */}
        <div className={`${mobileLayoutMode === 'swipe' ? 'hidden sm:grid' : 'grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-center items-stretch`}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#FF1E1E]/50 transition-all flex flex-col overflow-hidden shadow-2xl relative group w-full"
            >
              {pkg.badge && (
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#FF1E1E] text-black font-black text-[8px] sm:text-[10px] uppercase tracking-widest shadow-lg">
                  {pkg.badge}
                </div>
              )}

              {/* Package Header Image */}
              <div className="relative h-[130px] sm:h-52 bg-[#050505] overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/techno_core_3d_logo.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-2.5 sm:left-3 sm:right-3 flex items-center justify-between text-[9px] sm:text-[11px] font-bold text-[#FF1E1E] font-mono">
                  <span className="uppercase tracking-widest bg-black/75 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/10 truncate max-w-[90px] sm:max-w-none">{pkg.tag}</span>
                  <span className="text-gray-200 font-sans bg-black/75 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/10 text-[8px] sm:text-[10px] truncate max-w-[80px] sm:max-w-none">{pkg.guestCapacity}</span>
                </div>
              </div>

              {/* Package Body */}
              <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-5">
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-xs sm:text-xl font-black text-white uppercase tracking-tight line-clamp-2 sm:line-clamp-none">{pkg.title}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed line-clamp-2 sm:line-clamp-none">{pkg.subtitle}</p>

                  <div className="pt-1 border-t border-white/5 sm:border-none">
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                      Package Inclusions:
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      {pkg.inclusions.slice(0, 3).map((inc, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 sm:line-clamp-2">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-4 border-t border-white/10 space-y-2.5 sm:space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest">Starting Rate</div>
                      <div className="text-sm sm:text-2xl font-black text-white">
                        ₱{pkg.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold">
                      Includes Setup & Crew
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full min-h-[40px] sm:min-h-[52px] rounded-xl bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,30,30,0.3)] transition-all flex items-center justify-center gap-1.5 sm:gap-2 group/btn"
                  >
                    <span>Customize & Book</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Auto Customizer Banner */}
        <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-[#FF1E1E]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF1E1E] blur-[120px] opacity-10 pointer-events-none" />
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1E1E] uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#FF1E1E] animate-pulse" />
              <span>Need a Custom Setup for Your Venue?</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              Let AI calculate exact sound, LED size & generator kVA
            </h3>
            <p className="text-xs text-gray-400 max-w-xl">
              Input your guest count, venue type, and location (e.g., Pearl Farm Samal, SMX Davao, or Eden Park) to receive an instant recommended package and PHP estimate.
            </p>
          </div>

          <button
            onClick={onOpenAiAdvisor}
            className="px-6 py-3.5 rounded-sm bg-[#FF1E1E] text-black font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(255,30,30,0.4)] transition-all shrink-0 flex items-center gap-2 relative z-10"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Open AI Quote Advisor</span>
          </button>
        </div>

      </div>
    </section>
  );
};
