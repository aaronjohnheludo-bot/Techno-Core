import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  INITIAL_RETAIL_PRODUCTS,
  INITIAL_RENTAL_SERVICES,
  INITIAL_EVENT_PACKAGES,
  INITIAL_GALLERY,
  INITIAL_CMS,
  INITIAL_BOOKINGS,
  INITIAL_CALENDAR_EVENTS
} from './src/data/initialData';
import { RetailProduct, RentalService, EventPackage, GalleryItem, CMSData, BookingRequest, BookedDateBlock } from './src/types';
import { sendQuoteConfirmationEmails, sendLowStockAlertEmail } from './server/emailService';

const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'data', 'store.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// In-memory + persistent store
interface Store {
  adminPassword?: string;
  retailProducts: RetailProduct[];
  rentalServices: RentalService[];
  eventPackages: EventPackage[];
  gallery: GalleryItem[];
  cms: CMSData;
  bookings: BookingRequest[];
  calendarEvents: BookedDateBlock[];
}

let db: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  let dbId = "ai-studio-technocore-ae7cbc4b-7f72-4fac-9e05-2a24e7745eaa";
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (cfg.firestoreDatabaseId) dbId = cfg.firestoreDatabaseId;
    } catch {}
  }
  const adminApp = initializeApp({ credential: applicationDefault() });
  db = getFirestore(adminApp, dbId);
  console.log(`Firebase Admin initialized successfully with database: ${dbId}`);
} catch (e) {
  console.log("Firebase Admin Init skipped or unavailable (using local file store).");
}

async function loadStoreAsync(): Promise<Store> {
  const defaultStore = {
    adminPassword: 'admin123',
    retailProducts: INITIAL_RETAIL_PRODUCTS,
    rentalServices: INITIAL_RENTAL_SERVICES,
    eventPackages: INITIAL_EVENT_PACKAGES,
    gallery: INITIAL_GALLERY,
    cms: INITIAL_CMS,
    bookings: INITIAL_BOOKINGS,
    calendarEvents: INITIAL_CALENDAR_EVENTS
  };

  try {
    if (db) {
      const doc = await db.collection('technocore_state').doc('main_store').get();
      if (doc.exists) {
        console.log("Loaded store from Firebase Firestore.");
        const data = doc.data() as Store;
        if (!data.adminPassword) data.adminPassword = 'admin123';
        if (!data.calendarEvents || !Array.isArray(data.calendarEvents) || data.calendarEvents.length === 0) {
          data.calendarEvents = INITIAL_CALENDAR_EVENTS;
        }
        return { ...defaultStore, ...data };
      }
    }
  } catch (err: any) {
    console.log('Firestore notice: Using local JSON store fallback (Firestore unavailable or permission restricted).');
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const loaded = JSON.parse(raw);
      if (!loaded.adminPassword) loaded.adminPassword = 'admin123';
      console.log("Loaded store from local JSON backup.");
      return { ...defaultStore, ...loaded };
    }
  } catch (err) {
    console.error('Failed to read store.json, falling back to initial data', err);
  }

  console.log("Loaded initial default store data.");
  return defaultStore;
}

function saveStore(store: Store) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store.json', err);
  }
  if (db) {
    db.collection('technocore_state').doc('main_store').set(store)
      .catch((err: any) => {});
  }
}

function getInitialStore(): Store {
  return {
    adminPassword: 'admin123',
    retailProducts: INITIAL_RETAIL_PRODUCTS,
    rentalServices: INITIAL_RENTAL_SERVICES,
    eventPackages: INITIAL_EVENT_PACKAGES,
    gallery: INITIAL_GALLERY,
    cms: INITIAL_CMS,
    bookings: INITIAL_BOOKINGS,
    calendarEvents: INITIAL_CALENDAR_EVENTS
  };
}

let store: Store = getInitialStore();

