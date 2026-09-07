import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, Volume2, VolumeX, Sparkles, Sliders, 
  Layers, ShoppingBag, Calendar, Camera, MessageSquare, Compass
} from 'lucide-react';
import { getAudioMuted, setAudioMuted, playLaserClick } from '../utils/audioSynth';
import { useToast } from './ToastProvider';

interface ScrollHUDProps {
  onOpenAiAdvisor?: () => void;
  onOpenQuoteModal?: () => void;
}

const SECTIONS = [
  { id: 'hero', name: 'Hero', icon: Compass },
  { id: 'stage-studio', name: 'Live Studio', icon: Sliders },
  { id: 'packages', name: 'Packages', icon: Sparkles },
  { id: 'rentals', name: 'Rentals', icon: Layers },
  { id: 'retail', name: 'Shop', icon: ShoppingBag },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'portfolio', name: 'Portfolio', icon: Camera },
  { id: 'reviews', name: 'Reviews', icon: MessageSquare }
];

export const ScrollHUD: React.FC<ScrollHUDProps> = ({
  onOpenAiAdvisor,
  onOpenQuoteModal
}) => {
  const { addToast } = useToast();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMutedState] = useState(getAudioMuted());

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      
      const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      setScrollProgress(Math.round(currentProgress));
      setIsVisible(window.scrollY > 280);

      // Detect active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSectionId(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    playLaserClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    playLaserClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMutedState(next);
    setAudioMuted(next);
    addToast(next ? 'Audio Synthesizer Muted' : 'Stage Audio FX Enabled', 'info');
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Stage Navigation HUD"
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2"
    >
      
      {/* Expanded Quick Navigation Drawer */}
      {isExpanded && (
        <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/15 p-3 rounded-2xl shadow-2xl space-y-1.5 min-w-[170px] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#FF1E1E] px-2 pb-1 border-b border-white/10 flex items-center justify-between">
            <span>Stage Navigator</span>
            <span>{scrollProgress}%</span>
          </div>

          <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    scrollToSection(sec.id);
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_10px_rgba(255,30,30,0.5)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{sec.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Control HUD Dock */}
      <div className="flex items-center gap-2 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/15 p-1.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        
        {/* Toggle Sound FX Button */}
        <button
          onClick={toggleSound}
          className={`p-2.5 rounded-xl border transition-all ${
            isMuted
              ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}
          title={isMuted ? 'Unmute live audio' : 'Mute live audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Section Pill / Drawer Trigger */}
        <button
          onClick={() => {
            playLaserClick();
            setIsExpanded(!isExpanded);
          }}
          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 transition-all group"
          title="Toggle Quick Navigation HUD"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            {/* Circular Progress Ring */}
            <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#FF1E1E]"
                strokeDasharray={`${scrollProgress}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <span className="hidden sm:inline text-[#FF1E1E]">
            {SECTIONS.find(s => s.id === activeSectionId)?.name || 'Stage'}
          </span>
          <span className="font-mono text-[10px] text-gray-400">{scrollProgress}%</span>
        </button>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className="p-2.5 rounded-xl bg-[#FF1E1E] text-black hover:bg-white transition-all shadow-[0_0_15px_rgba(255,30,30,0.4)] group"
          title="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>

      </div>

    </aside>
  );
};
