import React, { useState } from 'react';
import { Package, X, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ isOpen, onClose }) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      setError('Please enter a booking reference number.');
      return;
    }
    
    setError('');
    setIsSearching(true);
    setSearchResult(null);

    try {
      const ref = referenceNumber.toUpperCase().trim();
      const response = await fetch(`/api/bookings/track/${ref}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResult({
          status: data.status,
          type: data.type,
          items: data.selectedItems,
          total: data.totalEstimatedPrice,
          date: data.eventDate || data.createdAt,
          pickupReady: data.status === 'confirmed' || data.status === 'completed'
        });
      } else {
        setError('No order found with that reference number.');
      }
    } catch (err) {
      console.error("Tracking API Error", err);
      setError('An error occurred while tracking. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="absolute inset-0 z-0"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg bg-[#080808] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <h2 className="text-white font-black text-lg tracking-wide uppercase flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FF1E1E]" />
            Order Tracking
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Enter your booking reference number to check the status of your retail purchase or rental reservation.
          </p>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. TC-1234"
                  className="w-full bg-black border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF1E1E] transition-colors text-sm"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-[#FF1E1E] text-black px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_15px_rgba(255,30,30,0.3)] hover:shadow-[0_0_25px_rgba(255,30,30,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSearching ? 'Searching...' : 'Track'}
              </button>
            </div>
            {error && (
              <div className="mt-3 flex items-start gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Result Area */}
          {searchResult && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Order {referenceNumber.toUpperCase()}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-gray-300 px-2 py-1 rounded-sm">
                    {searchResult.type}
                  </span>
                </div>
                
                {searchResult.status === 'confirmed' ? (
                  <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmed
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                    Processing
                  </div>
                )}
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Order Items</h4>
                <ul className="space-y-2">
                  {(searchResult.items || []).map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-white">{item.name || item.title || 'Item'}</span>
                      <span className="text-gray-500">x{item.qty || item.quantity || 1}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-end justify-between">
                <div>
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Date</h4>
                  <p className="text-white text-sm font-bold">{searchResult.date}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total</h4>
                  <p className="text-[#FF1E1E] text-lg font-black">₱{searchResult.total.toLocaleString()}</p>
                </div>
              </div>

              {searchResult.status === 'confirmed' && searchResult.pickupReady && (
                <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-400 text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready for Pickup
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
