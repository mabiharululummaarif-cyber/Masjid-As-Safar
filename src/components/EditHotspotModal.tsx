import React, { useState, useEffect } from 'react';
import { HotspotItem, FacilityCategory, ItemCondition } from '../types';
import { X, Plus, Trash2, MapPin, Save, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface EditHotspotModalProps {
  isOpen: boolean;
  hotspot: HotspotItem | null;
  onClose: () => void;
  onSave: (updated: HotspotItem) => void;
  onDelete?: (id: string) => void;
  onRequestPickCoordinates?: () => void;
  currentPickedCoords?: [number, number, number] | null;
}

export const EditHotspotModal: React.FC<EditHotspotModalProps> = ({
  isOpen,
  hotspot,
  onClose,
  onSave,
  onDelete,
  onRequestPickCoordinates,
  currentPickedCoords,
}) => {
  const [formData, setFormData] = useState<HotspotItem>({
    id: '',
    pos: [0, 1, 0],
    tag: 'Fasilitas',
    title: '',
    category: 'other',
    rows: [['Jumlah', '1 Unit']],
    interiorOnly: true,
    condition: 'Baik',
    note: '',
    pic: 'Pengurus DKM',
    quantity: '1 Unit',
    lastInspection: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (hotspot) {
      setFormData(JSON.parse(JSON.stringify(hotspot)));
    } else {
      setFormData({
        id: 'fasilitas-' + Date.now(),
        pos: currentPickedCoords || [0, 0.5, 0],
        tag: 'Fasilitas Baru',
        title: '',
        category: 'other',
        rows: [
          ['Jumlah', '1 Unit'],
          ['Letak', 'Aula Utama'],
          ['Kondisi', 'Baik'],
        ],
        interiorOnly: true,
        condition: 'Baik',
        note: '',
        pic: 'Pengurus DKM',
        quantity: '1 Unit',
        lastInspection: new Date().toISOString().split('T')[0],
      });
    }
  }, [hotspot, isOpen]);

  useEffect(() => {
    if (currentPickedCoords) {
      setFormData(prev => ({ ...prev, pos: currentPickedCoords }));
    }
  }, [currentPickedCoords]);

  if (!isOpen) return null;

  const handleRowChange = (index: number, field: 0 | 1, value: string) => {
    const newRows = [...formData.rows];
    newRows[index][field] = value;
    setFormData({ ...formData, rows: newRows });
  };

  const handleAddRow = () => {
    setFormData({
      ...formData,
      rows: [...formData.rows, ['Properti', 'Nilai']],
    });
  };

  const handleRemoveRow = (index: number) => {
    const newRows = formData.rows.filter((_, i) => i !== index);
    setFormData({ ...formData, rows: newRows });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Mohon isi nama/judul fasilitas');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f2a25] border border-[#C9A227]/40 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-[#F7F3E8]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#C9A227]/20 flex items-center justify-between bg-[#163832]/80">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C9A227]" />
            <h3 className="font-serif-islamic text-lg font-bold text-[#F7F3E8]">
              {hotspot ? 'Edit Data Fasilitas' : 'Tambah Fasilitas Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5 rounded-lg hover:bg-[#163832] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Title & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
                Nama / Judul Fasilitas *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Karpet Saf Depan, AC Inverter, Mimbar..."
                className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-3 py-2 text-[#F7F3E8] focus:outline-none focus:border-[#C9A227] text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
                Tag / Label Singkat
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={e => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Misal: Audio, Karpet"
                className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-3 py-2 text-[#F7F3E8] focus:outline-none focus:border-[#C9A227] text-xs font-medium"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as FacilityCategory })}
                className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-3 py-2 text-[#F7F3E8] focus:outline-none focus:border-[#C9A227] text-xs"
              >
                <option value="mihrab">Mihrab & Mimbar</option>
                <option value="carpet">Karpet & Saf</option>
                <option value="audio">Tata Suara / Audio</option>
                <option value="cooling">Tata Udara / AC</option>
                <option value="access">Akses & Pintu</option>
                <option value="structure">Struktur Bangunan</option>
                <option value="furniture">Perlengkapan & Furnitur</option>
                <option value="sanitation">Sanitasi & Wudhu</option>
                <option value="other">Lainnya / Elektronik</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
                Kondisi Fasilitas
              </label>
              <select
                value={formData.condition || 'Baik'}
                onChange={e => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
                className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-3 py-2 text-[#F7F3E8] focus:outline-none focus:border-[#C9A227] text-xs font-medium"
              >
                <option value="Baik">🟢 Baik & Terawat</option>
                <option value="Perlu Pengecekan">🟡 Perlu Pengecekan</option>
                <option value="Perlu Perbaikan">🟠 Perlu Perbaikan</option>
                <option value="Rusak">🔴 Rusak / Perlu Ganti</option>
              </select>
            </div>
          </div>

          {/* 3D Coordinates */}
          <div className="p-3 bg-[#163832]/60 rounded-xl border border-[#E8DCC0]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#C9A227] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Posisi Koordinat 3D [X, Y, Z]
              </span>
              {onRequestPickCoordinates && (
                <button
                  type="button"
                  onClick={onRequestPickCoordinates}
                  className="px-2.5 py-1 bg-[#C9A227]/20 hover:bg-[#C9A227]/30 text-[#C9A227] border border-[#C9A227]/40 rounded text-[10px] font-bold cursor-pointer transition-colors"
                >
                  📍 Tentukan Lewat Klik 3D
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#E8DCC0]/60">X (Kiri-Kanan):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pos[0]}
                  onChange={e => setFormData({
                    ...formData,
                    pos: [parseFloat(e.target.value) || 0, formData.pos[1], formData.pos[2]],
                  })}
                  className="w-full bg-[#0f2a25] border border-[#E8DCC0]/20 rounded px-2 py-1 text-center text-xs text-[#F7F3E8]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#E8DCC0]/60">Y (Tinggi):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pos[1]}
                  onChange={e => setFormData({
                    ...formData,
                    pos: [formData.pos[0], parseFloat(e.target.value) || 0, formData.pos[2]],
                  })}
                  className="w-full bg-[#0f2a25] border border-[#E8DCC0]/20 rounded px-2 py-1 text-center text-xs text-[#F7F3E8]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#E8DCC0]/60">Z (Depan-Belakang):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pos[2]}
                  onChange={e => setFormData({
                    ...formData,
                    pos: [formData.pos[0], formData.pos[1], parseFloat(e.target.value) || 0],
                  })}
                  className="w-full bg-[#0f2a25] border border-[#E8DCC0]/20 rounded px-2 py-1 text-center text-xs text-[#F7F3E8]"
                />
              </div>
            </div>
          </div>

          {/* Key-Value Detail Rows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#E8DCC0]/80">
                Spesifikasi & Rincian Fasilitas
              </label>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 text-[10px] font-bold text-[#C9A227] hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Baris
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {formData.rows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row[0]}
                    onChange={e => handleRowChange(idx, 0, e.target.value)}
                    placeholder="Nama Properti"
                    className="w-1/3 bg-[#163832] border border-[#E8DCC0]/20 rounded px-2.5 py-1.5 text-xs text-[#F7F3E8]"
                  />
                  <input
                    type="text"
                    value={row[1]}
                    onChange={e => handleRowChange(idx, 1, e.target.value)}
                    placeholder="Keterangan / Nilai"
                    className="flex-1 bg-[#163832] border border-[#E8DCC0]/20 rounded px-2.5 py-1.5 text-xs text-[#F7F3E8]"
                  />
                  {formData.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PIC & Last Inspection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
                PIC / Penanggung Jawab
              </label>
              <input
                type="text"
                value={formData.pic || ''}
                onChange={e => setFormData({ ...formData, pic: e.target.value })}
                placeholder="Misal: Divisi Sarana DKM"
                className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-3 py-2 text-[#F7F3E8] text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
                Tanggal Terakhir Cek
              </label>
              <input
                type="date"
                value={formData.lastInspection || ''}
                onChange={e => setFormData({ ...formData, lastInspection: e.target.value })}
                className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-3 py-2 text-[#F7F3E8] text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#E8DCC0]/80">
              Catatan Khusus / Informasi Tambahan
            </label>
            <textarea
              rows={2}
              value={formData.note || ''}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              placeholder="Catatan perawatan, riwayat perbaikan, atau catatan konfirmasi..."
              className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-3 py-2 text-[#F7F3E8] text-xs"
            />
          </div>

          {/* Interior Only toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="interiorOnlyCheck"
              checked={formData.interiorOnly}
              onChange={e => setFormData({ ...formData, interiorOnly: e.target.checked })}
              className="rounded accent-[#C9A227] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="interiorOnlyCheck" className="text-xs text-[#E8DCC0] cursor-pointer">
              Tampilkan hanya saat mode interior (di dalam aula)
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#C9A227]/20 flex items-center justify-between bg-[#163832]/80">
          {hotspot && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Hapus fasilitas "${hotspot.title}"?`)) {
                  onDelete(hotspot.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#163832] hover:bg-[#2F6B4F] text-[#E8DCC0] border border-[#E8DCC0]/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#C9A227] hover:bg-[#dbb334] text-[#1B2420] rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
