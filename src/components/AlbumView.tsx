import React, { useState } from 'react';
import { AlbumKegiatan } from '../types';
import {
  Image as ImageIcon,
  Plus,
  Calendar,
  X,
  Camera,
  Trash2,
  Eye,
  Sparkles,
  Layers
} from 'lucide-react';
import { PrintHeader } from './PrintHeader';
import { ConfirmModal } from './ConfirmModal';

interface AlbumViewProps {
  albumList: AlbumKegiatan[];
  onSaveAlbum: (album: AlbumKegiatan) => void;
  onDeleteAlbum: (id: string) => void;
  isAdmin?: boolean;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  albumList,
  onSaveAlbum,
  onDeleteAlbum,
  isAdmin = false
}) => {
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeLightbox, setActiveLightbox] = useState<AlbumKegiatan | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<AlbumKegiatan | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AlbumKegiatan>>({
    judul: '',
    kategori: 'Karya Siswa',
    tanggal: 'Oktober 2026',
    deskripsi: '',
    fotoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    jumlahFoto: 1
  });

  const [previewImage, setPreviewImage] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, fotoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul) {
      alert('Judul album kegiatan wajib diisi');
      return;
    }

    const item: AlbumKegiatan = {
      id: `alb-${Date.now()}`,
      judul: formData.judul || '',
      kategori: formData.kategori || 'Kegiatan',
      tanggal: formData.tanggal || '2026',
      deskripsi: formData.deskripsi || '',
      fotoUrl:
        previewImage ||
        formData.fotoUrl ||
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      jumlahFoto: formData.jumlahFoto || 1
    };

    onSaveAlbum(item);
    setIsAddModalOpen(false);
  };

  // Categories list
  const categories = ['Semua', ...Array.from(new Set(albumList.map((a) => a.kategori)))];

  const filtered = albumList.filter((a) =>
    selectedKategori === 'Semua' ? true : a.kategori === selectedKategori
  );

  return (
    <div className="space-y-6">
      <PrintHeader
        judulDokumen="DOKUMENTASI & ALBUM KEGIATAN SEKOLAH"
        subJudul="SDN 1 GEMENGGENG, KECAMATAN PACE"
      />

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-emerald-600" />
            <span>Album & Galeri Dokumentasi Sekolah</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kumpulan momen berharga aktivitas pembelajaran dan prestasi di SDN 1 Gemenggeng
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              onClick={() => {
                setPreviewImage('');
                setFormData({
                  judul: '',
                  kategori: 'Karya Siswa',
                  tanggal: 'Oktober 2026',
                  deskripsi: '',
                  fotoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
                  jumlahFoto: 5
                });
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumentasi Foto</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Mode Pelihat
            </span>
          )}
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
        {categories.map((kat) => (
          <button
            key={kat}
            onClick={() => setSelectedKategori(kat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedKategori === kat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image preview with hover zoom */}
              <div
                onClick={() => setActiveLightbox(item)}
                className="relative h-48 w-full overflow-hidden bg-slate-100 cursor-pointer"
              >
                <img
                  src={item.fotoUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/70 text-white backdrop-blur-xs">
                    {item.kategori}
                  </span>
                </div>
                {item.jumlahFoto && item.jumlahFoto > 1 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                    <Layers className="w-3 h-3" />
                    <span>{item.jumlahFoto} Foto</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 font-bold text-xs backdrop-blur-2xs">
                  <Eye className="w-4 h-4" />
                  <span>Lihat Foto Penuh</span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.tanggal}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {item.judul}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            </div>

            {/* Footer with Delete (no-print) */}
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between no-print">
              <button
                onClick={() => setActiveLightbox(item)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Buka Detail &rarr;
              </button>
              {isAdmin && (
                <button
                  onClick={() => setAlbumToDelete(item)}
                  className="p-1 rounded-md text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Hapus Album"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Belum ada foto kegiatan di kategori {selectedKategori}.
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4"
          >
            <div className="relative max-h-[60vh] bg-black">
              <img
                src={activeLightbox.fotoUrl}
                alt={activeLightbox.judul}
                className="w-full h-full max-h-[60vh] object-contain mx-auto"
              />
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {activeLightbox.kategori}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeLightbox.tanggal}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeLightbox.judul}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeLightbox.deskripsi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Album Foto */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Tambah Dokumentasi Album Kegiatan
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Foto Dokumentasi Kegiatan
                </label>
                <div className="relative rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden h-44 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  {previewImage || formData.fotoUrl ? (
                    <img
                      src={previewImage || formData.fotoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">
                        Klik untuk unggah foto dari galeri
                      </p>
                    </div>
                  )}

                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 text-white font-bold text-xs transition-opacity">
                    <Camera className="w-4 h-4 mr-1.5" />
                    <span>Pilih / Ganti Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Album Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gelar Karya P5 dan Bazar Seni Siswa"
                  value={formData.judul || ''}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Upacara / Pramuka"
                    value={formData.kategori || ''}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 20 Oktober 2026"
                    value={formData.tanggal || ''}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Cerita Kegiatan
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan momen seru dan capaian siswa pada kegiatan ini..."
                  value={formData.deskripsi || ''}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  Simpan Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!albumToDelete}
        title="Hapus Album Dokumentasi"
        message={`Apakah Anda yakin ingin menghapus kegiatan "${albumToDelete?.judul}"?`}
        detail="Foto dan dokumentasi kegiatan ini akan dihapus dari album sekolah."
        confirmLabel="Ya, Hapus Album"
        cancelLabel="Batal"
        variant="danger"
        iconType="trash"
        onConfirm={() => {
          if (albumToDelete) {
            onDeleteAlbum(albumToDelete.id);
            setAlbumToDelete(null);
          }
        }}
        onCancel={() => setAlbumToDelete(null)}
      />
    </div>
  );
};
