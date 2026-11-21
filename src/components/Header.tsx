import React from 'react';
import { Menu, Calendar, Printer, ShieldCheck, KeyRound, RefreshCw } from 'lucide-react';
import { SEKOLAH_INFO } from '../data/initialData';
import { SekolahInfo } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { ServerSyncStatus } from '../utils/apiSync';

interface HeaderProps {
  onToggleSidebar: () => void;
  onResetData?: () => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
  sekolahInfo?: SekolahInfo;
  onOpenSyncModal?: () => void;
  isSyncing?: boolean;
  hasPendingSync?: boolean;
  serverStatus?: ServerSyncStatus;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
  sekolahInfo = SEKOLAH_INFO,
  onOpenSyncModal,
  isSyncing = false,
  hasPendingSync = false,
  serverStatus = 'connected'
}) => {
  const info = sekolahInfo || SEKOLAH_INFO;

  const currentDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left section: mobile hamburger & School branding */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Buka Menu"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 border-2 border-emerald-600/30 shadow-xs flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-emerald-500/10">
                  <img
                    src="/logo.png"
                    alt="Logo SDN 1 Gemenggeng"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                      {info.nama}
                    </span>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      NPSN {info.npsn}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Kec. Pace, Kab. Nganjuk &bull; Akreditasi {info.akreditasi}
                  </p>
                </div>
              </div>
            </div>

            {/* Right section: Date, Term, Actions, Role status */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{currentDate}</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-semibold">T.A 2026/2027 Ganjil</span>
              </div>

              {/* Role Indicator & Access Switch */}
              {isAdmin ? (
                <div className="flex items-center gap-1.5">
                  <div
                    onClick={onOpenAdminModal}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs cursor-pointer hover:bg-emerald-100/80 transition-colors"
                    title="Klik untuk pengaturan PIN / Admin"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Admin</span>
                  </div>
                  <button
                    onClick={onLogoutAdmin}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-transparent transition-colors"
                    title="Kunci / Keluar Admin"
                  >
                    <span>Kunci</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdminModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold transition-all shadow-xs active:scale-95 border border-amber-600/20"
                  title="Klik untuk masuk sebagai Admin pengedit"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Masuk Admin</span>
                </button>
              )}

              {onOpenSyncModal && (
                <button
                  onClick={onOpenSyncModal}
                  className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 border ${
                    hasPendingSync || serverStatus === 'needs-setup'
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                  title="Sinkronkan & simpan data antara Laptop, HP, dan Server Vercel"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sinkron</span>
                  {(hasPendingSync || serverStatus === 'needs-setup') && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              )}

              <PWAInstallButton variant="header" />

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                title="Cetak Halaman ini"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
