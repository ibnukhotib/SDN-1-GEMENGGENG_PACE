import {
  PendidikTendik,
  Siswa,
  JadwalPelajaran,
  KegiatanSekolah,
  AlbumKegiatan,
  NilaiSiswaRecord,
  PresensiPtkRecord,
  PresensiSiswaRecord,
  UserRole
} from '../types';
import {
  INITIAL_PTK,
  INITIAL_SISWA,
  INITIAL_JADWAL,
  INITIAL_KEGIATAN,
  INITIAL_ALBUM,
  INITIAL_NILAI,
  INITIAL_PRESENSI_PTK,
  INITIAL_PRESENSI_SISWA
} from '../data/initialData';

const KEYS = {
  PTK: 'sdn1_gemenggeng_ptk_v1',
  SISWA: 'sdn1_gemenggeng_siswa_v1',
  JADWAL: 'sdn1_gemenggeng_jadwal_v1',
  KEGIATAN: 'sdn1_gemenggeng_kegiatan_v1',
  ALBUM: 'sdn1_gemenggeng_album_v1',
  NILAI: 'sdn1_gemenggeng_nilai_v1',
  PRESENSI_PTK: 'sdn1_gemenggeng_presensi_ptk_v1',
  PRESENSI_SISWA: 'sdn1_gemenggeng_presensi_siswa_v1',
  PESAN_KEPSEK: 'sdn1_gemenggeng_pesan_kepsek_v1',
  USER_ROLE: 'sdn1_gemenggeng_user_role_v1',
  ADMIN_PIN: 'sdn1_gemenggeng_admin_pin_v1'
};

export const DEFAULT_ADMIN_PIN = '123456';

export const DEFAULT_PESAN_KEPSEK =
  'Pendidikan di SDN 1 Gemenggeng tidak hanya berfokus pada kecerdasan akademis, namun juga pembinaan karakter budi pekerti, kepedulian terhadap lingkungan, serta ketakwaan kepada Tuhan Yang Maha Esa.';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

