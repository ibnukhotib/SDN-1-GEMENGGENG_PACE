import React from 'react';
import { DownloadCloud, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = ''
}) => {
  const {
    isInstalled,
    isIOS,
    isAndroid,
    installApp,
    showGuideModal,
    setShowGuideModal
  } = usePWAInstall();

  // If already running inside standalone app, show compact installed badge or hide
  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Aplikasi Terpasang</span>
        </div>
      );
    }
    return null;
  }

  const defaultPlatform = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';

  const handleClick = async () => {
    // Attempt direct installation (works in Chrome Android, Edge, Desktop Chrome)
    const installed = await installApp();
    if (!installed) {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xs active:scale-95 border border-emerald-500/30 ${className}`}
          title="Pasang Aplikasi SDN 1 Gemenggeng ke HP atau Laptop Anda"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Pasang Ikon Aplikasi</span>
          <span className="md:hidden">Pasang</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all shadow-2xs group ${className}`}
          title="Pasang Aplikasi ke Layar Utama HP / Laptop"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <DownloadCloud className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="leading-tight">Pasang ke HP / Laptop</p>
              <p className="text-[10px] text-emerald-700/80 font-normal">Buat Ikon Logo di Layar</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
            Instal
          </span>
        </button>
      )}

      {/* Modal with detailed instructions */}
      <PWAInstallModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onInstallDirectly={installApp}
        canDirectInstall={true}
        initialPlatform={defaultPlatform}
      />
    </>
  );
};
