export type Role = 'admin' | 'guru' | 'kepsek' | 'tata_usaha';
export type UserRole = 'admin' | 'viewer';

export type StatusKepegawaian = 'PNS' | 'PPPK' | 'GTT' | 'PTT';

export interface PendidikTendik {
  id: string;
  nama: string;
  gelar: string;
  nip: string; // NIP atau NUPTK
  jabatan: string; // misal: Kepala Sekolah, Guru Kelas 1, Guru PJOK, Tenaga Administrasi
  jenis: 'Pendidik' | 'Tenaga Kependidikan';
  golongan: string; // misal: III/b, IX, dll
  pendidikanTerakhir: string; // misal: S1 PGSD, S1 Pendidikan Olahraga, SMA
  mapelAtauTugas: string;
  statusKepegawaian: StatusKepegawaian;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  telepon: string;
  email: string;
  fotoUrl: string;
}

export interface Siswa {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  kelas: string; // "1", "2", "3", "4", "5", "6"
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  namaWali: string;
  teleponWali: string;
  alamat: string;
  fotoUrl: string;
}

export interface JadwalPelajaran {
  id: string;
  kelas: string; // "1" .. "6"
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamKe: number;
  waktuMulai: string;
  waktuSelesai: string;
  mataPelajaran: string;
  guruPengampu: string;
  ruangan: string;
}

export type StatusPresensi = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Dinas Luar';

export interface PresensiPtkRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  ptkId: string;
  status: StatusPresensi;
  jamMasuk: string;
  keterangan: string;
}

export interface PresensiSiswaRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  siswaId: string;
  kelas: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
  keterangan: string;
}

export interface NilaiSiswaRecord {
  id: string;
  siswaId: string;
  kelas: string;
  mataPelajaran: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  tp1: number; // Nilai TP 1
  tp2: number; // Nilai TP 2
  tp3: number; // Nilai TP 3
  sts: number; // Sumatif Tengah Semester
  sas: number; // Sumatif Akhir Semester
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  catatan: string;
}

export interface KegiatanSekolah {
  id: string;
  judul: string;
  kategori: 'Akademik' | 'Kesiswaan' | 'Pramuka' | 'Keagamaan' | 'Rapat' | 'Sosial';
  tanggalMulai: string;
  tanggalSelesai?: string;
  waktu: string;
  lokasi: string;
  penanggungJawab: string;
  deskripsi: string;
  status: 'Akan Datang' | 'Berlangsung' | 'Selesai';
}

export interface AlbumKegiatan {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  deskripsi: string;
  fotoUrl: string;
  jumlahFoto?: number;
}
