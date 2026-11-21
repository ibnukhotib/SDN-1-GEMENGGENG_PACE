import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Apple,
  Share2,
  PlusSquare,
  CheckCircle2,
  DownloadCloud,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallDirectly?: () => void;
  canDirectInstall?: boolean;
  initialPlatform?: 'android' | 'ios' | 'desktop';
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstallDirectly,
  canDirectInstall = false,
  initialPlatform = 'android'
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(initialPlatform);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 no-print">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with circular logo preview */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large circular app icon with pulsing ring */}
          <div className="relative mx-auto w-24 h-24 mb-3">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping opacity-75" />
            <div className="relative w-24 h-24 rounded-full bg-white p-1 border-4 border-amber-400 shadow-xl overflow-hidden ring-4 ring-white/30 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo SDN 1 Gemenggeng"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold mb-1 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ikon Aplikasi Resmi</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Pasang Aplikasi SDN 1 Gemenggeng</h3>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-sm mx-auto">
            Gunakan logo bulat ini sebagai ikon aplikasi di layar utama HP maupun desktop Laptop Anda!
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-3 shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 pb-3 px-2 flex items-center justify-center gap-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'android'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>HP Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 pb-3 px-2 flex items-center justify-center gap-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'ios'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 pb-3 px-2 flex items-center justify-center gap-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'desktop'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Laptop / PC</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Keunggulan di HP Android:</p>
                  <p className="mt-0.5 text-emerald-800 leading-relaxed">
                    Aplikasi berjalan layar penuh (fullscreen) tanpa bar browser, membuka lebih cepat, dan ikon logo sekolah berbentuk lingkaran tampil rapi di daftar aplikasi HP Anda.
                  </p>
                </div>
              </div>

              {canDirectInstall && onInstallDirectly && (
                <button
                  onClick={onInstallDirectly}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <DownloadCloud className="w-5 h-5" />
                  <span>Pasang Sekarang (Instan)</span>
                </button>
              )}

              <div className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Langkah Manual di Browser HP (Google Chrome / Edge):
                </p>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700">
                    Ketuk menu <strong>tiga titik (⋮)</strong> di pojok kanan atas browser Google Chrome atau Edge di HP Anda.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700">
                    Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home screen) atau <strong>"Pasang Aplikasi"</strong> (Install App).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs text-slate-700">
                    Konfirmasi dengan mengetuk <strong>"Instal" / "Tambah"</strong>. Logo bulat SDN 1 Gemenggeng akan langsung muncul di beranda HP Anda!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <Apple className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Petunjuk Khusus iPhone / iPad (Safari):</p>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    Apple iOS mewajibkan pemasangan melalui tombol <em>Share (Bagikan)</em> di browser Safari.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700">
                    Buka halaman ini menggunakan browser bawaan <strong>Safari</strong> di iPhone Anda.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700 flex-1">
                    Ketuk tombol <strong>Bagikan (Share)</strong>{' '}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-medium">
                      <Share2 className="w-3 h-3 inline mr-1" /> ikon kotak berpanah ke atas
                    </span>{' '}
                    di bilah bawah Safari.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs text-slate-700 flex-1">
                    Gulir ke bawah dan ketuk opsi{' '}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-medium">
                      <PlusSquare className="w-3 h-3 inline mr-1" /> Tambahkan ke Layar Utama
                    </span>{' '}
                    (Add to Home Screen).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div className="text-xs text-slate-700">
                    Ketuk <strong>"Tambah" (Add)</strong> di pojok kanan atas. Ikon logo bulat SDN 1 Gemenggeng akan otomatis terpampang di Home Screen iPhone!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-4 text-xs text-teal-900 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Aplikasi Desktop di Laptop / Komputer:</p>
                  <p className="mt-0.5 text-teal-800 leading-relaxed">
                    Setelah dipasang, aplikasi memiliki jendela mandiri, ikon di Taskbar & Desktop, serta bisa dibuka langsung dari Start Menu Windows atau Launchpad Mac.
                  </p>
                </div>
              </div>

              {canDirectInstall && onInstallDirectly && (
                <button
                  onClick={onInstallDirectly}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <DownloadCloud className="w-5 h-5" />
                  <span>Pasang Aplikasi di Laptop Ini</span>
                </button>
              )}

              <div className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Cara Pasang di Browser Laptop (Google Chrome / Microsoft Edge):
                </p>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700">
                    Lihat ke ujung kanan <strong>Address Bar</strong> (bilah tempat alamat URL website di atas).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700">
                    Klik ikon <strong>"Install / Pasang Aplikasi"</strong> (berupa simbol komputer berpanah ke bawah atau simbol pasang).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs text-slate-700">
                    Klik tombol <strong>"Instal"</strong>. Jendela aplikasi akan terbuka secara mandiri lengkap dengan logo sekolah di Taskbar!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PWA Siap &bull; Offline Supported</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
