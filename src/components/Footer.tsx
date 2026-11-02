import React from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  Building2, Mail, Phone, MapPin, 
  Compass, ExternalLink, FileText, Share2, AlertCircle
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenSimasDossier: () => void;
  onOpenShare: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSimasDossier,
  onOpenShare
}) => {
  return (
    <footer id="kontak" className="scroll-mt-24 sm:scroll-mt-28 bg-[#081815] text-slate-200 pt-10 sm:pt-16 pb-8 border-t border-[#1E4D40]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 sm:pb-12 border-b border-[#12362E]">
          
          {/* Col 1: Brand & SIMAS Status (5 cols) */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-[#0F2A25] border border-[#D4AF37]/60 flex items-center justify-center shadow-lg shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#F3D063]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-black text-base sm:text-lg text-white tracking-wider truncate drop-shadow-sm">
                  MASJID AS-SAFAR
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-300 font-sans truncate font-medium">
                  Desa Wiringtasi, Kec. Suppa, Kab. Pinrang • WITA (UTC+8)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Pusat pembinaan ruhiyah, dakwah Islamiyah, dan pelayanan jamaah di Jl. Poros TPI Ujung Labuang Lero B Wiringtasi, 
              Kecamatan Suppa, Kabupaten Pinrang, Sulawesi Selatan.
            </p>

            <div className="p-3 sm:p-3.5 rounded-xl bg-[#0B211C] border border-[#1E4D40] space-y-1 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Status SIMAS: Belum tersedia</span>
              </div>
              <p className="text-[11px] font-mono text-emerald-200 truncate">
                ID SIMAS: {MASJID_SIMAS_DATA.idSimas}
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                SK Pengurus: {MASJID_SIMAS_DATA.nomorSkDkm} ({MASJID_SIMAS_DATA.periodeKepengurusan})
              </p>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-white text-xs sm:text-sm uppercase tracking-wider text-[#F3D063]">
              Navigasi Halaman
            </h4>
            <ul className="text-xs space-y-1 sm:space-y-1.5">
              <li>
                <button onClick={() => onNavigate('beranda')} className="py-1 min-h-[36px] flex items-center text-slate-200 hover:text-[#F3D063] transition-colors cursor-pointer">
                  • Beranda Informasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tur-3d')} className="py-1 min-h-[36px] flex items-center text-slate-200 hover:text-[#F3D063] transition-colors cursor-pointer">
                  • Tur Virtual 3D & Mihrab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simas')} className="py-1 min-h-[36px] flex items-center text-slate-200 hover:text-[#F3D063] transition-colors cursor-pointer">
                  • Draf Profil SIMAS Kemenag
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jadwal')} className="py-1 min-h-[36px] flex items-center text-slate-200 hover:text-[#F3D063] transition-colors cursor-pointer">
                  • Jadwal Sholat (WITA)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fasilitas')} className="py-1 min-h-[36px] flex items-center text-slate-200 hover:text-[#F3D063] transition-colors cursor-pointer">
                  • Fasilitas & Sarana Ibadah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dkm')} className="py-1 min-h-[36px] flex items-center text-slate-200 hover:text-[#F3D063] transition-colors cursor-pointer">
                  • Pengurus Takmir & Agenda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('infaq')} className="py-1 min-h-[36px] flex items-center text-slate-200 hover:text-[#F3D063] transition-colors cursor-pointer">
                  • Keuangan & Saluran Infaq
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sekretariat & Kontak (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-white text-xs sm:text-sm uppercase tracking-wider text-[#F3D063]">
              Sekretariat & Lokasi
            </h4>
            <div className="text-xs space-y-2.5 text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {MASJID_SIMAS_DATA.alamatLengkap} {MASJID_SIMAS_DATA.kodePos}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Azimut Arah Kiblat: <strong>{MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°</strong> (Formulir SIMAS)
                </span>
              </div>

              {MASJID_SIMAS_DATA.kontak.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${MASJID_SIMAS_DATA.kontak.email}`} className="text-emerald-300 hover:underline truncate">
                    {MASJID_SIMAS_DATA.kontak.email}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-amber-200 text-[11px] font-medium truncate">Telepon Resmi: {MASJID_SIMAS_DATA.kontak.telepon}</span>
              </div>
            </div>

            {/* Action buttons with min touch target 44px */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onOpenSimasDossier}
                className="min-h-[44px] px-3.5 py-2.5 bg-[#133E33] hover:bg-[#1A4C40] text-emerald-100 border border-[#2D6A4F] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95 shadow-sm"
              >
                <FileText className="w-4 h-4 text-[#F3D063]" />
                <span>Format Draf SIMAS</span>
              </button>

              <button
                onClick={onOpenShare}
                className="min-h-[44px] px-3.5 py-2.5 bg-[#0B211C] hover:bg-[#143B31] text-white border border-[#2D6A4F] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95 shadow-sm"
              >
                <Share2 className="w-4 h-4 text-[#F3D063]" />
                <span>Bagikan Website</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Legal Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400">
          <div>
            <span>© {new Date().getFullYear()} DKM Masjid As-Safar, Desa Lero, Kec. Suppa, Kab. Pinrang.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px]">
            <a 
              href="https://simas.kemenag.go.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-300 hover:text-emerald-200 flex items-center gap-1 min-h-[36px]"
            >
              <span>Portal SIMAS Kemenag RI</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Zona Waktu: WITA (UTC+8)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
