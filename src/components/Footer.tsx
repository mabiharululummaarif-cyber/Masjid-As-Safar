import React from 'react';
import { MASJID_SIMAS_DATA } from '../data/simasData';
import { 
  Building2, ShieldCheck, Mail, Phone, MapPin, 
  Compass, ExternalLink, HeartHandshake, FileText, Share2
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
    <footer id="kontak" className="bg-[#081815] text-slate-300 pt-16 pb-8 border-t border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-emerald-950">
          
          {/* Col 1: Brand & SIMAS Badge (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-[#0F2A25] border border-[#D4AF37]/60 flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-white tracking-wider">
                  MASJID AS-SAFAR
                </h3>
                <p className="text-xs text-emerald-300 font-sans">
                  Masjid Jami' & Fasilitas Transit Musafir
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Pusat pembinaan ruhiyah, dakwah Islamiyah, dan pelayanan jamaah. 
              Tercatat dan terverifikasi secara resmi di Pangkalan Data Sistem Informasi Masjid (SIMAS) 
              Kementerian Agama Republik Indonesia.
            </p>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Terdata SIMAS Kemenag RI</span>
              </div>
              <p className="text-[11px] font-mono text-emerald-300">
                ID SIMAS: {MASJID_SIMAS_DATA.idSimas}
              </p>
              <p className="text-[10px] text-slate-400">
                SK DKM: {MASJID_SIMAS_DATA.nomorSkDkm}
              </p>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37]">
              Navigasi Halaman
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <button onClick={() => onNavigate('beranda')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  • Beranda Resmi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tur-3d')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  • Tur Virtual 3D & Mihrab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simas')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  • Profil & Legalitas SIMAS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jadwal')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  • Jadwal Sholat Kemenag
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fasilitas')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  • Fasilitas & Sarana Ibadah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dkm')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  • Pengurus DKM & Kajian
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('infaq')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  • Transparansi Kas & Infaq QRIS
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sekretariat & Kontak (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37]">
              Sekretariat DKM As-Safar
            </h4>
            <div className="text-xs space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {MASJID_SIMAS_DATA.alamatLengkap}, Kel. {MASJID_SIMAS_DATA.kelurahan}, Kec. {MASJID_SIMAS_DATA.kecamatan}, {MASJID_SIMAS_DATA.kabupatenKota}, {MASJID_SIMAS_DATA.provinsi} {MASJID_SIMAS_DATA.kodePos}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">
                  Koordinat: {MASJID_SIMAS_DATA.koordinat.lat}, {MASJID_SIMAS_DATA.koordinat.lng} (Azimuth {MASJID_SIMAS_DATA.koordinat.azimuthKiblat}°)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${MASJID_SIMAS_DATA.kontak.email}`} className="text-emerald-300 hover:underline">
                  {MASJID_SIMAS_DATA.kontak.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp DKM: {MASJID_SIMAS_DATA.kontak.telepon}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenSimasDossier}
                className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Format SIMAS Cetak</span>
              </button>

              <button
                onClick={onOpenShare}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Bagikan Website</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Legal Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} DKM Masjid As-Safar. Seluruh hak cipta dilindungi.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href="https://simas.kemenag.go.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Portal SIMAS Kemenag RI</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Standar Ditjen Bimas Islam</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
