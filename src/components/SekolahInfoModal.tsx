import React, { useState, useEffect } from 'react';
import { School, X, Save, CheckCircle2, Award, BookOpen, MapPin, Phone, Mail, UserCheck } from 'lucide-react';
import { SekolahInfo } from '../types';

interface SekolahInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sekolahInfo: SekolahInfo;
  onSave: (info: SekolahInfo) => void;
}

export const SekolahInfoModal: React.FC<SekolahInfoModalProps> = ({
  isOpen,
  onClose,
  sekolahInfo,
  onSave
}) => {
  const [formData, setFormData] = useState<SekolahInfo>({ ...sekolahInfo });

  useEffect(() => {
    setFormData({ ...sekolahInfo });
  }, [sekolahInfo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 border-2 border-emerald-600/30 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20 overflow-hidden">
              <img src="/logo.png" alt="Logo SDN 1 Gemenggeng" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Identitas & Profil Sekolah
              </h3>
              <p className="text-xs text-slate-500">
                Perbarui Akreditasi, NPSN, Kepala Sekolah, dan Data Pokok
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Sekolah */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Sekolah
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            {/* NPSN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NPSN
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                required
              />
            </div>

            {/* Akreditasi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Akreditasi Sekolah</span>
                <span className="text-[11px] text-emerald-600 font-medium">Bawaan: B</span>
              </label>
              <select
                value={formData.akreditasi}
                onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-emerald-800 bg-emerald-50/50"
              >
                <option value="A">A (Unggul)</option>
                <option value="B">B (Baik)</option>
                <option value="C">C (Cukup)</option>
                <option value="Belum Terakreditasi">Belum Terakreditasi</option>
              </select>
            </div>

            {/* Kurikulum */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kurikulum
              </label>
              <input
                type="text"
                value={formData.kurikulum}
                onChange={(e) => setFormData({ ...formData, kurikulum: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Kepala Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.kepalaSekolah}
                onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold"
                required
              />
            </div>

            {/* NIP Kepala Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.nipKepsek}
                onChange={(e) => setFormData({ ...formData, nipKepsek: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Resmi Sekolah
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Alamat */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Lengkap Satuan Pendidikan
              </label>
              <textarea
                rows={2}
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Visi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Visi Sekolah
              </label>
              <textarea
                rows={3}
                value={formData.visi}
                onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              <Save className="w-4 h-4" />
              <span>Simpan Profil Sekolah</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
