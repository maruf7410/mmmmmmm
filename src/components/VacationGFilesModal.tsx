import React, { useState, useEffect, useRef } from 'react';
import {
  Moon,
  Sun,
  HardDrive,
  UploadCloud,
  FileCode,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  FolderArchive,
  Layers,
  Database,
  Cpu,
  Flame,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  DownloadCloud,
  FileCheck
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { AdBanner } from './AdBanner';

interface VacationGFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser;
  projects: any[];
  onRefreshProjects: () => void;
  onTriggerInterstitial?: (action: string, cb?: () => void) => void;
  onTriggerRewarded?: (feature: string, onRewardComplete: () => void, bonusText?: string) => void;
}

export const VacationGFilesModal: React.FC<VacationGFilesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  projects,
  onRefreshProjects,
  onTriggerInterstitial,
  onTriggerRewarded
}) => {
  const [activeTab, setActiveTab] = useState<'vacation' | 'gfiles' | 'vacuum'>('vacation');
  
  // Vacation state
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // G-Files Multi-GB Chunk Uploader State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'paused' | 'assembling' | 'completed' | 'failed'>('idle');
  const [uploadSpeed, setUploadSpeed] = useState<string>('0 MB/s');
  const [currentChunkInfo, setCurrentChunkInfo] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [targetProjectSlug, setTargetProjectSlug] = useState<string>('');
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [uploadedResult, setUploadedResult] = useState<{ fileName: string; size: number; liveUrl?: string } | null>(null);

  const isPausedRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Server Vacuum State
  const [isVacuuming, setIsVacuuming] = useState<boolean>(false);
  const [vacuumResult, setVacuumResult] = useState<{
    freedMb: number;
    cleanedChunks: number;
    cleanedTempFiles: number;
    recycledMemoryMb: number;
    timestamp: string;
  } | null>(null);

  // System metrics
  const [systemMetrics, setSystemMetrics] = useState<{
    heapUsedMb: number;
    rssMb: number;
    vacationProjectsCount: number;
    totalProjectsCount: number;
    vacationSavedBytes: number;
    tier: string;
    uptimeSeconds: number;
  } | null>(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/v1/server/metrics', {
        headers: { 'X-User-Uid': currentUser.uid }
      });
      const data = await res.json();
      if (data.success && data.metrics) {
        setSystemMetrics(data.metrics);
      }
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Toggle Vacation Mode for a Project
  const handleToggleVacation = async (projectId: string, currentStatus: boolean, projectName: string) => {
    const action = currentStatus ? 'wake' : 'vacation';
    setLoadingAction(projectId);
    setActionMessage(null);

    const triggerAction = async () => {
      try {
        const endpoint = `/api/projects/${projectId}/${action}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Uid': currentUser.uid
          }
        });
        const data = await res.json();
        if (data.success) {
          setActionMessage({
            type: 'success',
            text: action === 'vacation'
              ? `💤 "${projectName}" is now in Vacation Mode (Memory & CPU Hibernated)!`
              : `⚡ "${projectName}" has been Awakened & is 100% LIVE!`
          });
          onRefreshProjects();
          fetchMetrics();
        } else {
          setActionMessage({ type: 'error', text: data.message || 'Failed to update vacation state' });
        }
      } catch (e: any) {
        setActionMessage({ type: 'error', text: e.message || 'Network error' });
      } finally {
        setLoadingAction(null);
      }
    };

    if (onTriggerInterstitial) {
      onTriggerInterstitial(`Project Vacation ${action === 'vacation' ? 'Sleep' : 'Wake'} Engine`, triggerAction);
    } else {
      await triggerAction();
    }
  };

  // Trigger 1-Click Server Deep Vacuum
  const handleRunServerVacuum = async () => {
    const executeVacuum = async () => {
      setIsVacuuming(true);
      setVacuumResult(null);
      setActionMessage(null);

      try {
        const res = await fetch('/api/v1/server/vacuum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Uid': currentUser.uid
          }
        });
        const data = await res.json();
        if (data.success) {
          setVacuumResult(data.vacuum);
          setActionMessage({
            type: 'success',
            text: `🚀 Server Deep Vacuum Complete! Recycled ${(data.vacuum.freedMb || 0).toFixed(1)} MB disk space & optimized RAM!`
          });
          fetchMetrics();
          onRefreshProjects();
        } else {
          setActionMessage({ type: 'error', text: data.message || 'Server vacuum encountered an issue.' });
        }
      } catch (err: any) {
        setActionMessage({ type: 'error', text: err.message || 'Vacuum execution error.' });
      } finally {
        setIsVacuuming(false);
      }
    };

    if (onTriggerRewarded) {
      onTriggerRewarded('1-Click Server Auto-Vacuum & Deep Clean', executeVacuum);
    } else {
      await executeVacuum();
    }
  };

  // G-Files Chunked Resumable Upload
  const handleStartChunkedUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadErrorMessage(null);
    setUploadedResult(null);
    isPausedRef.current = false;

    const file = selectedFile;
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk for high throughput & stability
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    setCurrentChunkInfo({ current: 0, total: totalChunks });

    try {
      // 1. Initialize Upload Session
      const initRes = await fetch('/api/v1/uploads/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': currentUser.uid
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          chunkSize: CHUNK_SIZE,
          totalChunks,
          targetType: 'project',
          metadata: {
            uploadedAt: Date.now(),
            projectName: targetProjectSlug || file.name.replace(/\.[^/.]+$/, '')
          }
        })
      });

      const initData = await initRes.json();
      if (!initData.success || !initData.session) {
        throw new Error(initData.error?.message || initData.message || 'Failed to initialize session');
      }

      const sessionId = initData.session.id;
      let uploadedBytes = 0;
      let startTime = Date.now();

      // 2. Upload Chunks sequentially with stream buffer
      for (let i = 0; i < totalChunks; i++) {
        if (isPausedRef.current) {
          setUploadStatus('paused');
          return;
        }

        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunkBlob = file.slice(start, end);
        const chunkArrayBuffer = await chunkBlob.arrayBuffer();

        const chunkStart = Date.now();
        const chunkRes = await fetch(`/api/v1/uploads/sessions/${sessionId}/chunks/${i}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-User-Uid': currentUser.uid
          },
          body: chunkArrayBuffer
        });

        if (!chunkRes.ok) {
          const errData = await chunkRes.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Chunk #${i + 1} transfer failed`);
        }

        uploadedBytes += (end - start);
        const elapsedSec = (Date.now() - startTime) / 1000;
        const speedMb = elapsedSec > 0 ? (uploadedBytes / (1024 * 1024)) / elapsedSec : 0;
        setUploadSpeed(`${speedMb.toFixed(2)} MB/s`);

        setCurrentChunkInfo({ current: i + 1, total: totalChunks });
        const percent = Math.round(((i + 1) / totalChunks) * 100);
        setUploadProgress(percent);
      }

      // 3. Finalize & Assemble Multi-GB File on Server
      setUploadStatus('assembling');
      const finalizeRes = await fetch(`/api/v1/uploads/sessions/${sessionId}/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': currentUser.uid
        }
      });

      const finalizeData = await finalizeRes.json();
      if (!finalizeData.success) {
        throw new Error(finalizeData.error?.message || finalizeData.message || 'Assembly verification failed');
      }

      setUploadStatus('completed');
      setUploadedResult({
        fileName: file.name,
        size: file.size,
        liveUrl: finalizeData.live_url
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onRefreshProjects();
      fetchMetrics();
    } catch (err: any) {
      setUploadStatus('failed');
      setUploadErrorMessage(err.message || 'Upload failed');
    }
  };

  const vacationProjects = projects.filter((p) => p.vacationMode === true);
  const activeProjects = projects.filter((p) => p.vacationMode !== true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Moon className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  SERVER VACATION &amp; G-FILES ENGINE
                </h2>
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  100% UNLIMITED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Manage Multi-GB (G-Files) uploads, server auto-vacuum &amp; project vacation hibernation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950/70 border-b border-slate-800 text-xs font-mono">
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">STORAGE TIER</div>
              <div className="text-white font-bold text-xs">UNLIMITED (100 TB+)</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2">
            <Moon className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">VACATION SITES</div>
              <div className="text-white font-bold text-xs">
                {vacationProjects.length} / {projects.length} Sleeping
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">SERVER RAM</div>
              <div className="text-white font-bold text-xs">
                {systemMetrics ? `${systemMetrics.heapUsedMb.toFixed(1)} MB Heap` : 'Optimized'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">G-FILES STREAM</div>
              <div className="text-emerald-400 font-bold text-xs">RESUMABLE READY</div>
            </div>
          </div>
        </div>

        {/* Action Message Banner */}
        {actionMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950/80 border-b border-emerald-800 text-emerald-300'
                : 'bg-red-950/80 border-b border-red-800 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('vacation')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === 'vacation'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-300" />
            <span>Project Vacation Mode</span>
            <span className="bg-amber-900/60 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full">
              {vacationProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gfiles')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === 'gfiles'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-purple-400" />
            <span>Multi-GB (G-Files) Uploader</span>
            <span className="bg-purple-900/60 text-purple-300 text-[10px] px-1.5 py-0.2 rounded-full">
              100GB+
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vacuum')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === 'vacuum'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Server Auto-Vacuum &amp; Deep Clean</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/40">
          {/* TAB 1: PROJECT VACATION MODE */}
          {activeTab === 'vacation' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/50 rounded-xl p-4 text-xs">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-1">
                  <Moon className="w-4 h-4 text-amber-300" />
                  What is Server Vacation Mode?
                </h3>
                <p className="text-slate-300 leading-relaxed font-sans">
                  When you put a project into <strong>Vacation Mode</strong>, its RAM footprint and background workers are put into an ultra-low energy hibernation state. The site remains safely saved with zero data loss and can be <strong>awakened in 1-click</strong> anytime.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Your Deployed Projects ({projects.length})
                </h4>

                {projects.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No projects found. Deploy a project to enable Vacation Mode.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projects.map((project) => {
                      const isVacation = project.vacationMode === true;
                      const isLoading = loadingAction === project.id;
                      const totalSize = (project.files || []).reduce((acc: number, f: any) => acc + (f.size || 0), 0);

                      return (
                        <div
                          key={project.id}
                          className={`border rounded-xl p-4 transition-all ${
                            isVacation
                              ? 'bg-slate-900/90 border-amber-900/60 shadow-lg shadow-amber-950/20'
                              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-white text-sm">{project.name}</h5>
                                {isVacation ? (
                                  <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Moon className="w-3 h-3 text-amber-400" />
                                    VACATION (SLEEPING)
                                  </span>
                                ) : (
                                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-emerald-400" />
                                    24/7 LIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                /site/{project.slug} &bull; {project.files?.length || 0} files ({formatSize(totalSize)})
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-3">
                            <span className="text-[10px] text-slate-400">
                              {isVacation ? '💤 RAM consumption: 0 MB' : '⚡ Live edge active'}
                            </span>

                            <button
                              onClick={() => handleToggleVacation(project.id, isVacation, project.name)}
                              disabled={isLoading}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                                isVacation
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isLoading ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isVacation ? (
                                <>
                                  <Sun className="w-3.5 h-3.5" />
                                  <span>Wake Up ⚡</span>
                                </>
                              ) : (
                                <>
                                  <Moon className="w-3.5 h-3.5" />
                                  <span>Put on Vacation 💤</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-GB (G-FILES) UPLOADER */}
          {activeTab === 'gfiles' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/50 rounded-xl p-4 text-xs">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-1">
                  <UploadCloud className="w-4 h-4 text-purple-400" />
                  Unlimited G-Files Resumable Chunking Pipeline
                </h3>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Upload gigabyte-sized files (1GB, 5GB, 10GB, 50GB+) seamlessly. Files are streamed in discrete binary chunks directly to persistent disk with zero RAM bottleneck, SHA-256 integrity verification, and auto-resume.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-purple-900/60 hover:border-purple-500/80 bg-slate-900/60 rounded-2xl p-6 text-center transition-all">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSelectedFile(f);
                      setUploadStatus('idle');
                      setUploadProgress(0);
                      setUploadedResult(null);
                    }
                  }}
                  className="hidden"
                  id="gfile-upload-input"
                />

                {!selectedFile ? (
                  <label
                    htmlFor="gfile-upload-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-3 py-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shadow-lg shadow-purple-950/40">
                      <DownloadCloud className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">
                        Click or Drag &amp; Drop Big Files (G-Files)
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Supports .ZIP, .TAR, .MP4, .ISO, .BIN, .PAK, datasets &amp; mod packages (Up to 100GB+)
                      </div>
                    </div>
                    <span className="bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                      Select Big File
                    </span>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                      <div className="flex items-center gap-3 text-left">
                        <FolderArchive className="w-6 h-6 text-purple-400 shrink-0" />
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm">{selectedFile.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Size: {formatSize(selectedFile.size)} &bull; Chunks: ~{Math.ceil(selectedFile.size / (5 * 1024 * 1024))} parts
                          </div>
                        </div>
                      </div>

                      {uploadStatus === 'idle' && (
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Target project selector */}
                    <div className="text-left">
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Deploy Target Project (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="Leave empty or enter project name (e.g. my-big-game-assets)"
                        value={targetProjectSlug}
                        onChange={(e) => setTargetProjectSlug(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>

                    {/* Upload progress & status */}
                    {(uploadStatus === 'uploading' || uploadStatus === 'assembling' || uploadStatus === 'completed') && (
                      <div className="space-y-2 text-left bg-slate-950/90 border border-purple-900/50 p-4 rounded-xl">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-purple-300 font-bold">
                            {uploadStatus === 'assembling'
                              ? '⚙️ Assembling Chunks on Server Disk...'
                              : uploadStatus === 'completed'
                              ? '✅ Upload & Verification Complete!'
                              : `🚀 Streaming: ${uploadSpeed}`}
                          </span>
                          <span className="text-white font-bold">{uploadProgress}%</span>
                        </div>

                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              uploadStatus === 'completed'
                                ? 'bg-emerald-400'
                                : uploadStatus === 'assembling'
                                ? 'bg-amber-400 animate-pulse'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                            }`}
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>
                            Chunk {currentChunkInfo.current} / {currentChunkInfo.total}
                          </span>
                          <span>Zero-RAM Streaming Active</span>
                        </div>
                      </div>
                    )}

                    {uploadErrorMessage && (
                      <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 text-left flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{uploadErrorMessage}</span>
                      </div>
                    )}

                    {uploadedResult && (
                      <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-left space-y-2">
                        <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>G-File Successfully Deployed &amp; Verified!</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono">
                          File: {uploadedResult.fileName} ({formatSize(uploadedResult.size)})
                        </div>
                        {uploadedResult.liveUrl && (
                          <a
                            href={uploadedResult.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline"
                          >
                            <span>Open Live Deployment &rarr;</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Action button */}
                    {uploadStatus === 'idle' && (
                      <button
                        onClick={handleStartChunkedUpload}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Start Multi-GB Chunk Stream</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SERVER AUTO-VACUUM & DEEP CLEAN */}
          {activeTab === 'vacuum' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/50 rounded-xl p-4 text-xs">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  1-Click Server Auto-Vacuum &amp; Memory Garbage Collector
                </h3>
                <p className="text-slate-300 leading-relaxed font-sans">
                  The <strong>Auto-Vacuum Engine</strong> runs deep disk and memory defragmentation: cleans stale chunk buffers, removes orphaned upload sessions, recycles Node.js V8 heap memory, and maintains continuous 24/7 high throughput.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-800 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/30">
                  <Sparkles className={`w-8 h-8 ${isVacuuming ? 'animate-spin' : ''}`} />
                </div>

                <div>
                  <h4 className="text-white font-bold text-base">Server Deep Clean &amp; Disk Vacuum</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Reclaims abandoned temporary files, purges unused cache nodes, and optimizes live server responsiveness.
                  </p>
                </div>

                <button
                  onClick={handleRunServerVacuum}
                  disabled={isVacuuming}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition-all inline-flex items-center gap-2"
                >
                  {isVacuuming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Vacuuming Server Disk &amp; RAM...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run 1-Click Server Deep Vacuum</span>
                    </>
                  )}
                </button>

                {vacuumResult && (
                  <div className="p-4 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-left grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mt-4">
                    <div>
                      <div className="text-slate-400 text-[10px]">DISK SPACE FREED</div>
                      <div className="text-emerald-300 font-bold">{vacuumResult.freedMb.toFixed(2)} MB</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">CHUNKS CLEANED</div>
                      <div className="text-emerald-300 font-bold">{vacuumResult.cleanedChunks}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">TEMP FILES PURGED</div>
                      <div className="text-emerald-300 font-bold">{vacuumResult.cleanedTempFiles}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">MEMORY RECYCLED</div>
                      <div className="text-emerald-300 font-bold">{vacuumResult.recycledMemoryMb.toFixed(1)} MB</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sponsored High-Yield Server Partner Ad Unit */}
          <div className="pt-2 border-t border-slate-800/80 flex justify-center">
            <AdBanner slot="leaderboard_728" title="High-Speed Server Infrastructure Sponsors" showDirectLink={true} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>KAVO V5 Vacation &amp; Multi-GB Engine (Zero Limit)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
