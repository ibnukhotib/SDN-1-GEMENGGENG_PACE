import {
  PendidikTendik,
  Siswa,
  JadwalPelajaran,
  KegiatanSekolah,
  AlbumKegiatan,
  NilaiSiswaRecord,
  PresensiPtkRecord,
  PresensiSiswaRecord,
  UserRole,
  SekolahInfo,
  InfaqMusholaRecord
} from '../types';
import {
  SEKOLAH_INFO,
  INITIAL_PTK,
  INITIAL_SISWA,
  INITIAL_JADWAL,
  INITIAL_KEGIATAN,
  INITIAL_ALBUM,
  INITIAL_NILAI,
  INITIAL_PRESENSI_PTK,
  INITIAL_PRESENSI_SISWA,
  INITIAL_INFAQ_MUSHOLA
} from '../data/initialData';

const KEYS = {
  SEKOLAH_INFO: 'sdn1_gemenggeng_sekolah_info_v2',
  PTK: 'sdn1_gemenggeng_ptk_v2',
  SISWA: 'sdn1_gemenggeng_siswa_v2',
  JADWAL: 'sdn1_gemenggeng_jadwal_v2',
  KEGIATAN: 'sdn1_gemenggeng_kegiatan_v2',
  ALBUM: 'sdn1_gemenggeng_album_v2',
  NILAI: 'sdn1_gemenggeng_nilai_v2',
  PRESENSI_PTK: 'sdn1_gemenggeng_presensi_ptk_v2',
  PRESENSI_SISWA: 'sdn1_gemenggeng_presensi_siswa_v2',
  PESAN_KEPSEK: 'sdn1_gemenggeng_pesan_kepsek_v2',
  INFAQ_MUSHOLA: 'sdn1_gemenggeng_infaq_mushola_v2',
  USER_ROLE: 'sdn1_gemenggeng_user_role_v2',
  ADMIN_PIN: 'sdn1_gemenggeng_admin_pin_v2',
  LAST_EDIT_TIME: 'sdn1_gemenggeng_last_edit_time_v2'
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
  getSekolahInfo: (): SekolahInfo => safeGet<SekolahInfo>(KEYS.SEKOLAH_INFO, SEKOLAH_INFO),
  setSekolahInfo: (data: SekolahInfo) => {
    safeSet(KEYS.SEKOLAH_INFO, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getLastEditTime: (): number => safeGet<number>(KEYS.LAST_EDIT_TIME, 0),
  setLastEditTime: (ts: number) => safeSet<number>(KEYS.LAST_EDIT_TIME, ts),

  getPtk: (): PendidikTendik[] => safeGet(KEYS.PTK, INITIAL_PTK),
  setPtk: (data: PendidikTendik[]) => {
    safeSet(KEYS.PTK, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getSiswa: (): Siswa[] => safeGet(KEYS.SISWA, INITIAL_SISWA),
  setSiswa: (data: Siswa[]) => {
    safeSet(KEYS.SISWA, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getJadwal: (): JadwalPelajaran[] => safeGet(KEYS.JADWAL, INITIAL_JADWAL),
  setJadwal: (data: JadwalPelajaran[]) => {
    safeSet(KEYS.JADWAL, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getKegiatan: (): KegiatanSekolah[] => safeGet(KEYS.KEGIATAN, INITIAL_KEGIATAN),
  setKegiatan: (data: KegiatanSekolah[]) => {
    safeSet(KEYS.KEGIATAN, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getAlbum: (): AlbumKegiatan[] => safeGet(KEYS.ALBUM, INITIAL_ALBUM),
  setAlbum: (data: AlbumKegiatan[]) => {
    safeSet(KEYS.ALBUM, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getNilai: (): NilaiSiswaRecord[] => safeGet(KEYS.NILAI, INITIAL_NILAI),
  setNilai: (data: NilaiSiswaRecord[]) => {
    safeSet(KEYS.NILAI, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getPresensiPtk: (): PresensiPtkRecord[] => safeGet(KEYS.PRESENSI_PTK, INITIAL_PRESENSI_PTK),
  setPresensiPtk: (data: PresensiPtkRecord[]) => {
    safeSet(KEYS.PRESENSI_PTK, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getPresensiSiswa: (): PresensiSiswaRecord[] => safeGet(KEYS.PRESENSI_SISWA, INITIAL_PRESENSI_SISWA),
  setPresensiSiswa: (data: PresensiSiswaRecord[]) => {
    safeSet(KEYS.PRESENSI_SISWA, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getPesanKepsek: (): string => safeGet(KEYS.PESAN_KEPSEK, DEFAULT_PESAN_KEPSEK),
  setPesanKepsek: (pesan: string) => {
    safeSet(KEYS.PESAN_KEPSEK, pesan);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getInfaqMushola: (): InfaqMusholaRecord[] => safeGet(KEYS.INFAQ_MUSHOLA, INITIAL_INFAQ_MUSHOLA),
  setInfaqMushola: (data: InfaqMusholaRecord[]) => {
    safeSet(KEYS.INFAQ_MUSHOLA, data);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  getUserRole: (): UserRole => safeGet<UserRole>(KEYS.USER_ROLE, 'viewer'),
  setUserRole: (role: UserRole) => safeSet(KEYS.USER_ROLE, role),

  getAdminPin: (): string => safeGet<string>(KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN),
  setAdminPin: (pin: string) => safeSet(KEYS.ADMIN_PIN, pin),

  resetToDefaults: () => {
    safeSet(KEYS.SEKOLAH_INFO, SEKOLAH_INFO);
    safeSet(KEYS.PTK, INITIAL_PTK);
    safeSet(KEYS.SISWA, INITIAL_SISWA);
    safeSet(KEYS.JADWAL, INITIAL_JADWAL);
    safeSet(KEYS.KEGIATAN, INITIAL_KEGIATAN);
    safeSet(KEYS.ALBUM, INITIAL_ALBUM);
    safeSet(KEYS.NILAI, INITIAL_NILAI);
    safeSet(KEYS.PRESENSI_PTK, INITIAL_PRESENSI_PTK);
    safeSet(KEYS.PRESENSI_SISWA, INITIAL_PRESENSI_SISWA);
    safeSet(KEYS.INFAQ_MUSHOLA, INITIAL_INFAQ_MUSHOLA);
    safeSet(KEYS.PESAN_KEPSEK, DEFAULT_PESAN_KEPSEK);
    safeSet(KEYS.USER_ROLE, 'viewer');
    safeSet(KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
    safeSet(KEYS.LAST_EDIT_TIME, Date.now());
  },

  syncAllFromData: (data: any) => {
    if (data.sekolahInfo) safeSet(KEYS.SEKOLAH_INFO, data.sekolahInfo);
    if (data.ptkList) safeSet(KEYS.PTK, data.ptkList);
    if (data.siswaList) safeSet(KEYS.SISWA, data.siswaList);
    if (data.jadwalList) safeSet(KEYS.JADWAL, data.jadwalList);
    if (data.kegiatanList) safeSet(KEYS.KEGIATAN, data.kegiatanList);
    if (data.albumList) safeSet(KEYS.ALBUM, data.albumList);
    if (data.nilaiList) safeSet(KEYS.NILAI, data.nilaiList);
    if (data.presensiPtk) safeSet(KEYS.PRESENSI_PTK, data.presensiPtk);
    if (data.presensiSiswa) safeSet(KEYS.PRESENSI_SISWA, data.presensiSiswa);
    if (data.infaqMusholaList) safeSet(KEYS.INFAQ_MUSHOLA, data.infaqMusholaList);
    if (data.pesanKepsek) safeSet(KEYS.PESAN_KEPSEK, data.pesanKepsek);
  }
};
