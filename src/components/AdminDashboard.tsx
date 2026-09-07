import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShoppingBag,
  Calendar,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  Clock,
  Search,
  RefreshCw,
  ShieldCheck,
  Eye,
  FileText,
  Mail,
  Send,
  Loader2,
  Lock,
  KeyRound,
  LogOut,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  GripVertical,
  Pin,
  PinOff,
  ArrowUp,
  ArrowDown,
  DollarSign,
  BarChart3,
  RotateCcw,
  EyeOff,
  SlidersHorizontal,
  Sparkles,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import {
  RetailProduct,
  RentalService,
  EventPackage,
  GalleryItem,
  CMSData,
  BookingRequest,
  BookingStatus
} from '../types';
import { ImageUploadInput } from './ImageUploadInput';
import { AdminAnalyticsCharts } from './AdminAnalyticsCharts';
import { AdminCalendarView } from './AdminCalendarView';
import { TechnoCoreLogo } from './TechnoCoreLogo';

interface AdminDashboardProps {
  retailProducts: RetailProduct[];
  rentalServices: RentalService[];
  eventPackages: EventPackage[];
  gallery: GalleryItem[];
  cms: CMSData;
  bookings: BookingRequest[];
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  retailProducts,
  rentalServices,
  eventPackages,
  gallery,
  cms,
  bookings,
  onRefreshData,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'calendar' | 'retail' | 'rentals' | 'gallery' | 'cms'>('overview');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Search state for all sections
  const [bookingSearch, setBookingSearch] = useState('');
  const [retailSearch, setRetailSearch] = useState('');
  const [rentalSearch, setRentalSearch] = useState('');
  const [gallerySearch, setGallerySearch] = useState('');
  const [showBookingsAnalytics, setShowBookingsAnalytics] = useState(false);

