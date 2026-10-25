import React, { useState } from 'react';
import {
  PendidikTendik,
  Siswa,
  KegiatanSekolah,
  AlbumKegiatan,
  PresensiPtkRecord,
  PresensiSiswaRecord
} from '../types';
import { SEKOLAH_INFO } from '../data/initialData';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  ChevronRight,
  UserPlus,
  PlusCircle,
  FileEdit,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  School,
  ArrowRight,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Edit3,
  ExternalLink,
  Check,
  X,
  Lock,
  KeyRound
} from 'lucide-react';
import { TabKey } from './Sidebar';

interface DashboardViewProps {
  ptkList: PendidikTendik[];
  siswaList: Siswa[];
  kegiatanList: KegiatanSekolah[];
  albumList: AlbumKegiatan[];
  presensiPtk: PresensiPtkRecord[];
  presensiSiswa: PresensiSiswaRecord[];
  pesanKepsek: string;
  onSavePesanKepsek: (pesan: string) => void;
  onNavigate: (tab: TabKey) => void;
  onOpenAddPtk: () => void;
  onOpenAddSiswa: () => void;
  onEditPtk?: (ptk: PendidikTendik) => void;
  isAdmin?: boolean;
  onRequireAdmin?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  ptkList,
  siswaList,
  kegiatanList,
  albumList,
  presensiPtk,
  presensiSiswa,
  pesanKepsek,
  onSavePesanKepsek,
  onNavigate,
  onOpenAddPtk,
  onOpenAddSiswa,
  onEditPtk,
  isAdmin = false,
  onRequireAdmin
}) => {
  // Modal for editing principal message
  const [isEditingPesanModal, setIsEditingPesanModal] = useState(false);
  const [tempPesan, setTempPesan] = useState(pesanKepsek);

  // Dynamically find teacher with Kepala Sekolah position
  const kepsek = ptkList.find(
    (p) =>
      p.jabatan.toLowerCase().includes('kepala sekolah') ||
      p.jabatan.toLowerCase().includes('kepsek')
  );

  const kepsekNamaLengkap = kepsek
    ? `${kepsek.nama}${kepsek.gelar && kepsek.gelar !== '-' ? `, ${kepsek.gelar}` : ''}`
    : SEKOLAH_INFO.kepalaSekolah;

  const kepsekNip = kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : SEKOLAH_INFO.nipKepsek;
  const kepsekFoto =
    kepsek?.fotoUrl ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
  const kepsekGolongan = kepsek?.golongan;
  const kepsekJabatan = kepsek?.jabatan || 'Kepala Sekolah';

  // Statistics calculations
  const totalGuru = ptkList.filter((p) => p.jenis === 'Pendidik').length;
  const totalTendik = ptkList.filter((p) => p.jenis === 'Tenaga Kependidikan').length;

  const kelasDistribution = [1, 2, 3, 4, 5, 6].map((k) => ({
    kelas: k,
    total: siswaList.filter((s) => s.kelas === String(k)).length
  }));

  // Presensi PTK stats today
  const ptkHadir = presensiPtk.filter((p) => p.status === 'Hadir').length;
  const ptkDL = presensiPtk.filter((p) => p.status === 'Dinas Luar').length;
  const ptkPercent = ptkList.length > 0 ? Math.round(((ptkHadir + ptkDL) / ptkList.length) * 100) : 0;

  // Presensi Siswa stats today
  const siswaHadir = presensiSiswa.filter((s) => s.status === 'Hadir').length;
  const siswaPercent = siswaList.length > 0 ? Math.round((siswaHadir / siswaList.length) * 100) : 0;

  // Upcoming events
  const upcomingEvents = kegiatanList
    .filter((k) => k.status !== 'Selesai')
    .slice(0, 3);

  // Latest photos
  const latestPhotos = albumList.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-3xl">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 drop-shadow-2xl">
              <img
                src="/logo.png"
                alt="Logo SDN 1 Gemenggeng"
                className="w-full h-full object-contain filter drop-shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold backdrop-blur-xs border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Portal Resmi SDN 1 Gemenggeng &bull; Kurikulum Merdeka</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Selamat Datang di Sistem Informasi {SEKOLAH_INFO.nama}
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Mewujudkan ekosistem sekolah dasar yang unggul, terintegrasi, transparan, dan ramah anak di Kecamatan Pace, Kabupaten Nganjuk.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs text-emerald-200">
                <span className="bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                  NPSN: {SEKOLAH_INFO.npsn}
                </span>
                <span className="bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                  Akreditasi: {SEKOLAH_INFO.akreditasi}
                </span>
                <span className="bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                  Semester Ganjil 2026/2027
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons inside Hero */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            {isAdmin ? (
              <>
                <button
                  onClick={onOpenAddSiswa}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-all shadow-sm active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Input Siswa Berfoto</span>
                </button>
                <button
                  onClick={onOpenAddPtk}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all backdrop-blur-xs border border-white/20 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Input Data Guru / PTK</span>
                </button>
                <button
                  onClick={() => onNavigate('nilai')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs transition-all border border-emerald-500/30"
                >
                  <FileEdit className="w-4 h-4" />
                  <span>Input Nilai Rapor</span>
                </button>
              </>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-700/50 backdrop-blur-xs space-y-2 max-w-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Lock className="w-4 h-4" />
                  <span>Mode Pelihat (Tamu)</span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  Pengeditan & input data dikunci untuk umum. Masuk dengan PIN untuk mengelola.
                </p>
                {onRequireAdmin && (
                  <button
                    onClick={onRequireAdmin}
                    className="w-full mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-colors shadow-xs"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Masuk Sebagai Admin</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendidik & Tendik */}
        <div
          onClick={() => onNavigate('ptk')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              PTK Aktif
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-800">{ptkList.length} Orang</div>
            <p className="text-xs text-slate-500 mt-1">
              {totalGuru} Guru &bull; {totalTendik} Tenaga Kependidikan
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-blue-600 font-medium">
            <span>Kelola Guru & Staf</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Siswa Total */}
        <div
          onClick={() => onNavigate('siswa')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Kelas 1 - 6
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-800">{siswaList.length} Siswa</div>
            <p className="text-xs text-slate-500 mt-1">
              Tersebar di 6 rombongan belajar
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-emerald-700 font-medium">
            <span>Lihat Data Siswa Berfoto</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Kehadiran Guru Hari Ini */}
        <div
          onClick={() => onNavigate('presensi-ptk')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              Presensi Guru
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-800">{ptkPercent}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {ptkHadir} Hadir &bull; {ptkDL} Dinas Luar
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-teal-700 font-medium">
            <span>Cek Presensi Harian PTK</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Kehadiran Siswa Hari Ini */}
        <div
          onClick={() => onNavigate('presensi-siswa')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Presensi Siswa
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-800">{siswaPercent}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {siswaHadir} dari {siswaList.length} siswa hadir
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-amber-700 font-medium">
            <span>Rekap Kehadiran Kelas</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Visi Misi + Kepala Sekolah on Left, Events & Album on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visi Misi Card & Sambutan (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visi Misi Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Visi & Misi SDN 1 GEMENGGENG
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pedoman arah pendidikan & pembentukan karakter peserta didik
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('visi-misi')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Lihat Profil Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visi Quote */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 p-4 rounded-2xl border border-emerald-100/80 mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visi Sekolah</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed italic">
                "{SEKOLAH_INFO.visi}"
              </p>
            </div>

            {/* Misi List (Summarized 4 key points on dashboard) */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Misi Prioritas Sekolah
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {SEKOLAH_INFO.misi.slice(0, 4).map((misi, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-2.5 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">{misi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Distribusi Siswa per Kelas */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Rombongan Belajar (Rombel) Kelas 1 s/d 6
                </h3>
                <p className="text-xs text-slate-500">
                  Jumlah siswa aktif terdaftar pada masing-masing tingkatan
                </p>
              </div>
              <button
                onClick={() => onNavigate('siswa')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Buka Data Siswa
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {kelasDistribution.map((item) => (
                <div
                  key={item.kelas}
                  onClick={() => onNavigate('siswa')}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700">
                    Kelas {item.kelas}
                  </span>
                  <div className="text-xl font-extrabold text-slate-800 group-hover:text-emerald-800 mt-1">
                    {item.total}
                  </div>
                  <span className="text-[10px] text-slate-400">Siswa</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sambutan Kepala Sekolah - Terintegrasi dengan Data PTK */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-emerald-900/40">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative shrink-0">
                <img
                  src={kepsekFoto}
                  alt={kepsekNamaLengkap}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-xs" title="Jabatan Kepala Sekolah">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              </div>

              <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    <Sparkles className="w-3 h-3" />
                    <span>Pesan & Sambutan Kepala Sekolah</span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 no-print">
                      <button
                        onClick={() => {
                          setTempPesan(pesanKepsek);
                          setIsEditingPesanModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors border border-white/10"
                        title="Edit kata-kata pesan sambutan Kepala Sekolah"
                      >
                        <Edit3 className="w-3 h-3 text-emerald-300" />
                        <span>Edit Pesan</span>
                      </button>
                      {kepsek && (
                        <button
                          onClick={() => {
                            if (onEditPtk) {
                              onEditPtk(kepsek);
                            } else {
                              onNavigate('ptk');
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/60 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors border border-emerald-400/30"
                          title="Ubah profil / nama / foto kepala sekolah di data PTK"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Data PTK</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white tracking-wide">
                    {kepsekNamaLengkap}
                  </h4>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    {kepsekJabatan} &bull; NIP: {kepsekNip}{kepsekGolongan ? ` &bull; Gol: ${kepsekGolongan}` : ''}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black/25 border border-white/5 backdrop-blur-2xs">
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{pesanKepsek}"
                  </p>
                </div>

                <div className="text-[10px] text-emerald-300/80 flex items-center justify-center sm:justify-start gap-1">
                  <span>&bull; Terintegrasi otomatis dengan Data Pendidik & Tenaga Pendidik ({kepsekJabatan})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Kegiatan Terdekat & Album Dokumentasi */}
        <div className="space-y-6">
          {/* Jadwal Kegiatan Terdekat */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Agenda Terdekat</h3>
              </div>
              <button
                onClick={() => onNavigate('kegiatan')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Semua
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((keg) => (
                <div
                  key={keg.id}
                  onClick={() => onNavigate('kegiatan')}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {keg.kategori}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {keg.tanggalMulai}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-1">
                    {keg.judul}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{keg.waktu}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Album Foto Kegiatan Terkini */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Dokumentasi Album</h3>
              </div>
              <button
                onClick={() => onNavigate('album')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Galeri
              </button>
            </div>

            <div className="space-y-3">
              {latestPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('album')}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 cursor-pointer shadow-xs"
                >
                  <img
                    src={item.fotoUrl}
                    alt={item.judul}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-semibold text-emerald-300">
                      {item.tanggal}
                    </span>
                    <h5 className="text-xs font-bold text-white line-clamp-1">
                      {item.judul}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Pesan Kepala Sekolah */}
      {isEditingPesanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Pesan Kepala Sekolah
                  </h3>
                  <p className="text-xs text-slate-500">
                    {kepsekNamaLengkap} &bull; {kepsekJabatan}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingPesanModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSavePesanKepsek(tempPesan);
                setIsEditingPesanModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pesan / Sambutan untuk Warga Sekolah
                </label>
                <textarea
                  rows={4}
                  required
                  value={tempPesan}
                  onChange={(e) => setTempPesan(e.target.value)}
                  placeholder="Ketikkan pesan, motivasi, atau sambutan dari Kepala Sekolah..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed text-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-800">
                Pesan ini langsung terhubung dengan profil {kepsekNamaLengkap} dari data PTK dan akan tampil di halaman Beranda SDN 1 Gemenggeng.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingPesanModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  Simpan Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
