import React from 'react';
import { X, CheckCircle2, Compass, Users, Maximize2, ShieldCheck, Sparkles, Building2, MapPin, AlertCircle } from 'lucide-react';
import { MASJID_SIMAS_DATA } from '../data/simasData';

interface MosqueInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShare?: () => void;
}

export const MosqueInfoModal: React.FC<MosqueInfoModalProps> = ({
  isOpen,
  onClose,
  onOpenShare,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Emerald Gradient */}
        <div className="bg-gradient-to-r from-[#0F2A25] via-[#1B4332] to-[#2D6A4F] text-white p-4 sm:p-5 relative border-b-2 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center text-lg sm:text-xl shadow-inner shrink-0">
                🏛️
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-lg text-[#FFEAA7] tracking-wide font-serif truncate">
                  Spesifikasi Arsitektur 3D
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 truncate">
                  Masjid As-Safar • Desa Lero, Kec. Suppa, Pinrang
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4 text-gray-800 text-xs">
          {/* SIMAS Status Badge */}
          <div className="p-3 bg-emerald-900/95 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 border border-emerald-600/60 shadow-sm">
            <div className="flex items-start sm:items-center gap-2.5">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                  Lokasi & Registrasi
                </span>
                <span className="font-sans text-xs text-white font-medium block">
                  Desa Lero, Kec. Suppa, Kab. Pinrang (WITA)
                </span>
                <span className="text-[10px] text-amber-300 font-mono block">
                  Status SIMAS: {MASJID_SIMAS_DATA.idSimas}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
              Draf Model 3D
            </span>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Kapasitas Saf</span>
              <span className="text-lg font-black text-[#1B4332]">±350</span>
              <span className="text-[10px] text-gray-500 block">Estimasi Jamaah</span>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Luas Bangunan</span>
              <span className="text-lg font-black text-amber-900">484 m²</span>
              <span className="text-[10px] text-gray-500 block">Dimensi 22m × 22m</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Tinggi Kubah</span>
              <span className="text-lg font-black text-[#1B4332]">14 m</span>
              <span className="text-[10px] text-gray-500 block">Dari Permukaan Lantai</span>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Arah Kiblat</span>
              <span className="text-lg font-black text-amber-900">292.5°</span>
              <span className="text-[10px] text-gray-500 block">Estimasi Kec. Suppa</span>
            </div>
          </div>

          {/* Section: Architectural Elements */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-[#1B4332] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Elemen Desain & Struktur Utama 3D</span>
            </h4>

            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">Kubah Bertingkat Hijau Zamrud & Mahkota Sabit Emas</span>
                  <span className="text-gray-600 text-[11px] leading-relaxed">
                    Kubah geometris bertingkat dengan aksen panel vertikal, dirancang adaptif terhadap iklim tropis pesisir Suppa untuk ventilasi pelepasan udara panas.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">Mihrab Marmer Geometris & Mimbar Kayu Jati</span>
                  <span className="text-gray-600 text-[11px] leading-relaxed">
                    Pusat kiblat diperkuat relung marmer putih gading dengan kaligrafi relief emas dan pencahayaan aksen tersembunyi yang khusyuk.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">16 Pintu Kaca Ayun 2 Arah (Sirkulasi Terbuka)</span>
                  <span className="text-gray-600 text-[11px] leading-relaxed">
                    Fasad sekeliling masjid dilengkapi pintu kaca tempered transparan berbingkai kuningan yang fleksibel dibuka untuk sirkulasi jamaah ke serambi luar.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">Lantai Marmer & Saf Sajadah Hijau Zamrud</span>
                  <span className="text-gray-600 text-[11px] leading-relaxed">
                    Lantai marmer dingin dengan hamparan karpet sajadah saf berpola geometris Islami dan penanda arah sholat yang rapi.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guidance */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-[#1B4332] space-y-1">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Petunjuk Eksplorasi 3D</span>
            </span>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              • <b>Geser / Drag:</b> Memutar sudut pandang 360° mengelilingi bangunan.<br/>
              • <b>Scroll / Pinch:</b> Zoom mendekat atau menjauh.<br/>
              • <b>Tombol Tampak Dalam:</b> Masuk langsung ke ruang sholat utama di depan mihrab.<br/>
              • <b>Tombol Buka Atap:</b> Melihat denah pemotongan atas (cutaway) kapasitas saf dan penataan kolom.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (onOpenShare) onOpenShare();
            }}
            className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#153427] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>🔗 Bagikan Rancangan</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
