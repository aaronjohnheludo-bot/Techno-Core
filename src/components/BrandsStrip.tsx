import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const BrandsStrip: React.FC = () => {
  const brands = [
    { name: 'QSC', category: 'Pro Sound' },
    { name: 'SHURE', category: 'Microphones' },
    { name: 'ROLAND', category: 'Keyboards & Synths' },
    { name: 'SAMSON', category: 'Mixers & Wireless' },
    { name: 'BOSS', category: 'Guitar Amplifiers' },
    { name: 'DBX', category: 'Loudspeaker Management' },
    { name: 'LANEY', category: 'Tube Amps' },
    { name: 'SONOR', category: 'Acoustic Drums' },
    { name: 'DIGITECH', category: 'Guitar Processors' },
    { name: 'PREMIER', category: 'Percussion' },
    { name: 'NEC', category: 'Displays & Video' }
  ];

  return (
    <section className="py-8 bg-zinc-950 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#FF1E1E]" />
            <span>Authorized Mindanao Brands We Carry & Deploy:</span>
          </div>

          <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3">
            {brands.map((b, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 hover:text-white hover:border-[#FF1E1E]/60 transition-colors text-xs font-bold tracking-wider text-center"
              >
                <span>{b.name}</span>
                <span className="block text-[9px] font-normal text-zinc-500 uppercase tracking-tight">{b.category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
