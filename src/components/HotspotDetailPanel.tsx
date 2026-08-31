import React from 'react';
import { HotspotItem } from '../types';
import { Edit3, Navigation, X, CheckCircle, AlertTriangle, XCircle, ShieldCheck, UserCheck, Calendar, Info, Layers } from 'lucide-react';

interface HotspotDetailPanelProps {
  hotspot: HotspotItem | null;
  onClose: () => void;
  onEdit: (hotspot: HotspotItem) => void;
  onFocusCamera: (pos: [number, number, number]) => void;
  onOpenInventoryList?: () => void;
  totalHotspots?: number;
}

export const HotspotDetailPanel: React.FC<HotspotDetailPanelProps> = ({
  hotspot,
  onClose,
  onEdit,
  onFocusCamera,
  onOpenInventoryList,
  totalHotspots = 8,
}) => {
  if (!hotspot) {
    return (
      <aside
        id="panel-empty"
        aria-label="Ringkasan Fasilitas"
        className="w-[300px] sm:w-[320px] bg-white/80 backdrop-blur-xl border-l border-[#163832]/10 flex flex-col text-[#163832] shadow-2xl z-20 hidden md:flex shrink-0 select-none"
      >
        <div className="p-5 sm:p-6 border-b border-[#163832]/10 bg-white/40">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
              Pusat Informasi
            </span>
            <span className="text-[10px] bg-[#163832] text-white px-2 py-0.5 rounded font-mono font-bold">
              3D LIVE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#163832]">
            Masjid As-Safar
          </h2>
          <p className="text-xs text-[#163832]/70 mt-1 leading-relaxed">
            Klik salah satu marker titik emas pada denah 3D untuk melihat rincian fasilitas.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase opacity-50 mb-3 border-b border-[#163832]/10 pb-1">
              Statistik Fasilitas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 p-3 rounded-lg border border-[#163832]/10 shadow-xs">
                <p className="text-[10px] opacity-60 uppercase font-bold">Total Item</p>
                <p className="text-lg font-bold text-[#163832]">{totalHotspots} Fasilitas</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-[#163832]/10 shadow-xs">
                <p className="text-[10px] opacity-60 uppercase font-bold">Saf Jamaah</p>
                <p className="text-lg font-bold text-[#163832]">9 Saf Aktif</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-[#163832]/10 shadow-xs">
                <p className="text-[10px] opacity-60 uppercase font-bold">Pendingin</p>
                <p className="text-lg font-bold text-[#163832]">3 Unit AC</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-[#163832]/10 shadow-xs">
                <p className="text-[10px] opacity-60 uppercase font-bold">Tata Suara</p>
                <p className="text-lg font-bold text-[#163832]">4 Unit Toa</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase opacity-50 mb-3 border-b border-[#163832]/10 pb-1">
              Petunjuk Navigasi
            </h3>
            <ul className="space-y-2 text-xs text-[#163832]/80">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-[#C9A227] rounded-full shrink-0" />
                <span>Seret pointer untuk rotasi pandangan $360^\circ$.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-[#C9A227] rounded-full shrink-0" />
                <span>Scroll mouse untuk memperbesar (zoom in/out).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-[#C9A227] rounded-full shrink-0" />
                <span>Tombol <strong>Masuk ke Dalam</strong> untuk membuka atap & melihat interior aula.</span>
              </li>
            </ul>
          </div>
        </div>

        {onOpenInventoryList && (
          <div className="p-5 sm:p-6 bg-[#163832]/5 border-t border-[#163832]/10 space-y-2.5">
            <button
              onClick={onOpenInventoryList}
              className="w-full bg-[#163832] text-[#E8DCC0] font-bold py-2.5 rounded-lg hover:bg-[#0f2622] flex items-center justify-center gap-2 shadow-sm transition-colors text-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#C9A227]" />
              Buka Daftar Inventaris
            </button>
          </div>
        )}
      </aside>
    );
  }

  const getConditionBadge = (condition?: string) => {
    switch (condition) {
      case 'Baik':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300/60 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Baik & Terawat
          </span>
        );
      case 'Perlu Pengecekan':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-800 bg-amber-100 border border-amber-300/60 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Perlu Cek
          </span>
        );
      case 'Perlu Perbaikan':
      case 'Rusak':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-rose-800 bg-rose-100 border border-rose-300/60 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-rose-600" /> Perlu Perbaikan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-800 bg-amber-100 border border-amber-300/60 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-amber-600" /> Terdata
          </span>
        );
    }
  };

  return (
    <aside
      id="panel"
      aria-label="Detail Fasilitas Terpilih"
      className="absolute top-4 sm:top-0 right-4 sm:right-0 w-[calc(100vw-2rem)] sm:w-[320px] md:w-[340px] max-h-[calc(100vh-6rem)] sm:max-h-none sm:h-full bg-white/90 backdrop-blur-xl border border-[#163832]/10 sm:border-y-0 sm:border-r-0 sm:border-l sm:border-[#163832]/10 rounded-2xl sm:rounded-none flex flex-col text-[#163832] shadow-2xl z-30 transition-all duration-300 animate-in fade-in slide-in-from-right-4 shrink-0"
    >
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#163832]/10 bg-white/40">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
            Detail Fasilitas
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#163832] text-white px-2 py-0.5 rounded font-mono font-bold">
              ID: {hotspot.id.replace('hotspot-', 'AS-0')}
            </span>
            <button
              onClick={onClose}
              aria-label="Tutup panel"
              className="text-[#163832]/60 hover:text-[#163832] hover:bg-[#163832]/10 p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#163832] mt-1">
          {hotspot.title}
        </h2>
        <p className="text-xs text-[#163832]/70 mt-1">
          {hotspot.tag || 'Fasilitas Utama Masjid As-Safar'}
        </p>

        {/* Status Badge */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {getConditionBadge(hotspot.condition)}
          {hotspot.quantity && (
            <span className="text-[10px] bg-[#163832]/10 text-[#163832] border border-[#163832]/20 px-2 py-0.5 rounded font-semibold">
              Qty: {hotspot.quantity}
            </span>
          )}
        </div>
      </div>

      {/* Specifications Grid & Details */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
        <div>
          <h3 className="text-xs font-bold uppercase opacity-50 mb-3 border-b border-[#163832]/10 pb-1">
            Spesifikasi Utama
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {hotspot.rows.slice(0, 4).map(([label, value], idx) => (
              <div key={idx} className="bg-white/60 p-3 rounded-lg border border-[#163832]/10 shadow-xs">
                <p className="text-[10px] opacity-60 uppercase font-bold truncate">{label}</p>
                <p className="text-base font-bold text-[#163832] truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Properties if > 4 */}
        {hotspot.rows.length > 4 && (
          <div className="space-y-1.5 bg-white/40 p-3 rounded-lg border border-[#163832]/10 text-xs">
            {hotspot.rows.slice(4).map(([label, value], idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-[#163832]/5 text-[11.5px]">
                <span className="text-[#163832]/60">{label}</span>
                <span className="font-semibold text-[#163832]">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Inventory Notes */}
        <div>
          <h3 className="text-xs font-bold uppercase opacity-50 mb-3 border-b border-[#163832]/10 pb-1">
            Catatan Inventaris
          </h3>
          <ul className="space-y-2 text-xs text-[#163832]">
            {hotspot.note ? (
              <li className="flex items-start gap-2 bg-[#C9A227]/10 border border-[#C9A227]/30 p-2.5 rounded-lg">
                <span className="mt-1 w-1.5 h-1.5 bg-[#C9A227] rounded-full shrink-0" />
                <span className="text-[#163832] font-medium leading-relaxed">{hotspot.note}</span>
              </li>
            ) : (
              <li className="flex items-start gap-2 text-[#163832]/70 italic">
                <span className="mt-1.5 w-1.5 h-1.5 bg-[#C9A227] rounded-full shrink-0" />
                <span>Kondisi operasional normal dan terdata di DKM.</span>
              </li>
            )}
            {hotspot.pic && (
              <li className="flex items-center justify-between text-[11.5px] pt-1">
                <span className="text-[#163832]/60 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#C9A227]" /> PIC DKM:
                </span>
                <span className="font-bold text-[#163832]">{hotspot.pic}</span>
              </li>
            )}
            {hotspot.lastInspection && (
              <li className="flex items-center justify-between text-[11.5px]">
                <span className="text-[#163832]/60 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A227]" /> Terakhir Cek:
                </span>
                <span className="font-bold text-[#163832]">{hotspot.lastInspection}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 sm:p-6 bg-[#163832]/5 border-t border-[#163832]/10 space-y-2.5">
        <button
          onClick={() => onEdit(hotspot)}
          className="w-full bg-[#163832] text-[#E8DCC0] font-bold py-2.5 rounded-lg hover:bg-[#0f2622] flex items-center justify-center gap-2 shadow-sm transition-colors text-xs cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#C9A227]" />
          Edit Data Fasilitas
        </button>
        <button
          onClick={() => onFocusCamera(hotspot.pos)}
          className="w-full border border-[#163832] text-[#163832] font-bold py-2.5 rounded-lg hover:bg-white/50 flex items-center justify-center gap-2 transition-colors text-xs cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          Fokus Kamera 3D
        </button>
      </div>
    </aside>
  );
};

