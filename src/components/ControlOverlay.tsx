import React, { useState } from 'react';
import { MosqueConfig, CameraPreset } from '../types';
import { 
  Sun, Moon, Sunset,
  RotateCw, SlidersHorizontal, 
  X, RotateCcw, Eye, Layers
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
  onOpenArchSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Active view mode helper
  const isCutaway = !isInterior && config.roofMode === 'hidden';

  const handleSetExterior = () => {
    onUpdateConfig({ roofMode: 'solid' });
    if (isInterior) {
      onToggleInterior();
    }
    onSelectPreset('exterior');
  };

  const handleSetInterior = () => {
    if (!isInterior) {
      onToggleInterior();
    }
    onSelectPreset('interior');
  };

  const handleSetCutaway = () => {
    if (isInterior) {
      onToggleInterior();
    }
    onUpdateConfig({ roofMode: 'hidden' });
    onSelectPreset('topView');
  };

  return (
    <>
      {/* 1. TOP FLOATING PRIMARY VIEW SELECTOR (Selalu Muncul di Atas - Sangat Mudah Diakses) */}
      <div className="absolute top-3 inset-x-0 z-20 flex flex-col items-center pointer-events-none px-3 gap-1.5">
        {/* Main Segmented Pill */}
        <div className="pointer-events-auto flex items-center bg-[#1B4332]/90 backdrop-blur-md p-1 rounded-2xl border border-[#40916C]/40 shadow-xl gap-1">
          <button
            onClick={handleSetExterior}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isInterior && config.roofMode !== 'hidden'
                ? 'bg-white text-[#1B4332] shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏛️</span>
            <span>Tampak Luar</span>
          </button>

          <button
            onClick={handleSetInterior}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isInterior
                ? 'bg-white text-[#1B4332] shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🕌</span>
            <span>Tampak Dalam</span>
          </button>

          <button
            onClick={handleSetCutaway}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCutaway
                ? 'bg-white text-[#1B4332] shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>✂️</span>
            <span>Buka Atap</span>
          </button>
        </div>

        {/* Quick Spot Pill according to Mode */}
        {isInterior ? (
          <div className="pointer-events-auto flex items-center bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-gray-200 shadow-lg gap-1 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-[10px] font-bold text-[#1B4332] px-1.5">Area Dalam:</span>
            <button
              onClick={() => onSelectPreset('mihrab')}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B4332]/10 hover:bg-[#1B4332] hover:text-white text-[#1B4332] transition-colors cursor-pointer"
            >
              🕋 Mihrab & Mimbar
            </button>
            <button
              onClick={() => onSelectPreset('interior')}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B4332]/10 hover:bg-[#1B4332] hover:text-white text-[#1B4332] transition-colors cursor-pointer"
            >
              👥 Ruang Utama
            </button>
            <button
              onClick={() => onSelectPreset('backDoor')}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B4332]/10 hover:bg-[#1B4332] hover:text-white text-[#1B4332] transition-colors cursor-pointer"
            >
              🚪 Pintu Belakang
            </button>
          </div>
        ) : (
          <div className="pointer-events-auto flex items-center bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-gray-200 shadow-lg gap-1 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-[10px] font-bold text-[#1B4332] px-1.5">Sudut Pandang:</span>
            <button
              onClick={() => onSelectPreset('exterior')}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B4332]/10 hover:bg-[#1B4332] hover:text-white text-[#1B4332] transition-colors cursor-pointer"
            >
              🏛️ Keseluruhan
            </button>
            <button
              onClick={() => onSelectPreset('topView')}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B4332]/10 hover:bg-[#1B4332] hover:text-white text-[#1B4332] transition-colors cursor-pointer"
            >
              🕊️ Denah Atas
            </button>
          </div>
        )}
      </div>

      {/* 2. Floating Action Button (Kanan Bawah untuk Pengaturan Lengkap) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex items-center gap-2">
        <button
          onClick={onCycleTimeOfDay}
          title="Ubah Waktu Siang / Senja / Malam"
          className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#1B4332] border border-gray-200 shadow-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
        >
          {config.timeOfDay === 'day' && <Sun className="w-5 h-5 text-amber-500" />}
          {config.timeOfDay === 'sunset' && <Sunset className="w-5 h-5 text-orange-500" />}
          {config.timeOfDay === 'night' && <Moon className="w-5 h-5 text-indigo-500" />}
        </button>

        <button
          onClick={() => setIsOpen(prev => !prev)}
          title="Menu Pengaturan Tampilan 3D"
          className="w-11 h-11 rounded-full bg-[#1B4332] hover:bg-[#153427] text-white border border-[#40916C]/50 shadow-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5 text-amber-300" /> : <SlidersHorizontal className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* 3. Floating Modal Detail (Jika Membuka Menu Pengaturan) */}
      {isOpen && (
        <div className="absolute inset-x-3 bottom-18 sm:bottom-auto sm:top-18 sm:right-4 sm:left-auto sm:w-[320px] max-h-[80vh] overflow-y-auto bg-white/98 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-4 text-[#1B4332] z-30 pointer-events-auto space-y-3.5 animate-in fade-in slide-in-from-bottom-3 sm:slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🕌</span>
              <h3 className="font-bold text-sm text-[#1B4332]">Pengaturan Tampilan</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Atap (Solid / Transparan / Buka) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Struktur Atap & Kubah:
            </span>
            <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-[11px] font-medium">
              <button
                onClick={() => onUpdateConfig({ roofMode: 'solid' })}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  config.roofMode === 'solid'
                    ? 'bg-[#1B4332] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Utuh
              </button>
              <button
                onClick={() => onUpdateConfig({ roofMode: 'transparent' })}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  config.roofMode === 'transparent'
                    ? 'bg-[#1B4332] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Transparan
              </button>
              <button
                onClick={() => onUpdateConfig({ roofMode: 'hidden' })}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  config.roofMode === 'hidden'
                    ? 'bg-[#1B4332] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Buka
              </button>
            </div>
          </div>

          {/* Auto Rotate */}
          <button
            onClick={() => onUpdateConfig({ autoRotate: !config.autoRotate })}
            className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
              config.autoRotate 
                ? 'bg-[#1B4332] text-white border-[#1B4332] font-bold' 
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <RotateCw className={`w-4 h-4 ${config.autoRotate ? 'animate-spin' : ''}`} />
              <span>Putar Otomatis (360° Auto Rotate)</span>
            </div>
            <span className="text-[10px] uppercase font-bold">{config.autoRotate ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reset View */}
          <button
            onClick={() => {
              onResetView();
              setIsOpen(false);
            }}
            className="w-full py-2.5 bg-gray-100 hover:bg-[#1B4332] text-gray-700 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Posisi Kamera Awal</span>
          </button>
        </div>
      )}
    </>
  );
};



