import React, { useState, useEffect } from 'react';
import { PendidikTendik, StatusKepegawaian } from '../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Edit,
  Trash2,
  X,
  Camera,
  Printer,
  CheckCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { ConfirmModal } from './ConfirmModal';

interface PtkViewProps {
  ptkList: PendidikTendik[];
  onSavePtk: (ptk: PendidikTendik) => void;
  onDeletePtk: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingPtkTarget?: PendidikTendik | null;
  onClearEditingPtkTarget?: () => void;
  isAdmin?: boolean;
}

export const PtkView: React.FC<PtkViewProps> = ({
  ptkList,
  onSavePtk,
  onDeletePtk,
  isAddModalOpen,
  setIsAddModalOpen,
  editingPtkTarget,
  onClearEditingPtkTarget,
  isAdmin = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'Semua' | 'Pendidik' | 'Tenaga Kependidikan'>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // Edit State
  const [editingPtk, setEditingPtk] = useState<PendidikTendik | null>(null);
  // Delete State
  const [ptkToDelete, setPtkToDelete] = useState<PendidikTendik | null>(null);

  useEffect(() => {
    if (editingPtkTarget) {
      setEditingPtk(editingPtkTarget);
      setFormData({ ...editingPtkTarget });
      setPreviewImage(editingPtkTarget.fotoUrl);
      setIsAddModalOpen(true);
      onClearEditingPtkTarget?.();
    }
  }, [editingPtkTarget]);

  // Form State
  const [formData, setFormData] = useState<Partial<PendidikTendik>>({
    nama: '',
    gelar: 'S.Pd.',
    nip: '',
    jabatan: 'Guru Kelas',
    jenis: 'Pendidik',
    golongan: 'III/a',
    pendidikanTerakhir: 'S1 PGSD',
    mapelAtauTugas: '',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Laki-laki',
    telepon: '',
    email: '',
    fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
  });

  const [previewImage, setPreviewImage] = useState<string>('');

  const openAddModal = () => {
    setEditingPtk(null);
    setFormData({
      nama: '',
      gelar: 'S.Pd.',
      nip: '',
      jabatan: 'Guru Kelas',
      jenis: 'Pendidik',
      golongan: 'III/a',
      pendidikanTerakhir: 'S1 PGSD',
      mapelAtauTugas: '',
      statusKepegawaian: 'PNS',
      jenisKelamin: 'Laki-laki',
      telepon: '',
      email: '',
      fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
    });
    setPreviewImage('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (ptk: PendidikTendik) => {
    setEditingPtk(ptk);
    setFormData({ ...ptk });
    setPreviewImage(ptk.fotoUrl);
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
    if (!formData.nama) {
      alert('Nama wajib diisi');
      return;
    }

    const newOrUpdatedPtk: PendidikTendik = {
      id: editingPtk ? editingPtk.id : `ptk-${Date.now()}`,
      nama: formData.nama || '',
      gelar: formData.gelar || '',
      nip: formData.nip || '-',
      jabatan: formData.jabatan || 'Guru',
      jenis: formData.jenis || 'Pendidik',
      golongan: formData.golongan || '-',
      pendidikanTerakhir: formData.pendidikanTerakhir || 'S1',
      mapelAtauTugas: formData.mapelAtauTugas || '',
      statusKepegawaian: (formData.statusKepegawaian || 'PNS') as StatusKepegawaian,
      jenisKelamin: formData.jenisKelamin || 'Laki-laki',
      telepon: formData.telepon || '-',
      email: formData.email || '-',
      fotoUrl:
        previewImage ||
        formData.fotoUrl ||
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
    };

    onSavePtk(newOrUpdatedPtk);
    setIsAddModalOpen(false);
  };

  // Filtered List sorted with Kepala Sekolah always on top
  const filteredList = ptkList
    .filter((ptk) => {
      const matchesSearch =
        ptk.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ptk.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ptk.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ptk.mapelAtauTugas.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJenis =
        selectedFilter === 'Semua' ? true : ptk.jenis === selectedFilter;

      const matchesStatus =
        statusFilter === 'Semua' ? true : ptk.statusKepegawaian === statusFilter;

      return matchesSearch && matchesJenis && matchesStatus;
    })
    .sort((a, b) => {
      const aIsKepsek =
        a.jabatan.toLowerCase().includes('kepala sekolah') ||
        a.jabatan.toLowerCase().includes('kepsek');
      const bIsKepsek =
        b.jabatan.toLowerCase().includes('kepala sekolah') ||
        b.jabatan.toLowerCase().includes('kepsek');
      if (aIsKepsek && !bIsKepsek) return -1;
      if (!aIsKepsek && bIsKepsek) return 1;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Official Print Letterhead for physical printing */}
      <PrintHeader
        judulDokumen="DAFTAR PENDIDIK DAN TENAGA KEPENDIDIKAN (PTK)"
        subJudul="Status Kepegawaian & Tugas Mengajar - SDN 1 GEMENGGENG"
      />

      {/* Screen Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Data Pendidik & Tenaga Kependidikan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manajemen lengkap guru, kepala sekolah, tata usaha, dan staf SDN 1 Gemenggeng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap PTK</span>
          </button>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Input Data PTK Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Device Sync Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950 no-print">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span><strong>Basis Data Terpusat:</strong> Data pendidik tersinkronisasi realtime antara Laptop, HP, dan Tablet melalui URL.</span>
        </div>
        <span className="text-[11px] text-emerald-700 font-medium">Kepala Sekolah: <strong>VITA DEWI SUSANTI, S.Pd. M.Pd</strong></span>
      </div>

      {/* Filter and Search Bar (no-print) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIP, atau mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Quick Filter tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
              {(['Semua', 'Pendidik', 'Tenaga Kependidikan'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    selectedFilter === tab
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'Pendidik' ? 'Guru (Pendidik)' : tab === 'Tenaga Kependidikan' ? 'Tendik' : tab}
                </button>
              ))}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Status</option>
              <option value="PNS">PNS</option>
              <option value="PPPK">PPPK</option>
              <option value="GTT">GTT (Guru Honorer)</option>
              <option value="PTT">PTT (Pegawai Honorer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* PTK Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredList.map((ptk) => {
          const isKepsek =
            ptk.jabatan.toLowerCase().includes('kepala sekolah') ||
            ptk.jabatan.toLowerCase().includes('kepsek');

          return (
            <div
              key={ptk.id}
              className={`rounded-2xl transition-all p-5 flex flex-col justify-between print:border print:border-slate-300 print:shadow-none print:break-inside-avoid ${
                isKepsek
                  ? 'bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/20 border-2 border-emerald-500/60 ring-2 ring-emerald-500/10 shadow-xs'
                  : 'bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header with Photo & Status */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={ptk.fotoUrl}
                      alt={ptk.nama}
                      className={`w-16 h-16 rounded-2xl object-cover ring-2 shadow-2xs ${
                        isKepsek ? 'ring-emerald-500' : 'ring-emerald-100'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          ptk.jenisKelamin === 'Perempuan'
                            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
                            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                    {isKepsek && (
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-600 text-white shadow-xs" title="Pimpinan Satuan Pendidikan">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isKepsek && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-700 text-white flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          Kepala Sekolah (Terintegrasi)
                        </span>
                      )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ptk.statusKepegawaian === 'PNS'
                          ? 'bg-blue-100 text-blue-800'
                          : ptk.statusKepegawaian === 'PPPK'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ptk.statusKepegawaian}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Gol: {ptk.golongan || '-'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">
                    {ptk.nama}{ptk.gelar && ptk.gelar !== '-' ? `, ${ptk.gelar}` : ''}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 truncate">
                    {ptk.jabatan}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    NIP: {ptk.nip}
                  </p>
                </div>
              </div>

              {/* Details specs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tugas / Mapel:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">
                    {ptk.mapelAtauTugas}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pendidikan:</span>
                  <span className="font-semibold text-slate-800">
                    {ptk.pendidikanTerakhir}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kontak:</span>
                  <span className="font-semibold text-slate-800">
                    {ptk.telepon}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions (no-print) */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between no-print">
              <span className="text-[11px] text-slate-400">
                {ptk.jenis}
              </span>
              {isAdmin && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(ptk)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Edit Data PTK"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPtkToDelete(ptk)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Hapus Data PTK"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>

      {filteredList.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-medium">Tidak ada data pendidik atau tenaga kependidikan yang sesuai kriteria pencarian.</p>
        </div>
      )}

      {/* Modal Input & Edit PTK */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingPtk ? 'Edit Data Pendidik & Tendik' : 'Input Data Pendidik / Tendik Baru'}
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
              {/* Photo preview & upload */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="relative">
                  <img
                    src={
                      previewImage ||
                      formData.fotoUrl ||
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
                    }
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500"
                  />
                  <label className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 shadow-xs">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">Foto Profil Pendidik / Tendik</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Klik ikon kamera untuk unggah foto dari komputer/perangkat (JPG/PNG).
                  </p>
                </div>
              </div>

              {/* Row 1: Nama & Gelar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Vita Dewi Susanti"
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gelar
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: S.Pd."
                    value={formData.gelar || ''}
                    onChange={(e) => setFormData({ ...formData, gelar: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: NIP & Jabatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    placeholder="19820315 200604..."
                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    list="jabatan-ptk-options"
                    placeholder="Contoh: Kepala Sekolah / Guru Kelas 1"
                    value={formData.jabatan || ''}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <datalist id="jabatan-ptk-options">
                    <option value="Kepala Sekolah" />
                    <option value="Guru Kelas 1" />
                    <option value="Guru Kelas 2" />
                    <option value="Guru Kelas 3" />
                    <option value="Guru Kelas 4" />
                    <option value="Guru Kelas 5" />
                    <option value="Guru Kelas 6" />
                    <option value="Guru Pendidikan Agama Islam (PAI)" />
                    <option value="Guru PJOK" />
                    <option value="Tenaga Administrasi / Tata Usaha" />
                    <option value="Pengelola Perpustakaan" />
                    <option value="Penjaga Sekolah" />
                  </datalist>
                </div>
              </div>

              {/* Row 3: Jenis & Status Kepegawaian */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.jenis || 'Pendidik'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenis: e.target.value as 'Pendidik' | 'Tenaga Kependidikan'
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Pendidik">Pendidik (Guru)</option>
                    <option value="Tenaga Kependidikan">Tenaga Kependidikan (Tendik)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Kepegawaian
                  </label>
                  <select
                    value={formData.statusKepegawaian || 'PNS'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statusKepegawaian: e.target.value as StatusKepegawaian
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT">GTT (Honorer)</option>
                    <option value="PTT">PTT (Honorer)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pangkat / Golongan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: III/a, IX, IV/a"
                    value={formData.golongan || ''}
                    onChange={(e) => setFormData({ ...formData, golongan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 4: Pendidikan & Mapel/Tugas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: S1 PGSD, S1 PAI"
                    value={formData.pendidikanTerakhir || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, pendidikanTerakhir: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tugas / Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Wali Kelas 1 / PJOK"
                    value={formData.mapelAtauTugas || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, mapelAtauTugas: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Row 5: Telepon & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Handphone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-3456-7890"
                    value={formData.telepon || ''}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="guru@sdn1gemenggeng.sch.id"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  {editingPtk ? 'Simpan Perubahan' : 'Tambah Data PTK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!ptkToDelete}
        title="Hapus Data Pendidik / Tendik"
        message={`Apakah Anda yakin ingin menghapus data "${ptkToDelete?.nama}${ptkToDelete?.gelar && ptkToDelete?.gelar !== '-' ? `, ${ptkToDelete?.gelar}` : ''}"?`}
        detail={`Jabatan: ${ptkToDelete?.jabatan} • NIP: ${ptkToDelete?.nip || '-'} • Status: ${ptkToDelete?.statusKepegawaian || '-'}`}
        confirmLabel="Ya, Hapus Data PTK"
        onConfirm={() => {
          if (ptkToDelete) {
            onDeletePtk(ptkToDelete.id);
            setPtkToDelete(null);
          }
        }}
        onCancel={() => setPtkToDelete(null)}
      />
    </div>
  );
};
