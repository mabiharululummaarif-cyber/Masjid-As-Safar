import React, { useState } from 'react';
import { HotspotItem, FacilityCategory } from '../types';
import { 
  X, Search, Plus, Filter, Eye, Edit3, ShieldCheck, AlertTriangle, 
  Layers, ChevronRight, CheckCircle2, Navigation
} from 'lucide-react';

interface FacilityListDrawerProps {
  isOpen: boolean;
  hotspots: HotspotItem[];
  selectedHotspotId: string | null;
  onClose: () => void;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  onAddNew: () => void;
  onEdit: (hotspot: HotspotItem) => void;
}

export const FacilityListDrawer: React.FC<FacilityListDrawerProps> = ({
  isOpen,
  hotspots,
  selectedHotspotId,
  onClose,
  onSelectHotspot,
  onAddNew,
  onEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = hotspots.filter(h => {
    const matchesSearch = 
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.note && h.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      h.rows.some(r => r[0].toLowerCase().includes(searchQuery.toLowerCase()) || r[1].toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const totalCount = hotspots.length;
  const goodCount = hotspots.filter(h => !h.condition || h.condition === 'Baik').length;
  const checkCount = hotspots.filter(h => h.condition === 'Perlu Pengecekan' || h.condition === 'Perlu Perbaikan').length;

  return (
    <div className="fixed inset-0 z-40 flex bg-black/60 backdrop-blur-xs animate-in fade-in">
      <aside 
        aria-label="Daftar Inventaris Fasilitas Masjid"
        className="w-full sm:w-96 h-full bg-[#0f2a25] border-r border-[#C9A227]/30 shadow-2xl flex flex-col text-[#F7F3E8] animate-in slide-in-from-left duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#C9A227]/20 bg-[#163832]/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#C9A227] uppercase block">
              Manajemen DKM
            </span>
            <h2 className="font-serif-islamic text-lg font-bold text-[#F7F3E8]">
              Daftar Inventaris Fasilitas
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup daftar inventaris"
            className="text-[#F7F3E8]/60 hover:text-[#F7F3E8] p-1.5 rounded-lg hover:bg-[#163832] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-4 py-2.5 bg-[#163832]/60 border-b border-[#E8DCC0]/10 flex items-center justify-around text-center text-xs">
          <div>
            <div className="font-serif-islamic text-base font-bold text-[#C9A227]">{totalCount}</div>
            <div className="text-[10px] text-[#E8DCC0]/60">Total Item</div>
          </div>
          <div className="h-6 w-px bg-[#E8DCC0]/15" />
          <div>
            <div className="font-serif-islamic text-base font-bold text-emerald-400">{goodCount}</div>
            <div className="text-[10px] text-[#E8DCC0]/60">Kondisi Baik</div>
          </div>
          <div className="h-6 w-px bg-[#E8DCC0]/15" />
          <div>
            <div className="font-serif-islamic text-base font-bold text-amber-400">{checkCount}</div>
            <div className="text-[10px] text-[#E8DCC0]/60">Perlu Cek</div>
          </div>
        </div>

        {/* Search & Action Toolbar */}
        <div className="p-3 border-b border-[#E8DCC0]/10 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#E8DCC0]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari fasilitas, saf, audio, AC, mimbar..."
              className="w-full bg-[#163832] border border-[#E8DCC0]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F7F3E8] focus:outline-none focus:border-[#C9A227] placeholder-[#E8DCC0]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#E8DCC0]/50 hover:text-[#F7F3E8]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="flex-1 bg-[#163832] border border-[#E8DCC0]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#E8DCC0] focus:outline-none focus:border-[#C9A227]"
            >
              <option value="all">Semua Kategori</option>
              <option value="mihrab">Mihrab & Mimbar</option>
              <option value="carpet">Karpet & Saf</option>
              <option value="audio">Audio & Speaker</option>
              <option value="cooling">AC & Pendingin</option>
              <option value="access">Pintu & Akses</option>
              <option value="structure">Struktur Bangunan</option>
              <option value="furniture">Perlengkapan & Furnitur</option>
              <option value="other">Lainnya / Display</option>
            </select>

            <button
              onClick={onAddNew}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#C9A227] hover:bg-[#dbb334] text-[#1B2420] rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
        </div>

        {/* Hotspots List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#E8DCC0]/50 text-xs">
              Tidak ada fasilitas yang sesuai pencarian.
            </div>
          ) : (
            filtered.map(h => {
              const isSelected = selectedHotspotId === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => onSelectHotspot(h)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-[#163832] border-[#C9A227] shadow-md'
                      : 'bg-[#163832]/50 border-[#E8DCC0]/15 hover:bg-[#163832]/80 hover:border-[#E8DCC0]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#C9A227]">
                        {h.tag}
                      </span>
                      <h4 className="font-semibold text-sm text-[#F7F3E8] leading-tight mt-0.5">
                        {h.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        title="Edit data fasilitas"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(h);
                        }}
                        className="text-[#E8DCC0]/60 hover:text-[#C9A227] p-1 rounded hover:bg-[#0f2a25] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#C9A227] translate-x-0.5' : 'text-[#E8DCC0]/30'}`} />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#E8DCC0]/70">
                    <span className="bg-[#0f2a25] px-2 py-0.5 rounded text-[10px] border border-[#E8DCC0]/10">
                      {h.rows[0] ? `${h.rows[0][0]}: ${h.rows[0][1]}` : 'Terdata'}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      h.condition === 'Baik' || !h.condition
                        ? 'text-emerald-300 bg-emerald-950/60'
                        : 'text-amber-300 bg-amber-950/60'
                    }`}>
                      {h.condition || 'Baik'}
                    </span>
                  </div>

                  {h.note && (
                    <p className="mt-1.5 text-[10.5px] text-[#e0b84a]/90 line-clamp-1 italic">
                      {h.note}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#C9A227]/20 bg-[#163832]/80 text-[11px] text-[#E8DCC0]/60 text-center">
          Klik fasilitas untuk sorot & fokus posisi 3D di masjid
        </div>
      </aside>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
