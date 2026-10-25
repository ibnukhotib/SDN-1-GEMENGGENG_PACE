import React, { useState } from 'react';
import { KegiatanSekolah } from '../types';
import {
  CalendarCheck2,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  Edit,
  Trash2,
  Printer,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { ConfirmModal } from './ConfirmModal';

interface KegiatanViewProps {
  kegiatanList: KegiatanSekolah[];
  onSaveKegiatan: (kegiatan: KegiatanSekolah) => void;
  onDeleteKegiatan: (id: string) => void;
  isAdmin?: boolean;
}

export const KegiatanView: React.FC<KegiatanViewProps> = ({
  kegiatanList,
  onSaveKegiatan,
  onDeleteKegiatan,
  isAdmin = false
}) => {
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<KegiatanSekolah | null>(null);
  const [kegiatanToDelete, setKegiatanToDelete] = useState<KegiatanSekolah | null>(null);

  const [formData, setFormData] = useState<Partial<KegiatanSekolah>>({
    judul: '',
    kategori: 'Kesiswaan',
    tanggalMulai: '',
    tanggalSelesai: '',
    waktu: '07.00 - 10.00 WIB',
    lokasi: 'Halaman SDN 1 Gemenggeng',
    penanggungJawab: '',
    deskripsi: '',
    status: 'Akan Datang'
  });

  const openAddModal = () => {
    setEditingKegiatan(null);
    setFormData({
      judul: '',
      kategori: 'Kesiswaan',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: '',
      waktu: '07.30 - 11.00 WIB',
      lokasi: 'Halaman Sekolah SDN 1 Gemenggeng',
      penanggungJawab: 'Sri Wahyuni, S.Pd.SD',
      deskripsi: '',
      status: 'Akan Datang'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (keg: KegiatanSekolah) => {
    setEditingKegiatan(keg);
    setFormData({ ...keg });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.tanggalMulai) {
      alert('Judul kegiatan dan tanggal wajib diisi');
      return;
    }

    const item: KegiatanSekolah = {
      id: editingKegiatan ? editingKegiatan.id : `keg-${Date.now()}`,
      judul: formData.judul || '',
      kategori: (formData.kategori || 'Kesiswaan') as any,
      tanggalMulai: formData.tanggalMulai || '',
      tanggalSelesai: formData.tanggalSelesai || '',
      waktu: formData.waktu || '07.00 WIB',
      lokasi: formData.lokasi || 'SDN 1 Gemenggeng',
      penanggungJawab: formData.penanggungJawab || 'Dewan Guru',
      deskripsi: formData.deskripsi || '',
      status: (formData.status || 'Akan Datang') as any
    };

    onSaveKegiatan(item);
    setIsModalOpen(false);
  };

  const filtered = kegiatanList.filter((k) => {
    const matchesKat = filterKategori === 'Semua' ? true : k.kategori === filterKategori;
    const matchesStat = filterStatus === 'Semua' ? true : k.status === filterStatus;
    return matchesKat && matchesStat;
  });

  return (
    <div className="space-y-6">
      <PrintHeader
        judulDokumen="KALENDER & AGENDA KEGIATAN SEKOLAH"
        subJudul="SDN 1 GEMENGGENG - Tahun Ajaran 2026/2027"
      />

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-emerald-600" />
            <span>Jadwal Kegiatan & Agenda Sekolah</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Agenda kegiatan akademik, keagamaan, kepramukaan, dan kesiswaan SDN 1 Gemenggeng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Agenda</span>
          </button>
          {isAdmin ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kegiatan</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Mode Pelihat
            </span>
          )}
        </div>
      </div>

      {/* Filters (no-print) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['Semua', 'Akademik', 'Kesiswaan', 'Pramuka', 'Keagamaan', 'Rapat', 'Sosial'].map((kat) => (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  filterKategori === kat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Status</option>
              <option value="Akan Datang">Akan Datang</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* List / Cards of Kegiatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((keg) => (
          <div
            key={keg.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between print:border print:border-slate-300 print:shadow-none print:break-inside-avoid"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {keg.kategori}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    keg.status === 'Berlangsung'
                      ? 'bg-amber-100 text-amber-800'
                      : keg.status === 'Akan Datang'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {keg.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {keg.judul}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {keg.deskripsi}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {keg.tanggalMulai}
                    {keg.tanggalSelesai ? ` s/d ${keg.tanggalSelesai}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{keg.waktu}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{keg.lokasi}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-emerald-700 font-medium">
                    PJ: {keg.penanggungJawab}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions (no-print) */}
            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 no-print">
                <button
                  onClick={() => openEditModal(keg)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  title="Edit Kegiatan"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setKegiatanToDelete(keg)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Hapus Kegiatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Belum ada jadwal kegiatan sekolah untuk filter ini.
        </div>
      )}

      {/* Modal Add & Edit Kegiatan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingKegiatan ? 'Edit Jadwal Kegiatan' : 'Tambah Agenda Kegiatan Sekolah'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama / Judul Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perkemahan Jumat-Sabtu (Perjusa)"
                  value={formData.judul || ''}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.kategori || 'Kesiswaan'}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {['Akademik', 'Kesiswaan', 'Pramuka', 'Keagamaan', 'Rapat', 'Sosial'].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || 'Akan Datang'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalMulai || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Selesai (Opsional)
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalSelesai || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 07.30 - 11.00 WIB"
                    value={formData.waktu || ''}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Halaman SDN 1 Gemenggeng"
                    value={formData.lokasi || ''}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Penanggung Jawab (PJ)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sri Wahyuni, S.Pd.SD & Tim Kesiswaan"
                  value={formData.penanggungJawab || ''}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi / Keterangan Kegiatan
                </label>
                <textarea
                  rows={2}
                  placeholder="Rincian acara atau perlengkapan yang perlu dipersiapkan..."
                  value={formData.deskripsi || ''}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  {editingKegiatan ? 'Simpan Kegiatan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!kegiatanToDelete}
        title="Hapus Agenda Kegiatan"
        message={`Apakah Anda yakin ingin menghapus agenda kegiatan "${kegiatanToDelete?.judul}"?`}
        detail={`Kategori: ${kegiatanToDelete?.kategori} • Tanggal: ${kegiatanToDelete?.tanggalMulai} • Lokasi: ${kegiatanToDelete?.lokasi}`}
        confirmLabel="Ya, Hapus Kegiatan"
        onConfirm={() => {
          if (kegiatanToDelete) {
            onDeleteKegiatan(kegiatanToDelete.id);
            setKegiatanToDelete(null);
          }
        }}
        onCancel={() => setKegiatanToDelete(null)}
      />
    </div>
  );
};
