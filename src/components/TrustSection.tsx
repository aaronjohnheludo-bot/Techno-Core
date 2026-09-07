import React from 'react';
import { Star, ShieldCheck, ThumbsUp, Heart, CheckCircle2, MessageCircle } from 'lucide-react';
import { CMSData } from '../types';

interface TrustSectionProps {
  cms: CMSData;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ cms }) => {
  const testimonials = [
    {
      name: 'Engr. Rafael Tan',
      role: 'Head Coordinator, Mindanao Tech Summit 2025',
      content: 'Techno Core provided dual P3.91 LED video walls, sound, and a 100 kVA quiet generator for our summit at SMX Davao. Zero dropouts, crisp audio, and very professional crew!',
      rating: 5
    },
    {
      name: 'Samantha & Paolo Alcantara',
      role: 'Bride & Groom, Samal Beach Wedding',
      content: 'Their Aircon Mega Tent saved our reception from unexpected coastal rain! The fairy lights and QSC sound system made our first dance unforgettable. Best decision in Davao!',
      rating: 5
    },
    {
      name: 'Mark Lester Villa',
      role: 'Event Director, Kadayawan Live Concert',
      content: 'We rented full line array towers, beam light show, and backline instruments for a 3,000-person outdoor concert. Techno Core is the undisputed #1 production house in Davao del Sur.',
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Social Proof Header Banner */}
        <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#FF1E1E]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF1E1E] blur-[100px] opacity-10 pointer-events-none" />
          <div className="flex items-center gap-4 text-center md:text-left relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#FF1E1E]/10 border border-[#FF1E1E]/40 flex items-center justify-center text-[#FF1E1E] shrink-0">
              <ThumbsUp className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                <span>{cms.facebookFollowers} Facebook Community</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FF1E1E] text-black uppercase tracking-widest">Verified</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Join thousands of Davao event planners, church ministries, musicians, and clients who rely on Techno Core.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#050505]/90 px-5 py-3 rounded-2xl border border-white/10 shrink-0 relative z-10">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <div className="text-xs font-black text-white uppercase tracking-widest">
              4.9 / 5.0 Google Reviews
            </div>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#FF1E1E]/40 transition-all">
              <div className="space-y-3">
                <div className="flex items-center text-amber-400 gap-1">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="font-black text-sm text-white uppercase tracking-tight">{t.name}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
