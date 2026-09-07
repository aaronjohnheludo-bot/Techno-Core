import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Sparkles,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Save,
  X,
  ShieldAlert,
  Info,
  Check
} from 'lucide-react';
import { RentalService, BookingRequest, BookedDateBlock } from '../types';

interface AdminCalendarViewProps {
  rentalServices: RentalService[];
  bookings: BookingRequest[];
  onRefreshData: () => void;
}

export const AdminCalendarView: React.FC<AdminCalendarViewProps> = ({
  rentalServices,
  bookings,
  onRefreshData
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<BookedDateBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');

  // Selected date state for Admin Inspector / Event Creator
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modal / Drawer state for adding or editing a calendar event block
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<BookedDateBlock> | null>(null);
  
  // Conflict warning state for modal form
  const [formConflicts, setFormConflicts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Fetch calendar events from server
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/calendar/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load admin calendar events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Open modal to add a new date block
  const handleOpenAddModal = (dateToUse?: string) => {
    const targetDate = dateToUse || selectedDateStr;
    setEditingEvent({
      date: targetDate,
      title: '',
      type: 'Rental Setup',
      location: 'Davao City',
      status: 'fully-booked',
      notes: '',
      serviceIds: []
    });
    setFormConflicts([]);
    setIsModalOpen(true);
  };

  // Open modal to edit existing block
  const handleOpenEditModal = (event: BookedDateBlock) => {
    setEditingEvent({ ...event });
    setFormConflicts([]);
    setIsModalOpen(true);
  };

  // Delete calendar event block
  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this date block? This will reopen the date for rentals.')) {
      try {
        const res = await fetch(`/api/calendar/events/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchEvents();
          onRefreshData();
        }
      } catch (err) {
        console.error('Failed to delete date block:', err);
      }
    }
  };

  // Save calendar event block with conflict check
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title || !editingEvent.date) return;

    setIsSaving(true);
    setSaveSuccessNotice(null);

    try {
      const isExisting = !!editingEvent.id;
      const url = isExisting ? `/api/calendar/events/${editingEvent.id}` : '/api/calendar/events';
      const method = isExisting ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent)
      });

      const data = await res.json();
      if (res.ok) {
        if (data.conflicts && data.conflicts.length > 0) {
          setFormConflicts(data.conflicts);
        }
        setSaveSuccessNotice(`Date block saved successfully for ${editingEvent.date}`);
        fetchEvents();
        onRefreshData();
        setTimeout(() => {
          setIsModalOpen(false);
          setEditingEvent(null);
          setSaveSuccessNotice(null);
        }, 1200);
      } else {
        alert(data.error || 'Failed to save date block.');
      }
    } catch (err) {
      console.error('Failed to save date block:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle service selection in form
  const handleToggleService = (serviceId: string) => {
    if (!editingEvent) return;
    const currentServices = editingEvent.serviceIds || [];
    if (currentServices.includes(serviceId)) {
      setEditingEvent({
        ...editingEvent,
        serviceIds: currentServices.filter(id => id !== serviceId)
      });
    } else {
      setEditingEvent({
        ...editingEvent,
        serviceIds: [...currentServices, serviceId]
      });
    }
  };

  // Calculate month days
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-16 sm:h-20 border border-white/5 bg-black/40" />);
  }

  // Conflict calculation across entire month for overview alert
  const upcomingConflictsList: { date: string; message: string; count: number }[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = dateObj.toISOString().split('T')[0];

    const dayBookings = bookings.filter(b => b.eventDate?.includes(dateStr) && b.status !== 'cancelled');
    const dayEvents = events.filter(e => e.date === dateStr);

    // Conflict criteria: >2 bookings on same date or explicitly marked fully-booked with additional booking inquiries
    if (dayBookings.length > 1 && dayEvents.some(e => e.status === 'fully-booked')) {
      upcomingConflictsList.push({
        date: dateStr,
        message: `${dayBookings.length} customer quotes overlap with an explicitly fully-booked schedule.`,
        count: dayBookings.length
      });
    }

    const isSelected = selectedDateStr === dateStr;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div
        key={day}
        onClick={() => setSelectedDateStr(dateStr)}
        className={`h-16 sm:h-20 p-2 border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
          isSelected
            ? 'bg-[#FF1E1E]/20 border-[#FF1E1E] ring-2 ring-[#FF1E1E]/40 z-10'
            : 'border-white/5 bg-[#080808] hover:bg-white/5 hover:border-white/20'
        } ${isToday ? 'border-amber-500/60' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${isSelected ? 'text-[#FF1E1E]' : isToday ? 'text-amber-400 font-black' : 'text-gray-300'}`}>
            {day}
          </span>
          {dayBookings.length > 0 && (
            <span className="text-[8px] font-black uppercase text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/30">
              {dayBookings.length} Quote{dayBookings.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Date Blocks Render */}
        <div className="space-y-1">
          {dayEvents.map(ev => (
            <div
              key={ev.id}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEditModal(ev);
              }}
              className={`text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded truncate transition-transform hover:scale-[1.02] ${
                ev.status === 'fully-booked'
                  ? 'bg-red-950/90 text-red-300 border border-red-500/40'
                  : 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
              }`}
              title={`${ev.title} (Click to Edit)`}
            >
              {ev.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Selected date details
  const selectedDateEvents = events.filter(e => e.date === selectedDateStr);
  const selectedDateBookings = bookings.filter(b => b.eventDate?.includes(selectedDateStr) && b.status !== 'cancelled');

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#FF1E1E]" />
              Event Calendar & Equipment Conflicts Manager
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage booked dates, track venue sound/lighting deployments, and resolve rental equipment overbooking conflicts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenAddModal(selectedDateStr)}
            className="px-4 py-2.5 rounded-xl bg-[#FF1E1E] text-black font-black text-xs uppercase tracking-wider hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(255,30,30,0.4)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Mark Date as Booked
          </button>

          <button
            onClick={() => { fetchEvents(); onRefreshData(); }}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh Calendar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF1E1E]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Conflict Alert Box if conflicts exist in current month */}
      {upcomingConflictsList.length > 0 && (
        <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-xl animate-fadeIn">
          <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-black text-red-300 uppercase tracking-wider flex items-center gap-2">
              Overbooking & Schedule Conflict Alerts ({upcomingConflictsList.length} Date{upcomingConflictsList.length > 1 ? 's' : ''})
            </h4>
            <p className="text-xs text-red-200/80 mt-1">
              The following dates have overlapping customer quotes and booked event production schedules:
            </p>
            <div className="mt-3 space-y-2">
              {upcomingConflictsList.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-red-500/30 text-xs">
                  <div>
                    <span className="font-bold text-red-400 mr-2">{c.date}:</span>
                    <span className="text-gray-300">{c.message}</span>
                  </div>
                  <button
                    onClick={() => setSelectedDateStr(c.date)}
                    className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 text-[10px] font-bold uppercase hover:bg-red-500/40"
                  >
                    Inspect Date
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Calendar View (8 Cols) + Inspector (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
            <h3 className="text-white font-black text-lg uppercase tracking-wider">
              {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </h3>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button onClick={handlePrevMonth} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest pb-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 flex-1">
            {days}
          </div>
        </div>

        {/* Selected Date Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] font-black text-[#FF1E1E] uppercase tracking-widest">
                  Date Inspector
                </span>
                <h3 className="text-lg font-black text-white uppercase mt-0.5">
                  {new Date(selectedDateStr).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              <button
                onClick={() => handleOpenAddModal(selectedDateStr)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase flex items-center gap-1.5"
                title="Mark this date"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF1E1E]" />
                Add Event
              </button>
            </div>

            {/* Booked Date Blocks for Selected Date */}
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Marked Production Schedules ({selectedDateEvents.length}):
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center text-xs text-gray-500">
                  No explicit calendar blocks saved on this date.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-none pr-1">
                  {selectedDateEvents.map(ev => (
                    <div key={ev.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 relative group">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          ev.status === 'fully-booked' ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {ev.type}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(ev)}
                            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded"
                            title="Edit Date Block"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded"
                            title="Delete Date Block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF1E1E]" /> {ev.location}
                      </div>
                      {ev.notes && <p className="text-[11px] text-gray-400 pt-1 border-t border-white/5">{ev.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Bookings on Selected Date */}
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Customer Inquiries & Quotes ({selectedDateBookings.length}):
              </div>

              {selectedDateBookings.length === 0 ? (
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center text-xs text-gray-500">
                  No customer quote requests for this date.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-none pr-1">
                  {selectedDateBookings.map(b => (
                    <div key={b.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {b.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">₱{b.totalEstimatedPrice.toLocaleString()}</span>
                      </div>
                      <div className="font-bold text-xs text-white">{b.customerName}</div>
                      <div className="text-[11px] text-gray-400">{b.venueLocation || 'Davao City'}</div>
                      <div className="text-[10px] text-gray-500">Phone: {b.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Add / Edit Calendar Date Block Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#FF1E1E]" />
                <h3 className="font-black text-lg text-white uppercase tracking-wider">
                  {editingEvent.id ? 'Edit Calendar Date Block' : 'Mark Date as Booked / Reserved'}
                </h3>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setEditingEvent(null); }}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessNotice && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {saveSuccessNotice}
              </div>
            )}

            {formConflicts.length > 0 && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 space-y-1">
                <div className="font-black text-red-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> Overbooking / Conflict Warning:
                </div>
                {formConflicts.map((c, i) => (
                  <p key={i} className="text-[11px] pl-5">• {c}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Event Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Booking Availability Status
                  </label>
                  <select
                    value={editingEvent.status || 'fully-booked'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as any })}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <option value="fully-booked">Fully Booked / Blocked</option>
                    <option value="partially-booked">Partially Booked / Limited Stock</option>
                    <option value="available">Available</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Event Title / Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadayawan Sound Stage & LED Wall Setup"
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Event Type Category
                  </label>
                  <select
                    value={editingEvent.type || 'Rental Setup'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as any })}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <option value="Festival">Festival</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Concert">Concert</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Private Event">Private Event</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Rental Setup">Rental Setup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SMX Convention Center, Davao"
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              {/* Associated Rental Equipment Checklist */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Associated Rental Equipment Deployment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto scrollbar-none p-2 bg-black/40 rounded-xl border border-white/5">
                  {rentalServices.map(service => {
                    const isChecked = (editingEvent.serviceIds || []).includes(service.id);
                    return (
                      <label
                        key={service.id}
                        onClick={() => handleToggleService(service.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs border transition-colors ${
                          isChecked ? 'bg-[#FF1E1E]/20 border-[#FF1E1E] text-white font-bold' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-[#FF1E1E] border-[#FF1E1E] text-black' : 'border-gray-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{service.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Logistics & Production Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, transport logistics, generator requirements..."
                  value={editingEvent.notes || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, notes: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingEvent(null); }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#FF1E1E] text-black font-black text-xs uppercase tracking-wider hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(255,30,30,0.4)] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving Block...' : 'Save Date Block'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
