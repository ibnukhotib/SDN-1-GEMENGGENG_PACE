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
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Central Server Synchronizer with Anti-Overwriting protection
  const syncWithServer = async (silent = false) => {
    // If user edited locally in the last 15 seconds, skip silent background sync to avoid race condition
    const timeSinceLastEdit = Date.now() - Storage.getLastEditTime();
    if (silent && timeSinceLastEdit < 15000) {
      return;
    }

    try {
      setIsSyncing(true);
      const serverData = await ApiSync.fetchSchoolData();
      if (!serverData) return;

      const serverTs = serverData.lastUpdated ? new Date(serverData.lastUpdated).getTime() : 0;
      const localTs = Storage.getLastEditTime();

      // If local data is newer than what server returned (e.g. cached response), push local data to server
      if (localTs > serverTs + 1000) {
        await ApiSync.saveSchoolData({
          sekolahInfo: Storage.getSekolahInfo(),
          ptkList: Storage.getPtk(),
          siswaList: Storage.getSiswa(),
          jadwalList: Storage.getJadwal(),
          kegiatanList: Storage.getKegiatan(),
          albumList: Storage.getAlbum(),
          nilaiList: Storage.getNilai(),
          presensiPtk: Storage.getPresensiPtk(),
          presensiSiswa: Storage.getPresensiSiswa(),
          infaqMusholaList: Storage.getInfaqMushola(),
          pesanKepsek: Storage.getPesanKepsek()
        });
        return;
      }

      // Server is authoritatively newer or synchronized: safely apply to state
      if (serverData.sekolahInfo) {
        setSekolahInfo(serverData.sekolahInfo);
      }
      if (Array.isArray(serverData.ptkList) && serverData.ptkList.length > 0) {
        setPtkList(serverData.ptkList);
      }
      if (Array.isArray(serverData.siswaList)) {
        setSiswaList(serverData.siswaList);
      }
      if (Array.isArray(serverData.jadwalList)) setJadwalList(serverData.jadwalList);
      if (Array.isArray(serverData.kegiatanList)) setKegiatanList(serverData.kegiatanList);
      if (Array.isArray(serverData.albumList)) setAlbumList(serverData.albumList);
      if (Array.isArray(serverData.nilaiList)) setNilaiList(serverData.nilaiList);
      if (Array.isArray(serverData.presensiPtk)) setPresensiPtk(serverData.presensiPtk);
      if (Array.isArray(serverData.presensiSiswa)) setPresensiSiswa(serverData.presensiSiswa);
      if (Array.isArray(serverData.infaqMusholaList)) setInfaqMusholaList(serverData.infaqMusholaList);
      if (serverData.pesanKepsek) setPesanKepsek(serverData.pesanKepsek);

      Storage.syncAllFromData(serverData);

      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(timeStr);
      if (!silent) {
        setSyncToast({ message: `Data berhasil disinkronkan (${timeStr})`, type: 'success' });
        setTimeout(() => setSyncToast(null), 3000);
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

    // 2. Fetch from centralized server
    syncWithServer(true);

    // 3. Periodic graceful sync every 25 seconds
    const interval = setInterval(() => {
      syncWithServer(true);
    }, 25000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const showSaveSuccess = (entityName: string) => {
    setSyncToast({ message: `${entityName} berhasil disimpan & disinkronkan!`, type: 'success' });
    setTimeout(() => setSyncToast(null), 2500);
  };

  // Save SekolahInfo
  const handleSaveSekolahInfo = (info: SekolahInfo) => {
    setSekolahInfo(info);
    Storage.setSekolahInfo(info);
    ApiSync.saveSchoolData({ sekolahInfo: info }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Identitas & Profil Sekolah');
    });
  };

  // Save Pesan Kepala Sekolah
  const handleSavePesanKepsek = (pesan: string) => {
    setPesanKepsek(pesan);
    Storage.setPesanKepsek(pesan);
    ApiSync.saveSchoolData({ pesanKepsek: pesan }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Pesan Kepala Sekolah');
    });
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
    ApiSync.saveSchoolData({ ptkList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      showSaveSuccess('Data Pendidik/PTK');
    });
  };

  const handleDeletePtk = (id: string) => {
    const updated = ptkList.filter((p) => p.id !== id);
    setPtkList(updated);
    Storage.setPtk(updated);
    ApiSync.saveSchoolData({ ptkList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      showSaveSuccess('Data Pendidik/PTK');
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
    ApiSync.saveSchoolData({ siswaList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Data Siswa');
    });
  };

  const handleDeleteSiswa = (id: string) => {
    const updated = siswaList.filter((s) => s.id !== id);
    setSiswaList(updated);
    Storage.setSiswa(updated);
    ApiSync.saveSchoolData({ siswaList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Data Siswa');
    });
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
    ApiSync.saveSchoolData({ jadwalList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Jadwal Pelajaran');
    });
  };

  const handleDeleteJadwal = (id: string) => {
    const updated = jadwalList.filter((j) => j.id !== id);
    setJadwalList(updated);
    Storage.setJadwal(updated);
    ApiSync.saveSchoolData({ jadwalList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Jadwal Pelajaran');
    });
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
    ApiSync.saveSchoolData({ kegiatanList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Agenda Kegiatan');
    });
  };

  const handleDeleteKegiatan = (id: string) => {
    const updated = kegiatanList.filter((k) => k.id !== id);
    setKegiatanList(updated);
    Storage.setKegiatan(updated);
    ApiSync.saveSchoolData({ kegiatanList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Agenda Kegiatan');
    });
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
    ApiSync.saveSchoolData({ albumList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Dokumentasi Album');
    });
  };

  const handleDeleteAlbum = (id: string) => {
    const updated = albumList.filter((a) => a.id !== id);
    setAlbumList(updated);
    Storage.setAlbum(updated);
    ApiSync.saveSchoolData({ albumList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Dokumentasi Album');
    });
  };

  // Nilai handlers
  const handleSaveNilai = (records: NilaiSiswaRecord[]) => {
    setNilaiList(records);
    Storage.setNilai(records);
    ApiSync.saveSchoolData({ nilaiList: records }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Nilai Asesmen');
    });
  };

  // Presensi handlers
  const handleUpdatePresensiPtk = (records: PresensiPtkRecord[]) => {
    setPresensiPtk(records);
    Storage.setPresensiPtk(records);
    ApiSync.saveSchoolData({ presensiPtk: records }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Presensi PTK');
    });
  };

  const handleUpdatePresensiSiswa = (records: PresensiSiswaRecord[]) => {
    setPresensiSiswa(records);
    Storage.setPresensiSiswa(records);
    ApiSync.saveSchoolData({ presensiSiswa: records }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Presensi Siswa');
    });
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
    ApiSync.saveSchoolData({ infaqMusholaList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Catatan Infaq Mushola');
    });
  };

  const handleDeleteInfaqMushola = (id: string) => {
    const updated = infaqMusholaList.filter((i) => i.id !== id);
    setInfaqMusholaList(updated);
    Storage.setInfaqMushola(updated);
    ApiSync.saveSchoolData({ infaqMusholaList: updated }).then((res) => {
      if (res.lastUpdated) {
        Storage.setLastEditTime(new Date(res.lastUpdated).getTime());
      }
      showSaveSuccess('Catatan Infaq Mushola');
    });
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
          infaqMusholaList,
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
          if (data.infaqMusholaList) setInfaqMusholaList(data.infaqMusholaList);
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
