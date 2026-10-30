import React from 'react';
import { MOSQUE_FACILITIES } from '../data/simasData';
import { 
  Building, Sparkles, CheckCircle2, Volume2, ShieldCheck, 
  DoorClosed, Droplets, BedDouble, QrCode, Compass
} from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const getFacilityIcon = (id: string) => {
    switch (id) {
      case 'f1': return <Building className="w-6 h-6 text-emerald-700" />;
      case 'f2': return <Sparkles className="w-6 h-6 text-[#D4AF37]" />;
      case 'f3': return <DoorClosed className="w-6 h-6 text-emerald-700" />;
      case 'f4': return <Droplets className="w-6 h-6 text-blue-600" />;
      case 'f5': return <BedDouble className="w-6 h-6 text-amber-600" />;
      case 'f6': return <Volume2 className="w-6 h-6 text-purple-600" />;
      case 'f7': return <Compass className="w-6 h-6 text-[#D4AF37]" />;
      case 'f8': return <QrCode className="w-6 h-6 text-emerald-800" />;
      default: return <Building className="w-6 h-6 text-emerald-700" />;
    }
  };

  return (
    <section id="fasilitas" className="py-16 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>STANDAR SARANA & PRASARANA BIMAS ISLAM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0F2A25] tracking-tight">
            Fasilitas & Sarana Ibadah
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Dikelola dengan pemeliharaan teratur oleh Bidang Ri'ayah DKM Masjid As-Safar demi kenyamanan 
            jamaah warga sekitar dan musafir yang singgah.
          </p>
        </div>

        {/* 8 Facilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOSQUE_FACILITIES.map((facility) => (
            <div 
              key={facility.id}
              className="bg-[#FAF8F5] rounded-2xl p-6 border border-slate-200/90 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Header Icon + Condition Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    {getFacilityIcon(facility.id)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{facility.condition}</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5 font-serif group-hover:text-emerald-900 transition-colors">
                  {facility.name}
                </h3>

                <p className="text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded mb-3">
                  {facility.spec}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {facility.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Terdata SIMAS Kemenag</span>
                <span className="font-semibold text-emerald-800">Siap Pakai</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
