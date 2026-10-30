import React, { useState } from 'react';
import { MosqueConfig, CameraPreset } from '../types';
import { MosqueCanvas3D } from './MosqueCanvas3D';
import { 
  Maximize2, Camera, Compass, Sun, Moon, Sunset, 
  Layers, Eye, Sparkles, Check, Info, ShieldCheck
} from 'lucide-react';
import { capture3DScreenshot } from '../utils/screenshot';

interface VirtualTourSectionProps {
  config: MosqueConfig;
  onUpdateConfig: (cfg: Partial<MosqueConfig>) => void;
  onLaunchFullscreen: () => void;
  onOpenSpecsModal: () => void;
}

export const VirtualTourSection: React.FC<VirtualTourSectionProps> = ({
  config,
  onUpdateConfig,
  onLaunchFullscreen,
  onOpenSpecsModal
}) => {
  const [isInterior, setIsInterior] = useState(false);
  const [focusPosition, setFocusPosition] = useState<[number, number, number] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectPreset = (preset: CameraPreset) => {
    switch (preset) {
      case 'mihrab':
        setIsInterior(true);
        onUpdateConfig({ roofMode: 'solid' });
        setFocusPosition([0, 1.6, 6.5]);
        break;
      case 'exterior':
        setIsInterior(false);
        onUpdateConfig({ roofMode: 'solid' });
        setFocusPosition([0, 2.5, 0]);
        break;
      case 'interior':
        setIsInterior(true);
        onUpdateConfig({ roofMode: 'solid' });
        setFocusPosition([0, 1.5, 0.5]);
        break;
      case 'topView':
        setIsInterior(false);
        onUpdateConfig({ roofMode: 'hidden' });
        setFocusPosition([0, 28, 0.1]);
        break;
      case 'backDoor':
        setIsInterior(true);
        onUpdateConfig({ roofMode: 'solid' });
        setFocusPosition([0, 1.6, -7.0]);
        break;
    }
  };

  const handleToggleRoof = () => {
    const nextMode = config.roofMode === 'solid' ? 'hidden' : 'solid';
    onUpdateConfig({ roofMode: nextMode });
    if (nextMode === 'hidden') {
      setIsInterior(false);
    }
  };

  const handleCycleLighting = () => {
    const next = config.timeOfDay === 'day' ? 'sunset' : config.timeOfDay === 'sunset' ? 'night' : 'day';
    onUpdateConfig({ timeOfDay: next });
  };

  const handleScreenshot = async () => {
    const res = await capture3DScreenshot();
    if (res.success) {
      setToastMsg('Foto arsitektur 3D berhasil disimpan!');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <section id="tur-3d" className="py-16 bg-[#0B201C] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-bold border border-emerald-700/80 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>VISUALISASI ARSITEKTUR DIGITAL 3D</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
              Tur Virtual 3D Masjid As-Safar
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Eksplorasi bangunan arsitektur Masjid As-Safar secara interaktif 360°. Putar kamera, lihat interior mihrab, 
              denah saf jamaah, pintu kaca ayun, serta kubah geometris.
            </p>
          </div>

          {/* Fullscreen CTA Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchFullscreen}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-black rounded-xl text-xs sm:text-sm shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Buka Mode Layar Penuh</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden border-2 border-emerald-700/50 shadow-2xl bg-[#D8DEE4]">
          
          {/* Three.js Canvas */}
          <div className="w-full h-full">
            <MosqueCanvas3D
              hotspots={[]}
              config={config}
              isInterior={isInterior}
              selectedHotspotId={null}
              onSelectHotspot={() => {}}
              focusPosition={focusPosition}
            />
          </div>

          {/* Floating Canvas Top Bar Controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 pointer-events-none">
            {/* View Badges */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="bg-[#0F2A25]/90 backdrop-blur-md text-[#D4AF37] font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-lg flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Model Terverifikasi SIMAS</span>
              </span>
              <span className="hidden sm:inline bg-black/50 backdrop-blur-md text-slate-200 text-xs px-2.5 py-1.5 rounded-xl border border-white/10">
                {isInterior ? 'Mode Interior' : config.roofMode === 'hidden' ? 'Buka Atap (Cutaway)' : 'Mode Eksterior'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={handleCycleLighting}
                className="p-2 bg-[#0F2A25]/90 hover:bg-[#1B4332] text-white rounded-xl border border-emerald-700/60 shadow-md text-xs flex items-center gap-1 cursor-pointer"
                title="Ganti Pencahayaan (Siang/Sore/Malam)"
              >
                {config.timeOfDay === 'day' ? <Sun className="w-4 h-4 text-amber-400" /> : config.timeOfDay === 'sunset' ? <Sunset className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
              </button>

              <button
                onClick={handleScreenshot}
                className="p-2 bg-[#0F2A25]/90 hover:bg-[#1B4332] text-white rounded-xl border border-emerald-700/60 shadow-md text-xs flex items-center gap-1 cursor-pointer"
                title="Ambil Foto Screenshot Arsitektur"
              >
                <Camera className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <button
                onClick={onOpenSpecsModal}
                className="p-2 bg-[#0F2A25]/90 hover:bg-[#1B4332] text-white rounded-xl border border-emerald-700/60 shadow-md text-xs flex items-center gap-1 cursor-pointer"
                title="Spesifikasi Arsitektur Lengkap"
              >
                <Info className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Floating Canvas Bottom Presets Bar */}
          <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-center gap-2 pointer-events-none">
            <div className="bg-[#0F2A25]/90 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-700/60 shadow-2xl flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto">
              
              <button
                onClick={() => handleSelectPreset('exterior')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isInterior && config.roofMode === 'solid'
                    ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Tampak Luar
              </button>

              <button
                onClick={() => handleSelectPreset('mihrab')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isInterior
                    ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Interior Mihrab
              </button>

              <button
                onClick={() => handleSelectPreset('topView')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  config.roofMode === 'hidden'
                    ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Buka Atap (Saf Sholat)
              </button>

              <button
                onClick={() => handleSelectPreset('backDoor')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Pintu Kaca Masuk
              </button>

              <button
                onClick={onLaunchFullscreen}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#0F2A25]/95 text-white border border-[#D4AF37] px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200 z-30">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMsg}</span>
            </div>
          )}

        </div>

        {/* 3D Visualizer Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs text-slate-300">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Rotasi 360° Lembut</span>
            <span>Geser klik mouse / sentuh layar untuk memutar kamera secara halus tanpa lag.</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Presisi Skala Arsitektur</span>
            <span>Bangunan 22m x 22m, mihrab marmer, pintu kaca ayun, dan menara luar.</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Kiblat Terverifikasi</span>
            <span>Orientasi kiblat 295° sesuai hisab rukyat Kementerian Agama RI.</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Ekspor Gambar Ber-Watermark</span>
            <span>Unduh tangkapan layar beresolusi tinggi dengan stempel resmi Masjid As-Safar.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
