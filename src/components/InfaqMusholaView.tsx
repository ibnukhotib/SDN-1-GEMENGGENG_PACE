import React, { useState, useMemo } from 'react';
import { InfaqMusholaRecord, PendidikTendik, SekolahInfo } from '../types';
import { SEKOLAH_INFO } from '../data/initialData';
import {
  Coins,
  Plus,
  Search,
  Printer,
  Edit,
  Trash2,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Calendar,
  FileText,
  Filter,
  AlertCircle
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { ConfirmModal } from './ConfirmModal';

interface InfaqMusholaViewProps {
  infaqList: InfaqMusholaRecord[];
  onSaveInfaq: (record: InfaqMusholaRecord) => void;
  onDeleteInfaq: (id: string) => void;
  isAdmin?: boolean;
  onRequireAdmin?: () => void;
  kepsek?: PendidikTendik;
  sekolahInfo?: SekolahInfo;
}

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(angka);
};

const formatTanggalIndo = (dateStr: string) => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (Number.isNaN(dateObj.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(dateObj);
};

export const InfaqMusholaView: React.FC<InfaqMusholaViewProps> = ({
  infaqList,
  onSaveInfaq,
  onDeleteInfaq,
  isAdmin = false,
  onRequireAdmin,
  kepsek,
  sekolahInfo = SEKOLAH_INFO
}) => {
  const info = sekolahInfo || SEKOLAH_INFO;
  const kepsekNama = kepsek
    ? `${kepsek.nama}${kepsek.gelar && kepsek.gelar !== '-' ? `, ${kepsek.gelar}` : ''}`
    : info.kepalaSekolah;
  const kepsekNip = kepsek?.nip && kepsek.nip !== '-' ? kepsek.nip : info.nipKepsek;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBulan, setFilterBulan] = useState('Semua');
  const [filterJenis, setFilterJenis] = useState<'Semua' | 'Masuk' | 'Keluar'>('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InfaqMusholaRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<InfaqMusholaRecord | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    tanggal: string;
    uraian: string;
    uangMasuk: string;
    uangKeluar: string;
  }>({
    tanggal: new Date().toISOString().split('T')[0],
    uraian: '',
    uangMasuk: '',
    uangKeluar: ''
  });

  // Sort chronologically and compute running balance ("jumlah")
  const recordsWithRunningBalance = useMemo(() => {
    const sorted = [...infaqList].sort((a, b) => {
      if (a.tanggal !== b.tanggal) {
        return a.tanggal.localeCompare(b.tanggal);
      }
      return a.id.localeCompare(b.id);
    });

    let runningSaldo = 0;
    return sorted.map((item) => {
      const masuk = Number(item.uangMasuk) || 0;
      const keluar = Number(item.uangKeluar) || 0;
      runningSaldo += masuk - keluar;
      return {
        ...item,
        uangMasuk: masuk,
        uangKeluar: keluar,
        jumlah: runningSaldo
      };
    });
  }, [infaqList]);

  // Available months for filter dropdown
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    infaqList.forEach((item) => {
      if (item.tanggal && item.tanggal.length >= 7) {
        set.add(item.tanggal.slice(0, 7));
      }
    });
    return Array.from(set).sort().reverse();
  }, [infaqList]);

  // Apply user filters
  const filteredRecords = useMemo(() => {
    return recordsWithRunningBalance.filter((item) => {
      const matchesSearch = item.uraian.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth =
        filterBulan === 'Semua' ? true : item.tanggal.startsWith(filterBulan);
      const matchesJenis =
        filterJenis === 'Semua'
          ? true
          : filterJenis === 'Masuk'
          ? item.uangMasuk > 0
          : item.uangKeluar > 0;
      return matchesSearch && matchesMonth && matchesJenis;
    });
  }, [recordsWithRunningBalance, searchTerm, filterBulan, filterJenis]);

  // Overall totals
  const summary = useMemo(() => {
    const totalMasuk = recordsWithRunningBalance.reduce((sum, r) => sum + r.uangMasuk, 0);
    const totalKeluar = recordsWithRunningBalance.reduce((sum, r) => sum + r.uangKeluar, 0);
    const saldoAkhir = totalMasuk - totalKeluar;
    return {
      totalMasuk,
      totalKeluar,
      saldoAkhir,
      totalTransaksi: recordsWithRunningBalance.length
    };
  }, [recordsWithRunningBalance]);

  // Filtered totals for footer
  const filteredTotals = useMemo(() => {
    const totalMasuk = filteredRecords.reduce((sum, r) => sum + r.uangMasuk, 0);
    const totalKeluar = filteredRecords.reduce((sum, r) => sum + r.uangKeluar, 0);
    const jumlahAkhir =
      filteredRecords.length > 0
        ? filteredRecords[filteredRecords.length - 1].jumlah
        : summary.saldoAkhir;
    return {
      totalMasuk,
      totalKeluar,
      jumlahAkhir
    };
  }, [filteredRecords, summary.saldoAkhir]);

  const openAddModal = () => {
    setEditingRecord(null);
    setFormError(null);
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      uraian: '',
      uangMasuk: '',
      uangKeluar: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: InfaqMusholaRecord) => {
    setEditingRecord(record);
    setFormError(null);
    setFormData({
      tanggal: record.tanggal,
      uraian: record.uraian,
      uangMasuk: record.uangMasuk > 0 ? String(record.uangMasuk) : '',
      uangKeluar: record.uangKeluar > 0 ? String(record.uangKeluar) : ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.tanggal) {
      setFormError('Tanggal transaksi wajib diisi.');
      return;
    }
    if (!formData.uraian.trim()) {
      setFormError('Uraian transaksi wajib diisi.');
      return;
    }

    const uangMasuk = Math.max(0, Number(formData.uangMasuk) || 0);
    const uangKeluar = Math.max(0, Number(formData.uangKeluar) || 0);

    if (uangMasuk === 0 && uangKeluar === 0) {
      setFormError('Isi nominal Uang Masuk atau Uang Keluar (minimal salah satu lebih dari 0).');
      return;
    }

    const record: InfaqMusholaRecord = {
      id: editingRecord ? editingRecord.id : `infaq-${Date.now()}`,
      tanggal: formData.tanggal,
      uraian: formData.uraian.trim(),
      uangMasuk,
      uangKeluar
    };

    onSaveInfaq(record);
    setIsModalOpen(false);
  };

  const previewMasuk = Math.max(0, Number(formData.uangMasuk) || 0);
  const previewKeluar = Math.max(0, Number(formData.uangKeluar) || 0);
  const previewSelisih = previewMasuk - previewKeluar;

  const formatMonthLabel = (ym: string) => {
    const [year, month] = ym.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-6">
      <PrintHeader
        judulDokumen="BUKU KAS INFAQ MUSHOLA SDN 1 GEMENGGENG"
        subJudul="Laporan Penerimaan, Pengeluaran, dan Saldo Kas Infaq Mushola"
        sekolahInfo={info}
      />

      {/* Screen Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <span>Infaq Mushola SDN 1 Gemenggeng</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Catatan kas transparan penerimaan (uang masuk), pengeluaran (uang keluar), dan jumlah saldo infaq mushola sekolah
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Laporan</span>
          </button>

          {isAdmin ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Infaq</span>
            </button>
          ) : (
            onRequireAdmin && (
              <button
                onClick={onRequireAdmin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors shadow-xs active:scale-95"
                title="Masuk sebagai Admin untuk menambah atau mengedit catatan infaq"
              >
                <Plus className="w-4 h-4" />
                <span>Kelola (Admin)</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Uang Masuk</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-black text-emerald-700">
            {formatRupiah(summary.totalMasuk)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akumulasi seluruh pemasukan</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Uang Keluar</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-black text-rose-600">
            {formatRupiah(summary.totalKeluar)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akumulasi seluruh pengeluaran</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100">Jumlah Saldo Akhir</span>
            <div className="w-9 h-9 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-black text-white">
            {formatRupiah(summary.saldoAkhir)}
          </div>
          <p className="text-[11px] text-emerald-100/80 mt-1">Kas aktif Mushola SDN 1 Gemenggeng</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Jumlah Transaksi</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl font-black text-slate-800">
            {summary.totalTransaksi} Catatan
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tercatat rapi &amp; tersinkronisasi</p>
        </div>
      </div>

      {/* Filters (no-print) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari uraian infaq atau pengeluaran..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>

            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Bulan</option>
              {availableMonths.map((ym) => (
                <option key={ym} value={ym}>
                  {formatMonthLabel(ym)}
                </option>
              ))}
            </select>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['Semua', 'Masuk', 'Keluar'] as const).map((jenis) => (
                <button
                  key={jenis}
                  onClick={() => setFilterJenis(jenis)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterJenis === jenis
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {jenis === 'Semua' ? 'Semua' : jenis === 'Masuk' ? 'Uang Masuk' : 'Uang Keluar'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden print:border print:border-slate-300 print:shadow-none print:rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50/80 border-b border-emerald-200/80 text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 print:bg-slate-100 print:text-slate-900">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Tanggal</th>
                <th className="py-3.5 px-4 min-w-[220px]">Uraian</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Uang Masuk</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Uang Keluar</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Jumlah</th>
                {isAdmin && (
                  <th className="py-3.5 px-4 text-center w-24 no-print">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors print:break-inside-avoid"
                >
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 no-print" />
                      <span>{formatTanggalIndo(item.tanggal)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-medium leading-snug">
                    {item.uraian}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-emerald-700">
                    {item.uangMasuk > 0 ? formatRupiah(item.uangMasuk) : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-rose-600">
                    {item.uangKeluar > 0 ? formatRupiah(item.uangKeluar) : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-black text-slate-900 bg-slate-50/60">
                    {formatRupiah(item.jumlah)}
                  </td>
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center no-print">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit Catatan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setRecordToDelete(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="py-10 px-4 text-center text-slate-500 text-xs"
                  >
                    Belum ada catatan transaksi infaq mushola yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>

            {filteredRecords.length > 0 && (
              <tfoot>
                <tr className="bg-emerald-900 text-white font-extrabold text-xs print:bg-slate-200 print:text-slate-900 print:border-t-2 print:border-slate-900">
                  <td colSpan={3} className="py-3.5 px-4 text-right uppercase tracking-wider">
                    Total {filterBulan !== 'Semua' || filterJenis !== 'Semua' || searchTerm ? '(Sesuai Filter)' : 'Keseluruhan'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap text-emerald-300 print:text-slate-900">
                    {formatRupiah(filteredTotals.totalMasuk)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap text-rose-300 print:text-slate-900">
                    {formatRupiah(filteredTotals.totalKeluar)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap text-amber-300 print:text-slate-900">
                    {formatRupiah(filteredTotals.jumlahAkhir)}
                  </td>
                  {isAdmin && <td className="no-print" />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Print Signature Block */}
      <div className="hidden print:grid grid-cols-2 gap-8 mt-8 pt-6 text-xs text-slate-800">
        <div className="text-center space-y-16">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala {info.nama}</p>
          </div>
          <div>
            <p className="font-bold underline">{kepsekNama}</p>
            <p>NIP. {kepsekNip}</p>
          </div>
        </div>
        <div className="text-center space-y-16">
          <div>
            <p>Gemenggeng, {formatTanggalIndo(new Date().toISOString().split('T')[0])}</p>
            <p className="font-bold">Pengurus / Bendahara Mushola</p>
          </div>
          <div>
            <p className="font-bold underline">............................................</p>
            <p>Pengelola Infaq Mushola</p>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRecord ? 'Edit Catatan Infaq Mushola' : 'Tambah Catatan Infaq Mushola'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Isi tanggal, uraian, uang masuk, dan/atau uang keluar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal *
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Infaq Jumat Siswa & Guru / Beli Karpet Mushola"
                  value={formData.uraian}
                  onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    Uang Masuk (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    placeholder="0"
                    value={formData.uangMasuk}
                    onChange={(e) => setFormData({ ...formData, uangMasuk: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-emerald-50/40 font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-700 mb-1">
                    Uang Keluar (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    placeholder="0"
                    value={formData.uangKeluar}
                    onChange={(e) => setFormData({ ...formData, uangKeluar: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-rose-50/40 font-semibold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              {/* Live Calculation Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Selisih Transaksi (Masuk - Keluar)</span>
                  <span className="text-[11px] text-slate-400">Otomatis menghitung kolom Jumlah saldo kas</span>
                </div>
                <span
                  className={`text-sm font-black ${
                    previewSelisih >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {previewSelisih >= 0 ? '+' : ''}
                  {formatRupiah(previewSelisih)}
                </span>
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
                  {editingRecord ? 'Simpan Perubahan' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!recordToDelete}
        title="Hapus Catatan Infaq Mushola"
        message={`Apakah Anda yakin ingin menghapus catatan "${recordToDelete?.uraian}"?`}
        detail={`Tanggal: ${formatTanggalIndo(recordToDelete?.tanggal || '')} • Masuk: ${formatRupiah(
          recordToDelete?.uangMasuk || 0
        )} • Keluar: ${formatRupiah(recordToDelete?.uangKeluar || 0)}`}
        confirmLabel="Ya, Hapus Catatan"
        onConfirm={() => {
          if (recordToDelete) {
            onDeleteInfaq(recordToDelete.id);
            setRecordToDelete(null);
          }
        }}
        onCancel={() => setRecordToDelete(null)}
      />
    </div>
  );
};
