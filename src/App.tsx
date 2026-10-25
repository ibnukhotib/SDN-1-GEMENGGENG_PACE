import React, { useState, useEffect } from 'react';
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
  UserRole
} from './types';
import { Storage } from './utils/storage';
import { ApiSync, FullSchoolData } from './utils/apiSync';
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
  const [ptkList, setPtkList] = useState<PendidikTendik[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>([]);
  const [kegiatanList, setKegiatanList] = useState<KegiatanSekolah[]>([]);
  const [albumList, setAlbumList] = useState<AlbumKegiatan[]>([]);
  const [nilaiList, setNilaiList] = useState<NilaiSiswaRecord[]>([]);
  const [presensiPtk, setPresensiPtk] = useState<PresensiPtkRecord[]>([]);
  const [presensiSiswa, setPresensiSiswa] = useState<PresensiSiswaRecord[]>([]);
  const [pesanKepsek, setPesanKepsek] = useState<string>(Storage.getPesanKepsek());

  // Cloud Sync States
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Central Server Synchronizer
  const syncWithServer = async (silent = false) => {
    try {
      setIsSyncing(true);
      const serverData = await ApiSync.fetchSchoolData();
      if (serverData && Array.isArray(serverData.ptkList) && serverData.ptkList.length > 0) {
        setPtkList(serverData.ptkList);
        if (serverData.siswaList) setSiswaList(serverData.siswaList);
        if (serverData.jadwalList) setJadwalList(serverData.jadwalList);
        if (serverData.kegiatanList) setKegiatanList(serverData.kegiatanList);
        if (serverData.albumList) setAlbumList(serverData.albumList);
        if (serverData.nilaiList) setNilaiList(serverData.nilaiList);
        if (serverData.presensiPtk) setPresensiPtk(serverData.presensiPtk);
        if (serverData.presensiSiswa) setPresensiSiswa(serverData.presensiSiswa);
        if (serverData.pesanKepsek) setPesanKepsek(serverData.pesanKepsek);
        Storage.syncAllFromData(serverData);

        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        if (!silent) {
          setSyncToast({ message: `Data berhasil disinkronkan (${timeStr})`, type: 'success' });
          setTimeout(() => setSyncToast(null), 3000);
        }
      }
    } catch (err) {
      console.warn('Sync failed:', err);
      if (!silent) {
        setSyncToast({ message: 'Gagal terhubung ke server', type: 'error' });
        setTimeout(() => setSyncToast(null), 3000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Load from LocalStorage on mount & auto-sync from central server
  useEffect(() => {
    // 1. Instant local load
    setPtkList(Storage.getPtk());
    setSiswaList(Storage.getSiswa());
    setJadwalList(Storage.getJadwal());
    setKegiatanList(Storage.getKegiatan());
    setAlbumList(Storage.getAlbum());
    setNilaiList(Storage.getNilai());
    setPresensiPtk(Storage.getPresensiPtk());
    setPresensiSiswa(Storage.getPresensiSiswa());
    setPesanKepsek(Storage.getPesanKepsek());

    // 2. Fetch from centralized server
    syncWithServer(true);

    // 3. Re-sync whenever user focuses or switches to this tab (Laptop <-> HP)
    const handleFocus = () => {
      syncWithServer(true);
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    // 4. Polling every 12 seconds so edits on Laptop show up on HP in near-realtime
    const interval = setInterval(() => {
      syncWithServer(true);
    }, 12000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Save Pesan Kepala Sekolah
  const handleSavePesanKepsek = (pesan: string) => {
    setPesanKepsek(pesan);
    Storage.setPesanKepsek(pesan);
    ApiSync.saveSchoolData({ pesanKepsek: pesan });
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
    ApiSync.syncPtkList(updated).then(() => {
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    });
  };

  const handleDeletePtk = (id: string) => {
    const updated = ptkList.filter((p) => p.id !== id);
    setPtkList(updated);
    Storage.setPtk(updated);
    ApiSync.syncPtkList(updated).then(() => {
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    });
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
    ApiSync.saveSchoolData({ siswaList: updated });
  };

  const handleDeleteSiswa = (id: string) => {
    const updated = siswaList.filter((s) => s.id !== id);
    setSiswaList(updated);
    Storage.setSiswa(updated);
    ApiSync.saveSchoolData({ siswaList: updated });
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
    ApiSync.saveSchoolData({ jadwalList: updated });
  };

  const handleDeleteJadwal = (id: string) => {
    const updated = jadwalList.filter((j) => j.id !== id);
    setJadwalList(updated);
    Storage.setJadwal(updated);
    ApiSync.saveSchoolData({ jadwalList: updated });
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
    ApiSync.saveSchoolData({ kegiatanList: updated });
  };

  const handleDeleteKegiatan = (id: string) => {
    const updated = kegiatanList.filter((k) => k.id !== id);
    setKegiatanList(updated);
    Storage.setKegiatan(updated);
    ApiSync.saveSchoolData({ kegiatanList: updated });
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
    ApiSync.saveSchoolData({ albumList: updated });
  };

  const handleDeleteAlbum = (id: string) => {
    const updated = albumList.filter((a) => a.id !== id);
    setAlbumList(updated);
    Storage.setAlbum(updated);
    ApiSync.saveSchoolData({ albumList: updated });
  };

  // Nilai handlers
  const handleSaveNilai = (records: NilaiSiswaRecord[]) => {
    setNilaiList(records);
    Storage.setNilai(records);
    ApiSync.saveSchoolData({ nilaiList: records });
  };

  // Presensi handlers
  const handleUpdatePresensiPtk = (records: PresensiPtkRecord[]) => {
    setPresensiPtk(records);
    Storage.setPresensiPtk(records);
    ApiSync.saveSchoolData({ presensiPtk: records });
  };

  const handleUpdatePresensiSiswa = (records: PresensiSiswaRecord[]) => {
    setPresensiSiswa(records);
    Storage.setPresensiSiswa(records);
    ApiSync.saveSchoolData({ presensiSiswa: records });
  };

  // Reset to default sample data with central sync
  const handleResetData = async () => {
    try {
      const fresh = await ApiSync.resetToDefault();
      if (fresh) {
        setPtkList(fresh.ptkList);
        setSiswaList(fresh.siswaList);
        setJadwalList(fresh.jadwalList);
        setKegiatanList(fresh.kegiatanList);
        setAlbumList(fresh.albumList);
        setNilaiList(fresh.nilaiList);
        setPresensiPtk(fresh.presensiPtk);
        setPresensiSiswa(fresh.presensiSiswa);
        if (fresh.pesanKepsek) setPesanKepsek(fresh.pesanKepsek);
        Storage.syncAllFromData(fresh);
      } else {
        Storage.resetToDefaults();
        setPtkList(Storage.getPtk());
        setSiswaList(Storage.getSiswa());
        setJadwalList(Storage.getJadwal());
        setKegiatanList(Storage.getKegiatan());
        setAlbumList(Storage.getAlbum());
        setNilaiList(Storage.getNilai());
        setPresensiPtk(Storage.getPresensiPtk());
        setPresensiSiswa(Storage.getPresensiSiswa());
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
          albumCount: albumList.length
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
          isSyncing={isSyncing}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
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
            />
          )}

          {activeTab === 'visi-misi' && <VisiMisiView kepsek={kepsek} />}

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
        onManualSync={() => syncWithServer(false)}
        onForceReset={handleResetData}
        ptkCount={ptkList.length}
        siswaCount={siswaList.length}
        fullData={{
          ptkList,
          siswaList,
          jadwalList,
          kegiatanList,
          albumList,
          nilaiList,
          presensiPtk,
          presensiSiswa,
          pesanKepsek
        }}
        onRestoreData={(data) => {
          if (data.ptkList) setPtkList(data.ptkList);
          if (data.siswaList) setSiswaList(data.siswaList);
          if (data.jadwalList) setJadwalList(data.jadwalList);
          if (data.kegiatanList) setKegiatanList(data.kegiatanList);
          if (data.albumList) setAlbumList(data.albumList);
          if (data.nilaiList) setNilaiList(data.nilaiList);
          if (data.presensiPtk) setPresensiPtk(data.presensiPtk);
          if (data.presensiSiswa) setPresensiSiswa(data.presensiSiswa);
          if (data.pesanKepsek) setPesanKepsek(data.pesanKepsek);
          Storage.syncAllFromData(data);
        }}
        isAdmin={isAdmin}
      />

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 bg-slate-900 text-white border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span>{syncToast.message}</span>
        </div>
      )}
    </div>
  );
}
