import {
  PendidikTendik,
  Siswa,
  JadwalPelajaran,
  KegiatanSekolah,
  AlbumKegiatan,
  NilaiSiswaRecord,
  PresensiPtkRecord,
  PresensiSiswaRecord
} from '../types';

export interface FullSchoolData {
  version?: number;
  lastUpdated?: string;
  ptkList: PendidikTendik[];
  siswaList: Siswa[];
  jadwalList: JadwalPelajaran[];
  kegiatanList: KegiatanSekolah[];
  albumList: AlbumKegiatan[];
  nilaiList: NilaiSiswaRecord[];
  presensiPtk: PresensiPtkRecord[];
  presensiSiswa: PresensiSiswaRecord[];
  pesanKepsek?: string;
}

export const ApiSync = {
  /**
   * Fetch latest school data from centralized server
   */
  fetchSchoolData: async (): Promise<FullSchoolData | null> => {
    try {
      const res = await fetch('/api/school-data', {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      if (!res.ok) {
        console.warn('Server responded with status:', res.status);
        return null;
      }
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data as FullSchoolData;
      }
      return null;
    } catch (err) {
      console.warn('Could not connect to central server, using local data:', err);
      return null;
    }
  },

  /**
   * Push school data update to centralized server
   */
  saveSchoolData: async (data: Partial<FullSchoolData>): Promise<boolean> => {
    try {
      const res = await fetch('/api/school-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) return false;
      const json = await res.json();
      return !!json.success;
    } catch (err) {
      console.warn('Failed to sync to server:', err);
      return false;
    }
  },

  /**
   * Specific quick sync for PTK list
   */
  syncPtkList: async (ptkList: PendidikTendik[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/school-data/sync-ptk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ptkList })
      });
      if (!res.ok) return false;
      const json = await res.json();
      return !!json.success;
    } catch (err) {
      console.warn('Failed to sync PTK to server:', err);
      return false;
    }
  },

  /**
   * Reset database to official fresh defaults
   */
  resetToDefault: async (): Promise<FullSchoolData | null> => {
    try {
      const res = await fetch('/api/school-data/reset-default', {
        method: 'POST'
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data as FullSchoolData;
      }
      return null;
    } catch (err) {
      console.error('Failed to reset server data:', err);
      return null;
    }
  }
};