  // Modular Dashboard Widgets State
  const DEFAULT_WIDGETS_CONFIG = [
    {
      id: 'quick_summary',
      title: 'Quick Revenue Summary',
      description: 'Pipeline value, pending quotes, and inventory valuation',
      pinned: true,
      visible: true,
      colSpan: 'lg:col-span-12'
    },
    {
      id: 'analytics_charts',
      title: 'Booking Trends & Revenue Analytics',
      description: 'Interactive Recharts visualization of daily booking volume and cumulative revenue growth',
      pinned: true,
      visible: true,
      colSpan: 'lg:col-span-12'
    },
    {
      id: 'system_alerts',
      title: 'System Alerts & Hotlines',
      description: 'Pending quote alerts, CMS phone status, and inventory health',
      pinned: false,
      visible: true,
      colSpan: 'lg:col-span-12'
    },
    {
      id: 'recent_bookings',
      title: 'Recent Customer Inquiries',
      description: 'Latest quotes awaiting staff review and confirmation',
      pinned: false,
      visible: true,
      colSpan: 'lg:col-span-12'
    },
    {
      id: 'quick_actions',
      title: 'Quick Manager Actions',
      description: 'Shortcuts to update products, rates, and portfolio',
      pinned: false,
      visible: true,
      colSpan: 'lg:col-span-6'
    },
    {
      id: 'inventory_highlights',
      title: 'Top Inventory Highlights',
      description: 'Featured pro audio gear and equipment rental rates',
      pinned: false,
      visible: true,
      colSpan: 'lg:col-span-6'
    },
    {
      id: 'popular_items',
      title: 'Popular Items Performance',
      description: 'Top requested items based on quote frequency',
      pinned: false,
      visible: true,
      colSpan: 'lg:col-span-12'
    }
  ];

  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('technocore_admin_widgets_grid_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.some((w: any) => w.id === 'analytics_charts')) {
            parsed.splice(1, 0, {
              id: 'analytics_charts',
              title: 'Booking Trends & Revenue Analytics',
              description: 'Interactive Recharts visualization of daily booking volume and cumulative revenue growth',
              pinned: true,
              visible: true,
              colSpan: 'lg:col-span-12'
            });
          }
          if (!parsed.some((w: any) => w.id === 'popular_items')) {
            parsed.push({
              id: 'popular_items',
              title: 'Popular Items Performance',
              description: 'Top requested items based on quote frequency',
              pinned: false,
              visible: true,
              colSpan: 'lg:col-span-12'
            });
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_WIDGETS_CONFIG;
  });

  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [dragOverWidgetId, setDragOverWidgetId] = useState<string | null>(null);
  const [isGridEditMode, setIsGridEditMode] = useState(false);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('technocore_admin_widgets_grid_v4', JSON.stringify(widgets));
    } catch {
      // ignore
    }
  }, [widgets]);

  const handleWidgetDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidgetId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleWidgetDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedWidgetId !== id) {
      setDragOverWidgetId(id);
    }
  };

  const handleWidgetDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetId) {
      setDraggedWidgetId(null);
      setDragOverWidgetId(null);
      return;
    }

    setWidgets((prev: typeof DEFAULT_WIDGETS_CONFIG) => {
      const currentIndex = prev.findIndex((w) => w.id === draggedWidgetId);
      const targetIndex = prev.findIndex((w) => w.id === targetId);
      if (currentIndex < 0 || targetIndex < 0) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });

    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const handleMoveWidget = (id: string, direction: 'up' | 'down') => {
    setWidgets((prev: typeof DEFAULT_WIDGETS_CONFIG) => {
      const index = prev.findIndex((w) => w.id === id);
      if (index < 0) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleTogglePinWidget = (id: string) => {
    setWidgets((prev: typeof DEFAULT_WIDGETS_CONFIG) =>
      prev.map((w) => (w.id === id ? { ...w, pinned: !w.pinned } : w))
    );
  };

  const handleToggleVisibilityWidget = (id: string) => {
    setWidgets((prev: typeof DEFAULT_WIDGETS_CONFIG) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const handleResetWidgetLayout = () => {
    setWidgets(DEFAULT_WIDGETS_CONFIG);
  };

  // Filtering & state for Bookings
  const [bookingFilter, setBookingFilter] = useState<'all' | 'rental' | 'retail'>('all');
  const [selectedBookingModal, setSelectedBookingModal] = useState<BookingRequest | null>(null);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  const [emailStatusUpdateData, setEmailStatusUpdateData] = useState<{ status: BookingStatus, message: string }>({ status: 'confirmed', message: '' });
  const [isSendingStatusUpdate, setIsSendingStatusUpdate] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBookingModal(null);
        setShowProductModal(false);
        setShowServiceModal(false);
        setShowGalleryModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendStatusUpdateEmail = async (bookingId: string) => {
    setIsSendingStatusUpdate(true);
    setEmailNotice(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: emailStatusUpdateData.status, 
          sendEmail: true, 
          emailMessage: emailStatusUpdateData.message 
        })
      });
      if (res.ok) {
        setEmailNotice('Status updated and email sent successfully!');
        const updatedBooking = await res.json();
        if (selectedBookingModal) setSelectedBookingModal(updatedBooking);
        onRefreshData();
      } else {
        setEmailNotice('Failed to update status and send email.');
      }
    } catch (err) {
      setEmailNotice('Error sending status update.');
    } finally {
      setIsSendingStatusUpdate(false);
    }
  };

  const handleResendEmail = async (bookingId: string) => {
    setResendingEmailId(bookingId);
    setEmailNotice(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/resend-email`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setEmailNotice(`Confirmation email sent successfully for #${bookingId}`);
        onRefreshData();
      } else {
        setEmailNotice(`Email resend failed: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setEmailNotice(`Email resend error: ${err.message || 'Network error'}`);
    } finally {
      setResendingEmailId(null);
    }
  };

  // Forms for adding/editing items
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<RetailProduct>>({
    brand: 'QSC',
    category: 'Pro Audio & Speakers',
    stockStatus: 'In Stock',
    price: 0,
    rating: 5,
    specs: ['Pro Spec 1', 'Pro Spec 2']
  });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Partial<RentalService>>({
    category: 'LED Video Walls',
    dayRate: 0,
    eventRate: 0,
    specs: ['100% Weatherproof', 'Novastar Processor'],
    inclusions: ['Full Technical Setup Crew']
  });

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem>>({
    eventType: 'Concert',
    tags: ['Davao City', 'Sound & Lights']
  });

  // CMS state form
  const [cmsForm, setCmsForm] = useState<CMSData>(cms);

  // Admin password change form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setIsChangingPass(true);
    setPassMessage(null);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassMessage({ type: 'success', text: 'Admin security password changed successfully!' });
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        setPassMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (err: any) {
      setPassMessage({ type: 'error', text: 'Error contacting server' });
    } finally {
      setIsChangingPass(false);
    }
  };

  // Handlers for API mutations
  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      onRefreshData();
      if (selectedBookingModal) {
        setSelectedBookingModal({ ...selectedBookingModal, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct.id) {
        await fetch(`/api/retail-products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
      } else {
        await fetch('/api/retail-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
      }
      setShowProductModal(false);
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product from catalog?')) {
      await fetch(`/api/retail-products/${id}`, { method: 'DELETE' });
      onRefreshData();
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService.id) {
        await fetch(`/api/rental-services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingService)
        });
      } else {
        await fetch('/api/rental-services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingService)
        });
      }
      setShowServiceModal(false);
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Delete this rental service?')) {
      await fetch(`/api/rental-services/${id}`, { method: 'DELETE' });
      onRefreshData();
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rawImages = editingGallery.images && editingGallery.images.length > 0
        ? editingGallery.images
        : (editingGallery.image ? [editingGallery.image] : []);
      
      const cleanImages = rawImages.filter((img) => typeof img === 'string' && img.trim() !== '');
      
      const payload = {
        ...editingGallery,
        image: cleanImages[0] || editingGallery.image || '',
        images: cleanImages.length > 0 ? cleanImages : [editingGallery.image || '']
      };

      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setShowGalleryModal(false);
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('Delete this gallery item?')) {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      onRefreshData();
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsForm)
      });
      alert('CMS Settings saved successfully!');
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'all' && b.type !== bookingFilter) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      const matchName = b.customerName?.toLowerCase().includes(q);
      const matchPhone = b.phone?.toLowerCase().includes(q);
      const matchEmail = b.email?.toLowerCase().includes(q);
      const matchVenue = b.venueLocation?.toLowerCase().includes(q);
      const matchItems = b.selectedItems?.some(i => i.name.toLowerCase().includes(q));
      return matchName || matchPhone || matchEmail || matchVenue || matchItems;
    }
    return true;
  });

  const handleExportBookingsCSV = (exportTarget: 'filtered' | 'all' = 'filtered') => {
    const listToExport = exportTarget === 'all' ? bookings : filteredBookings;

    if (listToExport.length === 0) {
      alert('No booking inquiries available to export.');
      return;
    }

    const headers = [
      'Reference ID',
      'Date Created',
      'Inquiry Type',
      'Customer Name',
      'Email',
      'Phone Number',
      'Event Date',
      'Event Type',
      'Venue / Location',
      'Guest Count',
      'Selected Items / Package Summary',
      'Total Estimated Price (PHP)',
      'Status',
      'Budget Range',
      'Notes'
    ];

    const escapeCsvField = (field: string | number | undefined | null) => {
      if (field === undefined || field === null) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = listToExport.map((b) => {
      const itemsSummary = b.selectedItems && b.selectedItems.length > 0
        ? b.selectedItems.map((i) => `${i.name} (x${i.quantity || 1}) - ₱${(i.price || 0).toLocaleString()}`).join('; ')
        : 'None';

      const createdFormatted = b.createdAt
        ? new Date(b.createdAt).toLocaleString('en-US')
        : 'N/A';

      return [
        escapeCsvField(b.id),
        escapeCsvField(createdFormatted),
        escapeCsvField(b.type ? b.type.toUpperCase() : 'N/A'),
        escapeCsvField(b.customerName),
        escapeCsvField(b.email),
        escapeCsvField(b.phone),
        escapeCsvField(b.eventDate || 'N/A'),
        escapeCsvField(b.eventType || 'N/A'),
        escapeCsvField(b.venueLocation || 'N/A'),
        escapeCsvField(b.guestCount || 'N/A'),
        escapeCsvField(itemsSummary),
        escapeCsvField(b.totalEstimatedPrice || 0),
        escapeCsvField(b.status ? b.status.toUpperCase() : 'PENDING'),
        escapeCsvField(b.budgetRange || 'N/A'),
        escapeCsvField(b.notes || '')
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.map((h) => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const timestamp = new Date().toISOString().split('T')[0];
    const filterSuffix = exportTarget === 'filtered' && bookingFilter !== 'all' ? `_${bookingFilter}` : '';

    link.href = url;
    link.setAttribute('download', `technocore_financial_report_${timestamp}${filterSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredRetail = retailProducts.filter((p) => {
    if (retailSearch.trim()) {
      const q = retailSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    }
    return true;
  });

  const filteredRentals = rentalServices.filter((s) => {
    if (rentalSearch.trim()) {
      const q = rentalSearch.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredGallery = gallery.filter((g) => {
    if (gallerySearch.trim()) {
      const q = gallerySearch.toLowerCase();
      return g.title.toLowerCase().includes(q) || g.eventType.toLowerCase().includes(q) || g.location.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative animate-fadeIn overflow-x-hidden">
      
      {/* Mobile Top App Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <TechnoCoreLogo size="sm" showText={false} />
          <div>
            <span className="font-black text-sm uppercase tracking-tight text-white block">TechnoCore</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingBookings.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#FF1E1E] text-black text-[10px] font-black">
              {pendingBookings.length} New
            </span>
          )}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Persistent Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Persistent Collapsible Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50 bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0
          ${isMobileSidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[73px]">
          <div className={`flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'md:justify-center md:w-full' : ''}`}>
            <TechnoCoreLogo size="sm" showText={false} />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <div className="min-w-0">
                <h2 className="font-black text-sm uppercase tracking-tight text-white truncate">TechnoCore</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Live</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all shrink-0"
            title={isSidebarCollapsed ? "Expand Navigation Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#FF1E1E]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto scrollbar-none">
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-3 pt-2 pb-1">
              Management Zones
            </div>
          )}

          {/* Overview Zone */}
          <button
            onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group ${
              activeTab === 'overview'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={isSidebarCollapsed ? "Overview & Analytics" : undefined}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="truncate">Overview</span>
            )}
          </button>

          {/* Bookings & Inquiries */}
          <button
            onClick={() => { setActiveTab('bookings'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group ${
              activeTab === 'bookings'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={isSidebarCollapsed ? `Inquiries & Bookings (${bookings.length})` : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'bookings' ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Inquiries & Quotes</span>
              )}
            </div>
            {pendingBookings.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                activeTab === 'bookings' ? 'bg-black text-[#FF1E1E]' : 'bg-[#FF1E1E] text-black'
              }`}>
                {pendingBookings.length}
              </span>
            )}
          </button>

          {/* Event Calendar & Availability Manager */}
          <button
            onClick={() => { setActiveTab('calendar'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group ${
              activeTab === 'calendar'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={isSidebarCollapsed ? 'Event Calendar & Conflicts' : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'calendar' ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Event Calendar</span>
              )}
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 uppercase tracking-widest ${
              activeTab === 'calendar' ? 'bg-black text-[#FF1E1E]' : 'bg-white/10 text-gray-300'
            }`}>
              Live
            </span>
          </button>


          {/* Retail Inventory */}
          <button
            onClick={() => { setActiveTab('retail'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group ${
              activeTab === 'retail'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={isSidebarCollapsed ? `Retail Inventory (${retailProducts.length})` : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShoppingBag className={`w-4 h-4 shrink-0 ${activeTab === 'retail' ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Retail Inventory</span>
              )}
            </div>
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="text-[10px] text-gray-500 font-mono font-bold">{retailProducts.length}</span>
            )}
          </button>

          {/* Rental Catalog */}
          <button
            onClick={() => { setActiveTab('rentals'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group ${
              activeTab === 'rentals'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={isSidebarCollapsed ? `Rental Catalog (${rentalServices.length})` : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'rentals' ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Rental Services</span>
              )}
            </div>
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="text-[10px] text-gray-500 font-mono font-bold">{rentalServices.length}</span>
            )}
          </button>

          {/* Portfolio Gallery */}
          <button
            onClick={() => { setActiveTab('gallery'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group ${
              activeTab === 'gallery'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={isSidebarCollapsed ? `Portfolio Gallery (${gallery.length})` : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ImageIcon className={`w-4 h-4 shrink-0 ${activeTab === 'gallery' ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Portfolio Gallery</span>
              )}
            </div>
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="text-[10px] text-gray-500 font-mono font-bold">{gallery.length}</span>
            )}
          </button>

          {/* CMS & Security */}
          <button
            onClick={() => { setActiveTab('cms'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group ${
              activeTab === 'cms'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={isSidebarCollapsed ? "CMS Site & Security Settings" : undefined}
          >
            <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'cms' ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <span className="truncate">CMS & Security</span>
            )}
          </button>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-[#080808]">
          <button
            onClick={onRefreshData}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider transition-all"
            title="Sync Database"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF1E1E] shrink-0" />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Sync Database</span>}
          </button>

          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#FF1E1E]/10 hover:bg-[#FF1E1E] text-[#FF1E1E] hover:text-black border border-[#FF1E1E]/40 text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,30,30,0.2)]"
            title="Lock & Exit Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Exit Portal</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-w-0">

        {/* Header Breadcrumb / Title Bar */}
        <div className="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
              <span>TechnoCore Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-[#FF1E1E] font-black">
                {activeTab === 'overview' && 'Overview & Control Center'}
                {activeTab === 'bookings' && 'Inquiries & Quote Management'}
                {activeTab === 'retail' && 'Retail Inventory Control'}
                {activeTab === 'rentals' && 'Rental Rates & Equipment Catalog'}
                {activeTab === 'gallery' && 'Portfolio Gallery Manager'}
                {activeTab === 'cms' && 'CMS & Security Settings'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {activeTab === 'overview' && 'System Performance Overview'}
              {activeTab === 'bookings' && 'Customer Inquiries & Event Quotes'}
              {activeTab === 'retail' && 'Pro Audio & Lights Retail Inventory'}
              {activeTab === 'rentals' && 'Rental Rates & Services Catalog'}
              {activeTab === 'gallery' && 'Event Showcase Portfolio'}
              {activeTab === 'cms' && 'Website CMS & Admin Password Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Davao HQ</span>
            </span>
            <button
              onClick={onRefreshData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
              title="Sync Data"
            >
              <RefreshCw className="w-4 h-4 text-[#FF1E1E]" />
            </button>
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-2 rounded-xl bg-[#FF1E1E]/10 hover:bg-[#FF1E1E] text-[#FF1E1E] hover:text-black border border-[#FF1E1E]/40 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,30,30,0.2)]"
              title="Lock & Exit Admin Portal"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* TAB 0: OVERVIEW & DASHBOARD (Modular Drag-and-Drop Grid) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Grid Layout Control Toolbar */}
            <div className="bg-[#0a0a0a] p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 flex items-center justify-center text-[#FF1E1E]">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm uppercase text-white tracking-wide">Modular Dashboard Grid</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#FF1E1E]/20 text-[#FF1E1E] border border-[#FF1E1E]/40 uppercase tracking-widest">
                      Drag & Drop
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Drag widgets using handles, pin high-priority panels, or hide/rearrange widgets to customize your workflow.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => setIsGridEditMode(!isGridEditMode)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isGridEditMode
                      ? 'bg-[#FF1E1E] text-black shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <GripVertical className="w-4 h-4" />
                  <span>{isGridEditMode ? 'Done Editing' : 'Rearrange Grid'}</span>
                </button>

                <button
                  onClick={() => setShowWidgetPicker(!showWidgetPicker)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4 text-[#FF1E1E]" />
                  <span>Widgets ({widgets.filter(w => w.visible).length}/{widgets.length})</span>
                </button>

                <button
                  onClick={handleResetWidgetLayout}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                  title="Reset to default grid layout"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Widget Visibility Selector Popover */}
            {showWidgetPicker && (
              <div className="bg-[#0f0f0f] p-5 rounded-2xl border border-[#FF1E1E]/30 space-y-3 animate-fadeIn shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF1E1E]" />
                    <span>Manage Dashboard Widgets Visibility & Pins</span>
                  </div>
                  <button
                    onClick={() => setShowWidgetPicker(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {widgets.map((w) => (
                    <div
                      key={w.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        w.visible ? 'bg-white/5 border-white/15' : 'bg-black/40 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white uppercase tracking-tight truncate">{w.title}</div>
                        <div className="text-[10px] text-gray-400 truncate">{w.description}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleTogglePinWidget(w.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            w.pinned
                              ? 'bg-[#FF1E1E]/20 text-[#FF1E1E] border-[#FF1E1E]/40'
                              : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'
                          }`}
                          title={w.pinned ? "Unpin widget" : "Pin widget to top"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleVisibilityWidget(w.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            w.visible
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                          title={w.visible ? "Hide widget" : "Show widget"}
                        >
                          {w.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modular Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {widgets
                .filter((w) => w.visible || isGridEditMode)
                .map((widget, index, visibleList) => {
                  const isDragged = draggedWidgetId === widget.id;
                  const isDragOver = dragOverWidgetId === widget.id;

                  return (
                    <div
                      key={widget.id}
                      draggable={true}
                      onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
                      onDragOver={(e) => handleWidgetDragOver(e, widget.id)}
                      onDrop={(e) => handleWidgetDrop(e, widget.id)}
                      className={`
                        ${widget.colSpan}
                        bg-[#0c0c0c] backdrop-blur-md rounded-2xl border transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden relative group
                        ${!widget.visible ? 'opacity-40 grayscale border-dashed border-gray-700' : ''}
                        ${widget.pinned ? 'border-[#FF1E1E]/40 shadow-[0_0_20px_rgba(255,30,30,0.1)]' : 'border-white/10'}
                        ${isDragged ? 'opacity-30 border-[#FF1E1E] border-dashed scale-[0.98]' : ''}
                        ${isDragOver ? 'border-[#FF1E1E] shadow-[0_0_25px_rgba(255,30,30,0.4)] scale-[1.01] bg-[#FF1E1E]/5' : ''}
                      `}
                    >
                      {/* Widget Header Controls */}
                      <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Drag Handle */}
                          <div
                            className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors"
                            title="Drag to reorder widget"
                          >
                            <GripVertical className="w-4 h-4 text-[#FF1E1E]" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-sm uppercase text-white tracking-tight truncate">
                                {widget.title}
                              </h3>
                              {widget.pinned && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#FF1E1E] text-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_8px_rgba(255,30,30,0.4)]">
                                  <Pin className="w-2.5 h-2.5" />
                                  Pinned
                                </span>
                              )}
                              {!widget.visible && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-800 text-gray-400 uppercase">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{widget.description}</p>
                          </div>
                        </div>

                        {/* Widget Reorder & Action Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Move widget up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleMoveWidget(widget.id, 'down')}
                            disabled={index === visibleList.length - 1}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Move widget down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleTogglePinWidget(widget.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              widget.pinned
                                ? 'bg-[#FF1E1E] text-black font-black'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                            }`}
                            title={widget.pinned ? "Unpin widget" : "Pin widget to top"}
                          >
                            {widget.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleToggleVisibilityWidget(widget.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Hide widget"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* WIDGET BODY CONTENT */}
                      <div className="p-5 flex-1">

                        {/* 1. Quick Revenue Summary Widget */}
                        {widget.id === 'quick_summary' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div
                                onClick={() => setActiveTab('bookings')}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF1E1E]/50 transition-all cursor-pointer group"
                              >
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-between">
                                  <span>Total Pipeline</span>
                                  <DollarSign className="w-3.5 h-3.5 text-[#FF1E1E]" />
                                </div>
                                <div className="text-2xl font-black text-white mt-1">
                                  ₱{bookings.reduce((sum, b) => sum + (b.totalEstimatedPrice || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1">{bookings.length} Total Inquiries</div>
                              </div>

                              <div
                                onClick={() => setActiveTab('bookings')}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF1E1E]/50 transition-all cursor-pointer group"
                              >
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-between">
                                  <span>Pending Value</span>
                                  <Clock className="w-3.5 h-3.5 text-[#FF1E1E]" />
                                </div>
                                <div className="text-2xl font-black text-[#FF1E1E] mt-1">
                                  ₱{bookings.filter(b => b.status === 'pending').reduce((sum, b) => sum + (b.totalEstimatedPrice || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-[#FF1E1E] font-bold mt-1">{pendingBookings.length} Awaiting Review</div>
                              </div>

                              <div
                                onClick={() => setActiveTab('bookings')}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer group"
                              >
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-between">
                                  <span>Confirmed Value</span>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <div className="text-2xl font-black text-emerald-400 mt-1">
                                  ₱{bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + (b.totalEstimatedPrice || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-emerald-400 font-bold mt-1">Approved Bookings</div>
                              </div>

                              <div
                                onClick={() => setActiveTab('retail')}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group"
                              >
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-between">
                                  <span>Retail Valuation</span>
                                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <div className="text-2xl font-black text-blue-400 mt-1">
                                  ₱{retailProducts.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-blue-400 font-bold mt-1">
                                  {retailProducts.filter(p => p.stockStatus === 'In Stock').length} Items In Stock
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#080808] border border-white/10 text-xs">
                              <div className="flex items-center gap-2 text-gray-300">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                                <div>
                                  <span className="font-bold text-white block sm:inline">Financial & Audit Export: </span>
                                  <span className="text-gray-400 text-[11px]">Download all booking inquiry records formatted for Excel & accounting software.</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleExportBookingsCSV('all')}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-black uppercase text-[10px] tracking-wider flex items-center gap-1.5 transition-all shrink-0 hover:border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                              >
                                <Download className="w-3 h-3 text-emerald-400" />
                                <span>Export Financial CSV ({bookings.length})</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Booking Trends & Revenue Analytics Widget (Recharts) */}
                        {widget.id === 'analytics_charts' && (
                          <AdminAnalyticsCharts bookings={bookings} />
                        )}

                        {/* 2. System Alerts & Live Status Widget */}
                        {widget.id === 'system_alerts' && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-black text-[#FF1E1E] uppercase tracking-wider">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>Pending Inquiries Alert</span>
                              </div>
                              <div className="text-sm font-bold text-white">
                                {pendingBookings.length > 0
                                  ? `${pendingBookings.length} customer quote(s) awaiting staff review.`
                                  : 'All customer quotes reviewed & confirmed.'}
                              </div>
                              <button
                                onClick={() => setActiveTab('bookings')}
                                className="text-xs font-black text-[#FF1E1E] hover:underline uppercase tracking-wider block pt-1"
                              >
                                Open Inquiries Queue →
                              </button>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                                <Mail className="w-4 h-4 shrink-0" />
                                <span>CMS Store Hotline</span>
                              </div>
                              <div className="text-xs text-gray-300 font-mono">
                                Phone: <span className="text-white font-bold">{cms.contactPhone}</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Hours: <span className="text-gray-200">{cms.openingHours}</span>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>System Sync Status</span>
                              </div>
                              <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Davao Server Connected</span>
                              </div>
                              <div className="text-[11px] text-gray-400">
                                Database, CMS, & Email SMTP Active
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. Recent Customer Inquiries Feed Widget */}
                        {widget.id === 'recent_bookings' && (
                          <div className="space-y-3">
                            {pendingBookings.length === 0 ? (
                              <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-1">
                                <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto" />
                                <div className="font-bold text-emerald-300 text-sm">No Pending Inquiries</div>
                                <div className="text-xs text-emerald-400/80">All quotes have been reviewed.</div>
                              </div>
                            ) : (
                              pendingBookings.slice(0, 3).map((b) => (
                                <div
                                  key={b.id}
                                  className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-black text-white uppercase text-xs">{b.customerName}</span>
                                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-[9px] font-bold uppercase">
                                        {b.type}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                                      {b.phone} • Event: {b.eventDate || 'N/A'}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <div className="text-right">
                                      <div className="text-[10px] text-gray-400">Total Est.</div>
                                      <div className="text-xs font-black text-[#FF1E1E]">₱{b.totalEstimatedPrice.toLocaleString()}</div>
                                    </div>

                                    <button
                                      onClick={() => {
                                        setActiveTab('bookings');
                                        setSelectedBookingModal(b);
                                        setEmailStatusUpdateData({ status: b.status, message: '' });
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-[#FF1E1E] hover:bg-[#ff3838] text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow transition-all"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Review</span>
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {/* 4. Quick Manager Actions Widget */}
                        {widget.id === 'quick_actions' && (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setEditingProduct({
                                  brand: 'QSC',
                                  category: 'Pro Audio & Speakers',
                                  stockStatus: 'In Stock',
                                  price: 25000,
                                  rating: 5,
                                  specs: ['Pro Spec 1']
                                });
                                setActiveTab('retail');
                                setShowProductModal(true);
                              }}
                              className="p-3.5 rounded-xl bg-white/5 hover:bg-[#FF1E1E] hover:text-black border border-white/10 text-left transition-all group"
                            >
                              <Plus className="w-4 h-4 text-[#FF1E1E] group-hover:text-black mb-1.5" />
                              <div className="font-bold text-xs uppercase tracking-tight">Add Retail Product</div>
                              <div className="text-[10px] text-gray-400 group-hover:text-black/80 mt-0.5">New store listing</div>
                            </button>

                            <button
                              onClick={() => {
                                setEditingService({
                                  category: 'LED Video Walls',
                                  dayRate: 20000,
                                  eventRate: 35000,
                                  specs: ['NOVACOR Processor'],
                                  inclusions: ['Crew included']
                                });
                                setActiveTab('rentals');
                                setShowServiceModal(true);
                              }}
                              className="p-3.5 rounded-xl bg-white/5 hover:bg-[#FF1E1E] hover:text-black border border-white/10 text-left transition-all group"
                            >
                              <Plus className="w-4 h-4 text-[#FF1E1E] group-hover:text-black mb-1.5" />
                              <div className="font-bold text-xs uppercase tracking-tight">Add Rental Service</div>
                              <div className="text-[10px] text-gray-400 group-hover:text-black/80 mt-0.5">Equipment rates</div>
                            </button>

                            <button
                              onClick={() => {
                                setEditingGallery({ eventType: 'Concert', tags: ['Davao'] });
                                setActiveTab('gallery');
                                setShowGalleryModal(true);
                              }}
                              className="p-3.5 rounded-xl bg-white/5 hover:bg-[#FF1E1E] hover:text-black border border-white/10 text-left transition-all group"
                            >
                              <Plus className="w-4 h-4 text-[#FF1E1E] group-hover:text-black mb-1.5" />
                              <div className="font-bold text-xs uppercase tracking-tight">Add Portfolio Setup</div>
                              <div className="text-[10px] text-gray-400 group-hover:text-black/80 mt-0.5">Gallery showcase</div>
                            </button>

                            <button
                              onClick={() => setActiveTab('cms')}
                              className="p-3.5 rounded-xl bg-white/5 hover:bg-[#FF1E1E] hover:text-black border border-white/10 text-left transition-all group"
                            >
                              <Settings className="w-4 h-4 text-[#FF1E1E] group-hover:text-black mb-1.5" />
                              <div className="font-bold text-xs uppercase tracking-tight">Edit CMS Settings</div>
                              <div className="text-[10px] text-gray-400 group-hover:text-black/80 mt-0.5">Hotline & Password</div>
                            </button>
                          </div>
                        )}

                        {/* 5. Inventory Highlights Widget */}
                        {widget.id === 'inventory_highlights' && (
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                              <span>Featured Retail Products</span>
                              <button onClick={() => setActiveTab('retail')} className="text-[#FF1E1E] hover:underline text-[10px]">
                                View All ({retailProducts.length}) →
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {retailProducts.slice(0, 3).map((item) => (
                                <div key={item.id} className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                                  <div className="min-w-0 pr-2">
                                    <div className="font-bold text-white uppercase truncate">{item.name}</div>
                                    <div className="text-[10px] text-gray-400">{item.brand} • {item.category}</div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="font-black text-[#FF1E1E]">₱{item.price.toLocaleString()}</div>
                                    <span className={`text-[9px] font-bold ${item.stockStatus === 'In Stock' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                      {item.stockStatus}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 6. Popular Items Widget */}
                        {widget.id === 'popular_items' && (
                          <div className="space-y-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>Top Requested Items</span>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead>
                                  <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest text-[10px]">
                                    <th className="py-2 font-medium">Item Name</th>
                                    <th className="py-2 font-medium">Type</th>
                                    <th className="py-2 font-medium text-center">Requests (Qty)</th>
                                    <th className="py-2 font-medium text-right">Est. Revenue</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    const itemPerformance = bookings.reduce((acc, booking) => {
                                      booking.selectedItems.forEach((item) => {
                                        if (!acc[item.id]) {
                                          acc[item.id] = { name: item.name, type: item.type, count: 0, revenue: 0 };
                                        }
                                        acc[item.id].count += item.quantity;
                                        acc[item.id].revenue += item.price * item.quantity;
                                      });
                                      return acc;
                                    }, {} as Record<string, { name: string, type: string, count: number, revenue: number }>);

                                    const popularItems = (Object.values(itemPerformance) as { name: string; type: string; count: number; revenue: number; }[]).sort((a, b) => b.count - a.count).slice(0, 5);

                                    if (popularItems.length === 0) {
                                      return (
                                        <tr>
                                          <td colSpan={4} className="py-4 text-center text-gray-500 italic">No item data available yet.</td>
                                        </tr>
                                      );
                                    }

                                    return popularItems.map((item, idx) => (
                                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-2.5 font-bold text-white truncate max-w-[200px]" title={item.name}>{item.name}</td>
                                        <td className="py-2.5">
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/10 text-gray-300">
                                            {item.type}
                                          </span>
                                        </td>
                                        <td className="py-2.5 text-center text-[#FF1E1E] font-black">{item.count}</td>
                                        <td className="py-2.5 text-right font-bold text-emerald-400">₱{item.revenue.toLocaleString()}</td>
                                      </tr>
                                    ));
                                  })()}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

      {/* TAB 0.5: EVENT CALENDAR & CONFLICTS */}
      {activeTab === 'calendar' && (
        <AdminCalendarView
          rentalServices={rentalServices}
          bookings={bookings}
          onRefreshData={onRefreshData}
        />
      )}

      {/* TAB 1: BOOKINGS & INQUIRIES */}
      {activeTab === 'bookings' && (

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setBookingFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[38px] ${bookingFilter === 'all' ? 'bg-[#FF1E1E] text-black shadow-[0_0_12px_rgba(255,30,30,0.4)] font-black' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'}`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setBookingFilter('rental')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[38px] ${bookingFilter === 'rental' ? 'bg-[#FF1E1E] text-black shadow-[0_0_12px_rgba(255,30,30,0.4)] font-black' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'}`}
              >
                Event Rentals ({bookings.filter(b => b.type === 'rental').length})
              </button>
              <button
                onClick={() => setBookingFilter('retail')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[38px] ${bookingFilter === 'retail' ? 'bg-[#FF1E1E] text-black shadow-[0_0_12px_rgba(255,30,30,0.4)] font-black' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'}`}
              >
                Retail Orders ({bookings.filter(b => b.type === 'retail').length})
              </button>
              <button
                onClick={() => setShowBookingsAnalytics(!showBookingsAnalytics)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[38px] flex items-center gap-1.5 shrink-0 ${
                  showBookingsAnalytics
                    ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_12px_rgba(255,30,30,0.4)]'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{showBookingsAnalytics ? 'Hide Analytics' : 'Recharts Analytics'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search customer, venue, items..."
                  className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E] focus:ring-1 focus:ring-[#FF1E1E] transition-all"
                />
                {bookingSearch && (
                  <button
                    onClick={() => setBookingSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Export CSV Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end shrink-0">
                <button
                  onClick={() => handleExportBookingsCSV('filtered')}
                  title="Export currently filtered list to CSV for financial reporting"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[38px] hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-black">
                    {filteredBookings.length}
                  </span>
                </button>

                {filteredBookings.length !== bookings.length && (
                  <button
                    onClick={() => handleExportBookingsCSV('all')}
                    title="Export ALL booking records to CSV"
                    className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[10px] font-bold uppercase tracking-wider transition-all min-h-[38px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3 text-gray-400" />
                    <span>All ({bookings.length})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Recharts Analytics Section in Bookings Tab */}
          {showBookingsAnalytics && (
            <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-[#FF1E1E]/30 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FF1E1E]" />
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">
                    Customer Inquiries & Revenue Analytics
                  </h3>
                </div>
                <button
                  onClick={() => setShowBookingsAnalytics(false)}
                  className="text-xs text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AdminAnalyticsCharts bookings={bookings} />
            </div>
          )}

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#080808] text-gray-400 font-bold uppercase tracking-widest text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Event Date / Venue</th>
                  <th className="p-4">Selected Items</th>
                  <th className="p-4">Est. Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500 font-medium">
                      <p className="text-sm">No booking inquiries match your search or filter.</p>
                      {bookingSearch && (
                        <button
                          onClick={() => setBookingSearch('')}
                          className="mt-2 text-xs text-[#FF1E1E] font-bold uppercase hover:underline"
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.07] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white uppercase tracking-tight">{b.customerName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{b.phone}</div>
                        <div className="text-[11px] text-gray-500">{b.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${b.type === 'rental' ? 'bg-blue-950/90 text-blue-300 border border-blue-700/60' : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'}`}>
                          {b.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{b.eventDate || 'N/A'}</div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[180px]">{b.venueLocation || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{b.selectedItems.length} items</div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[150px]">
                          {b.selectedItems.map((i) => i.name).join(', ')}
                        </div>
                      </td>
                      <td className="p-4 font-black text-white text-sm">
                        ₱{b.totalEstimatedPrice.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className={`bg-[#050505] border rounded-lg px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-[#FF1E1E] focus-visible:outline-none transition-all cursor-pointer ${
                            b.status === 'pending'
                              ? 'text-[#FF1E1E] border-[#FF1E1E]/60 bg-[#FF1E1E]/10'
                              : b.status === 'confirmed'
                              ? 'text-emerald-400 border-emerald-500/60 bg-emerald-950/30'
                              : b.status === 'completed'
                              ? 'text-blue-400 border-blue-500/60 bg-blue-950/30'
                              : 'text-gray-400 border-white/15'
                          }`}
                        >
                          <option value="pending">⏳ Pending Review</option>
                          <option value="reviewed">👀 Reviewed</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="completed">🎉 Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedBookingModal(b);
                            setEmailStatusUpdateData({ status: b.status, message: '' });
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#FF1E1E] hover:text-black hover:border-[#FF1E1E] text-gray-200 border border-white/15 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Transformation View (320px-767px) */}
          <div className="md:hidden space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="bg-white/5 p-8 rounded-xl text-center text-gray-500 text-xs">
                No booking inquiries match this view.
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div key={b.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{b.customerName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{b.phone} • {b.email || 'No email'}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${b.type === 'rental' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                      {b.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Date / Venue</div>
                      <div className="font-semibold text-white text-[11px]">{b.eventDate || 'N/A'}</div>
                      <div className="text-[10px] text-gray-400 truncate">{b.venueLocation || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Est. Price</div>
                      <div className="font-black text-white text-sm">₱{b.totalEstimatedPrice.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400">{b.selectedItems.length} item(s)</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
                    <select
                      value={b.status}
                      onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                      className={`flex-1 bg-[#050505] border rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-[#FF1E1E] focus-visible:outline-none min-h-[38px] ${
                        b.status === 'pending'
                          ? 'text-[#FF1E1E] border-[#FF1E1E]/50'
                          : b.status === 'confirmed'
                          ? 'text-emerald-400 border-emerald-600'
                          : b.status === 'completed'
                          ? 'text-blue-400 border-blue-600'
                          : 'text-gray-400 border-white/10'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedBookingModal(b);
                        setEmailStatusUpdateData({ status: b.status, message: '' });
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FF1E1E]/10 hover:bg-[#FF1E1E] text-[#FF1E1E] hover:text-black border border-[#FF1E1E]/40 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 min-h-[38px] shrink-0 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RETAIL INVENTORY */}
      {activeTab === 'retail' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Retail Shop Inventory Manager</h3>
              <p className="text-xs text-gray-400">Showing {filteredRetail.length} of {retailProducts.length} retail products</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={retailSearch}
                  onChange={(e) => setRetailSearch(e.target.value)}
                  placeholder="Search product, brand, SKU..."
                  className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E]"
                />
                {retailSearch && (
                  <button onClick={() => setRetailSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white">
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingProduct({
                    brand: 'QSC',
                    category: 'Pro Audio & Speakers',
                    stockStatus: 'In Stock',
                    price: 25000,
                    rating: 5,
                    specs: ['Spec 1', 'Spec 2']
                  });
                  setShowProductModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)] flex items-center gap-1.5 shrink-0 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRetail.length === 0 ? (
              <div className="col-span-full bg-white/5 p-12 rounded-2xl border border-white/10 text-center text-gray-500 text-xs">
                No retail products found matching "{retailSearch}".
              </div>
            ) : (
              filteredRetail.map((p) => (
                <div key={p.id} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-4 shadow-xl group">
                  <img
                    loading="lazy"
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/techno_core_3d_logo.jpg';
                    }}
                    className="w-16 h-16 object-cover rounded-xl bg-[#050505] shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-[#FF1E1E] uppercase font-mono">{p.brand} • SKU: {p.sku}</div>
                    <div className="font-bold text-white text-xs truncate uppercase tracking-tight">{p.name}</div>
                    <div className="text-sm font-black text-white mt-1">₱{p.price.toLocaleString()}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className={`text-[10px] font-bold uppercase ${
                        p.stockStatus === 'In Stock' ? 'text-emerald-400' : 
                        p.stockStatus === 'Low Stock' ? 'text-red-500' : 
                        p.stockStatus === 'Out of Stock' ? 'text-red-500' : 
                        'text-amber-400'
                      }`}>
                        {p.stockStatus}
                      </div>
                      {p.stockStatus === 'Low Stock' && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/30">
                          Warning: Low
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setShowProductModal(true);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/15 rounded-lg text-gray-300 border border-white/10 transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 bg-red-950/60 hover:bg-red-900/80 rounded-lg text-[#FF1E1E] border border-red-800/50 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RENTAL SERVICES */}
      {activeTab === 'rentals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Rental Services & Rates Manager</h3>
              <p className="text-xs text-gray-400">Showing {filteredRentals.length} of {rentalServices.length} rental services</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={rentalSearch}
                  onChange={(e) => setRentalSearch(e.target.value)}
                  placeholder="Search service, category..."
                  className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E]"
                />
                {rentalSearch && (
                  <button onClick={() => setRentalSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white">
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingService({
                    category: 'LED Video Walls',
                    dayRate: 20000,
                    eventRate: 35000,
                    specs: ['Spec 1'],
                    inclusions: ['Crew included']
                  });
                  setShowServiceModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)] flex items-center gap-1.5 shrink-0 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRentals.length === 0 ? (
              <div className="col-span-full bg-white/5 p-12 rounded-2xl border border-white/10 text-center text-gray-500 text-xs">
                No rental services found matching "{rentalSearch}".
              </div>
            ) : (
              filteredRentals.map((s) => (
                <div key={s.id} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-4 shadow-xl group">
                  <img
                    loading="lazy"
                    src={s.image}
                    alt={s.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/techno_core_3d_logo.jpg';
                    }}
                    className="w-16 h-16 object-cover rounded-xl bg-[#050505] shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-amber-400 uppercase font-mono">{s.category}</div>
                    <div className="font-bold text-white text-xs truncate uppercase tracking-tight">{s.name}</div>
                    <div className="text-xs text-gray-300 mt-1">
                      Day: <span className="font-bold text-white">₱{s.dayRate.toLocaleString()}</span> | Event: <span className="font-bold text-white">₱{s.eventRate.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingService(s);
                        setShowServiceModal(true);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/15 rounded-lg text-gray-300 border border-white/10 transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="p-2 bg-red-950/60 hover:bg-red-900/80 rounded-lg text-[#FF1E1E] border border-red-800/50 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PORTFOLIO GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Gallery Setup Manager</h3>
              <p className="text-xs text-gray-400">Showing {filteredGallery.length} of {gallery.length} portfolio items</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Search title, location..."
                  className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E]"
                />
                {gallerySearch && (
                  <button onClick={() => setGallerySearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white">
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingGallery({ eventType: 'Concert', tags: ['Davao'] });
                  setShowGalleryModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)] flex items-center gap-1.5 shrink-0 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Setup</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredGallery.length === 0 ? (
              <div className="col-span-full bg-white/5 p-12 rounded-2xl border border-white/10 text-center text-gray-500 text-xs">
                No portfolio gallery entries match "{gallerySearch}".
              </div>
            ) : (
              filteredGallery.map((g) => {
                const photoCount = (g.images && g.images.length > 0) ? g.images.length : (g.image ? 1 : 0);
                return (
                  <div key={g.id} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all space-y-2.5 shadow-xl group">
                    <div className="relative overflow-hidden rounded-xl bg-[#050505] border border-white/10">
                      <img
                        loading="lazy"
                        src={g.image}
                        alt={g.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/techno_core_3d_logo.jpg';
                        }}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white border border-white/20 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-[#FF1E1E]" />
                        <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-[10px] font-bold text-[#FF1E1E] uppercase tracking-widest">{g.eventType} • {g.date}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingGallery(g);
                            setShowGalleryModal(true);
                          }}
                          className="text-gray-300 hover:text-white text-xs uppercase font-bold tracking-widest flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(g.id)}
                          className="text-red-400 hover:text-red-300 text-xs uppercase font-bold tracking-widest flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-white text-xs uppercase tracking-tight">{g.title}</div>
                    <div className="text-[11px] text-gray-400">{g.location}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 5: CMS SITE SETTINGS */}
      {activeTab === 'cms' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveCMS} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-6 max-w-3xl shadow-xl">
          <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/10 pb-3">Website Operating Hours & Hotlines Editor</h3>

          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF1E1E]">Store Operating Hours</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weekdays (Mon-Fri)</label>
                <input
                  type="text"
                  value={cmsForm.operatingHours.weekdays}
                  onChange={(e) => setCmsForm({ ...cmsForm, operatingHours: { ...cmsForm.operatingHours, weekdays: e.target.value } })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Saturday</label>
                <input
                  type="text"
                  value={cmsForm.operatingHours.saturday}
                  onChange={(e) => setCmsForm({ ...cmsForm, operatingHours: { ...cmsForm.operatingHours, saturday: e.target.value } })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sunday / Hotline</label>
                <input
                  type="text"
                  value={cmsForm.operatingHours.sunday}
                  onChange={(e) => setCmsForm({ ...cmsForm, operatingHours: { ...cmsForm.operatingHours, sunday: e.target.value } })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF1E1E] pt-3">Contact Phone Numbers across Networks</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Globe Hotline</label>
                <input
                  type="text"
                  value={cmsForm.phoneNumbers.globe}
                  onChange={(e) => setCmsForm({ ...cmsForm, phoneNumbers: { ...cmsForm.phoneNumbers, globe: e.target.value } })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Smart Hotline</label>
                <input
                  type="text"
                  value={cmsForm.phoneNumbers.smart}
                  onChange={(e) => setCmsForm({ ...cmsForm, phoneNumbers: { ...cmsForm.phoneNumbers, smart: e.target.value } })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Landline</label>
                <input
                  type="text"
                  value={cmsForm.phoneNumbers.landline}
                  onChange={(e) => setCmsForm({ ...cmsForm, phoneNumbers: { ...cmsForm.phoneNumbers, landline: e.target.value } })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF1E1E] pt-3">Announcement Promo Banner</div>
            <div>
              <input
                type="text"
                value={cmsForm.announcementBanner.text}
                onChange={(e) => setCmsForm({ ...cmsForm, announcementBanner: { ...cmsForm.announcementBanner, text: e.target.value } })}
                className="w-full bg-[#050505] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)] flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save CMS Changes</span>
            </button>
          </div>
        </form>

        {/* ADMIN SECURITY & PASSWORD CHANGE */}
        <form onSubmit={handleChangePassword} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 max-w-3xl shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <KeyRound className="w-5 h-5 text-[#FF1E1E]" />
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Admin Security Password Settings</h3>
          </div>

          <p className="text-xs text-gray-400">
            Update the admin security password required to unlock the TechnoCore Pro management portal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Current password..."
                className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password..."
                className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm new password..."
                className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
              />
            </div>
          </div>

          {passMessage && (
            <div className={`p-3 rounded-lg text-xs font-bold ${
              passMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/60 border border-red-500/40 text-red-200'
            }`}>
              {passMessage.text}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPass}
              className="px-6 py-2.5 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)] flex items-center gap-2 disabled:opacity-50"
            >
              {isChangingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Update Admin Password</span>
            </button>
          </div>
        </form>
        </div>
      )}
      </main>

      {/* Booking Detail Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl max-w-xl w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto scrollbar-thin">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF1E1E]">
                  {selectedBookingModal.type} Inquiry Details
                </span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mt-0.5">
                  {selectedBookingModal.customerName}
                </h3>
              </div>
              <button onClick={() => setSelectedBookingModal(null)} className="text-gray-400 hover:text-white text-sm">✕</button>
            </div>

            <div className="space-y-2 text-xs bg-[#050505] p-4 rounded-xl border border-white/10">
              <div>Phone: <span className="font-bold text-white">{selectedBookingModal.phone}</span></div>
              <div>Email: <span className="font-bold text-white">{selectedBookingModal.email || 'N/A'}</span></div>
              <div>Event Date: <span className="font-bold text-white">{selectedBookingModal.eventDate || 'N/A'}</span></div>
              <div>Venue: <span className="font-bold text-white">{selectedBookingModal.venueLocation || 'N/A'}</span></div>
              <div>Guest Count: <span className="font-bold text-white">{selectedBookingModal.guestCount || 'N/A'}</span></div>
              <div>Budget Range: <span className="font-bold text-white">{selectedBookingModal.budgetRange || 'N/A'}</span></div>
              <div>Notes: <p className="text-gray-300 mt-0.5">{selectedBookingModal.notes || 'None'}</p></div>
            </div>

            {/* Email Dispatch Audit Box */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#FF1E1E] tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Confirmation Status</span>
                </span>
                <button
                  type="button"
                  disabled={resendingEmailId === selectedBookingModal.id}
                  onClick={() => handleResendEmail(selectedBookingModal.id)}
                  className="px-2.5 py-1 rounded bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1 disabled:opacity-50"
                >
                  {resendingEmailId === selectedBookingModal.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  <span>Resend Emails</span>
                </button>
              </div>
              <div className="text-[11px] text-gray-300">
                • <strong>Customer Copy:</strong> {selectedBookingModal.email ? selectedBookingModal.email : 'No email provided'}
                <br />
                • <strong>Admin Copy:</strong> Dispatched to FOH Team
                {selectedBookingModal.emailStatus?.details && (
                  <p className="text-[10px] text-gray-400 mt-1 italic font-mono">{selectedBookingModal.emailStatus.details}</p>
                )}
              </div>
            </div>

            {/* Email Status Update Box */}
            <div className="p-4 bg-[#0a0a0a] border border-[#FF1E1E]/20 rounded-xl space-y-3 text-xs mt-4">
              <h4 className="text-[10px] font-black uppercase text-[#FF1E1E] tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> Update Status & Email Client
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">New Status</label>
                  <select
                    value={emailStatusUpdateData.status}
                    onChange={(e) => setEmailStatusUpdateData({ ...emailStatusUpdateData, status: e.target.value as BookingStatus })}
                    className="w-full bg-[#111] border border-white/10 rounded-md p-2 text-white focus:border-[#FF1E1E] focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Optional Message to Client</label>
                <textarea
                  value={emailStatusUpdateData.message}
                  onChange={(e) => setEmailStatusUpdateData({ ...emailStatusUpdateData, message: e.target.value })}
                  placeholder="e.g., We have reviewed your quote and confirmed availability."
                  className="w-full bg-[#111] border border-white/10 rounded-md p-2 text-white min-h-[60px] focus:border-[#FF1E1E] focus:outline-none placeholder:text-gray-700"
                />
              </div>

              <div className="flex flex-col items-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={isSendingStatusUpdate || !selectedBookingModal.email}
                  onClick={() => handleSendStatusUpdateEmail(selectedBookingModal.id)}
                  className="px-4 py-2 bg-[#FF1E1E] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingStatusUpdate ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>{selectedBookingModal.email ? 'Send Email Update' : 'No Email on File'}</span>
                </button>
                {emailNotice && (
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${emailNotice.includes('Error') || emailNotice.includes('Failed') ? 'text-[#FF1E1E]' : 'text-emerald-400'}`}>
                    {emailNotice}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requested Line Items:</div>
              {selectedBookingModal.selectedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-[#050505] p-2.5 rounded-sm border border-white/10">
                  <span className="font-bold text-white">{item.name} (x{item.quantity})</span>
                  <span className="font-mono text-gray-300">₱{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <div className="text-base font-black text-white">
                Total Est: ₱{selectedBookingModal.totalEstimatedPrice.toLocaleString()}
              </div>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form onSubmit={handleSaveProduct} className="bg-[#0A0A0A] border border-white/10 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto scrollbar-thin">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              {editingProduct.id ? 'Edit Product' : 'Add New Retail Product'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price (PHP)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Status</label>
                  <select
                    value={editingProduct.stockStatus || 'In Stock'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as any })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <ImageUploadInput
                label="Product Image (Upload File or URL)"
                value={editingProduct.image || ''}
                onChange={(val) => setEditingProduct({ ...editingProduct, image: val })}
                required
              />

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)]"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form onSubmit={handleSaveService} className="bg-[#0A0A0A] border border-white/10 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto scrollbar-thin">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              {editingService.id ? 'Edit Rental Service' : 'Add New Rental Service'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Rate (PHP)</label>
                  <input
                    type="number"
                    required
                    value={editingService.dayRate || 0}
                    onChange={(e) => setEditingService({ ...editingService, dayRate: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Multi-Day Rate (PHP)</label>
                  <input
                    type="number"
                    required
                    value={editingService.eventRate || 0}
                    onChange={(e) => setEditingService({ ...editingService, eventRate: Number(e.target.value) })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Rental Service Image (Upload File or URL)"
                value={editingService.image || ''}
                onChange={(val) => setEditingService({ ...editingService, image: val })}
                required
              />

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)]"
              >
                Save Rental Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Gallery Setup Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form onSubmit={handleSaveGallery} className="bg-[#0A0A0A] border border-white/10 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[88vh] overflow-y-auto my-auto scrollbar-thin">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Add Past Event Portfolio Item</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={editingGallery.title || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Event Type</label>
                  <select
                    value={editingGallery.eventType || 'Concert'}
                    onChange={(e) => setEditingGallery({ ...editingGallery, eventType: e.target.value as any })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <option value="Concert">Concert</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Festival">Festival</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. August 2026"
                    value={editingGallery.date || ''}
                    onChange={(e) => setEditingGallery({ ...editingGallery, date: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SMX Convention Center Davao"
                  value={editingGallery.location || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, location: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              {/* Multi-Photo Album Manager */}
              <div className="space-y-3 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-[#FF1E1E] uppercase tracking-widest">
                    Event Photo Album ({editingGallery.images?.length || (editingGallery.image ? 1 : 0)} Photos)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentList = editingGallery.images && editingGallery.images.length > 0
                        ? [...editingGallery.images]
                        : (editingGallery.image ? [editingGallery.image] : ['']);
                      setEditingGallery({
                        ...editingGallery,
                        images: [...currentList, '']
                      });
                    }}
                    className="text-[10px] font-bold text-[#FF1E1E] hover:text-white uppercase tracking-wider flex items-center gap-1 bg-[#FF1E1E]/10 hover:bg-[#FF1E1E] px-2.5 py-1 rounded border border-[#FF1E1E]/30 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Render Each Image Input in the Album */}
                {((editingGallery.images && editingGallery.images.length > 0)
                  ? editingGallery.images
                  : [editingGallery.image || '']
                ).map((imgUrl, imgIdx) => (
                  <div key={imgIdx} className="p-3 bg-[#050505] border border-white/10 rounded-xl space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-gray-400">
                        Photo #{imgIdx + 1} {imgIdx === 0 ? '(Primary Cover Photo)' : ''}
                      </span>
                      {imgIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...(editingGallery.images || [])];
                            list.splice(imgIdx, 1);
                            setEditingGallery({
                              ...editingGallery,
                              image: list[0] || editingGallery.image || '',
                              images: list
                            });
                          }}
                          className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <ImageUploadInput
                      label=""
                      value={imgUrl}
                      onChange={(val) => {
                        const list = editingGallery.images && editingGallery.images.length > 0
                          ? [...editingGallery.images]
                          : [editingGallery.image || ''];
                        list[imgIdx] = val;
                        setEditingGallery({
                          ...editingGallery,
                          image: list[0] || val,
                          images: list
                        });
                      }}
                      required={imgIdx === 0}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
                <textarea
                  value={editingGallery.description || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,30,30,0.3)]"
              >
                Save Gallery Entry
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
