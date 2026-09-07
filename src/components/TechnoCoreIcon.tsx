import React from 'react';

interface TechnoCoreIconProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const TechnoCoreIcon: React.FC<TechnoCoreIconProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      style={style}
    >
      <defs>
        {/* Gradients for the 4 colorful orbital swooshes */}
        <linearGradient id="greenYellowSwoosh" x1="20" y1="20" x2="60" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E600" />
          <stop offset="60%" stopColor="#76E600" />
          <stop offset="100%" stopColor="#FFE600" />
        </linearGradient>

        <linearGradient id="redBlueSwoosh" x1="180" y1="20" x2="140" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF1E1E" />
          <stop offset="50%" stopColor="#D00000" />
          <stop offset="100%" stopColor="#1E50FF" />
        </linearGradient>

        {/* Central Atomic Sphere Glow */}
        <radialGradient id="atomicSphereGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#E0FFFF" />
          <stop offset="70%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </radialGradient>

        {/* Sphere Outer Flare */}
        <radialGradient id="sphereOuterFlare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
        </radialGradient>

        {/* Filters for glow */}
        <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dark background container */}
      <rect width="200" height="200" rx="24" fill="#030303" />

      {/* Outer subtle glow */}
      <circle cx="100" cy="100" r="75" fill="#FF1E1E" opacity="0.08" filter="url(#coreGlow)" />

      {/* --- SWOOSH 1: Green -> Yellow (Left Loop) --- */}
      <path
        d="M 45,35 C 15,65 15,125 75,165 C 105,185 100,165 80,140 C 50,105 40,75 70,45 C 80,35 60,20 45,35 Z"
        fill="url(#greenYellowSwoosh)"
      />

      {/* --- SWOOSH 2: Red -> Blue (Right Loop) --- */}
      <path
        d="M 155,35 C 185,65 185,125 125,165 C 95,185 100,165 120,140 C 150,105 160,75 130,45 C 120,35 140,20 155,35 Z"
        fill="url(#redBlueSwoosh)"
      />

      {/* Dynamic Crossing Swoosh Lines (Precision swooshes matching the official logo) */}
      <path
        d="M 50,38 Q 20,85 70,158 Q 30,120 50,38 Z"
        fill="#00FF2A"
        opacity="0.9"
      />
      <path
        d="M 150,38 Q 180,85 130,158 Q 170,120 150,38 Z"
        fill="#FF0000"
        opacity="0.9"
      />
      <path
        d="M 70,158 Q 100,182 110,162 Q 80,172 70,158 Z"
        fill="#FFE600"
      />
      <path
        d="M 130,158 Q 100,182 90,162 Q 120,172 130,158 Z"
        fill="#0055FF"
      />

      {/* --- ATOMIC ORBIT RINGS (3 intersecting thin white/cyan ellipses) --- */}
      {/* Horizontal Orbit Ellipse */}
      <ellipse
        cx="100"
        cy="100"
        rx="42"
        ry="13"
        fill="none"
        stroke="#E0FFFF"
        strokeWidth="2.5"
        opacity="0.95"
      />

      {/* Angled Orbit 1 (-30 deg) */}
      <g transform="rotate(-30 100 100)">
        <ellipse
          cx="100"
          cy="100"
          rx="42"
          ry="13"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          opacity="0.95"
        />
      </g>

      {/* Angled Orbit 2 (+30 deg) */}
      <g transform="rotate(30 100 100)">
        <ellipse
          cx="100"
          cy="100"
          rx="42"
          ry="13"
          fill="none"
          stroke="#E0FFFF"
          strokeWidth="2.5"
          opacity="0.95"
        />
      </g>

      {/* --- CENTRAL GLOWING ATOMIC SPHERE --- */}
      {/* Outer Flare */}
      <circle cx="100" cy="100" r="22" fill="url(#sphereOuterFlare)" />

      {/* Solid Glowing Orb */}
      <circle cx="100" cy="100" r="14" fill="url(#atomicSphereGlow)" />

      {/* Bright Core Highlight */}
      <circle cx="96" cy="96" r="4" fill="#FFFFFF" opacity="0.9" />

      {/* Optional Top & Bottom Text if showText is true */}
      {showText && (
        <>
          {/* Top text: TECHNO */}
          <text
            x="100"
            y="24"
            textAnchor="middle"
            fill="#FFFFFF"
            stroke="#FF1E1E"
            strokeWidth="1.5"
            fontSize="20"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="2"
          >
            TECHNO
          </text>
          {/* Bottom text: CORE */}
          <text
            x="100"
            y="190"
            textAnchor="middle"
            fill="#FFFFFF"
            stroke="#FF1E1E"
            strokeWidth="1.5"
            fontSize="22"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="3"
          >
            CORE
          </text>
        </>
      )}
    </svg>
  );
};
