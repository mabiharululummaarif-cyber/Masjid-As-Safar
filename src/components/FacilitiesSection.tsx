import React from 'react';
import { MOSQUE_FACILITIES } from '../data/simasData';
import { 
  Building, Sparkles, CheckCircle2, Volume2, ShieldCheck, 
  DoorClosed, Droplets, BedDouble, QrCode, Compass
} from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const getFacilityIcon = (id: string) => {
    switch (id) {
      case 'f1': return <Building className="w-6 h-6 text-emerald-800" />;
      case 'f2': return <Sparkles className="w-6 h-6 text-[#D4AF37]" />;
      case 'f3': return <DoorClosed className="w-6 h-6 text-emerald-800" />;
      case 'f4': return <Droplets className="w-6 h-6 text-blue-700" />;
      case 'f5': return <BedDouble className="w-6 h-6 text-amber-700" />;
      case 'f6': return <Volume2 className="w-6 h-6 text-purple-700" />;
      case 'f7': return <Compass className="w-6 h-6 text-[#D4AF37]" />;
      case 'f8': return <QrCode className="w-6 h-6 text-emerald-800" />;
      default: return <Building className="w-6 h-6 text-emerald-800" />;
    }
  };

  return (
    <section id="fasilitas" className="scroll-mt-24 sm:scroll-mt-28 py-10 sm:py-16 bg-[#FAF8F5] text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0F2A25] text-[10px] sm:text-xs font-bold border border-emerald-300 mb-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>SARANA & PRASARANA IBADAH</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-black text-[#0F2A25] tracking-tight">
            Fasilitas & Sarana Masjid
          </h2>
          <p className="text-slate-700 text-xs sm:text-base mt-2 leading-relaxed font-normal">
            Rancangan fasilitas dan sarana ibadah Masjid As-Safar demi kenyamanan 
            jamaah warga Desa Lero serta musafir yang singgah di koridor Kecamatan Suppa.
          </p>
        </div>

        {/* 8 Facilities Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {MOSQUE_FACILITIES.map((facility) => (
            <div 
              key={facility.id}
              className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Header Icon + Condition Status */}
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                    {getFacilityIcon(facility.id)}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{facility.condition}</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 font-serif group-hover:text-emerald-900 transition-colors">
                  {facility.name}
                </h3>

                <p className="text-[11px] sm:text-xs font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-lg mb-2 sm:mb-3">
                  {facility.spec}
                </p>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {facility.desc}
                </p>
              </div>

              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>Masjid As-Safar</span>
                <span className="font-bold text-emerald-900">Desa Lero</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
