import {
  PendidikTendik,
  Siswa,
  JadwalPelajaran,
  KegiatanSekolah,
  AlbumKegiatan,
  NilaiSiswaRecord,
  PresensiPtkRecord,
  PresensiSiswaRecord,
  SekolahInfo,
  InfaqMusholaRecord
} from '../types';

export interface FullSchoolData {
  version?: number;
  lastUpdated?: string;
  sekolahInfo?: SekolahInfo;
  ptkList: PendidikTendik[];
  siswaList: Siswa[];
  jadwalList: JadwalPelajaran[];
  kegiatanList: KegiatanSekolah[];
  albumList: AlbumKegiatan[];
  nilaiList: NilaiSiswaRecord[];
  presensiPtk: PresensiPtkRecord[];
  presensiSiswa: PresensiSiswaRecord[];
  infaqMusholaList?: InfaqMusholaRecord[];
  pesanKepsek?: string;
}

export type ServerSyncStatus = 'connected' | 'needs-setup' | 'offline';

export interface FetchResult {
  data: FullSchoolData | null;
  status: ServerSyncStatus;
  isEmpty?: boolean;
  message?: string;
}

export const ApiSync = {
  /**
   * Fetch latest school data and detect server/Vercel cloud storage status
   */
  fetchSchoolDataWithStatus: async (): Promise<FetchResult> => {
    try {
      const res = await fetch(`/api/school-data?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          data: null,
          status: 'needs-setup',
          message: 'Server API tidak ditemukan pada hosting ini.'
        };
      }
      const json = await res.json();
      if (res.status === 503 || json?.needsStorageSetup) {
        return {
          data: null,
          status: 'needs-setup',
          message: json?.message || 'Database cloud Vercel (Upstash Redis) belum dihubungkan.'
        };
      }
      if (!res.ok) {
        return {
          data: null,
          status: 'offline',
          message: json?.message || `Server merespons status ${res.status}`
        };
      }
      if (json && json.success) {
        return {
          data: (json.data as FullSchoolData) || null,
          status: 'connected',
          isEmpty: Boolean(json.isEmpty)
        };
      }
      return { data: null, status: 'offline', message: json?.message };
    } catch (err: any) {
      console.warn('Could not connect to central server, using local cache:', err);
      return {
        data: null,
        status: 'offline',
        message: err?.message || 'Tidak dapat terhubung ke server'
      };
    }
  },

  /**
   * Fetch latest school data from centralized server with cache-busting
   */
  fetchSchoolData: async (): Promise<FullSchoolData | null> => {
    const result = await ApiSync.fetchSchoolDataWithStatus();
    return result.data;
  },

  /**
   * Push school data update to centralized server
   */
  saveSchoolData: async (
    data: Partial<FullSchoolData>
  ): Promise<{ success: boolean; lastUpdated?: string; error?: string; needsStorageSetup?: boolean }> => {
    try {
      const res = await fetch('/api/school-data', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(data)
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          needsStorageSetup: true,
          error: 'Endpoint /api/school-data tidak aktif'
        };
      }
      const json = await res.json();
      if (res.status === 503 || json?.needsStorageSetup) {
        return {
          success: false,
          needsStorageSetup: true,
          error: json?.message || 'Database cloud Vercel belum dihubungkan'
        };
      }
      if (!res.ok) {
        return { success: false, error: json?.message || `HTTP ${res.status}` };
      }
      return {
        success: !!json.success,
        lastUpdated: json.lastUpdated,
        error: json.success ? undefined : json.message || 'Gagal menyimpan ke server'
      };
    } catch (err: any) {
      console.warn('Failed to sync to server:', err);
      return { success: false, error: err?.message || 'Koneksi ke server terputus' };
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
