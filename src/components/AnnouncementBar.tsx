import React from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { CMSData } from '../types';

interface AnnouncementBarProps {
  cms: CMSData;
  onOpenAiAdvisor: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ cms, onOpenAiAdvisor }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (!cms.announcementBanner.enabled || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white px-4 py-2 text-xs md:text-sm font-medium relative shadow-inner z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 mx-auto text-center md:text-left">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse hidden sm:inline-block shrink-0" />
          <span>{cms.announcementBanner.text}</span>
          {cms.announcementBanner.linkText && (
            <button
              onClick={onOpenAiAdvisor}
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-amber-200 transition-colors font-semibold ml-2"
            >
              {cms.announcementBanner.linkText}
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
