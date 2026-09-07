import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Images, Eye, ChevronLeft, ChevronRight, X, Layers } from 'lucide-react';
import { GalleryItem } from '../types';

interface PastEventsGalleryProps {
  galleryItems: GalleryItem[];
}

export const PastEventsGallery: React.FC<PastEventsGalleryProps> = ({ galleryItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEventIndex, setActiveEventIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Touch Swipe State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const categories = ['All', 'Concert', 'Wedding', 'Corporate', 'Festival'];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'All' || item.eventType === selectedCategory
  );

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const activeEventModal = activeEventIndex !== null ? filteredItems[activeEventIndex] : null;

  // Get all photos for the active event
  const activeEventPhotos: string[] = activeEventModal
    ? (activeEventModal.images && activeEventModal.images.length > 0 ? activeEventModal.images : [activeEventModal.image])
    : [];

  const handleNextPhoto = () => {
    if (!activeEventModal || activeEventPhotos.length === 0) return;
    setActivePhotoIndex((prev) => (prev < activeEventPhotos.length - 1 ? prev + 1 : 0));
  };

  const handlePrevPhoto = () => {
    if (!activeEventModal || activeEventPhotos.length === 0) return;
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : activeEventPhotos.length - 1));
  };

  const handleNextEvent = () => {
    if (activeEventIndex === null) return;
    const nextEventIndex = activeEventIndex < filteredItems.length - 1 ? activeEventIndex + 1 : 0;
    setActiveEventIndex(nextEventIndex);
    setActivePhotoIndex(0);
  };

  const handlePrevEvent = () => {
    if (activeEventIndex === null) return;
    const prevEventIndex = activeEventIndex > 0 ? activeEventIndex - 1 : filteredItems.length - 1;
    setActiveEventIndex(prevEventIndex);
    setActivePhotoIndex(0);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeEventIndex === null) return;
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') setActiveEventIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEventIndex, activePhotoIndex, activeEventPhotos.length]);

  // Touch Swipe Handler
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNextPhoto(); // Swiped left -> Next photo
    } else if (distance < -minSwipeDistance) {
      handlePrevPhoto(); // Swiped right -> Prev photo
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const openEventGallery = (eventIndex: number) => {
    setActiveEventIndex(eventIndex);
    setActivePhotoIndex(0);
  };

  return (
    <section id="gallery" className="py-16 bg-[#050505] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] text-[10px] font-bold uppercase tracking-widest mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Past Events Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase">
              PRODUCTIONS & SETUPS
            </h2>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Real project photography from major concerts, luxury weddings, and summits produced across Davao & Mindanao. Click any event to browse its full multi-image photo album.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveEventIndex(null);
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
        </div>

        {/* Gallery Grid - 1 Col Centered on Mobile, 2-3 Col Tablet, 4 Col Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 justify-center items-stretch">
          {displayedItems.map((item, index) => {
            const itemPhotos = item.images && item.images.length > 0 ? item.images : [item.image];
            const photoCount = itemPhotos.length;

            return (
              <div
                key={item.id}
                onClick={() => openEventGallery(index)}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer group hover:border-[#FF1E1E]/50 transition-all shadow-xl flex flex-col justify-between max-w-[360px] sm:max-w-none w-full mx-auto"
              >
                <div className="relative h-[200px] sm:h-52 bg-[#050505] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/techno_core_3d_logo.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-90" />

                  {/* Top Left Event Type Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#050505]/90 text-[#FF1E1E] text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-[#FF1E1E]/40">
                    {item.eventType}
                  </div>

                  {/* Top Right Photo Count Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 text-white text-[9px] sm:text-[10px] font-mono font-bold border border-white/20 flex items-center gap-1 group-hover:bg-[#FF1E1E] group-hover:text-black transition-colors shadow-lg">
                    <Images className="w-3 h-3 text-[#FF1E1E] group-hover:text-black" />
                    <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                  </div>

                  {/* Bottom Event Title & Location Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <h4 className="text-sm font-black uppercase text-white line-clamp-1 group-hover:text-[#FF1E1E] transition-colors tracking-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-gray-300 font-bold uppercase truncate">
                      <MapPin className="w-3 h-3 text-[#FF1E1E] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Thumbnail Preview Strip if Multiple Photos */}
                <div className="px-4 py-3 bg-black/60 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {itemPhotos.slice(0, 4).map((imgUrl, i) => (
                      <div
                        key={i}
                        className={`w-7 h-5 rounded overflow-hidden border ${
                          i === 0 ? 'border-[#FF1E1E]' : 'border-white/10 opacity-70'
                        }`}
                      >
                        <img
                          loading="lazy"
                          src={imgUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/techno_core_3d_logo.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {photoCount > 4 && (
                      <span className="text-[9px] font-mono font-bold text-gray-400 pl-1">
                        +{photoCount - 4}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] sm:text-xs text-gray-400 font-mono font-bold shrink-0">
                    {item.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Pagination Button */}
        {filteredItems.length > 6 && (
          <div className="flex flex-col items-center justify-center gap-2 pt-4 border-t border-white/5">
            <div className="text-xs text-gray-400 font-mono">
              Showing <strong className="text-white">{displayedItems.length}</strong> of <strong className="text-white">{filteredItems.length}</strong> event galleries
            </div>
            {hasMore ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2.5 rounded-sm bg-white/5 hover:bg-[#FF1E1E] text-white hover:text-black border border-white/10 hover:border-[#FF1E1E] font-black text-xs uppercase tracking-widest transition-all shadow-lg"
              >
                Load More Production Photos (+6)
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(6)}
                className="px-5 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors"
              >
                Collapse Gallery View
              </button>
            )}
          </div>
        )}

      </div>

      {/* Multi-Image Lightbox Modal for Active Event */}
      {activeEventModal && activeEventIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden">
          <div className="bg-[#080808] border border-white/10 rounded-2xl max-w-5xl w-full h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Modal Top Header */}
            <div className="shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#050505] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 rounded bg-[#FF1E1E]/10 border border-[#FF1E1E]/40 text-[#FF1E1E] text-[10px] font-black uppercase tracking-widest shrink-0 flex items-center gap-1">
                  <Images className="w-3 h-3" />
                  <span>{activePhotoIndex + 1} / {activeEventPhotos.length}</span>
                </span>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-tight text-white truncate">
                    {activeEventModal.title}
                  </h3>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase truncate">
                    {activeEventModal.eventType} • {activeEventModal.location} ({activeEventModal.date})
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-white/10">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevEvent}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[10px] font-bold uppercase tracking-wider transition-colors"
                    title="Jump to previous event"
                  >
                    ← Prev Event
                  </button>
                  <button
                    onClick={handleNextEvent}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[10px] font-bold uppercase tracking-wider transition-colors"
                    title="Jump to next event"
                  >
                    Next Event →
                  </button>
                </div>

                <button
                  onClick={() => setActiveEventIndex(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#FF1E1E] text-gray-400 hover:text-black transition-colors border border-white/10"
                  title="Close album"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Main Image Viewport - Grows dynamically within available space */}
            <div
              className="relative flex-1 min-h-0 bg-[#000000] flex items-center justify-center p-2 sm:p-4 overflow-hidden group/slide"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Active Photo */}
              <img
                src={activeEventPhotos[activePhotoIndex]}
                alt={`${activeEventModal.title} photo ${activePhotoIndex + 1}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/techno_core_3d_logo.jpg';
                }}
                className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl border border-white/10 transition-all duration-300 shadow-2xl"
              />

              {/* Prev Photo Arrow (Only if multiple photos) */}
              {activeEventPhotos.length > 1 && (
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#FF1E1E] text-white hover:text-black p-2 sm:p-3 rounded-full border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95"
                  title="Previous photo in this event"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Next Photo Arrow (Only if multiple photos) */}
              {activeEventPhotos.length > 1 && (
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-[#FF1E1E] text-white hover:text-black p-2 sm:p-3 rounded-full border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95"
                  title="Next photo in this event"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Mobile Swipe Guidance */}
              <div className="absolute bottom-2 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-mono text-gray-300 border border-white/10 sm:hidden">
                Swipe left / right to browse photos
              </div>
            </div>

            {/* Album Thumbnails & Event Details Footer - Fixed at bottom */}
            <div className="shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#050505] border-t border-white/10 space-y-2.5">
              
              {/* Event Photos Thumbnail Strip */}
              {activeEventPhotos.length > 1 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span className="uppercase font-bold text-gray-300">Album Gallery ({activeEventPhotos.length} photos)</span>
                    <span className="hidden sm:inline">Click thumbnail to switch photo</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {activeEventPhotos.map((photoUrl, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => setActivePhotoIndex(pIdx)}
                        className={`relative w-12 h-9 sm:w-14 sm:h-10 shrink-0 rounded-md overflow-hidden border transition-all ${
                          activePhotoIndex === pIdx
                            ? 'border-[#FF1E1E] ring-2 ring-[#FF1E1E]/60 scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          loading="lazy"
                          src={photoUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/techno_core_3d_logo.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0.5 left-0.5 px-1 rounded bg-black/80 text-[7px] font-mono text-white">
                          #{pIdx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-2">
                {activeEventModal.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-white/5">
                <div className="flex flex-wrap gap-1">
                  {activeEventModal.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {activeEventPhotos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-300 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="px-2.5 py-1 rounded bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(255,30,30,0.4)]"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};
