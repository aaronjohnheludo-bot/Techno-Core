import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionDividerProps {
  icon?: LucideIcon;
  label?: string;
  sublabel?: string;
}

export function SectionDivider({ icon: Icon, label, sublabel }: SectionDividerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative flex items-center justify-center select-none pointer-events-none">
      {/* Subtle Horizontal Gradient Line */}
      <div className="absolute inset-x-4 sm:inset-x-8 flex items-center" aria-hidden="true">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Center-aligned Modular Badge with Glow */}
      <div className="relative pointer-events-auto flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#080808] border border-white/15 text-gray-400 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md hover:border-[#FF1E1E]/50 hover:text-white transition-all group cursor-default">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF1E1E] animate-pulse shrink-0" />
        {Icon && (
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF1E1E] group-hover:scale-110 transition-transform shrink-0" />
        )}
        {label && (
          <span className="text-gray-300 group-hover:text-white transition-colors tracking-widest">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[9px] font-bold text-gray-500 hidden sm:inline-block border-l border-white/10 pl-2 ml-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
