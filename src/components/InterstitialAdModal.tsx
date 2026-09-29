import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, ShieldCheck, Flame, Zap, CheckCircle2, Play, Award } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actionName?: string;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
  title = 'Sponsored High-Speed Server Sponsor',
  actionName = 'Action'
}) => {
  const [countdown, setCountdown] = useState(2);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(2);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const directOfferUrl = 'https://www.profitableratecpmnetwork.com/wbyn58m2g2?key=d321cd8c66f15a0987561b26c7c6750a';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        {/* Top Monetization Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-3 text-slate-950 flex items-center justify-between font-black text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 fill-slate-950" />
            <span className="tracking-wide uppercase">⚡ ULTRA-SPEED SPONSORED INTERSTITIAL</span>
          </div>

          <div className="flex items-center gap-2">
            {canSkip ? (
              <button
                onClick={onClose}
                className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-black hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <span>Continue to {actionName}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="px-2.5 py-0.5 bg-slate-950/20 text-slate-950 rounded-md font-mono font-bold text-xs">
                Reward Ready in {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>High-Speed Dedicated Cloud Host (₹5,000 Special Deal)</span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            Exclusive Developer Bonus &amp; Unlimited Bandwidth
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Support KAVO 24/7 Hosting Engine by visiting our verified partner. Unlock instant turbo compilation and unlimited storage nodes.
          </p>

          {/* Primary High-Yield Ad Units */}
          <div className="my-3 flex flex-col items-center justify-center gap-2">
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 p-1">
              <AdBanner slot="sidebar_300" title="High eCPM Sponsored Unit" showDirectLink={true} />
            </div>
          </div>

          {/* Direct CTA Button */}
          <a
            href={directOfferUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // Auto unlock after clicking offer
              setTimeout(onClose, 500);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>CLAIM ₹5,000 HIGH SPEED DEAL &amp; UNLOCK</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-2 pt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>100% Verified Mediation Adapter &bull; Zero Delay Execution</span>
          </div>
        </div>
      </div>
    </div>
  );
};
