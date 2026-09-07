import React, { useState } from 'react';
import { ShoppingBag, Trash2, CheckCircle2, Send, PhoneCall, ArrowRight, MessageSquare, Loader2, Mail, Printer } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  type: 'retail' | 'rental' | 'package';
  price: number;
  quantity: number;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onBookingSubmitted: () => void;
  initialEventDate?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBookingSubmitted,
  initialEventDate
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState(initialEventDate || '');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [venueLocation, setVenueLocation] = useState('');
  const [guestCount, setGuestCount] = useState('150-300 Guests');
  const [budgetRange, setBudgetRange] = useState('₱50,000 - ₱100,000');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialEventDate) {
      setEventDate(initialEventDate);
    }
  }, [initialEventDate]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalEstimatedPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: cart.some((i) => i.type === 'retail') ? 'retail' : 'rental',
          customerName,
          email,
          phone,
          eventDate,
          eventType,
          venueLocation,
          guestCount,
          selectedItems: cart,
          totalEstimatedPrice,
          budgetRange,
          notes
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit quote request');
      }

      setIsSuccess(true);
      onClearCart();
      onBookingSubmitted();
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#050505] border border-white/10 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 shadow-2xl animate-scaleIn my-auto scrollbar-thin">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#FF1E1E] tracking-widest">
              Techno Core Davao
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5">
              {isSuccess ? 'Quote Request Sent!' : 'Event Quote & Order Request'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 transition-colors uppercase tracking-widest font-bold"
              title="Print to PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-sm bg-white/5 border border-white/10"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight">Thank You, {customerName}!</h4>
            <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
              Your quote request has been transmitted directly to our Davao FOH engineering team. We will call/SMS you at <strong className="text-[#FF1E1E]">{phone}</strong> within 1 hour.
            </p>

            {/* Email Dispatch Status Box */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="font-bold text-[#FF1E1E] flex items-center gap-2 uppercase text-[10px] tracking-wider">
                <Mail className="w-4 h-4 text-[#FF1E1E]" />
                <span>Confirmation Emails Dispatched</span>
              </div>
              <div className="space-y-1 text-gray-300 text-[11px]">
                <div className="flex items-center justify-between">
                  <span>• Customer Copy:</span>
                  <span className="font-semibold text-white">{email ? email : 'Phone contact (No email provided)'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Admin Copy:</span>
                  <span className="font-semibold text-emerald-400">Sent to FOH Team</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100063789922270"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Official Facebook Page</span>
              </a>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-sm bg-white/5 text-gray-300 font-bold text-xs uppercase tracking-widest border border-white/10"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            {/* Cart Items Summary */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Selected Items & Services ({cart.length})</span>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[#FF1E1E] hover:underline text-[10px] font-bold uppercase tracking-widest"
                  >
                    Clear List
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-500">
                  No items selected yet. You can still submit a custom event quote request below!
                </div>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#050505] rounded-xl border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5 max-w-[60%]">
                        <div className="font-bold text-white uppercase tracking-tight truncate">{item.name}</div>
                        <div className="text-[10px] text-[#FF1E1E] uppercase font-mono">{item.type}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/10 text-white font-bold">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="text-gray-400 hover:text-white px-1"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="text-gray-400 hover:text-white px-1"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-black text-white shrink-0">
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-500 hover:text-[#FF1E1E] p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gray-300">
                  <span className="uppercase tracking-widest text-[10px]">Subtotal Estimated Items:</span>
                  <span className="text-base text-white font-black">₱{totalEstimatedPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase text-[#FF1E1E] tracking-widest">
                Contact & Event Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Juan dela Cruz"
                    className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Mobile / Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0917 123 4567"
                    className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. juan@gmail.com"
                    className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Target Event Date *
                    </label>
                    {initialEventDate && eventDate === initialEventDate && (
                      <span className="text-[9px] font-bold text-[#FF1E1E] bg-[#FF1E1E]/10 px-1.5 py-0.5 rounded border border-[#FF1E1E]/30">
                        Selected from Calendar
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    placeholder="e.g. SMX Davao / Eden Nature Park / GenSan"
                    className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Estimated Guest Count
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <option value="Under 100 Guests">Under 100 Guests</option>
                    <option value="150-300 Guests">150-300 Guests</option>
                    <option value="350-700 Guests">350-700 Guests</option>
                    <option value="1,000+ Attendees">1,000+ Attendees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Additional Notes / Custom Equipment Needs
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Tell us any specific requirements e.g. aircon tent size, generator kVA, low smoke, wireless mics..."
                  className="w-full bg-[#050505] border border-white/10 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/80 border border-red-700 rounded-sm text-xs text-red-300 font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-widest bg-white/5 text-gray-300 border border-white/10"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,30,30,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Submitting Quote...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    <span>Submit Official Quote Request</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* Printable Summary Layout (Hidden on Screen, Visible on Print) */}
        <div className="hidden print-summary text-black bg-white min-h-screen">
          <div className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-black uppercase mb-1">Techno Core Davao</h1>
            <p className="text-sm font-medium">Event Quote &amp; Order Request Summary</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3 uppercase">Client Details</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {customerName || 'N/A'}</p>
                <p><strong>Phone:</strong> {phone || 'N/A'}</p>
                <p><strong>Email:</strong> {email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3 uppercase">Event Details</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Type:</strong> {eventType || 'N/A'}</p>
                <p><strong>Date:</strong> {eventDate || 'N/A'}</p>
                <p><strong>Venue:</strong> {venueLocation || 'N/A'}</p>
                <p><strong>Guests:</strong> {guestCount}</p>
                <p><strong>Budget Range:</strong> {budgetRange}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3 uppercase">Requested Items</h2>
            {cart.length === 0 ? (
              <p className="text-sm italic">No items selected.</p>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="py-2 px-3 uppercase font-bold">Item</th>
                    <th className="py-2 px-3 uppercase font-bold">Type</th>
                    <th className="py-2 px-3 uppercase font-bold text-center">Qty</th>
                    <th className="py-2 px-3 uppercase font-bold text-right">Price</th>
                    <th className="py-2 px-3 uppercase font-bold text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium">{item.name}</td>
                      <td className="py-2 px-3 uppercase text-xs text-gray-500">{item.type}</td>
                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">₱{item.price.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-bold">₱{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-black">
                    <td colSpan={4} className="py-3 px-3 text-right font-bold uppercase">Estimated Subtotal:</td>
                    <td className="py-3 px-3 text-right font-black text-lg">₱{totalEstimatedPrice.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {notes && (
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3 uppercase">Additional Notes</h2>
              <p className="text-sm bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap">{notes}</p>
            </div>
          )}
          
          <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
            Printed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>

      </div>
    </div>
  );
};
