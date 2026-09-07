import React, { useState, useEffect, useRef } from 'react';
import { Layers, CheckCircle, Zap, Shield, Sparkles, Plus, Info, Calendar, ChevronLeft, ChevronRight, X, LayoutGrid, SlidersHorizontal, ChevronDown, ChevronUp, Radio, Warehouse, Activity, Calculator, Trash2, Eye, Volume2, Play } from 'lucide-react';
import { RentalService, RentalAvailabilityItem } from '../types';
import { playKickBass, playAcousticSweep, playLaserClick } from '../utils/audioSynth';


interface RentalServicesProps {
  services: RentalService[];
  onAddToCart: (service: RentalService, type: 'rental') => void;
  onOpenQuoteModal: () => void;
  onOpenAiAdvisor: () => void;
}

export const RentalServices: React.FC<RentalServicesProps> = ({
  services,
  onAddToCart,
  onOpenQuoteModal,
  onOpenAiAdvisor
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rateMode, setRateMode] = useState<'dayRate' | 'eventRate'>('dayRate');
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6); // Load More state
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'swipe' | 'grid'>('swipe');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  // Price Estimator State
  const [showEstimator, setShowEstimator] = useState<boolean>(false);
  const [estimatorSelections, setEstimatorSelections] = useState<Array<{ id: string; quantity: number }>>([]);

  const handleToggleEstimator = () => setShowEstimator(!showEstimator);

  const handleAddEstimatorItem = (serviceId: string) => {
    if (!serviceId) return;
    if (!showEstimator) setShowEstimator(true);
    setEstimatorSelections(prev => {
      const exists = prev.find(p => p.id === serviceId);
      if (exists) {
        return prev.map(p => p.id === serviceId ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { id: serviceId, quantity: 1 }];
    });
  };

  const handleUpdateEstimatorQuantity = (serviceId: string, quantity: number) => {
    if (quantity < 1) {
      setEstimatorSelections(prev => prev.filter(p => p.id !== serviceId));
      return;
    }
    setEstimatorSelections(prev => prev.map(p => p.id === serviceId ? { ...p, quantity } : p));
  };

  const handleRemoveEstimatorItem = (serviceId: string) => {
    setEstimatorSelections(prev => prev.filter(p => p.id !== serviceId));
  };

  const estimatorTotal = estimatorSelections.reduce((total, item) => {
    const service = services.find(s => s.id === item.id);
    if (!service) return total;
    const rate = rateMode === 'dayRate' ? service.dayRate : service.eventRate;
    return total + (rate * item.quantity);
  }, 0);

  // Live Warehouse & Booking Availability State
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, RentalAvailabilityItem>>({});
  const [isFetchingAvailability, setIsFetchingAvailability] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAvailability = async () => {
      try {
        const res = await fetch('/api/rental-availability');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAvailabilityMap(data);
            setIsFetchingAvailability(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setIsFetchingAvailability(false);
        }
      }
    };

    fetchAvailability();
    const interval = setInterval(fetchAvailability, 20000); // Polling every 20s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const toggleCardExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);

  // Touch Swipe State for Modal
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const renderLiveStatusBadge = (service: RentalService, compact: boolean = false) => {
    const avail = availabilityMap[service.id];
    const status = avail?.status || service.availabilityStatus || 'Available';
    const availableUnits = avail?.availableUnits ?? service.availableUnits ?? 6;
    const totalStock = avail?.totalStock ?? service.warehouseStock ?? 8;

    if (status === 'Reserved Today' || availableUnits === 0) {
      return (
        <span
          title={`Live API: 0 of ${totalStock} units available in Davao Depot`}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/50 text-rose-300 font-extrabold uppercase tracking-wider backdrop-blur-md shadow-[0_0_10px_rgba(244,63,94,0.3)] ${
            compact ? 'text-[8px]' : 'text-[9px]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
          <span>Booked Today (0/{totalStock})</span>
        </span>
      );
    }

    if (status === 'Low Stock' || availableUnits <= 2) {
      return (
        <span
          title={`Live API: Only ${availableUnits} of ${totalStock} units available in warehouse`}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-300 font-extrabold uppercase tracking-wider backdrop-blur-md shadow-[0_0_10px_rgba(245,158,11,0.3)] ${
            compact ? 'text-[8px]' : 'text-[9px]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span>Low Stock ({availableUnits} left)</span>
        </span>
      );
    }

    if (status === 'High Demand') {
      return (
        <span
          title={`Live API: High active booking requests (${availableUnits}/${totalStock} units available)`}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-950/90 border border-purple-500/50 text-purple-300 font-extrabold uppercase tracking-wider backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.3)] ${
            compact ? 'text-[8px]' : 'text-[9px]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
          <span>High Demand ({availableUnits}/{totalStock})</span>
        </span>
      );
    }

    return (
      <span
        title={`Live API Status: ${availableUnits} of ${totalStock} units ready in Davao warehouse`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-extrabold uppercase tracking-wider backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.3)] ${
          compact ? 'text-[8px]' : 'text-[9px]'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>Live: In Depot ({availableUnits}/{totalStock})</span>
      </span>
    );
  };

  const categories = [
    'All',
    'LED Video Walls',
    'Pro Audio & Speakers',
    'Stage Lighting',
    'Tents & Canopies',
    'Generators & Power',
    'Stage & Trussing',
    'Portalets & Railings',
    'Video & Live Stream'
  ];

  const filteredServices = services.filter(
    (s) => selectedCategory === 'All' || s.category === selectedCategory
  );

  const displayedServices = filteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < filteredServices.length;

  const activeServiceModal = activeServiceIndex !== null ? filteredServices[activeServiceIndex] : null;

  const handleNextService = () => {
    if (activeServiceIndex === null) return;
    setActiveServiceIndex((prev) => (prev !== null && prev < filteredServices.length - 1 ? prev + 1 : 0));
  };

  const handlePrevService = () => {
    if (activeServiceIndex === null) return;
    setActiveServiceIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredServices.length - 1));
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -290, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 290, behavior: 'smooth' });
    }
  };

  const handleContainerScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length > 0) {
        let closestIdx = 0;
        let minDiff = Infinity;
        children.forEach((child, idx) => {
          const childOffset = child.offsetLeft - container.offsetLeft - 16;
          const diff = Math.abs(scrollLeft - childOffset);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        setCurrentSwipeIndex(closestIdx);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeServiceIndex === null) return;
      if (e.key === 'ArrowRight') handleNextService();
      if (e.key === 'ArrowLeft') handlePrevService();
      if (e.key === 'Escape') setActiveServiceIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeServiceIndex, filteredServices.length]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) handleNextService(); // Swiped left
    if (distance < -40) handlePrevService(); // Swiped right
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <section id="rentals" className="py-8 sm:py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] text-[10px] font-bold uppercase tracking-widest mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Event Production & Gear Rental</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase">
              EVENT EQUIPMENT RENTALS
            </h2>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              LED Video Walls, Line Array Systems, Stage Lights, Aircon Tents, Silent Generators & VIP Portalets in Davao.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            {/* Row 1 on Mobile: View Switcher & Rate Switcher */}
            <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
              {/* Mobile Display View Switcher */}
              <div className="flex sm:hidden items-center gap-1 bg-[#050505] p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  onClick={() => setMobileLayoutMode('swipe')}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                    mobileLayoutMode === 'swipe'
                      ? 'bg-[#FF1E1E] text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Swipe</span>
                </button>
                <button
                  onClick={() => setMobileLayoutMode('grid')}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                    mobileLayoutMode === 'grid'
                      ? 'bg-[#FF1E1E] text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Grid</span>
                </button>
              </div>

              {/* Rate Toggle */}
              <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs shrink-0 ml-auto sm:ml-0">
                <button
                  onClick={() => setRateMode('dayRate')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all ${
                    rateMode === 'dayRate' ? 'bg-[#FF1E1E] text-black shadow-[0_0_10px_rgba(255,30,30,0.4)]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  1-Day Rate
                </button>
                <button
                  onClick={() => setRateMode('eventRate')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all ${
                    rateMode === 'eventRate' ? 'bg-[#FF1E1E] text-black shadow-[0_0_10px_rgba(255,30,30,0.4)]' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Multi-Day
                </button>
              </div>
            </div>

            {/* Row 2 on Mobile: Estimator & AI Calculator side-by-side */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              {/* Price Estimator Button */}
              <button
                onClick={handleToggleEstimator}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  showEstimator 
                    ? 'bg-[#FF1E1E] border-[#FF1E1E] text-black shadow-[0_0_15px_rgba(255,30,30,0.4)]' 
                    : 'bg-[#FF1E1E]/10 border-[#FF1E1E]/40 text-[#FF1E1E] hover:bg-[#FF1E1E] hover:text-black'
                }`}
              >
                <Calculator className={`w-3.5 h-3.5 shrink-0 ${showEstimator ? 'text-black' : 'text-[#FF1E1E]'}`} />
                <span className="truncate">Price Estimator</span>
              </button>

              {/* AI Auto Calculator Button */}
              <button
                onClick={onOpenAiAdvisor}
                className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#FF1E1E]/20 to-[#FF1E1E]/10 border border-[#FF1E1E]/50 text-[#FF1E1E] hover:bg-[#FF1E1E] hover:text-black text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,30,30,0.2)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF1E1E] animate-pulse shrink-0" />
                <span className="truncate">AI Calculator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveServiceIndex(null);
                setVisibleCount(6);
              }}
              className={`px-4 py-2 rounded-sm text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FF1E1E] text-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                  : 'bg-[#050505] text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Price Estimator UI */}
        {showEstimator && (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Added Items */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#FF1E1E]" />
                    Estimated Gear ({estimatorSelections.reduce((acc, i) => acc + i.quantity, 0)} items)
                  </h3>
                  {estimatorSelections.length > 0 && (
                    <button
                      onClick={() => setEstimatorSelections([])}
                      className="text-[10px] text-gray-500 hover:text-[#FF1E1E] uppercase font-bold tracking-widest transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                {estimatorSelections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 bg-white/5 border border-white/5 rounded-xl border-dashed">
                    <Calculator className="w-8 h-8 text-white/20 mb-2" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center">
                      Add items from the catalog below to estimate total cost
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {estimatorSelections.map(item => {
                      const service = services.find(s => s.id === item.id);
                      if (!service) return null;
                      const rate = rateMode === 'dayRate' ? service.dayRate : service.eventRate;
                      
                      return (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-white/20 transition-all">
                          <img
                            loading="lazy"
                            src={service.image}
                            alt={service.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/techno_core_3d_logo.jpg';
                            }}
                            className="w-12 h-12 object-cover rounded-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-[#FF1E1E] font-bold uppercase tracking-widest truncate">{service.category}</div>
                            <h4 className="text-sm font-bold text-white truncate leading-tight">{service.name}</h4>
                            <div className="text-xs text-gray-400">₱{rate.toLocaleString()} / ea</div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-black rounded-lg p-0.5 border border-white/10">
                              <button
                                onClick={() => handleUpdateEstimatorQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold w-4 text-center text-white">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateEstimatorQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-xs font-black text-white">
                              ₱{(rate * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right: Summary Panel */}
              <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
                <div className="bg-black/50 p-5 rounded-xl border border-white/10 space-y-4">
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Pricing Model</div>
                    <div className="text-sm font-black text-white uppercase flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#FF1E1E]" />
                      {rateMode === 'dayRate' ? '1-Day Rental Rate' : 'Multi-Day Package'}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Estimated Subtotal</div>
                    <div className="text-3xl font-black text-[#FF1E1E]">
                      ₱{estimatorTotal.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-gray-500 leading-relaxed">
                    * This is a quick estimate and does not include delivery, setup, or specialized crew fees which will be calculated in the final quote.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rental Services Grid - 1 Col Centered on Mobile, 2 Col Tablet, 3 Col Desktop */}
        {filteredServices.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-10 text-center space-y-3">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">No rental equipment found</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No equipment matched category "{selectedCategory}".
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-4 py-2 rounded-sm bg-[#FF1E1E] text-black font-black text-xs uppercase tracking-widest shadow-md"
            >
              Show All Rentals
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE MODULAR SWIPE SHOWCASE */}
            <div className={`sm:hidden ${mobileLayoutMode === 'swipe' ? 'block' : 'hidden'} space-y-3`}>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-[#FF1E1E]" />
                  <span>Swipe gear ({currentSwipeIndex + 1} of {displayedServices.length})</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleScrollLeft}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                    aria-label="Previous gear item"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleScrollRight}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                    aria-label="Next gear item"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={scrollContainerRef}
                onScroll={handleContainerScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 scrollbar-none scroll-smooth"
              >
                {displayedServices.map((service, index) => {
                  const displayPrice = rateMode === 'dayRate' ? service.dayRate : service.eventRate;
                  const isExpanded = Boolean(expandedCardIds[service.id]);
                  const indexInFiltered = filteredServices.findIndex((s) => s.id === service.id);

                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        playLaserClick();
                        setActiveServiceIndex(indexInFiltered !== -1 ? indexInFiltered : 0);
                      }}
                      className="w-[85vw] max-w-[310px] shrink-0 snap-start bg-[#080808] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-[#FF1E1E] hover:shadow-[0_0_30px_rgba(255,30,30,0.2)] transition-all flex flex-col justify-between overflow-hidden shadow-2xl space-y-2.5 cursor-pointer group"
                    >
                      {/* Image Box */}
                      <div className="relative h-[120px] bg-[#050505] rounded-xl overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/techno_core_3d_logo.jpg';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80" />

                        {/* Hover Overlay Affordance */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-[2px]">
                          <Eye className="w-4 h-4 text-[#FF1E1E] animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-white">
                            Inspect Gear & Specs
                          </span>
                        </div>

                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
                          {service.isPopular && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black font-black text-[8px] uppercase tracking-widest shadow">
                              POPULAR
                            </span>
                          )}
                          {renderLiveStatusBadge(service, true)}
                        </div>

                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#050505]/90 text-[#FF1E1E] font-black text-[8px] uppercase tracking-widest border border-[#FF1E1E]/40 backdrop-blur-md truncate max-w-[120px]">
                          {service.category}
                        </span>
                      </div>

                      {/* Header Info */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#FF1E1E] transition-colors uppercase tracking-tight line-clamp-1">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5 text-[9px] text-gray-500 uppercase font-mono">
                          <span>Click to inspect & test</span>
                        </div>
                      </div>

                      {/* Price & Primary Control Buttons */}
                      <div 
                        className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>
                          <div className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">
                            {rateMode === 'dayRate' ? 'Daily Rate' : 'Multi-Day'}
                          </div>
                          <div className="text-sm font-black text-white">
                            ₱{displayPrice.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardExpand(service.id, e);
                            }}
                            aria-expanded={isExpanded}
                            aria-controls={`drawer-rental-swipe-${service.id}`}
                            className="px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all min-h-[38px]"
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            <span>{isExpanded ? 'Less' : 'More'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-[#FF1E1E]" />}
                          </button>

                          {showEstimator ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddEstimatorItem(service.id);
                              }}
                              className="px-3 py-2 rounded-lg bg-black hover:bg-white/10 text-white border border-[#FF1E1E]/50 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1 min-h-[38px] shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#FF1E1E]" />
                              <span>Add</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(service, 'rental');
                              }}
                              className="px-3 py-2 rounded-lg bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(255,30,30,0.3)] flex items-center gap-1 min-h-[38px] shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Quote</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Accessible Collapsible Description Drawer */}
                      <div
                        id={`drawer-rental-swipe-${service.id}`}
                        role="region"
                        aria-label={`Rental details for ${service.name}`}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded
                            ? 'max-h-[320px] opacity-100 pt-2 border-t border-white/10'
                            : 'max-h-0 opacity-0 m-0 p-0 border-none'
                        }`}
                      >
                        <div className="bg-white/5 rounded-xl p-3 space-y-2 text-xs text-gray-300">
                          <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[#FF1E1E] tracking-widest">
                            <span>Equipment Overview</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveServiceIndex(indexInFiltered !== -1 ? indexInFiltered : 0);
                              }}
                              className="text-gray-400 hover:text-white underline text-[8px]"
                            >
                              Full Specs & Test
                            </button>
                          </div>
                          <p className="text-gray-300 text-[11px] leading-relaxed">
                            {service.description}
                          </p>
                          <div className="pt-1.5 border-t border-white/10 space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inclusions:</span>
                            {service.inclusions.map((inc, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-200">
                                <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{inc}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-400">
                            <span>Day Rate: <strong className="text-white">₱{service.dayRate.toLocaleString()}</strong></span>
                            <span>Event Rate: <strong className="text-white">₱{service.eventRate.toLocaleString()}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progressive Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {displayedServices.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        const container = scrollContainerRef.current;
                        const targetChild = container.children[idx] as HTMLElement;
                        if (targetChild) {
                          container.scrollTo({
                            left: targetChild.offsetLeft - container.offsetLeft - 16,
                            behavior: 'smooth'
                          });
                        }
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSwipeIndex
                        ? 'w-6 bg-[#FF1E1E] shadow-[0_0_10px_rgba(255,30,30,0.6)]'
                        : 'w-1.5 bg-white/20 hover:bg-white/50'
                    }`}
                    aria-label={`Go to item ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Modular Grid Layout for Desktop & Mobile Grid Toggle */}
            <div className={`${mobileLayoutMode === 'swipe' ? 'hidden sm:grid' : 'grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center items-start`}>
          {displayedServices.map((service, index) => {
            const displayPrice = rateMode === 'dayRate' ? service.dayRate : service.eventRate;
            const isExpanded = Boolean(expandedCardIds[service.id]);
            const indexInFiltered = filteredServices.findIndex((s) => s.id === service.id);

            return (
              <div
                key={service.id}
                onClick={() => {
                  playLaserClick();
                  setActiveServiceIndex(indexInFiltered !== -1 ? indexInFiltered : 0);
                }}
                className="bg-[#080808] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-[#FF1E1E] hover:shadow-[0_0_30px_rgba(255,30,30,0.2)] transition-all flex flex-col justify-between overflow-hidden group shadow-xl w-full space-y-2.5 cursor-pointer"
              >
                {/* Image Box */}
                <div className="relative h-[120px] sm:h-[130px] bg-[#050505] rounded-xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/techno_core_3d_logo.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80" />

                  {/* Hover Overlay Affordance */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-[2px]">
                    <Eye className="w-4 h-4 text-[#FF1E1E] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">
                      Inspect Gear & Specs
                    </span>
                  </div>

                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
                    {service.isPopular && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black font-black text-[8px] uppercase tracking-widest shadow">
                        POPULAR
                      </span>
                    )}
                    {renderLiveStatusBadge(service, true)}
                  </div>

                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#050505]/90 text-[#FF1E1E] font-black text-[8px] uppercase tracking-widest border border-[#FF1E1E]/40 backdrop-blur-md truncate max-w-[110px]">
                    {service.category}
                  </span>
                </div>

                {/* Header Title */}
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#FF1E1E] transition-colors uppercase tracking-tight line-clamp-1">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 text-[9px] text-gray-500 uppercase font-mono">
                    <span>Click to inspect & test</span>
                  </div>
                </div>

                {/* Price & Action Control Bar */}
                <div 
                  className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <div className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-widest">
                      {rateMode === 'dayRate' ? 'Daily Rate' : 'Multi-Day'}
                    </div>
                    <div className="text-xs sm:text-base font-black text-white">
                      ₱{displayPrice.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardExpand(service.id, e);
                      }}
                      aria-expanded={isExpanded}
                      aria-controls={`drawer-rental-grid-${service.id}`}
                      className="px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all min-h-[36px] sm:min-h-[40px]"
                      title={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      <span>{isExpanded ? 'Less' : 'More'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-[#FF1E1E]" />}
                    </button>

                    {showEstimator ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddEstimatorItem(service.id);
                        }}
                        className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-black hover:bg-white/10 text-white border border-[#FF1E1E]/50 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1 min-h-[36px] sm:min-h-[40px] shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF1E1E]" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(service, 'rental');
                        }}
                        className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(255,30,30,0.3)] flex items-center gap-1 min-h-[36px] sm:min-h-[40px] shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Quote</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Accessible Collapsible Description Drawer */}
                <div
                  id={`drawer-rental-grid-${service.id}`}
                  role="region"
                  aria-label={`Description drawer for ${service.name}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? 'max-h-[320px] opacity-100 pt-2 border-t border-white/10'
                      : 'max-h-0 opacity-0 m-0 p-0 border-none'
                  }`}
                >
                  <div className="bg-white/5 rounded-xl p-3 space-y-2 text-xs text-gray-300">
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[#FF1E1E] tracking-widest">
                      <span>Equipment Specifications</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveServiceIndex(indexInFiltered !== -1 ? indexInFiltered : 0);
                        }}
                        className="text-gray-400 hover:text-white underline text-[8px]"
                      >
                        Full Specs & Test
                      </button>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {service.description}
                    </p>
                    <div className="pt-1.5 border-t border-white/10 space-y-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Included Equipment:</span>
                      {service.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-200">
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-400">
                      <span>Day Rate: <strong className="text-white">₱{service.dayRate.toLocaleString()}</strong></span>
                      <span>Event Rate: <strong className="text-white">₱{service.eventRate.toLocaleString()}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          </>
        )}

        {/* Load More Pagination Button */}
        {filteredServices.length > 6 && (
          <div className="flex flex-col items-center justify-center gap-2 pt-4 border-t border-white/5">
            <div className="text-xs text-gray-400 font-mono">
              Showing <strong className="text-white">{displayedServices.length}</strong> of <strong className="text-white">{filteredServices.length}</strong> rental equipment items
            </div>
            {hasMore ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2.5 rounded-sm bg-white/5 hover:bg-[#FF1E1E] text-white hover:text-black border border-white/10 hover:border-[#FF1E1E] font-black text-xs uppercase tracking-widest transition-all shadow-lg"
              >
                Load More Rental Gear (+6)
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(6)}
                className="px-5 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors"
              >
                Collapse Rental View
              </button>
            )}
          </div>
        )}

      </div>

      {/* Service Detail Interactive Carousel Modal */}
      {activeServiceModal && activeServiceIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-[#080808] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase text-[#FF1E1E] tracking-widest bg-[#FF1E1E]/10 px-2.5 py-0.5 rounded border border-[#FF1E1E]/30">
                    Equipment {activeServiceIndex + 1} of {filteredServices.length}
                  </span>
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                    {activeServiceModal.category}
                  </span>
                  {renderLiveStatusBadge(activeServiceModal)}
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1.5">
                  {activeServiceModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveServiceIndex(null)}
                className="text-gray-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Organized Image Viewport with Left & Right Buttons & Swipe */}
            <div
              className="relative bg-[#020202] rounded-xl border border-white/10 p-3 flex items-center justify-center min-h-[200px] max-h-[55vh] overflow-hidden group/rental-img"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={activeServiceModal.image}
                alt={activeServiceModal.name}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/techno_core_3d_logo.jpg';
                }}
                className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg transition-all duration-300 shadow-lg"
              />

              {/* Left Arrow Button */}
              <button
                onClick={handlePrevService}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#FF1E1E] text-white hover:text-black p-2.5 rounded-full border border-white/20 shadow-xl transition-all"
                title="Previous rental item"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={handleNextService}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#FF1E1E] text-white hover:text-black p-2.5 rounded-full border border-white/20 shadow-xl transition-all"
                title="Next rental item"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Rates & Specs Grid */}
            <div className="space-y-4">
              {/* Interactive Live Equipment Tester Bar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-black via-[#0a0a0a] to-[#120505] border border-[#FF1E1E]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#FF1E1E] animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">
                      Live Equipment Signal & Performance Test
                    </span>
                  </div>
                  <span className="text-[9px] text-[#FF1E1E] font-mono font-bold uppercase bg-[#FF1E1E]/10 px-2 py-0.5 rounded border border-[#FF1E1E]/30">
                    Live Simulator Active
                  </span>
                </div>
                <p className="text-gray-400 text-xs">
                  Test acoustic output, light DMX response, or generator capacity for this gear:
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    onClick={() => playKickBass()}
                    className="px-3 py-1.5 rounded-lg bg-[#FF1E1E]/20 hover:bg-[#FF1E1E] text-white hover:text-black border border-[#FF1E1E]/50 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Test Sub-Bass Kick (50Hz)</span>
                  </button>
                  <button
                    onClick={() => playAcousticSweep()}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-200 border border-white/15 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Test Acoustic Sweep</span>
                  </button>
                  <button
                    onClick={() => playLaserClick()}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-200 border border-white/15 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trigger DMX Strobe</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">1-Day Rental Rate</div>
                  <div className="text-lg font-black text-white">₱{activeServiceModal.dayRate.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Multi-Day Package Rate</div>
                  <div className="text-lg font-black text-white">₱{activeServiceModal.eventRate.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Technical Specifications:</div>
                  {activeServiceModal.specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Standard Rental Inclusions:</div>
                  {activeServiceModal.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevService}
                  className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={handleNextService}
                  className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 font-bold flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveServiceIndex(null)}
                  className="px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest bg-white/5 text-gray-300 border border-white/10"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onAddToCart(activeServiceModal, 'rental');
                    setActiveServiceIndex(null);
                  }}
                  className="px-5 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest bg-[#FF1E1E] text-black shadow-[0_0_20px_rgba(255,30,30,0.4)]"
                >
                  Add to Quote List
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

