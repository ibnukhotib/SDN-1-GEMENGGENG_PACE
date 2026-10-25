import React from 'react';
import { SEKOLAH_INFO } from '../data/initialData';
import { PendidikTendik } from '../types';
import {
  Compass,
  Sparkles,
  Target,
  Award,
  Heart,
  BookOpen,
  Users,
  ShieldCheck,
  Printer,
  School,
  CheckCircle2,
  Download,
  Flame,
  Shield,
  Palette
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';

interface VisiMisiViewProps {
  kepsek?: PendidikTendik;
}

export const VisiMisiView: React.FC<VisiMisiViewProps> = ({ kepsek }) => {
  const kepsekNama = kepsek
    ? `${kepsek.nama}${kepsek.gelar && kepsek.gelar !== '-' ? `, ${kepsek.gelar}` : ''}`
    : SEKOLAH_INFO.kepalaSekolah;
  const dimensiPancasila = [
    { title: 'Beriman & Bertakwa', desc: 'Berakhlak mulia kepada Tuhan YME, sesama manusia, dan alam sekitar.' },
    { title: 'Berkebinekaan Global', desc: 'Menghargai budaya nusantara serta berwawasan terbuka terhadap peradaban dunia.' },
    { title: 'Bergotong Royong', desc: 'Mampu berkolaborasi, peduli, dan berbagi bersama warga sekolah dan masyarakat.' },
    { title: 'Mandiri', desc: 'Prakarsa atas pengembangan dirinya yang didasari pada pengenalan kekuatan diri.' },
    { title: 'Bernalar Kritis', desc: 'Mampu memproses informasi secara objektif, menganalisis, dan mengambil kesimpulan.' },
    { title: 'Kreatif', desc: 'Menghasilkan gagasan orisinal, karya nyata bernilai guna, dan tindakan inovatif.' }
  ];

  const pembiasaanKarakter = [
    { title: 'Budaya 5S Pagi', desc: 'Senyum, Salam, Sapa, Sopan, dan Santun saat menyambut siswa di pintu gerbang.' },
    { title: 'Sholat Dhuha & Doa Bersama', desc: 'Menanamkan kecerdasan spiritual dan ketenangan hati setiap pagi sebelum KBM.' },
    { title: 'Gerakan Literasi 15 Menit', desc: 'Membaca buku non-pelajaran di Pojok Baca kelas dan perpustakaan.' },
    { title: 'Jumat Bersih & Sehat (Adiwiyata)', desc: 'Senam bersama, sarapan bergizi, dan aksi peduli kebersihan lingkungan sekolah.' }
  ];

  return (
    <div className="space-y-6">
      <PrintHeader
        judulDokumen="VISI, MISI DAN TUJUAN PENDIDIKAN"
        subJudul="SDN 1 GEMENGGENG - KECAMATAN PACE, KABUPATEN NGANJUK"
      />

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span>Visi, Misi & Profil SDN 1 Gemenggeng</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Arah kebijakan, cita-cita luhur, dan fondasi karakter pendidikan dasar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Profil Visi Misi</span>
          </button>
        </div>
      </div>

      {/* Identitas Sekolah Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center gap-4 mb-4 pb-3 border-b border-slate-100">
          <div className="w-14 h-14 flex items-center justify-center shrink-0 drop-shadow-xs">
            <img
              src="/logo.png"
              alt="Logo SDN 1 Gemenggeng"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Identitas Resmi Sekolah
            </h2>
            <p className="text-xs text-slate-500">
              Data pokok satuan pendidikan dasar terdaftar di Kemendikdasmen RI &bull; Pace, Nganjuk
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-medium block mb-0.5">Nama Satuan:</span>
            <span className="font-bold text-slate-900 text-sm">{SEKOLAH_INFO.nama}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-medium block mb-0.5">NPSN:</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{SEKOLAH_INFO.npsn}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-medium block mb-0.5">Akreditasi & Kurikulum:</span>
            <span className="font-bold text-emerald-700">{SEKOLAH_INFO.akreditasi} &bull; {SEKOLAH_INFO.kurikulum}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-medium block mb-0.5">Kepala Sekolah:</span>
            <span className="font-bold text-slate-900 block truncate">{kepsekNama}</span>
            <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
              NIP: {kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : SEKOLAH_INFO.nipKepsek}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap gap-4">
          <span><strong>Alamat:</strong> {SEKOLAH_INFO.alamat}</span>
          <span><strong>Telepon:</strong> {SEKOLAH_INFO.telepon}</span>
          <span><strong>Email:</strong> {SEKOLAH_INFO.email}</span>
        </div>
      </div>

      {/* Profil Pimpinan Satuan Pendidikan (Terintegrasi Penuh dengan Data PTK) */}
      <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div className="relative shrink-0">
            <img
              src={
                kepsek?.fotoUrl ||
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
              }
              alt={kepsekNama}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
              }}
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold shadow-xs">
              Pimpinan
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Kepala Satuan Pendidikan
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Terhubung Otomatis dengan Data Pendidik (PTK)
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {kepsekNama}
            </h3>
            <p className="text-xs text-slate-500">
              {kepsek?.mapelAtauTugas || 'Penanggung Jawab Manajerial, Supervisi, & Pengembangan Satuan Pendidikan'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">NIP / NUPTK</span>
                <span className="font-mono font-bold text-slate-800 text-[11px] block truncate">
                  {kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : SEKOLAH_INFO.nipKepsek}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pangkat / Golongan</span>
                <span className="font-bold text-slate-800">
                  {kepsek?.golongan ? `Gol. ${kepsek.golongan}` : 'Pembina (IV/a)'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pendidikan Terakhir</span>
                <span className="font-bold text-slate-800">
                  {kepsek?.pendidikanTerakhir || 'S2 Manajemen Pendidikan'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Kepegawaian</span>
                <span className="font-bold text-emerald-700">
                  {kepsek?.statusKepegawaian || 'PNS'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Makna Lambang & Logo Sekolah Card */}
      <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl border border-emerald-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Logo Showcase Visual */}
          <div className="flex flex-col items-center text-center shrink-0">
            <div className="relative group">
              <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center drop-shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Logo Resmi SDN 1 Gemenggeng"
                  className="w-full h-full object-contain filter drop-shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Logo Resmi SDN 1 Gemenggeng
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Kec. Pace, Kab. Nganjuk</p>
            </div>
            <a
              href="/logo.png"
              download="logo-sdn1gemenggeng.png"
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-emerald-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File Logo</span>
            </a>
          </div>

          {/* Philosophy & Elements Breakdown */}
          <div className="space-y-4 flex-1">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                Identitas Visual & Karakter
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                Filosofi & Makna Lambang SDN 1 Gemenggeng
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dirancang dengan bentuk lingkaran harmonis yang melambangkan kebulatan tekad, persatuan warga sekolah, dan kesinambungan pendidikan yang tiada henti.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Obor Ilmu & Bunga Teratai</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Cahaya petunjuk dan semangat belajar yang tak pernah padam, serta kesucian budi pekerti luhur peserta didik.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Buku Terbuka & Daun Padi</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Fondasi literasi, ilmu pengetahuan luas, serta kemakmuran dan kerendahan hati dalam menggapai cita-cita.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Perisai & Bintang Kejora</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Ketahanan moral dan perlindungan generasi muda berlandaskan Ketuhanan Yang Maha Esa dan nilai Pancasila.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Palette className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Pita Slogan & Warna Hijau-Emas</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  "Cerdas, Berkarakter, Berbudaya" &mdash; Hijau zamrud melambangkan pertumbuhan asri Adiwiyata, emas melambangkan prestasi gemilang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visi Sekolah Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Visi Sekolah Dasar Negeri 1 Gemenggeng</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug tracking-tight text-white italic">
            "{SEKOLAH_INFO.visi}"
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed pt-2">
            Visi ini menjadi kompas seluruh pendidik, tenaga kependidikan, siswa, dan orang tua wali dalam mewujudkan pendidikan bermutu yang menjunjung tinggi budi pekerti serta kepedulian lingkungan hidup.
          </p>
        </div>
      </div>

      {/* Misi & Tujuan Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Misi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Misi Sekolah
              </h3>
              <p className="text-xs text-slate-500">Langkah nyata pencapaian visi</p>
            </div>
          </div>

          <div className="space-y-3">
            {SEKOLAH_INFO.misi.map((misi, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60"
              >
                <div className="w-6 h-6 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {misi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tujuan Sekolah */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tujuan Satuan Pendidikan
              </h3>
              <p className="text-xs text-slate-500">Target capaian lulusan dan mutu</p>
            </div>
          </div>

          <div className="space-y-3">
            {SEKOLAH_INFO.tujuan.map((tujuan, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100/70"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {tujuan}
                </p>
              </div>
            ))}
          </div>

          {/* Slogan */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Motto & Slogan
            </span>
            <div className="text-sm font-black text-amber-950">
              "GEMILANG, BERKARAKTER, BERPRESTASI"
            </div>
          </div>
        </div>
      </div>

      {/* Profil Pelajar Pancasila 6 Dimensi */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              6 Dimensi Profil Pelajar Pancasila
            </h3>
            <p className="text-xs text-slate-500">
              Karakter inti yang ditanamkan dalam Projek P5 dan kegiatan harian siswa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensiPancasila.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4 className="font-bold text-xs text-slate-900">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pembiasaan Karakter & Budaya Sekolah */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Budaya & Pembiasaan Karakter Sekolah
            </h3>
            <p className="text-xs text-slate-500">
              Aktivitas harian yang membentuk kedisiplinan dan rasa empati peserta didik
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pembiasaanKarakter.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1.5"
            >
              <h4 className="font-bold text-xs text-emerald-900">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
