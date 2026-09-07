import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Shield, CheckCircle2, Share2, ExternalLink } from 'lucide-react';
import { CMSData } from '../types';
import { TechnoCoreLogo } from './TechnoCoreLogo';

interface LocationFooterProps {
  cms: CMSData;
}

export const LocationFooter: React.FC<LocationFooterProps> = ({ cms }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#050505] text-gray-300 border-t border-white/5 pt-8 pb-8 sm:pt-16 sm:pb-12 relative">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Top Grid: Contact Info & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Company & Contact Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <TechnoCoreLogo size="md" />
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Davao City’s leading two-in-one music store and full event production house. Specializing in pro audio, stage lighting, LED video walls, aircon mega tents, and generator power rentals.
              </p>
            </div>

            {/* Store Location */}
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF1E1E] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-black text-white uppercase tracking-tight">{cms.address.building}</div>
                  <div className="text-gray-400">{cms.address.street}</div>
                  <div className="text-gray-400">{cms.address.city}, {cms.address.province}</div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-black text-white uppercase tracking-widest text-[10px]">Store Operating Hours:</div>
                  <div className="text-gray-400">Mon - Fri: {cms.operatingHours.weekdays}</div>
                  <div className="text-gray-400">Saturday: {cms.operatingHours.saturday}</div>
                  <div className="text-[#FF1E1E] font-bold">{cms.operatingHours.sunday}</div>
                </div>
              </div>

              {/* Hotlines */}
              <div className="flex flex-col gap-1.5 pt-3 border-t border-white/10 text-xs">
                <div className="font-black text-white uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Davao Hotline & Event Reservations:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] text-gray-300 font-mono">
                  <div>Globe: <a href={`tel:${cms.phoneNumbers.globe}`} className="hover:text-[#FF1E1E] transition-colors">{cms.phoneNumbers.globe}</a></div>
                  <div>Smart: <a href={`tel:${cms.phoneNumbers.smart}`} className="hover:text-[#FF1E1E] transition-colors">{cms.phoneNumbers.smart}</a></div>
                  <div>Landline: <a href={`tel:${cms.phoneNumbers.landline}`} className="hover:text-[#FF1E1E] transition-colors">{cms.phoneNumbers.landline}</a></div>
                </div>
              </div>
            </div>

          </div>

          {/* Embedded Map Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>Showroom & Warehouse Map — Davao City</span>
              <span className="text-[#FF1E1E] font-mono">Corner Ilustre & Gen. Luna St.</span>
            </div>

            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#050505] relative">
              <iframe
                title="Techno Core Davao Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.508544838668!2d125.60638!3d7.06694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96d744b611111%3A0x123456789abcdef!2sIlustre%20St%2C%20Poblacion%20District%2C%20Davao%20City!5e0!3m2!1sen!2sph!4v1680000000000!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

        {/* Official Social Media Section */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#FF1E1E]" />
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Connect With Techno Core</h4>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Follow our official Facebook pages for real-time stage setup reels, new equipment arrivals, and event production coverage.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#FF1E1E] bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
              Official Facebook Pages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook 1 */}
            <a
              href="https://www.facebook.com/profile.php?id=100063789922270"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-white/5 hover:bg-[#1877F2]/15 border border-white/10 hover:border-[#1877F2]/50 rounded-xl transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-[#1877F2] transition-colors">Techno Core Official</div>
                  <div className="text-[11px] text-gray-400">Pro Audio & Musical Instrument Store</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </a>

            {/* Facebook 2 */}
            <a
              href="https://www.facebook.com/profile.php?id=100094119968364"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-white/5 hover:bg-[#1877F2]/15 border border-white/10 hover:border-[#1877F2]/50 rounded-xl transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-[#1877F2] transition-colors">Techno Core Events & Production</div>
                  <div className="text-[11px] text-gray-400">Sound, Lights, LED Wall & Event Rentals</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        {/* Newsletter & Promo Signup */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-tight">Subscribe to Techno Core Davao Promos & Event Gear Drops</h4>
            <p className="text-xs text-gray-400">Get early notifications on rental discounts, new QSC/Shure shipments, and Kadayawan specials.</p>
          </div>

          {newsletterSuccess ? (
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-4 py-2 rounded-sm border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Subscribed! Check your inbox for updates.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email address..."
                className="bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E] w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shrink-0 flex items-center gap-1 shadow-[0_0_15px_rgba(255,30,30,0.3)]"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Techno Core Davao. All rights reserved. J. Marketing Bldg, Ilustre St, Davao City.
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=100063789922270" target="_blank" rel="noreferrer" title="Techno Core Official Store Facebook" className="hover:text-[#1877F2] transition-colors p-1 flex items-center gap-1.5">
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span className="text-[11px] font-bold">Techno Core Main</span>
            </a>
            <span className="text-gray-700">|</span>
            <a href="https://www.facebook.com/profile.php?id=100094119968364" target="_blank" rel="noreferrer" title="Techno Core Events & Production Facebook" className="hover:text-[#1877F2] transition-colors p-1 flex items-center gap-1.5">
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span className="text-[11px] font-bold">Techno Core Events</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
