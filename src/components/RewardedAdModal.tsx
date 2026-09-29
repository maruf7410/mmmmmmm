import React, { useState, useEffect } from 'react';
import { Award, Zap, Sparkles, ExternalLink, X, CheckCircle2, Play, Flame, ShieldCheck } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface RewardedAdModalProps {
  isOpen: boolean;
  onRewardComplete: () => void;
  onCancel: () => void;
  featureName?: string;
  bonusText?: string;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onRewardComplete,
  onCancel,
  featureName = 'High-Speed Action',
  bonusText = '24/7 Unlimited Resources & Instant Turbo Deployment'
}) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsCompleted(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const directOfferUrl = 'https://www.profitableratecpmnetwork.com/wbyn58m2g2?key=d321cd8c66f15a0987561b26c7c6750a';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-extrabold text-sm uppercase tracking-wider">REWARDED TURBO UNLOCK</span>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              Unlock {featureName} at Max 10x Performance
            </h3>
            <p className="text-xs text-slate-300 mt-1">{bonusText}</p>
          </div>

          {/* Ad Slot */}
          <div className="my-2 p-2 bg-slate-950 rounded-2xl border border-slate-800">
            <AdBanner slot="sidebar_300" title="Sponsored Rewarded Partner" showDirectLink={true} />
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Unlocking reward status...</span>
              <span className="font-bold text-emerald-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={directOfferUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onRewardComplete();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>CLAIM ₹5,000 PARTNER REWARD &amp; PROCEED</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onRewardComplete}
              disabled={!isCompleted}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isCompleted ? '✓ Instant Access (Reward Ready)' : `Waiting for verification (${100 - progress}%)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
