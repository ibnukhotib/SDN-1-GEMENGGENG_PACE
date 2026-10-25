import React, { useState } from 'react';
import { Siswa, NilaiSiswaRecord, PendidikTendik } from '../types';
import { MAPEL_LIST } from '../data/initialData';
import {
  Award,
  Filter,
  Plus,
  Printer,
  Edit,
  Save,
  CheckCircle,
  FileSpreadsheet,
  X,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { SEKOLAH_INFO } from '../data/initialData';

interface NilaiViewProps {
  siswaList: Siswa[];
  nilaiList: NilaiSiswaRecord[];
  onSaveNilai: (records: NilaiSiswaRecord[]) => void;
  kepsek?: PendidikTendik;
  isAdmin?: boolean;
}

export const NilaiView: React.FC<NilaiViewProps> = ({
  siswaList,
  nilaiList,
  onSaveNilai,
  kepsek,
  isAdmin = false
}) => {
  const kepsekNama = kepsek
    ? `${kepsek.nama}${kepsek.gelar && kepsek.gelar !== '-' ? `, ${kepsek.gelar}` : ''}`
    : SEKOLAH_INFO.kepalaSekolah;
  const kepsekNip = kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : SEKOLAH_INFO.nipKepsek;

  const [selectedKelas, setSelectedKelas] = useState<string>('1');
  const [selectedMapel, setSelectedMapel] = useState<string>(MAPEL_LIST[3]); // Matematika default
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  // Modal Input Nilai
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<NilaiSiswaRecord | null>(null);
  const [modalForm, setModalForm] = useState({
    siswaId: '',
    tp1: 80,
    tp2: 80,
    tp3: 80,
    sts: 80,
    sas: 80,
    catatan: ''
  });

  // Students in selected class
  const classStudents = siswaList.filter((s) => s.kelas === selectedKelas);

  // Helper calculation
  const calculateFinalScore = (tp1: number, tp2: number, tp3: number, sts: number, sas: number) => {
    const avgTp = (tp1 + tp2 + tp3) / 3;
    const finalScore = Math.round(avgTp * 0.4 + sts * 0.3 + sas * 0.3);
    return Math.min(100, Math.max(0, finalScore));
  };

  const getPredicate = (score: number): 'A' | 'B' | 'C' | 'D' => {
    if (score >= 88) return 'A';
    if (score >= 78) return 'B';
    if (score >= 65) return 'C';
    return 'D';
  };

  // Ensure every student in this class has a grade record for this subject
  const currentGrades: NilaiSiswaRecord[] = classStudents.map((siswa) => {
    const existing = nilaiList.find(
      (n) =>
        n.siswaId === siswa.id &&
        n.mataPelajaran === selectedMapel &&
        n.semester === selectedSemester
    );
    if (existing) return existing;

    const defFinal = calculateFinalScore(80, 80, 80, 80, 80);
    return {
      id: `nil-${siswa.id}-${selectedMapel.substring(0, 4)}`,
      siswaId: siswa.id,
      kelas: selectedKelas,
      mataPelajaran: selectedMapel,
      semester: selectedSemester,
      tahunAjaran: '2026/2027',
      tp1: 80,
      tp2: 80,
      tp3: 80,
      sts: 80,
      sas: 80,
      nilaiAkhir: defFinal,
      predikat: getPredicate(defFinal),
      catatan: 'Mencapai tujuan pembelajaran dengan baik.'
    };
  });

  const handleInlineChange = (
    siswaId: string,
    field: 'tp1' | 'tp2' | 'tp3' | 'sts' | 'sas',
    valStr: string
  ) => {
    const num = Math.min(100, Math.max(0, Number(valStr) || 0));
    const updated = currentGrades.map((g) => {
      if (g.siswaId === siswaId) {
        const next = { ...g, [field]: num };
        const na = calculateFinalScore(next.tp1, next.tp2, next.tp3, next.sts, next.sas);
        next.nilaiAkhir = na;
        next.predikat = getPredicate(na);
        return next;
      }
      return g;
    });

    const otherRecords = nilaiList.filter(
      (n) =>
        !(
          n.kelas === selectedKelas &&
          n.mataPelajaran === selectedMapel &&
          n.semester === selectedSemester
        )
    );
    onSaveNilai([...otherRecords, ...updated]);
  };

  const openModalForStudent = (siswa: Siswa) => {
    const rec = currentGrades.find((g) => g.siswaId === siswa.id);
    if (rec) {
      setEditingRecord(rec);
      setModalForm({
        siswaId: siswa.id,
        tp1: rec.tp1,
        tp2: rec.tp2,
        tp3: rec.tp3,
        sts: rec.sts,
        sas: rec.sas,
        catatan: rec.catatan
      });
    }
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const na = calculateFinalScore(
      modalForm.tp1,
      modalForm.tp2,
      modalForm.tp3,
      modalForm.sts,
      modalForm.sas
    );
    const pred = getPredicate(na);

    const updated = currentGrades.map((g) => {
      if (g.siswaId === modalForm.siswaId) {
        return {
          ...g,
          tp1: modalForm.tp1,
          tp2: modalForm.tp2,
          tp3: modalForm.tp3,
          sts: modalForm.sts,
          sas: modalForm.sas,
          nilaiAkhir: na,
          predikat: pred,
          catatan: modalForm.catatan || 'Mencapai tujuan pembelajaran dengan baik.'
        };
      }
      return g;
    });

    const otherRecords = nilaiList.filter(
      (n) =>
        !(
          n.kelas === selectedKelas &&
          n.mataPelajaran === selectedMapel &&
          n.semester === selectedSemester
        )
    );
    onSaveNilai([...otherRecords, ...updated]);
    setIsModalOpen(false);
  };

  // Average statistics
  const avgClassFinal =
    currentGrades.length > 0
      ? Math.round(
          currentGrades.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) /
            currentGrades.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <PrintHeader
        judulDokumen="LEDGER / DAFTAR NILAI ASESMEN SISWA"
        kelas={selectedKelas}
        subJudul={`Mata Pelajaran: ${selectedMapel} &bull; Semester: ${selectedSemester} 2026/2027`}
      />

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>Daftar & Input Nilai Siswa per Kelas</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pengelolaan nilai sumatif lingkup materi, STS, SAS, dan rapor Kurikulum Merdeka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap Nilai</span>
          </button>
        </div>
      </div>

      {/* Filter and Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3 no-print">
        {/* Class Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Tingkat Kelas:</span>
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

        {/* Subject & Semester Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mata Pelajaran (Kurikulum Merdeka)
            </label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {MAPEL_LIST.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Semester
            </label>
            <div className="inline-flex w-full rounded-xl bg-slate-100 p-1">
              {(['Ganjil', 'Genap'] as const).map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedSemester === sem
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-900">
              Form Asesmen Kelas {selectedKelas} &bull; {selectedMapel}
            </span>
          </div>
          <div className="font-bold text-emerald-800">
            Rata-rata Kelas: {avgClassFinal}
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden print:border print:border-slate-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="px-3 py-3 w-10 text-center">No</th>
                <th className="px-3 py-3">Nama Siswa</th>
                <th className="px-3 py-3 w-20 text-center">NISN</th>
                <th className="px-2 py-3 w-16 text-center">TP 1</th>
                <th className="px-2 py-3 w-16 text-center">TP 2</th>
                <th className="px-2 py-3 w-16 text-center">TP 3</th>
                <th className="px-2 py-3 w-16 text-center">STS</th>
                <th className="px-2 py-3 w-16 text-center">SAS</th>
                <th className="px-3 py-3 w-20 text-center">Nilai Akhir</th>
                <th className="px-2 py-3 w-16 text-center">Predikat</th>
                <th className="px-3 py-3">Deskripsi Capaian</th>
                {isAdmin && <th className="px-3 py-3 w-20 text-center no-print">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((siswa, index) => {
                const grade = currentGrades.find((g) => g.siswaId === siswa.id);
                if (!grade) return null;

                return (
                  <tr key={siswa.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-3 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={siswa.fotoUrl}
                          alt={siswa.nama}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="font-bold text-slate-900 truncate max-w-[160px]">
                          {siswa.nama}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-[11px] text-slate-500">
                      {siswa.nisn}
                    </td>

                    {/* TP 1 */}
                    <td className="px-2 py-3 text-center">
                      {isAdmin ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.tp1}
                          onChange={(e) => handleInlineChange(siswa.id, 'tp1', e.target.value)}
                          className="w-14 text-center py-1 rounded-md border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 no-print"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{grade.tp1}</span>
                      )}
                      <span className="hidden print:inline font-semibold">{grade.tp1}</span>
                    </td>

                    {/* TP 2 */}
                    <td className="px-2 py-3 text-center">
                      {isAdmin ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.tp2}
                          onChange={(e) => handleInlineChange(siswa.id, 'tp2', e.target.value)}
                          className="w-14 text-center py-1 rounded-md border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 no-print"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{grade.tp2}</span>
                      )}
                      <span className="hidden print:inline font-semibold">{grade.tp2}</span>
                    </td>

                    {/* TP 3 */}
                    <td className="px-2 py-3 text-center">
                      {isAdmin ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.tp3}
                          onChange={(e) => handleInlineChange(siswa.id, 'tp3', e.target.value)}
                          className="w-14 text-center py-1 rounded-md border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 no-print"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{grade.tp3}</span>
                      )}
                      <span className="hidden print:inline font-semibold">{grade.tp3}</span>
                    </td>

                    {/* STS */}
                    <td className="px-2 py-3 text-center">
                      {isAdmin ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.sts}
                          onChange={(e) => handleInlineChange(siswa.id, 'sts', e.target.value)}
                          className="w-14 text-center py-1 rounded-md border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 no-print"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{grade.sts}</span>
                      )}
                      <span className="hidden print:inline font-semibold">{grade.sts}</span>
                    </td>

                    {/* SAS */}
                    <td className="px-2 py-3 text-center">
                      {isAdmin ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.sas}
                          onChange={(e) => handleInlineChange(siswa.id, 'sas', e.target.value)}
                          className="w-14 text-center py-1 rounded-md border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 no-print"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{grade.sas}</span>
                      )}
                      <span className="hidden print:inline font-semibold">{grade.sas}</span>
                    </td>

                    {/* Nilai Akhir */}
                    <td className="px-3 py-3 text-center font-extrabold text-sm text-emerald-800 bg-emerald-50/50">
                      {grade.nilaiAkhir}
                    </td>

                    {/* Predikat */}
                    <td className="px-2 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          grade.predikat === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : grade.predikat === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : grade.predikat === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {grade.predikat}
                      </span>
                    </td>

                    {/* Catatan Capaian */}
                    <td className="px-3 py-3 text-[11px] text-slate-600 line-clamp-2">
                      {grade.catatan}
                    </td>

                    {/* Edit Detail Button (no-print) */}
                    {isAdmin && (
                      <td className="px-3 py-3 text-center no-print">
                        <button
                          onClick={() => openModalForStudent(siswa)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit Nilai & Catatan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
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
            Tidak ada siswa di Kelas {selectedKelas}.
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
          <p>Gemenggeng, 22 Oktober 2026</p>
          <p className="font-bold">Guru Pengampu Mata Pelajaran</p>
          <div className="h-20" />
          <p className="font-bold underline">(......................................................)</p>
          <p className="text-[10px]">NIP. ...................................................</p>
        </div>
      </div>

      {/* Modal Dialog Input Detail Nilai Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Input & Penyesuaian Nilai Rapor
                  </h3>
                  <p className="text-xs text-slate-500">{selectedMapel} &bull; Kelas {selectedKelas}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Grades input boxes */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    TP 1 (Lingkup Materi 1)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={modalForm.tp1}
                    onChange={(e) => setModalForm({ ...modalForm, tp1: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    TP 2 (Lingkup Materi 2)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={modalForm.tp2}
                    onChange={(e) => setModalForm({ ...modalForm, tp2: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    TP 3 (Lingkup Materi 3)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={modalForm.tp3}
                    onChange={(e) => setModalForm({ ...modalForm, tp3: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    STS (Tengah Sem.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={modalForm.sts}
                    onChange={(e) => setModalForm({ ...modalForm, sts: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    SAS (Akhir Sem.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={modalForm.sas}
                    onChange={(e) => setModalForm({ ...modalForm, sas: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-center">
                    <span className="text-[10px] block font-semibold">Simulasi NA:</span>
                    <span className="text-base font-extrabold">
                      {calculateFinalScore(
                        modalForm.tp1,
                        modalForm.tp2,
                        modalForm.tp3,
                        modalForm.sts,
                        modalForm.sas
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Catatan Capaian Kompetensi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Capaian Kompetensi (Rapor)
                </label>
                <textarea
                  rows={3}
                  value={modalForm.catatan}
                  onChange={(e) => setModalForm({ ...modalForm, catatan: e.target.value })}
                  placeholder="Contoh: Sangat baik dalam memahami konsep bilangan cacah dan pecahan..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  Simpan Nilai Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
