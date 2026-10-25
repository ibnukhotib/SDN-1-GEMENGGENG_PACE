import type { PendidikTendik, Siswa, JadwalPelajaran, KegiatanSekolah, AlbumKegiatan, NilaiSiswaRecord, PresensiPtkRecord, PresensiSiswaRecord } from '../types/index.ts';

export const SEKOLAH_INFO = {
  nama: 'SDN 1 GEMENGGENG',
  npsn: '20537803',
  akreditasi: 'B',
  kurikulum: 'Kurikulum Merdeka',
  alamat: 'Jl. Raya Gemenggeng No. 12, Desa Gemenggeng, Kec. Pace, Kab. Nganjuk, Jawa Timur 64472',
  telepon: '(0358) 321890',
  email: 'sdn1gemenggeng.nganjuk@gmail.sch.id',
  logoUrl: '/logo.png',
  kepalaSekolah: 'VITA DEWI SUSANTI, S.Pd., M.Pd.',
  nipKepsek: '19830723 200604 2 022',
  visi: 'Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Terampil, Mandiri, dan Berwawasan Lingkungan Berlandaskan Profil Pelajar Pancasila.',
  misi: [
    'Menumbuhkan keimanan, ketakwaan, dan budi pekerti luhur melalui pembiasaan ibadah dan budaya 5S (Senyum, Salam, Sapa, Sopan, Santun).',
    'Melaksanakan pembelajaran berdiferensiasi yang aktif, inovatif, kreatif, dan bermakna sesuai Kurikulum Merdeka.',
    'Mengembangkan potensi, bakat, minat siswa dalam bidang akademik, seni, olahraga, dan kepramukaan untuk meraih prestasi gemilang.',
    'Meningkatkan budaya literasi, numerasi, dan penguasaan teknologi informasi secara bijak dan bertanggung jawab.',
    'Menciptakan lingkungan sekolah yang aman, asri, bersih, sehat, dan ramah anak (Adiwiyata).',
    'Membangun sinergi harmonis antara sekolah, komite, orang tua wali, dan masyarakat sekitar.'
  ],
  tujuan: [
    'Mempersiapkan lulusan yang kompeten, berakhlak mulia, dan siap melanjutkan ke jenjang SMP/MTs unggulan.',
    'Mencapai rata-rata nilai asesmen nasional (ANBK) berkategori Mahir dan Cakap.',
    'Menjuarai berbagai kompetisi akademik (OSN, FLS2N, O2SN) di tingkat kecamatan dan kabupaten.',
    'Mewujudkan sekolah berbasis digital yang transparan dan akuntabel.'
  ]
};

