import React from 'react';
import { SEKOLAH_INFO } from '../data/initialData';
import { GraduationCap } from 'lucide-react';

interface PrintHeaderProps {
  judulDokumen: string;
  subJudul?: string;
  kelas?: string;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  judulDokumen,
  subJudul,
  kelas
}) => {
  return (
    <div className="hidden print:block mb-6 border-b-4 border-double border-slate-900 pb-3 text-center">
      <div className="flex items-center justify-between gap-4">
        <img
          src="/logo.png"
          alt="Logo SDN 1 Gemenggeng"
          className="w-16 h-16 object-contain shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 text-center">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
            Pemerintah Kabupaten Nganjuk &bull; Dinas Pendidikan
          </h3>
          <h1 className="text-lg font-black uppercase text-slate-900 tracking-wide mt-0.5">
            {SEKOLAH_INFO.nama}
          </h1>
          <p className="text-[10px] text-slate-600 leading-tight">
            NPSN: {SEKOLAH_INFO.npsn} &bull; Akreditasi: {SEKOLAH_INFO.akreditasi} &bull; {SEKOLAH_INFO.kurikulum}
          </p>
          <p className="text-[9px] text-slate-500">
            {SEKOLAH_INFO.alamat} &bull; Telp: {SEKOLAH_INFO.telepon}
          </p>
        </div>
        <img
          src="/logo.png"
          alt="Logo SDN 1 Gemenggeng"
          className="w-16 h-16 object-contain shrink-0"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-4 pt-2 border-t border-slate-400">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 underline">
          {judulDokumen}
        </h2>
        {kelas && (
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Kelas {kelas} &bull; Tahun Ajaran 2026/2027
          </p>
        )}
        {subJudul && (
          <p className="text-[10px] text-slate-600 mt-0.5">{subJudul}</p>
        )}
      </div>
    </div>
  );
};
