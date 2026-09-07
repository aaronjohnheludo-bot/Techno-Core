import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      name: "Marco V.",
      role: "Festival Director, Davao City",
      text: "Techno Core provided the audio backbone for our outdoor music festival. The line arrays were pristine, and their technical team was flawless from setup to teardown.",
      rating: 5,
    },
    {
      name: "Sarah M.",
      role: "Corporate Events Planner",
      text: "We rented their P3.91 LED Wall and intelligent lighting for a major corporate gala. The visual clarity was stunning and the execution was highly professional.",
      rating: 5,
    },
    {
      name: "Jay R.",
      role: "Local Musician & Studio Owner",
      text: "My go-to shop in Mindanao for buying Shure microphones and QSC gear. They offer competitive prices and unmatched after-sales support.",
      rating: 5,
    }
  ];

  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-all group">
            <div>
              <Quote className="w-8 h-8 text-[#FF1E1E]/40 mb-5 group-hover:text-[#FF1E1E] transition-colors" />
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                "{review.text}"
              </p>
            </div>
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-1.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF1E1E] text-[#FF1E1E]" />
                ))}
              </div>
              <h4 className="text-white font-black tracking-widest uppercase text-xs sm:text-sm">{review.name}</h4>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{review.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
