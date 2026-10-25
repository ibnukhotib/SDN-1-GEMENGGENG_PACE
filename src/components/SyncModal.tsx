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
  Sparkles
} from 'lucide-react';
import { ApiSync, FullSchoolData } from '../utils/apiSync';
import { PendidikTendik, Siswa } from '../types';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastSyncTime: string | null;
  isSyncing: boolean;
  onManualSync: () => Promise<void>;
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
  onManualSync,
  onForceReset,
  ptkCount,
  siswaCount,
  fullData,
  onRestoreData,
  isAdmin
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [localSyncing, setLocalSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSyncClick = async () => {
    setLocalSyncing(true);
    setStatusMessage(null);
    try {
      await onManualSync();
      setStatusMessage('Data berhasil disinkronkan dengan server pusat!');
    } catch (e) {
      setStatusMessage('Gagal menyinkronkan data.');
    } finally {
      setLocalSyncing(false);
    }
  };

  const handleBackup = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `cadangan_sdn1_gemenggeng_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setStatusMessage('File cadangan data sekolah berhasil diunduh.');
    } catch (e) {
      setStatusMessage('Gagal mengunduh cadangan.');
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
          await ApiSync.saveSchoolData(parsed);
          setStatusMessage('Data dari file cadangan berhasil dipulihkan dan disinkronkan ke server!');
        } else {
          setStatusMessage('Format file cadangan tidak sesuai.');
        }
      } catch (err) {
        setStatusMessage('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Sinkronisasi Data Multi-Perangkat</h3>
              <p className="text-xs text-slate-300">Penyelarasan Data Laptop, HP & Tablet</p>
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Satu Basis Data untuk Semua Perangkat</span>
            </div>
            <p>
              Aplikasi ini menggunakan <strong>Server Basis Data Terpusat</strong>. Setiap perubahan data yang dilakukan di <strong>Laptop</strong> (misalnya data pendidik/guru) akan tersimpan ke server dan otomatis tampil di <strong>HP</strong> saat membuka URL yang sama.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2 text-slate-700 font-medium">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs">
                <Laptop className="w-4 h-4 text-emerald-700" />
                Laptop
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
              <span className="flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-1 rounded-md font-bold text-[11px] shadow-2xs">
                <Database className="w-3.5 h-3.5" />
                Server Pusat
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                HP / Smartphone
              </span>
            </div>
          </div>

          {/* Sync Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Total Pendidik & Tendik</span>
              <strong className="text-slate-800 text-base">{ptkCount} Orang</strong>
              <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Kepala Sekolah Aktif: Vita Dewi Susanti</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Total Siswa Terdata</span>
              <strong className="text-slate-800 text-base">{siswaCount} Siswa</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Kelas 1 s/d Kelas 6</span>
            </div>
          </div>

          {/* Last Sync Info */}
          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Status Server:</span>
              <span className="font-semibold text-emerald-700">Terhubung & Siap</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              {lastSyncTime ? `Sinkron: ${lastSyncTime}` : 'Otomatis tersinkron'}
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSyncClick}
              disabled={localSyncing || isSyncing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${localSyncing || isSyncing ? 'animate-spin' : ''}`} />
              <span>{localSyncing || isSyncing ? 'Menyinkronkan...' : 'Segarkan & Ambil Data Terbaru dari Server'}</span>
            </button>

            {isAdmin && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleBackup}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Unduh Cadangan</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer">
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tips: Di HP, cukup klik tombol <strong>Segarkan</strong> jika data belum berubah.</span>
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
