import React from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  Building2, Eye, FileText, HeartHandshake,
  MapPin, Compass, Users, ArrowRight, AlertCircle
} from 'lucide-react';

interface HeroSectionProps {
  onLaunch3D: () => void;
  onOpenSimasDossier: () => void;
  onNavigateToInfaq: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunch3D,
  onOpenSimasDossier,
  onNavigateToInfaq
}) => {
  return (
    <section id="beranda" className="relative overflow-hidden bg-[#0F2A25] bg-gradient-to-b from-[#0F2A25] via-[#143E34] to-[#0F2A25] text-white pt-8 pb-12 sm:pt-14 sm:pb-20 lg:pt-18 lg:pb-24 border-b border-[#1E4D40]">
      
      {/* Decorative Islamic Background Pattern (Crisp and subtle, no hazy blur) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Centered Calligraphy / Bismillah */}
        <div className="text-center mb-4 sm:mb-6">
          <p className="font-serif text-lg sm:text-2xl md:text-3xl text-[#F3D063] tracking-widest font-bold drop-shadow-sm">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-emerald-100 font-sans block mt-1 font-medium">
            "Dengan Menyebut Nama Allah Yang Maha Pengasih Lagi Maha Penyayang"
          </span>
        </div>

        {/* Main Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Location & SIMAS Status Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-[#0A221C] text-emerald-100 border border-[#2D6A4F] shadow-md text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6">
            <MapPin className="w-3.5 h-3.5 text-[#F3D063] shrink-0" />
            <span>Desa Lero, Kec. Suppa, Pinrang (WITA)</span>
            <span className="hidden xs:inline text-emerald-400">•</span>
            <span className="text-[#F3D063] font-bold">Status SIMAS: Konfirmasi DKM</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight drop-shadow-md">
            Portal Informasi <span className="text-[#F3D063]">Masjid As-Safar</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-100 font-sans max-w-2xl mx-auto mt-3 sm:mt-5 leading-relaxed font-normal">
            Pusat peribadatan umat, syiar dakwah, dan fasilitas ibadah di Desa Lero, Kecamatan Suppa, 
            Kabupaten Pinrang, Sulawesi Selatan. Menghadirkan visualisasi rancangan arsitektur tropis modern 
            serta inventarisasi data persiapan pendaftaran resmi ke KUA dan Kementerian Agama.
          </p>

          {/* Call to Actions Button Group (Touch-friendly & Stacked on Mobile) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 mt-6 sm:mt-8 max-w-sm sm:max-w-none mx-auto w-full">
            <button
              onClick={onLaunch3D}
              className="min-h-[44px] px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-black rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95 border border-[#FFEAA7]/40"
            >
              <Eye className="w-4 h-4 shrink-0 text-[#0F2A25]" />
              <span>Jelajah Tur 3D Arsitektur</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-[#0F2A25]" />
            </button>

            <button
              onClick={onOpenSimasDossier}
              className="min-h-[44px] px-5 py-3 bg-[#133E33] hover:bg-[#1A4C40] text-white border border-[#2D6A4F] font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-[#D4AF37] active:scale-95"
            >
              <FileText className="w-4 h-4 text-[#F3D063] shrink-0" />
              <span>Draf Berkas Data SIMAS</span>
            </button>

            <button
              onClick={onNavigateToInfaq}
              className="min-h-[44px] px-5 py-3 bg-[#0F2A25] hover:bg-[#153D34] text-emerald-100 border border-[#2D6A4F] font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-[#F3D063] shrink-0" />
              <span>Infaq & Keuangan</span>
            </button>
          </div>

        </div>

        {/* 4 Statistics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 mt-8 sm:mt-14">
          
          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 shadow-md">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#143A31] flex items-center justify-center text-[#F3D063] shrink-0 border border-[#2D6A4F]/60">
              <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-2xl font-black text-white font-mono block leading-tight">
                {MASJID_SIMAS_DATA.luasBangunan} m²
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-200 uppercase tracking-wider font-semibold block truncate">
                Dimensi 3D (22m × 22m)
              </span>
            </div>
          </div>

          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 shadow-md">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#143A31] flex items-center justify-center text-[#F3D063] shrink-0 border border-[#2D6A4F]/60">
              <Users className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-2xl font-black text-white font-mono block leading-tight">
                ± {MASJID_SIMAS_DATA.kapasitasJamaah}
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-200 uppercase tracking-wider font-semibold block truncate">
                Estimasi Kapasitas
              </span>
            </div>
          </div>

          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 shadow-md">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#143A31] flex items-center justify-center text-[#F3D063] shrink-0 border border-[#2D6A4F]/60">
              <Compass className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-2xl font-black text-[#F3D063] font-mono block leading-tight">
                {MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-200 uppercase tracking-wider font-semibold block truncate">
                Estimasi Arah Kiblat
              </span>
            </div>
          </div>

          <div className="bg-[#0B211C] border border-[#1E4D40] rounded-2xl p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 shadow-md">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#143A31] flex items-center justify-center text-amber-300 shrink-0 border border-amber-600/40">
              <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-base font-black text-amber-200 font-sans block leading-tight truncate">
                Konfirmasi DKM
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-200 uppercase tracking-wider font-semibold block truncate">
                Status Legalitas
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
