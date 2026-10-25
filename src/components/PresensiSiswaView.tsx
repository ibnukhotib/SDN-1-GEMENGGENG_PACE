import React, { useState } from 'react';
import { Siswa, PresensiSiswaRecord, PendidikTendik } from '../types';
import {
  ClipboardCheck,
  Calendar,
  Check,
  Printer,
  Sparkles,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { getTodayDateString, SEKOLAH_INFO } from '../data/initialData';

interface PresensiSiswaViewProps {
  siswaList: Siswa[];
  presensiList: PresensiSiswaRecord[];
  onUpdatePresensi: (records: PresensiSiswaRecord[]) => void;
  kepsek?: PendidikTendik;
  isAdmin?: boolean;
}

export const PresensiSiswaView: React.FC<PresensiSiswaViewProps> = ({
  siswaList,
  presensiList,
  onUpdatePresensi,
  kepsek,
  isAdmin = false
}) => {
  const kepsekNama = kepsek
    ? `${kepsek.nama}${kepsek.gelar && kepsek.gelar !== '-' ? `, ${kepsek.gelar}` : ''}`
    : SEKOLAH_INFO.kepalaSekolah;
  const kepsekNip = kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : SEKOLAH_INFO.nipKepsek;
  const [selectedKelas, setSelectedKelas] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get students of selected class
  const classStudents = siswaList
    .filter((s) => s.kelas === selectedKelas)
    .filter((s) => s.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  // Active records for current date & class
  const currentRecords: PresensiSiswaRecord[] = classStudents.map((siswa) => {
    const existing = presensiList.find(
      (r) => r.tanggal === selectedDate && r.siswaId === siswa.id
    );
    if (existing) return existing;

    return {
      id: `pres-sis-${selectedDate}-${siswa.id}`,
      tanggal: selectedDate,
      siswaId: siswa.id,
      kelas: selectedKelas,
      status: 'Hadir',
      keterangan: 'Hadir di kelas'
    };
  });

  const handleStatusChange = (siswaId: string, status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa') => {
    const updated = currentRecords.map((r) =>
      r.siswaId === siswaId ? { ...r, status, keterangan: status === 'Hadir' ? 'Hadir' : r.keterangan } : r
    );
    const otherRecords = presensiList.filter(
      (r) => !(r.tanggal === selectedDate && classStudents.some((s) => s.id === r.siswaId))
    );
    onUpdatePresensi([...otherRecords, ...updated]);
  };

  const handleKeteranganChange = (siswaId: string, ket: string) => {
    const updated = currentRecords.map((r) =>
      r.siswaId === siswaId ? { ...r, keterangan: ket } : r
    );
    const otherRecords = presensiList.filter(
      (r) => !(r.tanggal === selectedDate && classStudents.some((s) => s.id === r.siswaId))
    );
    onUpdatePresensi([...otherRecords, ...updated]);
  };

  const markAllClassPresent = () => {
    const updated = currentRecords.map((r) => ({
      ...r,
      status: 'Hadir' as const,
      keterangan: 'Hadir lengkap'
    }));
    const otherRecords = presensiList.filter(
      (r) => !(r.tanggal === selectedDate && classStudents.some((s) => s.id === r.siswaId))
    );
    onUpdatePresensi([...otherRecords, ...updated]);
  };

  // Stats calculation
  const totalInClass = classStudents.length;
  const hadirCount = currentRecords.filter((r) => r.status === 'Hadir').length;
  const sakitCount = currentRecords.filter((r) => r.status === 'Sakit').length;
  const izinCount = currentRecords.filter((r) => r.status === 'Izin').length;
  const alpaCount = currentRecords.filter((r) => r.status === 'Alpa').length;
  const percentage = totalInClass > 0 ? Math.round((hadirCount / totalInClass) * 100) : 0;

  return (
    <div className="space-y-6">
      <PrintHeader
        judulDokumen="DAFTAR HADIR PESERTA DIDIK (PRESENSI KELAS)"
        kelas={selectedKelas}
        subJudul={`Tanggal: ${selectedDate} &bull; SDN 1 GEMENGGENG, KEC. PACE`}
      />

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-600" />
            <span>Daftar Hadir Siswa per Kelas</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Presensi harian siswa per rombongan belajar SDN 1 Gemenggeng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Presensi Kelas</span>
          </button>
          {isAdmin ? (
            <button
              onClick={markAllClassPresent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Semua Hadir (Kelas {selectedKelas})</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Mode Pelihat
            </span>
          )}
        </div>
      </div>

      {/* Filters: Kelas Buttons, Date, Stats */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3 no-print">
        {/* Class Selection Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Pilih Kelas:</span>
          {['1', '2', '3', '4', '5', '6'].map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKelas(k)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedKelas === k
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kelas {k}
            </button>
          ))}
        </div>

        {/* Date & Quick Counters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa sekelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Hadir: {hadirCount} ({percentage}%)
            </span>
            <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-medium">
              Sakit (S): {sakitCount}
            </span>
            <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              Izin (I): {izinCount}
            </span>
            <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-medium">
              Alpa (A): {alpaCount}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden print:border print:border-slate-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th className="px-4 py-3.5">Nama Peserta Didik</th>
                <th className="px-4 py-3.5 w-24 text-center">NISN</th>
                <th className="px-4 py-3.5 w-16 text-center">L/P</th>
                <th className="px-4 py-3.5 w-32 text-center">Status Kehadiran</th>
                <th className="px-4 py-3.5">Keterangan</th>
                {isAdmin && <th className="px-4 py-3.5 w-48 text-center no-print">Tandai Cepat</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((siswa, index) => {
                const record = currentRecords.find((r) => r.siswaId === siswa.id);
                const status = record?.status || 'Hadir';

                return (
                  <tr key={siswa.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={siswa.fotoUrl}
                          alt={siswa.nama}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{siswa.nama}</div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            NIS: {siswa.nis} &bull; Wali: {siswa.namaWali}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-600">
                      {siswa.nisn}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span
                        className={
                          siswa.jenisKelamin === 'Laki-laki'
                            ? 'text-blue-600'
                            : 'text-rose-600'
                        }
                      >
                        {siswa.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'Sakit'
                            ? 'bg-purple-100 text-purple-800'
                            : status === 'Izin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <input
                          type="text"
                          placeholder="Keterangan / alasan..."
                          value={record?.keterangan || ''}
                          onChange={(e) => handleKeteranganChange(siswa.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 no-print"
                        />
                      ) : (
                        <span className="text-slate-600">{record?.keterangan || '-'}</span>
                      )}
                      <span className="hidden print:inline text-slate-700">
                        {record?.keterangan || '-'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-center no-print">
                        <div className="inline-flex rounded-lg bg-slate-100 p-0.5 gap-1">
                          {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(siswa.id, st)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                status === st
                                  ? 'bg-emerald-700 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {st[0]}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {classStudents.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Belum ada data siswa yang terdaftar di Kelas {selectedKelas}.
          </div>
        )}
      </div>

      {/* Signature block for physical printing */}
      <div className="hidden print:grid grid-cols-2 mt-8 pt-6 text-xs text-center">
        <div>
          <p>Mengetahui,</p>
          <p className="font-bold">Kepala SDN 1 Gemenggeng</p>
          <div className="h-20" />
          <p className="font-bold underline">{kepsekNama}</p>
          <p className="text-[10px]">NIP. {kepsekNip}</p>
        </div>
        <div>
          <p>Gemenggeng, {selectedDate}</p>
          <p className="font-bold">Guru / Wali Kelas {selectedKelas}</p>
          <div className="h-20" />
          <p className="font-bold underline">(......................................................)</p>
          <p className="text-[10px]">NIP. ...................................................</p>
        </div>
      </div>
    </div>
  );
};
