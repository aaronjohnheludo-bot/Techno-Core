import React, { useEffect, useRef } from 'react';
import { Search, X, Package, Radio, Sparkles, ArrowRight } from 'lucide-react';
import { RetailProduct, RentalService, EventPackage } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  retailProducts: RetailProduct[];
  rentalServices: RentalService[];
  eventPackages: EventPackage[];
  onNavigateSection: (sectionId: string) => void;
  onAddToCart: (item: { id: string; name: string; type: 'retail' | 'rental' | 'package'; price: number; quantity: number }) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  retailProducts,
  rentalServices,
  eventPackages,
  onNavigateSection,
  onAddToCart
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, setSearchQuery]);

  if (!isOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  const filteredRetail = q ? retailProducts.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.brand.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q)
  ) : [];

  const filteredRentals = q ? rentalServices.filter(r => 
    r.name.toLowerCase().includes(q) || 
    r.category.toLowerCase().includes(q)
  ) : [];

  const filteredPackages = q ? eventPackages.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.tag.toLowerCase().includes(q)
  ) : [];

  const hasResults = filteredRetail.length > 0 || filteredRentals.length > 0 || filteredPackages.length > 0;
  const isTyping = q.length > 0;

  const handleResultClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col pt-16 sm:pt-24 items-center bg-black/80 backdrop-blur-sm animate-fadeIn px-4">
      <div 
        className="absolute inset-0 z-0"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-3xl bg-[#080808] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="flex items-center p-4 sm:p-6 border-b border-white/10 bg-white/5 relative">
          <Search className="w-6 h-6 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for gear, services, or packages..."
            className="flex-1 bg-transparent border-none outline-none text-white text-lg sm:text-xl font-bold ml-4 placeholder-gray-500 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 custom-scrollbar">
          {!isTyping ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Start typing to search our inventory...</p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-8 pb-8">
              {/* Retail Results */}
              {filteredRetail.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[#FF1E1E] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Package className="w-3.5 h-3.5" />
                    Retail Shop ({filteredRetail.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredRetail.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group" onClick={() => handleResultClick('retail')}>
                        <div className="w-12 h-12 bg-black rounded-md overflow-hidden shrink-0 border border-white/5">
                          <img
                            loading="lazy"
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/techno_core_3d_logo.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-bold truncate">{item.name}</h4>
                          <p className="text-gray-400 text-xs truncate">{item.brand} • {item.category}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#FF1E1E] transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rental Results */}
              {filteredRentals.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5" />
                    Rental Inventory ({filteredRentals.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredRentals.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group" onClick={() => handleResultClick('rentals')}>
                        <div className="w-12 h-12 bg-black rounded-md overflow-hidden shrink-0 border border-white/5">
                          <img
                            loading="lazy"
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/techno_core_3d_logo.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-bold truncate">{item.name}</h4>
                          <p className="text-gray-400 text-xs truncate">{item.category}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-500 transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages Results */}
              {filteredPackages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Event Packages ({filteredPackages.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredPackages.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group" onClick={() => handleResultClick('packages')}>
                        <div className="w-16 h-12 bg-black rounded-md overflow-hidden shrink-0 border border-white/5">
                          <img
                            loading="lazy"
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/techno_core_3d_logo.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-bold truncate">{item.title}</h4>
                          <p className="text-gray-400 text-xs truncate">{item.idealFor}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-500 font-bold text-sm hidden sm:block">₱{item.price.toLocaleString()}</span>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
