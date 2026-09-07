import React, { useState } from 'react';
import { Sparkles, Zap, CheckCircle2, ArrowRight, Loader2, Info, AlertTriangle, ShieldCheck, Globe, ExternalLink } from 'lucide-react';
import { AiQuoteRecommendation } from '../types';

interface AiEventAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAiQuote: (rec: AiQuoteRecommendation) => void;
}

export const AiEventAdvisorModal: React.FC<AiEventAdvisorModalProps> = ({
  isOpen,
  onClose,
  onApplyAiQuote
}) => {
  const [eventType, setEventType] = useState('Wedding Reception');
  const [guestCount, setGuestCount] = useState('200 Guests');
  const [venueLocation, setVenueLocation] = useState('Eden Nature Park, Davao City');
  const [isOutdoor, setIsOutdoor] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('Need aircon mega tent and LED video wall for outdoor reception.');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AiQuoteRecommendation | null>(null);

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

  const handleGenerateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          guestCount,
          venueLocation,
          isOutdoor,
          specialRequests
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate recommendation');
      }
      setRecommendation(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to Gemini AI server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#050505] border border-[#FF1E1E]/50 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 shadow-2xl animate-scaleIn my-auto scrollbar-thin">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#FF1E1E] animate-pulse" />
              <span>Gemini AI Event & Gear Advisor</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Instant Event Setup & Quote Estimator
            </h3>
            <p className="text-xs text-gray-400">
              Powered by Google Gemini on Techno Core server. Calculates sound, lighting, LED size, generator kVA & budget in Davao.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-sm bg-white/5 border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Form Inputs */}
        {!recommendation ? (
          <form onSubmit={handleGenerateRecommendation} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                >
                  <option value="Wedding Reception">Wedding Reception / Debut</option>
                  <option value="Corporate Summit / Gala">Corporate Summit / Gala / Expo</option>
                  <option value="Concert & Festival">Live Concert & Festival / Fiesta</option>
                  <option value="Church & Ministry Event">Church & Ministry Sound Setup</option>
                  <option value="Private Birthday / Party">Private Birthday / Pool Party</option>
                  <option value="Retail Gear Purchase">Retail Sound System / Instrument Buying</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Estimated Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF1E1E]"
                >
                  <option value="50 to 100 Guests">50 to 100 Guests (Intimate)</option>
                  <option value="150 to 300 Guests">150 to 300 Guests (Medium Ballroom/Garden)</option>
                  <option value="350 to 700 Guests">350 to 700 Guests (Large Convention)</option>
                  <option value="1,000+ Guests">1,000+ Guests (Arena / Open Field)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Venue & City / Province
                </label>
                <input
                  type="text"
                  value={venueLocation}
                  onChange={(e) => setVenueLocation(e.target.value)}
                  placeholder="e.g. SMX Convention Center Davao, Pearl Farm Samal, GenSan"
                  className="w-full bg-[#050505] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Venue Setting
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="radio"
                      checked={isOutdoor}
                      onChange={() => setIsOutdoor(true)}
                      className="accent-[#FF1E1E]"
                    />
                    <span>Outdoor (Requires Genset/Mega Tent)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="radio"
                      checked={!isOutdoor}
                      onChange={() => setIsOutdoor(false)}
                      className="accent-[#FF1E1E]"
                    />
                    <span>Indoor (Aircon Ballroom)</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Specific Preferences / Special Needs
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                placeholder="Mention any specific LED screen size, aircon tent requirements, low fog dance floor effect, or musical backline gear..."
                className="w-full bg-[#050505] border border-white/10 rounded-sm p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E1E]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/80 border border-red-700/60 rounded-sm text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF1E1E] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-sm bg-[#FF1E1E] hover:bg-[#FF1E1E]/90 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,30,30,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Calculating Power kVA, Sound Rig & PHP Quote...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Generate Recommended Production Package</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* AI Output Breakdown */
          <div className="space-y-6 animate-fadeIn">
            
            <div className="p-4 bg-white/5 rounded-2xl border border-[#FF1E1E]/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#FF1E1E] uppercase tracking-widest">
                <span>Executive AI Recommendation</span>
                <span className="text-gray-400">Estimated PHP Range:</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-200 font-medium max-w-lg">
                  {recommendation.summary}
                </p>
                <div className="text-xl font-black text-amber-400 shrink-0">
                  {recommendation.estimatedPricePhpRange}
                </div>
              </div>
            </div>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#050505] p-3 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Generator Power</div>
                <div className="text-sm font-black text-white mt-0.5">{recommendation.recommendedGeneratorKva}</div>
              </div>

              <div className="bg-[#050505] p-3 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Tent Structure</div>
                <div className="text-sm font-black text-white mt-0.5">{recommendation.recommendedTentSize}</div>
              </div>

              <div className="bg-[#050505] p-3 rounded-xl border border-white/10 text-center">
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">LED Video Screen</div>
                <div className="text-sm font-black text-white mt-0.5">{recommendation.recommendedLedWallSize}</div>
              </div>
            </div>

            {/* Equipment Items */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Itemized Recommended Equipment:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {recommendation.equipmentList.map((eq, i) => (
                  <div key={i} className="p-2.5 bg-[#050505] rounded-xl border border-white/10 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white uppercase">{eq.item} <span className="text-[#FF1E1E]">({eq.qty})</span></div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{eq.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Davao Venue Pro-Tips */}
            <div className="p-3 bg-[#050505] rounded-xl border border-white/10 text-xs space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
                <Info className="w-4 h-4" />
                <span>Davao Venue Logistics Pro-Tips:</span>
              </div>
              <ul className="list-disc list-inside text-gray-300 text-[11px] space-y-0.5 pl-1">
                {recommendation.proTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Google Search Grounding Sources */}
            {recommendation.groundingSources && recommendation.groundingSources.length > 0 && (
              <div className="p-3 bg-blue-950/20 rounded-xl border border-blue-500/30 text-xs space-y-1.5">
                <div className="font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
                  <Globe className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>Google Search Grounding Data Sources:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {recommendation.groundingSources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-md text-[11px] text-blue-300 hover:text-white transition-all"
                    >
                      <span className="truncate max-w-[200px]">{source.title || source.uri}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setRecommendation(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest bg-white/5 text-gray-300 border border-white/10"
              >
                Re-Calculate
              </button>
              <button
                onClick={() => {
                  onApplyAiQuote(recommendation);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest bg-[#FF1E1E] text-black shadow-[0_0_20px_rgba(255,30,30,0.4)] flex items-center justify-center gap-2"
              >
                <span>Apply Recommendation to Booking Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
