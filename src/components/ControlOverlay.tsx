import React from 'react';
import { MosqueConfig } from '../types';
import { 
  ListTree, Sliders, Plus, Download, Sun, Moon, Sunset, 
  RotateCcw, Compass, Layers, Eye, RefreshCw, ZoomIn
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
  totalHotspots: number;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  isInterior,
  onToggleInterior,
  config,
  onOpenInventoryList,
  onOpenSafSettings,
  onOpenAddNew,
  onOpenExportImport,
  onCycleTimeOfDay,
  onResetView,
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

        {/* Camera Control HUD Widget */}
        <div className="p-3 bg-white/75 backdrop-blur-md border border-[#163832]/10 rounded-xl shadow-sm text-[#163832]">
          <p className="text-[10px] font-bold uppercase opacity-60 mb-2 text-[#163832]">
            Kamera Kontrol
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
      <div className="absolute bottom-5 left-5 flex flex-wrap gap-3 pointer-events-none z-10">
        <div className="bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#163832]/15 flex items-center gap-2 text-[11px] text-[#163832] font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Renderer: Three.js WebGL</span>
        </div>
        <div className="bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#163832]/15 flex items-center gap-2 text-[11px] text-[#163832] font-semibold shadow-sm hidden sm:flex">
          <span className="font-bold opacity-60">Pencahayaan:</span>
          <span className="capitalize">{config.timeOfDay === 'day' ? 'Siang' : config.timeOfDay === 'sunset' ? 'Senja' : 'Malam'}</span>
        </div>
      </div>
    </>
  );
};

