import React, { useState } from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  ShieldCheck, FileText, CheckCircle2, Copy, Check, 
  ExternalLink, MapPin, Building, Award, Landmark, ScrollText, Compass
} from 'lucide-react';

interface SimasSectionProps {
  onOpenDossier: () => void;
}

export const SimasSection: React.FC<SimasSectionProps> = ({ onOpenDossier }) => {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(MASJID_SIMAS_DATA.idSimas);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <section id="simas" className="py-16 bg-[#FAF8F5] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>KEMENTERIAN AGAMA REPUBLIK INDONESIA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0F2A25] tracking-tight">
            Profil & Legalitas SIMAS Kemenag
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Data resmi Masjid As-Safar yang telah diverifikasi dan tercatat dalam Sistem Informasi Masjid (SIMAS) 
            Direktorat Jenderal Bimbingan Masyarakat Islam Kementerian Agama RI.
          </p>
        </div>

        {/* Highlight Card: SIMAS National Registration */}
        <div className="bg-gradient-to-r from-[#0F2A25] to-[#18463C] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 border border-emerald-700/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                <Landmark className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-300">
                  ID SIMAS Nasional Kemenag RI
                </span>
                <h3 className="text-2xl sm:text-3xl font-mono font-black text-[#D4AF37] tracking-wider mt-0.5">
                  {MASJID_SIMAS_DATA.idSimas}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-emerald-100">
                  <span className="inline-flex items-center gap-1 bg-emerald-800/80 px-2.5 py-0.5 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Terverifikasi KUA
                  </span>
                  <span>•</span>
                  <span>Tipologi: <strong>{MASJID_SIMAS_DATA.tipologi}</strong></span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={handleCopyId}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-emerald-400/30 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
                <span>{copiedId ? 'ID Berhasil Disalin!' : 'Salin Nomor ID'}</span>
              </button>

              <button
                onClick={onOpenDossier}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Lihat Dokumen SIMAS</span>
              </button>
            </div>

          </div>
        </div>

        {/* 4 Core Pillars of SIMAS Kemenag */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Tipologi & Kapasitas */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              Tipologi & Bangunan
            </h4>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Tipologi:</span>
                <span className="font-semibold text-slate-800 text-right">Masjid Jami' / Publik</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Luas Bangunan:</span>
                <span className="font-semibold text-slate-800">484 m² (22m × 22m)</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Luas Tanah:</span>
                <span className="font-semibold text-slate-800">1.250 m²</span>
              </li>
              <li className="flex justify-between">
                <span>Kapasitas:</span>
                <span className="font-semibold text-emerald-800">± 350 Jamaah</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Legalitas Wakaf */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <ScrollText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              Legalitas Tanah Wakaf
            </h4>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Status:</span>
                <span className="font-bold text-emerald-700">Wakaf Bersertifikat</span>
              </li>
              <li className="flex flex-col border-b border-slate-100 pb-1.5">
                <span className="text-[10px] text-slate-400">No. Sertifikat Wakaf:</span>
                <span className="font-mono font-semibold text-slate-800 text-[11px] truncate">
                  {MASJID_SIMAS_DATA.nomorSertifikatWakaf}
                </span>
              </li>
              <li className="flex flex-col border-b border-slate-100 pb-1.5">
                <span className="text-[10px] text-slate-400">Akta Ikrar Wakaf (AIW):</span>
                <span className="font-mono font-semibold text-slate-800 text-[11px] truncate">
                  {MASJID_SIMAS_DATA.nomorAIW}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Nadzir:</span>
                <span className="font-semibold text-slate-800">BWI / DKM Resmi</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Geospasial & Kiblat */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              Arah Kiblat & Geospasial
            </h4>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Azimuth Kiblat:</span>
                <span className="font-bold text-emerald-700">295° 12' Barat Laut</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Pengukur:</span>
                <span className="font-semibold text-slate-800">BHR Kemenag RI</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Latitude:</span>
                <span className="font-mono font-semibold text-slate-800">{MASJID_SIMAS_DATA.koordinat.lat}</span>
              </li>
              <li className="flex justify-between">
                <span>Longitude:</span>
                <span className="font-mono font-semibold text-slate-800">{MASJID_SIMAS_DATA.koordinat.lng}</span>
              </li>
            </ul>
          </div>

          {/* Card 4: SK DKM Resmi */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              SK Pengukuhan DKM
            </h4>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex flex-col border-b border-slate-100 pb-1.5">
                <span className="text-[10px] text-slate-400">Nomor SK KUA:</span>
                <span className="font-mono font-semibold text-slate-800 text-[11px] truncate">
                  {MASJID_SIMAS_DATA.nomorSkDkm}
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Masa Bakti:</span>
                <span className="font-semibold text-slate-800">2024 - 2027</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Penerbit SK:</span>
                <span className="font-semibold text-slate-800">KUA Kemenag</span>
              </li>
              <li className="flex justify-between">
                <span>Ketua DKM:</span>
                <span className="font-semibold text-slate-800">H. M. Ridwan, S.T.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Note / Accreditation footer */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-950">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              <strong>Pangkalan Data Nasional:</strong> Seluruh dokumen fisik dan sertifikat asli tersimpan di arsip Sekretariat DKM Masjid As-Safar dan tercatat pada Kantor Urusan Agama (KUA) setempat.
            </span>
          </div>

          <a 
            href="https://simas.kemenag.go.id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors shrink-0"
          >
            <span>Kunjungi SIMAS Kemenag Pusat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
