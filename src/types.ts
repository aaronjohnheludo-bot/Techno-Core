export interface RetailProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'Guitars & Bass' | 'Pro Audio & Speakers' | 'Mixers & Amps' | 'Microphones' | 'Stage Lighting' | 'Accessories';
  price: number;
  originalPrice?: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Pre-Order' | 'Out of Stock';
  rating: number;
  specs: string[];
  description: string;
  image: string;
  isFeatured?: boolean;
}

export interface RentalService {
  id: string;
  name: string;
  category: 'LED Video Walls' | 'Stage & Trussing' | 'Pro Audio & Speakers' | 'Stage Lighting' | 'Tents & Canopies' | 'Generators & Power' | 'Portalets & Railings' | 'Video & Live Stream' | 'Specialty AV';
  dayRate: number;
  eventRate: number;
  specs: string[];
  description: string;
  inclusions: string[];
  image: string;
  isPopular?: boolean;
  warehouseStock?: number;
  availableUnits?: number;
  availabilityStatus?: 'Available' | 'Low Stock' | 'Reserved Today' | 'High Demand';
  nextAvailableDate?: string;
}

export interface RentalAvailabilityItem {
  serviceId: string;
  serviceName: string;
  totalStock: number;
  availableUnits: number;
  activeBookingsCount: number;
  status: 'Available' | 'Low Stock' | 'Reserved Today' | 'High Demand';
  lastUpdated: string;
}

export interface EventPackage {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  price: number;
  idealFor: string;
  guestCapacity: string;
  inclusions: string[];
  image: string;
  badge?: string;
}

export type BookingStatus = 'pending' | 'reviewed' | 'confirmed' | 'completed' | 'cancelled';
export type InquiryType = 'rental' | 'retail' | 'custom';

export interface EmailStatus {
  customerEmailSent: boolean;
  adminEmailSent: boolean;
  dispatchedAt: string;
  recipientEmails: string[];
  details?: string;
}

export interface BookingRequest {
  id: string;
  type: InquiryType;
  customerName: string;
  email: string;
  phone: string;
  eventDate?: string;
  eventType?: string;
  venueLocation?: string;
  guestCount?: string;
  selectedItems: {
    id: string;
    name: string;
    type: 'retail' | 'rental' | 'package';
    price: number;
    quantity: number;
  }[];
  totalEstimatedPrice: number;
  budgetRange?: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  emailStatus?: EmailStatus;
}

export interface GalleryItem {
  id: string;
  title: string;
  eventType: 'Concert' | 'Wedding' | 'Corporate' | 'Festival' | 'Private Event';
  location: string;
  date: string;
  image: string;
  images?: string[];
  description: string;
  tags: string[];
}

export interface CMSData {
  operatingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  phoneNumbers: {
    globe: string;
    smart: string;
    landline: string;
  };
  address: {
    building: string;
    street: string;
    city: string;
    province: string;
    fullAddress: string;
  };
  facebookFollowers: string;
  announcementBanner: {
    enabled: boolean;
    text: string;
    linkText?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AiQuoteRecommendation {
  summary: string;
  recommendedPackages: string[];
  equipmentList: {
    item: string;
    qty: string;
    reason: string;
  }[];
  recommendedGeneratorKva: string;
  recommendedTentSize: string;
  recommendedLedWallSize: string;
  estimatedPricePhpRange: string;
  proTips: string[];
  groundingSources?: GroundingSource[];
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  testimonial: string;
  createdAt: string;
}

export interface BookedDateBlock {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'Festival' | 'Corporate' | 'Concert' | 'Wedding' | 'Private Event' | 'Maintenance' | 'Rental Setup';
  location?: string;
  status: 'fully-booked' | 'partially-booked' | 'available';
  notes?: string;
  serviceIds?: string[];
  bookingId?: string;
  createdAt?: string;
}

export interface CalendarAvailabilityCheck {
  date: string;
  status: 'fully-booked' | 'partially-booked' | 'available';
  conflicts: string[];
  totalBookingsOnDate: number;
  eventsOnDate: BookedDateBlock[];
  availableServices: string[];
}

