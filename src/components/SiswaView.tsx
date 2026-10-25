import React, { useState } from 'react';
import { Siswa } from '../types';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Camera,
  Edit,
  Trash2,
  X,
  Printer,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { ConfirmModal } from './ConfirmModal';

interface SiswaViewProps {
  siswaList: Siswa[];
  onSaveSiswa: (siswa: Siswa) => void;
  onDeleteSiswa: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isAdmin?: boolean;
}

const PRESET_AVATARS = [
  { label: 'Siswa Putra 1', url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&auto=format&fit=crop&q=80' },
  { label: 'Siswa Putri 1', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80' },
  { label: 'Siswa Putra 2', url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&auto=format&fit=crop&q=80' },
  { label: 'Siswa Putri 2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Siswa Putra 3', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' }
];

export const SiswaView: React.FC<SiswaViewProps> = ({
  siswaList,
  onSaveSiswa,
  onDeleteSiswa,
  isAddModalOpen,
  setIsAddModalOpen,
  isAdmin = false
}) => {
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('Semua');

  // Edit state
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  // Delete state
  const [siswaToDelete, setSiswaToDelete] = useState<Siswa | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Siswa>>({
    nama: '',
    nisn: '',
    nis: '',
    kelas: '1',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2017-05-10',
    namaWali: '',
    teleponWali: '',
    alamat: '',
    fotoUrl: PRESET_AVATARS[0].url
  });

  const [previewImage, setPreviewImage] = useState<string>('');

  const openAddModal = () => {
    setEditingSiswa(null);
    setFormData({
      nama: '',
      nisn: '',
      nis: '',
      kelas: selectedKelas !== 'Semua' ? selectedKelas : '1',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Nganjuk',
      tanggalLahir: '2017-05-10',
      namaWali: '',
      teleponWali: '',
      alamat: 'Dusun Gemenggeng RT 01 RW 01, Kec. Pace',
      fotoUrl: PRESET_AVATARS[0].url
    });
    setPreviewImage('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setFormData({ ...siswa });
    setPreviewImage(siswa.fotoUrl);
    setIsAddModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, fotoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn) {
      alert('Nama dan NISN wajib diisi');
      return;
    }

    const newOrUpdatedSiswa: Siswa = {
      id: editingSiswa ? editingSiswa.id : `sis-${Date.now()}`,
      nama: formData.nama || '',
      nisn: formData.nisn || '',
      nis: formData.nis || '',
      kelas: formData.kelas || '1',
      jenisKelamin: formData.jenisKelamin || 'Laki-laki',
      tempatLahir: formData.tempatLahir || 'Nganjuk',
      tanggalLahir: formData.tanggalLahir || '2017-01-01',
      namaWali: formData.namaWali || '-',
      teleponWali: formData.teleponWali || '-',
      alamat: formData.alamat || '-',
      fotoUrl:
        previewImage ||
        formData.fotoUrl ||
        PRESET_AVATARS[0].url
    };

    onSaveSiswa(newOrUpdatedSiswa);
    setIsAddModalOpen(false);
  };

  // Filtered
  const filteredSiswa = siswaList.filter((s) => {
    const matchesKelas = selectedKelas === 'Semua' ? true : s.kelas === selectedKelas;
    const matchesGender = genderFilter === 'Semua' ? true : s.jenisKelamin === genderFilter;
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.nis.includes(searchTerm) ||
      s.alamat.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesKelas && matchesGender && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Official Print Header */}
      <PrintHeader
        judulDokumen={`BUKU INDUK & DAFTAR SISWA`}
        kelas={selectedKelas !== 'Semua' ? selectedKelas : '1 s.d. 6'}
        subJudul="SDN 1 GEMENGGENG - Kecamatan Pace, Kabupaten Nganjuk"
      />

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span>Data Siswa per Kelas Berfoto</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Database peserta didik SDN 1 Gemenggeng dilengkapi pas foto dan identitas wali
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Data Siswa</span>
          </button>
          {isAdmin ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Input Siswa Berfoto</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Mode Pelihat
            </span>
          )}
        </div>
      </div>

      {/* Class Selector Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3 no-print">
        {/* Class Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Pilih Kelas:</span>
          {['Semua', '1', '2', '3', '4', '5', '6'].map((k) => {
            const count =
              k === 'Semua'
                ? siswaList.length
                : siswaList.filter((s) => s.kelas === k).length;
            const isSelected = selectedKelas === k;

            return (
              <button
                key={k}
                onClick={() => setSelectedKelas(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {k === 'Semua' ? 'Semua Kelas' : `Kelas ${k}`}
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Gender filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Gender</option>
              <option value="Laki-laki">Laki-laki (L)</option>
              <option value="Perempuan">Perempuan (P)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Siswa Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSiswa.map((siswa) => (
          <div
            key={siswa.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all p-4 flex flex-col justify-between print:border print:border-slate-300 print:shadow-none print:break-inside-avoid"
          >
            <div className="space-y-3">
              {/* Header with Photo & Class Badge */}
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <img
                    src={siswa.fotoUrl}
                    alt={siswa.nama}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-100 shadow-2xs shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      siswa.jenisKelamin === 'Laki-laki'
                        ? 'bg-blue-600 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {siswa.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Kelas {siswa.kelas}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      NIS: {siswa.nis}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">
                    {siswa.nama}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    NISN: {siswa.nisn}
                  </p>
                </div>
              </div>

              {/* Detail Info */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TTL:</span>
                  <span className="font-medium text-slate-800">
                    {siswa.tempatLahir}, {siswa.tanggalLahir}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nama Wali:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[150px]">
                    {siswa.namaWali}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">HP Wali:</span>
                  <span className="font-medium text-slate-800">
                    {siswa.teleponWali}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 shrink-0">Alamat:</span>
                  <span className="font-medium text-slate-800 text-right text-[11px] line-clamp-1">
                    {siswa.alamat}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons (no-print) */}
            {isAdmin && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-1.5 no-print">
                <button
                  onClick={() => openEditModal(siswa)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  title="Edit Data Siswa"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSiswaToDelete(siswa)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Hapus Siswa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSiswa.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-medium">Tidak ada data siswa yang cocok dengan filter atau kata kunci.</p>
        </div>
      )}

      {/* Modal Input & Edit Siswa dengan Foto */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSiswa ? 'Edit Data Siswa Berfoto' : 'Input Data Siswa Baru (Dengan Foto)'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload & Preset Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={
                        previewImage ||
                        formData.fotoUrl ||
                        PRESET_AVATARS[0].url
                      }
                      alt="Preview Foto Siswa"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500"
                    />
                    <label className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 cursor-pointer hover:bg-amber-400 shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Foto Peserta Didik
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Unggah foto pas siswa berseragam SD atau pilih avatar cepat di bawah.
                    </p>
                  </div>
                </div>

                {/* Preset quick avatars */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1.5">
                    Atau gunakan contoh foto ramah anak:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPreviewImage(av.url);
                          setFormData((prev) => ({ ...prev, fotoUrl: av.url }));
                        }}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 shrink-0 transition-transform active:scale-95 ${
                          (previewImage === av.url || formData.fotoUrl === av.url)
                            ? 'border-emerald-600 scale-105'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 1: Nama & Kelas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Aditya Pratama"
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas *
                  </label>
                  <select
                    value={formData.kelas || '1'}
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
              </div>

              {/* Row 2: NISN, NIS & Jenis Kelamin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0165487123"
                    value={formData.nisn || ''}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIS (Buku Induk)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 2401"
                    value={formData.nis || ''}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin || 'Laki-laki'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenisKelamin: e.target.value as 'Laki-laki' | 'Perempuan'
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              {/* Row 3: TTL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Nganjuk"
                    value={formData.tempatLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Row 4: Orang Tua / Wali & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.namaWali || ''}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. HP / WA Orang Tua
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-3344-5501"
                    value={formData.teleponWali || ''}
                    onChange={(e) => setFormData({ ...formData, teleponWali: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Row 5: Alamat */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Tempat Tinggal
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Dusun Gemenggeng RT 02 RW 01, Kec. Pace"
                  value={formData.alamat || ''}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-xs"
                >
                  {editingSiswa ? 'Simpan Perubahan' : 'Simpan Data Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!siswaToDelete}
        title="Hapus Data Siswa"
        message={`Apakah Anda yakin ingin menghapus data siswa "${siswaToDelete?.nama}"?`}
        detail={`Kelas ${siswaToDelete?.kelas} • NISN: ${siswaToDelete?.nisn} • NIS: ${siswaToDelete?.nis}`}
        confirmLabel="Ya, Hapus Data Siswa"
        onConfirm={() => {
          if (siswaToDelete) {
            onDeleteSiswa(siswaToDelete.id);
            setSiswaToDelete(null);
          }
        }}
        onCancel={() => setSiswaToDelete(null)}
      />
    </div>
  );
};
