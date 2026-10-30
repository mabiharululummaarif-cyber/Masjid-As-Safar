import React from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  Building2, Eye, FileText, HeartHandshake, ShieldCheck, 
  MapPin, Compass, Users, Sparkles, ArrowRight
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
    <section id="beranda" className="relative overflow-hidden bg-gradient-to-b from-[#0F2A25] via-[#143E34] to-[#0F2A25] text-white pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-emerald-800/60">
      
      {/* Decorative Islamic Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Centered Calligraphy / Bismillah */}
        <div className="text-center mb-6">
          <p className="font-serif text-lg sm:text-2xl text-[#D4AF37] tracking-widest font-medium opacity-90">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <span className="text-[11px] uppercase tracking-widest text-emerald-200/70 font-sans block mt-1">
            "Dengan Menyebut Nama Allah Yang Maha Pengasih Lagi Maha Penyayang"
          </span>
        </div>

        {/* Main Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Official Verification Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-600/50 shadow-inner text-xs font-bold mb-6">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Terdata di Sistem Informasi Masjid (SIMAS) Kemenag RI • ID: {MASJID_SIMAS_DATA.idSimas}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
            Portal Resmi <span className="text-[#D4AF37]">Masjid As-Safar</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 font-sans max-w-3xl mx-auto mt-4 leading-relaxed">
            Pusat peribadatan umat, syiar dakwah, dan layanan musafir di kawasan terpadu. 
            Menghadirkan arsitektur tropis modern dengan transparansi tata kelola DKM yang akuntabel 
            serta fasilitas ibadah berstandar nasional Kementerian Agama Republik Indonesia.
          </p>

          {/* Call to Actions Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={onLaunch3D}
              className="px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-black rounded-2xl text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Eye className="w-4 h-4" />
              <span>Jelajah Tur 3D Arsitektur</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSimasDossier}
              className="px-6 py-3.5 bg-emerald-900/80 hover:bg-emerald-900 text-white border border-emerald-600/60 font-bold rounded-2xl text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:border-[#D4AF37]/50"
            >
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>Lembar Profil SIMAS Kemenag</span>
            </button>

            <button
              onClick={onNavigateToInfaq}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/10 font-bold rounded-2xl text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
              <span>Infaq & Sedekah</span>
            </button>
          </div>

        </div>

        {/* 4 Statistics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-14">
          
          <div className="bg-[#0B221E]/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-800/60 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                {MASJID_SIMAS_DATA.luasBangunan} m²
              </span>
              <span className="text-[11px] text-emerald-200/70 uppercase tracking-wider font-semibold">
                Luas Bangunan (22m × 22m)
              </span>
            </div>
          </div>

          <div className="bg-[#0B221E]/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-800/60 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                ± {MASJID_SIMAS_DATA.kapasitasJamaah}
              </span>
              <span className="text-[11px] text-emerald-200/70 uppercase tracking-wider font-semibold">
                Kapasitas Jamaah
              </span>
            </div>
          </div>

          <div className="bg-[#0B221E]/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-800/60 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-[#D4AF37] font-mono block">
                {MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°
              </span>
              <span className="text-[11px] text-emerald-200/70 uppercase tracking-wider font-semibold">
                Azimuth Arah Kiblat
              </span>
            </div>
          </div>

          <div className="bg-[#0B221E]/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-800/60 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">
                100%
              </span>
              <span className="text-[11px] text-emerald-200/70 uppercase tracking-wider font-semibold">
                Wakaf Bersertifikat
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
