import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CreditCard, ShieldCheck, Wallet, Banknote } from 'lucide-react';

export const PaymentAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What are the rental terms and deposit requirements for event bookings?',
      a: 'We require a 30% reservation deposit upon booking confirmation to secure your equipment and technical team date. The remaining 70% balance is settled on the event day prior to soundcheck. Official receipts and legal contracts are provided.'
    },
    {
      q: 'Do you cover events outside Davao City (e.g., Samal, Bukidnon, GenSan, Cotabato)?',
      a: 'Yes! Techno Core serves the entire Davao Region (Davao del Sur, Davao del Norte, Davao de Oro, Davao Oriental) as well as South Cotabato, General Santos City, and Bukidnon. Out-of-town logistics fees apply based on distance and vehicle requirements.'
    },
    {
      q: 'What is included in the delivery, setup, and teardown services?',
      a: 'All event rental packages include full transportation logistics, structural setup, wiring, sound engineering, LED wall video processing, lighting design, and post-event teardown. Our crew handles everything from start to finish.'
    },
    {
      q: 'What warranty and after-sales support do you offer for retail gear purchases?',
      a: 'All retail musical instruments and pro sound equipment purchased at our J. Marketing Building showroom carry standard manufacturer warranties (up to 1-2 years on brands like QSC, Shure, Roland, Boss, and Laney) plus Techno Core local technician support.'
    },
    {
      q: 'Do you offer layaway or installment options for walk-in retail store buyers?',
      a: 'Yes! We support 0% interest credit card installment plans for up to 12 months in-store, as well as customized layaway plans for church ministries, school bands, and local musicians.'
    },
    {
      q: 'What happens if rain occurs during an outdoor event?',
      a: 'Our outdoor P3.91 LED video walls feature IP65 waterproof rating, and our clear-span mega tents are 100% heavy-duty rainproof. We also provide weatherproof power distribution boxes for generator systems.'
    }
  ];

  return (
    <section id="faq" className="py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Accepted Payments Strip */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF1E1E] tracking-widest">
            <CreditCard className="w-4 h-4" />
            <span>Accepted Payment Methods & Purchase Options:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
            <div className="p-3 bg-[#050505] rounded-xl border border-white/10 text-center">
              <div className="text-xs font-black text-blue-400 uppercase tracking-wider">GCash</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Instant QR / Mobile</div>
            </div>

            <div className="p-3 bg-[#050505] rounded-xl border border-white/10 text-center">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Maya</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Wallet / QR Ph</div>
            </div>

            <div className="p-3 bg-[#050505] rounded-xl border border-white/10 text-center">
              <div className="text-xs font-black text-amber-400 uppercase tracking-wider">Bank Transfer</div>
              <div className="text-[10px] text-gray-400 mt-0.5">BDO / BPI / Landbank</div>
            </div>

            <div className="p-3 bg-[#050505] rounded-xl border border-white/10 text-center">
              <div className="text-xs font-black text-white uppercase tracking-wider">Cash Deposit</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Walk-in / On-Delivery</div>
            </div>

            <div className="p-3 bg-[#050505] rounded-xl border border-white/10 text-center">
              <div className="text-xs font-black text-[#FF1E1E] uppercase tracking-wider">Store Layaway</div>
              <div className="text-[10px] text-gray-400 mt-0.5">0% Card Installments</div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#FF1E1E]">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">FREQUENTLY ASKED QUESTIONS</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-lg">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-black uppercase text-white hover:text-[#FF1E1E] transition-colors tracking-tight"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#FF1E1E] shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3 bg-[#050505]/60 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
