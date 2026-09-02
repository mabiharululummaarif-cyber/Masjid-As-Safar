import React, { useState } from 'react';
import { MosqueConfig, CameraPreset } from '../types';
import { 
  Sun, Moon, Sunset,
  RotateCw, SlidersHorizontal, 
  ArrowLeftRight, X, RotateCcw
} from 'lucide-react';

interface ControlOverlayProps {
  isInterior: boolean;
  onToggleInterior: () => void;
  config: MosqueConfig;
  onUpdateConfig: (cfg: Partial<MosqueConfig>) => void;
  onCycleTimeOfDay: () => void;
  onResetView: () => void;
  onSelectPreset: (preset: CameraPreset) => void;
  onToggleQibla?: () => void;
  onOrientQibla?: () => void;
  onOpenArchSettings: () => void;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  isInterior,
  onToggleInterior,
  config,
  onUpdateConfig,
  onCycleTimeOfDay,
  onResetView,
  onSelectPreset,
  onToggleQibla,
  onOrientQibla,
  onOpenArchSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Discreet Minimalist Trigger Button (Hanya 1 tombol kecil transparan di sudut layar) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          title="Menu Pengaturan Tampilan 3D"
          className="w-11 h-11 rounded-full bg-[#163832]/80 backdrop-blur-md hover:bg-[#163832] text-[#E8DCC0] hover:text-[#C9A227] border border-[#C9A227]/40 shadow-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5 text-[#FFEAA7]" /> : <SlidersHorizontal className="w-5 h-5 text-[#C9A227]" />}
        </button>
      </div>

      {/* Floating Modal / Bottom Sheet (HANYA MUNCUL KETIKA DIKLIK) */}
      {isOpen && (
        <div className="absolute inset-x-3 bottom-18 sm:bottom-auto sm:top-4 sm:right-4 sm:left-auto sm:w-[320px] max-h-[85vh] overflow-y-auto bg-[#163832]/95 backdrop-blur-xl border border-[#C9A227]/40 rounded-2xl shadow-2xl p-4 text-[#E8DCC0] z-30 pointer-events-auto space-y-3.5 animate-in fade-in slide-in-from-bottom-3 sm:slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#C9A227]/25 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🕌</span>
              <h3 className="font-bold text-sm text-[#F7F3E8]">Kontrol Tampilan 3D</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#E8DCC0]/70 hover:text-[#FFEAA7] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Interior / Eksterior */}
          <button
            onClick={() => {
              onToggleInterior();
            }}
            className="w-full bg-[#0f2a25] hover:bg-[#1f4840] text-white px-3.5 py-2.5 rounded-xl border border-[#C9A227]/40 flex items-center justify-between font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{isInterior ? '🏛️' : '🕌'}</span>
              <span>{isInterior ? 'Beralih ke Tampak Luar' : 'Beralih ke Interior Dalam'}</span>
            </div>
            <ArrowLeftRight className="w-4 h-4 text-[#C9A227]" />
          </button>

          {/* Preset Sudut Pandang */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFEAA7] block">
              Pilihan Sudut Kamera:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
              <button
                onClick={() => onSelectPreset('exterior')}
                className="py-1.5 px-2 bg-[#0f2a25] hover:bg-[#C9A227] hover:text-[#163832] rounded-lg border border-[#C9A227]/20 transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>🏛️</span> Tampak Luar
              </button>
              <button
                onClick={() => onSelectPreset('mihrab')}
                className="py-1.5 px-2 bg-[#0f2a25] hover:bg-[#C9A227] hover:text-[#163832] rounded-lg border border-[#C9A227]/20 transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>🕋</span> Area Mihrab
              </button>
              <button
                onClick={() => onSelectPreset('backDoor')}
                className="py-1.5 px-2 bg-[#0f2a25] hover:bg-[#C9A227] hover:text-[#163832] rounded-lg border border-[#C9A227]/20 transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>🚪</span> Pintu Belakang
              </button>
              <button
                onClick={() => onSelectPreset('topView')}
                className="py-1.5 px-2 bg-[#0f2a25] hover:bg-[#C9A227] hover:text-[#163832] rounded-lg border border-[#C9A227]/20 transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>🕊️</span> Denah Atas
              </button>
            </div>
          </div>

          {/* Mode Atap (Solid / Transparan / Buka) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFEAA7] block">
              Mode Struktur Atap:
            </span>
            <div className="grid grid-cols-3 gap-1 bg-[#0f2a25] p-1 rounded-lg border border-[#C9A227]/20 text-[11px] font-medium">
              <button
                onClick={() => onUpdateConfig({ roofMode: 'solid' })}
                className={`py-1 rounded text-center transition-all cursor-pointer ${
                  config.roofMode === 'solid'
                    ? 'bg-[#C9A227] text-[#163832] font-bold shadow-xs'
                    : 'text-[#E8DCC0]/80 hover:text-[#E8DCC0]'
                }`}
              >
                Utuh
              </button>
              <button
                onClick={() => onUpdateConfig({ roofMode: 'transparent' })}
                className={`py-1 rounded text-center transition-all cursor-pointer ${
                  config.roofMode === 'transparent'
                    ? 'bg-[#C9A227] text-[#163832] font-bold shadow-xs'
                    : 'text-[#E8DCC0]/80 hover:text-[#E8DCC0]'
                }`}
              >
                Transparan
              </button>
              <button
                onClick={() => onUpdateConfig({ roofMode: 'hidden' })}
                className={`py-1 rounded text-center transition-all cursor-pointer ${
                  config.roofMode === 'hidden'
                    ? 'bg-[#C9A227] text-[#163832] font-bold shadow-xs'
                    : 'text-[#E8DCC0]/80 hover:text-[#E8DCC0]'
                }`}
              >
                Buka
              </button>
            </div>
          </div>

          {/* Pencahayaan Waktu & Auto Rotate */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onCycleTimeOfDay}
              className="py-2 px-2.5 rounded-xl bg-[#0f2a25] hover:bg-[#1f4840] border border-[#C9A227]/25 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              {config.timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-[#C9A227]" />}
              {config.timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-[#e0833a]" />}
              {config.timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-[#6eb5ee]" />}
              <span className="capitalize">{config.timeOfDay === 'day' ? 'Siang' : config.timeOfDay === 'sunset' ? 'Senja' : 'Malam'}</span>
            </button>

            <button
              onClick={() => onUpdateConfig({ autoRotate: !config.autoRotate })}
              className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                config.autoRotate 
                  ? 'bg-[#C9A227] text-[#163832] border-[#C9A227] font-bold' 
                  : 'bg-[#0f2a25] text-[#E8DCC0] border-[#C9A227]/25 hover:bg-[#1f4840]'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${config.autoRotate ? 'animate-spin' : ''}`} />
              <span>{config.autoRotate ? 'Putar Aktif' : 'Putar Diam'}</span>
            </button>
          </div>

          {/* Reset View */}
          <button
            onClick={() => {
              onResetView();
              setIsOpen(false);
            }}
            className="w-full py-2 bg-[#C9A227]/15 hover:bg-[#C9A227] text-[#FFEAA7] hover:text-[#163832] border border-[#C9A227]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Posisi Kamera</span>
          </button>
        </div>
      )}
    </>
  );
};



