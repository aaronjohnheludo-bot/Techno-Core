import React, { useState, useEffect } from 'react';
import { MessageSquare, PhoneCall, ShoppingBag, ArrowUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CMSData } from '../types';

interface StickyQuickContactProps {
  cms: CMSData;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiAdvisor: () => void;
}

export const StickyQuickContact: React.FC<StickyQuickContactProps> = ({
  cms,
  cartCount,
  onOpenCart,
  onOpenAiAdvisor
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 pointer-events-none max-w-[calc(100vw-2rem)]">
      
      {/* Back to Top Floating Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-[#050505]/95 border border-[#FF1E1E]/50 text-white hover:text-[#FF1E1E] hover:border-[#FF1E1E] hover:bg-black transition-all shadow-[0_0_20px_rgba(255,30,30,0.3)] hover:shadow-[0_0_25px_rgba(255,30,30,0.7)] backdrop-blur-xl flex items-center justify-center shrink-0 group"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Floating Quick Bar */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-[#050505]/95 border border-white/10 p-1.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        
        {/* Direct Call Button */}
        <a
          href={`tel:${cms.phoneNumbers.globe.replace(/\s+/g, '')}`}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors shadow-md shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Call Hotline</span>
          <span className="sm:hidden">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${cms.phoneNumbers.globe.replace(/[^0-9+]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#128C7E]/20 border border-[#25D366]/40 text-[#25D366] font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:bg-[#128C7E]/40 transition-colors shadow-md shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="sm:hidden">WA</span>
        </a>

        {/* Messenger / Facebook Button */}
        <a
          href="https://www.facebook.com/profile.php?id=100063789922270"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:bg-blue-900 transition-colors shadow-md shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Facebook</span>
          <span className="sm:hidden">FB</span>
        </a>

        {/* Quote Cart Toggle */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,30,30,0.4)] shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Quote List</span>
          {cartCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-black text-[#FF1E1E] font-black text-[10px] flex items-center justify-center border border-[#FF1E1E]">
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};

