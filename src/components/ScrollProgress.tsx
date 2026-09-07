import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Background Track */}
      <div className="w-full h-1 bg-white/5" />
      
      {/* Animated Laser Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF1E1E] via-[#FF4D4D] to-[#FFAA00] origin-left shadow-[0_0_12px_rgba(255,30,30,0.8)]"
        style={{ scaleX }}
      />

      {/* Floating Laser Tip Glow */}
      <motion.div
        className="absolute top-0 h-1.5 w-6 bg-white blur-[2px] -translate-y-[1px] pointer-events-none opacity-80"
        style={{
          left: `${percentage}%`,
          transform: 'translateX(-50%)'
        }}
      />
    </div>
  );
};

