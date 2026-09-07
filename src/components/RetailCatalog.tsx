import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Filter, Star, CheckCircle, Info, Plus, Tag, ArrowUpDown, ChevronLeft, ChevronRight, X, LayoutGrid, SlidersHorizontal, Sparkles, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { RetailProduct } from '../types';

interface RetailCatalogProps {
  products: RetailProduct[];
  onAddToCart: (product: RetailProduct, type: 'retail') => void;
  onOpenQuoteModal: () => void;
}

export const RetailCatalog: React.FC<RetailCatalogProps> = ({
  products,
  onAddToCart,
  onOpenQuoteModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6); // Load More state
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'swipe' | 'grid'>('swipe');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);

  // Local state for wishlist product IDs backed by localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('technocore_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('technocore_wishlist', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save wishlist to localStorage:', err);
      }
      return next;
    });
  };

  const toggleCardExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);

  // Touch Swipe State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const categories = [
    'All',
    'Guitars & Bass',
    'Pro Audio & Speakers',
    'Mixers & Amps',
    'Microphones',
    'Stage Lighting'
  ];

  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['All', ...list];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
      const matchWishlist = !showWishlistOnly || wishlistIds.includes(p.id);
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchCat && matchBrand && matchWishlist && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') {
        const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
        if (numA !== numB) return numB - numA;
        return b.id.localeCompare(a.id);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy, showWishlistOnly, wishlistIds]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const activeProductModal = activeProductIndex !== null ? filteredProducts[activeProductIndex] : null;

  const handleNextProduct = () => {
    if (activeProductIndex === null) return;
    setActiveProductIndex((prev) => (prev !== null && prev < filteredProducts.length - 1 ? prev + 1 : 0));
  };

  const handlePrevProduct = () => {
    if (activeProductIndex === null) return;
    setActiveProductIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredProducts.length - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeProductIndex === null) return;
      if (e.key === 'ArrowRight') handleNextProduct();
      if (e.key === 'ArrowLeft') handlePrevProduct();
      if (e.key === 'Escape') setActiveProductIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProductIndex, filteredProducts.length]);

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
    if (distance > 40) handleNextProduct(); // Swiped left
    if (distance < -40) handlePrevProduct(); // Swiped right
    setTouchStartX(null);
    setTouchEndX(null);
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

  return (
    <section id="retail" className="py-8 sm:py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-4 sm:pb-6 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Retail Music & Pro Sound Store</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase">
              PRO GEAR & INSTRUMENTS
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
              Shop authentic instruments, speakers, amplifiers, wireless mics, and lighting fixtures in Davao City.
            </p>
          </div>

          <button
            onClick={onOpenQuoteModal}
            className="self-start md:self-auto px-3.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-sm bg-[#FF1E1E]/10 border border-[#FF1E1E]/40 hover:bg-[#FF1E1E] text-[#FF1E1E] hover:text-black text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <span>Inquire Bulk / Layaway Order</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/5 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 space-y-2.5 sm:space-y-4 shadow-2xl">
          
          {/* Top Row: Search & Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search gear, speakers, guitars, QSC, SM58..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg sm:rounded-xl pl-9 pr-8 py-2 text-[11px] sm:text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-gray-500 hover:text-white transition-colors p-0.5"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg sm:rounded-xl px-2.5 py-2 text-[11px] sm:text-xs text-gray-300 focus:outline-none focus:border-[#FF1E1E]"
              >
                <option value="All">All Brands ({brands.length - 1})</option>
                {brands.filter((b) => b !== 'All').map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 relative">
              <ArrowUpDown className="w-3 h-3 text-[#FF1E1E] absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by price or newest arrivals"
                className="w-full bg-[#050505] border border-white/10 rounded-lg sm:rounded-xl pl-8 pr-7 py-2 text-[11px] sm:text-xs text-gray-200 focus:outline-none focus:border-[#FF1E1E] cursor-pointer appearance-none transition-colors"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Sort: Price Low-High</option>
                <option value="price-desc">Sort: Price High-Low</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Category Tabs & Wishlist Toggle */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowWishlistOnly(false);
                  setActiveProductIndex(null);
                  setVisibleCount(6);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat && !showWishlistOnly
                    ? 'bg-[#FF1E1E] text-black shadow-[0_0_12px_rgba(255,30,30,0.4)]'
                    : 'bg-[#050505] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => {
                setShowWishlistOnly(prev => !prev);
                setActiveProductIndex(null);
                setVisibleCount(6);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                showWishlistOnly
                  ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)] border border-rose-400'
                  : 'bg-[#050505] text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showWishlistOnly || wishlistIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Wishlist ({wishlistIds.length})</span>
            </button>
          </div>

          {/* Mobile Display View Switcher (Modular Swipe vs Grid) */}
          <div className="flex sm:hidden items-center justify-between pt-2 border-t border-white/5 text-[10px]">
            <div className="font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF1E1E]" />
              <span>Mobile Layout:</span>
            </div>
            <div className="flex items-center gap-1 bg-black/80 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setMobileLayoutMode('swipe')}
                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                  mobileLayoutMode === 'swipe'
                    ? 'bg-[#FF1E1E] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-2.5 h-2.5" />
                <span>Swipe</span>
              </button>
              <button
                onClick={() => setMobileLayoutMode('grid')}
                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                  mobileLayoutMode === 'grid'
                    ? 'bg-[#FF1E1E] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-2.5 h-2.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Listing */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
              <Search className="w-6 h-6 text-[#FF1E1E]" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-wider">No retail products found</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No equipment matched your active filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-sm bg-[#FF1E1E] text-black font-black text-xs uppercase tracking-widest shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* MOBILE MODULAR SWIPE SHOWCASE (Horizontal Touch Carousel) */}
            <div className={`sm:hidden ${mobileLayoutMode === 'swipe' ? 'block' : 'hidden'} space-y-3`}>
              {/* Header Hint and Navigation Arrows */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-[#FF1E1E]" />
                  <span>Swipe products ({currentSwipeIndex + 1} of {displayedProducts.length})</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleScrollLeft}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                    aria-label="Previous product"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleScrollRight}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-[#FF1E1E] hover:text-black flex items-center justify-center text-white transition-colors"
                    aria-label="Next product"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Touch Swipeable Horizontal Snap Container (Peeks next item) */}
              <div
                ref={scrollContainerRef}
                onScroll={handleContainerScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 scrollbar-none scroll-smooth"
              >
                {displayedProducts.map((product, index) => {
                  const isExpanded = Boolean(expandedCardIds[product.id]);
                  const isWishlisted = wishlistIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="w-[85vw] max-w-[310px] shrink-0 snap-start bg-[#080808] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-[#FF1E1E]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-2xl space-y-2.5 sm:space-y-3"
                    >
                      {/* Compact Image Box */}
                      <div
                        className="relative h-[120px] bg-[#050505] rounded-xl overflow-hidden cursor-pointer group/img"
                        onClick={() => setActiveProductIndex(index)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/techno_core_3d_logo.jpg';
                          }}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-85" />

                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-[#FF1E1E] text-black text-[8px] font-black uppercase shadow">
                            {product.brand}
                          </span>
                        </div>

                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                          <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            className={`p-1.5 rounded-full transition-all backdrop-blur-md ${
                              isWishlisted
                                ? 'bg-rose-950/90 text-rose-400 border border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                                : 'bg-black/60 hover:bg-black/90 text-gray-400 hover:text-white border border-white/20'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>

                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              product.stockStatus === 'In Stock'
                                ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/60'
                                : product.stockStatus === 'Low Stock'
                                ? 'bg-amber-950/90 text-amber-400 border border-amber-800/60'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {product.stockStatus}
                          </span>
                        </div>
                      </div>

                      {/* Header Info */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mb-1">
                          <span className="truncate">SKU: {product.sku}</span>
                          <span className="flex items-center text-amber-400 font-sans font-bold">
                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                            {product.rating}
                          </span>
                        </div>

                        <h3
                          onClick={() => toggleCardExpand(product.id)}
                          className="text-xs font-bold text-white cursor-pointer hover:text-[#FF1E1E] transition-colors uppercase tracking-tight line-clamp-1"
                        >
                          {product.name}
                        </h3>
                      </div>

                      {/* Price & Primary Control Buttons */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                        <div>
                          <div className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Retail Price</div>
                          <div className="text-sm font-black text-white">
                            ₱{product.price.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => toggleCardExpand(product.id, e)}
                            aria-expanded={isExpanded}
                            aria-controls={`drawer-retail-swipe-${product.id}`}
                            className="px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all min-h-[38px]"
                            title={isExpanded ? 'Collapse description' : 'Expand description'}
                          >
                            <span>{isExpanded ? 'Less' : 'More'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-[#FF1E1E]" />}
                          </button>

                          <button
                            onClick={() => onAddToCart(product, 'retail')}
                            className="px-3 py-2 rounded-lg bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(255,30,30,0.3)] flex items-center gap-1 min-h-[38px] shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      {/* Accessible Collapsible Description Drawer */}
                      <div
                        id={`drawer-retail-swipe-${product.id}`}
                        role="region"
                        aria-label={`Product details for ${product.name}`}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded
                            ? 'max-h-[300px] opacity-100 pt-2 border-t border-white/10'
                            : 'max-h-0 opacity-0 m-0 p-0 border-none'
                        }`}
                      >
                        <div className="bg-white/5 rounded-xl p-3 space-y-2 text-xs text-gray-300">
                          <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[#FF1E1E] tracking-widest">
                            <span>Equipment Overview</span>
                            <button
                              onClick={() => setActiveProductIndex(index)}
                              className="text-gray-400 hover:text-white underline text-[8px]"
                            >
                              Gallery View
                            </button>
                          </div>
                          <p className="text-gray-300 text-[11px] leading-relaxed">
                            {product.description}
                          </p>
                          {product.specs && (
                            <div className="pt-1.5 border-t border-white/10 space-y-0.5">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Specifications:</span>
                              <p className="text-[10px] text-gray-300 font-mono leading-tight">{product.specs}</p>
                            </div>
                          )}
                          <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-400">
                            <span>Warranty: <strong className="text-white">{product.warranty || '1 Year Shield'}</strong></span>
                            <span>Brand: <strong className="text-white">{product.brand}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progressive Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {displayedProducts.map((_, idx) => (
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

            {/* RESPONSIVE GRID (Desktop & Mobile Grid toggle) */}
            <div className={`${mobileLayoutMode === 'swipe' ? 'hidden sm:grid' : 'grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-center items-start`}>
            {displayedProducts.map((product, index) => {
              const isExpanded = Boolean(expandedCardIds[product.id]);
              const isWishlisted = wishlistIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-[#080808] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-[#FF1E1E]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl w-full space-y-2.5 sm:space-y-3"
                >
                  {/* Image Box */}
                  <div
                    className="relative h-[120px] sm:h-[130px] bg-[#050505] rounded-xl overflow-hidden cursor-pointer group/grid-img"
                    onClick={() => setActiveProductIndex(index)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/techno_core_3d_logo.jpg';
                      }}
                      className="w-full h-full object-cover group-hover/grid-img:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-[#FF1E1E] text-black text-[8px] sm:text-[9px] font-black uppercase shadow truncate max-w-[80px] sm:max-w-none">
                        {product.brand}
                      </span>
                      {product.isFeatured && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[8px] font-bold shadow hidden sm:inline-block">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        className={`p-1.5 rounded-full transition-all backdrop-blur-md ${
                          isWishlisted
                            ? 'bg-rose-950/90 text-rose-400 border border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                            : 'bg-black/60 hover:bg-black/90 text-gray-400 hover:text-white border border-white/20'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold ${
                          product.stockStatus === 'In Stock'
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/60'
                            : product.stockStatus === 'Low Stock'
                            ? 'bg-amber-950/90 text-amber-400 border border-amber-800/60'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {product.stockStatus}
                      </span>
                    </div>
                  </div>

                  {/* Product Title & Header */}
                  <div>
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-500 font-mono mb-1">
                      <span className="truncate">SKU: {product.sku}</span>
                      <span className="flex items-center text-amber-400 font-sans font-bold text-[9px] sm:text-xs">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 mr-0.5" />
                        {product.rating}
                      </span>
                    </div>

                    <h3
                      onClick={() => toggleCardExpand(product.id)}
                      className="text-xs sm:text-sm font-bold text-white cursor-pointer hover:text-[#FF1E1E] transition-colors uppercase tracking-tight line-clamp-1"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Actions Bar */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                    <div>
                      <div className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-widest">Retail Price</div>
                      <div className="text-xs sm:text-base font-black text-white">
                        ₱{product.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleCardExpand(product.id, e)}
                        aria-expanded={isExpanded}
                        aria-controls={`drawer-retail-grid-${product.id}`}
                        className="px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all min-h-[36px] sm:min-h-[40px]"
                        title={isExpanded ? 'Collapse description' : 'Expand description'}
                      >
                        <span>{isExpanded ? 'Less' : 'More'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-[#FF1E1E]" />}
                      </button>

                      <button
                        onClick={() => onAddToCart(product, 'retail')}
                        className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(255,30,30,0.3)] flex items-center gap-1 min-h-[36px] sm:min-h-[40px] shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Accessible Collapsible Description Drawer */}
                  <div
                    id={`drawer-retail-grid-${product.id}`}
                    role="region"
                    aria-label={`Description drawer for ${product.name}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? 'max-h-[320px] opacity-100 pt-2 border-t border-white/10'
                        : 'max-h-0 opacity-0 m-0 p-0 border-none'
                    }`}
                  >
                    <div className="bg-white/5 rounded-xl p-3 space-y-2 text-xs text-gray-300">
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[#FF1E1E] tracking-widest">
                        <span>Product Specification</span>
                        <button
                          onClick={() => setActiveProductIndex(index)}
                          className="text-gray-400 hover:text-white underline text-[8px]"
                        >
                          Modal View
                        </button>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        {product.description}
                      </p>
                      {product.specs && (
                        <div className="pt-1.5 border-t border-white/10 space-y-0.5">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Key Specs:</span>
                          <p className="text-[10px] text-gray-300 font-mono leading-tight">{product.specs}</p>
                        </div>
                      )}
                      <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-400">
                        <span>Warranty: <strong className="text-white">{product.warranty || '1 Year Standard'}</strong></span>
                        <span>Brand: <strong className="text-white">{product.brand}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
        </div>
        )}

        {/* Load More Pagination Button */}
        {filteredProducts.length > 6 && (
          <div className="flex flex-col items-center justify-center gap-2 pt-4 border-t border-white/5">
            <div className="text-xs text-gray-400 font-mono">
              Showing <strong className="text-white">{displayedProducts.length}</strong> of <strong className="text-white">{filteredProducts.length}</strong> retail products
            </div>
            {hasMore ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2.5 rounded-sm bg-white/5 hover:bg-[#FF1E1E] text-white hover:text-black border border-white/10 hover:border-[#FF1E1E] font-black text-xs uppercase tracking-widest transition-all shadow-lg"
              >
                Load More Store Items (+6)
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(6)}
                className="px-5 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors"
              >
                Collapse Store View
              </button>
            )}
          </div>
        )}

      </div>

      {/* Product Detail Interactive Carousel Modal */}
      {activeProductModal && activeProductIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-[#080808] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-scaleIn shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase text-[#FF1E1E] tracking-widest bg-[#FF1E1E]/10 px-2.5 py-0.5 rounded border border-[#FF1E1E]/30">
                    Product {activeProductIndex + 1} of {filteredProducts.length}
                  </span>
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                    {activeProductModal.brand} • {activeProductModal.category}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1.5">
                  {activeProductModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveProductIndex(null)}
                className="text-gray-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Organized Image Viewport with Left/Right Buttons & Touch Swipe */}
            <div
              className="relative bg-[#020202] rounded-xl border border-white/10 p-3 flex items-center justify-center min-h-[200px] max-h-[55vh] overflow-hidden group/product-img"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={activeProductModal.image}
                alt={activeProductModal.name}
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
                onClick={handlePrevProduct}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#FF1E1E] text-white hover:text-black p-2.5 rounded-full border border-white/20 shadow-xl transition-all"
                title="Previous gear item"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={handleNextProduct}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#FF1E1E] text-white hover:text-black p-2.5 rounded-full border border-white/20 shadow-xl transition-all"
                title="Next gear item"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/10">
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    ₱{activeProductModal.price.toLocaleString()}
                  </span>
                  {activeProductModal.originalPrice && (
                    <span className="text-xs text-gray-500 line-through font-mono">
                      ₱{activeProductModal.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-400 font-mono">
                  SKU: {activeProductModal.sku} • Stock: <span className="text-emerald-400 font-bold">{activeProductModal.stockStatus}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeProductModal.description}
                </p>
              </div>

              <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Specifications:</div>
                {activeProductModal.specs.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-[#FF1E1E] shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevProduct}
                  className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={handleNextProduct}
                  className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 font-bold flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleWishlist(activeProductModal.id, e)}
                  className={`px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    wishlistIds.includes(activeProductModal.id)
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                  title={wishlistIds.includes(activeProductModal.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${wishlistIds.includes(activeProductModal.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="hidden sm:inline">
                    {wishlistIds.includes(activeProductModal.id) ? 'Saved' : 'Wishlist'}
                  </span>
                </button>
                <button
                  onClick={() => setActiveProductIndex(null)}
                  className="px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest bg-white/5 text-gray-300 border border-white/10"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onAddToCart(activeProductModal, 'retail');
                    setActiveProductIndex(null);
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

