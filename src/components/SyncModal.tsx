import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  X,
  Smartphone,
  Laptop,
  ArrowRight,
  Database,
  Sparkles,
  CloudUpload
} from 'lucide-react';
import { ApiSync, FullSchoolData, ServerSyncStatus } from '../utils/apiSync';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastSyncTime: string | null;
  isSyncing: boolean;
  serverStatus?: ServerSyncStatus;
  hasPendingSync?: boolean;
  onManualSync: () => Promise<boolean | void>;
  onPushToServer?: () => Promise<boolean>;
  onForceReset: () => Promise<void>;
  ptkCount: number;
  siswaCount: number;
  fullData: FullSchoolData;
  onRestoreData: (data: FullSchoolData) => void;
  isAdmin: boolean;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  lastSyncTime,
  isSyncing,
  serverStatus = 'connected',
  hasPendingSync = false,
  onManualSync,
  onPushToServer,
  ptkCount,
  siswaCount,
  fullData,
  onRestoreData,
  isAdmin
}) => {
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [localSyncing, setLocalSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSyncClick = async () => {
    setLocalSyncing(true);
    setStatusMessage(null);
    try {
      const result = await onManualSync();
      if (result === false) {
        setStatusMessage({
          text: 'Belum dapat mengambil data dari server. Pastikan Upstash Redis terhubung di Vercel atau cek koneksi internet.',
          type: 'error'
        });
      } else {
        setStatusMessage({
          text: 'Data terbaru berhasil diambil dari server!',
          type: 'success'
        });
      }
    } catch {
      setStatusMessage({
        text: 'Gagal mengambil data dari server.',
        type: 'error'
      });
    } finally {
      setLocalSyncing(false);
    }
  };

  const handlePushClick = async () => {
    if (!onPushToServer) return;
    setLocalSyncing(true);
    setStatusMessage(null);
    try {
      const ok = await onPushToServer();
      if (ok) {
        setStatusMessage({
          text: 'Seluruh data berhasil disimpan & dikirim ke server agar sinkron dengan HP/Laptop lain!',
          type: 'success'
        });
      } else {
        setStatusMessage({
          text: 'Gagal mengirim ke server. Jika memakai Vercel, hubungkan Upstash Redis dulu atau gunakan Unduh/Pulihkan File di bawah.',
          type: 'error'
        });
      }
    } finally {
      setLocalSyncing(false);
    }
  };

  const handleBackup = () => {
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `cadangan_sdn1_gemenggeng_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setStatusMessage({
        text: 'File cadangan (.json) berhasil diunduh. Kirim file ini ke HP/Laptop lain lalu pilih "Pulihkan File".',
        type: 'success'
      });
    } catch {
      setStatusMessage({
        text: 'Gagal mengunduh cadangan.',
        type: 'error'
      });
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as FullSchoolData;
        if (parsed && Array.isArray(parsed.ptkList)) {
          onRestoreData(parsed);
          const saveRes = await ApiSync.saveSchoolData(parsed);
          setStatusMessage({
            text: saveRes.success
              ? 'Data dari file berhasil dipulihkan dan disimpan ke server!'
              : 'Data dari file berhasil dipulihkan ke perangkat ini!',
            type: 'success'
          });
        } else {
          setStatusMessage({
            text: 'Format file cadangan tidak sesuai.',
            type: 'error'
          });
        }
      } catch {
        setStatusMessage({
          text: 'Gagal membaca file JSON.',
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Sinkronisasi Data Multi-Perangkat</h3>
              <p className="text-xs text-slate-300">Simpan &amp; Selaraskan Data Laptop, HP &amp; Vercel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Satu Basis Data untuk Laptop &amp; HP</span>
            </div>
            <p>
              Tekan <strong>Simpan &amp; Kirim ke Server</strong> setelah mengedit data di <strong>Laptop</strong>, lalu tekan <strong>Ambil Data Terbaru</strong> di <strong>HP</strong> pada alamat URL yang sama.
            </p>
            <div className="flex items-center justify-center gap-3 pt-1 text-slate-700 font-medium">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs">
                <Laptop className="w-4 h-4 text-emerald-700" />
                Laptop
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
              <span className="flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-1 rounded-md font-bold text-[11px] shadow-2xs">
                <Database className="w-3.5 h-3.5" />
                Server / Cloud
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                HP
              </span>
            </div>
          </div>

          {/* Server / Vercel Storage Status */}
          <div
            className={`flex items-center justify-between text-xs p-3 rounded-xl border ${
              serverStatus === 'connected'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : serverStatus === 'needs-setup'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {serverStatus === 'connected' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <div>
                <span className="font-bold block">
                  {serverStatus === 'connected'
                    ? 'Status Server: Terhubung & Siap'
                    : serverStatus === 'needs-setup'
                    ? 'Vercel Belum Terhubung Database Cloud'
                    : 'Status Server: Offline / Tidak Terjangkau'}
                </span>
                {hasPendingSync && (
                  <span className="text-[11px] text-amber-700 font-medium">
                    Ada perubahan lokal yang belum terkirim ke server.
                  </span>
                )}
              </div>
            </div>
            <div className="text-[11px] opacity-80 shrink-0">
              {lastSyncTime ? `Sinkron: ${lastSyncTime}` : ''}
            </div>
          </div>

          {/* Helpful Guide if Vercel does not have Upstash Redis connected yet */}
          {serverStatus === 'needs-setup' && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950 space-y-1.5 leading-relaxed">
              <p className="font-bold text-amber-900">
                Agar sinkron otomatis di Vercel (vercel.app) antara Laptop &amp; HP:
              </p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>
                  Buka <strong>Vercel Dashboard</strong> proyek Anda &rarr; tab <strong>Storage</strong> &rarr; klik <strong>Create / Browse Marketplace</strong>.
                </li>
                <li>
                  Pilih <strong>Upstash Redis</strong> (paket gratis) &rarr; sambungkan ke proyek ini &rarr; lalu <strong>Redeploy</strong>.
                </li>
                <li>
                  Atau untuk sinkron instan tanpa pengaturan server, gunakan tombol <strong>Unduh Cadangan (.json)</strong> di Laptop lalu <strong>Pulihkan File</strong> di HP di bawah ini.
                </li>
              </ol>
            </div>
          )}

          {/* Sync Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Total Pendidik &amp; Tendik</span>
              <strong className="text-slate-800 text-base">{ptkCount} Orang</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Total Siswa Terdata</span>
              <strong className="text-slate-800 text-base">{siswaCount} Siswa</strong>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-rose-100 border-rose-300 text-rose-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            {isAdmin && onPushToServer && (
              <button
                onClick={handlePushClick}
                disabled={localSyncing || isSyncing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <CloudUpload className="w-4 h-4" />
                <span>
                  {localSyncing || isSyncing
                    ? 'Menyimpan ke Server...'
                    : 'Simpan & Kirim Data Perangkat Ini ke Server'}
                </span>
              </button>
            )}

            <button
              onClick={handleSyncClick}
              disabled={localSyncing || isSyncing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${localSyncing || isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {localSyncing || isSyncing
                  ? 'Mengambil Data...'
                  : 'Ambil Data Terbaru dari Server (Segarkan)'}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleBackup}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Unduh Cadangan</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Pulihkan File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Tips: Di HP, klik <strong>Ambil Data Terbaru</strong> jika belum berubah.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
