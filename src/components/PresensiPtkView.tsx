import React, { useState } from 'react';
import { PendidikTendik, PresensiPtkRecord, StatusPresensi } from '../types';
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Sparkles,
  FileCheck,
  Building,
  Check
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { getTodayDateString, SEKOLAH_INFO } from '../data/initialData';

interface PresensiPtkViewProps {
  ptkList: PendidikTendik[];
  presensiList: PresensiPtkRecord[];
  onUpdatePresensi: (records: PresensiPtkRecord[]) => void;
  isAdmin?: boolean;
}

export const PresensiPtkView: React.FC<PresensiPtkViewProps> = ({
  ptkList,
  presensiList,
  onUpdatePresensi,
  isAdmin = false
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  const kepsek = ptkList.find(
    (p) =>
      p.jabatan.toLowerCase().includes('kepala sekolah') ||
      p.jabatan.toLowerCase().includes('kepsek')
  );
  const kepsekNama = kepsek
    ? `${kepsek.nama}${kepsek.gelar && kepsek.gelar !== '-' ? `, ${kepsek.gelar}` : ''}`
    : SEKOLAH_INFO.kepalaSekolah;
  const kepsekNip = kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : SEKOLAH_INFO.nipKepsek;

  // Filter or initialize records for selectedDate
  const currentRecords: PresensiPtkRecord[] = ptkList.map((ptk) => {
    const existing = presensiList.find(
      (r) => r.tanggal === selectedDate && r.ptkId === ptk.id
    );
    if (existing) return existing;

    return {
      id: `pres-ptk-${selectedDate}-${ptk.id}`,
      tanggal: selectedDate,
      ptkId: ptk.id,
      status: 'Hadir',
      jamMasuk: '06.45',
      keterangan: 'Hadir'
    };
  });

  const handleStatusChange = (ptkId: string, status: StatusPresensi) => {
    const updated = currentRecords.map((r) => {
      if (r.ptkId === ptkId) {
        return {
          ...r,
          status,
          jamMasuk: status === 'Hadir' ? (r.jamMasuk === '-' ? '06.45' : r.jamMasuk) : '-',
          keterangan: status === 'Hadir' ? 'Hadir' : r.keterangan || status
        };
      }
      return r;
    });

    // Merge with other dates in presensiList
    const otherDates = presensiList.filter((r) => r.tanggal !== selectedDate);
    onUpdatePresensi([...otherDates, ...updated]);
  };

  const handleJamChange = (ptkId: string, jam: string) => {
    const updated = currentRecords.map((r) =>
      r.ptkId === ptkId ? { ...r, jamMasuk: jam } : r
    );
    const otherDates = presensiList.filter((r) => r.tanggal !== selectedDate);
    onUpdatePresensi([...otherDates, ...updated]);
  };

  const handleKeteranganChange = (ptkId: string, ket: string) => {
    const updated = currentRecords.map((r) =>
      r.ptkId === ptkId ? { ...r, keterangan: ket } : r
    );
    const otherDates = presensiList.filter((r) => r.tanggal !== selectedDate);
    onUpdatePresensi([...otherDates, ...updated]);
  };

  const markAllPresent = () => {
    const updated = currentRecords.map((r) => ({
      ...r,
      status: 'Hadir' as StatusPresensi,
      jamMasuk: '06.45',
      keterangan: 'Tepat Waktu'
    }));
    const otherDates = presensiList.filter((r) => r.tanggal !== selectedDate);
    onUpdatePresensi([...otherDates, ...updated]);
  };

  // Stats for the day
  const hadirCount = currentRecords.filter((r) => r.status === 'Hadir').length;
  const dlCount = currentRecords.filter((r) => r.status === 'Dinas Luar').length;
  const sakitCount = currentRecords.filter((r) => r.status === 'Sakit').length;
  const izinCount = currentRecords.filter((r) => r.status === 'Izin').length;
  const alpaCount = currentRecords.filter((r) => r.status === 'Alpa').length;

  return (
    <div className="space-y-6">
      <PrintHeader
        judulDokumen="DAFTAR HADIR PENDIDIK & TENAGA KEPENDIDIKAN"
        subJudul={`Tanggal: ${selectedDate} - SDN 1 GEMENGGENG, NGANJUK`}
      />

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <span>Presensi Guru & Tenaga Kependidikan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan daftar kehadiran harian dewan guru dan staf SDN 1 Gemenggeng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Presensi PTK</span>
          </button>
          <button
            onClick={markAllPresent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Tandai Semua Hadir</span>
          </button>
        </div>
      </div>

      {/* Controls: Date Picker & Summary Pills */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Pilih Tanggal:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Quick Count Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Hadir: {hadirCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Dinas Luar: {dlCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
              Izin: {izinCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              Sakit: {sakitCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              Alpa: {alpaCount}
            </span>
          </div>
        </div>
      </div>

      {/* Table Presensi PTK */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden print:border print:border-slate-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th className="px-4 py-3.5">Nama & Jabatan PTK</th>
                <th className="px-4 py-3.5 w-32">Status Kehadiran</th>
                <th className="px-4 py-3.5 w-24">Jam Datang</th>
                <th className="px-4 py-3.5">Keterangan</th>
                {isAdmin && <th className="px-4 py-3.5 w-48 no-print">Ubah Status Cepat</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ptkList.map((ptk, index) => {
                const record = currentRecords.find((r) => r.ptkId === ptk.id);
                const status = record?.status || 'Hadir';

                return (
                  <tr key={ptk.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={ptk.fotoUrl}
                          alt={ptk.nama}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">
                            {ptk.nama}{ptk.gelar && ptk.gelar !== '-' ? `, ${ptk.gelar}` : ''}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {ptk.jabatan} &bull; NIP: {ptk.nip}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'Dinas Luar'
                            ? 'bg-blue-100 text-blue-800'
                            : status === 'Izin'
                            ? 'bg-amber-100 text-amber-800'
                            : status === 'Sakit'
                            ? 'bg-purple-100 text-purple-800'
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
                          value={record?.jamMasuk || '-'}
                          onChange={(e) => handleJamChange(ptk.id, e.target.value)}
                          className="w-20 px-2 py-1 text-xs rounded-lg border border-slate-200 font-mono no-print"
                        />
                      ) : (
                        <span className="font-mono text-slate-700">{record?.jamMasuk || '-'}</span>
                      )}
                      <span className="hidden print:inline font-mono font-semibold">
                        {record?.jamMasuk || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <input
                          type="text"
                          placeholder="Catatan..."
                          value={record?.keterangan || ''}
                          onChange={(e) => handleKeteranganChange(ptk.id, e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 no-print"
                        />
                      ) : (
                        <span className="text-slate-600">{record?.keterangan || '-'}</span>
                      )}
                      <span className="hidden print:inline text-slate-700">
                        {record?.keterangan || '-'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 no-print">
                        <div className="flex items-center gap-1">
                          {(['Hadir', 'Dinas Luar', 'Izin', 'Sakit', 'Alpa'] as StatusPresensi[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(ptk.id, st)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${
                                status === st
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st === 'Dinas Luar' ? 'DL' : st[0]}
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
          <p className="font-bold">Koordinator Kepegawaian & Tata Usaha</p>
          <div className="h-20" />
          <p className="font-bold underline">Indra Gunawan, S.Kom.</p>
          <p className="text-[10px]">NIP. 19960305 202301 1 009</p>
        </div>
      </div>
    </div>
  );
};
