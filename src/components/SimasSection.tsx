import React, { useState } from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  ShieldCheck, FileText, Copy, Check, 
  Building, Landmark, ScrollText, AlertCircle
} from 'lucide-react';

interface SimasSectionProps {
  onOpenDossier: () => void;
}

export const SimasSection: React.FC<SimasSectionProps> = ({ onOpenDossier }) => {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    const textToCopy = MASJID_SIMAS_DATA.idSimas === 'Belum Dikonfirmasi'
      ? `Masjid As-Safar, Desa Lero, Kec. Suppa, Kab. Pinrang, Sulawesi Selatan (Status SIMAS: Belum Dikonfirmasi DKM)`
      : MASJID_SIMAS_DATA.idSimas;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <section id="simas" className="py-10 sm:py-16 bg-[#FAF8F5] text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0F2A25] text-[10px] sm:text-xs font-bold border border-emerald-300 mb-2 sm:mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>STANDAR DATA SISTEM INFORMASI MASJID (SIMAS)</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-black text-[#0F2A25] tracking-tight">
            Profil & Inventarisasi Legalitas SIMAS
          </h2>
          <p className="text-slate-700 text-xs sm:text-base mt-2 leading-relaxed font-normal">
            Inventarisasi data administratif Masjid As-Safar (Desa Lero, Kec. Suppa, Kab. Pinrang) untuk 
            persiapan koordinasi dan pencatatan resmi di KUA Kecamatan Suppa dan Kementerian Agama Kabupaten Pinrang.
          </p>
        </div>

        {/* Highlight Card: SIMAS National Registration Status */}
        <div className="bg-[#0F2A25] bg-gradient-to-r from-[#0F2A25] to-[#18463C] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl mb-8 sm:mb-10 border-2 border-[#2D6A4F]">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6">
            
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-[#143B33] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
                <Landmark className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#F3D063]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-amber-200 block">
                  Status ID SIMAS Nasional
                </span>
                <h3 className="text-xl sm:text-3xl font-mono font-black text-[#F3D063] tracking-wider mt-0.5 truncate drop-shadow-sm">
                  {MASJID_SIMAS_DATA.idSimas}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 text-[11px] sm:text-xs text-slate-100">
                  <span className="inline-flex items-center gap-1 bg-[#0A221C] text-amber-200 px-2.5 py-1 rounded-full font-bold border border-amber-500/50 text-[10px] sm:text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Menunggu Konfirmasi DKM / KUA Kec. Suppa</span>
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="hidden sm:inline text-slate-100">Tipologi: <strong className="text-white">{MASJID_SIMAS_DATA.tipologi}</strong></span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto pt-2 lg:pt-0">
              <button
                onClick={handleCopyId}
                className="min-h-[44px] px-4 py-2.5 bg-[#143B33] hover:bg-[#1A4C40] border border-[#2D6A4F] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-[#F3D063]" />}
                <span>{copiedId ? 'Keterangan Disalin!' : 'Salin Info Status'}</span>
              </button>

              <button
                onClick={onOpenDossier}
                className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#e4c254] hover:from-[#c29e2e] hover:to-[#d4af37] text-[#0F2A25] font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 border border-[#FFEAA7]/40"
              >
                <FileText className="w-4 h-4 shrink-0 text-[#0F2A25]" />
                <span>Lihat Draf Berkas SIMAS</span>
              </button>
            </div>

          </div>
        </div>

        {/* 4 Core Pillars of Data Inventarisasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          
          {/* Card 1: Tipologi & Bangunan */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3 sm:mb-4 border border-emerald-300">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              Tipologi & Bangunan
            </h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Tipologi:</span>
                <span className="font-bold text-slate-900 text-right">Masjid Jami' (Draf)</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Luas Bangunan:</span>
                <span className="font-bold text-slate-900">484 m² (Model 3D)</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Luas Tanah:</span>
                <span className="font-bold text-amber-800">Perlu Konfirmasi</span>
              </li>
              <li className="flex justify-between">
                <span>Estimasi Kapasitas:</span>
                <span className="font-bold text-emerald-900">± 350 Jamaah (Model 3D)</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Legalitas Wakaf */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 sm:mb-4 border border-amber-300">
              <ScrollText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              Status Tanah & Wakaf
            </h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Status Tanah:</span>
                <span className="font-bold text-amber-800">Menunggu Bukti</span>
              </li>
              <li className="flex flex-col border-b border-slate-100 pb-1.5">
                <span className="text-[10px] text-slate-500">No. Sertifikat Wakaf:</span>
                <span className="font-mono font-bold text-slate-800 text-[11px] truncate">
                  Belum Dikonfirmasi
                </span>
              </li>
              <li className="flex flex-col border-b border-slate-100 pb-1.5">
                <span className="text-[10px] text-slate-500">Akta Ikrar Wakaf (AIW):</span>
                <span className="font-mono font-bold text-slate-800 text-[11px] truncate">
                  Belum Dikonfirmasi
                </span>
              </li>
              <li className="flex justify-between">
                <span>Status Nadzir:</span>
                <span className="font-bold text-slate-800">DKM Masjid As-Safar</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Legalitas DKM & SK */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3 sm:mb-4 border border-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              Legalitas & SK DKM
            </h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>SK DKM KUA:</span>
                <span className="font-bold text-amber-800">Menunggu Rilis</span>
              </li>
              <li className="flex flex-col border-b border-slate-100 pb-1.5">
                <span className="text-[10px] text-slate-500">Penerbit SK:</span>
                <span className="font-bold text-slate-900 text-[11px]">
                  KUA Kec. Suppa
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Tahun Berdiri:</span>
                <span className="font-bold text-slate-900">{MASJID_SIMAS_DATA.tahunBerdiri}</span>
              </li>
              <li className="flex justify-between">
                <span>Rekomendasi SIMAS:</span>
                <span className="font-bold text-amber-800">Draf Persiapan</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Geografis & Wilayah */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-3 sm:mb-4 border border-blue-300">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
              Wilayah Administratif
            </h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Desa / Kelurahan:</span>
                <span className="font-bold text-slate-900">Desa Lero</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Kecamatan:</span>
                <span className="font-bold text-slate-900">Suppa</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Kabupaten:</span>
                <span className="font-bold text-slate-900">Pinrang</span>
              </li>
              <li className="flex justify-between">
                <span>Zona Waktu:</span>
                <span className="font-bold text-slate-900">WITA (UTC+8)</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
