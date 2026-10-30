import React from 'react';
import { Sparkles } from 'lucide-react';

interface CanvasLoadingFallbackProps {
  label?: string;
}

export const CanvasLoadingFallback: React.FC<CanvasLoadingFallbackProps> = ({
  label = 'Memuat Visualisasi 3D Masjid As-Safar...'
}) => {
  return (
    <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center bg-[#0B201C] bg-gradient-to-b from-[#0B201C] via-[#0F2A25] to-[#081815] text-white p-6 select-none">
      <div className="relative flex items-center justify-center mb-4">
        {/* Outer glowing pulsing ring */}
        <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/30 animate-ping absolute inset-0" />
        {/* Spinning border */}
        <div className="w-14 h-14 rounded-full border-2 border-emerald-800 border-t-[#D4AF37] animate-spin" />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#F3D063]" />
        </div>
      </div>

      <p className="font-serif font-bold text-sm sm:text-base text-amber-100 tracking-wide text-center">
        {label}
      </p>
      <p className="text-[11px] sm:text-xs text-slate-200 mt-1.5 text-center max-w-xs leading-relaxed font-normal">
        Menyiapkan modul grafis arsitektur 3D & pencahayaan digital Masjid As-Safar...
      </p>

      <div className="mt-4 px-3 py-1 rounded-full bg-[#0B211C] border border-[#2D6A4F] text-[10px] text-[#F3D063] font-semibold">
        Desa Lero, Suppa, Kab. Pinrang (WITA)
      </div>
    </div>
  );
};

export default CanvasLoadingFallback;
