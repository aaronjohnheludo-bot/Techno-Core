import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Menu, X, PhoneCall, ShieldCheck, Zap, Layers, FileText, Sun, Moon, Search, Package } from 'lucide-react';
import { CMSData } from '../types';
import { TechnoCoreLogo } from './TechnoCoreLogo';

interface NavbarProps {
  cms: CMSData;
  activeSection: string;
  setActiveSection: (section: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiAdvisor: () => void;
  onOpenSearch: () => void;
  onOpenOrderTracking: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cms,
  activeSection,
  setActiveSection,
  cartCount,
  onOpenCart,
  onOpenAiAdvisor,
  onOpenSearch,
  onOpenOrderTracking,
  isAdmin,
  setIsAdmin,
  theme,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'retail', label: 'Shop' },
    { id: 'rentals', label: 'Rentals' },
    { id: 'packages', label: 'Packages' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'gallery', label: 'Portfolio' },
    { id: 'faq', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 text-white shadow-2xl">
      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 gap-2">
          
          {/* Logo & Brand */}
          <TechnoCoreLogo onClick={() => handleNavClick('hero')} />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-6 text-[11px] font-bold uppercase tracking-[0.18em] bg-white/[0.03] px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors relative py-0.5 ${
                    isActive
                      ? 'text-[#FF1E1E] font-black'
                      : 'text-gray-300 hover:text-[#FF1E1E]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF1E1E] shadow-[0_0_8px_#FF1E1E]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">
            
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-full text-gray-300 hover:text-white"
              title="Search inventory"
              aria-label="Search"
            >
              <Search className="w-4 h-4 shrink-0" />
            </button>

            {/* Track Order Button */}
            <button
              onClick={onOpenOrderTracking}
              className="hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-full text-gray-300 hover:text-white"
              title="Track Order"
              aria-label="Track order"
            >
              <Package className="w-4 h-4 shrink-0" />
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAiAdvisor}
              className="hidden md:inline-flex items-center justify-center h-9 sm:h-10 px-3 sm:px-4 gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF1E1E]/40 transition-all rounded-full text-white"
              title="AI Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF1E1E]" />
              <span>Advisor</span>
            </button>

            {/* Quote Cart / Selection List */}
            <button
              onClick={onOpenCart}
              className="bg-[#FF1E1E] text-black px-3 sm:px-4 h-9 sm:h-10 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,30,30,0.3)] hover:shadow-[0_0_25px_rgba(255,30,30,0.5)] transition-all flex items-center justify-center gap-1.5 rounded-full"
              aria-label="Quote cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="hidden sm:inline">Quote</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-black text-[#FF1E1E] text-[10px] font-black flex items-center justify-center shrink-0">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={onToggleTheme}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all border flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-amber-400 text-black border-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:border-white/20'
              }`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-black shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300 shrink-0" />
              )}
            </button>

            {/* Admin Toggle */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all border flex items-center justify-center ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
              title={isAdmin ? 'Exit Admin Mode' : 'Admin Portal'}
              aria-label="Admin mode"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:border-[#FF1E1E] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF1E1E]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-4 py-6 space-y-6 animate-fadeIn shadow-2xl absolute w-full">
          
          {/* Mobile Search */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-left hover:bg-white/10 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Search inventory...</span>
          </button>

          <div className="grid grid-cols-2 gap-3 pb-6 border-b border-white/5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-center px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeSection === link.id
                    ? 'bg-[#FF1E1E] text-black shadow-[0_0_15px_rgba(255,30,30,0.3)]'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onToggleTheme}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest border rounded-xl transition-all ${
                theme === 'light'
                  ? 'bg-amber-400 text-black border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
              }`}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-black" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-300" />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderTracking();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all rounded-xl border border-white/10 text-white"
            >
              <Package className="w-4 h-4" />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiAdvisor();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest bg-[#FF1E1E]/10 border border-[#FF1E1E]/40 text-[#FF1E1E] rounded-xl hover:bg-[#FF1E1E]/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#FF1E1E] animate-pulse" />
              <span>AI Advisor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