export const INITIAL_PTK: PendidikTendik[] = [
  {
    id: 'ptk-1',
    nama: 'VITA DEWI SUSANTI',
    gelar: 'S.Pd., M.Pd.',
    nip: '19830723 200604 2 022',
    jabatan: 'Kepala Sekolah',
    jenis: 'Pendidik',
    golongan: 'IV/a',
    pendidikanTerakhir: 'S2 Manajemen Pendidikan',
    mapelAtauTugas: 'Manajerial & Supervisi Pendidikan',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Perempuan',
    telepon: '0812-3456-7890',
    email: 'vitadewisusanti.gemenggeng@gmail.com',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-2',
    nama: 'Sri Wahyuni',
    gelar: 'S.Pd.SD',
    nip: '19820315 200604 2 011',
    jabatan: 'Guru Kelas 1',
    jenis: 'Pendidik',
    golongan: 'III/c',
    pendidikanTerakhir: 'S1 PGSD',
    mapelAtauTugas: 'Wali Kelas 1 & Guru Tematik',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Perempuan',
    telepon: '0813-8899-2231',
    email: 'sri.wahyuni@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-3',
    nama: 'Bambang Supriyadi',
    gelar: 'S.Pd.',
    nip: '19850920 200902 1 003',
    jabatan: 'Guru Kelas 2',
    jenis: 'Pendidik',
    golongan: 'III/b',
    pendidikanTerakhir: 'S1 PGSD',
    mapelAtauTugas: 'Wali Kelas 2',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Laki-laki',
    telepon: '0857-3321-4455',
    email: 'bambang.supriyadi@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-4',
    nama: 'Dewi Lestari',
    gelar: 'S.Pd.',
    nip: '19881104 201101 2 008',
    jabatan: 'Guru Kelas 3',
    jenis: 'Pendidik',
    golongan: 'III/a',
    pendidikanTerakhir: 'S1 PGSD',
    mapelAtauTugas: 'Wali Kelas 3 & Pembina Pramuka',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Perempuan',
    telepon: '0812-7766-5544',
    email: 'dewi.lestari@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-5',
    nama: 'Agus Setiawan',
    gelar: 'S.Pd.',
    nip: '19920814 201903 1 007',
    jabatan: 'Guru Kelas 4',
    jenis: 'Pendidik',
    golongan: 'IX',
    pendidikanTerakhir: 'S1 PGSD',
    mapelAtauTugas: 'Wali Kelas 4 & Operator Sekolah',
    statusKepegawaian: 'PPPK',
    jenisKelamin: 'Laki-laki',
    telepon: '0852-3344-8899',
    email: 'agus.setiawan@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-6',
    nama: 'Nurul Hidayati',
    gelar: 'S.Pd.',
    nip: '19870609 201001 2 015',
    jabatan: 'Guru Kelas 5',
    jenis: 'Pendidik',
    golongan: 'III/b',
    pendidikanTerakhir: 'S1 PGSD',
    mapelAtauTugas: 'Wali Kelas 5 & Koordinator Literasi',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Perempuan',
    telepon: '0813-9988-1122',
    email: 'nurul.hidayati@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-7',
    nama: 'Eko Prasetyo',
    gelar: 'S.Pd.',
    nip: '19800418 200501 1 009',
    jabatan: 'Guru Kelas 6',
    jenis: 'Pendidik',
    golongan: 'III/d',
    pendidikanTerakhir: 'S1 PGSD',
    mapelAtauTugas: 'Wali Kelas 6 & Koordinator Kurikulum',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Laki-laki',
    telepon: '0812-4455-6677',
    email: 'eko.prasetyo@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-8',
    nama: 'Ahmad Fauzi',
    gelar: 'S.Pd.I',
    nip: '19890210 201402 1 002',
    jabatan: 'Guru Pendidikan Agama Islam (PAI)',
    jenis: 'Pendidik',
    golongan: 'III/a',
    pendidikanTerakhir: 'S1 Pendidikan Agama Islam',
    mapelAtauTugas: 'Guru PAI & BP (Kelas 1 - 6)',
    statusKepegawaian: 'PNS',
    jenisKelamin: 'Laki-laki',
    telepon: '0856-7890-1234',
    email: 'ahmad.fauzi@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-9',
    nama: 'Rian Bagus Pamungkas',
    gelar: 'S.Pd.Jas',
    nip: '19950125 202221 1 005',
    jabatan: 'Guru PJOK',
    jenis: 'Pendidik',
    golongan: 'IX',
    pendidikanTerakhir: 'S1 Pendidikan Jasmani & Kesehatan',
    mapelAtauTugas: 'Guru Olahraga & Pelatih Silat/Voli',
    statusKepegawaian: 'PPPK',
    jenisKelamin: 'Laki-laki',
    telepon: '0896-1234-5678',
    email: 'rian.bagus@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-10',
    nama: 'Ratna Kusuma Wardani',
    gelar: 'A.Md.',
    nip: '19940718 202012 2 018',
    jabatan: 'Pengelola Perpustakaan',
    jenis: 'Tenaga Kependidikan',
    golongan: 'VII',
    pendidikanTerakhir: 'D3 Perpustakaan',
    mapelAtauTugas: 'Kepala Perpustakaan "Pelita Ilmu"',
    statusKepegawaian: 'PPPK',
    jenisKelamin: 'Perempuan',
    telepon: '0822-3344-5566',
    email: 'ratna.wardani@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-11',
    nama: 'Indra Gunawan',
    gelar: 'S.Kom.',
    nip: '19960305 202301 1 009',
    jabatan: 'Tata Usaha / Administrasi',
    jenis: 'Tenaga Kependidikan',
    golongan: 'IX',
    pendidikanTerakhir: 'S1 Sistem Informasi',
    mapelAtauTugas: 'Administrasi Kesiswaan & Dapodik',
    statusKepegawaian: 'PPPK',
    jenisKelamin: 'Laki-laki',
    telepon: '0857-9900-1122',
    email: 'indra.tu@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ptk-12',
    nama: 'Kuswanto',
    gelar: '-',
    nip: '-',
    jabatan: 'Penjaga & Keamanan Sekolah',
    jenis: 'Tenaga Kependidikan',
    golongan: '-',
    pendidikanTerakhir: 'SMA',
    mapelAtauTugas: 'Kebersihan & Keamanan Lingkungan',
    statusKepegawaian: 'PTT',
    jenisKelamin: 'Laki-laki',
    telepon: '0813-3344-9988',
    email: 'kuswanto@sdn1gemenggeng.sch.id',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SISWA: Siswa[] = [
  // Kelas 1
  {
    id: 'sis-101',
    nisn: '0165487123',
    nis: '2401',
    nama: 'Aditya Pratama',
    kelas: '1',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2017-05-14',
    namaWali: 'Budi Santoso',
    teleponWali: '0812-3344-5501',
    alamat: 'Dusun Gemenggeng RT 02 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-102',
    nisn: '0165487124',
    nis: '2402',
    nama: 'Anindya Kirana',
    kelas: '1',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2017-08-22',
    namaWali: 'Hendro Wibowo',
    teleponWali: '0812-3344-5502',
    alamat: 'Dusun Sambirejo RT 01 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-103',
    nisn: '0165487125',
    nis: '2403',
    nama: 'Bayu Danendra',
    kelas: '1',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2017-03-10',
    namaWali: 'Suradi',
    teleponWali: '0812-3344-5503',
    alamat: 'Dusun Gemenggeng RT 04 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-104',
    nisn: '0165487126',
    nis: '2404',
    nama: 'Citra Aulia Rahma',
    kelas: '1',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2017-11-05',
    namaWali: 'Mulyadi',
    teleponWali: '0812-3344-5504',
    alamat: 'Dusun Kedungringin RT 02 RW 03, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
  },
  // Kelas 2
  {
    id: 'sis-201',
    nisn: '0156789011',
    nis: '2301',
    nama: 'Dimas Arya Putra',
    kelas: '2',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2016-04-12',
    namaWali: 'Joko Widodo',
    teleponWali: '0813-4455-6601',
    alamat: 'Dusun Krajan RT 01 RW 01, Gemenggeng',
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-202',
    nisn: '0156789012',
    nis: '2302',
    nama: 'Elsa Nabila Putri',
    kelas: '2',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2016-09-18',
    namaWali: 'Suryanto',
    teleponWali: '0813-4455-6602',
    alamat: 'Dusun Gemenggeng RT 03 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-203',
    nisn: '0156789013',
    nis: '2303',
    nama: 'Fahri Ramadhan',
    kelas: '2',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2016-06-25',
    namaWali: 'Rahmat Hidayat',
    teleponWali: '0813-4455-6603',
    alamat: 'Dusun Ngrajek RT 02 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80'
  },
  // Kelas 3
  {
    id: 'sis-301',
    nisn: '0147891231',
    nis: '2201',
    nama: 'Gita Maharani',
    kelas: '3',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2015-02-14',
    namaWali: 'Bambang Irawan',
    teleponWali: '0852-5566-7701',
    alamat: 'Dusun Gemenggeng RT 05 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-302',
    nisn: '0147891232',
    nis: '2202',
    nama: 'Hafiz Syahputra',
    kelas: '3',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2015-07-30',
    namaWali: 'Imam Supardi',
    teleponWali: '0852-5566-7702',
    alamat: 'Dusun Banaran RT 01 RW 03, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-303',
    nisn: '0147891233',
    nis: '2203',
    nama: 'Indah Permatasari',
    kelas: '3',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2015-10-12',
    namaWali: 'Gunawan',
    teleponWali: '0852-5566-7703',
    alamat: 'Dusun Gemenggeng RT 01 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  // Kelas 4
  {
    id: 'sis-401',
    nisn: '0138902341',
    nis: '2101',
    nama: 'Kevin Alamsyah',
    kelas: '4',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2014-03-21',
    namaWali: 'Teguh Prasetyo',
    teleponWali: '0812-6677-8801',
    alamat: 'Dusun Gemenggeng RT 03 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-402',
    nisn: '0138902342',
    nis: '2102',
    nama: 'Larasati Ayu Ningrum',
    kelas: '4',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2014-08-09',
    namaWali: 'Sugeng Riyadi',
    teleponWali: '0812-6677-8802',
    alamat: 'Dusun Balongsono RT 02 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-403',
    nisn: '0138902343',
    nis: '2103',
    nama: 'Muhammad Rizky Pratama',
    kelas: '4',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2014-12-01',
    namaWali: 'Subandi',
    teleponWali: '0812-6677-8803',
    alamat: 'Dusun Gemenggeng RT 02 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'
  },
  // Kelas 5
  {
    id: 'sis-501',
    nisn: '0129013451',
    nis: '2001',
    nama: 'Nabila Zahra Putri',
    kelas: '5',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2013-01-19',
    namaWali: 'Suwito',
    teleponWali: '0857-7788-9901',
    alamat: 'Dusun Gemenggeng RT 04 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-502',
    nisn: '0129013452',
    nis: '2002',
    nama: 'Oki Maulana',
    kelas: '5',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2013-05-24',
    namaWali: 'Hartono',
    teleponWali: '0857-7788-9902',
    alamat: 'Dusun Gemenggeng RT 01 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-503',
    nisn: '0129013453',
    nis: '2003',
    nama: 'Putri Anggraini',
    kelas: '5',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2013-09-15',
    namaWali: 'Darmanto',
    teleponWali: '0857-7788-9903',
    alamat: 'Dusun Sambirejo RT 03 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80'
  },
  // Kelas 6
  {
    id: 'sis-601',
    nisn: '0110124561',
    nis: '1901',
    nama: 'Rendy Kurniawan',
    kelas: '6',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2012-02-11',
    namaWali: 'Sumardi',
    teleponWali: '0813-8899-0001',
    alamat: 'Dusun Gemenggeng RT 02 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-602',
    nisn: '0110124562',
    nis: '1902',
    nama: 'Siti Nur Aisyah',
    kelas: '6',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2012-06-17',
    namaWali: 'Muchlis',
    teleponWali: '0813-8899-0002',
    alamat: 'Dusun Gemenggeng RT 05 RW 01, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sis-603',
    nisn: '0110124563',
    nis: '1903',
    nama: 'Tegar Bagaskara',
    kelas: '6',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Nganjuk',
    tanggalLahir: '2012-10-28',
    namaWali: 'Wahyudi',
    teleponWali: '0813-8899-0003',
    alamat: 'Dusun Sambirejo RT 02 RW 02, Kec. Pace',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  }
];

export const MAPEL_LIST = [
  'Pendidikan Agama & Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam & Sosial (IPAS)',
  'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
  'Seni Budaya & Prakarya',
  'Bahasa Jawa (Mulok Daerah)'
];

export const INITIAL_JADWAL: JadwalPelajaran[] = [
  // Kelas 1
  { id: 'jdw-1', kelas: '1', hari: 'Senin', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '07.35', mataPelajaran: 'Upacara Bendera', guruPengampu: 'Seluruh Dewan Guru', ruangan: 'Lapangan Upacara' },
  { id: 'jdw-2', kelas: '1', hari: 'Senin', jamKe: 2, waktuMulai: '07.35', waktuSelesai: '08.45', mataPelajaran: 'Pendidikan Pancasila', guruPengampu: 'Sri Wahyuni, S.Pd.SD', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-3', kelas: '1', hari: 'Senin', jamKe: 3, waktuMulai: '09.00', waktuSelesai: '10.10', mataPelajaran: 'Bahasa Indonesia', guruPengampu: 'Sri Wahyuni, S.Pd.SD', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-4', kelas: '1', hari: 'Selasa', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.10', mataPelajaran: 'Pendidikan Agama Islam', guruPengampu: 'Ahmad Fauzi, S.Pd.I', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-5', kelas: '1', hari: 'Selasa', jamKe: 2, waktuMulai: '08.25', waktuSelesai: '09.35', mataPelajaran: 'Matematika', guruPengampu: 'Sri Wahyuni, S.Pd.SD', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-6', kelas: '1', hari: 'Rabu', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.45', mataPelajaran: 'PJOK', guruPengampu: 'Rian Bagus Pamungkas, S.Pd.Jas', ruangan: 'Lapangan Olahraga' },
  { id: 'jdw-7', kelas: '1', hari: 'Rabu', jamKe: 2, waktuMulai: '09.00', waktuSelesai: '10.10', mataPelajaran: 'Seni Budaya & Prakarya', guruPengampu: 'Sri Wahyuni, S.Pd.SD', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-8', kelas: '1', hari: 'Kamis', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.10', mataPelajaran: 'Bahasa Indonesia', guruPengampu: 'Sri Wahyuni, S.Pd.SD', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-9', kelas: '1', hari: 'Kamis', jamKe: 2, waktuMulai: '08.25', waktuSelesai: '09.35', mataPelajaran: 'Bahasa Jawa', guruPengampu: 'Sri Wahyuni, S.Pd.SD', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-10', kelas: '1', hari: 'Jumat', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '07.45', mataPelajaran: 'Senam Pagi & Sholat Dhuha', guruPengampu: 'Dewan Guru', ruangan: 'Halaman & Musholla' },
  { id: 'jdw-11', kelas: '1', hari: 'Jumat', jamKe: 2, waktuMulai: '08.00', waktuSelesai: '09.10', mataPelajaran: 'Penguatan Karakter / P5', guruPengampu: 'Sri Wahyuni, S.Pd.SD', ruangan: 'Ruang Kelas 1' },
  { id: 'jdw-12', kelas: '1', hari: 'Sabtu', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.10', mataPelajaran: 'Kegiatan Literasi & Ekstrakurikuler', guruPengampu: 'Dewan Guru', ruangan: 'Perpustakaan & Kelas' },

  // Kelas 4
  { id: 'jdw-41', kelas: '4', hari: 'Senin', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '07.35', mataPelajaran: 'Upacara Bendera', guruPengampu: 'Seluruh Dewan Guru', ruangan: 'Lapangan Upacara' },
  { id: 'jdw-42', kelas: '4', hari: 'Senin', jamKe: 2, waktuMulai: '07.35', waktuSelesai: '09.20', mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-43', kelas: '4', hari: 'Senin', jamKe: 3, waktuMulai: '09.35', waktuSelesai: '11.20', mataPelajaran: 'Bahasa Indonesia', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-44', kelas: '4', hari: 'Selasa', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.45', mataPelajaran: 'Matematika', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-45', kelas: '4', hari: 'Selasa', jamKe: 2, waktuMulai: '09.00', waktuSelesai: '10.45', mataPelajaran: 'Pendidikan Agama Islam', guruPengampu: 'Ahmad Fauzi, S.Pd.I', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-46', kelas: '4', hari: 'Rabu', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '09.20', mataPelajaran: 'PJOK', guruPengampu: 'Rian Bagus Pamungkas, S.Pd.Jas', ruangan: 'Lapangan Olahraga' },
  { id: 'jdw-47', kelas: '4', hari: 'Rabu', jamKe: 2, waktuMulai: '09.35', waktuSelesai: '11.20', mataPelajaran: 'Pendidikan Pancasila', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-48', kelas: '4', hari: 'Kamis', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.45', mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-49', kelas: '4', hari: 'Kamis', jamKe: 2, waktuMulai: '09.00', waktuSelesai: '10.45', mataPelajaran: 'Bahasa Jawa (Mulok)', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-50', kelas: '4', hari: 'Jumat', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.00', mataPelajaran: 'Senam Pagi & Sholat Dhuha Berjamaah', guruPengampu: 'Dewan Guru', ruangan: 'Halaman / Musholla' },
  { id: 'jdw-51', kelas: '4', hari: 'Jumat', jamKe: 2, waktuMulai: '08.15', waktuSelesai: '10.00', mataPelajaran: 'Projek Penguatan Pelajar Pancasila (P5)', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kelas 4' },
  { id: 'jdw-52', kelas: '4', hari: 'Sabtu', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.45', mataPelajaran: 'Seni Rupa & Prakarya', guruPengampu: 'Agus Setiawan, S.Pd.', ruangan: 'Ruang Kesenian' },
  { id: 'jdw-53', kelas: '4', hari: 'Sabtu', jamKe: 2, waktuMulai: '09.00', waktuSelesai: '11.00', mataPelajaran: 'Ekstrakurikuler Wajib Pramuka', guruPengampu: 'Dewi Lestari, S.Pd. & Tim', ruangan: 'Halaman Sekolah' },

  // Kelas 6
  { id: 'jdw-61', kelas: '6', hari: 'Senin', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '07.35', mataPelajaran: 'Upacara Bendera', guruPengampu: 'Seluruh Dewan Guru', ruangan: 'Lapangan Upacara' },
  { id: 'jdw-62', kelas: '6', hari: 'Senin', jamKe: 2, waktuMulai: '07.35', waktuSelesai: '09.20', mataPelajaran: 'Bahasa Indonesia', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-63', kelas: '6', hari: 'Senin', jamKe: 3, waktuMulai: '09.35', waktuSelesai: '11.20', mataPelajaran: 'Matematika', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-64', kelas: '6', hari: 'Selasa', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.45', mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-65', kelas: '6', hari: 'Selasa', jamKe: 2, waktuMulai: '09.00', waktuSelesai: '10.45', mataPelajaran: 'Pendidikan Agama Islam', guruPengampu: 'Ahmad Fauzi, S.Pd.I', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-66', kelas: '6', hari: 'Rabu', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '09.20', mataPelajaran: 'PJOK', guruPengampu: 'Rian Bagus Pamungkas, S.Pd.Jas', ruangan: 'Lapangan Olahraga' },
  { id: 'jdw-67', kelas: '6', hari: 'Rabu', jamKe: 2, waktuMulai: '09.35', waktuSelesai: '11.20', mataPelajaran: 'Pendidikan Pancasila', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-68', kelas: '6', hari: 'Kamis', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.45', mataPelajaran: 'Persiapan Ujian / Pemantapan Materi', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-69', kelas: '6', hari: 'Kamis', jamKe: 2, waktuMulai: '09.00', waktuSelesai: '10.45', mataPelajaran: 'Bahasa Jawa', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-70', kelas: '6', hari: 'Jumat', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '08.00', mataPelajaran: 'Sholat Dhuha & Pembiasaan Karakter', guruPengampu: 'Dewan Guru', ruangan: 'Musholla' },
  { id: 'jdw-71', kelas: '6', hari: 'Jumat', jamKe: 2, waktuMulai: '08.15', waktuSelesai: '10.00', mataPelajaran: 'Projek P5 Berkelanjutan', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Ruang Kelas 6' },
  { id: 'jdw-72', kelas: '6', hari: 'Sabtu', jamKe: 1, waktuMulai: '07.00', waktuSelesai: '09.00', mataPelajaran: 'Kesenian Daerah & Gamelan', guruPengampu: 'Eko Prasetyo, S.Pd.', ruangan: 'Sanggar Seni' },
  { id: 'jdw-73', kelas: '6', hari: 'Sabtu', jamKe: 2, waktuMulai: '09.15', waktuSelesai: '11.15', mataPelajaran: 'Ekstrakurikuler Pramuka Penggalang', guruPengampu: 'Dewi Lestari & Tim', ruangan: 'Halaman Sekolah' }
];

export const INITIAL_NILAI: NilaiSiswaRecord[] = [
  // Kelas 1 - Matematika
  {
    id: 'nil-1',
    siswaId: 'sis-101',
    kelas: '1',
    mataPelajaran: 'Matematika',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 85,
    tp2: 88,
    tp3: 84,
    sts: 86,
    sas: 90,
    nilaiAkhir: 87,
    predikat: 'A',
    catatan: 'Sangat baik dalam membilang angka 1-20 dan penjumlahan sederhana.'
  },
  {
    id: 'nil-2',
    siswaId: 'sis-102',
    kelas: '1',
    mataPelajaran: 'Matematika',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 90,
    tp2: 92,
    tp3: 88,
    sts: 92,
    sas: 95,
    nilaiAkhir: 92,
    predikat: 'A',
    catatan: 'Luar biasa dalam membedakan bentuk geometri bangun datar dan berhitung.'
  },
  {
    id: 'nil-3',
    siswaId: 'sis-103',
    kelas: '1',
    mataPelajaran: 'Matematika',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 78,
    tp2: 80,
    tp3: 75,
    sts: 78,
    sas: 82,
    nilaiAkhir: 79,
    predikat: 'B',
    catatan: 'Baik dalam berhitung, perlu pendampingan pada pengurangan bersusun.'
  },
  {
    id: 'nil-4',
    siswaId: 'sis-104',
    kelas: '1',
    mataPelajaran: 'Matematika',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 82,
    tp2: 85,
    tp3: 80,
    sts: 84,
    sas: 86,
    nilaiAkhir: 84,
    predikat: 'B',
    catatan: 'Menunjukkan pemahaman konsep pola bilangan dengan sangat rapi.'
  },
  // Kelas 4 - IPAS
  {
    id: 'nil-5',
    siswaId: 'sis-401',
    kelas: '4',
    mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 88,
    tp2: 85,
    tp3: 90,
    sts: 87,
    sas: 89,
    nilaiAkhir: 88,
    predikat: 'A',
    catatan: 'Sangat memahami bagian tubuh tumbuhan dan proses fotosintesis.'
  },
  {
    id: 'nil-6',
    siswaId: 'sis-402',
    kelas: '4',
    mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 92,
    tp2: 95,
    tp3: 90,
    sts: 94,
    sas: 96,
    nilaiAkhir: 94,
    predikat: 'A',
    catatan: 'Sangat aktif dalam presentasi praktikum perubahan wujud zat.'
  },
  {
    id: 'nil-7',
    siswaId: 'sis-403',
    kelas: '4',
    mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 76,
    tp2: 78,
    tp3: 80,
    sts: 80,
    sas: 82,
    nilaiAkhir: 79,
    predikat: 'B',
    catatan: 'Mampu menjelaskan interaksi gaya otot dan gesek dengan baik.'
  },
  // Kelas 6 - Bahasa Indonesia
  {
    id: 'nil-8',
    siswaId: 'sis-601',
    kelas: '6',
    mataPelajaran: 'Bahasa Indonesia',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 90,
    tp2: 88,
    tp3: 92,
    sts: 90,
    sas: 94,
    nilaiAkhir: 91,
    predikat: 'A',
    catatan: 'Mampu menulis teks laporan hasil observasi dengan struktur yang tepat dan logis.'
  },
  {
    id: 'nil-9',
    siswaId: 'sis-602',
    kelas: '6',
    mataPelajaran: 'Bahasa Indonesia',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 94,
    tp2: 96,
    tp3: 92,
    sts: 95,
    sas: 98,
    nilaiAkhir: 95,
    predikat: 'A',
    catatan: 'Sangat mahir dalam menyusun pidato persuasif dan berbicara di depan publik.'
  },
  {
    id: 'nil-10',
    siswaId: 'sis-603',
    kelas: '6',
    mataPelajaran: 'Bahasa Indonesia',
    semester: 'Ganjil',
    tahunAjaran: '2026/2027',
    tp1: 80,
    tp2: 82,
    tp3: 84,
    sts: 82,
    sas: 85,
    nilaiAkhir: 83,
    predikat: 'B',
    catatan: 'Baik dalam menganalisis ide pokok paragraf dan membuat ringkasan cerita.'
  }
];

export const INITIAL_KEGIATAN: KegiatanSekolah[] = [
  {
    id: 'keg-1',
    judul: 'Upacara Peringatan Hari Sumpah Pemuda & Gelar Karya P5',
    kategori: 'Kesiswaan',
    tanggalMulai: '2026-10-28',
    waktu: '07.00 - 11.30 WIB',
    lokasi: 'Halaman Utama SDN 1 Gemenggeng',
    penanggungJawab: 'Sri Wahyuni, S.Pd.SD & Koordinator P5',
    deskripsi: 'Upacara bendera berseragam adat nusantara dilanjutkan pameran kewirausahaan dan karya daur ulang siswa kelas 1 - 6.',
    status: 'Akan Datang'
  },
  {
    id: 'keg-2',
    judul: 'Asesmen Nasional Berbasis Komputer (ANBK) SD',
    kategori: 'Akademik',
    tanggalMulai: '2026-11-04',
    tanggalSelesai: '2026-11-06',
    waktu: '07.30 - 12.00 WIB',
    lokasi: 'Laboratorium Komputer SDN 1 Gemenggeng',
    penanggungJawab: 'Agus Setiawan, S.Pd. (Proktor)',
    deskripsi: 'Pelaksanaan ANBK Gelombang I untuk peserta didik Kelas 5 mencakup Asesmen Literasi, Numerasi, dan Survei Karakter.',
    status: 'Akan Datang'
  },
  {
    id: 'keg-3',
    judul: 'Perkemahan Jumat-Sabtu (Perjusa) Pramuka Siaga & Penggalang',
    kategori: 'Pramuka',
    tanggalMulai: '2026-11-13',
    tanggalSelesai: '2026-11-14',
    waktu: '13.00 WIB s/d Selesai',
    lokasi: 'Bumi Perkemahan SDN 1 Gemenggeng',
    penanggungJawab: 'Dewi Lestari, S.Pd.',
    deskripsi: 'Latihan gabungan keterampilan kepramukaan, api unggun ceria, pentas seni, dan penjelajahan alam pedesaan Pace.',
    status: 'Akan Datang'
  },
  {
    id: 'keg-4',
    judul: 'Rapat Koordinasi Komite Sekolah & Sosialisasi Program Semester',
    kategori: 'Rapat',
    tanggalMulai: '2026-10-25',
    waktu: '08.30 - 11.00 WIB',
    lokasi: 'Aula SDN 1 Gemenggeng',
    penanggungJawab: 'VITA DEWI SUSANTI, S.Pd., M.Pd.',
    deskripsi: 'Musyawarah bersama Ketua Komite Sekolah, pengurus paguyuban wali murid kelas 1-6 mengenai sarana penunjang literasi.',
    status: 'Akan Datang'
  },
  {
    id: 'keg-5',
    judul: 'Pembiasaan Sholat Dhuha Berjamaah & Kultum Pagi',
    kategori: 'Keagamaan',
    tanggalMulai: '2026-10-23',
    waktu: '06.45 - 07.20 WIB',
    lokasi: 'Musholla Al-Ikhlas SDN 1 Gemenggeng',
    penanggungJawab: 'Ahmad Fauzi, S.Pd.I',
    deskripsi: 'Program rutin Jumat berkah untuk memupuk karakter religius dan akhlak mulia seluruh warga sekolah.',
    status: 'Berlangsung'
  },
  {
    id: 'keg-6',
    judul: 'Peringatan Maulid Nabi Muhammad SAW & Santunan Anak Yatim',
    kategori: 'Keagamaan',
    tanggalMulai: '2026-09-18',
    waktu: '08.00 - 11.30 WIB',
    lokasi: 'Halaman Tengah Sekolah',
    penanggungJawab: 'Ahmad Fauzi, S.Pd.I',
    deskripsi: 'Tausiyah keagamaan, penampilan grup hadrah santri SDN 1 Gemenggeng, dan pembagian bingkisan kasih.',
    status: 'Selesai'
  }
];

export const INITIAL_ALBUM: AlbumKegiatan[] = [
  {
    id: 'alb-1',
    judul: 'Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5)',
    kategori: 'Karya Siswa',
    tanggal: '15 Oktober 2026',
    deskripsi: 'Pameran hasil karya kreasi kerajinan bahan daur ulang dan stan olahan kuliner tradisional khas Nganjuk oleh siswa kelas 1, 4, dan 5.',
    fotoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    jumlahFoto: 18
  },
  {
    id: 'alb-2',
    judul: 'Upacara Peringatan Hari Kesaktian Pancasila & Pembagian Medali',
    kategori: 'Upacara',
    tanggal: '01 Oktober 2026',
    deskripsi: 'Upacara khidmat seluruh warga SDN 1 Gemenggeng yang diiringi dengan penyerahan piala juara 1 lomba lari O2SN tingkat kecamatan.',
    fotoUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    jumlahFoto: 12
  },
  {
    id: 'alb-3',
    judul: 'Latihan Kepramukaan Siaga & Penggalang di Alam Terbuka',
    kategori: 'Pramuka',
    tanggal: '27 September 2026',
    deskripsi: 'Keseruan anak-anak belajar tali-temali, semaphore, dan baris-berbaris di bawah rindangnya pepohonan halaman sekolah.',
    fotoUrl: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800&auto=format&fit=crop&q=80',
    jumlahFoto: 24
  },
  {
    id: 'alb-4',
    judul: 'Pembiasaan Senam Kesegaran Jasmani (SKJ) & Gerakan Sarapan Sehat',
    kategori: 'Kesehatan',
    tanggal: '20 September 2026',
    deskripsi: 'Senam bersama yang dipimpin oleh guru PJOK dilanjutkan dengan makan bekal gizi seimbang bersama di teras kelas.',
    fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    jumlahFoto: 15
  },
  {
    id: 'alb-5',
    judul: 'Pojok Baca & Literasi di Perpustakaan Pelita Ilmu',
    kategori: 'Literasi',
    tanggal: '12 September 2026',
    deskripsi: 'Antusiasme peserta didik saat membaca cerita dongeng nusantara dan ensiklopedia sains di ruang perpustakaan ber-AC.',
    fotoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    jumlahFoto: 10
  },
  {
    id: 'alb-6',
    judul: 'Simulasi Gladi Bersih ANBK di Laboratorium Komputer',
    kategori: 'Akademik',
    tanggal: '05 September 2026',
    deskripsi: 'Peserta didik kelas 5 dengan tekun berlatih mengoperasikan sistem ujian berbasis komputer didampingi proktor dan teknisi.',
    fotoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    jumlahFoto: 8
  }
];

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_PRESENSI_PTK: PresensiPtkRecord[] = INITIAL_PTK.map((ptk, index) => {
  // Most teachers present, one or two might be on official duty or illness
  let status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Dinas Luar' = 'Hadir';
  let jamMasuk = '06.45';
  let keterangan = 'Tepat Waktu';

  if (index === 0) {
    status = 'Hadir';
    jamMasuk = '06.30';
    keterangan = 'Memimpin briefing pagi';
  } else if (index === 3) {
    status = 'Dinas Luar';
    jamMasuk = '-';
    keterangan = 'Workshop Kurikulum Merdeka di Disdik Nganjuk';
  } else if (index === 8) {
    status = 'Hadir';
    jamMasuk = '06.40';
    keterangan = 'Siap pembiasaan olahraga';
  } else {
    jamMasuk = `06.${40 + (index % 15)}`;
  }

  return {
    id: `pres-ptk-${ptk.id}`,
    tanggal: getTodayDateString(),
    ptkId: ptk.id,
    status,
    jamMasuk,
    keterangan
  };
});

export const INITIAL_PRESENSI_SISWA: PresensiSiswaRecord[] = INITIAL_SISWA.map((siswa, idx) => {
  let status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' = 'Hadir';
  let keterangan = 'Hadir di kelas';

  if (idx === 2) {
    status = 'Sakit';
    keterangan = 'Demam (Surat dari orang tua)';
  } else if (idx === 7) {
    status = 'Izin';
    keterangan = 'Acara keluarga di luar kota';
  }

  return {
    id: `pres-sis-${siswa.id}`,
    tanggal: getTodayDateString(),
    siswaId: siswa.id,
    kelas: siswa.kelas,
    status,
    keterangan
  };
});
