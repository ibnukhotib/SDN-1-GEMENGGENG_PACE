import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabKey } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PtkView } from './components/PtkView';
import { SiswaView } from './components/SiswaView';
import { JadwalView } from './components/JadwalView';
import { PresensiPtkView } from './components/PresensiPtkView';
import { PresensiSiswaView } from './components/PresensiSiswaView';
import { NilaiView } from './components/NilaiView';
import { KegiatanView } from './components/KegiatanView';
import { AlbumView } from './components/AlbumView';
import { VisiMisiView } from './components/VisiMisiView';
import { InfaqMusholaView } from './components/InfaqMusholaView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SyncModal } from './components/SyncModal';

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
} from './types';
import { Storage, IndexedCache } from './utils/storage';
import { ApiSync, FullSchoolData, ServerSyncStatus } from './utils/apiSync';
import { SEKOLAH_INFO } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Role Access Control State (Admin vs Viewer)
  const [userRole, setUserRole] = useState<UserRole>(Storage.getUserRole());
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const isAdmin = userRole === 'admin';

  // Modal triggers for shortcuts
  const [isAddPtkOpen, setIsAddPtkOpen] = useState(false);
  const [isAddSiswaOpen, setIsAddSiswaOpen] = useState(false);
  const [editingPtkTarget, setEditingPtkTarget] = useState<PendidikTendik | null>(null);

  // Application Data States
  const [sekolahInfo, setSekolahInfo] = useState<SekolahInfo>(Storage.getSekolahInfo());
  const [ptkList, setPtkList] = useState<PendidikTendik[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>([]);
  const [kegiatanList, setKegiatanList] = useState<KegiatanSekolah[]>([]);
  const [albumList, setAlbumList] = useState<AlbumKegiatan[]>([]);
  const [nilaiList, setNilaiList] = useState<NilaiSiswaRecord[]>([]);
  const [presensiPtk, setPresensiPtk] = useState<PresensiPtkRecord[]>([]);
  const [presensiSiswa, setPresensiSiswa] = useState<PresensiSiswaRecord[]>([]);
  const [infaqMusholaList, setInfaqMusholaList] = useState<InfaqMusholaRecord[]>([]);
  const [pesanKepsek, setPesanKepsek] = useState<string>(Storage.getPesanKepsek());

  // Cloud Sync States
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerSyncStatus>('connected');
  const [hasPendingSync, setHasPendingSync] = useState<boolean>(Storage.hasPendingSync());
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const isSyncingRef = useRef(false);
  const lastLocalWriteRef = useRef(0);
  const toastTimerRef = useRef<number | null>(null);

  const latestSnapshotRef = useRef<FullSchoolData>({
    sekolahInfo,
    ptkList,
    siswaList,
    jadwalList,
    kegiatanList,
    albumList,
    nilaiList,
    presensiPtk,
    presensiSiswa,
    infaqMusholaList,
    pesanKepsek
  });

  useEffect(() => {
    latestSnapshotRef.current = {
      sekolahInfo,
      ptkList,
      siswaList,
      jadwalList,
      kegiatanList,
      albumList,
      nilaiList,
      presensiPtk,
      presensiSiswa,
      infaqMusholaList,
      pesanKepsek
    };
  }, [
    sekolahInfo,
    ptkList,
    siswaList,
    jadwalList,
    kegiatanList,
    albumList,
    nilaiList,
    presensiPtk,
    presensiSiswa,
    infaqMusholaList,
    pesanKepsek
  ]);

  const updatePendingSync = useCallback((pending: boolean) => {
    Storage.setPendingSync(pending);
    setHasPendingSync(pending);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error', duration = 3000) => {
    setSyncToast({ message, type });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setSyncToast(null);
    }, duration);
  }, []);

  const applyServerData = useCallback((serverData: Partial<FullSchoolData>) => {
    if (serverData.sekolahInfo) setSekolahInfo(serverData.sekolahInfo);
    if (Array.isArray(serverData.ptkList) && serverData.ptkList.length > 0) setPtkList(serverData.ptkList);
    if (Array.isArray(serverData.siswaList)) setSiswaList(serverData.siswaList);
    if (Array.isArray(serverData.jadwalList)) setJadwalList(serverData.jadwalList);
    if (Array.isArray(serverData.kegiatanList)) setKegiatanList(serverData.kegiatanList);
    if (Array.isArray(serverData.albumList)) setAlbumList(serverData.albumList);
    if (Array.isArray(serverData.nilaiList)) setNilaiList(serverData.nilaiList);
    if (Array.isArray(serverData.presensiPtk)) setPresensiPtk(serverData.presensiPtk);
    if (Array.isArray(serverData.presensiSiswa)) setPresensiSiswa(serverData.presensiSiswa);
    if (Array.isArray(serverData.infaqMusholaList)) setInfaqMusholaList(serverData.infaqMusholaList);
    if (serverData.pesanKepsek) setPesanKepsek(serverData.pesanKepsek);
  }, []);

  // Central Server Synchronizer: Server is the single source of truth unless this device has unsent pending edits
  const syncWithServer = useCallback(async (silent = false): Promise<boolean> => {
    if (isSyncingRef.current) return false;

    // Avoid racing with an active save triggered in the last 3 seconds
    if (silent && Date.now() - lastLocalWriteRef.current < 3000) {
      return false;
    }

    try {
      isSyncingRef.current = true;
      setIsSyncing(true);

      // If this device has unsent edits (e.g. saved while offline), push those first
      if (Storage.hasPendingSync()) {
        const cached = ((await IndexedCache.loadFullData()) as Partial<FullSchoolData> | null) || latestSnapshotRef.current;
        if (cached) {
          const pushRes = await ApiSync.saveSchoolData(cached);
          if (pushRes.success) {
            updatePendingSync(false);
            setServerStatus('connected');
            if (pushRes.lastUpdated) {
              Storage.setLastEditTime(new Date(pushRes.lastUpdated).getTime());
            }
          } else {
            setServerStatus(pushRes.needsStorageSetup ? 'needs-setup' : 'offline');
            if (!silent) {
              showToast(`Belum dapat mengirim perubahan ke server (${pushRes.error || 'offline'})`, 'error', 4000);
            }
            return false;
          }
        } else {
          updatePendingSync(false);
        }
      }

      const result = await ApiSync.fetchSchoolDataWithStatus();
      setServerStatus(result.status);

      if (result.status !== 'connected') {
        if (!silent) {
          showToast(result.message || 'Gagal mengambil data terbaru dari server', 'error', 3500);
        }
        return false;
      }

      // Fresh cloud DB on Vercel (e.g. newly connected Upstash Redis): seed with current snapshot
      if (result.isEmpty || !result.data) {
        const seedPayload = latestSnapshotRef.current;
        if (seedPayload.ptkList.length > 0) {
          const seedRes = await ApiSync.saveSchoolData(seedPayload);
          if (seedRes.success) {
            updatePendingSync(false);
            const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setLastSyncTime(timeStr);
            if (!silent) {
              showToast(`Database cloud berhasil diinisialisasi (${timeStr})`, 'success', 3000);
            }
            return true;
          }
        }
        return false;
      }

      applyServerData(result.data);
      Storage.syncAllFromData(result.data);

      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(timeStr);
      if (!silent) {
        showToast(`Data berhasil disinkronkan (${timeStr})`, 'success', 3000);
      }
      return true;
    } catch (err) {
      console.warn('Sync failed:', err);
      setServerStatus('offline');
      if (!silent) {
        showToast('Gagal terhubung ke server', 'error', 3500);
      }
      return false;
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [applyServerData, showToast, updatePendingSync]);

  // Load local cache on mount & auto-sync with central server on load, focus, visibility, online, and interval
  useEffect(() => {
    let active = true;

    // 1. Synchronous fallback load
    setSekolahInfo(Storage.getSekolahInfo());
    setPtkList(Storage.getPtk());
    setSiswaList(Storage.getSiswa());
    setJadwalList(Storage.getJadwal());
    setKegiatanList(Storage.getKegiatan());
    setAlbumList(Storage.getAlbum());
    setNilaiList(Storage.getNilai());
    setPresensiPtk(Storage.getPresensiPtk());
    setPresensiSiswa(Storage.getPresensiSiswa());
    setInfaqMusholaList(Storage.getInfaqMushola());
    setPesanKepsek(Storage.getPesanKepsek());

    // 2. Load full snapshot from IndexedDB (supports >5MB photo datasets on HP & Laptop)
    IndexedCache.loadFullData().then((cached) => {
      if (active && cached) {
        applyServerData(cached as Partial<FullSchoolData>);
      }
      // 3. Immediately pull authoritative data from central server
      if (active) {
        void syncWithServer(true);
      }
    });

    const handleWakeSync = () => {
      if (document.visibilityState === 'visible') {
        void syncWithServer(true);
      }
    };

    const handleOnline = () => {
      void syncWithServer(true);
    };

    window.addEventListener('focus', handleWakeSync);
    document.addEventListener('visibilitychange', handleWakeSync);
    window.addEventListener('online', handleOnline);

    // 4. Periodic sync every 10 seconds while app is visible
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void syncWithServer(true);
      }
    }, 10000);

    return () => {
      active = false;
      window.removeEventListener('focus', handleWakeSync);
      document.removeEventListener('visibilitychange', handleWakeSync);
      window.removeEventListener('online', handleOnline);
      window.clearInterval(interval);
    };
  }, [applyServerData, syncWithServer]);

  const persistChange = useCallback(
    async (
      entityName: string,
      partialPayload: Partial<FullSchoolData>,
      nextSnapshotOverride?: Partial<FullSchoolData>
    ) => {
      lastLocalWriteRef.current = Date.now();
      updatePendingSync(true);

      const snapshot: Partial<FullSchoolData> = {
        ...latestSnapshotRef.current,
        ...partialPayload,
        ...nextSnapshotOverride
      };
      await IndexedCache.saveFullData(snapshot);

      const res = await ApiSync.saveSchoolData(partialPayload);
      if (res.success) {
        updatePendingSync(false);
        setServerStatus('connected');
        if (res.lastUpdated) {
          Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
        }
        setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        showToast(`${entityName} berhasil disimpan & tersinkron ke server!`, 'success', 2800);
      } else {
        setServerStatus(res.needsStorageSetup ? 'needs-setup' : 'offline');
        showToast(
          res.needsStorageSetup
            ? `Tersimpan di perangkat ini. Hubungkan database cloud Vercel di menu Sinkron agar masuk ke HP.`
            : `Tersimpan lokal saja, gagal sinkron ke server (${res.error || 'koneksi terputus'}).`,
          'error',
          4500
        );
      }
    },
    [showToast, updatePendingSync]
  );

  const handlePushToServer = useCallback(async (): Promise<boolean> => {
    if (isSyncingRef.current) return false;
    try {
      isSyncingRef.current = true;
      setIsSyncing(true);
      lastLocalWriteRef.current = Date.now();

      const snapshot = latestSnapshotRef.current;
      await IndexedCache.saveFullData(snapshot);

      const res = await ApiSync.saveSchoolData(snapshot);
      if (res.success) {
        updatePendingSync(false);
        setServerStatus('connected');
        if (res.lastUpdated) {
          Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
        }
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        showToast(`Seluruh data berhasil dikirim ke server (${timeStr})`, 'success', 3000);
        return true;
      }

      setServerStatus(res.needsStorageSetup ? 'needs-setup' : 'offline');
      showToast(
        res.needsStorageSetup
          ? 'Database cloud Vercel belum terhubung. Ikuti petunjuk di menu Sinkron.'
          : `Gagal mengirim ke server (${res.error || 'offline'})`,
        'error',
        4500
      );
      return false;
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [showToast, updatePendingSync]);

  // Save SekolahInfo
  const handleSaveSekolahInfo = (info: SekolahInfo) => {
    setSekolahInfo(info);
    Storage.setSekolahInfo(info);
    void persistChange('Identitas & Profil Sekolah', { sekolahInfo: info });
  };

  // Save Pesan Kepala Sekolah
  const handleSavePesanKepsek = (pesan: string) => {
    setPesanKepsek(pesan);
    Storage.setPesanKepsek(pesan);
    void persistChange('Pesan Kepala Sekolah', { pesanKepsek: pesan });
  };

  // Find dynamic Kepala Sekolah from PTK list
  const kepsek = ptkList.find(
    (p) =>
      p.jabatan.toLowerCase().includes('kepala sekolah') ||
      p.jabatan.toLowerCase().includes('kepsek')
  );

  // PTK handlers
  const handleSavePtk = (ptk: PendidikTendik) => {
    const existingIndex = ptkList.findIndex((p) => p.id === ptk.id);
    let updated: PendidikTendik[];
    if (existingIndex >= 0) {
      updated = [...ptkList];
      updated[existingIndex] = ptk;
    } else {
      updated = [ptk, ...ptkList];
    }
    setPtkList(updated);
    Storage.setPtk(updated);
    void persistChange('Data Pendidik/PTK', { ptkList: updated });
  };

  const handleDeletePtk = (id: string) => {
    const updated = ptkList.filter((p) => p.id !== id);
    setPtkList(updated);
    Storage.setPtk(updated);
    void persistChange('Data Pendidik/PTK', { ptkList: updated });
  };

  // Siswa handlers
  const handleSaveSiswa = (siswa: Siswa) => {
    const existingIndex = siswaList.findIndex((s) => s.id === siswa.id);
    let updated: Siswa[];
    if (existingIndex >= 0) {
      updated = [...siswaList];
      updated[existingIndex] = siswa;
    } else {
      updated = [siswa, ...siswaList];
    }
    setSiswaList(updated);
    Storage.setSiswa(updated);
    void persistChange('Data Siswa', { siswaList: updated });
  };

  const handleDeleteSiswa = (id: string) => {
    const updated = siswaList.filter((s) => s.id !== id);
    setSiswaList(updated);
    Storage.setSiswa(updated);
    void persistChange('Data Siswa', { siswaList: updated });
  };

  // Jadwal handlers
  const handleSaveJadwal = (jadwal: JadwalPelajaran) => {
    const existingIndex = jadwalList.findIndex((j) => j.id === jadwal.id);
    let updated: JadwalPelajaran[];
    if (existingIndex >= 0) {
      updated = [...jadwalList];
      updated[existingIndex] = jadwal;
    } else {
      updated = [...jadwalList, jadwal];
    }
    setJadwalList(updated);
    Storage.setJadwal(updated);
    void persistChange('Jadwal Pelajaran', { jadwalList: updated });
  };

  const handleDeleteJadwal = (id: string) => {
    const updated = jadwalList.filter((j) => j.id !== id);
    setJadwalList(updated);
    Storage.setJadwal(updated);
    void persistChange('Jadwal Pelajaran', { jadwalList: updated });
  };

  // Kegiatan handlers
  const handleSaveKegiatan = (keg: KegiatanSekolah) => {
    const existingIndex = kegiatanList.findIndex((k) => k.id === keg.id);
    let updated: KegiatanSekolah[];
    if (existingIndex >= 0) {
      updated = [...kegiatanList];
      updated[existingIndex] = keg;
    } else {
      updated = [keg, ...kegiatanList];
    }
    setKegiatanList(updated);
    Storage.setKegiatan(updated);
    void persistChange('Agenda Kegiatan', { kegiatanList: updated });
  };

  const handleDeleteKegiatan = (id: string) => {
    const updated = kegiatanList.filter((k) => k.id !== id);
    setKegiatanList(updated);
    Storage.setKegiatan(updated);
    void persistChange('Agenda Kegiatan', { kegiatanList: updated });
  };

  // Album handlers
  const handleSaveAlbum = (alb: AlbumKegiatan) => {
    const existingIndex = albumList.findIndex((a) => a.id === alb.id);
    let updated: AlbumKegiatan[];
    if (existingIndex >= 0) {
      updated = [...albumList];
      updated[existingIndex] = alb;
    } else {
      updated = [alb, ...albumList];
    }
    setAlbumList(updated);
    Storage.setAlbum(updated);
    void persistChange('Dokumentasi Album', { albumList: updated });
  };

  const handleDeleteAlbum = (id: string) => {
    const updated = albumList.filter((a) => a.id !== id);
    setAlbumList(updated);
    Storage.setAlbum(updated);
    void persistChange('Dokumentasi Album', { albumList: updated });
  };

  // Nilai handlers
  const handleSaveNilai = (records: NilaiSiswaRecord[]) => {
    setNilaiList(records);
    Storage.setNilai(records);
    void persistChange('Nilai Asesmen', { nilaiList: records });
  };

  // Presensi handlers
  const handleUpdatePresensiPtk = (records: PresensiPtkRecord[]) => {
    setPresensiPtk(records);
    Storage.setPresensiPtk(records);
    void persistChange('Presensi PTK', { presensiPtk: records });
  };

  const handleUpdatePresensiSiswa = (records: PresensiSiswaRecord[]) => {
    setPresensiSiswa(records);
    Storage.setPresensiSiswa(records);
    void persistChange('Presensi Siswa', { presensiSiswa: records });
  };

  // Infaq Mushola handlers
  const handleSaveInfaqMushola = (record: InfaqMusholaRecord) => {
    const existingIndex = infaqMusholaList.findIndex((i) => i.id === record.id);
    let updated: InfaqMusholaRecord[];
    if (existingIndex >= 0) {
      updated = [...infaqMusholaList];
      updated[existingIndex] = record;
    } else {
      updated = [...infaqMusholaList, record];
    }
    setInfaqMusholaList(updated);
    Storage.setInfaqMushola(updated);
    void persistChange('Catatan Infaq Mushola', { infaqMusholaList: updated });
  };

  const handleDeleteInfaqMushola = (id: string) => {
    const updated = infaqMusholaList.filter((i) => i.id !== id);
    setInfaqMusholaList(updated);
    Storage.setInfaqMushola(updated);
    void persistChange('Catatan Infaq Mushola', { infaqMusholaList: updated });
  };

  // Reset to default sample data with central sync
  const handleResetData = async () => {
    try {
      const fresh = await ApiSync.resetToDefault();
      if (fresh) {
        if (fresh.sekolahInfo) setSekolahInfo(fresh.sekolahInfo);
        setPtkList(fresh.ptkList);
        setSiswaList(fresh.siswaList);
        setJadwalList(fresh.jadwalList);
        setKegiatanList(fresh.kegiatanList);
        setAlbumList(fresh.albumList);
        setNilaiList(fresh.nilaiList);
        setPresensiPtk(fresh.presensiPtk);
        setPresensiSiswa(fresh.presensiSiswa);
        if (fresh.infaqMusholaList) setInfaqMusholaList(fresh.infaqMusholaList);
        if (fresh.pesanKepsek) setPesanKepsek(fresh.pesanKepsek);
        Storage.syncAllFromData(fresh);
      } else {
        Storage.resetToDefaults();
        setSekolahInfo(Storage.getSekolahInfo());
        setPtkList(Storage.getPtk());
        setSiswaList(Storage.getSiswa());
        setJadwalList(Storage.getJadwal());
        setKegiatanList(Storage.getKegiatan());
        setAlbumList(Storage.getAlbum());
        setNilaiList(Storage.getNilai());
        setPresensiPtk(Storage.getPresensiPtk());
        setPresensiSiswa(Storage.getPresensiSiswa());
        setInfaqMusholaList(Storage.getInfaqMushola());
        setPesanKepsek(Storage.getPesanKepsek());
      }
      setSyncToast({ message: 'Data berhasil dipulihkan ke data resmi awal', type: 'info' });
      setTimeout(() => setSyncToast(null), 3000);
    } catch (e) {
      Storage.resetToDefaults();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        counts={{
          ptkCount: ptkList.length,
          siswaCount: siswaList.length,
          kegiatanCount: kegiatanList.length,
          albumCount: albumList.length,
          infaqCount: infaqMusholaList.length
        }}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isAdmin={isAdmin}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onLogoutAdmin={() => {
            setUserRole('viewer');
            Storage.setUserRole('viewer');
          }}
          sekolahInfo={sekolahInfo}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          isSyncing={isSyncing}
          hasPendingSync={hasPendingSync}
          serverStatus={serverStatus}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              ptkList={ptkList}
              siswaList={siswaList}
              kegiatanList={kegiatanList}
              albumList={albumList}
              presensiPtk={presensiPtk}
              presensiSiswa={presensiSiswa}
              pesanKepsek={pesanKepsek}
              onSavePesanKepsek={handleSavePesanKepsek}
              onNavigate={setActiveTab}
              onOpenAddPtk={() => {
                setEditingPtkTarget(null);
                setActiveTab('ptk');
                setIsAddPtkOpen(true);
              }}
              onOpenAddSiswa={() => {
                setActiveTab('siswa');
                setIsAddSiswaOpen(true);
              }}
              onEditPtk={(ptk) => {
                setEditingPtkTarget(ptk);
                setActiveTab('ptk');
              }}
              isAdmin={isAdmin}
              onRequireAdmin={() => setIsAdminModalOpen(true)}
              sekolahInfo={sekolahInfo}
              onSaveSekolahInfo={handleSaveSekolahInfo}
              infaqMusholaList={infaqMusholaList}
            />
          )}

          {activeTab === 'visi-misi' && <VisiMisiView kepsek={kepsek} sekolahInfo={sekolahInfo} />}

          {activeTab === 'ptk' && (
            <PtkView
              ptkList={ptkList}
              onSavePtk={handleSavePtk}
              onDeletePtk={handleDeletePtk}
              isAddModalOpen={isAddPtkOpen}
              setIsAddModalOpen={setIsAddPtkOpen}
              editingPtkTarget={editingPtkTarget}
              onClearEditingPtkTarget={() => setEditingPtkTarget(null)}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'siswa' && (
            <SiswaView
              siswaList={siswaList}
              onSaveSiswa={handleSaveSiswa}
              onDeleteSiswa={handleDeleteSiswa}
              isAddModalOpen={isAddSiswaOpen}
              setIsAddModalOpen={setIsAddSiswaOpen}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'jadwal' && (
            <JadwalView
              jadwalList={jadwalList}
              ptkList={ptkList}
              onSaveJadwal={handleSaveJadwal}
              onDeleteJadwal={handleDeleteJadwal}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'presensi-ptk' && (
            <PresensiPtkView
              ptkList={ptkList}
              presensiList={presensiPtk}
              onUpdatePresensi={handleUpdatePresensiPtk}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'presensi-siswa' && (
            <PresensiSiswaView
              siswaList={siswaList}
              presensiList={presensiSiswa}
              onUpdatePresensi={handleUpdatePresensiSiswa}
              kepsek={kepsek}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'nilai' && (
            <NilaiView
              siswaList={siswaList}
              nilaiList={nilaiList}
              onSaveNilai={handleSaveNilai}
              kepsek={kepsek}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'kegiatan' && (
            <KegiatanView
              kegiatanList={kegiatanList}
              onSaveKegiatan={handleSaveKegiatan}
              onDeleteKegiatan={handleDeleteKegiatan}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'album' && (
            <AlbumView
              albumList={albumList}
              onSaveAlbum={handleSaveAlbum}
              onDeleteAlbum={handleDeleteAlbum}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'infaq-mushola' && (
            <InfaqMusholaView
              infaqList={infaqMusholaList}
              onSaveInfaq={handleSaveInfaqMushola}
              onDeleteInfaq={handleDeleteInfaqMushola}
              isAdmin={isAdmin}
              onRequireAdmin={() => setIsAdminModalOpen(true)}
              kepsek={kepsek}
              sekolahInfo={sekolahInfo}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 px-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500 no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              &copy; {new Date().getFullYear()} <strong>{SEKOLAH_INFO.nama}</strong>. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p className="text-[11px] text-slate-400">
              Desa Gemenggeng, Kec. Pace, Kab. Nganjuk &bull; Kurikulum Merdeka
            </p>
          </div>
        </footer>
      </div>

      {/* Admin Authentication & PIN Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onSuccess={() => {
          setUserRole('admin');
          Storage.setUserRole('admin');
        }}
        onLogout={() => {
          setUserRole('viewer');
          Storage.setUserRole('viewer');
        }}
      />

      {/* Multi-Device Cloud Sync Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        lastSyncTime={lastSyncTime}
        isSyncing={isSyncing}
        serverStatus={serverStatus}
        hasPendingSync={hasPendingSync}
        onManualSync={() => syncWithServer(false)}
        onPushToServer={handlePushToServer}
        onForceReset={handleResetData}
        ptkCount={ptkList.length}
        siswaCount={siswaList.length}
        fullData={{
          sekolahInfo,
          ptkList,
          siswaList,
          jadwalList,
          kegiatanList,
          albumList,
          nilaiList,
          presensiPtk,
          presensiSiswa,
          infaqMusholaList,
          pesanKepsek
        }}
        onRestoreData={(data) => {
          if (data.sekolahInfo) setSekolahInfo(data.sekolahInfo);
          if (data.ptkList) setPtkList(data.ptkList);
          if (data.siswaList) setSiswaList(data.siswaList);
          if (data.jadwalList) setJadwalList(data.jadwalList);
          if (data.kegiatanList) setKegiatanList(data.kegiatanList);
          if (data.albumList) setAlbumList(data.albumList);
          if (data.nilaiList) setNilaiList(data.nilaiList);
          if (data.presensiPtk) setPresensiPtk(data.presensiPtk);
          if (data.presensiSiswa) setPresensiSiswa(data.presensiSiswa);
          if (data.infaqMusholaList) setInfaqMusholaList(data.infaqMusholaList);
          if (data.pesanKepsek) setPesanKepsek(data.pesanKepsek);
          Storage.syncAllFromData(data);
        }}
        isAdmin={isAdmin}
      />

      {/* Sync Toast Notification */}
      {syncToast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            syncToast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-700'
              : syncToast.type === 'info'
              ? 'bg-amber-950 text-amber-100 border-amber-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full animate-ping ${
              syncToast.type === 'error'
                ? 'bg-rose-400'
                : syncToast.type === 'info'
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
          />
          <span>{syncToast.message}</span>
        </div>
      )}
    </div>
  );
}
