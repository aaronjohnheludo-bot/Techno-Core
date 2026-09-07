import React, { useState } from 'react';
import { TechnoCoreIcon } from './TechnoCoreIcon';

interface TechnoCoreLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
  useSvgOnly?: boolean;
}

export const TechnoCoreLogo: React.FC<TechnoCoreLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
  useSvgOnly = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 group shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Logo Icon Container / Badge */}
      <div
        className={`${sizeClasses[size]} rounded-xl bg-[#030303] p-0.5 border border-[#FF1E1E]/60 flex items-center justify-center shadow-[0_0_20px_rgba(255,30,30,0.5)] group-hover:shadow-[0_0_30px_rgba(255,30,30,0.9)] group-hover:border-[#FF1E1E] transition-all shrink-0 overflow-hidden relative`}
      >
        {!useSvgOnly && !imgError ? (
          <img
            src="/techno_core_logo.png?v=3d"
            alt="Techno Core Logo Icon"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Precision SVG Icon Vector Component */
          <TechnoCoreIcon className="w-full h-full" />
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`${textClasses[size]} font-black tracking-tighter uppercase text-white leading-none`}>
              TECHNO <span className="text-[#FF1E1E] drop-shadow-[0_0_10px_rgba(255,30,30,0.6)]">CORE</span>
            </span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden xs:block mt-0.5">
            Pro Audio & Events
          </div>
        </div>
      )}
    </div>
  );
};

