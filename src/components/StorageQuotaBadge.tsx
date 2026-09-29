import React, { useState, useEffect } from 'react';
import { HardDrive, Moon, Zap, Sparkles } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface StorageQuotaBadgeProps {
  currentUser: FirebaseUser;
  onOpenVacationModal?: () => void;
}

export const StorageQuotaBadge: React.FC<StorageQuotaBadgeProps> = ({ currentUser, onOpenVacationModal }) => {
  const [quota, setQuota] = useState<{
    usedBytes: number;
    quotaBytes: number;
    usagePercent: number;
    filesCount: number;
    maxSingleUploadBytes: number;
    vacationProjectsCount?: number;
    tier?: string;
  } | null>(null);

  const fetchQuota = async () => {
    try {
      const res = await fetch('/api/v1/storage/quota', {
        headers: { 'X-User-Uid': currentUser.uid }
      });
      const data = await res.json();
      if (data.success) {
        setQuota({
          usedBytes: data.used_bytes || 0,
          quotaBytes: data.quota_bytes || 100 * 1024 * 1024 * 1024 * 1024,
          usagePercent: data.usage_percent || 0,
          filesCount: data.files_count || 0,
          maxSingleUploadBytes: data.max_single_upload_bytes || 100 * 1024 * 1024 * 1024,
          vacationProjectsCount: data.vacation_projects_count || 0,
          tier: data.tier || 'UNLIMITED_ENTERPRISE'
        });
      }
    } catch {}
  };

  useEffect(() => {
    fetchQuota();
    const interval = setInterval(fetchQuota, 15000);
    return () => clearInterval(interval);
  }, [currentUser.uid]);

  if (!quota) return null;

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1)} TB`;
    }
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <button
      onClick={onOpenVacationModal}
      className="flex items-center gap-2.5 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono transition-all group shadow-sm text-left"
      title="Click to open Server Vacation & Multi-GB Engine"
    >
      <div className="flex items-center gap-1.5">
        <HardDrive className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 shrink-0" />
        <span className="hidden sm:inline text-slate-400">Disk:</span>
        <span className="text-white font-bold">{formatSize(quota.usedBytes)}</span>
        <span className="text-emerald-400 font-bold hidden md:inline">/ UNLIMITED</span>
      </div>

      <div className="hidden lg:flex items-center gap-1 bg-amber-950/60 border border-amber-800/60 rounded px-1.5 py-0.5 text-[10px] text-amber-300">
        <Moon className="w-2.5 h-2.5" />
        <span>Vacation System</span>
      </div>

      <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
        G-FILES
      </span>
    </button>
  );
};
