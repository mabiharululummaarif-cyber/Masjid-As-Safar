import React from 'react';
import { MosqueConfig } from '../types';
import { 
  ListTree, Sliders, Plus, Sun, Moon, Sunset, 
  Compass, Navigation, Eye, EyeOff
} from 'lucide-react';

interface ControlOverlayProps {
  isInterior: boolean;
  onToggleInterior: () => void;
  config: MosqueConfig;
  onOpenInventoryList: () => void;
  onOpenSafSettings: () => void;
  onOpenAddNew: () => void;
  onOpenExportImport: () => void;
  onCycleTimeOfDay: () => void;
  onResetView: () => void;
  onToggleQibla?: () => void;
  onOrientQibla?: () => void;
  totalHotspots: number;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  isInterior,
  onToggleInterior,
  config,
  onOpenInventoryList,
  onOpenSafSettings,
  onOpenAddNew,
  onCycleTimeOfDay,
  onResetView,
  onToggleQibla,
  onOrientQibla,
  totalHotspots,
}) => {
  return (
    <>
      {/* Top Left Floating Camera & Mode Controls */}
      <div className="absolute top-5 left-5 flex flex-col gap-3 z-20 pointer-events-auto">
        {/* Toggle Interior / Exterior Button */}
        <button
          id="toggleBtn"
          onClick={onToggleInterior}
          className="bg-[#163832] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 hover:bg-[#1d4a42] border border-[#C9A227]/30 transition-all font-semibold text-xs active:scale-95 cursor-pointer"
        >
          <div className="w-3 h-3 bg-[#C9A227] rounded-xs shrink-0" />
          <span>{isInterior ? 'Keluar (Tampak Luar)' : 'Masuk ke Dalam'}</span>
        </button>

        {/* Camera & Lighting Control HUD Widget */}
        <div className="p-3 bg-white/80 backdrop-blur-md border border-[#163832]/10 rounded-xl shadow-sm text-[#163832]">
          <p className="text-[10px] font-bold uppercase opacity-60 mb-2 text-[#163832]">
            Kamera & Suasana
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onResetView}
              title="Reset Sudut Pandang"
              className="w-8 h-8 rounded-lg border border-[#163832]/20 bg-white/50 hover:bg-[#163832] hover:text-[#E8DCC0] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            >
              R
            </button>
            <button
              onClick={onCycleTimeOfDay}
              title="Ganti Waktu Pencahayaan (Siang / Senja / Malam)"
              className="w-8 h-8 rounded-lg border border-[#163832]/20 bg-white/50 hover:bg-[#163832] hover:text-[#C9A227] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            >
              {config.timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-[#C9A227]" />}
              {config.timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-[#e0833a]" />}
              {config.timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-[#3b729e]" />}
            </button>
            <button
              onClick={onOpenSafSettings}
              title="Pengaturan Saf & Fasilitas"
              className="w-8 h-8 rounded-lg border border-[#163832]/20 bg-white/50 hover:bg-[#163832] hover:text-[#C9A227] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Floating Mini Compass & Qibla HUD Widget */}
        <div className="p-3 bg-[#163832]/90 backdrop-blur-md border border-[#C9A227]/40 rounded-xl shadow-lg text-[#F7F3E8] space-y-2.5 max-w-[210px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#C9A227] animate-spin-slow" />
              <span className="text-[11px] font-bold text-[#FFEAA7] tracking-wide">KOMPAS & KIBLAT</span>
            </div>
            {onToggleQibla && (
              <button
                onClick={onToggleQibla}
                title={config.showQibla ? "Sembunyikan Penanda Kompas & Kiblat" : "Tampilkan Penanda Kompas & Kiblat"}
                className={`p-1 rounded-md transition-colors cursor-pointer text-xs ${
                  config.showQibla 
                    ? 'bg-[#C9A227] text-[#163832]' 
                    : 'bg-[#0f2a25] text-[#E8DCC0]/60 hover:text-[#E8DCC0]'
                }`}
              >
                {config.showQibla ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Compass Dial Visual Indicator */}
          <div className="relative w-full h-24 bg-[#0f2a25] rounded-lg border border-[#C9A227]/25 flex items-center justify-center overflow-hidden">
            {/* Outer Circular Grid */}
            <div className="absolute inset-2 rounded-full border border-dashed border-[#E8DCC0]/20" />
            <div className="absolute inset-5 rounded-full border border-[#C9A227]/30" />

            {/* Cardinal Direction Points */}
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#E8DCC0]/80">
              U (North)
            </span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#E8DCC0]/80">
              S (South)
            </span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#E8DCC0]/80">
              T (East)
            </span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#E8DCC0]/80">
              B (West)
            </span>

            {/* Center Qibla Needle (Bold Glowing Gold pointing to 295° Barat Laut / Kiblat) */}
            <div className="relative flex flex-col items-center justify-center z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C9A227] shadow-[0_0_8px_#C9A227] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#163832]" />
              </div>
              <div className="flex items-center gap-1 mt-1 bg-[#163832]/90 px-2 py-0.5 rounded border border-[#C9A227]/50 shadow-sm">
                <span className="text-[10px]">🕋</span>
                <span className="text-[10px] font-bold text-[#FFEAA7]">295° Kiblat</span>
              </div>
            </div>
          </div>

          {/* Orient to Qibla Action Button */}
          {onOrientQibla && (
            <button
              onClick={onOrientQibla}
              className="w-full py-1.5 px-2 bg-[#C9A227]/15 hover:bg-[#C9A227] text-[#FFEAA7] hover:text-[#163832] border border-[#C9A227]/50 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Navigation className="w-3 h-3 rotate-45" />
              <span>Arahkan Pandangan ke Kiblat</span>
            </button>
          )}
        </div>

        {/* Mobile Quick Action Buttons (Hidden on desktop because Header has them) */}
        <div className="flex md:hidden flex-wrap items-center gap-1.5">
          <button
            onClick={onOpenInventoryList}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#163832] text-[#E8DCC0] border border-[#C9A227]/40 text-xs font-bold shadow-md cursor-pointer"
          >
            <ListTree className="w-3 h-3 text-[#C9A227]" />
            Inventaris ({totalHotspots})
          </button>
          <button
            onClick={onOpenAddNew}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C9A227] text-[#163832] text-xs font-bold shadow-md cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Tambah
          </button>
        </div>
      </div>

      {/* Bottom Left Status Pills */}
      <div className="absolute bottom-5 left-5 flex flex-wrap gap-2.5 pointer-events-none z-10">
        <div className="bg-[#163832]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C9A227]/30 flex items-center gap-2 text-[11px] text-[#F7F3E8] font-semibold shadow-sm">
          <span className="text-xs">🕋</span>
          <span>Arah Kiblat: <strong className="text-[#FFEAA7]">295° (Barat Laut / Mimbar Depan)</strong></span>
        </div>
        <div className="bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#163832]/15 flex items-center gap-2 text-[11px] text-[#163832] font-semibold shadow-sm hidden sm:flex">
          <span className="font-bold opacity-60">Kompas 3D:</span>
          <span className="font-bold text-[#163832]">{config.showQibla ? 'Aktif (Luar & Dalam)' : 'Non-aktif'}</span>
        </div>
      </div>
    </>
  );
};


