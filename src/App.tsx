import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyTechnoCore } from './components/WhyTechnoCore';
import { HowItWorks } from './components/HowItWorks';
import { BrandsStrip } from './components/BrandsStrip';
import { RetailCatalog } from './components/RetailCatalog';
import { RentalServices } from './components/RentalServices';
import { EventPackages } from './components/EventPackages';
import { SectionDivider } from './components/SectionDivider';
import { Layers, Sparkles, ShoppingBag, Camera, MessageSquare, Calendar } from 'lucide-react';
import { Testimonials } from './components/Testimonials';
import { PastEventsGallery } from './components/PastEventsGallery';
import { TrustSection } from './components/TrustSection';
import { PaymentAndFaq } from './components/PaymentAndFaq';
import { LocationFooter } from './components/LocationFooter';
import { StickyQuickContact } from './components/StickyQuickContact';
import { AiEventAdvisorModal } from './components/AiEventAdvisorModal';
import { QuoteModal } from './components/QuoteModal';
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
import { AdminAuthModal } from './components/AdminAuthModal';

import {
  INITIAL_RETAIL_PRODUCTS,
  INITIAL_RENTAL_SERVICES,
  INITIAL_EVENT_PACKAGES,
  INITIAL_GALLERY,
  INITIAL_CMS
} from './data/initialData';

import {
  RetailProduct,
  RentalService,
  EventPackage,
  GalleryItem,
  CMSData,
  BookingRequest,
  AiQuoteRecommendation
} from './types';

import { GlobalSearchModal } from './components/GlobalSearchModal';
import { EventsCalendar } from './components/EventsCalendar';
import { OrderTracking } from './components/OrderTracking';
import { formatLocalDate, parseLocalDate } from './utils/dateUtils';

import { FadeInSection } from './components/FadeInSection';
import { useToast } from './components/ToastProvider';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollHUD } from './components/ScrollHUD';
import { InteractiveStageStudio } from './components/InteractiveStageStudio';
import { CustomerReviews } from './components/CustomerReviews';
import { Sliders } from 'lucide-react';


