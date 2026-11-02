import React, { useState, Suspense } from 'react';
import { MosqueConfig, CameraPreset } from '../types';
import { CanvasLoadingFallback } from './CanvasLoadingFallback';
import { 
  Maximize2, Camera, Compass, Sun, Moon, Sunset, 
  Layers, Eye, Sparkles, Check, Info, ShieldCheck
} from 'lucide-react';
import { capture3DScreenshot } from '../utils/screenshot';

const MosqueCanvas3D = React.lazy(() => import('./MosqueCanvas3D'));

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
    <section id="tur-3d" className="scroll-mt-24 sm:scroll-mt-28 py-10 sm:py-16 bg-[#0B201C] text-white relative border-b border-[#1E4D40]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10382E] text-emerald-200 text-[10px] sm:text-xs font-bold border border-emerald-600/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F3D063] shrink-0" />
              <span>VISUALISASI ARSITEKTUR DIGITAL 3D</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-black tracking-tight text-white drop-shadow-sm">
              Tur Virtual 3D Masjid As-Safar
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Eksplorasi bangunan arsitektur Masjid As-Safar secara interaktif 360°. Putar kamera, lihat interior mihrab, 
              denah saf jamaah, pintu kaca ayun, serta kubah geometris.
            </p>
          </div>

          {/* Fullscreen CTA Button */}
          <div className="flex items-center gap-2 pt-1 md:pt-0">
            <button
              onClick={onLaunchFullscreen}
              className="min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-black rounded-xl text-xs sm:text-sm shadow-xl transition-all cursor-pointer transform active:scale-95 border border-[#FFEAA7]/40"
            >
              <Maximize2 className="w-4 h-4 shrink-0 text-[#0F2A25]" />
              <span>Buka Mode Layar Penuh</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <div className="relative w-full h-[360px] xs:h-[420px] sm:h-[520px] md:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#2D6A4F] shadow-2xl bg-[#D8DEE4]">
          
          {/* Three.js Canvas */}
          <div className="w-full h-full">
            <Suspense fallback={<CanvasLoadingFallback />}>
              <MosqueCanvas3D
                hotspots={[]}
                config={config}
                isInterior={isInterior}
                selectedHotspotId={null}
                onSelectHotspot={() => {}}
                focusPosition={focusPosition}
              />
            </Suspense>
          </div>

          {/* Floating Canvas Top Bar Controls */}
          <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 flex items-center justify-between gap-2 pointer-events-none">
            {/* View Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto min-w-0">
              <span className="bg-[#0F2A25] text-[#F3D063] font-bold text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-[#2D6A4F] shadow-lg flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Model 3D Arsitektur</span>
              </span>
              <span className="hidden sm:inline bg-[#0B201C] text-slate-100 font-medium text-xs px-2.5 py-1.5 rounded-xl border border-[#2D6A4F]">
                {isInterior ? 'Mode Interior' : config.roofMode === 'hidden' ? 'Buka Atap (Cutaway)' : 'Mode Eksterior'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto shrink-0">
              <button
                onClick={handleCycleLighting}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0F2A25] hover:bg-[#1A4C40] text-white rounded-xl border border-[#2D6A4F] shadow-md flex items-center justify-center cursor-pointer active:scale-95"
                title="Ganti Pencahayaan (Siang/Sore/Malam)"
                aria-label="Ganti Pencahayaan"
              >
                {config.timeOfDay === 'day' ? <Sun className="w-4 h-4 text-amber-400" /> : config.timeOfDay === 'sunset' ? <Sunset className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
              </button>

              <button
                onClick={handleScreenshot}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0F2A25] hover:bg-[#1A4C40] text-white rounded-xl border border-[#2D6A4F] shadow-md flex items-center justify-center cursor-pointer active:scale-95"
                title="Ambil Foto Screenshot Arsitektur"
                aria-label="Ambil Screenshot"
              >
                <Camera className="w-4 h-4 text-[#F3D063]" />
              </button>

              <button
                onClick={onOpenSpecsModal}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0F2A25] hover:bg-[#1A4C40] text-white rounded-xl border border-[#2D6A4F] shadow-md flex items-center justify-center cursor-pointer active:scale-95"
                title="Spesifikasi Arsitektur Lengkap"
                aria-label="Info Spesifikasi"
              >
                <Info className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>

          {/* Floating Canvas Bottom Presets Bar */}
          <div className="absolute bottom-3 sm:bottom-4 inset-x-2 sm:inset-x-4 flex flex-wrap items-center justify-center pointer-events-none">
            <div className="bg-[#0F2A25] p-1 sm:p-1.5 rounded-2xl border border-[#2D6A4F] shadow-2xl flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 pointer-events-auto max-w-full">
              
              <button
                onClick={() => handleSelectPreset('exterior')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  !isInterior && config.roofMode === 'solid'
                    ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                    : 'text-slate-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Tampak Luar
              </button>

              <button
                onClick={() => handleSelectPreset('mihrab')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  isInterior
                    ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Mihrab
              </button>

              <button
                onClick={() => handleSelectPreset('topView')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  config.roofMode === 'hidden'
                    ? 'bg-[#D4AF37] text-[#0F2A25] shadow'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Buka Atap
              </button>

              <button
                onClick={() => handleSelectPreset('backDoor')}
                className="hidden xs:inline-block px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Pintu Masuk
              </button>

              <button
                onClick={onLaunchFullscreen}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 bg-[#0F2A25]/95 text-white border border-[#D4AF37] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200 z-30">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMsg}</span>
            </div>
          )}

        </div>

        {/* 3D Visualizer Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 text-xs text-slate-300">
          <div className="bg-white/5 rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Rotasi 360° Lembut</span>
            <span>Geser sentuh layar pada HP atau klik mouse untuk memutar kamera secara halus.</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Presisi Skala Arsitektur</span>
            <span>Bangunan 22m x 22m, mihrab marmer, pintu kaca ayun, dan menara luar.</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Kiblat Terverifikasi</span>
            <span>Orientasi kiblat 292.5° sesuai hisab rukyat wilayah Kecamatan Suppa.</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="font-bold text-white block mb-1">Ekspor Foto Ber-Watermark</span>
            <span>Unduh tangkapan layar beresolusi tinggi dengan stempel resmi Masjid As-Safar.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
