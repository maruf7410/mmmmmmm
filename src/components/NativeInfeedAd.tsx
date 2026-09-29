import React from 'react';
import { Sparkles, ExternalLink, Zap, Flame, ShieldCheck } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface NativeInfeedAdProps {
  layout?: 'card' | 'row' | 'banner';
  title?: string;
}

export const NativeInfeedAd: React.FC<NativeInfeedAdProps> = ({
  layout = 'card',
  title = 'Sponsored Developer Cloud Node (Special Deal)'
}) => {
  const directOfferUrl = 'https://www.profitableratecpmnetwork.com/wbyn58m2g2?key=d321cd8c66f15a0987561b26c7c6750a';

  if (layout === 'row') {
    return (
      <tr className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-y-2 border-amber-400/40">
        <td colSpan={5} className="py-2.5 px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                SPONSORED
              </span>
              <span className="font-bold text-xs text-amber-900 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Ultra High-Speed Cloud Node &bull; Claim ₹5,000 Special Hosting Credit</span>
              </span>
            </div>

            <a
              href={directOfferUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg transition-transform hover:scale-105"
            >
              <span>CLAIM OFFER</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-100/60 border-2 border-amber-400/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
        <Zap className="w-2.5 h-2.5 fill-slate-950" />
        <span>SPONSORED HIGH-CPM</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
            🔥
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">{title}</h3>
            <span className="text-[10px] font-mono text-amber-700 font-bold">100% Guaranteed Uptime Node</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-3">
          Deploy high-performance Python bots, dynamic websites, and instant databases with zero throttling.
        </p>

        <div className="w-full overflow-hidden my-2 flex justify-center">
          <AdBanner slot="sidebar_300" title="Featured Partner" showDirectLink={false} />
        </div>
      </div>

      <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
        <span className="text-[10px] text-amber-800 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Instant Cloud Activation
        </span>

        <a
          href={directOfferUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Claim ₹5,000 Deal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
