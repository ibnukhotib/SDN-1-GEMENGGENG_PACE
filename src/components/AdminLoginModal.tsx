import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck, X, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Storage, DEFAULT_ADMIN_PIN } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAdmin: boolean;
  onLogout?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isAdmin,
  onLogout
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentPin = Storage.getAdminPin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (pin.trim() === currentPin) {
      Storage.setUserRole('admin');
      onSuccess();
      setPin('');
      onClose();
    } else {
      setError('PIN Admin salah. Silakan periksa kembali!');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (oldPin.trim() !== currentPin) {
      setError('PIN lama yang dimasukkan tidak sesuai!');
      return;
    }
    if (newPin.trim().length < 4) {
      setError('PIN baru minimal 4 digit!');
      return;
    }
    if (newPin !== confirmNewPin) {
      setError('Konfirmasi PIN baru tidak sama!');
      return;
    }

    Storage.setAdminPin(newPin.trim());
    setSuccessMsg('PIN Admin berhasil diperbarui!');
    setOldPin('');
    setNewPin('');
    setConfirmNewPin('');
    setTimeout(() => {
      setIsChangingPin(false);
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isAdmin
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-600/20'
                  : 'bg-amber-100 text-amber-700 shadow-sm shadow-amber-600/20'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAdmin ? 'Hak Akses Administrator' : 'Masuk Sebagai Admin'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAdmin ? 'Status: Pengelola Aktif (Edit & Hapus)' : 'Hanya Admin yang dapat mengedit data'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicator banner */}
        {isAdmin ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Mode Pengeditan Aktif</p>
              <p className="text-[11px] text-emerald-700">
                Anda dapat menambah, mengubah, menginput nilai, presensi, serta menghapus data sekolah.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Saat Ini: Mode Pelihat (Read-Only)</p>
              <p className="text-[11px] text-amber-700">
                Masukkan PIN Admin untuk membuka fitur tambah data, pengeditan, nilai, dan absensi.
              </p>
            </div>
          </div>
        )}

        {/* Feedback messages */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Admin is logged in: Options to Lock/Logout or Change PIN */}
        {isAdmin ? (
          <div className="space-y-4 pt-1">
            {!isChangingPin ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    Ubah PIN Admin
                  </span>
                  <span className="text-[11px] text-slate-400">&rarr;</span>
                </button>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onLogout) onLogout();
                      onClose();
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
                  >
                    Kunci / Mode Pelihat
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Lama
                  </label>
                  <input
                    type="password"
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Masukkan PIN lama"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Baru
                  </label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Minimal 4 digit"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Konfirmasi PIN Baru
                  </label>
                  <input
                    type="password"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Ulangi PIN baru"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(false);
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                  >
                    Simpan PIN Baru
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Viewer is logging in as Admin */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  PIN Keamanan Admin
                </label>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Default: <strong className="font-mono bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">{DEFAULT_ADMIN_PIN}</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 text-sm font-mono tracking-widest border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="Ketik PIN..."
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Gunakan PIN di atas untuk mengaktifkan akses edit dan hapus data sekolah.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>Buka Akses Admin</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
