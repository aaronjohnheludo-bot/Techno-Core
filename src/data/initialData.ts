import { RetailProduct, RentalService, EventPackage, GalleryItem, CMSData, BookingRequest, BookedDateBlock } from '../types';


export const INITIAL_RETAIL_PRODUCTS: RetailProduct[] = [
  {
    id: 'ret-1',
    sku: 'QSC-K122',
    name: 'QSC K12.2 Powered Loudspeaker (2000W)',
    brand: 'QSC',
    category: 'Pro Audio & Speakers',
    price: 68500,
    originalPrice: 72000,
    stockStatus: 'In Stock',
    rating: 4.9,
    specs: ['2000 Watt Peak Class-D Power', '12" Woofer + 1.4" Titanium Compression Driver', 'Advanced Directivity Matched Transition (DMT)', 'Multifunction Digital Display'],
    description: 'Industry-standard active loudspeaker for pro live sound performance, DJing, and venue installations with crystal-clear audio dynamics.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    isFeatured: true
  },
  {
    id: 'ret-2',
    sku: 'SHURE-SLXD24-SM58',
    name: 'Shure SLXD24/SM58 Digital Wireless Microphone System',
    brand: 'Shure',
    category: 'Microphones',
    price: 44500,
    stockStatus: 'In Stock',
    rating: 5.0,
    specs: ['Transparent 24-bit Digital Audio', 'Extended 20 Hz to 20 kHz Frequency Range', 'Transparent 118 dB Dynamic Range', 'Predictable Switching Diversity'],
    description: 'Professional digital wireless system featuring the legendary SM58 vocal capsule for crisp, drop-out-free speech and performance.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    isFeatured: true
  },
  {
    id: 'ret-3',
    sku: 'ROLAND-RD2000',
    name: 'Roland RD-2000 Stage Piano & Synthesizer',
    brand: 'Roland',
    category: 'Guitars & Bass',
    price: 154000,
    originalPrice: 165000,
    stockStatus: 'In Stock',
    rating: 4.9,
    specs: ['Dual Acoustic Piano Sound Engines (V-Piano + SuperNATURAL)', 'PHA-50 Hybrid Wood/Molded Keyboard', 'Eight Knobs with LED Status Indicators', '1000+ Onboard Sounds'],
    description: 'The ultimate stage piano for touring keyboardists and church worship teams. Features real wood weighted keybed and dual synth engines.',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=800',
    isFeatured: true
  },
  {
    id: 'ret-4',
    sku: 'BOSS-KATANA100MK2',
    name: 'Boss Katana-100 MkII Guitar Combo Amplifier',
    brand: 'Boss',
    category: 'Mixers & Amps',
    price: 24800,
    stockStatus: 'In Stock',
    rating: 4.8,
    specs: ['100-Watt Combo Amp with Custom 12-inch Speaker', 'Tube Logic Design Approach', 'Five Unique Amp Characters (Clean, Crunch, Lead, Brown, Acoustic)', 'Five Independent Effects Sections'],
    description: 'Stage-ready 100-watt guitar combo amp with dual amp variations and custom Boss effects built right into the cabinet.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ret-5',
    sku: 'DBX-DriveRack-PA2',
    name: 'DBX DriveRack PA2 Loudspeaker Management System',
    brand: 'DBX',
    category: 'Mixers & Amps',
    price: 32500,
    stockStatus: 'In Stock',
    rating: 4.7,
    specs: ['AutoEQ Algorithm with 8-Band Graphic EQ', 'AFS Advanced Feedback Suppression', 'Mobile Control (iOS, Android, Mac, Windows)', 'Classic DBX Compression & Limiting'],
    description: 'Complete loudspeaker management system for optimizing speaker output, tuning crossovers, and suppressing acoustic feedback automatically.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ret-6',
    sku: 'LANEY-LA100BL',
    name: 'Laney Black Country Customs LA100BL Tube Head',
    brand: 'Laney',
    category: 'Mixers & Amps',
    price: 112000,
    stockStatus: 'Low Stock',
    rating: 4.9,
    specs: ['100W Hand-wired All-Tube Head', 'EL34 Power Tubes & ECC83 Preamp Tubes', 'Vintage British Voicing', 'Point-to-Point Turret Board Wiring'],
    description: 'Recreation of the original 1968 heavy metal powerhouse tube amplifier, delivers massive headroom and organic harmonic saturation.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ret-7',
    sku: 'SONOR-AQ2-STAGE',
    name: 'Sonor AQ2 Stage 5-Piece Birch Drum Shell Pack',
    brand: 'Sonor',
    category: 'Guitars & Bass',
    price: 78000,
    originalPrice: 85000,
    stockStatus: 'In Stock',
    rating: 4.8,
    specs: ['7-Ply All-Birch Shell Construction', 'SmartMount Isolation Mount System', '22" x 17.5" Bass Drum, 10" & 12" Toms, 16" Floor Tom, 14" Snare', 'High-Gloss Transparent Black Finish'],
    description: 'Professional birch drum set engineered in Germany, offering explosive projection, crisp attack, and resonance for live performances.',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=800',
    isFeatured: true
  },
  {
    id: 'ret-8',
    sku: 'SAMSON-MIXPAD-MXP124FX',
    name: 'Samson MixPad MXP124FX 12-Channel Compact Mixer with FX',
    brand: 'Samson',
    category: 'Mixers & Amps',
    price: 18500,
    stockStatus: 'In Stock',
    rating: 4.6,
    specs: ['12 Channels with 4 MDR Mic Preamps', '100 24-bit Digital FX Presets', 'Bi-Directional USB Interface', 'High-Integrity Circuitry'],
    description: 'Versatile 12-channel compact analog mixer with low-noise mic preamps, built-in digital effects processor, and USB audio streaming.',
    image: 'https://images.unsplash.com/photo-1516900557549-41557d405adb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ret-9',
    sku: 'DIGITECH-RP360XP',
    name: 'Digitech RP360XP Guitar Multi-FX Pedal with Expression',
    brand: 'Digitech',
    category: 'Guitars & Bass',
    price: 14200,
    stockStatus: 'In Stock',
    rating: 4.7,
    specs: ['126 Effects (32 Amps, 18 Cabinets, 76 Stompboxes)', 'Built-in Expression Pedal & 40-Second Looper', 'Lexicon Reverbs & Sound Check Function', 'USB Preset Editor'],
    description: 'Comprehensive guitar multi-effects processor providing classic amp modeling, floor pedalboard versatility, and recording capability.',
    image: 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ret-10',
    sku: 'STAGE-PAR-BEAM350',
    name: 'Techno Core Beam 350W Moving Head Stage Light',
    brand: 'Techno Core Pro',
    category: 'Stage Lighting',
    price: 28500,
    stockStatus: 'In Stock',
    rating: 4.9,
    specs: ['350W Discharge Lamp Source', '0° - 3.8° Ultra-Tight Beam Angle', '14 Colors + Open & Rainbow Effect', '17 Static Gobos + Shake'],
    description: 'High-output beam moving head fixture designed for outdoor festivals, concerts, and dynamic stage light shows.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_RENTAL_SERVICES: RentalService[] = [
  {
    id: 'rent-1',
    name: 'Outdoor P3.91 High-Brightness LED Video Wall Screen',
    category: 'LED Video Walls',
    dayRate: 25000,
    eventRate: 45000,
    specs: ['P3.91 Outdoor Waterproof IP65 Modules', '5,500 nits Daytime High-Brightness Output', 'Novastar Video Processor & Seamless Switcher', 'Custom Aluminum Staging Rigging / Ground Support'],
    description: 'High-impact LED video screens for outdoor concerts, weddings, and corporate summits. Crystal clear even in direct sunlight.',
    inclusions: ['4m x 3m (or custom dimension) LED Display', 'Novastar VX600 Video Processor', 'On-site Video Operator & Technician Team', 'Heavy-Duty Ground Support Frame'],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    warehouseStock: 8,
    availableUnits: 6,
    availabilityStatus: 'Available'
  },
  {
    id: 'rent-2',
    name: 'Concert Line Array & Subwoofer Pro Audio Package',
    category: 'Pro Audio & Speakers',
    dayRate: 35000,
    eventRate: 65000,
    specs: ['8x Dual 10" Line Array Tops', '4x Dual 18" 4000W Subwoofers', 'Digital Wireless Mic Rack (Shure ULXD/SLXD)', '32-Channel Digital Mixing Console (Behringer X32 / Midas)'],
    description: 'Tour-grade sound reinforcement for arenas, festival grounds, and grand ballrooms. Delivers uniform audio dispersion and chest-thumping bass.',
    inclusions: ['Line Array Towers & Rigging Hardware', 'FOH Digital Mixing Station', 'Stage Monitor Wedge System (4x W3)', 'Lead Sound Engineer & Stage Crew'],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    warehouseStock: 5,
    availableUnits: 2,
    availabilityStatus: 'Low Stock'
  },
  {
    id: 'rent-3',
    name: 'Intelligent Stage Lighting & Beam FX Rig',
    category: 'Stage Lighting',
    dayRate: 18000,
    eventRate: 32000,
    specs: ['8x 350W Beam Moving Heads', '12x 18x18W RGBWA+UV Waterproof Par Cans', '2x Heavy Fog / Low Smoke Generators', 'MA Lighting DMX Control Console'],
    description: 'Dynamic light show design tailored to your event mood, from soft romantic wedding wash to energetic festival strobe beams.',
    inclusions: ['DMX Lighting Console & Operator', 'Cabling & Distribution Boxes', 'Lighting Truss Towers', 'Hazermachine / Atmospheric Smoke'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    warehouseStock: 10,
    availableUnits: 7,
    availabilityStatus: 'Available'
  },
  {
    id: 'rent-4',
    name: 'Air-Conditioned Mega Tent & Fabricated Canopy Structure',
    category: 'Tents & Canopies',
    dayRate: 45000,
    eventRate: 85000,
    specs: ['Aluminum Structure Clear-Span Mega Tent (15m x 30m)', 'Heavy-Duty Waterproof Flame-Retardant PVC Tarpaulin', 'Includes 10x 5HP Floor Standing Air Conditioning Units', 'White Ceiling Draping & Fairy Light Accents'],
    description: 'Luxury outdoor venue tent solutions for grand weddings and VIP summits. Completely weatherproof and climate-controlled.',
    inclusions: ['15m x 30m Mega Tent Structure', '50HP Total Aircon Cooling System', 'Fabric Draping & Decorative Lighting', 'Installation & Teardown Crew'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    warehouseStock: 4,
    availableUnits: 1,
    availabilityStatus: 'High Demand'
  },
  {
    id: 'rent-5',
    name: 'Soundproof Silent Diesel Generator Set (100 kVA)',
    category: 'Generators & Power',
    dayRate: 15000,
    eventRate: 28000,
    specs: ['100 kVA Prime Power Output (3-Phase 220V/380V)', 'Soundproof Enclosure (<68dB at 7 meters)', 'Heavy Power Distribution Box & Cam-Lock Feeder Cables', 'Includes Standby Fuel and Licensed Generator Technician'],
    description: 'Guaranteed uninterrupted power supply for outdoor events, LED walls, aircon tents, and live broadcasting.',
    inclusions: ['100 kVA Genset Unit', 'Power Distribution Panel & 100m Heavy Cables', 'Fuel supply for up to 8 hours operation', 'Dedicated Genset Operator'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    warehouseStock: 6,
    availableUnits: 5,
    availabilityStatus: 'Available'
  },
  {
    id: 'rent-6',
    name: 'Modular Aluminum Stage & Heavy-Duty Roof Trussing',
    category: 'Stage & Trussing',
    dayRate: 16000,
    eventRate: 30000,
    specs: ['12m x 8m Aluminum Stage Platform with Anti-Slip Flooring', 'Height Adjustable from 3ft to 5ft', 'Heavy Aluminum Spigot Goalpost / Box Truss System', 'Safety Stairs & Black Stage Skirting'],
    description: 'Sturdy, certified modular stage system capable of holding full bands, dance troupes, and heavy gear safely.',
    inclusions: ['12m x 8m Modular Stage Platforms', 'Roof Truss & Rigging Towers', 'Stage Skirting & Stairs', 'Setup Crew'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    warehouseStock: 8,
    availableUnits: 4,
    availabilityStatus: 'Available'
  },
  {
    id: 'rent-7',
    name: 'VIP Portable Restrooms (Portalets) & Steel Crowd Barricades',
    category: 'Portalets & Railings',
    dayRate: 9500,
    eventRate: 18000,
    specs: ['Air-Conditioned VIP Trailer Portalet with Flushing Toilet & Sink', '100m Heavy Interlocking Steel Crowd Control Barricades', 'Sanitary Waste Tank & Eco Disinfectant'],
    description: 'Essential event sanitation and crowd control management for large public gatherings and outdoor luxury events.',
    inclusions: ['2-Cubicle VIP Aircon Portalet Unit', '20x Interlocking Steel Barricade Sections', 'On-site Sanitization Attendant'],
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
    warehouseStock: 12,
    availableUnits: 9,
    availabilityStatus: 'Available'
  },
  {
    id: 'rent-8',
    name: 'Multi-Camera Video Production & Live Streaming Rig',
    category: 'Video & Live Stream',
    dayRate: 22000,
    eventRate: 40000,
    specs: ['4x Sony FX3 / FX6 4K Broadcast Cameras', 'Blackmagic ATEM Mini Extreme ISO Switcher', 'Starlink Satellite High-Speed Internet Backup', 'Wireless Video Transmission Systems (Hollyland Mars 400S)'],
    description: 'Broadcast-quality multi-camera video production for live screen IMAG feeding, Facebook/YouTube live streaming, and event recording.',
    inclusions: ['4x Camera Operators + Video Director', 'Live Switcher Console & Recording', 'Wireless Video Links to LED Wall', 'Raw 4K Footage Delivery'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
    warehouseStock: 3,
    availableUnits: 1,
    availabilityStatus: 'Low Stock'
  }
];

export const INITIAL_EVENT_PACKAGES: EventPackage[] = [
  {
    id: 'pkg-wedding',
    title: 'Grand Wedding Production Package',
    tag: 'MOST POPULAR',
    subtitle: 'Comprehensive audio, intelligent lighting, P3.91 LED screen, and fairy light ambiance for your dream wedding reception in Davao.',
    price: 68000,
    idealFor: 'Weddings & Debut Celebrations',
    guestCapacity: '150 to 300 Guests',
    inclusions: [
      '3m x 4m Outdoor/Indoor P3.91 LED Wall',
      'High-End QSC / Line Array Acoustic Sound System',
      '4x Shure Digital Wireless Microphones',
      'Intelligent Stage Lighting & Ambient Warm Uplights',
      'Low Fog Dry Ice Machine for First Dance',
      'FOH Sound & Lighting Engineers + Crew'
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    badge: 'Best Value'
  },
  {
    id: 'pkg-corporate',
    title: 'Corporate Summit & Gala Package',
    tag: 'EXECUTIVE CHOICE',
    subtitle: 'Flawless speech clarity, dual LED screens, broadcast video production, and presentation audio for conventions & awards nights.',
    price: 95000,
    idealFor: 'Conventions, Product Launches & Galas',
    guestCapacity: '300 to 800 Guests',
    inclusions: [
      'Dual 3m x 5m High-Resolution LED Video Walls',
      'Concert Line Array System with Delay Speakers',
      '8x Wireless Lapel & Handheld Microphones',
      'Multi-Camera Live IMAG Feed to LED Screen',
      'Intelligent Lighting & Podium Spotlights',
      'Dedicated Technical Director & Crew'
    ],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pkg-concert',
    title: 'Concert & Festival Mega Production',
    tag: 'FULL STAGE RIG',
    subtitle: 'Tour-grade stadium line array, moving head beam show, 12m x 8m aluminum roof stage, and 100 kVA silent generator power.',
    price: 185000,
    idealFor: 'Major Live Concerts, Music Festivals & Fiestas',
    guestCapacity: '1,000+ Attendees',
    inclusions: [
      'Full Line Array Speaker Rig + 8x Subwoofers',
      '6m x 4m Central LED Wall + Side Screens',
      '16x Moving Head Beam Lights & Atomic Strobes',
      '12m x 8m Modular Stage with Roof Truss System',
      '100 kVA Soundproof Silent Diesel Genset',
      'Complete Backline Gear (Roland, Sonor, Boss, Laney)'
    ],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    badge: 'Pro Tier'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Kadayawan Festival Main Stage Production',
    eventType: 'Festival',
    location: 'Rizal Park, Davao City',
    date: 'August 2025',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Full concert line array, 8m x 4m LED video wall, beam light show, and mega staging for Kadayawan street dance competition.',
    tags: ['Line Array', 'LED Wall', 'Stage Truss', 'Davao City']
  },
  {
    id: 'gal-2',
    title: 'Luxury Beach Wedding Setup',
    eventType: 'Wedding',
    location: 'Pearl Farm Beach Resort, Samal Island',
    date: 'December 2025',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Aircon Mega Tent, warm mood lighting, low-smoke dance floor effect, and acoustic QSC sound system for 250 wedding guests.',
    tags: ['Aircon Tent', 'QSC Sound', 'Wedding', 'Samal']
  },
  {
    id: 'gal-3',
    title: 'Mindanao Trade Summit & Gala Awards',
    eventType: 'Corporate',
    location: 'SMX Convention Center Davao',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Dual LED screens, multi-camera live switching, podium audio, and stage lighting for 600 regional business delegates.',
    tags: ['SMX Davao', 'Corporate', 'Dual LED Wall', 'Live Streaming']
  },
  {
    id: 'gal-4',
    title: 'Eden Nature Park Outdoor Sunset Concert',
    eventType: 'Concert',
    location: 'Eden Nature Park & Resort, Toril, Davao',
    date: 'April 2026',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800'
    ],
    description: '100 kVA quiet diesel generator set, mountain stage trussing, and Roland/Shure backline system for live band performances.',
    tags: ['Generator Set', 'Live Band', 'Eden Toril', 'Stage Lighting']
  }
];

export const INITIAL_CMS: CMSData = {
  operatingHours: {
    weekdays: '8:00 AM - 6:00 PM',
    saturday: '8:30 AM - 5:30 PM',
    sunday: '10:00 AM - 4:00 PM (Showroom & Rental Hotline Open 24/7)'
  },
  phoneNumbers: {
    globe: '+63 917 555 8324',
    smart: '+63 998 888 7324',
    landline: '(082) 224-8899'
  },
  address: {
    building: 'J. Marketing Building',
    street: 'Corner Ilustre & General Luna St.',
    city: 'Davao City',
    province: 'Davao del Sur, 8000',
    fullAddress: 'J. Marketing Building, corner Ilustre & General Luna St., Davao City, Philippines'
  },
  facebookFollowers: '49,500+',
  announcementBanner: {
    enabled: true,
    text: '⚡ Kadayawan & Season Specials: Get 15% OFF on LED Wall + Sound Rental Bundles in Davao City!',
    linkText: 'Claim Special Quote'
  },
  seo: {
    metaTitle: 'Techno Core Davao | Pro Sound, Stage Lighting, LED Wall Rental & Music Store',
    metaDescription: 'Davao City’s top choice for musical instruments retail and complete event production: LED walls, line array sound, stage trusses, mega tents, generators.',
    keywords: ['event lights and sound Davao', 'LED wall rental Davao', 'tent rental Davao City', 'musical instrument store Davao', 'buy sound system Davao']
  }
};

export const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'book-101',
    type: 'rental',
    customerName: 'Maria Santos',
    email: 'maria.santos@gmail.com',
    phone: '0917-123-4567',
    eventDate: '2026-08-15',
    eventType: 'Wedding Reception',
    venueLocation: 'Eden Nature Park, Toril, Davao City',
    guestCount: '200 Guests',
    selectedItems: [
      { id: 'pkg-wedding', name: 'Grand Wedding Production Package', type: 'package', price: 68000, quantity: 1 }
    ],
    totalEstimatedPrice: 68000,
    budgetRange: '₱60,000 - ₱80,000',
    notes: 'Need aircon mega tent addition quote as well if rain occurs.',
    status: 'reviewed',
    createdAt: '2026-07-28T14:30:00.000Z'
  },
  {
    id: 'book-102',
    type: 'retail',
    customerName: 'Davao Praise Church Ministry',
    email: 'worship@davaopraise.org',
    phone: '0998-765-4321',
    eventDate: 'N/A',
    eventType: 'Church Gear Purchase',
    venueLocation: 'Bajada, Davao City',
    guestCount: 'N/A',
    selectedItems: [
      { id: 'ret-1', name: 'QSC K12.2 Powered Loudspeaker (2000W)', type: 'retail', price: 68500, quantity: 2 },
      { id: 'ret-2', name: 'Shure SLXD24/SM58 Digital Wireless Microphone System', type: 'retail', price: 44500, quantity: 1 }
    ],
    totalEstimatedPrice: 181500,
    budgetRange: '₱180,000+',
    notes: 'Inquiring about store pickup at Ilustre branch and warranty support.',
    status: 'pending',
    createdAt: '2026-07-30T09:15:00.000Z'
  }
];

export const INITIAL_CALENDAR_EVENTS: BookedDateBlock[] = [
  {
    id: 'cal-101',
    date: '2026-08-15',
    title: 'Kadayawan Festival Grand Tech & Sound Stage',
    type: 'Festival',
    location: 'Rizal Park & San Pedro St, Davao City',
    status: 'fully-booked',
    notes: 'Full line array sound system, 10m x 6m P3.91 LED Video Wall & 100 kVA generator deployment.',
    serviceIds: ['rent-led-wall', 'rent-line-array', 'rent-generator-100kva'],
    bookingId: 'book-101'
  },
  {
    id: 'cal-102',
    date: '2026-08-22',
    title: 'SMX Corporate Tech Convention & Gala',
    type: 'Corporate',
    location: 'SMX Convention Center, Lanang, Davao City',
    status: 'partially-booked',
    notes: 'Pro Wireless Mics, Stage Lighting & Indoor P2.5 LED Display Wall.',
    serviceIds: ['rent-led-wall', 'rent-lighting-movinghead']
  },
  {
    id: 'cal-103',
    date: '2026-08-28',
    title: 'Mindanao Indie Rock Concert Night',
    type: 'Concert',
    location: 'Matina Town Square (MTS), Davao City',
    status: 'fully-booked',
    notes: 'Full band backline kit, Marshall/Ampeg amplifiers & pro stage trussing.',
    serviceIds: ['rent-line-array', 'rent-stage-truss']
  },
  {
    id: 'cal-104',
    date: '2026-09-05',
    title: 'Samal Island Beach Wedding Production',
    type: 'Wedding',
    location: 'Pearl Farm Beach Resort, Samal Island',
    status: 'partially-booked',
    notes: 'Acoustic PA setup & mood lighting. Requires boat transport logistics.',
    serviceIds: ['rent-lighting-movinghead']
  }
];

