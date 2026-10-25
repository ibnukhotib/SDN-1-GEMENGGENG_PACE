import React, { useState } from 'react';
import { JadwalPelajaran, PendidikTendik } from '../types';
import { MAPEL_LIST, SEKOLAH_INFO } from '../data/initialData';
import {
  CalendarDays,
  Plus,
  Clock,
  Printer,
  Edit,
  Trash2,
  X,
  BookOpen,
  User,
  MapPin,
  Calendar
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { ConfirmModal } from './ConfirmModal';

interface JadwalViewProps {
  jadwalList: JadwalPelajaran[];
  ptkList: PendidikTendik[];
  onSaveJadwal: (jadwal: JadwalPelajaran) => void;
  onDeleteJadwal: (id: string) => void;
  isAdmin?: boolean;
}

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

export const JadwalView: React.FC<JadwalViewProps> = ({
  jadwalList,
  ptkList,
  onSaveJadwal,
  onDeleteJadwal,
  isAdmin = false
}) => {
  const kepsek = ptkList.find(
    (p) =>
      p.jabatan.toLowerCase().includes('kepala sekolah') ||
      p.jabatan.toLowerCase().includes('kepsek')
  );
  const kepsekNama = kepsek
    ? `${kepsek.nama}${kepsek.gelar && kepsek.gelar !== '-' ? `, ${kepsek.gelar}` : ''}`
    : SEKOLAH_INFO.kepalaSekolah;
  const kepsekNip = kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : SEKOLAH_INFO.nipKepsek;

  const [selectedKelas, setSelectedKelas] = useState<string>('1');
  const [selectedHari, setSelectedHari] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalPelajaran | null>(null);
  const [jadwalToDelete, setJadwalToDelete] = useState<JadwalPelajaran | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<JadwalPelajaran>>({
    kelas: '1',
    hari: 'Senin',
    jamKe: 1,
    waktuMulai: '07.00',
    waktuSelesai: '08.10',
    mataPelajaran: MAPEL_LIST[0],
    guruPengampu: ptkList[1]?.nama || 'Guru Kelas',
    ruangan: 'Ruang Kelas 1'
  });

  const openAddModal = (hariDefault?: string) => {
    setEditingJadwal(null);
    setFormData({
      kelas: selectedKelas,
      hari: (hariDefault && HARI_LIST.includes(hariDefault as any) ? hariDefault : 'Senin') as any,
      jamKe: 1,
      waktuMulai: '07.00',
      waktuSelesai: '08.10',
      mataPelajaran: MAPEL_LIST[0],
      guruPengampu: ptkList[1]?.nama || 'Guru Kelas',
      ruangan: `Ruang Kelas ${selectedKelas}`
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: JadwalPelajaran) => {
    setEditingJadwal(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: JadwalPelajaran = {
      id: editingJadwal ? editingJadwal.id : `jdw-${Date.now()}`,
      kelas: formData.kelas || selectedKelas,
      hari: formData.hari || 'Senin',
      jamKe: Number(formData.jamKe) || 1,
      waktuMulai: formData.waktuMulai || '07.00',
      waktuSelesai: formData.waktuSelesai || '08.00',
      mataPelajaran: formData.mataPelajaran || 'Mata Pelajaran',
      guruPengampu: formData.guruPengampu || 'Dewan Guru',
      ruangan: formData.ruangan || `Ruang Kelas ${formData.kelas || selectedKelas}`
    };

    onSaveJadwal(item);
    setIsModalOpen(false);
  };

  // Filter schedules for the selected class
  const classSchedules = jadwalList
    .filter((j) => j.kelas === selectedKelas)
    .sort((a, b) => a.jamKe - b.jamKe);

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <PrintHeader
        judulDokumen="JADWAL PELAJARAN MINGGUAN"
        kelas={selectedKelas}
        subJudul="Kurikulum Merdeka - SDN 1 GEMENGGENG"
      />

      {/* Screen Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-600" />
            <span>Jadwal Pelajaran per Kelas</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Susunan jam pelajaran mingguan untuk Kelas 1 sampai dengan Kelas 6
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Jadwal</span>
          </button>
          {isAdmin ? (
            <button
              onClick={() => openAddModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Mode Pelihat
            </span>
          )}
        </div>
      </div>

      {/* Class Switcher Buttons (no-print) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3 no-print">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Tingkat Kelas:</span>
          {['1', '2', '3', '4', '5', '6'].map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKelas(k)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedKelas === k
                  ? 'bg-emerald-600 text-white shadow-xs scale-102'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kelas {k}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-medium text-slate-400 shrink-0">Filter Hari:</span>
          {['Semua', ...HARI_LIST].map((hari) => (
            <button
              key={hari}
              onClick={() => setSelectedHari(hari)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedHari === hari
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {hari}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable by Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {HARI_LIST.filter((h) => (selectedHari === 'Semua' ? true : h === selectedHari)).map((hari) => {
          const itemsOnDay = classSchedules.filter((j) => j.hari === hari);

          return (
            <div
              key={hari}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden print:border print:border-slate-300 print:shadow-none print:break-inside-avoid"
            >
              {/* Day Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-200" />
                  <h3 className="font-bold text-sm tracking-wide">{hari}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                    {itemsOnDay.length} Pelajaran
                  </span>
                  <button
                    onClick={() => openAddModal(hari)}
                    className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors no-print"
                    title={`Tambah jam di hari ${hari}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Schedules List */}
              <div className="p-3 space-y-2.5 divide-y divide-slate-100">
                {itemsOnDay.length > 0 ? (
                  itemsOnDay.map((item) => (
                    <div
                      key={item.id}
                      className="pt-2.5 first:pt-0 group flex items-start justify-between gap-2"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                            Jam {item.jamKe}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.waktuMulai} - {item.waktuSelesai}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                          {item.mataPelajaran}
                        </h4>

                        <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {item.guruPengampu}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.ruangan}
                          </span>
                        </div>
                      </div>

                      {/* Item Actions (no-print) */}
                      {isAdmin && (
                        <div className="opacity-80 group-hover:opacity-100 flex items-center gap-1 shrink-0 no-print">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setJadwalToDelete(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-red-700 hover:bg-red-50"
                            title="Hapus Jam Pelajaran"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    Belum ada jadwal pelajaran untuk hari {hari}.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Print Signature Footer */}
      <div className="hidden print:flex justify-between items-start mt-8 pt-6 text-xs text-slate-800">
        <div>
          <p>Mengetahui,</p>
          <p className="font-semibold">Kepala SDN 1 Gemenggeng</p>
          <div className="h-16" />
          <p className="font-bold underline">{kepsekNama}</p>
          <p className="text-[10px]">NIP. {kepsekNip}</p>
        </div>
        <div className="text-right">
          <p>Gemenggeng, Pace, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-semibold">Guru Kelas / Kurikulum</p>
          <div className="h-16" />
          <p className="font-bold underline">Tim Kurikulum SDN 1 Gemenggeng</p>
          <p className="text-[10px]">Tahun Ajaran 2026/2027</p>
        </div>
      </div>

      {/* Modal Add & Edit Jadwal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingJadwal ? 'Edit Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
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
              {/* Row 1: Kelas & Hari */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas
                  </label>
                  <select
                    value={formData.kelas || selectedKelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {['1', '2', '3', '4', '5', '6'].map((k) => (
                      <option key={k} value={k}>
                        Kelas {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hari
                  </label>
                  <select
                    value={formData.hari || 'Senin'}
                    onChange={(e) => setFormData({ ...formData, hari: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {HARI_LIST.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Jam ke, Waktu Mulai & Selesai */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Ke
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.jamKe || 1}
                    onChange={(e) => setFormData({ ...formData, jamKe: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mulai
                  </label>
                  <input
                    type="text"
                    placeholder="07.00"
                    value={formData.waktuMulai || ''}
                    onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selesai
                  </label>
                  <input
                    type="text"
                    placeholder="08.10"
                    value={formData.waktuSelesai || ''}
                    onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Row 3: Mata Pelajaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran / Kegiatan
                </label>
                <input
                  type="text"
                  list="mapel-options"
                  required
                  placeholder="Pilih atau ketik mata pelajaran..."
                  value={formData.mataPelajaran || ''}
                  onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <datalist id="mapel-options">
                  {MAPEL_LIST.map((m, idx) => (
                    <option key={idx} value={m} />
                  ))}
                  <option value="Upacara Bendera" />
                  <option value="Senam Pagi & Sholat Dhuha" />
                  <option value="Projek Penguatan Profil Pelajar Pancasila (P5)" />
                  <option value="Ekstrakurikuler Pramuka" />
                  <option value="Literasi & Numerasi Mandiri" />
                </datalist>
              </div>

              {/* Row 4: Guru Pengampu & Ruangan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guru Pengampu
                  </label>
                  <input
                    type="text"
                    list="guru-options"
                    value={formData.guruPengampu || ''}
                    onChange={(e) => setFormData({ ...formData, guruPengampu: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <datalist id="guru-options">
                    {ptkList.map((p) => (
                      <option key={p.id} value={`${p.nama}${p.gelar && p.gelar !== '-' ? `, ${p.gelar}` : ''}`} />
                    ))}
                    <option value="Seluruh Dewan Guru" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruangan / Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder={`Ruang Kelas ${selectedKelas}`}
                    value={formData.ruangan || ''}
                    onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
                  {editingJadwal ? 'Simpan Jadwal' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!jadwalToDelete}
        title="Hapus Jam Pelajaran"
        message={`Apakah Anda yakin ingin menghapus jadwal "${jadwalToDelete?.mataPelajaran}"?`}
        detail={`Kelas ${jadwalToDelete?.kelas} • Hari ${jadwalToDelete?.hari} (Jam ke-${jadwalToDelete?.jamKe}: ${jadwalToDelete?.waktuMulai} - ${jadwalToDelete?.waktuSelesai}) • Guru: ${jadwalToDelete?.guruPengampu}`}
        confirmLabel="Ya, Hapus Jadwal"
        onConfirm={() => {
          if (jadwalToDelete) {
            onDeleteJadwal(jadwalToDelete.id);
            setJadwalToDelete(null);
          }
        }}
        onCancel={() => setJadwalToDelete(null)}
      />
    </div>
  );
};
