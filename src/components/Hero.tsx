import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, 
  Music, Video, Activity, Clock 
} from 'lucide-react';
import { CMSData } from '../types';

interface HeroProps {
  cms: CMSData;
  onOpenQuoteModal: () => void;
  onOpenAiAdvisor: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  cms,
  onOpenQuoteModal,
  onOpenAiAdvisor,
  onNavigateSection
}) => {
  return (
    <section id="hero" className="relative bg-[#050505] text-white overflow-hidden py-8 sm:py-12 lg:py-20 border-b border-white/5">
      {/* Background Atmosphere Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FF1E1E] rounded-full blur-[160px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FF1E1E] rounded-full blur-[140px] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#050505] pointer-events-none" />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FF1E1E 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Headline & Description */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 px-3.5 py-1 rounded-full mb-5 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-[#FF1E1E] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF1E1E]">
                Pro Audio & Event Production • Davao City
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter uppercase mb-5 text-white">
              Elevating <br />
              <span className="text-transparent border-b-4 border-[#FF1E1E]" style={{ WebkitTextStroke: '1px white' }}>
                The Beat
              </span>{' '}
              of Every Stage
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm sm:text-base max-w-lg mb-6 leading-relaxed mx-auto lg:mx-0">
              Pro concert staging, line array sound, P3.91 LED walls, and authentic performance gear across Davao & Mindanao.
            </p>

            {/* Social Proof Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mb-7 opacity-80 border-y border-white/5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white">{cms.facebookFollowers}</span>
                <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">Followers</span>
              </div>
              <div className="w-px h-6 bg-white/10 hidden sm:block" />
              <div className="flex gap-3 items-center text-[10px] uppercase text-gray-400 font-bold">
                <span>Dealer:</span>
                <span className="text-gray-300 font-black tracking-widest">QSC • SHURE • ROLAND • BOSS</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 w-full">
              <button
                onClick={() => onNavigateSection('packages')}
                className="w-full sm:w-auto min-h-[48px] bg-[#FF1E1E] text-black px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(255,30,30,0.4)] rounded-xl flex items-center justify-center gap-2 group"
              >
                <span>Event Packages</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateSection('rentals')}
                className="w-full sm:w-auto min-h-[48px] bg-white/5 border border-white/10 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-xl flex items-center justify-center"
              >
                Rental Inventory
              </button>

              <button
                onClick={() => onNavigateSection('retail')}
                className="w-full sm:w-auto min-h-[48px] border border-white/20 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:border-[#FF1E1E] hover:text-[#FF1E1E] transition-all rounded-xl flex items-center justify-center"
              >
                Pro Music Shop
              </button>

              <button
                onClick={onOpenAiAdvisor}
                className="w-full sm:w-auto min-h-[48px] bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#FF1E1E] hover:text-black transition-all flex items-center justify-center gap-2 rounded-xl group"
              >
                <Sparkles className="w-4 h-4 text-[#FF1E1E] group-hover:text-black animate-pulse" />
                <span>AI Advisor</span>
              </button>
            </div>

          </div>

          {/* Right Column: Imageless Feature Console & Live System Specs */}
          <div className="lg:col-span-5 flex flex-col justify-center w-full max-w-[540px] lg:max-w-none mx-auto relative">
            
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 bg-[#FF1E1E]/15 blur-[100px] rounded-full pointer-events-none" />

            {/* Glassmorphism Feature Console */}
            <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden space-y-6">
              
              {/* Top Live System Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 flex items-center justify-center text-[#FF1E1E]">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-black uppercase tracking-wider">Techno Core Hub</span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Online
                      </span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-medium">Stage Production & Retail Dashboard</p>
                  </div>
                </div>

                {/* Animated Audio Equalizer Bars */}
                <div className="flex items-end gap-1 h-6 px-2 py-1 bg-black/60 border border-white/10 rounded-md shrink-0">
                  <div className="w-1 bg-[#FF1E1E] rounded-full animate-[bounce_1s_infinite_100ms] h-3" />
                  <div className="w-1 bg-[#FF1E1E] rounded-full animate-[bounce_1s_infinite_300ms] h-5" />
                  <div className="w-1 bg-[#FF1E1E] rounded-full animate-[bounce_1s_infinite_200ms] h-2" />
                  <div className="w-1 bg-[#FF1E1E] rounded-full animate-[bounce_1s_infinite_400ms] h-4" />
                </div>
              </div>

              {/* Feature Grid Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Feature 1 */}
                <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-3.5 transition-all group/item">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="p-2 rounded-lg bg-[#FF1E1E]/10 text-[#FF1E1E] border border-[#FF1E1E]/20 group-hover/item:border-[#FF1E1E]/50 transition-colors">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-black uppercase tracking-tight">Concert Sound</h4>
                      <p className="text-gray-400 text-[10px]">High-SPL Line Array</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-snug">
                    Active touring speakers, subwoofers & digital mixing consoles.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-3.5 transition-all group/item">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="p-2 rounded-lg bg-white/10 text-white border border-white/20 group-hover/item:border-white/40 transition-colors">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-black uppercase tracking-tight">LED & Lighting</h4>
                      <p className="text-gray-400 text-[10px]">P3.91 High Refresh</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-snug">
                    Modular indoor/outdoor video walls & DMX intelligent lights.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-3.5 transition-all group/item">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="p-2 rounded-lg bg-[#FF1E1E]/10 text-[#FF1E1E] border border-[#FF1E1E]/20 group-hover/item:border-[#FF1E1E]/50 transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-black uppercase tracking-tight">Authentic Gear</h4>
                      <p className="text-gray-400 text-[10px]">Authorized Dealer</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-snug">
                    Shure, QSC, Roland & Boss gear with official factory warranty.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-3.5 transition-all group/item">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="p-2 rounded-lg bg-white/10 text-white border border-white/20 group-hover/item:border-white/40 transition-colors">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-black uppercase tracking-tight">Pro On-Site Crew</h4>
                      <p className="text-gray-400 text-[10px]">Davao & Mindanao</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-snug">
                    Certified sound engineers & stage technicians for flawless setup.
                  </p>
                </div>

              </div>

              {/* Quick Action Footer inside Console */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-gray-300 text-[11px] font-bold">Instant Event Quotes & Custom Packages</span>
                </div>

                <button
                  onClick={onOpenQuoteModal}
                  className="w-full sm:w-auto bg-[#FF1E1E] text-black font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(255,30,30,0.4)] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Build Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