async function startServer() {
  try {
    store = await loadStoreAsync();
  } catch (err) {
    console.error('Error loading store, using defaults:', err);
  }
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client on server side
  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      })
    : null;

  // Ensure upload directory exists and serve static uploads
  const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use('/uploads', express.static(UPLOADS_DIR));

  // DIRECT IMAGE FILE UPLOAD API
  app.post('/api/upload', (req, res) => {
    try {
      const { image, name } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      const matches = image.match(/^data:(image\/[a-zA-Z+-]+);base64,(.+)$/);
      if (!matches) {
        return res.json({ url: image });
      }

      const ext = matches[1].split('/')[1]?.replace('svg+xml', 'svg') || 'png';
      const base64Data = matches[2];
      const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      return res.json({ url: `/uploads/${fileName}` });
    } catch (err: any) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Failed to upload image file' });
    }
  });

  // --- API ROUTES ---

  // Admin Auth verification & password change

  const loginAttempts = new Map();
  app.post('/api/admin/login', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const attempts = loginAttempts.get(ip) || { count: 0, time: Date.now() };
    if (Date.now() - attempts.time > 60000) { attempts.count = 0; attempts.time = Date.now(); }
    if (attempts.count >= 5) {
      return res.status(429).json({ success: false, error: 'Too many attempts. Try again later.' });
    }
    attempts.count++;
    loginAttempts.set(ip, attempts);

    const { password } = req.body;
    const currentPass = store.adminPassword || 'admin123';
    if (password === currentPass) {
      return res.json({ success: true });
    }
    return res.status(401).json({ success: false, error: 'Incorrect admin password' });
  });

  app.post('/api/admin/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const currentPass = store.adminPassword || 'admin123';

    if (currentPassword !== currentPass) {
      return res.status(400).json({ error: 'Current password does not match' });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters long' });
    }

    store.adminPassword = newPassword.trim();
    saveStore(store);
    return res.json({ success: true, message: 'Password updated successfully' });
  });

  // GET full catalog & initial state
  app.get('/api/state', (req, res) => {
    res.json(store);
  });

  // RETAIL PRODUCTS CRUD
  app.post('/api/retail-products', (req, res) => {
    const newProduct: RetailProduct = {
      ...req.body,
      id: req.body.id || `ret-${Date.now()}`
    };
    store.retailProducts.unshift(newProduct);
    saveStore(store);
    res.json(newProduct);
  });

  app.put('/api/retail-products/:id', (req, res) => {
    const { id } = req.params;
    const index = store.retailProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      store.retailProducts[index] = { ...store.retailProducts[index], ...req.body };
      saveStore(store);
      res.json(store.retailProducts[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.delete('/api/retail-products/:id', (req, res) => {
    const { id } = req.params;
    store.retailProducts = store.retailProducts.filter((p) => p.id !== id);
    saveStore(store);
    res.json({ success: true });
  });

  // GET CATALOG ROUTES
  app.get('/api/retail-products', (req, res) => {
    res.json(store.retailProducts);
  });

  app.get('/api/rental-services', (req, res) => {
    res.json(store.rentalServices);
  });

  app.get('/api/event-packages', (req, res) => {
    res.json(store.eventPackages);
  });

  app.get('/api/gallery', (req, res) => {
    res.json(store.gallery);
  });

  app.get('/api/cms', (req, res) => {
    res.json(store.cms);
  });

  // LIVE RENTAL WAREHOUSE AVAILABILITY API
  app.get('/api/rental-availability', (req, res) => {
    try {
      const availabilityMap: Record<string, any> = {};
      const services = store.rentalServices || [];
      const bookings = store.bookings || [];

      services.forEach((service) => {
        const activeBookingsCount = bookings.filter((b) => {
          if (b.status === 'cancelled') return false;
          if (!b.selectedItems) return false;
          return b.selectedItems.some((item) =>
            (item.name && item.name.toLowerCase().includes(service.name.toLowerCase().slice(0, 15))) ||
            item.id === service.id
          );
        }).length;

        const totalStock = service.warehouseStock ?? 8;
        const availableUnits = Math.max(0, (service.availableUnits ?? totalStock) - activeBookingsCount);
        
        let status: 'Available' | 'Low Stock' | 'Reserved Today' | 'High Demand' = 'Available';
        if (availableUnits === 0) {
          status = 'Reserved Today';
        } else if (availableUnits <= 2) {
          status = 'Low Stock';
        } else if (activeBookingsCount >= 2 || service.isPopular) {
          status = 'High Demand';
        }

        availabilityMap[service.id] = {
          serviceId: service.id,
          serviceName: service.name,
          totalStock,
          availableUnits,
          activeBookingsCount,
          status,
          lastUpdated: new Date().toISOString()
        };
      });

      res.json(availabilityMap);
    } catch (err) {
      console.error('Error fetching rental availability:', err);
      res.json({});
    }
  });

  // RENTAL SERVICES CRUD
  app.post('/api/rental-services', (req, res) => {
    const newService: RentalService = {
      ...req.body,
      id: req.body.id || `rent-${Date.now()}`
    };
    store.rentalServices.unshift(newService);
    saveStore(store);
    res.json(newService);
  });

  app.put('/api/rental-services/:id', (req, res) => {
    const { id } = req.params;
    const index = store.rentalServices.findIndex((s) => s.id === id);
    if (index !== -1) {
      store.rentalServices[index] = { ...store.rentalServices[index], ...req.body };
      saveStore(store);
      res.json(store.rentalServices[index]);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  });

  app.delete('/api/rental-services/:id', (req, res) => {
    const { id } = req.params;
    store.rentalServices = store.rentalServices.filter((s) => s.id !== id);
    saveStore(store);
    res.json({ success: true });
  });

  // BOOKINGS / INQUIRIES
  app.get('/api/bookings', (req, res) => {
    res.json(store.bookings);
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const newBooking: BookingRequest = {
        ...req.body,
        id: `book-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Dispatch confirmation email to both admin and customer
      const emailStatus = await sendQuoteConfirmationEmails(newBooking);
      newBooking.emailStatus = emailStatus;

      store.bookings.unshift(newBooking);
      saveStore(store);

      // --- LOW STOCK NOTIFICATION LOGIC ---
      try {
        const criticalItems: { name: string, stock: number, activeQuotes: number }[] = [];
        
        // Check only items requested in this booking
        newBooking.selectedItems?.forEach(selectedItem => {
          if (selectedItem.type === 'rental') {
            const service = store.rentalServices.find(s => s.id === selectedItem.id);
            if (service) {
              const activeBookingsCount = store.bookings.filter(b => {
                if (b.status === 'cancelled') return false;
                if (!b.selectedItems) return false;
                return b.selectedItems.some((item: any) => 
                  item.id === service.id || item.name.toLowerCase().includes(service.name.toLowerCase().slice(0, 15))
                );
              }).length;
              
              const totalStock = service.warehouseStock ?? 8;
              const availableUnits = Math.max(0, (service.availableUnits ?? totalStock) - activeBookingsCount);
              
              // If available is low (<= 2) AND demand is high (>= 2 active quotes)
              if (availableUnits <= 2 && activeBookingsCount >= 2) {
                criticalItems.push({
                  name: service.name,
                  stock: availableUnits,
                  activeQuotes: activeBookingsCount
                });
              }
            }
          } else if (selectedItem.type === 'retail') {
            const product = store.retailProducts.find(p => p.id === selectedItem.id);
            if (product && product.stockStatus === 'Low Stock') {
              const activeBookingsCount = store.bookings.filter(b => {
                if (b.status === 'cancelled') return false;
                if (!b.selectedItems) return false;
                return b.selectedItems.some((item: any) => item.id === product.id);
              }).length;
              
              if (activeBookingsCount >= 2) {
                criticalItems.push({
                  name: product.name,
                  stock: 1, // Placeholder since retail stock isn't numerical
                  activeQuotes: activeBookingsCount
                });
              }
            }
          }
        });

        // Deduplicate critical items
        const uniqueCriticalItems = Array.from(new Map(criticalItems.map(item => [item.name, item])).values());

        if (uniqueCriticalItems.length > 0) {
          await sendLowStockAlertEmail(uniqueCriticalItems);
        }
      } catch (err) {
        console.error('Failed to process low stock alerts:', err);
      }
      // --- END LOW STOCK NOTIFICATION LOGIC ---

      res.json(newBooking);
    } catch (err: any) {
      console.error('Error in /api/bookings:', err);
      res.status(500).json({ error: 'Failed to process booking quote request.' });
    }
  });

  app.post('/api/bookings/:id/resend-email', async (req, res) => {
    const { id } = req.params;
    const booking = store.bookings.find((b) => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    try {
      const emailStatus = await sendQuoteConfirmationEmails(booking);
      booking.emailStatus = emailStatus;
      saveStore(store);
      res.json({ success: true, emailStatus, booking });
    } catch (err: any) {
      console.error(`Error resending email for ${id}:`, err);
      res.status(500).json({ error: err.message || 'Failed to resend confirmation email.' });
    }
  });

  app.put('/api/bookings/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, sendEmail, emailMessage } = req.body;
    const booking = store.bookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      saveStore(store);

      if (sendEmail) {
        try {
          const { sendStatusUpdateEmail } = require('./server/emailService');
          await sendStatusUpdateEmail(booking, status, emailMessage);
        } catch (emailErr) {
          console.error("Failed to send status update email:", emailErr);
        }
      }

      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  });

  // Public endpoint to track order by ID
  app.get('/api/bookings/track/:id', (req, res) => {
    const { id } = req.params;
    // We only return safe, public fields to protect PII
    const booking = store.bookings.find((b) => b.id === id || b.id === id.toUpperCase());
    
    if (booking) {
      const publicBookingData = {
        id: booking.id,
        type: booking.type,
        status: booking.status,
        selectedItems: booking.selectedItems,
        totalEstimatedPrice: booking.totalEstimatedPrice,
        createdAt: booking.createdAt,
        eventDate: booking.eventDate
      };
      res.json(publicBookingData);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  });

  // --- EVENT CALENDAR & AVAILABILITY API ROUTES ---

  // Get all calendar events & booked date blocks (merged with customer quote bookings)
  app.get('/api/calendar/events', (req, res) => {
    const explicitEvents = store.calendarEvents || [];
    const validTypes: BookedDateBlock['type'][] = ['Festival', 'Corporate', 'Concert', 'Wedding', 'Private Event', 'Maintenance', 'Rental Setup'];
    
    // Map active customer bookings with an event date into calendar event blocks
    const customerBookingEvents: BookedDateBlock[] = store.bookings
      .filter((b) => b.status !== 'cancelled' && b.eventDate)
      .map((b) => {
        const cleanDate = b.eventDate!.split('T')[0];
        const isConfirmed = b.status === 'confirmed' || b.status === 'completed';
        const evType: BookedDateBlock['type'] = validTypes.includes(b.eventType as any)
          ? (b.eventType as BookedDateBlock['type'])
          : 'Rental Setup';

        return {
          id: `booking-ev-${b.id}`,
          title: `${evType} (${b.customerName || 'Inquiry'})`,
          date: cleanDate,
          status: isConfirmed ? 'fully-booked' : 'partially-booked',
          type: evType,
          location: b.venueLocation || 'Davao City',
          notes: `Quote Reference #${b.id} • Status: ${b.status.toUpperCase()} • ${b.guestCount || ''}`
        };
      });

    // Merge explicit events and customer bookings
    const combined = [...explicitEvents];
    customerBookingEvents.forEach((cEv) => {
      // Avoid duplicates if matching ID exists
      if (!combined.some((e) => e.id === cEv.id)) {
        combined.push(cEv);
      }
    });

    res.json(combined);
  });

  // Real-time Availability & Conflict Checker API
  app.post('/api/calendar/check-availability', (req, res) => {
    try {
      const { date, serviceIds } = req.body;
      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required (YYYY-MM-DD)' });
      }

      // Format target date string safely without timezone offset shifts
      const targetDateStr = String(date).split('T')[0];

      // Find explicit calendar event blocks on this date
      const eventsOnDate = (store.calendarEvents || []).filter(e => e.date === targetDateStr);
      const isExplicitlyFullyBooked = eventsOnDate.some(e => e.status === 'fully-booked');

      // Find customer bookings on this date
      const bookingsOnDate = store.bookings.filter(b => {
        if (b.status === 'cancelled') return false;
        if (!b.eventDate) return false;
        return b.eventDate.includes(targetDateStr);
      });

      const totalBookingsOnDate = bookingsOnDate.length + eventsOnDate.length;

      // Analyze equipment conflicts across requested or all rental services
      const conflicts: string[] = [];
      const serviceAvailabilityDetails: Record<string, { serviceName: string; totalStock: number; unitsBooked: number; unitsAvailable: number }> = {};

      const targetServices = (serviceIds && serviceIds.length > 0)
        ? store.rentalServices.filter(s => serviceIds.includes(s.id))
        : store.rentalServices;

      targetServices.forEach(service => {
        const totalStock = service.warehouseStock ?? 8;
        
        // Count units requested in active bookings on this date
        let unitsBooked = 0;
        bookingsOnDate.forEach(b => {
          b.selectedItems?.forEach(item => {
            if (item.id === service.id || item.name.toLowerCase().includes(service.name.toLowerCase().slice(0, 15))) {
              unitsBooked += (item.quantity || 1);
            }
          });
        });

        // Also check if explicit event blocks use this service
        eventsOnDate.forEach(e => {
          if (e.serviceIds && e.serviceIds.includes(service.id)) {
            unitsBooked += 1;
          }
        });

        const unitsAvailable = Math.max(0, totalStock - unitsBooked);
        serviceAvailabilityDetails[service.id] = {
          serviceName: service.name,
          totalStock,
          unitsBooked,
          unitsAvailable
        };

        if (unitsBooked >= totalStock) {
          conflicts.push(`Warehouse stock for '${service.name}' is fully reserved on ${targetDateStr} (${unitsBooked}/${totalStock} units booked).`);
        }
      });

      if (isExplicitlyFullyBooked) {
        conflicts.push(`Date ${targetDateStr} is explicitly marked as FULLY BOOKED by Admin Production Schedule.`);
      }

      // Determine date status
      let overallStatus: 'fully-booked' | 'partially-booked' | 'available' = 'available';
      if (isExplicitlyFullyBooked || conflicts.length > 0) {
        overallStatus = 'fully-booked';
      } else if (totalBookingsOnDate > 0 || Object.values(serviceAvailabilityDetails).some(d => d.unitsAvailable <= 2)) {
        overallStatus = 'partially-booked';
      }

      const availableServices = store.rentalServices
        .filter(s => {
          const detail = serviceAvailabilityDetails[s.id];
          return !detail || detail.unitsAvailable > 0;
        })
        .map(s => s.name);

      return res.json({
        date: targetDateStr,
        status: overallStatus,
        conflicts,
        totalBookingsOnDate,
        eventsOnDate,
        availableServices,
        serviceAvailabilityDetails
      });
    } catch (err: any) {
      console.error('Error checking date availability:', err);
      return res.status(500).json({ error: 'Failed to perform availability check' });
    }
  });

  // Admin API: Create / Mark Date Block
  app.post('/api/calendar/events', (req, res) => {
    try {
      const { date, title, type, location, status, notes, serviceIds, bookingId, forceOverride } = req.body;
      if (!date || !title) {
        return res.status(400).json({ error: 'Date and Title are required' });
      }

      const formattedDate = new Date(date).toISOString().split('T')[0];

      // Perform conflict check
      const conflicts: string[] = [];
      const existingEventsOnDate = (store.calendarEvents || []).filter(e => e.date === formattedDate);
      const existingBookingsOnDate = store.bookings.filter(b => b.eventDate?.includes(formattedDate) && b.status !== 'cancelled');

      if (existingEventsOnDate.some(e => e.status === 'fully-booked') && status === 'fully-booked') {
        conflicts.push(`Date ${formattedDate} is already marked as fully booked.`);
      }

      if (existingBookingsOnDate.length > 0) {
        conflicts.push(`There are ${existingBookingsOnDate.length} active customer quote requests for ${formattedDate}.`);
      }

      const newEventBlock: BookedDateBlock = {
        id: `cal-${Date.now()}`,
        date: formattedDate,
        title: title.trim(),
        type: type || 'Rental Setup',
        location: location || 'Davao City',
        status: status || 'fully-booked',
        notes: notes || '',
        serviceIds: serviceIds || [],
        bookingId: bookingId || undefined,
        createdAt: new Date().toISOString()
      };

      if (!store.calendarEvents) store.calendarEvents = [];
      store.calendarEvents.unshift(newEventBlock);
      saveStore(store);

      return res.json({
        success: true,
        event: newEventBlock,
        conflicts
      });
    } catch (err: any) {
      console.error('Error creating calendar event:', err);
      return res.status(500).json({ error: 'Failed to save calendar date block' });
    }
  });

  // Admin API: Update Calendar Date Block
  app.put('/api/calendar/events/:id', (req, res) => {
    const { id } = req.params;
    if (!store.calendarEvents) store.calendarEvents = [];
    const index = store.calendarEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      store.calendarEvents[index] = { ...store.calendarEvents[index], ...req.body };
      saveStore(store);
      return res.json(store.calendarEvents[index]);
    } else {
      return res.status(404).json({ error: 'Calendar event not found' });
    }
  });

  // Admin API: Delete Calendar Date Block (Reopen Date)
  app.delete('/api/calendar/events/:id', (req, res) => {
    const { id } = req.params;
    if (!store.calendarEvents) store.calendarEvents = [];
    store.calendarEvents = store.calendarEvents.filter(e => e.id !== id);
    saveStore(store);
    return res.json({ success: true, message: 'Date block removed' });
  });


  // GALLERY CRUD
  app.post('/api/gallery', (req, res) => {
    const newItem: GalleryItem = {
      ...req.body,
      id: `gal-${Date.now()}`
    };
    store.gallery.unshift(newItem);
    saveStore(store);
    res.json(newItem);
  });

  app.delete('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    store.gallery = store.gallery.filter((g) => g.id !== id);
    saveStore(store);
    res.json({ success: true });
  });

  // CMS SETTINGS
  app.put('/api/cms', (req, res) => {
    store.cms = { ...store.cms, ...req.body };
    saveStore(store);
    res.json(store.cms);
  });

  // AI RECOMMENDATION & QUOTE GENERATOR (GEMINI API)
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API Key is not configured on the server environment.'
        });
      }

      const { eventType, guestCount, venueLocation, isOutdoor, specialRequests } = req.body;

      const systemInstruction = `You are Senior Lead Event Production Engineer and Sound Director at Techno Core in Davao City, Philippines.
You specialize in designing pro audio, LED video walls, stage lighting, mega aircon tents, and generator power packages for events in Davao City, Samal Island, Bukidnon, General Santos, and Mindanao.
Analyze the user's event inputs and return a tailored JSON response with realistic equipment recommendations, generator sizing (in kVA), tent dimensions, and estimated PHP budget ranges. Be helpful, technical yet accessible, and professional.`;

      const prompt = `Client Request Details:
- Event Type: ${eventType || 'General Event / Celebration'}
- Estimated Guests: ${guestCount || '150-300'}
- Venue & Location: ${venueLocation || 'Davao City Outdoor/Indoor Venue'}
- Venue Setting: ${isOutdoor ? 'Outdoor (Needs Tents/Generators)' : 'Indoor Venue'}
- Special Requirements: ${specialRequests || 'None specified'}

Provide a comprehensive equipment specification and quote recommendation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: 'Executive summary recommendation' },
              recommendedPackages: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Names of recommended Techno Core packages'
              },
              equipmentList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    qty: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['item', 'qty', 'reason']
                }
              },
              recommendedGeneratorKva: { type: Type.STRING, description: 'Recommended generator power e.g. 45 kVA or 100 kVA' },
              recommendedTentSize: { type: Type.STRING, description: 'Recommended tent dimensions e.g. 15m x 20m Aircon Mega Tent' },
              recommendedLedWallSize: { type: Type.STRING, description: 'Recommended LED Wall dimension e.g. 4m x 3m P3.91 Outdoor' },
              estimatedPricePhpRange: { type: Type.STRING, description: 'Estimated total PHP quote range e.g. ₱55,000 - ₱75,000' },
              proTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Crucial logistics pro-tips for Davao City venues'
              }
            },
            required: [
              'summary',
              'recommendedPackages',
              'equipmentList',
              'recommendedGeneratorKva',
              'recommendedTentSize',
              'recommendedLedWallSize',
              'estimatedPricePhpRange',
              'proTips'
            ]
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        
        // Extract Google Search Grounding sources if available
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks && Array.isArray(groundingChunks)) {
          const sources = groundingChunks
            .map((chunk: any) => chunk.web)
            .filter((web: any) => web && web.uri)
            .map((web: any) => ({ uri: web.uri, title: web.title || web.uri }));
          if (sources.length > 0) {
            parsed.groundingSources = sources;
          }
        }

        return res.json(parsed);
      } else {
        throw new Error('Empty response from Gemini');
      }
    } catch (err: any) {
      console.error('AI Recommendation Error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate AI quote recommendation.'
      });
    }
  });

  // Vite Middleware handling for Dev vs Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Techno Core Server running on http://localhost:${PORT}`);
  });
}

startServer();