export function App() {
  const { addToast } = useToast();
  const [retailProducts, setRetailProducts] = useState<RetailProduct[]>(INITIAL_RETAIL_PRODUCTS);
  const [rentalServices, setRentalServices] = useState<RentalService[]>(INITIAL_RENTAL_SERVICES);
  const [eventPackages, setEventPackages] = useState<EventPackage[]>(INITIAL_EVENT_PACKAGES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [cms, setCms] = useState<CMSData>(INITIAL_CMS);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [cart, setCart] = useState<Array<{ id: string; name: string; type: 'retail' | 'rental' | 'package'; price: number; quantity: number }>>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // User-facing theme state ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('technocore_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('technocore_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const handleToggleAdmin = (targetVal: boolean) => {
    if (!targetVal) {
      setIsAdmin(false);
    } else {
      if (isAdminAuthenticated) {
        setIsAdmin(true);
      } else {
        setIsAdminAuthModalOpen(true);
      }
    }
  };

  // Fetch data from backend API
  const fetchAllData = async () => {
    try {
      const [resProd, resServ, resPkg, resGal, resCms, resBookings] = await Promise.all([
        fetch('/api/retail-products').then((r) => r.json()).catch(() => null),
        fetch('/api/rental-services').then((r) => r.json()).catch(() => null),
        fetch('/api/event-packages').then((r) => r.json()).catch(() => null),
        fetch('/api/gallery').then((r) => r.json()).catch(() => null),
        fetch('/api/cms').then((r) => r.json()).catch(() => null),
        fetch('/api/bookings').then((r) => r.json()).catch(() => null)
      ]);

      if (resProd && Array.isArray(resProd)) setRetailProducts(resProd);
      if (resServ && Array.isArray(resServ)) setRentalServices(resServ);
      if (resPkg && Array.isArray(resPkg)) setEventPackages(resPkg);
      if (resGal && Array.isArray(resGal)) setGallery(resGal);
      if (resCms && resCms.operatingHours) setCms(resCms);
      if (resBookings && Array.isArray(resBookings)) setBookings(resBookings);
    } catch (err) {
      console.error('Error fetching API data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Cart operations
  const handleAddToCart = (item: RetailProduct | RentalService | EventPackage, type: 'retail' | 'rental' | 'package') => {
    let itemName = '';
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        itemName = existing.name;
        return prevCart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      const price = 'price' in item ? item.price : item.dayRate;
      itemName = 'name' in item ? item.name : (item as EventPackage).title;
      return [...prevCart, { id: item.id, name: itemName, type, price, quantity: 1 }];
    });
    addToast(`${'name' in item ? item.name : (item as EventPackage).title} added to cart`, 'success');
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // When AI generates a recommendation, add its key items to quote list & open modal
  const handleApplyAiQuote = (rec: AiQuoteRecommendation) => {
    const aiItems = rec.equipmentList.map((eq, i) => ({
      id: `ai-eq-${i}-${Date.now()}`,
      name: `${eq.item} (${eq.qty})`,
      type: 'rental' as const,
      price: 0,
      quantity: 1
    }));
    setCart((prev) => [...prev, ...aiItems]);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF1E1E] selection:text-black relative overflow-hidden">
      <ScrollProgress />
      {!isAdmin && (
        <ScrollHUD
          onNavigateSection={(sec) => {
            setActiveSection(sec);
            const el = document.getElementById(sec);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        />
      )}
      
      {/* Immersive Background Atmosphere Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FF1E1E] rounded-full blur-[180px] opacity-15" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF1E1E] rounded-full blur-[160px] opacity-10" />
        <div className="absolute top-[45%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] bg-[#FF1E1E] rounded-full blur-[220px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/40 to-[#050505]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Banner (Hidden in Admin view) */}
        {!isAdmin && <AnnouncementBar cms={cms} onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)} />}

        {/* Primary Navigation (Hidden in Admin view) */}
        {!isAdmin && (
          <Navbar
            cms={cms}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            onOpenCart={() => setIsQuoteModalOpen(true)}
            onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
            isAdmin={isAdmin}
            setIsAdmin={(val) => handleToggleAdmin(val)}
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          />
        )}

        <OrderTracking 
          isOpen={isOrderTrackingOpen}
          onClose={() => setIsOrderTrackingOpen(false)}
        />

        <GlobalSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          retailProducts={retailProducts}
          rentalServices={rentalServices}
          eventPackages={eventPackages}
          onNavigateSection={(sec) => {
            setActiveSection(sec);
            const el = document.getElementById(sec);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
        />

        {isAdmin ? (
          /* Admin Management Portal */
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#FF1E1E] border-t-transparent rounded-full"></div></div>}>
            <AdminDashboard
              retailProducts={retailProducts}
              rentalServices={rentalServices}
              eventPackages={eventPackages}
              gallery={gallery}
              cms={cms}
              bookings={bookings}
              onRefreshData={fetchAllData}
              onExitAdmin={() => handleToggleAdmin(false)}
            />
          </Suspense>
        ) : (
          /* Client Facing High-Converting Business Site */
          <main>
            {/* 1. Hero Showcase */}
            <FadeInSection>
              <Hero
                cms={cms}
                onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
                onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
                onNavigateSection={(sec) => {
                  setActiveSection(sec);
                  const el = document.getElementById(sec);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </FadeInSection>

            {/* 2. Supported Authorized Brands */}
            <FadeInSection>
              <BrandsStrip />
            </FadeInSection>

            {/* 3. Turnkey Event Packages */}
            <FadeInSection>
              <SectionDivider
                icon={Sparkles}
                label="Turnkey Event Production"
                sublabel="Sound • LED Wall • Lighting • Stage"
              />
            </FadeInSection>

            <FadeInSection>
              <EventPackages
                packages={eventPackages}
                onSelectPackage={(pkg) => handleAddToCart(pkg, 'package')}
                onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
              />
            </FadeInSection>

            {/* 4. Equipment Rental Inventory */}
            <FadeInSection>
              <SectionDivider
                icon={Layers}
                label="Rental Inventory & Gear Hire"
                sublabel="Line Arrays • Wireless Mics • Subwoofers"
              />
            </FadeInSection>

            <FadeInSection>
              <RentalServices
                services={rentalServices}
                onAddToCart={handleAddToCart}
                onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
                onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
              />
            </FadeInSection>

            {/* 4.5 Interactive Live Stage & DMX Studio Simulator */}
            <FadeInSection>
              <SectionDivider
                icon={Sliders}
                label="Interactive Live Stage & Rig Designer"
                sublabel="Realtime 60FPS DMX Light Simulation • LED Wall Matrix • Virtual Stage Rig Builder"
              />
            </FadeInSection>

            <FadeInSection>
              <InteractiveStageStudio
                onAddToCart={handleAddToCart}
                onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
              />
            </FadeInSection>

            {/* 5. Pro Gear Retail & Music Store */}
            <FadeInSection>
              <SectionDivider
                icon={ShoppingBag}
                label="Pro Audio & Gear Retail Store"
                sublabel="Guitars • Speakers • Amps • Accessories"
              />
            </FadeInSection>

            <FadeInSection>
              <RetailCatalog
                products={retailProducts}
                onAddToCart={handleAddToCart}
                onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
              />
            </FadeInSection>

            {/* 6. Live Availability & Booking Calendar */}
            <FadeInSection>
              <SectionDivider
                icon={Calendar}
                label="Event Date Availability"
                sublabel="Check Dates & Lock Booking"
              />
            </FadeInSection>

            <FadeInSection>
              <EventsCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onRequestQuoteForDate={(dateStr) => {
                  setSelectedDate(parseLocalDate(dateStr));
                  setIsQuoteModalOpen(true);
                }}
                refreshTrigger={bookings.length}
              />
            </FadeInSection>

            {/* 7. How It Works & Why Techno Core */}
            <FadeInSection>
              <HowItWorks />
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <WhyTechnoCore />
            </FadeInSection>

            {/* 8. Event Portfolio Showcase */}
            <FadeInSection>
              <SectionDivider
                icon={Camera}
                label="Past Event Portfolio"
                sublabel="Concerts • Weddings • Summits"
              />
            </FadeInSection>

            <FadeInSection>
              <PastEventsGallery galleryItems={gallery} />
            </FadeInSection>

            {/* 9. Client Reviews & Trust */}
            <FadeInSection>
              <SectionDivider
                icon={MessageSquare}
                label="Client Testimonials & Feedback"
                sublabel="Mindanao Production Experiences"
              />
            </FadeInSection>

            <FadeInSection>
              <Testimonials />
            </FadeInSection>

            <FadeInSection>
              <CustomerReviews />
            </FadeInSection>

            <FadeInSection>
              <TrustSection cms={cms} />
            </FadeInSection>

            {/* 10. Payment Options, FAQs & Location Footer */}
            <FadeInSection>
              <PaymentAndFaq />
            </FadeInSection>

            <FadeInSection>
              <LocationFooter cms={cms} />
            </FadeInSection>

            {/* Sticky Floating Action Bar for Mobile/Desktop */}
            <StickyQuickContact
              cms={cms}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              onOpenCart={() => setIsQuoteModalOpen(true)}
              onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
            />
          </main>
        )}

        {/* AI Quote Advisor Modal */}
        <AiEventAdvisorModal
          isOpen={isAiAdvisorOpen}
          onClose={() => setIsAiAdvisorOpen(false)}
          onApplyAiQuote={handleApplyAiQuote}
        />

        {/* Quote Request & Order Cart Modal */}
        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          initialEventDate={selectedDate ? formatLocalDate(selectedDate) : undefined}
          onBookingSubmitted={() => {
            fetchAllData();
            addToast('Booking inquiry successfully sent!', 'success');
          }}
        />


        {/* Admin Password Gate Modal */}
        <AdminAuthModal
          isOpen={isAdminAuthModalOpen}
          onClose={() => setIsAdminAuthModalOpen(false)}
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            setIsAdminAuthModalOpen(false);
            setIsAdmin(true);
          }}
        />
      </div>

    </div>
  );
}

export default App;
