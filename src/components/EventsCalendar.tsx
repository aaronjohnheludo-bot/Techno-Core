import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, AlertTriangle, XCircle, Search, Filter, Sparkles, ArrowRight, ShieldCheck, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookedDateBlock, CalendarAvailabilityCheck } from '../types';
import { formatLocalDate, parseLocalDate, getTodayDateStr } from '../utils/dateUtils';

interface EventsCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onRequestQuoteForDate?: (dateStr: string) => void;
  refreshTrigger?: number;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  selectedDate,
  onSelectDate,
  onRequestQuoteForDate,
  refreshTrigger
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<BookedDateBlock[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  
  // Real-time Availability Check state for selected date
  const [availabilityCheck, setAvailabilityCheck] = useState<CalendarAvailabilityCheck | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Equipment Search filter within selected date
  const [gearSearchQuery, setGearSearchQuery] = useState('');

  // Fetch all calendar events from API
  const fetchCalendarEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const res = await fetch('/api/calendar/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, [refreshTrigger]);

  // Whenever selectedDate changes, fetch real-time availability check from backend
  useEffect(() => {
    if (!selectedDate) {
      setAvailabilityCheck(null);
      return;
    }

    const performAvailabilityCheck = async () => {
      setIsCheckingAvailability(true);
      setCheckError(null);
      try {
        const formattedDate = formatLocalDate(selectedDate);
        const res = await fetch('/api/calendar/check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: formattedDate })
        });
        if (res.ok) {
          const data: CalendarAvailabilityCheck = await res.json();
          setAvailabilityCheck(data);
        } else {
          setCheckError('Could not verify real-time date availability.');
        }
      } catch (err) {
        console.error('Availability check error:', err);
        setCheckError('Connection error during availability verification.');
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    performAvailabilityCheck();
  }, [selectedDate]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to determine status of a calendar date
  const getBookedStatusForDate = (dateStr: string) => {
    const dateEvents = events.filter(e => e.date === dateStr);
    if (dateEvents.some(e => e.status === 'fully-booked')) return 'fully-booked';
    if (dateEvents.some(e => e.status === 'partially-booked')) return 'partially-booked';
    return 'available';
  };

  // Filter events by type if user selects a filter category
  const filteredEvents = events.filter(e => {
    if (filterType !== 'All' && e.type !== filterType) return false;
    return true;
  });

  const eventTypes = ['All', 'Festival', 'Corporate', 'Concert', 'Wedding', 'Private Event', 'Rental Setup'];

  // Helper to change selected date by relative days (+1 / -1)
  const handleRelativeDateChange = (offsetDays: number) => {
    const baseDate = selectedDate || new Date();
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + offsetDays);
    onSelectDate(newDate);
    // Align month view if new date is in a different month
    if (newDate.getMonth() !== currentMonth.getMonth() || newDate.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  };

  // Calendar Day Cells rendering
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[44px] sm:min-h-[56px] border border-white/5 bg-black/20" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = formatLocalDate(dateObj);
    
    const dateEvents = filteredEvents.filter(e => e.date === dateStr);
    const status = getBookedStatusForDate(dateStr);
    
    const isSelected = selectedDate ? formatLocalDate(selectedDate) === dateStr : false;
    const isToday = formatLocalDate(new Date()) === dateStr;
    const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));

    days.push(
      <button
        key={day}
        onClick={() => {
          onSelectDate(dateObj);
          // On small screens, scroll smoothly to the date inspector panel
          if (window.innerWidth < 1024) {
            const inspectorEl = document.getElementById('selected-date-inspector');
            if (inspectorEl) {
              inspectorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }}
        className={`min-h-[44px] sm:min-h-[56px] relative flex flex-col items-center justify-between p-1 sm:p-2 border transition-all text-left overflow-hidden group rounded-lg ${
          isPast ? 'opacity-40 bg-black/40 border-white/5' : 'hover:border-[#FF1E1E]/50 hover:bg-white/5'
        } ${
          isSelected ? 'bg-[#FF1E1E]/20 border-[#FF1E1E] ring-2 ring-[#FF1E1E]/40 z-10' : 'border-white/5 bg-[#080808]'
        } ${
          isToday ? 'border-amber-500/60 font-bold' : ''
        }`}
      >
        <div className="w-full flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#FF1E1E]' : isToday ? 'text-amber-400' : 'text-gray-300'}`}>
            {day}
          </span>
          {isToday && (
            <span className="text-[7px] sm:text-[8px] font-black uppercase text-amber-400 tracking-wider bg-amber-500/10 px-1 rounded">
              Today
            </span>
          )}
        </div>

        {/* Status Indicators & Events Preview */}
        <div className="w-full space-y-0.5 mt-auto">
          {dateEvents.slice(0, 1).map((ev) => (
            <div
              key={ev.id}
              className={`text-[8px] sm:text-[9px] font-black truncate px-1 py-0.5 rounded flex items-center gap-1 ${
                ev.status === 'fully-booked'
                  ? 'bg-red-950/80 text-red-300 border border-red-500/30'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
              }`}
              title={ev.title}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ev.status === 'fully-booked' ? 'bg-red-400' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline truncate">{ev.title}</span>
            </div>
          ))}

          {dateEvents.length > 1 && (
            <div className="text-[7px] sm:text-[8px] font-black text-gray-400 tracking-wider">
              +{dateEvents.length - 1} more
            </div>
          )}

          {dateEvents.length === 0 && !isPast && (
            <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="hidden sm:inline">Available</span>
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <section id="calendar" className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-8 sm:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-3">
          <CalendarIcon className="w-3.5 h-3.5" />
          Real-Time Production Schedule
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
          Event Rental & Equipment <span className="text-[#FF1E1E]">Availability Calendar</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
          Check booked dates for sound setups, LED video walls, generators, and mega tents in Davao City. Select any date to verify live equipment stock in real-time.
        </p>
      </div>

      {/* Filter Category Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 bg-[#0a0a0a] p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[10px] sm:text-xs font-black uppercase text-gray-500 tracking-wider shrink-0 flex items-center gap-1 mr-1 sm:mr-2">
            <Filter className="w-3 h-3 text-[#FF1E1E]" /> Filter:
          </span>
          {eventTypes.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                filterType === t
                  ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_12px_rgba(255,30,30,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={fetchCalendarEvents}
          className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-gray-400 hover:text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          title="Refresh Calendar Data"
        >
          <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isLoadingEvents ? 'animate-spin text-[#FF1E1E]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Main Calendar View (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#050505] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl flex flex-col justify-between">
          
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
            <div>
              <h3 className="text-white font-black text-lg sm:text-2xl uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
                Click any day cell to run instant equipment availability check.
              </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 bg-white/5 p-1 rounded-lg sm:rounded-xl border border-white/10">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-md sm:rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-md sm:rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-wider pb-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {days}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500" />
              <span className="text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500" />
              <span className="text-gray-300">Limited Stock / Partial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-950/80 border border-red-500" />
              <span className="text-gray-300">Fully Booked</span>
            </div>
          </div>
        </div>

        {/* Selected Date Inspector & Live Availability Panel (4/5 Cols) */}
        <div id="selected-date-inspector" className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-6 scroll-mt-24">
          
          {selectedDate ? (
            <div className="bg-[#0a0a0a] border border-[#FF1E1E]/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-2xl relative overflow-hidden animate-fadeIn">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF1E1E]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#FF1E1E] tracking-wider bg-[#FF1E1E]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-[#FF1E1E]/30">
                  Selected Date Details
                </span>
                
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1 bg-white/5 p-0.5 sm:p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => handleRelativeDateChange(-1)}
                      className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                      title="Previous Day"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => handleRelativeDateChange(1)}
                      className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                      title="Next Day"
                    >
                      Next →
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const today = new Date();
                      onSelectDate(today);
                      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                    }}
                    className="text-[10px] sm:text-[11px] text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    Today
                  </button>
                </div>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight mb-1">
                {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 mb-3 sm:mb-6">Real-time status check for Techno Core warehouse equipment.</p>

              {/* Status Badge */}
              {isCheckingAvailability ? (
                <div className="flex items-center gap-2.5 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 text-[11px] sm:text-xs font-bold text-gray-300">
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-[#FF1E1E]" />
                  Checking warehouse unit counts & active quotes...
                </div>
              ) : availabilityCheck ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border flex items-center justify-between ${
                    availabilityCheck.status === 'fully-booked'
                      ? 'bg-red-950/40 border-red-500/50 text-red-200'
                      : availabilityCheck.status === 'partially-booked'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  }`}>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {availabilityCheck.status === 'fully-booked' ? (
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 shrink-0" />
                      ) : availabilityCheck.status === 'partially-booked' ? (
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
                          {availabilityCheck.status === 'fully-booked'
                            ? 'HIGH DEMAND / FULLY BOOKED'
                            : availabilityCheck.status === 'partially-booked'
                            ? 'LIMITED STOCK AVAILABLE'
                            : 'OPEN FOR BOOKINGS'}
                        </div>
                        <div className="text-[10px] sm:text-[11px] opacity-80 mt-0.5">
                          {availabilityCheck.totalBookingsOnDate > 0
                            ? `${availabilityCheck.totalBookingsOnDate} active production setup(s) on this date.`
                            : 'Full warehouse inventory available for reservation.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conflict Notice if any */}
                  {availabilityCheck.conflicts.length > 0 && (
                    <div className="p-2.5 sm:p-3 bg-red-950/30 border border-red-500/30 rounded-lg sm:rounded-xl text-[11px] sm:text-xs text-red-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Availability Warning:
                      </div>
                      {availabilityCheck.conflicts.map((conf, idx) => (
                        <p key={idx} className="text-[10px] sm:text-[11px] text-red-200/90 pl-4">
                          • {conf}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Events scheduled on this date */}
                  {availabilityCheck.eventsOnDate.length > 0 && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                        Scheduled Events ({availabilityCheck.eventsOnDate.length}):
                      </div>
                      <div className="space-y-1.5 sm:space-y-2 max-h-48 overflow-y-auto scrollbar-none pr-1">
                        {availabilityCheck.eventsOnDate.map(ev => (
                          <div key={ev.id} className="bg-white/5 border border-white/10 p-2.5 sm:p-3 rounded-lg sm:rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#FF1E1E] bg-[#FF1E1E]/10 px-1.5 py-0.5 rounded">
                                {ev.type}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold">{ev.location}</span>
                            </div>
                            <h5 className="font-bold text-xs sm:text-sm text-white">{ev.title}</h5>
                            {ev.notes && <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{ev.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button: Book for this date */}
                  <button
                    onClick={() => {
                      if (onRequestQuoteForDate) {
                        onRequestQuoteForDate(formatLocalDate(selectedDate));
                      }
                    }}
                    className="w-full bg-[#FF1E1E] text-black font-black text-[11px] sm:text-xs uppercase tracking-wider py-2.5 sm:py-3.5 px-3 rounded-lg sm:rounded-xl hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(255,30,30,0.4)] flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Request Quote for {selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#FF1E1E]">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="text-white font-bold text-xs sm:text-base uppercase">Select a Date to Check Real-Time Stock</h4>
              <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                Click any calendar date to view scheduled concerts, weddings, and corporate setups or lock in your preferred date for rentals.
              </p>
            </div>
          )}

          {/* Upcoming High-Profile Events List */}
          <div className="bg-[#050505] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-6">
            <h3 className="text-white font-black text-sm sm:text-lg tracking-wide uppercase mb-3 sm:mb-4 flex items-center justify-between">
              <span>Upcoming Setups</span>
              <span className="text-[10px] sm:text-xs text-[#FF1E1E] font-bold">{events.length} Total</span>
            </h3>

            <div className="space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto scrollbar-none">
              {events.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  onClick={() => onSelectDate(parseLocalDate(event.date))}
                  className="group bg-white/5 border border-white/10 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:border-[#FF1E1E]/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] sm:text-[9px] font-black text-[#FF1E1E] uppercase tracking-wider bg-[#FF1E1E]/10 px-1.5 py-0.5 rounded">
                      {event.type}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] sm:text-xs font-bold">
                      <Clock className="w-3 h-3" />
                      {parseLocalDate(event.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <h4 className="text-white font-bold text-xs sm:text-sm leading-tight mb-1 group-hover:text-[#FF1E1E] transition-colors">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-[11px]">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
