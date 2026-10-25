import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  UserCheck,
  ClipboardCheck,
  Award,
  CalendarCheck2,
  Image as ImageIcon,
  Compass,
  X,
  School,
  Sparkles,
  ShieldCheck,
  Lock,
  KeyRound
} from 'lucide-react';
import { SEKOLAH_INFO } from '../data/initialData';

export type TabKey =
  | 'dashboard'
  | 'ptk'
  | 'siswa'
  | 'jadwal'
  | 'presensi-ptk'
  | 'presensi-siswa'
  | 'nilai'
  | 'kegiatan'
  | 'album'
  | 'visi-misi';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isOpen: boolean;
  onClose: () => void;
  counts: {
    ptkCount: number;
    siswaCount: number;
    kegiatanCount: number;
    albumCount: number;
  };
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  counts,
  isAdmin = false,
  onOpenAdminModal
}) => {
  const menuGroups = [
    {
      group: 'Utama',
      items: [
        {
          key: 'dashboard' as TabKey,
          label: 'Dashboard Interaktif',
          icon: LayoutDashboard,
          badge: null
        },
        {
          key: 'visi-misi' as TabKey,
          label: 'Visi, Misi & Profil',
          icon: Compass,
          badge: null
        }
      ]
    },
    {
      group: 'Data Pokok Sekolah',
      items: [
        {
          key: 'ptk' as TabKey,
          label: 'Pendidik & Tendik',
          icon: Users,
          badge: counts.ptkCount
        },
        {
          key: 'siswa' as TabKey,
          label: 'Data Siswa Berfoto',
          icon: GraduationCap,
          badge: counts.siswaCount
        },
        {
          key: 'jadwal' as TabKey,
          label: 'Jadwal Pelajaran',
          icon: CalendarDays,
          badge: '1-6'
        }
      ]
    },
    {
      group: 'Presensi & Akademik',
      items: [
        {
          key: 'presensi-ptk' as TabKey,
          label: 'Presensi Guru & Tendik',
          icon: UserCheck,
          badge: 'Harian'
        },
        {
          key: 'presensi-siswa' as TabKey,
          label: 'Presensi Siswa',
          icon: ClipboardCheck,
          badge: 'Kelas'
        },
        {
          key: 'nilai' as TabKey,
          label: 'Daftar Nilai Siswa',
          icon: Award,
          badge: 'Rapor'
        }
      ]
    },
    {
      group: 'Informasi & Dokumentasi',
      items: [
        {
          key: 'kegiatan' as TabKey,
          label: 'Jadwal Kegiatan',
          icon: CalendarCheck2,
          badge: counts.kegiatanCount
        },
        {
          key: 'album' as TabKey,
          label: 'Album Kegiatan',
          icon: ImageIcon,
          badge: counts.albumCount
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-emerald-700 to-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center shrink-0 drop-shadow-md">
              <img
                src="/logo.png"
                alt="Logo SDN 1 Gemenggeng"
                className="w-full h-full object-contain filter drop-shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-wide uppercase">
                SDN 1 Gemenggeng
              </h2>
              <p className="text-[11px] text-emerald-100/90">
                Sistem Informasi Sekolah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSelectTab(item.key);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
          {/* Role Status Card */}
          <div
            onClick={onOpenAdminModal}
            className={`rounded-xl p-2.5 border text-[11px] cursor-pointer transition-all flex items-center justify-between ${
              isAdmin
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100/70'
                : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/70'
            }`}
            title={isAdmin ? 'Anda masuk sebagai Admin' : 'Klik untuk masuk sebagai Admin'}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isAdmin ? 'bg-emerald-200/80 text-emerald-800' : 'bg-amber-200/80 text-amber-800'
                }`}
              >
                {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="font-bold leading-none">{isAdmin ? 'Akses Admin' : 'Mode Pelihat'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isAdmin ? 'Izin Edit & Hapus Aktif' : 'Hanya Lihat Data'}
                </p>
              </div>
            </div>
            {!isAdmin && (
              <span className="text-[10px] font-bold text-amber-700 bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
                Masuk
              </span>
            )}
          </div>

          <div className="rounded-xl p-2 bg-emerald-50/50 border border-emerald-100/80 text-[11px] text-emerald-950">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Kurikulum Merdeka</span>
            </div>
            <p className="text-[10px] text-emerald-700/90 mt-0.5 leading-snug">
              Mewujudkan Profil Pelajar Pancasila yang cerdas & berkarakter.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