export const Storage = {
  getPtk: (): PendidikTendik[] => {
    const list = safeGet(KEYS.PTK, INITIAL_PTK);
    return list.map((p) => {
      if (
        p.id === 'ptk-1' ||
        p.jabatan.toLowerCase().includes('kepala sekolah') ||
        p.jabatan.toLowerCase().includes('kepsek') ||
        p.nama.toLowerCase().includes('suyanto')
      ) {
        return {
          ...p,
          nama: 'VITA DEWI SUSANTI',
          gelar: 'S.Pd. M.Pd',
          nip: '19830723 200604 2 022',
          jenisKelamin: 'Perempuan',
          email: 'vitadewisusanti.gemenggeng@gmail.com',
          fotoUrl:
            p.fotoUrl && !p.fotoUrl.includes('photo-1544717305')
              ? p.fotoUrl
              : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
        };
      }
      return p;
    });
  },
  setPtk: (data: PendidikTendik[]) => safeSet(KEYS.PTK, data),

  getSiswa: (): Siswa[] => {
    const list = safeGet(KEYS.SISWA, INITIAL_SISWA);
    return list.map((s) => ({
      ...s,
      alamat: s.alamat.replace(/Kec\.\s*Bagor/gi, 'Kec. Pace').replace(/Kecamatan\s*Bagor/gi, 'Kecamatan Pace')
    }));
  },
  setSiswa: (data: Siswa[]) => safeSet(KEYS.SISWA, data),

  getJadwal: (): JadwalPelajaran[] => safeGet(KEYS.JADWAL, INITIAL_JADWAL),
  setJadwal: (data: JadwalPelajaran[]) => safeSet(KEYS.JADWAL, data),

  getKegiatan: (): KegiatanSekolah[] => {
    const list = safeGet(KEYS.KEGIATAN, INITIAL_KEGIATAN);
    return list.map((k) => ({
      ...k,
      penanggungJawab: k.penanggungJawab.includes('Suyanto')
        ? 'VITA DEWI SUSANTI, S.Pd. M.Pd'
        : k.penanggungJawab,
      deskripsi: k.deskripsi.replace(/pedesaan Bagor/gi, 'pedesaan Pace')
    }));
  },
  setKegiatan: (data: KegiatanSekolah[]) => safeSet(KEYS.KEGIATAN, data),

  getAlbum: (): AlbumKegiatan[] => safeGet(KEYS.ALBUM, INITIAL_ALBUM),
  setAlbum: (data: AlbumKegiatan[]) => safeSet(KEYS.ALBUM, data),

  getNilai: (): NilaiSiswaRecord[] => safeGet(KEYS.NILAI, INITIAL_NILAI),
  setNilai: (data: NilaiSiswaRecord[]) => safeSet(KEYS.NILAI, data),

  getPresensiPtk: (): PresensiPtkRecord[] => safeGet(KEYS.PRESENSI_PTK, INITIAL_PRESENSI_PTK),
  setPresensiPtk: (data: PresensiPtkRecord[]) => safeSet(KEYS.PRESENSI_PTK, data),

  getPresensiSiswa: (): PresensiSiswaRecord[] => safeGet(KEYS.PRESENSI_SISWA, INITIAL_PRESENSI_SISWA),
  setPresensiSiswa: (data: PresensiSiswaRecord[]) => safeSet(KEYS.PRESENSI_SISWA, data),

  getPesanKepsek: (): string => safeGet(KEYS.PESAN_KEPSEK, DEFAULT_PESAN_KEPSEK),
  setPesanKepsek: (pesan: string) => safeSet(KEYS.PESAN_KEPSEK, pesan),

  getUserRole: (): UserRole => safeGet<UserRole>(KEYS.USER_ROLE, 'viewer'),
  setUserRole: (role: UserRole) => safeSet(KEYS.USER_ROLE, role),

  getAdminPin: (): string => safeGet<string>(KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN),
  setAdminPin: (pin: string) => safeSet(KEYS.ADMIN_PIN, pin),

  resetToDefaults: () => {
    safeSet(KEYS.PTK, INITIAL_PTK);
    safeSet(KEYS.SISWA, INITIAL_SISWA);
    safeSet(KEYS.JADWAL, INITIAL_JADWAL);
    safeSet(KEYS.KEGIATAN, INITIAL_KEGIATAN);
    safeSet(KEYS.ALBUM, INITIAL_ALBUM);
    safeSet(KEYS.NILAI, INITIAL_NILAI);
    safeSet(KEYS.PRESENSI_PTK, INITIAL_PRESENSI_PTK);
    safeSet(KEYS.PRESENSI_SISWA, INITIAL_PRESENSI_SISWA);
    safeSet(KEYS.PESAN_KEPSEK, DEFAULT_PESAN_KEPSEK);
    safeSet(KEYS.USER_ROLE, 'viewer');
    safeSet(KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
  },

  syncAllFromData: (data: any) => {
    if (data.ptkList) safeSet(KEYS.PTK, data.ptkList);
    if (data.siswaList) safeSet(KEYS.SISWA, data.siswaList);
    if (data.jadwalList) safeSet(KEYS.JADWAL, data.jadwalList);
    if (data.kegiatanList) safeSet(KEYS.KEGIATAN, data.kegiatanList);
    if (data.albumList) safeSet(KEYS.ALBUM, data.albumList);
    if (data.nilaiList) safeSet(KEYS.NILAI, data.nilaiList);
    if (data.presensiPtk) safeSet(KEYS.PRESENSI_PTK, data.presensiPtk);
    if (data.presensiSiswa) safeSet(KEYS.PRESENSI_SISWA, data.presensiSiswa);
    if (data.pesanKepsek) safeSet(KEYS.PESAN_KEPSEK, data.pesanKepsek);
  }
};
